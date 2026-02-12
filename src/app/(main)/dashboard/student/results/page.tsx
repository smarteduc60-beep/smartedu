'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

type Submission = {
  id: number;
  score: number | null;
  aiFeedback: string | null;
  submittedAt: string;
  exercise: {
    id: number;
    question: string;
    lesson: {
      id: number;
      title: string;
    };
  };
};

export default function MyResultsPage() {
    const { data: session } = useSession();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const fetchResults = async () => {
        try {
          setIsLoading(true);
          const response = await fetch('/api/students/results');
          const result = await response.json();
          if (result.success) {
            setSubmissions(result.data.submissions);
          }
        } catch (error) {
          console.error('Error fetching results:', error);
        } finally {
          setIsLoading(false);
        }
      };

      if (session?.user) {
        fetchResults();
      }
    }, [session]);

    const getScoreVariant = (score: number) => {
        if (score >= 8) return 'default';
        if (score >= 5) return 'secondary';
        return 'destructive';
    };

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="grid gap-1">
                <h1 className="text-3xl font-bold tracking-tight">نتائجي</h1>
                <p className="text-muted-foreground">
                    هنا يمكنك عرض جميع إجاباتك ونتائجك في التمارين.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>سجل الإجابات</CardTitle>
                    <CardDescription>
                        قائمة بجميع التمارين التي قمت بحلها والدرجات التي حصلت عليها.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>التمرين</TableHead>
                                <TableHead>الدرجة</TableHead>
                                <TableHead className="hidden md:table-cell">التقييم</TableHead>
                                <TableHead className="hidden md:table-cell text-center">تاريخ الإجابة</TableHead>
                                <TableHead className="text-center">الإجراء</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {submissions.length > 0 ? (
                            submissions.map((submission) => {
                                return (
                                    <TableRow key={submission.id}>
                                        <TableCell className="font-medium max-w-sm truncate">
                                            <p>{submission.exercise.question}</p>
                                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                <BookOpen className="h-3 w-3" />
                                                {submission.exercise.lesson.title}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getScoreVariant(submission.score ?? 0)}>
                                                {submission.score ?? 0}/10
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground max-w-xs truncate">
                                            {submission.aiFeedback || 'لم يتم التقييم بعد'}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-center text-muted-foreground">
                                           {format(new Date(submission.submittedAt), "d MMMM yyyy", { locale: ar })}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Link href={`/lessons/${submission.exercise.lesson.id}`} passHref>
                                                <Button variant="ghost" size="icon" title="عرض الدرس">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    لم تقم بحل أي تمارين بعد.
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

