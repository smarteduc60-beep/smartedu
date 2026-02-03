
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLessons, useExercises, useLevels } from "@/hooks";
import { Save, Loader2, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/editor";
import { FileUpload } from "@/components/FileUpload";

export default function EditExercisePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const { lessons, isLoading: lessonsLoading } = useLessons({
    authorId: session?.user?.id,
    include: { subject: true, level: true },
  });
  const { levels } = useLevels();
  const { updateExercise } = useExercises();

  const [exerciseId, setExerciseId] = useState<string>("");
  const [exercise, setExercise] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lessonId, setLessonId] = useState<string>("");
  const [question, setQuestion] = useState("");
  const [modelAnswer, setModelAnswer] = useState("");
  const [questionFileUrl, setQuestionFileUrl] = useState("");
  const [questionFileName, setQuestionFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);

  const selectedLesson = Array.isArray(lessons) ? lessons.find((l: any) => String(l.id) === lessonId) : null;
  const selectedLevelData = Array.isArray(levels) ? levels.find((l: any) => l.id === selectedLesson?.level?.id) : null;

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const resolvedParams = await params;
        const id = resolvedParams.id;
        setExerciseId(id);
        const response = await fetch(`/api/exercises/${id}`);
        if (!response.ok) {
          notFound();
          return;
        }
        const data = await response.json();
        const exerciseData = data.data;
        setExercise(exerciseData);
        setLessonId(String(exerciseData.lessonId));
        setQuestion(exerciseData.questionRichContent || exerciseData.question);
        setModelAnswer(exerciseData.modelAnswer);
        setQuestionFileUrl(exerciseData.questionFileUrl || "");
        if (exerciseData.questionFileUrl) {
          setQuestionFileName("الملف الحالي");
        }
      } catch (error) {
        console.error('Error fetching exercise:', error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };
    fetchExercise();
  }, [params]);

  const handleGenerateAnswer = async () => {
    if (!question.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى كتابة نص السؤال أولاً قبل توليد الإجابة.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingAnswer(true);
    try {
      const response = await fetch('/api/ai/generate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question,
          subject: selectedLesson?.subject?.name || '',
          level: selectedLesson?.level?.name || '',
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // تحويل صيغ LaTeX إلى تنسيق MathLive للمحرر
        const processedAnswer = result.data.answer
          .replace(/(\$\$|\\\[)([\s\S]*?)(\$\$|\\\])/g, (match: string, start: string, tex: string) => `<span data-type="math-live" data-latex="${tex.trim()}"></span>`)
          .replace(/(\\\(|\\\\\()([\s\S]*?)(\\\)|\\\\\))/g, (match: string, start: string, tex: string) => `<span data-type="math-live" data-latex="${tex.trim()}"></span>`);
        
        setModelAnswer(processedAnswer);
        toast({
          title: "تم بنجاح",
          description: "تم توليد الإجابة النموذجية. يمكنك مراجعتها وتعديلها.",
        });
      } else {
        throw new Error(result.error || "فشل في توليد الإجابة من الذكاء الاصطناعي");
      }
    } catch (error: any) {
      toast({
        title: "خطأ في الذكاء الاصطناعي",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAnswer(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lessonId || !question || !modelAnswer) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const result = await updateExercise(Number(exerciseId), {
      lessonId: parseInt(lessonId),
      question,
      questionRichContent: question,
      modelAnswer,
      questionFileUrl: questionFileUrl || undefined,
    } as any);

    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "نجح",
        description: "تم تحديث التمرين بنجاح",
      });
      router.push("/dashboard/teacher/exercises");
    } else {
      toast({
        title: "خطأ",
        description: result.error || "فشل في تحديث التمرين",
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

  if (!exercise) {
    notFound();
    return null;
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="grid gap-1">
        <h1 className="text-3xl font-bold tracking-tight">تعديل التمرين</h1>
        <p className="text-muted-foreground">
          قم بتحديث تفاصيل التمرين أدناه.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تفاصيل التمرين</CardTitle>
          <CardDescription>
            قم بتعديل المعلومات الأساسية للتمرين.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="lesson">الدرس المرتبط *</Label>
              <Select value={lessonId} onValueChange={setLessonId} disabled={lessonsLoading}>
                <SelectTrigger id="lesson">
                  <SelectValue placeholder="اختر الدرس" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(lessons) && lessons.filter(l => l && l.id).map((lesson) => (
                    <SelectItem key={lesson.id} value={String(lesson.id)}>
                      {lesson.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="question">نص السؤال *</Label>
              <RichTextEditor 
                content={question} 
                onChange={setQuestion}
                placeholder="اكتب نص السؤال هنا..."
              />
            </div>

            <div className="space-y-2">
              <FileUpload
                label="ملف السؤال (صورة أو PDF)"
                accept="image/*,.pdf"
                maxSizeMB={5}
                value={questionFileName}
                onChange={(fileInfo) => {
                  if (fileInfo) {
                    setQuestionFileUrl(fileInfo.fileUrl);
                    setQuestionFileName(fileInfo.fileName);
                  } else {
                    setQuestionFileUrl("");
                    setQuestionFileName("");
                  }
                }}
                onUploadStatusChange={setIsFileUploading}
                stage={selectedLevelData?.stage?.name}
                subject={selectedLesson?.subject?.name}
                teacher={session?.user?.name || "Teacher"}
                lesson={selectedLesson?.title}
                description="يمكنك رفع ملف للسؤال (اختياري) - سيتم حفظه في مجلد التمارين"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="model-answer">الإجابة النموذجية *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateAnswer}
                  disabled={isGeneratingAnswer || !question}
                >
                  {isGeneratingAnswer ? (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="ml-2 h-4 w-4" />
                  )}
                  توليد بالذكاء الاصطناعي
                </Button>
              </div>
              <RichTextEditor 
                content={modelAnswer}
                onChange={setModelAnswer}
                placeholder="اكتب الإجابة النموذجية هنا..."
              />
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
              <Button type="submit" disabled={isSubmitting || isFileUploading}>
                {isSubmitting || isFileUploading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    <span>{isFileUploading ? "جاري رفع الملف..." : "جاري الحفظ..."}</span>
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
