'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FilePenLine, Eye, Trash2, Loader2 } from "lucide-react";
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
import { useLessons } from "@/hooks";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

export default function MyLessonsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  
  const { lessons, isLoading, deleteLesson } = useLessons({
    authorId: session?.user?.id,
  });

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الدرس؟')) return;
    
    const result = await deleteLesson(id);
    if (result.success) {
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الدرس بنجاح',
      });
    } else {
      toast({
        title: 'خطأ',
        description: result.error || 'فشل حذف الدرس',
        variant: 'destructive',
      });
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
          <h1 className="text-3xl font-bold tracking-tight">دروسي</h1>
          <p className="text-muted-foreground">
            قم بإدارة جميع الدروس التي قمت بإنشائها.
          </p>
        </div>
        <Link href="/dashboard/teacher/lessons/create" passHref>
          <Button>
            <PlusCircle className="ml-2 h-4 w-4" />
            <span>إنشاء درس جديد</span>
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة الدروس</CardTitle>
          <CardDescription>
            هذه هي جميع الدروس التي قمت بإضافتها لطلابك.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>عنوان الدرس</TableHead>
                <TableHead>المادة</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead className="text-center">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lessons.length > 0 ? (
                lessons.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell className="font-medium">{lesson.title}</TableCell>
                    <TableCell>{lesson.subject?.name || 'غير محدد'}</TableCell>
                    <TableCell>
                      <Badge variant="default">
                        معتمد
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Link href={`/lessons/${lesson.id}`} passHref>
                          <Button variant="ghost" size="icon" title="معاينة">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/teacher/lessons/${lesson.id}/edit`} passHref>
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
                  <TableCell colSpan={4} className="text-center h-24">
                    لم تقم بإنشاء أي دروس بعد.
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
