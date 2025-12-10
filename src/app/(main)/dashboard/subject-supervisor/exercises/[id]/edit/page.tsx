
'use client';

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
import { getLessons, getExerciseById, getUserById } from "@/lib/mock-data";
import { Save, UploadCloud } from "lucide-react";
import { notFound } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

// Mock current user ID. This would come from auth.
const MOCK_SUPERVISOR_ID = 7;

export default function EditSupervisorExercisePage({ params }: { params: { id: string } }) {
  const supervisor = getUserById(MOCK_SUPERVISOR_ID);
  if (!supervisor) return null;
  
  const lessons = getLessons().filter((l) => l.author_id === supervisor.id);
  const exercise = getExerciseById(Number(params.id));
  
  if (!exercise || !lessons.some(l => l.id === exercise.lesson_id)) {
    notFound();
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
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="lesson">الدرس المرتبط</Label>
              <Select defaultValue={String(exercise.lesson_id)}>
                <SelectTrigger id="lesson">
                  <SelectValue placeholder="اختر الدرس" />
                </SelectTrigger>
                <SelectContent>
                  {lessons.map((lesson) => (
                    <SelectItem key={lesson.id} value={String(lesson.id)}>
                      {lesson.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="question">نص السؤال</Label>
              <Textarea id="question" defaultValue={exercise.question} rows={5} />
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
              <Label htmlFor="model-answer">الإجابة النموذجية</Label>
              <Textarea id="model-answer" defaultValue={exercise.model_answer} rows={5} />
            </div>

            <div className="flex justify-end">
              <Button type="submit">
                <Save className="ml-2 h-4 w-4" />
                <span>حفظ التغييرات</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
