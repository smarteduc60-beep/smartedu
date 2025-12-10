
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
import { Users, BookCopy, BarChart3, Database, Settings, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface DirecteurStats {
    totalUsers: number;
    students: number;
    teachers: number;
    parents: number;
    lessons: number;
    subjects: number;
}

export default function DirecteurDashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<DirecteurStats>({
        totalUsers: 0,
        students: 0,
        teachers: 0,
        parents: 0,
        lessons: 0,
        subjects: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/directeur/stats');
                const result = await response.json();
                
                if (result.success) {
                    setStats(result.data);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div className="grid gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">
                        أهلاً بك، {session?.user?.name}!
                    </h1>
                    <p className="text-muted-foreground">
                        نظرة عامة على أداء المنصة التعليمية.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                        <p className="text-xs text-muted-foreground">جميع الأدوار</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">المعلمون والمشرفون</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.teachers}</div>
                        <p className="text-xs text-muted-foreground">إجمالي الطاقم التعليمي</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">الطلاب</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.students}</div>
                        <p className="text-xs text-muted-foreground">إجمالي الطلاب المسجلين</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">الدروس</CardTitle>
                        <BookCopy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.lessons}</div>
                         <p className="text-xs text-muted-foreground">إجمالي الدروس المنشأة</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">المواد الدراسية</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.subjects}</div>
                        <p className="text-xs text-muted-foreground">إجمالي المواد المتاحة</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>روابط سريعة</CardTitle>
                        <CardDescription>وصول سريع لأقسام الإدارة الرئيسية.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button variant="secondary" className="justify-start w-full" asChild>
                            <Link href="/dashboard/directeur/users"><Users className="ml-2"/>إدارة المستخدمين</Link>
                        </Button>
                        <Button variant="secondary" className="justify-start w-full" asChild>
                            <Link href="/dashboard/directeur/content"><BookCopy className="ml-2"/>إدارة المحتوى</Link>
                        </Button>
                        <Button variant="secondary" className="justify-start w-full" asChild>
                            <Link href="/dashboard/directeur/database"><Database className="ml-2"/>قاعدة البيانات</Link>
                        </Button>
                         <Button variant="secondary" className="justify-start w-full" asChild>
                            <Link href="/dashboard/directeur/settings"><Settings className="ml-2"/>الإعدادات</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
