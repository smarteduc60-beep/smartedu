'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, Link as LinkIcon, UserMinus, Users, Loader2, UserCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";


const StudentProfile = () => {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [teacherCode, setTeacherCode] = useState('');
  const [teachers, setTeachers] = useState<any[]>([]);
  const [parentCode, setParentCode] = useState('');
  const [parents, setParents] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchTeachers();
    fetchParents();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      const result = await response.json();
      if (result.success) {
        const user = result.data.user;
        setFormData({
          prenom: user.firstName || '',
          nom: user.lastName || '',
          email: user.email || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await fetch('/api/students/teachers');
      const result = await response.json();
      if (result.success) {
        setTeachers(result.data.teachers);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const fetchParents = async () => {
    try {
      const response = await fetch('/api/students/parents');
      const result = await response.json();
      if (result.success) {
        setParents(result.data.parents);
      }
    } catch (error) {
      console.error('Error fetching parents:', error);
    }
  };

  const handleConnectTeacher = async () => {
    if (!teacherCode.trim()) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال كود المعلم',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/students/connect-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherCode: teacherCode.trim() }),
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: 'تم الربط بنجاح',
          description: 'تم ربط حسابك بالمعلم',
        });
        setTeacherCode('');
        fetchTeachers();
      } else {
        toast({
          title: 'خطأ',
          description: result.error || 'فشل الربط بالمعلم',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء الربط',
        variant: 'destructive',
      });
    }
  };

  const handleDisconnectTeacher = async (teacherId: number) => {
    try {
      const response = await fetch('/api/students/connect-teacher', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId }),
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: 'تم إلغاء الربط',
          description: 'تم إلغاء الربط بالمعلم بنجاح',
        });
        fetchTeachers();
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إلغاء الربط',
        variant: 'destructive',
      });
    }
  };

  const handleConnectParent = async () => {
    if (!parentCode.trim()) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال كود ولي الأمر',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/students/connect-parent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentCode: parentCode.trim() }),
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: 'تم الربط بنجاح',
          description: 'تم ربط حسابك بولي الأمر',
        });
        setParentCode('');
        fetchParents();
      } else {
        toast({
          title: 'خطأ',
          description: result.error || 'فشل الربط بولي الأمر',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء الربط',
        variant: 'destructive',
      });
    }
  };

  const handleDisconnectParent = async (parentId: number) => {
    try {
      const response = await fetch('/api/students/connect-parent', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentId }),
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: 'تم إلغاء الربط',
          description: 'تم إلغاء الربط بولي الأمر بنجاح',
        });
        fetchParents();
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إلغاء الربط',
        variant: 'destructive',
      });
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: 'تم الحفظ',
          description: 'تم تحديث معلومات الملف الشخصي',
        });
      } else {
        toast({
          title: 'خطأ',
          description: result.error || 'فشل حفظ التغييرات',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء الحفظ',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const userName = `${formData.prenom} ${formData.nom}`;
  const userInitial = formData.prenom.charAt(0) || 'S';

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>المعلومات الشخصية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={session?.user?.image || ''} alt={userName} />
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
            <Button variant="outline">تغيير الصورة</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="student-prenom">الاسم الأول</Label>
              <Input 
                id="student-prenom" 
                value={formData.prenom}
                onChange={(e) => setFormData({...formData, prenom: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-nom">الاسم الأخير</Label>
              <Input 
                id="student-nom" 
                value={formData.nom}
                onChange={(e) => setFormData({...formData, nom: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="student-email">البريد الإلكتروني</Label>
            <Input 
              id="student-email" 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveProfile}>
              <Save className="ml-2 h-4 w-4" />
              <span>حفظ التغييرات</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <LinkIcon className="text-primary" />
                <span>الربط بحساب المعلم</span>
            </CardTitle>
            <CardDescription>
                أدخل كود المعلم لربط حسابك ومشاركة تقدمك معه.
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-2">
                  <Input 
                    id="teacher-code" 
                    placeholder="أدخل كود المعلم هنا..."
                    value={teacherCode}
                    onChange={(e) => setTeacherCode(e.target.value)}
                  />
                  <Button onClick={handleConnectTeacher}>ربط الحساب</Button>
                </div>
                
                <div className="space-y-4">
                    <Label className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-5 w-5" />
                        <span>المعلمون المرتبطون</span>
                    </Label>
                    {teachers.length > 0 ? (
                      teachers.map((teacher) => (
                        <div key={teacher.id} className="flex items-center justify-between rounded-lg border p-3 bg-muted/50">
                            <div>
                                <span className="font-semibold">{teacher.prenom} {teacher.nom}</span>
                                {teacher.subject && <span className="text-sm text-muted-foreground mx-2">({teacher.subject.name})</span>}
                            </div>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDisconnectTeacher(teacher.id)}
                            >
                                <UserMinus className="ml-2 h-4 w-4" />
                                <span>إلغاء الربط</span>
                            </Button>
                        </div>
                      ))
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            أنت غير مرتبط بأي معلم حاليًا.
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <UserCheck className="text-primary" />
                <span>الربط بحساب ولي الأمر</span>
            </CardTitle>
            <CardDescription>
                أدخل كود ولي الأمر لربط حسابك ومشاركة تقدمك معه.
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-2">
                  <Input 
                    id="parent-code" 
                    placeholder="أدخل كود ولي الأمر هنا..."
                    value={parentCode}
                    onChange={(e) => setParentCode(e.target.value)}
                  />
                  <Button onClick={handleConnectParent}>ربط الحساب</Button>
                </div>
                
                <div className="space-y-4">
                    <Label className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-5 w-5" />
                        <span>أولياء الأمور المرتبطون</span>
                    </Label>
                    {parents.length > 0 ? (
                      parents.map((parent) => (
                        <div key={parent.id} className="flex items-center justify-between rounded-lg border p-3 bg-muted/50">
                            <div>
                                <span className="font-semibold">{parent.firstName} {parent.lastName}</span>
                                <span className="text-sm text-muted-foreground mx-2">({parent.email})</span>
                            </div>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDisconnectParent(parent.id)}
                            >
                                <UserMinus className="ml-2 h-4 w-4" />
                                <span>إلغاء الربط</span>
                            </Button>
                        </div>
                      ))
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            أنت غير مرتبط بأي ولي أمر حاليًا.
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

import ParentProfile from "./ParentProfile";

export default function ProfilePage() {
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-8">
        الملف الشخصي والإعدادات
      </h1>
      {userRole === 'parent' ? <ParentProfile /> : <StudentProfile />}
    </div>
  );
}

    