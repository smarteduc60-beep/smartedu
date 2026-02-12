'use client';

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BookCopy, FileQuestion, PlusCircle, Eye, Loader2, Users } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface DashboardData {
  supervisor: {
    id: string;
    name: string;
    email: string;
    subject: {
      id: number;
      name: string;
    };
    level: {
      id: number;
      name: string;
      stage: {
        id: number;
        name: string;
      };
    };
    allowMessaging: boolean;
    teacherCode: string | null;
  };
  stats: {
    lessons: number;
    exercises: number;
    teachers: number;
    students: number;
  };
  recentLessons: Array<{
    id: string;
    title: string;
    description: string | null;
    isPublic: boolean;
    levelName: string | null;
    stageName: string | null;
    exercisesCount: number;
    createdAt: string;
  }>;
}

export default function SubjectSupervisorDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/subject-supervisor/dashboard');
                const result = await response.json();

                if (result.success) {
                    setData(result.data);
                } else {
                    setError(result.error || 'فشل في جلب البيانات');
                }
            } catch (err) {
                setError('حدث خطأ أثناء جلب البيانات');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-lg text-muted-foreground">{error || 'لم يتم العثور على مشرف المادة أو المادة'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div className="grid gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">
                        لوحة تحكم مشرف مادة "{data.supervisor.subject.name}"
                    </h1>
                    <p className="text-muted-foreground">
                        مرحباً بك، {data.supervisor.name}! مشرف {data.supervisor.level.name} - {data.supervisor.level.stage.name}
                    </p>
                </div>
                 <Link href="/dashboard/subject-supervisor/lessons/create" passHref>
                    <Button>
                        <PlusCircle className="ml-2 h-4 w-4" />
                        <span>إنشاء درس عام جديد</span>
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">إجمالي الدروس</CardTitle>
                        <BookCopy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.stats.lessons}</div>
                        <p className="text-xs text-muted-foreground">دروس قمت بإنشائها</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">إجمالي التمارين</CardTitle>
                        <FileQuestion className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.stats.exercises}</div>
                        <p className="text-xs text-muted-foreground">في دروسك</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">المعلمون</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.stats.teachers}</div>
                        <p className="text-xs text-muted-foreground">يدرّسون المادة</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">الطلاب</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.stats.students}</div>
                        <p className="text-xs text-muted-foreground">يدرسون المادة</p>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>أحدث الدروس</CardTitle>
                            <CardDescription>هذه هي أحدث الدروس التي قمت بإضافتها</CardDescription>
                        </div>
                        <Link href="/dashboard/subject-supervisor/lessons">
                            <Button variant="outline" size="sm">
                                عرض الكل
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>عنوان الدرس</TableHead>
                                <TableHead>المستوى</TableHead>
                                <TableHead>التمارين</TableHead>
                                <TableHead>النوع</TableHead>
                                <TableHead className="text-center">الإجراءات</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {data.recentLessons.length > 0 ? (
                            data.recentLessons.map(lesson => (
                                <TableRow key={lesson.id}>
                                    <TableCell className="font-medium">{lesson.title}</TableCell>
                                    <TableCell>
                                        {lesson.levelName && lesson.stageName 
                                            ? `${lesson.stageName} - ${lesson.levelName}`
                                            : 'غير محدد'
                                        }
                                    </TableCell>
                                    <TableCell>{lesson.exercisesCount}</TableCell>
                                    <TableCell>
                                        <Badge variant={lesson.isPublic ? "default" : "outline"}>
                                            {lesson.isPublic ? 'عام' : 'خاص'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Link href={`/lessons/${lesson.id}`}>
                                            <Button variant="ghost" size="sm">
                                                <Eye className="ml-2 h-4 w-4" />
                                                معاينة
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">
                                    لم تقم بإنشاء أي دروس بعد.
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
