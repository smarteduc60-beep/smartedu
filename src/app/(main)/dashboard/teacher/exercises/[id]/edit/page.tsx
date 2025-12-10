
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
import { useLessons, useExercises } from "@/hooks";
import { Save, UploadCloud, Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function EditExercisePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const { lessons, isLoading: lessonsLoading } = useLessons({
    authorId: session?.user?.id,
  });
  const { updateExercise } = useExercises();

  const [exerciseId, setExerciseId] = useState<string>("");
  const [exercise, setExercise] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lessonId, setLessonId] = useState<string>("");
  const [question, setQuestion] = useState("");
  const [modelAnswer, setModelAnswer] = useState("");
  const [questionFileUrl, setQuestionFileUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        setQuestion(exerciseData.question);
        setModelAnswer(exerciseData.modelAnswer);
        setQuestionFileUrl(exerciseData.questionFileUrl || "");
      } catch (error) {
        console.error('Error fetching exercise:', error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };
    fetchExercise();
  }, [params]);

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
      modelAnswer,
      questionFileUrl: questionFileUrl || undefined,
    });

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
              <Textarea 
                id="question" 
                value={question} 
                onChange={(e) => setQuestion(e.target.value)}
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
                <Label>إرفاق ملف للسؤال (اختياري)</Label>
                <div className="flex items-center justify-center w-full">
                    <Label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">انقر للرفع</span> أو اسحب وأفلت الملف</p>
                            <p className="text-xs text-muted-foreground">صورة أو PDF</p>
                        </div>
                        <Input id="dropzone-file" type="file" className="hidden" />
                    </Label>
                </div> 
                {exercise.question_file_url && (
                    <div className="text-sm text-muted-foreground">
                        الملف الحالي: <a href={exercise.question_file_url} target="_blank" rel="noopener noreferrer" className="text-primary underline">{exercise.question_file_url}</a>
                    </div>
                )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="question-file-url">رابط ملف السؤال (اختياري)</Label>
              <Input 
                id="question-file-url" 
                placeholder="https://example.com/question.pdf" 
                value={questionFileUrl}
                onChange={(e) => setQuestionFileUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model-answer">الإجابة النموذجية *</Label>
              <Textarea 
                id="model-answer" 
                value={modelAnswer}
                onChange={(e) => setModelAnswer(e.target.value)}
                rows={5}
                required
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
