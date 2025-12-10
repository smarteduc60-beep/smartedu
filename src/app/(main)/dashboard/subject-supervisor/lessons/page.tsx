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
import { Input } from "@/components/ui/input";
import { PlusCircle, FilePenLine, Eye, Trash2, FileQuestion, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  type: 'public' | 'private';
  level?: {
    id: number;
    name: string;
  };
  _count?: {
    exercises: number;
  };
  createdAt: string;
}

export default function SupervisorLessonsPage() {
  const { toast } = useToast();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch('/api/lessons');
        const result = await response.json();

        if (result.success) {
          // API returns lessons in result.data.lessons
          const lessonsData = result.data?.lessons || result.lessons || [];
          setLessons(lessonsData);
        }
      } catch (error) {
        console.error('Error fetching lessons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  const handleDelete = async (lessonId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الدرس؟')) return;

    try {
      const response = await fetch(`/api/lessons/${lessonId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'تم الحذف',
          description: 'تم حذف الدرس بنجاح',
        });
        setLessons(lessons.filter(l => l.id !== lessonId));
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message || 'فشل في حذف الدرس',
        variant: 'destructive',
      });
    }
  };

  const filteredLessons = lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold tracking-tight">إدارة الدروس</h1>
          <p className="text-muted-foreground">
            قم بإدارة جميع الدروس التي قمت بإنشائها
          </p>
        </div>
        <Link href="/dashboard/subject-supervisor/lessons/create">
          <Button>
            <PlusCircle className="ml-2 h-4 w-4" />
            <span>إنشاء درس جديد</span>
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>قائمة الدروس</CardTitle>
              <CardDescription>
                هذه هي جميع الدروس التي قمت بإنشائها ({filteredLessons.length})
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث في الدروس..."
                className="pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>عنوان الدرس</TableHead>
                <TableHead>المستوى</TableHead>
                <TableHead>التمارين</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead className="text-center">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLessons.length > 0 ? (
                filteredLessons.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell className="font-medium">{lesson.title}</TableCell>
                    <TableCell>
                      {lesson.level?.name || 'غير محدد'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <FileQuestion className="h-4 w-4 text-muted-foreground" />
                        {lesson._count?.exercises || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={lesson.type === 'public' ? 'default' : 'outline'}>
                        {lesson.type === 'public' ? 'عام' : 'خاص'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Link href={`/lessons/${lesson.id}`}>
                          <Button variant="ghost" size="icon" title="معاينة">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/subject-supervisor/lessons/${lesson.id}/edit`}>
                          <Button variant="ghost" size="icon" title="تعديل">
                            <FilePenLine className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="حذف" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(lesson.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    {searchTerm ? 'لم يتم العثور على دروس' : 'لم تقم بإنشاء أي دروس بعد'}
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
