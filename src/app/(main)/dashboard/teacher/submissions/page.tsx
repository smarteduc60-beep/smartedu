
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSubmissionsForTeacher, getUserById, getExerciseById } from "@/lib/mock-data";
import { Eye, Clock } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

// Mock current teacher ID
const MOCK_TEACHER_ID = 2;

export default function SubmissionsPage() {
    const submissions = getSubmissionsForTeacher(MOCK_TEACHER_ID);
    const pendingSubmissions = submissions.filter(s => s.status === 'pending');

    const getScoreVariant = (score: number) => {
        if (score >= 8) return 'default';
        if (score >= 5) return 'secondary';
        return 'destructive';
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">تصحيح التمارين</h1>
                <Badge variant="destructive" className="flex gap-1">
                    <Clock className="h-4 w-4"/>
                    {pendingSubmissions.length} بانتظار المراجعة
                </Badge>
            </div>

             <Card>
                <CardHeader>
                    <CardTitle>الإجابات المرسلة</CardTitle>
                    <CardDescription>
                       مراجعة وتصحيح إجابات الطلاب على التمارين.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>الطالب</TableHead>
                                <TableHead>التمرين</TableHead>
                                <TableHead>التقييم الأولي (AI)</TableHead>
                                <TableHead>تاريخ الإرسال</TableHead>
                                <TableHead className="text-left">الإجراء</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {pendingSubmissions.length > 0 ? (
                            pendingSubmissions.map(submission => {
                                const student = getUserById(submission.student_id);
                                const exercise = getExerciseById(submission.exercise_id);
                                if (!student || !exercise) return null;

                                return (
                                <TableRow key={submission.id}>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell className="max-w-xs truncate">{exercise.question}</TableCell>
                                    <TableCell>
                                        <Badge variant={getScoreVariant(submission.score ?? 0)}>
                                            {submission.score ?? 'N/A'}/10
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {formatDistanceToNow(new Date(submission.submitted_at), { addSuffix: true, locale: ar })}
                                    </TableCell>
                                    <TableCell className="text-left">
                                        <Link href={`/dashboard/teacher/submissions/${submission.id}`} passHref>
                                            <Button variant="outline" size="sm">
                                                <Eye className="ml-2 h-4 w-4" />
                                                مراجعة
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                                )
                            })
                        ) : (
                             <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">
                                    لا توجد إجابات بانتظار التصحيح حالياً.
                                </TableCell>
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
