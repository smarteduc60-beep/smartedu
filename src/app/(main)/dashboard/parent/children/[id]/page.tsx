'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TrendingUp, Target, BookCheck, ArrowLeft, MessageSquare, Mail, BookOpen, FileQuestion, Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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

type ChildDetails = {
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

export default function ChildDetailsPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { toast } = useToast();
  const [childId, setChildId] = useState<string>('');
  const [child, setChild] = useState<ChildDetails | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [messageDialog, setMessageDialog] = useState<{ open: boolean; teacher: { id: string; name: string } | null }>({ open: false, teacher: null });
  const [messageContent, setMessageContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const initializeParams = async () => {
      const resolvedParams = await Promise.resolve(params);
      setChildId(resolvedParams.id);
    };
    initializeParams();
  }, [params]);

  useEffect(() => {
    if (childId) {
      fetchChildDetails();
      fetchSubjects();
    }
  }, [childId]);

  const fetchChildDetails = async () => {
    try {
      const response = await fetch(`/api/parents/children/${childId}`);
      const result = await response.json();
      if (result.success) {
        setChild(result.data.child);
      }
    } catch (error) {
      console.error('Error fetching child details:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/parents/children/${childId}/subjects`);
      const result = await response.json();
      console.log('Subjects data:', result.data);
      if (result.success) {
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

  const handleOpenMessageDialog = (teacherId: string, teacherName: string, allowMessaging: boolean) => {
    if (!allowMessaging) {
      toast({
        title: 'غير متاح',
        description: 'المعلم غير متاح للتواصل حالياً',
        variant: 'destructive',
      });
      return;
    }
    setMessageDialog({ open: true, teacher: { id: teacherId, name: teacherName } });
    setMessageContent('');
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !messageDialog.teacher) return;

    setIsSending(true);
    try {
      // Check if teacher still allows messaging
      const teacherCheck = await fetch(`/api/teachers/${messageDialog.teacher.id}/messaging-status`);
      const checkResult = await teacherCheck.json();
      
      if (!checkResult.success || !checkResult.data.allowMessaging) {
        toast({
          title: 'غير متاح',
          description: 'المعلم قام بتعطيل التواصل. لا يمكن إرسال الرسالة.',
          variant: 'destructive',
        });
        setMessageDialog({ open: false, teacher: null });
        setIsSending(false);
        return;
      }

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: messageDialog.teacher.id,
          subject: `رسالة من ولي أمر ${child?.firstName}`,
          content: messageContent,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'تم الإرسال',
          description: `تم إرسال رسالتك إلى ${messageDialog.teacher.name}`,
        });
        
        setMessageDialog({ open: false, teacher: null });
        setMessageContent('');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في إرسال الرسالة',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!child) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">الطالب غير موجود</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={child.image || ''} alt={`${child.firstName} ${child.lastName}`} />
              <AvatarFallback>{child.firstName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <h1 className="text-3xl font-bold tracking-tight">
                تقرير أداء {child.firstName} {child.lastName}
              </h1>
              <p className="text-muted-foreground">
                نظرة شاملة على تقدم {child.firstName} الدراسي
              </p>
            </div>
          </div>
          <Link href="/dashboard/parent/children">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4" />
              <span className="mr-2">الرجوع</span>
            </Button>
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">الدروس المكتملة</CardTitle>
              <BookCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{child.stats?.completedLessons || 0}</div>
              <p className="text-xs text-muted-foreground">دروس مكتملة</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">التمارين المحلولة</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{child.stats?.submissionCount || 0}</div>
              <p className="text-xs text-muted-foreground">تمارين محلولة</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">متوسط الدرجات</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{child.stats?.averageScore || 0}/10</div>
              <p className="text-xs text-muted-foreground">في جميع التمارين</p>
            </CardContent>
          </Card>
        </div>

        {/* Subjects Cards with Messaging */}
        <Card>
          <CardHeader>
            <CardTitle>المواد الدراسية</CardTitle>
            <CardDescription>
              المواد التي يدرسها {child.firstName} مع إحصائيات الأداء وإمكانية التواصل مع المعلمين
            </CardDescription>
          </CardHeader>
          <CardContent>
            {subjects.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {subjects.map((subject) => {
                  const teacherName = subject.teacher
                    ? `${subject.teacher.firstName} ${subject.teacher.lastName}`
                    : 'لا يوجد معلم';

                  return (
                    <Card key={subject.id} className="relative">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg mb-2">{subject.name}</CardTitle>
                            {subject.teacher ? (
                              <CardDescription className="flex items-center gap-2">
                                <Avatar className="h-5 w-5">
                                  <AvatarFallback className="text-xs">
                                    {subject.teacher.firstName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs truncate">{teacherName}</span>
                              </CardDescription>
                            ) : (
                              <CardDescription className="text-xs">لا يوجد معلم</CardDescription>
                            )}
                          </div>
                          {subject.teacher && (
                            <div className="flex-shrink-0">
                              {subject.teacher.allowMessaging ? (
                                <Button
                                  size="icon"
                                  variant="default"
                                  className="h-9 w-9"
                                  onClick={() => handleOpenMessageDialog(subject.teacher!.id, teacherName, subject.teacher!.allowMessaging)}
                                  title="إرسال رسالة للمعلم"
                                >
                                  <MessageSquare className="h-5 w-5" />
                                </Button>
                              ) : (
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-9 w-9"
                                  disabled
                                  title="المعلم غير متاح للتواصل حالياً"
                                >
                                  <Mail className="h-5 w-5 text-muted-foreground" />
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2 p-2 bg-muted rounded text-center">
                            <BookOpen className="h-4 w-4 text-primary" />
                            <div className="flex-1">
                              <p className="text-lg font-bold">{subject.stats.totalLessons}</p>
                              <p className="text-xs text-muted-foreground">دروس</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-muted rounded text-center">
                            <FileQuestion className="h-4 w-4 text-primary" />
                            <div className="flex-1">
                              <p className="text-lg font-bold">{subject.stats.totalExercises}</p>
                              <p className="text-xs text-muted-foreground">تمارين</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">الإجابات</span>
                            <Badge variant="secondary" className="text-xs">
                              {subject.stats.totalSubmissions}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">تم التصحيح</span>
                            <Badge variant="default" className="text-xs">
                              {subject.stats.gradedSubmissions}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center pt-1 border-t">
                            <span className="text-muted-foreground font-medium">المتوسط</span>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-primary" />
                              <span className="font-bold text-primary">
                                {subject.stats.averageScore}/10
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                لا توجد مواد مسجلة لهذا الطالب
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Message Dialog */}
      <Dialog open={messageDialog.open} onOpenChange={(open) => setMessageDialog({ open, teacher: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إرسال رسالة</DialogTitle>
            <DialogDescription>
              أرسل رسالة إلى {messageDialog.teacher?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message">الرسالة</Label>
              <Textarea
                id="message"
                placeholder="اكتب رسالتك هنا..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                rows={5}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMessageDialog({ open: false, teacher: null })}>
              إلغاء
            </Button>
            <Button onClick={handleSendMessage} disabled={!messageContent.trim() || isSending}>
              {isSending ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  <span>جاري الإرسال...</span>
                </>
              ) : (
                <>
                  <MessageSquare className="ml-2 h-4 w-4" />
                  <span>إرسال</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
