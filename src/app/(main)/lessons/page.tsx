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
import { ArrowLeft, Lock, Loader2, BookOpen } from "lucide-react";
import { useLessons } from "@/hooks";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function LessonsPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subject');
  const [subjectName, setSubjectName] = useState<string>('');
  
  const { lessons, isLoading, error } = useLessons({
    subjectId: subjectId ? parseInt(subjectId) : undefined,
    status: 'approved',
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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => {
          const lessonImage = getLessonImage(lesson.id);

          return (
            <Card key={lesson.id} className="flex flex-col overflow-hidden">
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
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary">{lesson.subject?.name}</Badge>
                      <Badge variant={lesson.type === 'public' ? 'default' : 'outline'}>
                        {lesson.type === 'public' ? 'عام' : 'خاص'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                      بواسطة: {lesson.author?.name}
                    </p>
                  </div>
                  <CardTitle className="text-xl mt-2">{lesson.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>
                  {lesson.description || (lesson.content ? lesson.content.replace(/<pre[^>]*>[\s\S]*?<\/pre>/g, '').replace(/<[^>]*>?/gm, '').substring(0, 100) + '...' : '')}
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
        })}
        {lessons.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center">
            لا توجد دروس متاحة حاليًا.
          </p>
        )}
      </div>
    </div>
  );
}
