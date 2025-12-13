'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import MathContent from "@/components/MathContent";

interface SupportOnlyExerciseProps {
  exercise: {
    id: number;
    questionRichContent?: string;
    question?: string;
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
