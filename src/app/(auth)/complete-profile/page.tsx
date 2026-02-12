
'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { School, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Stage {
  id: number;
  name: string;
  description: string;
}

interface Level {
  id: number;
  name: string;
  stage_id: number;
}

interface Subject {
  id: number;
  name: string;
}

export default function CompleteProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, update, status } = useSession();
  
  const [role, setRole] = useState<string>('');
  const [stage, setStage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [stages, setStages] = useState<Stage[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stagesRes, levelsRes, subjectsRes] = await Promise.all([
          fetch('/api/stages'),
          fetch('/api/levels'),
          fetch('/api/subjects')
        ]);
        
        const stagesData = await stagesRes.json();
        const levelsData = await levelsRes.json();
        const subjectsData = await subjectsRes.json();
        
        if (stagesData.success) setStages(stagesData.data);
        if (levelsData.success) setLevels(levelsData.data);
        if (subjectsData.success) setSubjects(subjectsData.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    
    fetchData();
  }, []);

  const handleRoleChange = (value: string) => {
    setRole(value);
    setStage('');
  };

  const levelsForStage = levels.filter(level => String(level.stage_id) === stage);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!session?.user?.id) {
      toast({
        title: "خطأ",
        description: "جلسة غير صالحة",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data = {
      role: role,
      subjectId: role === 'teacher' ? parseInt(formData.get('subjectId') as string) : undefined,
      levelId: role === 'student' ? parseInt(formData.get('levelId') as string) : undefined,
    };

    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        await update();
        toast({
          title: "تم تحديث الملف الشخصي بنجاح",
          description: "جاري تحويلك إلى لوحة التحكم...",
        });
        router.push('/dashboard');
        router.refresh();
      } else {
        toast({
          title: "خطأ في تحديث الملف الشخصي",
          description: result.error || "حدث خطأ أثناء التحديث",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث الملف الشخصي",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const firstName = session.user.name?.split(' ')[0] || '';
  const lastName = session.user.name?.split(' ').slice(1).join(' ') || '';

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <School className="h-10 w-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl">أكمل ملفك الشخصي</CardTitle>
          <CardDescription>
            خطوة أخيرة! الرجاء اختيار دورك واستكمال بياناتك.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">الاسم الأول</Label>
                <Input id="firstName" defaultValue={firstName} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">الاسم الأخير</Label>
                <Input id="lastName" defaultValue={lastName} disabled />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                defaultValue={session.user.email || ''}
                disabled
              />
            </div>
            
            <div className="space-y-4">
              <Label htmlFor="role">الدور</Label>
              <Select onValueChange={handleRoleChange} value={role} disabled={isLoading}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="اختر دورك" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teacher">أستاذ</SelectItem>
                  <SelectItem value="student">طالب</SelectItem>
                  <SelectItem value="parent">ولي أمر</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {role === 'teacher' && (
              <div className="space-y-2">
                <Label htmlFor="subjectId">المادة</Label>
                <Select name="subjectId" disabled={isLoading}>
                  <SelectTrigger id="subjectId">
                    <SelectValue placeholder="اختر المادة" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subject => (
                      <SelectItem key={subject.id} value={String(subject.id)}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {role === 'student' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student-stage">المرحلة</Label>
                  <Select onValueChange={setStage} value={stage} disabled={isLoading}>
                    <SelectTrigger id="student-stage">
                      <SelectValue placeholder="اختر المرحلة" />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map(s => (
                        <SelectItem key={s.id} value={String(s.id)}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="levelId">المستوى الدراسي</Label>
                  <Select name="levelId" disabled={!stage || isLoading}>
                    <SelectTrigger id="levelId">
                      <SelectValue placeholder="اختر المستوى" />
                    </SelectTrigger>
                    <SelectContent>
                      {levelsForStage.map(level => (
                        <SelectItem key={level.id} value={String(level.id)}>
                          {level.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full !mt-8" disabled={isLoading}>
              {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              حفظ والمتابعة
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
