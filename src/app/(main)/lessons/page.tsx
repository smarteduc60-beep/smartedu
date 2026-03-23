'use client';

import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowLeft, Lock, Loader2, BookOpen, School, Library, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Gamepad } from "lucide-react";
import { useLessons } from "@/hooks";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function LessonsPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subject');
  const [subjectName, setSubjectName] = useState<string>('');
  const [page, setPage] = useState(1);
  
  const { lessons, pagination, isLoading, error } = useLessons({
    subjectId: subjectId ? parseInt(subjectId) : undefined,
    status: 'approved',
    page,
    limit: 12,
  });

  // جلب اسم المادة
  useEffect(() => {
    if (subjectId && lessons.length > 0) {
      setSubjectName(lessons[0]?.subject?.name || '');
    }
  }, [subjectId, lessons]);


  const getLessonImage = (id: number) => {
    const imageName = `lesson${id}`;
    return PlaceHolderImages.find((img) => img.id === imageName);
  };

  const privateLessons = lessons.filter(l => l.type === 'private');
  const publicLessons = lessons.filter(l => l.type !== 'private');

  const renderLessonCard = (lesson: any) => {
    const lessonImage = getLessonImage(lesson.id);

    return (
      <Card key={lesson.id} className={`flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 ${lesson.contentType === 'GAME' ? 'bg-blue-50' : ''}`}>
        <CardHeader className="relative p-0">
          {lessonImage && (
            <div className="relative aspect-video w-full">
              <Image
                src={lessonImage.imageUrl}
                alt={lesson.title}
                fill
                className="object-cover"
                data-ai-hint={lessonImage.imageHint}
              />
            </div>
          )}
          <div className="p-6">
            <div className="flex justify-between items-start gap-2">
              <div className="flex gap-2 flex-wrap items-center">
                {lesson.contentType === 'GAME' && (
                  <div className="flex items-center gap-2">
                    <Gamepad className="h-5 w-5 text-blue-600" />
                    <Badge className="bg-blue-100 text-blue-800 border-0">لعبة</Badge>
                  </div>
                )}
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary">{lesson.subject?.name}</Badge>
                  <Badge variant={lesson.type === 'public' ? 'default' : 'outline'}>
                    {lesson.type === 'public' ? 'عام' : 'خاص'}
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground whitespace-nowrap">
                بواسطة: {lesson.author ? `${lesson.author.firstName} ${lesson.author.lastName}` : (lesson.teacherName || 'غير معروف')}
              </p>
            </div>
            <CardTitle className="text-xl mt-2">{lesson.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <CardDescription>
                  {lesson.description || (lesson.content ? lesson.content.replace(/<pre[^>]*>[\s\S]*?<\/pre>/g, '').replace(/<[^>]*>?/gm, '').substring(0, 100) + '...' : 'لا يوجد وصف')}
          </CardDescription>
        </CardContent>
        <CardFooter>
          <Link href={`/lessons/${lesson.id}`} className="w-full" passHref>
            <Button className="w-full">
              <span>ابدأ الدرس</span>
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-destructive">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/subjects">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="ml-2 h-4 w-4" />
            <span>العودة للمواد</span>
          </Button>
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">
            {subjectName ? `دروس ${subjectName}` : 'قائمة الدروس'}
          </h1>
        </div>
        <p className="text-muted-foreground">
          {subjectName 
            ? `تصفح جميع دروس مادة ${subjectName} المتاحة لك`
            : 'تصفح جميع الدروس المتاحة لك وابدأ رحلتك التعليمية.'}
        </p>
      </div>

      {lessons.length === 0 ? (
          <p className="text-muted-foreground col-span-full text-center">
            لا توجد دروس متاحة حاليًا.
          </p>
      ) : (
        <div className="space-y-12">
          {privateLessons.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-primary">
                <span className="bg-primary/10 p-2 rounded-lg"><School className="h-6 w-6" /></span>
                دروس صفي / دروس أستاذي
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 bg-blue-50/30 dark:bg-blue-900/10 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                {privateLessons.map(renderLessonCard)}
              </div>
            </section>
          )}

          {publicLessons.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="bg-secondary/50 p-2 rounded-lg"><Library className="h-6 w-6" /></span>
                المكتبة العامة / دروس إثرائية
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {publicLessons.map(renderLessonCard)}
              </div>
            </section>
          )}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(1)}
            disabled={page === 1 || isLoading}
            title="الصفحة الأولى"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
            title="السابقة"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <span className="text-sm text-muted-foreground mx-2">
            صفحة {pagination.page} من {pagination.totalPages}
          </span>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages || isLoading}
            title="التالية"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(pagination.totalPages)}
            disabled={page === pagination.totalPages || isLoading}
            title="الصفحة الأخيرة"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
