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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface SupervisorInfo {
  subject: { id: number; name: string };
  level: { id: number; name: string; stage: { name: string } };
}

export default function CreateLessonPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [supervisorInfo, setSupervisorInfo] = useState<SupervisorInfo | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    videoUrl: '',
    isPublic: false,
  });

  useEffect(() => {
    const fetchSupervisorInfo = async () => {
      try {
        const response = await fetch('/api/subject-supervisor/dashboard');
        const result = await response.json();
        
        if (result.success && result.data?.supervisor) {
          setSupervisorInfo({
            subject: result.data.supervisor.subject,
            level: result.data.supervisor.level,
          });
        }
      } catch (error) {
        console.error('Error fetching supervisor info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupervisorInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supervisorInfo || !formData.title || !formData.content) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          videoUrl: formData.videoUrl || null,
          subjectId: supervisorInfo.subject.id,
          levelId: supervisorInfo.level.id,
          type: formData.isPublic ? 'public' : 'private',
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'تم الإنشاء',
          description: 'تم إنشاء الدرس بنجاح',
        });
        router.push('/dashboard/subject-supervisor/lessons');
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message || 'فشل في إنشاء الدرس',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="grid gap-1">
        <h1 className="text-3xl font-bold tracking-tight">إنشاء درس جديد</h1>
        <p className="text-muted-foreground">
          املأ النموذج أدناه لإضافة درس جديد. يمكنك اختيار ما إذا كان الدرس عامًا لجميع الطلاب أو خاصًا بطلابك.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تفاصيل الدرس</CardTitle>
          <CardDescription>
            {supervisorInfo && `${supervisorInfo.subject.name} - ${supervisorInfo.level.name} (${supervisorInfo.level.stage.name})`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان الدرس *</Label>
              <Input 
                id="title" 
                placeholder="مثال: مقدمة في الجبر" 
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="subject">المادة</Label>
                <Input 
                  id="subject" 
                  value={supervisorInfo?.subject.name || ''} 
                  readOnly 
                  disabled 
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">المستوى</Label>
                <Input 
                  id="level" 
                  value={supervisorInfo ? `${supervisorInfo.level.name} (${supervisorInfo.level.stage.name})` : ''} 
                  readOnly 
                  disabled 
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">محتوى الدرس *</Label>
              <Textarea 
                id="content" 
                placeholder="اكتب محتوى الدرس هنا..." 
                rows={10}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch 
                id="lesson-type" 
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
              />
              <Label htmlFor="lesson-type">جعله درسًا عامًا (متاح لجميع الطلاب في هذا المستوى)</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="video-url">رابط الفيديو (يوتيوب)</Label>
              <Input 
                id="video-url" 
                placeholder="https://www.youtube.com/watch?v=..." 
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              /> 
            </div>

            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                type="button"
                onClick={() => router.back()}
                disabled={submitting}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  <>
                    <Save className="ml-2 h-4 w-4" />
                    <span>حفظ الدرس</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
