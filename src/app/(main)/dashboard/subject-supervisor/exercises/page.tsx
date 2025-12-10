
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
import { PlusCircle, FilePenLine, Trash2, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface Exercise {
  id: number;
  question: string;
  lesson: {
    id: number;
    title: string;
  };
}

export default function SupervisorExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = exercises.filter(
        (ex) =>
          ex.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ex.lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredExercises(filtered);
    } else {
      setFilteredExercises(exercises);
    }
  }, [searchQuery, exercises]);

  const fetchExercises = async () => {
    try {
      const response = await fetch('/api/subject-supervisor/exercises');
      const result = await response.json();

      if (result.success) {
        setExercises(result.data);
        setFilteredExercises(result.data);
      } else {
        toast({
          title: 'خطأ',
          description: result.error || 'فشل في جلب التمارين',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching exercises:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء جلب التمارين',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا التمرين؟')) return;

    try {
      const response = await fetch(`/api/exercises/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'تم الحذف',
          description: 'تم حذف التمرين بنجاح',
        });
        fetchExercises();
      } else {
        toast({
          title: 'خطأ',
          description: result.error || 'فشل في حذف التمرين',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting exercise:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حذف التمرين',
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
            قم بإدارة جميع التمارين في دروس المادة.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة التمارين</CardTitle>
          <CardDescription>
            جميع التمارين المتاحة في دروس هذه المادة.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث في التمارين أو الدروس..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نص السؤال</TableHead>
                <TableHead>الدرس المرتبط</TableHead>
                <TableHead className="text-center">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExercises.length > 0 ? (
                filteredExercises.map((exercise) => (
                    <TableRow key={exercise.id}>
                        <TableCell className="font-medium max-w-md">
                          <div className="truncate">{exercise.question}</div>
                        </TableCell>
                        <TableCell>{exercise.lesson.title}</TableCell>
                        <TableCell className="text-center">
                            <div className="flex justify-center gap-2">
                                <Link href={`/dashboard/subject-supervisor/exercises/${exercise.id}`}>
                                    <Button variant="ghost" size="icon" title="عرض">
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-24">
                    {searchQuery ? 'لا توجد نتائج للبحث' : 'لا توجد تمارين في هذه المادة بعد.'}
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
