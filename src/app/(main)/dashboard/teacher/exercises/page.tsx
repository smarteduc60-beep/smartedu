'use client';

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FilePenLine, Trash2, Loader2, FileQuestion, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useExercises, useLessons } from "@/hooks";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/ui/pagination";

// مكون فرعي لعرض تمارين درس محدد
function LessonExercisesList({ lessonId }: { lessonId: number }) {
  const { exercises, isLoading, deleteExercise } = useExercises({ lessonId });
  const { toast } = useToast();

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
    return <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  if (exercises.length === 0) {
    return <div className="text-center p-4 text-muted-foreground">لا توجد تمارين في هذا الدرس.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>نص السؤال</TableHead>
          <TableHead>النوع</TableHead>
          <TableHead className="text-center">الإجراءات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exercises.map((exercise) => {
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
              <TableCell>
                <Badge 
                  variant="outline"
                  className={cn(
                    "font-normal",
                    exercise.type === 'main' && "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
                    exercise.type === 'support_with_results' && "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
                    exercise.type === 'support_only' && "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                  )}
                >
                  {exercise.type === 'main' ? 'رئيسي' : (exercise.type === 'support_with_results' ? 'دعم+نتائج' : 'دعم')}
                </Badge>
              </TableCell>
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
        })}
      </TableBody>
    </Table>
  );
}

export default function MyExercisesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();
  const [openItem, setOpenItem] = useState<string>("");
  const [page, setPage] = useState(1);
  
  // جلب الدروس فقط
  const { lessons, isLoading, refetch, pagination } = useLessons({ 
    authorId: session?.user?.id,
    page,
    limit: 10
  });

  // تصفية الدروس حسب البحث
  const filteredLessons = lessons.filter(lesson => 
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            قم بإدارة التمارين مرتبة حسب الدروس.
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
            اختر درساً لعرض التمارين المرتبطة به.
          </CardDescription>
        </CardHeader>
        <CardContent>          
          <div className="mb-4">
            <div className="relative">
              <Input
                placeholder="ابحث عن درس..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          {filteredLessons.length > 0 ? (
            <Accordion type="single" collapsible value={openItem} onValueChange={setOpenItem} className="w-full">
              {filteredLessons.map((lesson) => (
                <AccordionItem key={lesson.id} value={lesson.id.toString()}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <FileQuestion className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{lesson.title}</span>
                      <Badge variant="secondary" className="text-xs font-normal mr-2">
                        {lesson.subject?.name}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {/* تحميل التمارين فقط عند فتح العنصر */}
                    {openItem === lesson.id.toString() && <LessonExercisesList lessonId={lesson.id} />}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              لم تقم بإنشاء أي دروس بعد. قم بإنشاء درس أولاً لإضافة تمارين.
            </div>
          )}

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
              >
                <ChevronRight className="h-4 w-4 ml-1" />
                السابق
              </Button>
              <span className="text-sm text-muted-foreground">
                صفحة {pagination.page} من {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages || isLoading}
              >
                التالي
                <ChevronLeft className="h-4 w-4 mr-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
