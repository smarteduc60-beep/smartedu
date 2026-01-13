'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

interface TeacherChecklistProps {
  stats: {
    lessons: number;
    students: number;
  };
  teacherCode: string | null;
}

export default function TeacherChecklist({ stats, teacherCode }: TeacherChecklistProps) {
  const steps = [
    {
      id: 'code',
      label: 'توليد كود الربط',
      completed: !!teacherCode,
      link: '/dashboard/teacher', // الرابط في نفس الصفحة (قسم الكود)
      action: 'توليد'
    },
    {
      id: 'lesson',
      label: 'إنشاء أول درس',
      completed: stats.lessons > 0,
      link: '/dashboard/teacher/lessons/create',
      action: 'إنشاء'
    },
    {
      id: 'students',
      label: 'دعوة الطلاب (مشاركة الكود)',
      completed: stats.students > 0,
      link: '/dashboard/teacher',
      action: 'نسخ الكود'
    }
  ];

  const completedCount = steps.filter(s => s.completed).length;
  const progress = Math.round((completedCount / steps.length) * 100);

  // إخفاء القائمة إذا اكتملت جميع المهام
  if (progress === 100) return null;

  return (
    <Card className="border-primary/20 bg-primary/5 mb-8 animate-in fade-in slide-in-from-top-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>🚀 ابدأ رحلتك التعليمية</span>
          <span className="text-sm font-normal text-muted-foreground">{progress}% مكتمل</span>
        </CardTitle>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-background/50 transition-colors">
              <div className="flex items-center gap-3">
                {step.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
                <span className={step.completed ? "line-through text-muted-foreground" : "font-medium"}>
                  {step.label}
                </span>
              </div>
              {!step.completed && (
                <Button variant="outline" size="sm" asChild className="h-8">
                  <Link href={step.link}>
                    {step.action}
                    <ArrowLeft className="mr-1 h-3 w-3" />
                  </Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}