'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, BookOpen, FileQuestion, TrendingUp, ArrowLeft, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

type Subject = {
  id: number;
  name: string;
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
    allowMessaging: boolean;
  } | null;
  stats: {
    totalLessons: number;
    totalExercises: number;
    totalSubmissions: number;
    gradedSubmissions: number;
    averageScore: number;
  };
};

export default function ChildSubjectsPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [child, setChild] = useState<any>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/parents/children/${params.id}/subjects`);
      const result = await response.json();
      
      if (result.success) {
        setChild(result.data.child);
        setSubjects(result.data.subjects);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل المواد',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageTeacher = (teacherId: string, teacherName: string) => {
    window.location.href = `/messages?recipient=${teacherId}&name=${encodeURIComponent(teacherName)}`;
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
          <h1 className="text-3xl font-bold tracking-tight">
            مواد {child?.firstName} {child?.lastName}
          </h1>
          <p className="text-muted-foreground">
            عرض تفاصيل أداء {child?.firstName} في كل مادة والتواصل مع المعلمين
          </p>
        </div>
        <Link href={`/dashboard/parent/children/${params.id}`}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" />
            <span className="mr-2">الرجوع</span>
          </Button>
        </Link>
      </div>

      {subjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => {
            const teacherName = subject.teacher
              ? `${subject.teacher.firstName} ${subject.teacher.lastName}`
              : 'لا يوجد معلم';
            
            return (
              <Card key={subject.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{subject.name}</CardTitle>
                      {subject.teacher && (
                        <CardDescription className="mt-2 flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {subject.teacher.firstName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{teacherName}</span>
                        </CardDescription>
                      )}
                    </div>
                    {subject.teacher && (
                      <div>
                        {subject.teacher.allowMessaging ? (
                          <Button
                            size="icon"
                            variant="default"
                            onClick={() => handleMessageTeacher(subject.teacher!.id, teacherName)}
                            title="إرسال رسالة للمعلم"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            size="icon"
                            variant="outline"
                            disabled
                            title="المعلم غير متاح للتواصل حالياً"
                          >
                            <Mail className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-2xl font-bold">{subject.stats.totalLessons}</p>
                        <p className="text-xs text-muted-foreground">دروس</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <FileQuestion className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-2xl font-bold">{subject.stats.totalExercises}</p>
                        <p className="text-xs text-muted-foreground">تمارين</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">الإجابات</span>
                      <Badge variant="secondary">
                        {subject.stats.totalSubmissions}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">تم التصحيح</span>
                      <Badge variant="default">
                        {subject.stats.gradedSubmissions}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">متوسط الدرجات</span>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-lg font-bold text-primary">
                          {subject.stats.averageScore}/10
                        </span>
                      </div>
                    </div>
                  </div>

                  {!subject.teacher?.allowMessaging && subject.teacher && (
                    <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                      💡 المعلم غير متاح للتواصل حالياً
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">لا توجد مواد مسجلة لهذا الطالب</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
