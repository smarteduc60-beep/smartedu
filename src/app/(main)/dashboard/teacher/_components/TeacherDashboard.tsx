'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTeacher, getLessons, getExercisesForLesson, USERS } from "@/lib/mock-data";
import { Book, CheckCircle, ClipboardList, PlusCircle, Users, Link as LinkIcon, FileQuestion, MessageSquare, Copy } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";


export default function TeacherDashboard({ teacherId = 2 }: { teacherId?: number }) {
    const { toast } = useToast();
    const teacher = getTeacher(teacherId);
    if (!teacher) return <div>لم يتم العثور على المعلم.</div>;

    const lessons = getLessons().filter(l => l.author_id === teacher.id);
    const exercises = lessons.flatMap(l => getExercisesForLesson(l.id));
    const students = USERS.filter(u => u.role === 'student' && u.connected_teacher_code === teacher.teacher_code);

    const handleCopy = () => {
        navigator.clipboard.writeText(teacher.teacher_code);
        toast({
            title: "تم النسخ!",
            description: "تم نسخ كود الربط إلى الحافظة.",
        });
    };

    // Mock data for exercise grading stats
    const totalSubmissions = 15;
    const gradedSubmissions = 10;
    const pendingSubmissions = 5;
    const unreadMessages = 1; // Mock unread messages

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div className="grid gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">
                        مرحباً بك أستاذ، {teacher?.prenom}!
                    </h1>
                    <p className="text-muted-foreground">
                        هذه لوحة التحكم الخاصة بك لإدارة المحتوى التعليمي والطلاب.
                    </p>
                </div>
                <Link href="/dashboard/teacher/lessons/create" passHref>
                    <Button>
                        <PlusCircle className="ml-2 h-4 w-4" />
                        <span>إنشاء درس جديد</span>
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">الدروس المضافة</CardTitle>
                        <Book className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{lessons.length}</div>
                        <p className="text-xs text-muted-foreground">إجمالي الدروس التي قمت بإنشائها</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">الطلاب المرتبطون</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{students.length}</div>
                        <p className="text-xs text-muted-foreground">عدد الطلاب المرتبطين بك</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">إجابات الطلاب</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalSubmissions}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">{gradedSubmissions} مصححة</span>, <span className="text-yellow-600">{pendingSubmissions} بانتظار</span>
                        </p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">الرسائل الجديدة</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{unreadMessages}</div>
                        <p className="text-xs text-muted-foreground">لديك رسائل من أولياء الأمور</p>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LinkIcon className="text-primary" />
                            <span>كود الربط الخاص بك</span>
                        </CardTitle>
                        <CardDescription>
                            شارك هذا الكود مع طلابك لربطهم بحسابك.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center gap-4">
                        <Input readOnly defaultValue={teacher.teacher_code} className="text-lg font-mono tracking-widest text-center" />
                        <Button variant="outline" onClick={handleCopy}>
                            <Copy className="ml-2 h-4 w-4" />
                            نسخ الكود
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>روابط سريعة</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <Link href="/dashboard/teacher/lessons" passHref><Button variant="secondary" className="w-full justify-start">إدارة الدروس</Button></Link>
                        <Link href="/dashboard/teacher/students" passHref><Button variant="secondary" className="w-full justify-start">عرض الطلاب</Button></Link>
                        <Link href="/dashboard/teacher/submissions" passHref><Button variant="secondary" className="w-full justify-start">تصحيح الإجابات</Button></Link>
                        <Link href="/messages" passHref><Button variant="secondary" className="w-full justify-start">الرسائل</Button></Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
