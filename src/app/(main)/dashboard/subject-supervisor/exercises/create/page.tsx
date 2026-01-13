'use client';

import { useState } from "react";
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
import { useLessons, Lesson } from "@/hooks/use-lessons";
import { useLevels } from "@/hooks/use-data";
import { Save, Loader2, Plus, Trash2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/editor";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

type ExerciseType = 'main' | 'support_with_results' | 'support_only';

interface ExpectedResult {
  question: string;
  result: string;
}

export default function CreateExercisePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  
  // جلب المستويات حسب مرحلة مشرف المادة (فقط عندما تكون الجلسة جاهزة)
  const { levels, isLoading: levelsLoading } = useLevels(
    session?.user?.stage_id ? { stageId: session.user.stage_id } : undefined
  );
  const [selectedLevelId, setSelectedLevelId] = useState<number | undefined>(undefined);
  const { lessons, isLoading: lessonsLoading } = useLessons({
    authorId: session?.user?.id,
    levelId: selectedLevelId,
    include: { subject: true, level: true },
  });

  const [lessonId, setLessonId] = useState<string>("");
  const [exerciseType, setExerciseType] = useState<ExerciseType>('main');
  const [questionContent, setQuestionContent] = useState("");
  const [questionFileUrl, setQuestionFileUrl] = useState("");
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
  const [lastGeneratedQuestion, setLastGeneratedQuestion] = useState("");

  const handleGenerateAnswer = async () => {
    if (!questionContent.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى كتابة نص السؤال أولاً قبل توليد الإجابة.",
        variant: "destructive",
      });
      return;
    }

    if (questionContent.trim() === lastGeneratedQuestion) {
      toast({
        title: "تنبيه",
        description: "تم توليد إجابة لهذا السؤال مسبقاً.",
      });
      return;
    }

    if (!lessonId) {
      toast({
        title: "اختر الدرس أولاً",
        description: "يجب اختيار الدرس لتوفير سياق أفضل للذكاء الاصطناعي.",
        variant: "destructive",
      });
      return;
    }

    const selectedLesson = lessons.find(l => String(l.id) === lessonId);

    setIsGeneratingAnswer(true);
    try {
      const response = await fetch('/api/ai/generate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionContent,
          subject: selectedLesson?.subject?.name,
          level: selectedLesson?.level?.name,
        }),
      });









            const result = await response.json();

      if (response.ok && result.success) {
        // تحويل صيغ LaTeX إلى تنسيق MathLive للمحرر
        const processedAnswer = result.data.answer
          .replace(/(\$\$|\\\[)([\s\S]*?)(\$\$|\\\])/g, (match: string, start: string, tex: string) => `<span data-type="math-live" data-latex="${tex.trim()}"></span>`)
          .replace(/(\\\(|\\\\\()([\s\S]*?)(\\\)|\\\\\))/g, (match: string, start: string, tex: string) => `<span data-type="math-live" data-latex="${tex.trim()}"></span>`);

        setModelAnswer(processedAnswer);
        setLastGeneratedQuestion(questionContent.trim());
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
    
    if (!lessonId || !questionContent) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار الدرس وكتابة السؤال",
        variant: "destructive",
      });
      return;
    }

    if (exerciseType === 'main' && !modelAnswer) {
      toast({
        title: "خطأ",
        description: "يجب إضافة الحل النموذجي للتمرين الرئيسي",
        variant: "destructive",
      });
      return;
    }

    if (exerciseType === 'support_with_results') {
      const hasEmptyResults = expectedResults.some(r => !r.result.trim());
      if (hasEmptyResults) {
        toast({
          title: "خطأ",
          description: "يجب ملء جميع النتائج المتوقعة",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/exercises?lessonId=${lessonId}`);
      const result = await response.json();
      const existingExercises = result.success ? (result.exercises || []) : [];
      const displayOrder = existingExercises.length + 1;

      const exerciseData: any = {
        lessonId: parseInt(lessonId),
        type: exerciseType,
        questionRichContent: questionContent,
        questionFileUrl: questionFileUrl || null,
        displayOrder,
      };

      if (exerciseType === 'main') {
        exerciseData.modelAnswer = modelAnswer;
        if (modelAnswerImage) exerciseData.modelAnswerImage = modelAnswerImage;
        exerciseData.maxScore = parseFloat(maxScore);
        exerciseData.allowRetry = allowRetry;
        exerciseData.maxAttempts = parseInt(maxAttempts);
      } else if (exerciseType === 'support_with_results') {
        exerciseData.expectedResults = expectedResults;
      }

      const createResponse = await fetch('/api/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exerciseData),
      });

      const createResult = await createResponse.json();

      if (createResult.success) {
        toast({
          title: "نجح",
          description: "تم إنشاء التمرين بنجاح",
        });
        router.push("/dashboard/subject-supervisor/exercises");
      } else {
        throw new Error(createResult.error || "فشل في إنشاء التمرين");
      }
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "فشل في إنشاء التمرين",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getExerciseTypeLabel = (type: ExerciseType) => {
    switch (type) {
      case 'main':
        return 'تمرين رئيسي (تصحيح ذكي)';
      case 'support_with_results':
        return 'تمرين دعم + نتائج';
      case 'support_only':
        return 'تمرين دعم فقط';
    }
  };

  const getExerciseTypeDescription = (type: ExerciseType) => {
    switch (type) {
      case 'main':
        return 'يتم تصحيحه بالذكاء الاصطناعي ويحصل التلميذ على نقطة وملاحظات';
      case 'support_with_results':
        return 'يستطيع التلميذ إدخال النتائج ومقارنتها مع الحل الصحيح';
      case 'support_only':
        return 'عرض فقط - لا يمكن للتلميذ الإجابة';
    }
  };

  if (lessonsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-1">
        <h1 className="text-3xl font-bold tracking-tight">إنشاء تمرين جديد</h1>
        <p className="text-muted-foreground">
          أضف تمريناً جديداً لطلابك مع اختيار النوع المناسب.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>معلومات التمرين</CardTitle>
            <CardDescription>
              اختر نوع التمرين وأدخل البيانات المطلوبة
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="level">المستوى (اختياري - لتصفية الدروس)</Label>
              <Select 
                value={selectedLevelId?.toString() || "all"} 
                onValueChange={(value) => setSelectedLevelId(value === "all" ? undefined : parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="جميع المستويات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المستويات</SelectItem>
                  {levels && Array.isArray(levels) && levels.map((level) => (
                    <SelectItem key={level.id} value={String(level.id)}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lesson">الدرس *</Label>
              <Select value={lessonId} onValueChange={setLessonId}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الدرس" />
                </SelectTrigger>
                <SelectContent>
                  {lessons.length === 0 ? (
                    <SelectItem value="none" disabled>
                      {lessonsLoading ? "جاري التحميل..." : "لا توجد دروس متاحة"}
                    </SelectItem>
                  ) : (
                    lessons.map((lesson) => (
                      <SelectItem key={lesson.id} value={String(lesson.id)}>
                        {lesson.title}
                        {lesson.subject && lesson.level && ` (${lesson.subject.name} - ${lesson.level.name})`}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>نوع التمرين *</Label>
              <div className="grid gap-3">
                {(['main', 'support_with_results', 'support_only'] as ExerciseType[]).map((type) => (
                  <Card
                    key={type}
                    className={`cursor-pointer transition-all ${
                      exerciseType === type
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setExerciseType(type)}
                  >
                    <CardHeader className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-base">
                            {getExerciseTypeLabel(type)}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {getExerciseTypeDescription(type)}
                          </CardDescription>
                        </div>
                        {exerciseType === type && (
                          <Badge variant="default">مختار</Badge>
                        )}
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>السؤال / التمرين *</Label>
              <RichTextEditor
                content={questionContent}
                onChange={setQuestionContent}
                placeholder="اكتب السؤال هنا... يمكنك إضافة صور وجداول"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="questionFileUrl">رابط ملف السؤال (PDF اختياري)</Label>
              <Input
                id="questionFileUrl"
                type="url"
                placeholder="https://example.com/question.pdf"
                value={questionFileUrl}
                onChange={(e) => setQuestionFileUrl(e.target.value)}
              />
            </div>

            {exerciseType === 'main' && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label>الحل النموذجي *</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateAnswer}
                      disabled={isGeneratingAnswer || !lessonId}
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
                    placeholder="اكتب الحل النموذجي هنا، أو قم بتوليده تلقائياً..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modelAnswerImage">صورة الحل النموذجي (اختياري)</Label>
                  <Input
                    id="modelAnswerImage"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={modelAnswerImage}
                    onChange={(e) => setModelAnswerImage(e.target.value)}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="maxScore">النقطة القصوى</Label>
                    <Input
                      id="maxScore"
                      type="number"
                      step="0.5"
                      min="1"
                      max="100"
                      value={maxScore}
                      onChange={(e) => setMaxScore(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxAttempts">الحد الأقصى للمحاولات</Label>
                    <Input
                      id="maxAttempts"
                      type="number"
                      min="1"
                      max="10"
                      value={maxAttempts}
                      onChange={(e) => setMaxAttempts(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allowRetry">السماح بالإعادة</Label>
                    <div className="flex items-center gap-2 h-10">
                      <Switch
                        id="allowRetry"
                        checked={allowRetry}
                        onCheckedChange={setAllowRetry}
                      />
                      <span className="text-sm">{allowRetry ? 'نعم' : 'لا'}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {exerciseType === 'support_with_results' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>النتائج المتوقعة *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddResult}
                  >
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة نتيجة
                  </Button>
                </div>

                <div className="space-y-3">
                  {expectedResults.map((result, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <div className="flex-1 grid gap-3 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label>رقم السؤال</Label>
                              <Input
                                placeholder="1"
                                value={result.question}
                                onChange={(e) =>
                                  handleResultChange(index, 'question', e.target.value)
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>النتيجة الصحيحة</Label>
                              <Input
                                placeholder="مثال: 45 أو 3x - 5"
                                value={result.result}
                                onChange={(e) =>
                                  handleResultChange(index, 'result', e.target.value)
                                }
                              />
                            </div>
                          </div>
                          {expectedResults.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveResult(index)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {exerciseType === 'support_only' && (
              <div className="rounded-lg border border-muted bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">
                  ℹ️ هذا التمرين للعرض فقط. لن يتمكن التلاميذ من إدخال إجابات.
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جارٍ الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="ml-2 h-4 w-4" />
                    حفظ التمرين
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
