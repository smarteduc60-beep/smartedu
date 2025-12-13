'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/editor";
import { FileUpload } from "@/components/FileUpload";
import { useStages, useLevels } from "@/hooks";

interface TeacherInfo {
  subject: { id: number; name: string; stageId: number };
  stage: { id: number; name: string };
  levels: { id: number; name: string }[];
}

export default function CreateLessonPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { data: session } = useSession();
  const { stages } = useStages();
  const { levels } = useLevels();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    videoUrl: '',
    imageBase64: '',
    pdfBase64: '',
    levelId: '',
  });

  useEffect(() => {
    const fetchTeacherInfo = async () => {
      if (!session?.user?.id || stages.length === 0 || levels.length === 0) return;
      
      try {
        // Fetch teacher user data
        const userResponse = await fetch(`/api/users/${session.user.id}`);
        const userResult = await userResponse.json();
        
        if (!userResult.success || !userResult.data) {
          toast({
            title: 'خطأ',
            description: 'فشل في جلب بيانات المعلم',
            variant: 'destructive',
          });
          return;
        }

        const userData = userResult.data;
        const subjectId = userData.userDetails?.subjectId;

        if (!subjectId) {
          toast({
            title: 'خطأ في البيانات',
            description: 'يرجى التواصل مع المدير لتحديد المادة الخاصة بك',
            variant: 'destructive',
          });
          return;
        }

        // Fetch subject details
        const subjectsResponse = await fetch('/api/subjects');
        const subjectsResult = await subjectsResponse.json();
        const subjects = subjectsResult.data?.subjects || subjectsResult.subjects || [];
        const subject = subjects.find((s: any) => s.id === subjectId);

        if (!subject) {
          toast({
            title: 'خطأ',
            description: 'لم يتم العثور على بيانات المادة',
            variant: 'destructive',
          });
          return;
        }

        // Find stage
        const stage = stages.find((st: any) => st.id === subject.stageId || st.id === subject.stage_id);
        
        if (!stage) {
          toast({
            title: 'خطأ',
            description: 'لم يتم العثور على بيانات المرحلة',
            variant: 'destructive',
          });
          return;
        }

        // Filter levels for this stage
        const stageLevels = levels.filter((l: any) => l.stageId === stage.id);

        setTeacherInfo({
          subject: {
            id: subject.id,
            name: subject.name,
            stageId: subject.stageId || subject.stage_id
          },
          stage: {
            id: stage.id,
            name: stage.name
          },
          levels: stageLevels.map((l: any) => ({
            id: l.id,
            name: l.name
          }))
        });
      } catch (error) {
        console.error('Error fetching teacher info:', error);
        toast({
          title: 'خطأ',
          description: 'فشل في الاتصال بالخادم',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherInfo();
  }, [session, stages, levels]);

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

    if (!formData.levelId) {
      toast({
        title: 'خطأ',
        description: 'يرجى اختيار المستوى الدراسي',
        variant: 'destructive',
      });
      return;
    }

    if (!teacherInfo) {
      toast({
        title: 'خطأ',
        description: 'لم يتم العثور على معلومات المعلم',
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
        subjectId: teacherInfo.subject.id,
        levelId: parseInt(formData.levelId),
        type: 'private', // Teachers always create private lessons
      };

      // Only add base64 files if they exist
      if (formData.imageBase64) {
        payload.imageBase64 = formData.imageBase64;
      }
      if (formData.pdfBase64) {
        payload.pdfBase64 = formData.pdfBase64;
      }

      const response = await fetch('/api/lessons', {
        method: 'POST',
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
          title: 'تم الإنشاء',
          description: 'تم إنشاء الدرس بنجاح',
        });
        router.push('/dashboard/teacher/lessons');
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error('Submit error:', error);
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
          املأ النموذج أدناه لإضافة درس جديد. ستكون كل الدروس التي تنشئها خاصة بطلابك المرتبطين بك.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تفاصيل الدرس</CardTitle>
          <CardDescription>
            {teacherInfo && `${teacherInfo.subject.name} - ${teacherInfo.stage.name}`}
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
                  value={teacherInfo?.subject.name || ''} 
                  readOnly 
                  disabled 
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stage">المرحلة</Label>
                <Input 
                  id="stage" 
                  value={teacherInfo?.stage.name || ''} 
                  readOnly 
                  disabled 
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">المستوى الدراسي *</Label>
              <Select 
                value={formData.levelId} 
                onValueChange={(value) => setFormData({ ...formData, levelId: value })}
              >
                <SelectTrigger id="level">
                  <SelectValue placeholder="اختر المستوى" />
                </SelectTrigger>
                <SelectContent>
                  {teacherInfo?.levels.map((level) => (
                    <SelectItem key={level.id} value={String(level.id)}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                اختر المستوى الدراسي المناسب لهذا الدرس
              </p>
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

            <div className="space-y-2">
              <Label htmlFor="video-url">رابط الفيديو (يوتيوب)</Label>
              <Input 
                id="video-url" 
                placeholder="https://www.youtube.com/watch?v=..." 
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              /> 
            </div>

            <FileUpload
              label="صورة توضيحية للدرس (اختياري)"
              accept="image/*"
              maxSizeMB={2}
              value={formData.imageBase64}
              onChange={(base64) => setFormData({ ...formData, imageBase64: base64 || '' })}
              description="يمكنك رفع صورة توضيحية للدرس (JPG, PNG, GIF - حتى 2 ميجابايت)"
            />

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
