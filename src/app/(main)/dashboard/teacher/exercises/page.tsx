'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FilePenLine, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useExercises, useLessons } from "@/hooks";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

export default function MyExercisesPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  
  // جلب التمارين الخاصة بالأستاذ مباشرة من API
  const { exercises: myExercises, isLoading, deleteExercise } = useExercises({
    authorId: session?.user?.id,
  });
  
  // جلب الدروس للحصول على تفاصيلها
  const { lessons } = useLessons({ authorId: session?.user?.id });

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا التمرين؟')) return;
    
    const result = await deleteExercise(id);
    if (result.success) {
      toast({
        title: 'تم الحذف',
        description: 'تم حذف التمرين بنجاح',
      });
    } else {
      toast({
        title: 'خطأ',
        description: result.error || 'فشل حذف التمرين',
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
          <h1 className="text-3xl font-bold tracking-tight">إدارة التمارين</h1>
          <p className="text-muted-foreground">
            قم بإدارة جميع التمارين التي قمت بإنشائها.
          </p>
        </div>
        <Link href="/dashboard/teacher/exercises/create" passHref>
          <Button>
            <PlusCircle className="ml-2 h-4 w-4" />
            <span>إضافة تمرين جديد</span>
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة التمارين</CardTitle>
          <CardDescription>
            هذه هي جميع التمارين التي قمت بإضافتها إلى دروسك.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نص السؤال</TableHead>
                <TableHead>الدرس المرتبط</TableHead>
                <TableHead className="text-center">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myExercises.length > 0 ? (
                myExercises.map((exercise) => {
                  // استخراج نص السؤال من HTML
                  const getPlainText = (html: string) => {
                    if (!html) return '';
                    return html.replace(/<[^>]*>/g, '').substring(0, 100);
                  };
                  const questionText = exercise.questionRichContent 
                    ? getPlainText(exercise.questionRichContent) + '...'
                    : (exercise.question || 'سؤال بدون نص').substring(0, 100) + '...';
                  
                  return (
                    <TableRow key={exercise.id}>
                      <TableCell className="font-medium truncate max-w-md">
                        {questionText}
                      </TableCell>
                      <TableCell>{exercise.lesson?.title || 'غير محدد'}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          <Link href={`/dashboard/teacher/exercises/${exercise.id}/edit`} passHref>
                            <Button variant="ghost" size="icon" title="تعديل">
                              <FilePenLine className="h-4 w-4" />
                            </Button>
                          </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="حذف" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(exercise.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-24">
                    لم تقم بإنشاء أي تمارين بعد.
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
