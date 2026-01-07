'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Send, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/editor";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import MathContent from "@/components/MathContent";

interface MainExerciseProps {
  exercise: {
    id: number;
    questionRichContent?: string;
    question?: string;
    modelAnswer?: string;
    modelAnswerImage?: string;
    maxScore?: number;
    allowRetry?: boolean;
    maxAttempts?: number;
  };
  studentId: string;
  onSubmissionComplete?: () => void;
}

export default function MainExercise({ exercise, studentId, onSubmissionComplete }: MainExerciseProps) {
  const { toast } = useToast();
  const [answer, setAnswer] = useState('');
  const [answerImage, setAnswerImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submission, setSubmission] = useState<any>(null);
  const [attempts, setAttempts] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number | null>(null);

  useEffect(() => {
    fetchSubmissionHistory();
  }, [exercise.id]);

  const fetchSubmissionHistory = async () => {
    try {
      const response = await fetch(`/api/submissions?exerciseId=${exercise.id}&studentId=${studentId}`);
      const result = await response.json();
      
      if (result.success && result.submissions?.length > 0) {
        const sorted = result.submissions.sort((a: any, b: any) => 
          (b.aiScore || 0) - (a.aiScore || 0)
        );
        setAttempts(result.submissions.length);
        setBestScore(sorted[0]?.aiScore || null);
        setSubmission(sorted[0]);
      }
    } catch (error) {
      console.error('Error fetching submission history:', error);
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim() && !answerImage) {
      toast({
        title: "خطأ",
        description: "يرجى كتابة إجابة أو إضافة صورة",
        variant: "destructive",
      });
      return;
    }

    if (exercise.maxAttempts && attempts >= exercise.maxAttempts) {
      toast({
        title: "تجاوزت الحد الأقصى",
        description: `لقد استخدمت جميع المحاولات المتاحة (${exercise.maxAttempts})`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionData = {
        exerciseId: exercise.id,
        answerRichContent: answer,
        submissionFileUrl: answerImage || null,
        attemptNumber: attempts + 1,
      };

      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "تم الإرسال",
          description: "جارٍ تصحيح إجابتك بالذكاء الاصطناعي...",
        });

        // طلب التصحيح بالـ AI
        const aiResponse = await fetch(`/api/submissions/${result.data.id}/evaluate`, {
          method: 'POST',
        });

        const aiResult = await aiResponse.json();

        if (aiResult.success) {
          setSubmission(aiResult.data);
          setAttempts(attempts + 1);
          
          if (!bestScore || (aiResult.data.aiScore > bestScore)) {
            setBestScore(aiResult.data.aiScore);
          }

          toast({
            title: "تم التصحيح",
            description: `حصلت على ${aiResult.data.aiScore} من ${exercise.maxScore}`,
          });

          if (onSubmissionComplete) {
            onSubmissionComplete();
          }
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء إرسال الإجابة",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswer('');
    setAnswerImage('');
    setSubmission(null);
  };

  const canRetry = exercise.allowRetry && 
                   (!exercise.maxAttempts || attempts < exercise.maxAttempts);

  return (
    <div className="space-y-6">
      {/* السؤال */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle>التمرين الرئيسي</CardTitle>
              <CardDescription>
                النقطة القصوى: {exercise.maxScore || 20} - المحاولات: {attempts}/{exercise.maxAttempts || '∞'}
              </CardDescription>
            </div>
            {bestScore !== null && (
              <Badge variant="default" className="text-lg px-4 py-2">
                أفضل نتيجة: {bestScore}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {exercise.questionRichContent ? (
            <MathContent content={exercise.questionRichContent} />
          ) : (
            <p className="whitespace-pre-wrap">{exercise.question}</p>
          )}
        </CardContent>
      </Card>

      {/* منطقة الإجابة */}
      {!submission || canRetry ? (
        <Card>
          <CardHeader>
            <CardTitle>إجابتك</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RichTextEditor
              content={answer}
              onChange={setAnswer}
              placeholder="اكتب إجابتك هنا..."
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">رابط صورة الإجابة (اختياري)</label>
              <Input
                type="url"
                placeholder="https://example.com/answer.jpg"
                value={answerImage}
                onChange={(e) => setAnswerImage(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جارٍ الإرسال...
                  </>
                ) : (
                  <>
                    <Send className="ml-2 h-4 w-4" />
                    إرسال الإجابة
                  </>
                )}
              </Button>

              {submission && canRetry && (
                <Button 
                  variant="outline" 
                  onClick={handleRetry}
                >
                  <RotateCcw className="ml-2 h-4 w-4" />
                  محاولة جديدة
                </Button>
              )}
            </div>

            {!canRetry && attempts > 0 && (
              <Alert>
                <AlertDescription>
                  لقد استخدمت جميع المحاولات المتاحة. أفضل نتيجة لك: {bestScore}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      ) : null}

      {/* نتيجة التصحيح */}
      {submission && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>نتيجة التصحيح</CardTitle>
              <Badge 
                variant={submission.aiScore >= (exercise.maxScore || 20) * 0.7 ? "default" : "destructive"}
                className="text-lg px-4 py-2"
              >
                {submission.aiScore} / {exercise.maxScore || 20}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* عرض الإجابة النموذجية */}
            {exercise.modelAnswer && (
              <div className="space-y-2">
                <h4 className="font-semibold text-lg">الإجابة النموذجية:</h4>
                <div 
                  className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800 select-none"
                  onContextMenu={(e) => e.preventDefault()}
                  style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
                >
                  <MathContent content={exercise.modelAnswer} />
                </div>
              </div>
            )}

            {submission.aiFeedback && (
              <div className="space-y-2">
                <h4 className="font-semibold">ملاحظات الذكاء الاصطناعي:</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{submission.aiFeedback}</p>
                </div>
              </div>
            )}

            {canRetry && (
              <Button 
                variant="outline" 
                onClick={handleRetry}
                className="w-full"
              >
                <RotateCcw className="ml-2 h-4 w-4" />
                محاولة جديدة لتحسين النتيجة
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}









            