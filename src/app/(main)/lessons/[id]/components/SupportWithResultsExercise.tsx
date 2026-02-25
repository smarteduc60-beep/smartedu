'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, RefreshCw, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import MathContent from "@/components/MathContent";
import Link from "next/link";

interface SupportWithResultsExerciseProps {
  exercise: {
    id: number;
    questionRichContent?: string;
    question?: string;
    questionFileUrl?: string;
    expectedResults?: any; // JSON array
  };
}

export default function SupportWithResultsExercise({ exercise }: SupportWithResultsExerciseProps) {
  const { toast } = useToast();
  
  // معالجة آمنة للنتائج المتوقعة سواء كانت نصاً أو مصفوفة
  let parsedResults: any[] = [];
  try {
    if (Array.isArray(exercise.expectedResults)) {
      parsedResults = exercise.expectedResults;
    } else if (typeof exercise.expectedResults === 'string') {
      parsedResults = JSON.parse(exercise.expectedResults);
    }
  } catch (e) {
    console.error("Failed to parse expectedResults", e);
  }
  const expectedResults = Array.isArray(parsedResults) ? parsedResults : [];

  const [studentAnswers, setStudentAnswers] = useState<Record<string, string>>(
    expectedResults.reduce((acc: any, item: any) => {
      acc[item.question] = '';
      return acc;
    }, {})
  );
  const [comparisonResults, setComparisonResults] = useState<Record<string, boolean> | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleAnswerChange = (questionNum: string, value: string) => {
    setStudentAnswers({
      ...studentAnswers,
      [questionNum]: value,
    });
  };

  const normalizeAnswer = (answer: string): string => {
    return answer
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '') // إزالة المسافات
      .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1632 + 48)) // تحويل الأرقام العربية
      .replace(/[^\w\d.+\-*/^()]/g, ''); // إزالة الرموز غير الرياضية
  };

  const compareAnswers = () => {
    const hasEmptyAnswers = Object.values(studentAnswers).some(answer => !answer.trim());
    
    if (hasEmptyAnswers) {
      toast({
        title: "تنبيه",
        description: "يرجى إدخال جميع الإجابات قبل المقارنة",
        variant: "destructive",
      });
      return;
    }

    const results: Record<string, boolean> = {};
    let correctCount = 0;

    expectedResults.forEach((expected: any) => {
      const studentAnswer = normalizeAnswer(studentAnswers[expected.question] || '');
      const expectedAnswer = normalizeAnswer(expected.result);
      
      const isCorrect = studentAnswer === expectedAnswer;
      results[expected.question] = isCorrect;
      
      if (isCorrect) correctCount++;
    });

    setComparisonResults(results);
    setShowResults(true);

    toast({
      title: "تمت المقارنة",
      description: `${correctCount} من ${expectedResults.length} إجابة صحيحة`,
    });
  };

  const resetExercise = () => {
    setStudentAnswers(
      expectedResults.reduce((acc: any, item: any) => {
        acc[item.question] = '';
        return acc;
      }, {})
    );
    setComparisonResults(null);
    setShowResults(false);
  };

  const correctCount = comparisonResults 
    ? Object.values(comparisonResults).filter(Boolean).length 
    : 0;
  const totalCount = expectedResults.length;
  const percentage = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* السؤال */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle>تمرين دعم + نتائج</CardTitle>
              <CardDescription>
                حل التمرين وقارن نتائجك مع الحل الصحيح
              </CardDescription>
            </div>
            <Badge variant="secondary">
              تدريب ذاتي
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <MathContent 
            content={exercise.questionRichContent || (exercise.question || '').replace(/\n/g, '<br />')} 
          />

          {exercise.questionFileUrl && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                ملف مرفق
              </p>
              {exercise.questionFileUrl.match(/\.(jpeg|jpg|gif|png|webp)($|\?|&)/i) || exercise.questionFileUrl.includes('api/images/proxy') ? (
                <div className="relative w-full overflow-hidden rounded-lg border bg-background">
                  <img 
                    src={exercise.questionFileUrl} 
                    alt="ملف التمرين" 
                    className="w-full h-auto max-h-[500px] object-contain"
                  />
                </div>
              ) : (
                <Link 
                  href={exercise.questionFileUrl} 
                  target="_blank" 
                  className="inline-flex items-center gap-2 text-primary hover:underline bg-background px-4 py-2 rounded-md border shadow-sm hover:bg-accent transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>عرض الملف المرفق</span>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* إدخال النتائج */}
      <Card>
        <CardHeader>
          <CardTitle>أدخل نتائجك</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {expectedResults.map((item: any, index: number) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor={`answer-${item.question}`} className="min-w-[100px]">
                  السؤال {item.question}:
                </Label>
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    id={`answer-${item.question}`}
                    placeholder="النتيجة"
                    value={studentAnswers[item.question] || ''}
                    onChange={(e) => handleAnswerChange(item.question, e.target.value)}
                    disabled={showResults}
                    className={
                      showResults && comparisonResults
                        ? comparisonResults[item.question]
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : ''
                    }
                  />
                  {showResults && comparisonResults && (
                    <>
                      {comparisonResults[item.question] ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </>
                  )}
                </div>
              </div>
              {showResults && comparisonResults && !comparisonResults[item.question] && (
                <div className="mr-[100px] text-sm text-muted-foreground bg-muted p-2 rounded">
                  الإجابة الصحيحة: <span className="font-semibold text-foreground">{item.result}</span>
                </div>
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-4">
            {!showResults ? (
              <Button onClick={compareAnswers} className="flex-1">
                <CheckCircle2 className="ml-2 h-4 w-4" />
                قارن النتائج
              </Button>
            ) : (
              <Button onClick={resetExercise} variant="outline" className="flex-1">
                <RefreshCw className="ml-2 h-4 w-4" />
                إعادة المحاولة
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* عرض النتيجة */}
      {showResults && comparisonResults && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>نتيجة المقارنة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>الإجابات الصحيحة</span>
                <span className="font-semibold">
                  {correctCount} من {totalCount}
                </span>
              </div>
              <Progress value={percentage} className="h-3" />
              <p className="text-center text-2xl font-bold text-primary">
                {percentage.toFixed(0)}%
              </p>
            </div>

            {percentage === 100 ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-green-800 font-semibold">
                  🎉 ممتاز! جميع إجاباتك صحيحة!
                </p>
              </div>
            ) : percentage >= 70 ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-blue-800 font-semibold">
                  👏 جيد جداً! راجع الإجابات الخاطئة وحاول مرة أخرى
                </p>
              </div>
            ) : (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <p className="text-orange-800 font-semibold">
                  💪 يمكنك تحسين نتيجتك! راجع الحلول وحاول مرة أخرى
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
