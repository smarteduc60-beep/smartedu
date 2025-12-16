'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, CheckCircle2, AlertTriangle, AlertCircle, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Notification = {
  id: number;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    image: string | null;
  };
  exercise: {
    question: string;
  };
  lesson: {
    title: string;
  };
  subject: {
    name: string;
  };
  score: number;
  status: 'excellent' | 'good' | 'needs_improvement';
  attemptNumber: number;
  submittedAt: Date;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/parents/notifications');
      const result = await response.json();
      if (result.success) {
        setNotifications(result.data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationDetails = (status: string) => {
    if (status === 'excellent') {
      return { 
        icon: CheckCircle2, 
        color: "text-green-600 dark:text-green-400", 
        title: "إنجاز رائع!",
        bgClassName: "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
      };
    }
    if (status === 'good') {
      return { 
        icon: AlertTriangle, 
        color: "text-yellow-600 dark:text-yellow-400", 
        title: "أداء جيد، يمكن تحسينه",
        bgClassName: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800"
      };
    }
    return { 
      icon: AlertCircle, 
      color: "text-red-600 dark:text-red-400", 
      title: "يحتاج إلى مراجعة",
      bgClassName: "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
    };
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
        <h1 className="text-3xl font-bold tracking-tight">الإشعارات</h1>
        <p className="text-muted-foreground">
          آخر التحديثات والأنشطة المتعلقة بأبنائك.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>آخر الأنشطة</CardTitle>
          <CardDescription>
            لديك {notifications.length} إشعار بخصوص نشاط أبنائك.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map(notification => {
                const studentName = `${notification.student.firstName} ${notification.student.lastName}`;
                const details = getNotificationDetails(notification.status);
                const Icon = details.icon;

                return (
                  <div key={notification.id} className={cn("flex gap-4 items-start p-4 rounded-lg border", details.bgClassName)}>
                    <Avatar className="h-11 w-11 border-2 border-primary/20 mt-1">
                      <AvatarImage src={notification.student.image || ''} alt={studentName} />
                      <AvatarFallback>{notification.student.firstName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="leading-relaxed text-sm">
                          قام ابنك <span className="font-bold">{studentName}</span> بإكمال درس "{notification.lesson.title}" من مادة "{notification.subject.name}".
                          وحصل على العلامة <span className="font-bold text-primary">{notification.score}/10</span> في المحاولة رقم <span className="font-bold">{notification.attemptNumber}</span>.
                        </p>
                        <span className="text-xs text-muted-foreground whitespace-nowrap pt-1">
                          {formatDistanceToNow(new Date(notification.submittedAt), { addSuffix: true, locale: ar })}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-4">
                        <div className={cn("flex items-center gap-2", details.color)}>
                          <Icon className="h-5 w-5" />
                          <span className="font-semibold text-sm">{details.title}</span>
                        </div>
                        <Link href={`/dashboard/parent/children/${notification.student.id}`} passHref>
                          <Button variant="link" size="sm" className="px-0 h-auto text-foreground/80 hover:text-foreground">
                            عرض التقرير الكامل
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12 flex flex-col items-center gap-4">
              <Bell className="h-16 w-16 text-muted-foreground/50" />
              <p>لا توجد إشعارات جديدة. سيتم عرضها هنا عند توفرها.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
