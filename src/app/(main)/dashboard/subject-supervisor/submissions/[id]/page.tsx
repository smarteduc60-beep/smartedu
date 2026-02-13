'use client';

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { useSubmission } from "@/hooks/use-submission";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  FileQuestion,
  User,
  CheckCircle,
  MessageSquare,
  FileText,
  Paperclip,
  Save,
  Brain,
  Loader2,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MathContent from "@/components/MathContent";

export default function ReviewSubmissionPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { submission, isLoading, error, refetch, updateSubmission } = useSubmission(id);
  const { toast } = useToast();

  const [teacherNotes, setTeacherNotes] = useState<string>("");
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [isSavingManualGrade, setIsSavingManualGrade] = useState(false);

  const [isEvaluatingAI, setIsEvaluatingAI] = useState(false);
  const [aiEvaluationResult, setAiEvaluationResult] = useState<any | null>(null);

  useEffect(() => {
    if (submission) {
      setTeacherNotes(submission.teacherNotes || "");
      // Prioritize finalScore, then aiScore, then null
      setFinalScore(submission.finalScore ?? submission.aiScore ?? null); 
      if (submission.aiFeedback && submission.aiScore) {
        setAiEvaluationResult({
          score: submission.aiScore,
          feedback: submission.aiFeedback,
          // If detailed strengths/weaknesses are stored, retrieve them here
        });
      }
    }
  }, [submission]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive text-center mt-8">خطأ في تحميل الإجابة: {error}</div>;
  }

  if (!submission) {
    notFound();
  }

  const exercise = submission.exercise;
  const student = submission.student;

  // Use aiEvaluationResult if available, otherwise submission's stored AI evaluation, otherwise null
  const displayedAiScore = aiEvaluationResult?.score ?? submission.aiScore;
  const displayedAiFeedback = aiEvaluationResult?.feedback ?? submission.aiFeedback;
  const displayedAiStrengths = aiEvaluationResult?.strengths;
  const displayedAiWeaknesses = aiEvaluationResult?.weaknesses;

  const getScoreVariant = (score: number | null) => {
    if (score === null) return 'secondary';
    // Use exercise.maxScore, default to 10 if not available
    const max = exercise?.maxScore || 10;
    if (score >= max * 0.8) return 'default'; // 80% or more
    if (score >= max * 0.5) return 'secondary'; // 50% or more
    return 'destructive'; // Less than 50%
  };

  const handleAutoEvaluate = async () => {
    if (!submission || !exercise || !student) {
      toast({
        title: "خطأ",
        description: "بيانات الإجابة أو التمرين أو الطالب غير مكتملة.",
        variant: "destructive",
      });
      return;
    }

    if (exercise.type !== 'main') {
      toast({
        title: "غير متاح",
        description: "التصحيح بالذكاء الاصطناعي متاح فقط للتمارين الرئيسية.",
        variant: "info",
      });
      return;
    }

    if (!exercise.modelAnswer) {
      toast({
        title: "خطأ",
        description: "لا يوجد حل نموذجي لهذا التمرين لتتمكن AI من تقييمه.",
        variant: "destructive",
      });
      return;
    }

    if (!submission.answer) {
      toast({
        title: "خطأ",
        description: "لا توجد إجابة من الطالب لتقييمها بواسطة AI.",
        variant: "destructive",
      });
      return;
    }

    setIsEvaluatingAI(true);
    try {
      const response = await fetch('/api/ai/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: exercise.questionRichContent,
          modelAnswer: exercise.modelAnswer,
          studentAnswer: submission.answer,
          maxScore: exercise.maxScore || 10, // Default to 10 if not set
          subject: exercise.lesson.subject.name,
          level: exercise.lesson.level.name,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setAiEvaluationResult(result.data); // Store AI's full evaluation
        setFinalScore(result.data.score); // Pre-fill final score with AI score

        // Update the submission in the database with AI results
        await updateSubmission({
          aiScore: result.data.score,
          aiFeedback: result.data.feedback,
          // Optionally save strengths/weaknesses if schema supports it
        });

        toast({
          title: "تم التقييم بنجاح",
          description: "تم تقييم إجابة الطالب بواسطة الذكاء الاصطناعي.",
        });
      } else {
        throw new Error(result.error || "فشل في تقييم الإجابة بواسطة الذكاء الاصطناعي");
      }
    } catch (err: any) {
      toast({
        title: "خطأ في التقييم بالذكاء الاصطناعي",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsEvaluatingAI(false);
    }
  };

  const handleSaveManualGrade = async () => {
    if (!submission) return;

    setIsSavingManualGrade(true);
    try {
      const { success, error: updateError } = await updateSubmission({
        finalScore: finalScore,
        teacherNotes: teacherNotes,
        gradedAt: new Date().toISOString(),
        gradedById: submission.gradedById, // Assuming the current user ID is handled on the API
      });

      if (success) {
        toast({
          title: "تم الحفظ بنجاح",
          description: "تم حفظ الدرجة والملاحظات.",
        });
        refetch(); // Refetch to get the latest state including gradedById if it's set by API
      } else {
        throw new Error(updateError || "فشل في حفظ التقييم اليدوي.");
      }
    } catch (err: any) {
      toast({
        title: "خطأ في الحفظ",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsSavingManualGrade(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="grid gap-1">
        <h1 className="text-3xl font-bold tracking-tight">مراجعة إجابة الطالب</h1>
        <p className="text-muted-foreground">
          مراجعة إجابة الطالب "{student.name}" على تمرين "{exercise.questionRichContent}".
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileQuestion /> <span>التمرين</span></CardTitle>
            </CardHeader>
            <CardContent>
              <MathContent content={exercise.questionRichContent} className="text-lg font-medium mb-2" />
              {/* <p className="text-lg font-medium">{exercise.questionRichContent}</p> */}
              {/* exercise.question_file_url should be exercise.fileUrl in the new schema */}
              {/* {exercise.fileUrl && (
                <div className="pt-4">
                  <Link href={exercise.fileUrl} target="_blank" passHref>
                    <Button variant="outline">
                      <Paperclip className="ml-2 h-4 w-4" />
                      <span>عرض ملف السؤال</span>
                    </Button>
                  </Link>
                </div>
              )} */}
              <Separator className="my-4" />
              <Label className="text-sm text-muted-foreground">الإجابة النموذجية:</Label>
              {exercise.modelAnswer ? (
                 <MathContent content={exercise.modelAnswer} className="text-sm" />
              ) : (
                <p className="text-sm text-muted-foreground">لا يوجد حل نموذجي لهذا التمرين.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText /> <span>إجابة الطالب</span></CardTitle>
            </CardHeader>
            <CardContent>
              {submission.answer ? (
                <MathContent content={submission.answer} className="mb-4 p-4 bg-muted rounded-md" />
              ) : (
                <p className="text-muted-foreground">لم يقدم الطالب إجابة نصية.</p>
              )}
              {submission.fileUrl && ( // submission.fileUrl
                <Link href={submission.fileUrl} target="_blank" passHref>
                  <Button variant="secondary">
                    <Paperclip className="ml-2 h-4 w-4" />
                    <span>تحميل الملف المرفق من الطالب</span>
                  </Button>
                </Link>
              )}
              {!submission.answer && !submission.fileUrl && (
                <p className="text-muted-foreground">لم يقدم الطالب إجابة نصية أو ملف.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><User /><span>الطالب</span></CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={student.image || ""} alt={student.name} /> {/* student.image */}
                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{student.name}</p>
                <p className="text-sm text-muted-foreground">{student.email}</p>
              </div>
            </CardContent>
          </Card>

          {exercise.type === 'main' && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="flex items-center gap-2"><MessageSquare /><span>تقييم الذكاء الاصطناعي</span></CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAutoEvaluate}
                  disabled={isEvaluatingAI || !exercise.modelAnswer || !submission.answer}
                  className="shrink-0"
                >
                  {isEvaluatingAI ? (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Brain className="ml-2 h-4 w-4" />
                  )}
                  تقييم تلقائي
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>الدرجة المقترحة من AI</Label>
                  <Badge variant={getScoreVariant(displayedAiScore)} className="block w-fit text-lg mt-1">
                    {displayedAiScore !== null ? `${displayedAiScore} / ${exercise.maxScore || 10}` : 'N/A'}
                  </Badge>
                </div>
                <div>
                  <Label>ملاحظات AI</Label>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {displayedAiFeedback ? (
                      <MathContent content={displayedAiFeedback} />
                    ) : (
                      "لا توجد ملاحظات من الذكاء الاصطناعي."
                    )}
                  </div>
                </div>
                {displayedAiStrengths && displayedAiStrengths.length > 0 && (
                  <div>
                    <Label>نقاط القوة (AI)</Label>
                    <ul className="list-disc pl-5 mt-1 text-sm text-muted-foreground">
                      {displayedAiStrengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                )}
                {displayedAiWeaknesses && displayedAiWeaknesses.length > 0 && (
                  <div>
                    <Label>نقاط الضعف (AI)</Label>
                    <ul className="list-disc pl-5 mt-1 text-sm text-muted-foreground">
                      {displayedAiWeaknesses.map((w: string, i: number) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CheckCircle /><span>التصحيح النهائي</span></CardTitle>
              <CardDescription>يمكنك تعديل الدرجة وإضافة ملاحظاتك الخاصة.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="final-score">الدرجة النهائية (من {exercise.maxScore || 10})</Label>
                <Input
                  id="final-score"
                  type="number"
                  defaultValue={finalScore ?? undefined}
                  value={finalScore ?? ''}
                  onChange={(e) => setFinalScore(e.target.value === '' ? null : parseFloat(e.target.value))}
                  min="0"
                  max={exercise.maxScore || 10}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacher-notes">ملاحظات المعلم</Label>
                <Textarea
                  id="teacher-notes"
                  placeholder="اكتب ملاحظاتك للطالب هنا..."
                  rows={4}
                  value={teacherNotes}
                  onChange={(e) => setTeacherNotes(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={handleSaveManualGrade} disabled={isSavingManualGrade}>
                {isSavingManualGrade ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جارٍ الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="ml-2 h-4 w-4" />
                    حفظ التصحيح
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
