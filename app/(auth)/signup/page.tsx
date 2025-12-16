
'use client';

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { School, Loader2 } from "lucide-react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  stageId?: number;
  stage_id?: number;
}

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [role, setRole] = useState<string>('');
  const [stage, setStage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const [stages, setStages] = useState<Stage[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching stages, levels, subjects...');
        
        const [stagesRes, levelsRes, subjectsRes] = await Promise.all([
          fetch('/api/stages'),
          fetch('/api/levels'),
          fetch('/api/subjects')
        ]);
        
        const stagesData = await stagesRes.json();
        const levelsData = await levelsRes.json();
        const subjectsData = await subjectsRes.json();
        
        console.log('Stages response:', stagesData);
        console.log('Levels response:', levelsData);
        console.log('Subjects response:', subjectsData);
        
        // Handle API response format: { success: true, data: [...] }
        setStages(stagesData.success ? stagesData.data : []);
        setLevels(levelsData.success ? levelsData.data : []);
        setSubjects(subjectsData.success ? subjectsData.data : []);
        
        console.log('Stages set:', stagesData.success ? stagesData.data.length : 0);
        console.log('Levels set:', levelsData.success ? levelsData.data.length : 0);
        console.log('Subjects set:', subjectsData.success ? subjectsData.data.length : 0);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    
    fetchData();
  }, []);

  const handleRoleChange = (value: string) => {
    setRole(value);
    setStage(''); // Reset stage when role changes
  };

  const levelsForStage = levels.filter(level => {
    const levelStageId = (level as any).stageId || level.stage_id;
    return String(levelStageId) === stage;
  });
  
  console.log('Selected stage:', stage);
  console.log('All levels:', levels);
  console.log('Filtered levels for stage:', levelsForStage);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      roleName: role,
      stageId: (role === 'teacher' || role === 'student') && stage ? parseInt(stage) : undefined,
      subjectId: role === 'teacher' ? parseInt(formData.get('subjectId') as string) : undefined,
      levelId: role === 'student' ? parseInt(formData.get('levelId') as string) : undefined,
    };

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "تم إنشاء الحساب بنجاح",
          description: "يمكنك الآن تسجيل الدخول",
        });
        router.push('/login');
      } else {
        toast({
          title: "خطأ في إنشاء الحساب",
          description: result.error || "حدث خطأ أثناء إنشاء الحساب",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء الحساب",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl: '/complete-profile' });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تسجيل الدخول عبر Google",
        variant: "destructive",
      });
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <School className="h-10 w-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl">إنشاء حساب جديد</CardTitle>
          <CardDescription>
            انضم إلى SmartEdu وابدأ رحلتك التعليمية.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">الاسم الأول</Label>
                <Input 
                  id="firstName" 
                  name="firstName" 
                  placeholder="مثال: أحمد" 
                  required 
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">الاسم الأخير</Label>
                <Input 
                  id="lastName" 
                  name="lastName" 
                  placeholder="مثال: المحمود" 
                  required 
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email@example.com"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teacher-stage">المرحلة</Label>
                  <Select onValueChange={setStage} value={stage} disabled={isLoading}>
                    <SelectTrigger id="teacher-stage">
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
                  <Label htmlFor="subjectId">المادة</Label>
                  <Select name="subjectId" disabled={!stage || isLoading}>
                    <SelectTrigger id="subjectId">
                      <SelectValue placeholder="اختر المادة" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.filter(subject => String(subject.stageId) === stage || String(subject.stage_id) === stage).map(subject => (
                        <SelectItem key={subject.id} value={String(subject.id)}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {role === 'student' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student-stage">المرحلة الدراسية *</Label>
                  <Select onValueChange={setStage} value={stage} disabled={isLoading} required>
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
                  <Label htmlFor="levelId">السنة الدراسية *</Label>
                  <Select name="levelId" disabled={!stage || isLoading} required>
                    <SelectTrigger id="levelId">
                      <SelectValue placeholder={!stage ? "اختر المرحلة أولاً" : "اختر السنة الدراسية"} />
                    </SelectTrigger>
                    <SelectContent>
                      {levelsForStage.length > 0 ? (
                        levelsForStage.map(level => (
                          <SelectItem key={level.id} value={String(level.id)}>
                            {level.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>لا توجد مستويات متاحة</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full !mt-6" disabled={isLoading}>
              {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              إنشاء حساب
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                أو استمر باستخدام
              </span>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            type="button"
          >
            {isGoogleLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            إنشاء حساب باستخدام Google
          </Button>
          <div className="mt-4 text-center text-sm">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="underline">
              تسجيل الدخول
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
