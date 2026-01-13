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
import { Book, CheckCircle, ClipboardList, PlusCircle, Users, Link as LinkIcon, FileQuestion, MessageSquare, Copy, Loader2 } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import OnboardingTour from "./OnboardingTour";
import TeacherChecklist from "./TeacherChecklist";


export default function TeacherDashboard() {
    const { toast } = useToast();
    const { data: session, status } = useSession();
    const [stats, setStats] = useState({
        lessons: 0,
        students: 0,
        exercises: 0,
        submissions: 0,
    });
    const [loading, setLoading] = useState(true);
    const [teacherCode, setTeacherCode] = useState('');
    const [generatingCode, setGeneratingCode] = useState(false);
    const [allowMessaging, setAllowMessaging] = useState(false);
    const [togglingMessaging, setTogglingMessaging] = useState(false);

    useEffect(() => {
        if (session?.user) {
            fetchDashboardData();
        }
    }, [session]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/teachers/dashboard');
            const result = await response.json();
            
            if (result.success) {
                setTeacherCode(result.data.teacher.teacherCode || '');
                setAllowMessaging(result.data.teacher.allowMessaging || false);
                setStats({
                    lessons: result.data.stats.lessons,
                    students: result.data.stats.students,
                    exercises: result.data.stats.exercises,
                    submissions: result.data.stats.submissions,
                });
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleMessaging = async () => {
        try {
            setTogglingMessaging(true);
            const response = await fetch('/api/teachers/toggle-messaging', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ allowMessaging: !allowMessaging }),
            });
            const result = await response.json();
            
            if (result.success) {
                setAllowMessaging(!allowMessaging);
                toast({
                    title: "تم التحديث",
                    description: result.data.message,
                });
            }
        } catch (error) {
            console.error('Error toggling messaging:', error);
            toast({
                title: "خطأ",
                description: "فشل تحديث الإعداد",
                variant: "destructive",
            });
        } finally {
            setTogglingMessaging(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!session?.user) {
        return <div>لم يتم العثور على المعلم.</div>;
    }

    const handleCopy = () => {
        const code = teacherCode || 'N/A';
        navigator.clipboard.writeText(code);
        toast({
            title: "تم النسخ!",
            description: "تم نسخ كود الربط إلى الحافظة.",
        });
    };

    const handleGenerateCode = async () => {
        try {
            setGeneratingCode(true);
            const response = await fetch('/api/users/generate-teacher-code', {
                method: 'POST',
            });
            const result = await response.json();
            
            if (result.success && result.data?.teacherCode) {
                setTeacherCode(result.data.teacherCode);
                // Refresh dashboard data
                await fetchDashboardData();
                toast({
                    title: "تم التوليد بنجاح!",
                    description: "تم توليد كود ربط جديد وفك ارتباط التلاميذ السابقين.",
                });
            } else {
                toast({
                    title: "فشل التوليد",
                    description: result.error || "حدث خطأ",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Error generating code:', error);
            toast({
                title: "فشل التوليد",
                description: "حدث خطأ أثناء توليد الكود",
                variant: "destructive",
            });
        } finally {
            setGeneratingCode(false);
        }
    };

    // تعريف خطوات الجولة التعريفية للمعلم
    const tourSteps = [
        {
            element: '#teacher-welcome',
            popover: {
                title: 'مرحباً بك في SmartEdu! 👋',
                description: 'هذه لوحة التحكم الخاصة بك. دعنا نأخذ جولة سريعة.',
                side: 'bottom',
                align: 'start'
            }
        },
        {
            element: '#create-lesson-btn',
            popover: {
                title: 'إضافة الدروس والتمارين',
                description: 'من هنا يمكنك إنشاء درس جديد، وداخل الدرس يمكنك إضافة التمارين والواجبات للطلاب.',
                side: 'bottom'
            }
        },
        {
            element: '#teacher-code-card',
            popover: {
                title: 'كود الربط',
                description: 'هذا الكود مهم جداً! شاركه مع طلابك ليتمكنوا من الانضمام إليك.',
                side: 'top'
            }
        },
        {
            element: '#teacher-stats',
            popover: {
                title: 'الإحصائيات',
                description: 'تابع تقدمك وعدد طلابك وتفاعلهم من هنا.',
                side: 'top'
            }
        },
        {
            element: '#teacher-exercises-link',
            popover: {
                title: 'إدارة التمارين',
                description: 'من هنا يمكنك إضافة تمارين جديدة وتصحيح إجابات الطلاب.',
                side: 'top'
            }
        }
    ];

    // Display submission stats
    const totalSubmissions = stats.submissions;
    const gradedSubmissions = 0; // TODO: Filter graded submissions
    const pendingSubmissions = totalSubmissions; // For now, all are pending
    const unreadMessages = 0; // TODO: Fetch from messages API

    return (
        <div className="flex flex-col gap-8">
            <OnboardingTour steps={tourSteps} tourKey="teacher-dashboard-tour-v2" />
            <TeacherChecklist stats={stats} teacherCode={teacherCode} />

            <div className="flex items-center justify-between">
                <div className="grid gap-1" id="teacher-welcome">
                    <h1 className="text-3xl font-bold tracking-tight">
                        مرحباً بك أستاذ، {session?.user?.name || 'المعلم'}!
                    </h1>
                    <p className="text-muted-foreground">
                        هذه لوحة التحكم الخاصة بك لإدارة المحتوى التعليمي والطلاب.
                    </p>
                </div>
                <Link href="/dashboard/teacher/lessons/create" passHref>
                    <Button id="create-lesson-btn">
                        <PlusCircle className="ml-2 h-4 w-4" />
                        <span>إنشاء درس جديد</span>
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4" id="teacher-stats">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">الدروس المضافة</CardTitle>
                        <Book className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.lessons}</div>
                        <p className="text-xs text-muted-foreground">إجمالي الدروس التي قمت بإنشائها</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">الطلاب المرتبطون</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.students}</div>
                        <p className="text-xs text-muted-foreground">عدد الطلاب المرتبطين بك</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">التمارين</CardTitle>
                        <FileQuestion className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.exercises}</div>
                        <p className="text-xs text-muted-foreground">إجمالي التمارين المضافة</p>
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
                 <Card id="teacher-code-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LinkIcon className="text-primary" />
                            <span>كود الربط الخاص بك</span>
                        </CardTitle>
                        <CardDescription>
                            شارك هذا الكود مع طلابك لربطهم بحسابك.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Input readOnly value={teacherCode || 'لم يتم التوليد بعد'} className="text-lg font-mono tracking-widest text-center" />
                            <Button variant="outline" onClick={handleCopy} disabled={!teacherCode}>
                                <Copy className="ml-2 h-4 w-4" />
                                نسخ
                            </Button>
                            <Button variant="default" onClick={handleGenerateCode} disabled={generatingCode}>
                                {generatingCode ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <PlusCircle className="ml-2 h-4 w-4" />}
                                {teacherCode ? 'توليد جديد' : 'توليد'}
                            </Button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-medium text-sm">التواصل مع أولياء الأمور</p>
                                    <p className="text-xs text-muted-foreground">السماح لأولياء الأمور بإرسال رسائل</p>
                                </div>
                            </div>
                            <Button 
                                variant={allowMessaging ? "default" : "outline"}
                                size="sm"
                                onClick={handleToggleMessaging}
                                disabled={togglingMessaging}
                            >
                                {togglingMessaging ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    allowMessaging ? 'مفعّل' : 'غير مفعّل'
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>روابط سريعة</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <Link href="/dashboard/teacher/lessons" passHref><Button variant="secondary" className="w-full justify-start">إدارة الدروس</Button></Link>
                        <Link href="/dashboard/teacher/students" passHref><Button variant="secondary" className="w-full justify-start">عرض الطلاب</Button></Link>
                        <Link href="/dashboard/teacher/submissions" passHref><Button variant="secondary" className="w-full justify-start" id="teacher-exercises-link">تصحيح الإجابات</Button></Link>
                        <Link href="/messages" passHref><Button variant="secondary" className="w-full justify-start">الرسائل</Button></Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
