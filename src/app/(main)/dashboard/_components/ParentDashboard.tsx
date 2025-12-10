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
import { Button } from "@/components/ui/button";
import { Users, BarChart2, MessageSquare, Copy, Loader2 } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

type Child = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    level: {
        id: number;
        name: string;
        stage: {
            id: number;
            name: string;
        };
    } | null;
};

type ParentData = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    parentCode: string | null;
};

type Stats = {
    totalChildren: number;
    totalSubmissions: number;
    averageScore: number;
    unreadMessages: number;
};

export default function ParentDashboard() {
    const { data: session } = useSession();
    const { toast } = useToast();
    const [parent, setParent] = useState<ParentData | null>(null);
    const [children, setChildren] = useState<Child[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

    const fetchDashboard = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/parents/dashboard');
            const result = await response.json();
            if (result.success) {
                setParent(result.data.parent);
                setChildren(result.data.children);
                setStats(result.data.stats);
            }
        } catch (error) {
            console.error('Error fetching parent dashboard:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user) {
            fetchDashboard();
        }
    }, [session]);

    const handleCopy = () => {
        if (parent?.parentCode) {
            navigator.clipboard.writeText(parent.parentCode);
            toast({
                title: "تم النسخ!",
                description: "تم نسخ كود الربط إلى الحافظة.",
            });
        }
    };

    const handleGenerateCode = async () => {
        try {
            setIsGenerating(true);
            const response = await fetch('/api/parents/generate-code', {
                method: 'POST',
            });
            const result = await response.json();
            
            if (result.success) {
                toast({
                    title: "تم بنجاح!",
                    description: result.data.message,
                });
                // Refresh dashboard data
                await fetchDashboard();
            } else {
                toast({
                    title: "خطأ",
                    description: result.error || "فشل توليد الكود",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "خطأ",
                description: "حدث خطأ أثناء توليد الكود",
                variant: "destructive",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!parent) {
        return <div>لم يتم العثور على حساب ولي الأمر.</div>;
    }

    const parentName = `${parent.firstName} ${parent.lastName}`; 

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div className="grid gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">
                        أهلاً بك، {parentName}!
                    </h1>
                    <p className="text-muted-foreground">
                        هذه لوحة التحكم الخاصة بك لمتابعة تقدم أبنائك.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">الأبناء المرتبطون</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalChildren || 0}</div>
                        <p className="text-xs text-muted-foreground">إجمالي عدد الأبناء</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">متوسط الدرجات</CardTitle>
                        <BarChart2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.averageScore || 0}%</div>
                        <p className="text-xs text-muted-foreground">متوسط درجات جميع الأبناء</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">الرسائل غير المقروءة</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.unreadMessages || 0}</div>
                        <p className="text-xs text-muted-foreground">لديك رسائل جديدة</p>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>كود الربط الخاص بك</CardTitle>
                        <CardDescription>
                            شارك هذا الكود مع أبنائك لربط حساباتهم بحسابك. عند توليد كود جديد سيتم فك الارتباط بالأبناء السابقين.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Input 
                                readOnly 
                                value={parent.parentCode || 'لم يتم توليد كود بعد'} 
                                className="text-lg font-mono tracking-widest text-center" 
                            />
                            <Button variant="outline" onClick={handleCopy} disabled={!parent.parentCode}>
                                <Copy className="ml-2 h-4 w-4" />
                                نسخ
                            </Button>
                        </div>
                        <Button 
                            onClick={handleGenerateCode} 
                            disabled={isGenerating}
                            className="w-full"
                            variant={parent.parentCode ? "destructive" : "default"}
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                    جاري التوليد...
                                </>
                            ) : parent.parentCode ? (
                                'توليد كود جديد (سيفك الارتباط بالأبناء)'
                            ) : (
                                'توليد كود الربط'
                            )}
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>روابط سريعة</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <Link href="/dashboard/parent/children" passHref><Button variant="secondary" className="w-full justify-start">عرض الأبناء</Button></Link>
                        <Link href="/dashboard/parent/reports" passHref><Button variant="secondary" className="w-full justify-start">عرض التقارير</Button></Link>
                        <Link href="/messages" passHref><Button variant="secondary" className="w-full justify-start">الرسائل</Button></Link>
                        <Link href="/profile" passHref><Button variant="secondary" className="w-full justify-start">الملف الشخصي</Button></Link>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>نظرة سريعة على الأبناء</span>
                         <Link href="/dashboard/parent/children" passHref>
                            <Button variant="ghost" size="sm">
                                <span>عرض الكل</span>
                            </Button>
                        </Link>
                    </CardTitle>
                    <CardDescription>آخر النشاطات والتقدم لأبنائك.</CardDescription>
                </CardHeader>
                <CardContent>
                    {children.length > 0 ? (
                        <div className="space-y-4">
                            {children.map(child => {
                                const childName = `${child.firstName} ${child.lastName}`;
                                const childInitial = child.firstName.charAt(0);
                                return (
                                    <div key={child.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                                        <div className="flex items-center gap-4">
                                            <Avatar>
                                                <AvatarFallback>{childInitial}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold">{childName}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {child.level ? `${child.level.stage.name} - ${child.level.name}` : 'لم يتم تحديد المستوى'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link href={`/dashboard/parent/children/${child.id}/subjects`} passHref>
                                                <Button variant="default" size="sm">
                                                    <span>المواد</span>
                                                </Button>
                                            </Link>
                                            <Link href={`/dashboard/parent/children/${child.id}`} passHref>
                                                <Button variant="outline" size="sm">
                                                    <span>التفاصيل</span>
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-8">لم يتم ربط أي أبناء بعد. شارك كود الربط مع أبنائك.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
