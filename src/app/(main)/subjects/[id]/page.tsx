'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Book, Loader2, Lock, Unlock } from "lucide-react";

export default function SubjectLessonsPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [lessons, setLessons] = useState<any[]>([]);
  const [subject, setSubject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      if (!session?.user || !params.id) return;

      try {
        setIsLoading(true);

        // جلب معلومات المادة
        const subjectRes = await fetch(`/api/subjects/${params.id}`);
        const subjectData = await subjectRes.json();
        if (subjectData.success) {
          setSubject(subjectData.data);
        }

        // جلب الأساتذة المرتبطين
        const teachersRes = await fetch('/api/students/teachers');
        const teachersData = await teachersRes.json();
        const teacherIds = teachersData.success 
          ? teachersData.data.teachers.map((t: any) => t.id) 
          : [];

        // جلب دروس المادة (عامة + دروس الأساتذة المرتبطين)
        const lessonsRes = await fetch(`/api/lessons?subjectId=${params.id}`);
        const lessonsResult = await lessonsRes.json();
        
        if (lessonsResult.success) {
          const lessonsList = lessonsResult.data?.lessons || lessonsResult.data || [];
          // تصفية: دروس عامة أو دروس من أساتذة مرتبطين
          const filteredLessons = lessonsList.filter((lesson: any) => 
            lesson.type === 'public' || teacherIds.includes(lesson.authorId)
          );
          setLessons(Array.isArray(filteredLessons) ? filteredLessons : []);
        }
      } catch (error) {
        console.error('Error fetching lessons:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessons();
  }, [session, params.id]);

  // تجميع الدروس حسب المستوى
  const groupedLessons: { levelName: string; lessons: any[] }[] = [];
  lessons.forEach((lesson) => {
    const levelName = lesson.level?.name || 'مستوى غير محدد';
    let group = groupedLessons.find(g => g.levelName === levelName);
    if (!group) {
      group = { levelName, lessons: [] };
      groupedLessons.push(group);
    }
    group.lessons.push(lesson);
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {subject?.name || 'دروس المادة'}
        </h1>
        <p className="text-muted-foreground">
          {subject?.description || 'اختر درساً لتبدأ التعلم'}
        </p>
      </div>

      {lessons.length > 0 ? (
        <div className="space-y-12">
          {groupedLessons.map((group) => (
            <div key={group.levelName} className="space-y-6">
              <div className="flex items-center gap-3 border-b pb-2">
                <div className="h-8 w-1.5 bg-primary rounded-full" />
                <h2 className="text-2xl font-bold text-foreground">{group.levelName}</h2>
                <Badge variant="secondary" className="mr-auto">
                  {group.lessons.length} {group.lessons.length === 1 ? 'درس' : 'دروس'}
                </Badge>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {group.lessons.map((lesson) => (
                  <Card key={lesson.id} className="hover:shadow-lg transition-shadow flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Book className="h-5 w-5 text-primary" />
                        <Badge variant={lesson.type === 'public' ? 'default' : 'secondary'}>
                          {lesson.type === 'public' ? 'عام' : 'خاص'}
                        </Badge>
                      </div>
                      <CardTitle className="line-clamp-2">{lesson.title}</CardTitle>
                      <CardDescription className="line-clamp-3">
                        {lesson.content ? lesson.content.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...' : 'لا يوجد وصف'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {lesson.isLocked ? (
                            <Lock className="h-4 w-4" />
                          ) : (
                            <Unlock className="h-4 w-4" />
                          )}
                          <span>{lesson.isLocked ? 'مغلق' : 'متاح'}</span>
                        </div>
                        <Link href={`/lessons/${lesson.id}`}>
                          <Button size="sm">
                            بدء الدرس
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Book className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              لا توجد دروس متاحة لهذه المادة حالياً
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
