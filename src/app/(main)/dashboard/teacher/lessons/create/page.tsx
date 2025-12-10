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
import { Switch } from "@/components/ui/switch";
import { useStages, useLevels, useLessons } from "@/hooks";
import { Save, UploadCloud, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function CreateLessonPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const { stages, isLoading: stagesLoading } = useStages();
  const { levels, isLoading: levelsLoading } = useLevels();
  const { createLesson } = useLessons();
  
  const [teacherSubject, setTeacherSubject] = useState<any>(null);
  const [teacherStage, setTeacherStage] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [levelId, setLevelId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch teacher's subject and stage
  useEffect(() => {
    const fetchTeacherInfo = async () => {
      if (!session?.user?.id) return;
      
      try {
        const response = await fetch(`/api/users/${session.user.id}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          const userData = result.data;
          if (userData.details?.subjectId) {
            // Fetch the subject details
            const subjectRes = await fetch(`/api/subjects`);
            const subjectData = await subjectRes.json();
            const subjects = subjectData.data?.subjects || subjectData.subjects || [];
            const subject = subjects.find((s: any) => s.id === userData.details.subjectId);
            
            if (subject) {
              setTeacherSubject(subject);
              // Find the stage for this subject
              const stage = stages.find((st: any) => st.id === subject.stageId || st.id === subject.stage_id);
              if (stage) {
                setTeacherStage(stage);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching teacher info:', error);
      }
    };
    
    if (session?.user && stages.length > 0) {
      fetchTeacherInfo();
    }
  }, [session, stages]);

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
      description,
      content,
      videoUrl: videoUrl || undefined,
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
          املأ النموذج أدناه لإضافة درس جديد إلى المنصة. ستكون كل الدروس التي تنشئها خاصة بطلابك المرتبطين بك.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تفاصيل الدرس</CardTitle>
          <CardDescription>
            أدخل المعلومات الأساسية لدرسك.
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

            <div className="space-y-2">
              <Label htmlFor="description">الوصف (اختياري)</Label>
              <Input 
                id="description" 
                placeholder="وصف مختصر للدرس" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="subject">المادة *</Label>
                <Input 
                  id="subject" 
                  value={teacherSubject?.name || 'جاري التحميل...'}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  المادة الخاصة بك (تم تحديدها عند التسجيل)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stage">المرحلة *</Label>
                <Input 
                  id="stage" 
                  value={teacherStage?.name || 'جاري التحميل...'}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  المرحلة المرتبطة بمادتك
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">المستوى الدراسي *</Label>
              <Select value={levelId} onValueChange={setLevelId} disabled={levelsLoading || !teacherStage}>
                <SelectTrigger id="level">
                  <SelectValue placeholder={levelsLoading ? "جاري التحميل..." : "اختر المستوى"} />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(levels) && levels
                    .filter(l => l && l.id && l.stageId === teacherStage?.id)
                    .map((level) => (
                      <SelectItem key={level.id} value={String(level.id)}>
                        {level.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                المستويات المتاحة في {teacherStage?.name || 'مرحلتك'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">محتوى الدرس *</Label>
              <Textarea 
                id="content" 
                placeholder="اكتب محتوى الدرس هنا..." 
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
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
              <Label htmlFor="pdf-url">رابط PDF - اختياري</Label>
              <Input 
                id="pdf-url" 
                placeholder="https://example.com/document.pdf" 
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
                <Label>المرفقات (اختياري)</Label>
                <div className="flex items-center justify-center w-full">
                    <Label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">انقر للرفع</span> أو اسحب وأفلت الملفات</p>
                            <p className="text-xs text-muted-foreground">PDF, PNG, JPG (بحد أقصى 5 ميجابايت)</p>
                        </div>
                        <Input id="dropzone-file" type="file" className="hidden" multiple />
                    </Label>
                </div> 
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
