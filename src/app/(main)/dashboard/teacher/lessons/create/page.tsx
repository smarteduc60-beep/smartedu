'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { useStages, useLevels, useSubjects, useLessons } from "@/hooks";
import { Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/editor";

export default function CreateLessonPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const { stages, isLoading: stagesLoading } = useStages();
  const { levels, isLoading: levelsLoading } = useLevels();
  const { subjects, isLoading: subjectsLoading } = useSubjects();
  const { createLesson } = useLessons();
  
  const [teacherSubject, setTeacherSubject] = useState<any>(null);
  const [teacherStage, setTeacherStage] = useState<any>(null);
  const [availableLevels, setAvailableLevels] = useState<any[]>([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [levelId, setLevelId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set teacher's subject, stage and available levels
  useEffect(() => {
    const setTeacherInfo = async () => {
      if (!session?.user?.id || !subjects || !stages || !levels) return;
      if (subjects.length === 0 || stages.length === 0 || levels.length === 0) return;

      try {
        const response = await fetch(`/api/users/${session.user.id}`);
        const result = await response.json();

        if (result.success && result.data?.userDetails?.subjectId) {
          const userSubjectId = result.data.userDetails.subjectId;
          const subject = subjects.find((s: any) => s.id === userSubjectId);

          if (subject) {
            setTeacherSubject(subject);
            const stage = stages.find((st: any) => st.id === subject.stageId || st.id === subject.stage_id);
            
            if (stage) {
              setTeacherStage(stage);
              const stageLevels = levels.filter((l: any) => l.stageId === stage.id);
              setAvailableLevels(stageLevels);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching teacher info:', error);
      }
    };

    setTeacherInfo();
  }, [session, subjects, stages, levels]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content || !teacherSubject || !levelId) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const result = await createLesson({
      title,
      content,
      videoUrl: videoUrl || undefined,
      imageUrl: imageUrl || undefined,
      pdfUrl: pdfUrl || undefined,
      subjectId: teacherSubject.id,
      levelId: parseInt(levelId),
    });

    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "نجح",
        description: "تم إنشاء الدرس بنجاح",
      });
      router.push("/dashboard/teacher/lessons");
    } else {
      toast({
        title: "خطأ",
        description: result.error || "فشل في إنشاء الدرس",
        variant: "destructive",
      });
    }
  };

  // A teacher can only create private lessons, so we don't show the switch.
  // We assume the form submission will enforce this.

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
            {teacherSubject && teacherStage && `${teacherSubject.name} - ${teacherStage.name}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان الدرس *</Label>
              <Input 
                id="title" 
                placeholder="مثال: مقدمة في الجبر" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="subject">المادة</Label>
                <Input 
                  id="subject" 
                  value={teacherSubject?.name || 'جاري التحميل...'}
                  readOnly
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stage">المرحلة</Label>
                <Input 
                  id="stage" 
                  value={teacherStage?.name || 'جاري التحميل...'}
                  readOnly
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">المستوى الدراسي *</Label>
              <Select value={levelId} onValueChange={setLevelId} disabled={!teacherStage || availableLevels.length === 0}>
                <SelectTrigger id="level">
                  <SelectValue placeholder={!teacherStage ? "جاري التحميل..." : "اختر المستوى"} />
                </SelectTrigger>
                <SelectContent>
                  {availableLevels.map((level) => (
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
                content={content}
                onChange={(newContent) => setContent(newContent)}
                placeholder="اكتب محتوى الدرس هنا..."
              />
              <p className="text-xs text-muted-foreground">
                استخدم شريط الأدوات لتنسيق النص وإضافة معادلات رياضية
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="video-url">رابط الفيديو (يوتيوب) - اختياري</Label>
              <Input 
                id="video-url" 
                placeholder="https://www.youtube.com/watch?v=..." 
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-url">رابط صورة الدرس - اختياري</Label>
              <Input 
                id="image-url" 
                type="url"
                placeholder="https://example.com/image.jpg" 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                أدخل رابط صورة مباشر (JPG, PNG, GIF)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pdf-url">رابط ملف PDF - اختياري</Label>
              <Input 
                id="pdf-url" 
                type="url"
                placeholder="https://example.com/document.pdf" 
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                أدخل رابط ملف PDF مباشر
              </p>
            </div>

            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
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
