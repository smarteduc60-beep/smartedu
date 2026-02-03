'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ExternalLink } from "lucide-react";
import MathContent from "@/components/MathContent";
import Link from "next/link";

interface SupportOnlyExerciseProps {
  exercise: {
    id: number;
    questionRichContent?: string;
    question?: string;
    questionFileUrl?: string;
  };
}

export default function SupportOnlyExercise({ exercise }: SupportOnlyExerciseProps) {
  return (
    <div className="space-y-6">
      {/* السؤال */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle>تمرين دعم للمراجعة</CardTitle>
              <CardDescription>
                تمرين للدراسة الذاتية - لا يمكن إدخال إجابات
              </CardDescription>
            </div>
            <Badge variant="outline">
              <BookOpen className="ml-2 h-4 w-4" />
              عرض فقط
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {exercise.questionRichContent ? (
            <MathContent content={exercise.questionRichContent} />
          ) : (
            <p className="whitespace-pre-wrap">{exercise.question}</p>
          )}

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

      {/* ملاحظة */}
      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium">تمرين للمراجعة الذاتية</p>
              <p className="text-sm text-muted-foreground">
                هذا التمرين مخصص للمراجعة والتدريب الشخصي. يمكنك حله على ورقة خارجية ومراجعة الحل مع أستاذك.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
