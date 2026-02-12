'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, BookCheck, Target, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Child = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    image: string | null;
    level: {
        id: number;
        name: string;
        stage: {
            id: number;
            name: string;
        };
    } | null;
    stats: {
        completedLessons: number;
        averageScore: number;
        submissionCount: number;
    };
};

export default function MyChildrenPage() {
    const [children, setChildren] = useState<Child[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchChildren();
    }, []);

    const fetchChildren = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/parents/children');
            const result = await response.json();
            if (result.success) {
                setChildren(result.data.children);
            }
        } catch (error) {
            console.error('Error fetching children:', error);
        } finally {
            setIsLoading(false);
        }
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
            <div className="flex items-center justify-between">
                <div className="grid gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">أبنائي</h1>
                    <p className="text-muted-foreground">
                        تابع تقدم أبنائك المرتبطين بحسابك.
                    </p>
                </div>
            </div>

            {children.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                    {children.map(child => {
                        const childName = `${child.firstName} ${child.lastName}`;
                        const childInitial = child.firstName.charAt(0);
                        return (
                             <Card key={child.id}>
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={child.image || ''} alt={childName} />
                                        <AvatarFallback>{childInitial}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid gap-1">
                                        <CardTitle>{childName}</CardTitle>
                                        <CardDescription>{child.email}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="grid grid-cols-3 gap-4 text-center">
                                    <div className="p-3 bg-muted rounded-md">
                                        <BookCheck className="h-6 w-6 mx-auto mb-2 text-primary" />
                                        <p className="text-xl font-bold">{child.stats.completedLessons}</p>
                                        <p className="text-xs text-muted-foreground">دروس مكتملة</p>
                                    </div>
                                    <div className="p-3 bg-muted rounded-md">
                                        <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
                                        <p className="text-xl font-bold">{child.stats.averageScore}/10</p>
                                        <p className="text-xs text-muted-foreground">متوسط الدرجات</p>
                                    </div>
                                    <div className="p-3 bg-muted rounded-md">
                                        <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
                                        <p className="text-xl font-bold">{child.stats.submissionCount}</p>
                                        <p className="text-xs text-muted-foreground">تمارين محلولة</p>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                     <Link href={`/dashboard/parent/children/${child.id}`} className="w-full" passHref>
                                        <Button className="w-full">
                                            <span>عرض التقرير المفصل</span>
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                        </Button>
                                     </Link>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <Card className="flex flex-col items-center justify-center py-20">
                    <CardHeader>
                        <CardTitle>لم يتم ربط أي أبناء</CardTitle>
                        <CardDescription>استخدم كود الربط الموجود في لوحة التحكم لربط حسابات أبنائك.</CardDescription>
                    </CardHeader>
                </Card>
            )}
        </div>
    );
}
