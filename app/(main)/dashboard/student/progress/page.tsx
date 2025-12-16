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
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp, Target, BookCheck, ClipboardList, Loader2 } from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

type SubjectProgress = {
  subject: string;
  score: number;
  color: string;
};

type RecentLesson = {
  id: number;
  title: string;
  progress: number;
};

export default function MyProgressPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [subjectsProgress, setSubjectsProgress] = useState<SubjectProgress[]>([]);
  const [recentLessons, setRecentLessons] = useState<RecentLesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setIsLoading(true);
        
        // Fetch student stats
        const statsRes = await fetch('/api/students/stats');
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(statsData.data.stats);
        }

        // Fetch subjects progress
        const progressRes = await fetch('/api/students/progress');
        const progressData = await progressRes.json();
        if (progressData.success) {
          setSubjectsProgress(progressData.data.subjectsProgress || []);
          setRecentLessons(progressData.data.recentLessons || []);
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchProgress();
    }
  }, [session]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const completedLessonsCount = stats?.completedLessons || 0;
  const solvedExercisesCount = stats?.totalSubmissions || 0;
  const averageScore = stats?.averageScore || 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-1">
        <h1 className="text-3xl font-bold tracking-tight">تقدمي الدراسي</h1>
        <p className="text-muted-foreground">
          تابع إنجازاتك وأدائك في المواد المختلفة.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">الدروس المكتملة</CardTitle>
            <BookCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedLessonsCount}</div>
            <p className="text-xs text-muted-foreground">درس مكتمل</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">التمارين المحلولة</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{solvedExercisesCount}</div>
            <p className="text-xs text-muted-foreground">تم حلها بنجاح</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">متوسط الدرجات</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore}%</div>
            <p className="text-xs text-muted-foreground">في جميع التمارين</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="text-primary" />
              <span>أدائي حسب المادة</span>
            </CardTitle>
            <CardDescription>
              متوسط درجاتك في المواد المختلفة.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectsProgress} layout="vertical" margin={{ right: 20 }}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="subject"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  width={80}
                  dx={-5}
                />
                 <Tooltip
                    cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                    <span className="text-muted-foreground text-sm">
                                    {payload[0].payload.subject}
                                    </span>
                                    <span className="font-bold text-lg">
                                    {payload[0].value}%
                                    </span>
                                </div>
                                </div>
                            </div>
                            )
                        }
                        return null
                        }}
                 />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={30}>
                    {subjectsProgress.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>آخر الدروس</CardTitle>
            <CardDescription>الدروس التي عملت عليها مؤخراً.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentLessons.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>الدرس</TableHead>
                            <TableHead>التقدم</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentLessons.map(lesson => (
                            <TableRow key={lesson.id}>
                                <TableCell className="font-medium">{lesson.title}</TableCell>
                                <TableCell>
                                    <Progress value={lesson.progress} className="h-2" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <p className="text-center text-muted-foreground pt-8">لم تبدأ بأي درس بعد.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
