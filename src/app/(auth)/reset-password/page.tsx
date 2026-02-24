'use client';

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { School, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!token) {
      toast({
        title: "خطأ",
        description: "رابط إعادة التعيين غير صالح أو مفقود.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمتا المرور غير متطابقتين.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast({
        title: "خطأ",
        description: "يجب أن تكون كلمة المرور 6 أحرف على الأقل.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      // التحقق من نوع الاستجابة قبل محاولة تحليلها كـ JSON
      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('[Reset Password] Non-JSON response:', text);
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
      }

      if (data.success) {
        setIsSuccess(true);
        toast({
          title: "تم بنجاح",
          description: "تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول.",
        });
        // Redirect after a short delay
        setTimeout(() => router.push('/login'), 3000);
      } else {
        toast({
          title: "خطأ",
          description: data.error || "حدث خطأ أثناء إعادة تعيين كلمة المرور",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('[Reset Password Client Error]:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في الاتصال بالخادم",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <CardContent className="text-center py-8">
        <div className="text-destructive mb-4">رابط غير صالح</div>
        <p className="text-muted-foreground mb-4">
          رمز التحقق مفقود من الرابط. يرجى التأكد من نسخ الرابط كاملاً من البريد الإلكتروني.
        </p>
        <Button asChild variant="outline">
          <Link href="/forgot-password">طلب رابط جديد</Link>
        </Button>
      </CardContent>
    );
  }

  if (isSuccess) {
    return (
      <CardContent className="text-center py-8 space-y-4">
        <div className="flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold text-green-700">تم تغيير كلمة المرور!</h3>
        <p className="text-muted-foreground">
          تم تحديث كلمة المرور الخاصة بك بنجاح. سيتم تحويلك إلى صفحة تسجيل الدخول...
        </p>
        <Button className="w-full" asChild>
          <Link href="/login">تسجيل الدخول الآن</Link>
        </Button>
      </CardContent>
    );
  }

  return (
    <CardContent>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">كلمة المرور الجديدة</Label>
          <div className="relative">
            <Input 
              id="password" 
              name="password" 
              type={showPassword ? "text" : "password"} 
              required 
              disabled={isLoading}
              className="pl-10"
              placeholder="أدخل كلمة المرور الجديدة"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute left-0 top-0 h-full px-3 hover:bg-transparent z-20 text-muted-foreground"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
          <Input 
            id="confirmPassword" 
            name="confirmPassword" 
            type="password" 
            required 
            disabled={isLoading}
            placeholder="أعد إدخال كلمة المرور"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          تغيير كلمة المرور
        </Button>
      </form>
    </CardContent>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <School className="h-10 w-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">إعادة تعيين كلمة المرور</CardTitle>
          <CardDescription>
            أدخل كلمة المرور الجديدة لحسابك.
          </CardDescription>
        </CardHeader>
        <Suspense fallback={
          <CardContent className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        }>
          <ResetPasswordForm />
        </Suspense>
      </Card>
    </div>
  );
}
