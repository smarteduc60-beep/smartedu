
'use client';

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart,
  BookCopy,
  FileQuestion,
  Users,
  Loader2,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface StatisticsData {
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
  };
  stats: {
    lessons: number;
    exercises: number;
    teachers: number;
    students: number;
  };
  topTeachers: Array<{
    id: string;
    name: string;
    email: string;
    image: string | null;
    lessonCount: number;
  }>;
}

export default function StatisticsPage() {
  const [data, setData] = useState<StatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch('/api/subject-supervisor/statistics');
        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || 'فشل في جلب البيانات');
        }
      } catch (err) {
        setError('حدث خطأ أثناء جلب الإحصائيات');
        console.error('Error fetching statistics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (isLoading) {
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
          <p className="text-lg text-muted-foreground">{error || 'لم يتم العثور على البيانات'}</p>
        </div>
      </div>
    );
  }

  const lessonTypeData = [
    { name: 'إجمالي الدروس', value: data.stats.lessons, color: 'hsl(var(--chart-1))' },
    { name: 'إجمالي التمارين', value: data.stats.exercises, color: 'hsl(var(--chart-2))' },
  ];


  return (
    <div className="flex flex-col gap-8">
       <div className="grid gap-1">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BarChart className="h-7 w-7 text-primary" />
            <span>إحصائيات مادة "{data.supervisor.subject.name}"</span>
        </h1>
        <p className="text-muted-foreground">
          {data.supervisor.level.name} - {data.supervisor.level.stage.name} | نظرة شاملة على أداء ونشاط المعلمين والطلاب.
        </p>
      </div>

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الدروس</CardTitle>
            <BookCopy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.lessons}</div>
            <p className="text-xs text-muted-foreground">في هذه المادة</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي التمارين</CardTitle>
            <FileQuestion className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.exercises}</div>
            <p className="text-xs text-muted-foreground">تم إنشاؤها في هذه المادة</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المعلمين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.teachers}</div>
            <p className="text-xs text-muted-foreground">يدرسون هذه المادة</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الطلاب</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.students}</div>
            <p className="text-xs text-muted-foreground">يدرسون هذه المادة</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>توزيع الدروس حسب النوع</CardTitle>
            <CardDescription>
                النسبة بين الدروس العامة والدروس الخاصة.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={lessonTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {lessonTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>النشاط الشهري</CardTitle>
             <CardDescription>
                (ميزة قيد التطوير)
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center text-muted-foreground h-[300px]">
            <p>سيتم عرض مخطط النشاط الشهري هنا قريباً.</p>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>أفضل المعلمين أداءً</CardTitle>
          <CardDescription>قائمة بالمعلمين الأكثر نشاطاً في إضافة الدروس.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المعلم</TableHead>
                <TableHead>إجمالي الدروس</TableHead>
                <TableHead>دروس عامة</TableHead>
                <TableHead>دروس خاصة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.topTeachers.length > 0 ? data.topTeachers.map(teacher => (
                <TableRow key={teacher.id}>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={teacher.image || undefined} alt={teacher.name} />
                                <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{teacher.name}</span>
                        </div>
                    </TableCell>
                    <TableCell className="font-bold">{teacher.lessonCount}</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                </TableRow>
              )) : (
                 <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      لا يوجد معلمون في هذه المادة بعد.
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
