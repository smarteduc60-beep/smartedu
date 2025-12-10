'use client';

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart2, BookCheck, Link as LinkIcon, PlayCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    completedLessons: 0,
    totalSubmissions: 0,
    averageScore: 0,
    pendingExercises: 0,
  });
  const [loading, setLoading] = useState(true);
  const [teacherCode, setTeacherCode] = useState('');
  const [teachers, setTeachers] = useState<any[]>([]);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchStudentStats();
      fetchTeachers();
    }
  }, [session]);

  const fetchStudentStats = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/students/stats');
      const result = await response.json();
      
      if (result.success && result.data?.stats) {
        setStats(result.data.stats);
      }
    } catch (error) {
      console.error('Error fetching student stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await fetch('/api/students/teachers');
      const result = await response.json();
      if (result.success) {
        setTeachers(result.data?.teachers || []);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session?.user) {
    return <div>لم يتم العثور على الطالب.</div>;
  }

  const handleConnectTeacher = async () => {
    if (!teacherCode.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال كود الأستاذ",
        variant: "destructive",
      });
      return;
    }

    setConnecting(true);
    try {
      const response = await fetch('/api/students/connect-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherCode: teacherCode.trim() }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "تم الربط بنجاح",
          description: `تم ربطك بالأستاذ ${result.data.teacher.name}`,
        });
        setTeacherCode('');
        fetchTeachers();
      } else {
        toast({
          title: "فشل الربط",
          description: result.error || "كود الأستاذ غير صحيح",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الربط",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnectTeacher = async (teacherId: string) => {
    if (!confirm('هل أنت متأكد من فك الارتباط بهذا الأستاذ؟')) return;

    try {
      const response = await fetch(`/api/students/connect-teacher?teacherId=${teacherId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "تم فك الارتباط",
          description: "تم فك ارتباطك بالأستاذ بنجاح",
        });
        fetchTeachers();
      } else {
        toast({
          title: "فشل فك الارتباط",
          description: result.error || "حدث خطأ",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء فك الارتباط",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="grid gap-1">
            <h1 className="text-3xl font-bold tracking-tight">
                أهلاً بك مجدداً، {session.user.name}!
            </h1>
            <p className="text-muted-foreground">
                لنواصل رحلتنا التعليمية ونحقق المزيد من التقدم.
            </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الدروس المكتملة</CardTitle>
            <BookCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedLessons}</div>
            <p className="text-xs text-muted-foreground">من أصل دروسك</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">التمارين المحلولة</CardTitle>
            <PlayCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
            <p className="text-xs text-muted-foreground">إجابات مرسلة</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط الدرجات</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">من 100%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تمارين قيد الانتظار</CardTitle>
            <BookCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingExercises}</div>
            <p className="text-xs text-muted-foreground">لم يتم حلها</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="text-primary" />
              <span>ربط أستاذ جديد</span>
            </CardTitle>
            <CardDescription>
              أدخل كود الأستاذ الخاص بك للوصول إلى دروسه وتماريه.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Input 
                id="teacher-code" 
                placeholder="أدخل كود الأستاذ هنا" 
                value={teacherCode}
                onChange={(e) => setTeacherCode(e.target.value.toUpperCase())}
                disabled={connecting}
              />
              <Button onClick={handleConnectTeacher} disabled={connecting}>
                {connecting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                ربط
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookCheck className="text-primary" />
              <span>الأساتذة المرتبطون</span>
            </CardTitle>
            <CardDescription>
              قائمة الأساتذة الذين أنت مرتبط بهم حالياً.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {teachers.length > 0 ? (
              <div className="space-y-3">
                {teachers.map((teacher) => (
                  <div key={teacher.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={teacher.image} alt={teacher.name} />
                        <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{teacher.name}</p>
                        <p className="text-xs text-muted-foreground">{teacher.subject?.name || 'غير محدد'}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDisconnectTeacher(teacher.id)}
                    >
                      فك الارتباط
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                لم تقم بالربط بأي أستاذ بعد
              </p>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
