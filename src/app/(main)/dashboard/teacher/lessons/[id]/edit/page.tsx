
'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { useSubjects, useLevels, useLessons } from "@/hooks";
import { Save, UploadCloud, Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function EditLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { toast } = useToast();
  const { subjects, isLoading: subjectsLoading } = useSubjects();
  const { levels, isLoading: levelsLoading } = useLevels();
  const { updateLesson } = useLessons();

  const [lesson, setLesson] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lessonId, setLessonId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [subjectId, setSubjectId] = useState<string>("");
  const [levelId, setLevelId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const resolvedParams = await params;
        const id = resolvedParams.id;
        setLessonId(id);
        const response = await fetch(`/api/lessons/${id}`);
        if (!response.ok) {
          notFound();
          return;
        }
        const data = await response.json();
        const lessonData = data.data;
        setLesson(lessonData);
        setTitle(lessonData.title);
        setDescription(lessonData.description || "");
        setContent(lessonData.content);
        setVideoUrl(lessonData.videoUrl || "");
        setPdfUrl(lessonData.pdfUrl || "");
        setSubjectId(String(lessonData.subjectId));
        setLevelId(String(lessonData.levelId));
      } catch (error) {
        console.error('Error fetching lesson:', error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };
    fetchLesson();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content || !subjectId || !levelId) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const result = await updateLesson(parseInt(lessonId), {
      title,
      description,
      content,
      videoUrl: videoUrl || undefined,
      pdfUrl: pdfUrl || undefined,
      subjectId: parseInt(subjectId),
      levelId: parseInt(levelId),
    });

    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "نجح",
        description: "تم تحديث الدرس بنجاح",
      });
      router.push("/dashboard/teacher/lessons");
    } else {
      toast({
        title: "خطأ",
        description: result.error || "فشل في تحديث الدرس",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!lesson) {
    notFound();
    return null;
  }

  // A teacher can only create private lessons, so we don't show the switch.
  // We assume the form submission will enforce this.

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="grid gap-1">
        <h1 className="text-3xl font-bold tracking-tight">تعديل الدرس: {lesson.title}</h1>
        <p className="text-muted-foreground">
          قم بتحديث تفاصيل الدرس أدناه.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تفاصيل الدرس</CardTitle>
          <CardDescription>
            قم بتعديل المعلومات الأساسية لدرسك.
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
                <Select value={subjectId} onValueChange={setSubjectId} disabled={subjectsLoading}>
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="اختر المادة" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(subjects) && subjects.filter(s => s && s.id).map((subject) => (
                      <SelectItem key={subject.id} value={String(subject.id)}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">المستوى *</Label>
                 <Select value={levelId} onValueChange={setLevelId} disabled={levelsLoading}>
                  <SelectTrigger id="level">
                    <SelectValue placeholder="اختر المستوى" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(levels) && levels.filter(l => l && l.id).map((level) => (
                      <SelectItem key={level.id} value={String(level.id)}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">محتوى الدرس *</Label>
              <Textarea 
                id="content" 
                value={content} 
                onChange={(e) => setContent(e.target.value)}
                rows={10}
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
