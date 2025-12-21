
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/editor";
import { FileUpload } from "@/components/FileUpload";

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
    imageUrl: '',
    pdfBase64: '',
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
            imageUrl: result.data.imageUrl || '',
            pdfBase64: result.data.pdfUrl || '',
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
    
    // Validation
    if (!formData.title.trim()) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال عنوان الدرس',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.content.trim()) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال محتوى الدرس',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      const payload: any = {
        title: formData.title.trim(),
        content: formData.content,
        videoUrl: formData.videoUrl?.trim() || null,
        imageUrl: formData.imageUrl?.trim() || null,
        type: formData.isPublic ? 'public' : 'private',
      };

      // Only add base64 files if they exist
      if (formData.pdfBase64) {
        payload.pdfBase64 = formData.pdfBase64;
      }

      console.log('Sending payload size:', JSON.stringify(payload).length, 'bytes');

      const response = await fetch(`/api/lessons/${lessonId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        throw new Error(`فشل في الحفظ: ${response.status}`);
      }

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
      console.error('Submit error:', error);
      toast({
        title: 'خطأ',
        description: error.message || 'فشل في تحديث الدرس. قد يكون الملف كبيراً جداً',
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
              <RichTextEditor 
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                placeholder="اكتب محتوى الدرس هنا..."
              />
              <p className="text-xs text-muted-foreground">
                استخدم شريط الأدوات لتنسيق النص وإضافة معادلات رياضية
              </p>
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

            <div className="space-y-2">
              <Label htmlFor="image-url">رابط صورة الدرس (اختياري)</Label>
              <Input
                id="image-url"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                أدخل رابط صورة توضيحية (JPG, PNG, GIF).
              </p>
            </div>

            <FileUpload
              label="ملف PDF إضافي (اختياري)"
              accept=".pdf,application/pdf"
              maxSizeMB={5}
              value={formData.pdfBase64}
              onChange={(base64) => setFormData({ ...formData, pdfBase64: base64 || '' })}
              preview={false}
              description="يمكنك إرفاق ملف PDF للدرس (حتى 5 ميجابايت)"
            />

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
