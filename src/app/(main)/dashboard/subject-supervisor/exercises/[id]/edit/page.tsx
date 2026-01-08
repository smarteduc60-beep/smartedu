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
import { Save, Loader2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/editor";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { notFound } from "next/navigation";

type ExerciseType = 'main' | 'support_with_results' | 'support_only';

interface ExpectedResult {
  question: string;
  result: string;
}

interface Exercise {
  id: number;
  type: ExerciseType;
  questionRichContent: string;
  modelAnswer: string | null;
  modelAnswerImage: string | null;
  expectedResults: any;
  maxScore: number;
  allowRetry: boolean;
  maxAttempts: number;
  lesson: {
    id: number;
    title: string;
  };
}

export default function EditExercisePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  
  const [exerciseId, setExerciseId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [exerciseType, setExerciseType] = useState<ExerciseType>('main');
  const [questionContent, setQuestionContent] = useState("");
  const [modelAnswer, setModelAnswer] = useState("");
  const [modelAnswerImage, setModelAnswerImage] = useState("");
  const [maxScore, setMaxScore] = useState("20");
  const [allowRetry, setAllowRetry] = useState(true);
  const [maxAttempts, setMaxAttempts] = useState("3");
  const [expectedResults, setExpectedResults] = useState<ExpectedResult[]>([
    { question: "1", result: "" }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);

  useEffect(() => {
    const fetchExercise = async () => {
      const resolvedParams = await params;
      setExerciseId(resolvedParams.id);

      try {
        const response = await fetch(`/api/exercises/${resolvedParams.id}`);
        const result = await response.json();

        if (result.success && result.data) {
          const ex = result.data;
          setExercise(ex);
          setExerciseType(ex.type);
          setQuestionContent(ex.questionRichContent || '');
          setModelAnswer(ex.modelAnswer || '');
          setModelAnswerImage(ex.modelAnswerImage || '');
          setMaxScore(ex.maxScore?.toString() || '20');
          setAllowRetry(ex.allowRetry !== false);
          setMaxAttempts(ex.maxAttempts?.toString() || '3');
          
          if (ex.expectedResults && typeof ex.expectedResults === 'object') {
            const results = Array.isArray(ex.expectedResults) 
              ? ex.expectedResults 
              : Object.entries(ex.expectedResults).map(([q, r]) => ({ question: q, result: r as string }));
            setExpectedResults(results.length > 0 ? results : [{ question: "1", result: "" }]);
          }
        } else {
          notFound();
        }
      } catch (error) {
        console.error('Error fetching exercise:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [params]);

  const handleGenerateAnswer = async () => {
    if (!questionContent.trim()) {
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
          question: questionContent,
          subject: exercise?.lesson?.title || '',
          level: '',
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

  const handleAddResult = () => {
    setExpectedResults([
      ...expectedResults,
      { question: String(expectedResults.length + 1), result: "" }
    ]);
  };

  const handleRemoveResult = (index: number) => {
    setExpectedResults(expectedResults.filter((_, i) => i !== index));
  };

  const handleResultChange = (index: number, field: 'question' | 'result', value: string) => {
    const newResults = [...expectedResults];
    newResults[index][field] = value;
    setExpectedResults(newResults);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!questionContent) {
      toast({
        title: "خطأ",
        description: "يرجى كتابة السؤال",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        type: exerciseType,
        questionRichContent: questionContent,
        modelAnswer: exerciseType !== 'support_only' ? modelAnswer : null,
        modelAnswerImage: modelAnswerImage || null,
        maxScore: Number(maxScore),
        allowRetry,
        maxAttempts: Number(maxAttempts),
      };

      if (exerciseType === 'support_with_results') {
        payload.expectedResults = expectedResults.reduce((acc: any, item) => {
          acc[item.question] = item.result;
          return acc;
        }, {});
      }

      const response = await fetch(`/api/exercises/${exerciseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "تم بنجاح",
          description: "تم تحديث التمرين بنجاح",
        });
        router.push('/dashboard/subject-supervisor/exercises');
      } else {
        throw new Error(result.error || "فشل في تحديث التمرين");
      }
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!exercise) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="grid gap-1">
        <h1 className="text-3xl font-bold tracking-tight">تعديل التمرين</h1>
        <p className="text-muted-foreground">
          قم بتحديث تفاصيل التمرين أدناه
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تفاصيل التمرين</CardTitle>
          <CardDescription>
            الدرس المرتبط: {exercise.lesson.title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>نوع التمرين</Label>
              <Select value={exerciseType} onValueChange={(v) => setExerciseType(v as ExerciseType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">
                    <div className="flex items-center gap-2">
                      <Badge variant="default">رئيسي</Badge>
                      <span>تمرين رئيسي بإجابة نموذجية</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="support_with_results">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">داعم بنتائج</Badge>
                      <span>تمرين داعم مع النتائج المتوقعة</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="support_only">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">داعم فقط</Badge>
                      <span>تمرين داعم بدون إجابة نموذجية</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>نص السؤال</Label>
              <RichTextEditor 
                content={questionContent}
                onChange={setQuestionContent}
              />
            </div>

            {exerciseType !== 'support_only' && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>الإجابة النموذجية</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateAnswer}
                      disabled={isGeneratingAnswer || !questionContent}
                    >
                      {isGeneratingAnswer ? (
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="ml-2 h-4 w-4" />
                      )}
                      <span>توليد بالذكاء الاصطناعي</span>
                    </Button>
                  </div>
                  <RichTextEditor 
                    content={modelAnswer}
                    onChange={setModelAnswer}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model-answer-image">رابط صورة الإجابة (اختياري)</Label>
                  <Input 
                    id="model-answer-image"
                    placeholder="https://example.com/answer.jpg"
                    value={modelAnswerImage}
                    onChange={(e) => setModelAnswerImage(e.target.value)}
                  />
                </div>
              </>
            )}

            {exerciseType === 'support_with_results' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>النتائج المتوقعة</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddResult}>
                    إضافة نتيجة
                  </Button>
                </div>
                {expectedResults.map((result, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="رقم السؤال"
                        value={result.question}
                        onChange={(e) => handleResultChange(index, 'question', e.target.value)}
                      />
                      <Input
                        placeholder="النتيجة المتوقعة"
                        value={result.result}
                        onChange={(e) => handleResultChange(index, 'result', e.target.value)}
                      />
                    </div>
                    {expectedResults.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveResult(index)}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max-score">الدرجة القصوى</Label>
                <Input
                  id="max-score"
                  type="number"
                  value={maxScore}
                  onChange={(e) => setMaxScore(e.target.value)}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-attempts">عدد المحاولات المسموحة</Label>
                <Input
                  id="max-attempts"
                  type="number"
                  value={maxAttempts}
                  onChange={(e) => setMaxAttempts(e.target.value)}
                  min="1"
                  disabled={!allowRetry}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>السماح بإعادة المحاولة</Label>
                <p className="text-sm text-muted-foreground">
                  هل يمكن للطالب حل التمرين أكثر من مرة؟
                </p>
              </div>
              <Switch checked={allowRetry} onCheckedChange={setAllowRetry} />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/subject-supervisor/exercises')}
                disabled={isSubmitting}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="ml-2 h-4 w-4" />
                )}
                <span>حفظ التغييرات</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
