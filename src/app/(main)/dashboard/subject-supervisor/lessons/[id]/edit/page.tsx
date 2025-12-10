
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
import { Save, Loader2 } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl: string | null;
  type: 'public' | 'private';
  subject: { id: number; name: string };
  level: { id: number; name: string };
}

export default function EditSupervisorLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessonId, setLessonId] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    videoUrl: '',
    isPublic: false,
  });

  useEffect(() => {
    const fetchLesson = async () => {
      const resolvedParams = await params;
      setLessonId(resolvedParams.id);
      
      try {
        const response = await fetch(`/api/lessons/${resolvedParams.id}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          setLesson(result.data);
          setFormData({
            title: result.data.title,
            content: result.data.content || '',
            videoUrl: result.data.videoUrl || '',
            isPublic: result.data.type === 'public',
          });
        } else {
          notFound();
        }
      } catch (error) {
        console.error('Error fetching lesson:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/lessons/${lessonId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          videoUrl: formData.videoUrl || null,
          type: formData.isPublic ? 'public' : 'private',
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'تم التحديث',
          description: 'تم تحديث الدرس بنجاح',
        });
        router.push('/dashboard/subject-supervisor/lessons');
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message || 'فشل في تحديث الدرس',
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

  if (!lesson) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="grid gap-1">
        <h1 className="text-3xl font-bold tracking-tight">تعديل الدرس: {lesson.title}</h1>
        <p className="text-muted-foreground">
          قم بتحديث تفاصيل الدرس.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تفاصيل الدرس</CardTitle>
          <CardDescription>
            {lesson.subject.name} - {lesson.level.name}
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
                  value={lesson.subject.name} 
                  readOnly 
                  disabled 
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">المستوى</Label>
                <Input 
                  id="level" 
                  value={lesson.level.name} 
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
                    <span>حفظ التغييرات</span>
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
