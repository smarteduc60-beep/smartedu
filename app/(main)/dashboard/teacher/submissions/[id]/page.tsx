
'use client';

import { notFound } from "next/navigation";
import { getSubmissionById, getExerciseById, getUserById } from "@/lib/mock-data";
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
  Save
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ReviewSubmissionPage({ params }: { params: { id: string } }) {
  const submission = getSubmissionById(Number(params.id));
  if (!submission) {
    notFound();
  }

  const exercise = getExerciseById(submission.exercise_id);
  const student = getUserById(submission.student_id);

  if (!exercise || !student) {
    notFound();
  }
  
  const getScoreVariant = (score: number) => {
    if (score >= 8) return 'default';
    if (score >= 5) return 'secondary';
    return 'destructive';
  }


  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <div className="grid gap-1">
            <h1 className="text-3xl font-bold tracking-tight">مراجعة إجابة الطالب</h1>
            <p className="text-muted-foreground">
                مراجعة إجابة الطالب "{student.name}" على تمرين "{exercise.question}".
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FileQuestion /> <span>التمرين</span></CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-medium">{exercise.question}</p>
                        {exercise.question_file_url && (
                            <div className="pt-4">
                                <Link href={exercise.question_file_url} target="_blank" passHref>
                                <Button variant="outline">
                                    <Paperclip className="ml-2 h-4 w-4" />
                                    <span>عرض ملف السؤال</span>
                                </Button>
                                </Link>
                            </div>
                        )}
                        <Separator className="my-4" />
                        <p className="text-sm text-muted-foreground">الإجابة النموذجية: {exercise.model_answer}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FileText /> <span>إجابة الطالب</span></CardTitle>
                    </CardHeader>
                    <CardContent>
                        {submission.answer && <p className="mb-4 p-4 bg-muted rounded-md">{submission.answer}</p>}
                        {submission.submission_file_url && (
                             <Link href={submission.submission_file_url} target="_blank" passHref>
                                <Button variant="secondary">
                                    <Paperclip className="ml-2 h-4 w-4" />
                                    <span>تحميل الملف المرفق من الطالب</span>
                                </Button>
                            </Link>
                        )}
                        {!submission.answer && !submission.submission_file_url && (
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
                            <AvatarImage src={student.avatar} alt={student.name} />
                            <AvatarFallback>{student.prenom.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><MessageSquare /><span>تقييم الذكاء الاصطناعي</span></CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>الدرجة المقترحة</Label>
                             <Badge variant={getScoreVariant(submission.score ?? 0)} className="block w-fit text-lg mt-1">
                                {submission.score ?? 'N/A'} / 10
                            </Badge>
                        </div>
                        <div>
                            <Label>الملاحظات</Label>
                            <p className="text-sm text-muted-foreground mt-1">{submission.ai_feedback ?? "لا توجد ملاحظات."}</p>
                        </div>
                    </CardContent>
                </Card>
                
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><CheckCircle /><span>التصحيح النهائي</span></CardTitle>
                        <CardDescription>يمكنك تعديل الدرجة وإضافة ملاحظاتك الخاصة.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2">
                            <Label htmlFor="final-score">الدرجة النهائية</Label>
                            <Input id="final-score" type="number" defaultValue={submission.score} min="0" max="10" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="teacher-notes">ملاحظات المعلم</Label>
                            <Textarea id="teacher-notes" placeholder="اكتب ملاحظاتك للطالب هنا..." rows={4} />
                        </div>
                        <Button className="w-full">
                            <Save className="ml-2 h-4 w-4" />
                            <span>حفظ التصحيح</span>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
