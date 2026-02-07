'use client';

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileQuestion, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainExercise from "./components/MainExercise";
import SupportWithResultsExercise from "./components/SupportWithResultsExercise";
import SupportOnlyExercise from "./components/SupportOnlyExercise";
import MathContent from "@/components/MathContent";

// دالة مساعدة لتحويل روابط Google Drive القديمة إلى روابط Proxy
const getProxiedUrl = (url: string) => {
  if (!url) return "";
  
  // تنظيف الرابط من أي لاحقات وهمية قد تكون أضيفت سابقاً
  const cleanUrl = url.replace('&t=image.jpg', '');
  if (cleanUrl.startsWith('/api/images/proxy')) return cleanUrl;
  
  const idMatch = url.match(/id=([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if ((url.includes('drive.google.com') || url.includes('googleusercontent.com')) && idMatch && idMatch[1]) {
    return `/api/images/proxy?fileId=${idMatch[1]}`;
  }
  
  return url;
};

// دالة مساعدة لتحويل روابط PDF إلى صيغة المعاينة (Preview) لضمان عملها داخل iframe
const getPdfPreviewUrl = (url: string) => {
  if (!url) return "";
  if (url.includes('/preview')) return url;
  if (url.includes('/view')) return url.replace('/view', '/preview');
  
  const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
  }
  return url;
};

interface Lesson {
  id: number;
  title: string;
  content: string;
  videoUrl?: string;
  pdfUrl?: string;
  imageUrl?: string;
  subject?: {
    id: number;
    name: string;
  };
  level?: {
    id: number;
    name: string;
  };
  author?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface Exercise {
  id: number;
  type: 'main' | 'support_with_results' | 'support_only';
  question?: string;
  questionRichContent?: string;
  questionFileUrl?: string;
  modelAnswer?: string;
  modelAnswerImage?: string;
  expectedResults?: any;
  maxScore?: number;
  allowRetry?: boolean;
  maxAttempts?: number;
  lessonId: number;
  options?: { showAxes?: boolean; showGrid?: boolean; [key: string]: any };
}

export default function LessonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession();
  const [lessonId, setLessonId] = useState<string>('');
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState<string>("");

  useEffect(() => {
    const fetchLessonData = async () => {
      const resolvedParams = await params;
      const id = resolvedParams.id;
      setLessonId(id);
      
      try {
        setLoading(true);
        
        // Fetch lesson details
        const lessonRes = await fetch(`/api/lessons/${id}`);
        const lessonData = await lessonRes.json();
        
        if (!lessonData.success) {
          setNotFoundError(true);
          return;
        }
        
        setLesson(lessonData.data);
        if (lessonData.data.imageUrl) {
          setCurrentImageSrc(getProxiedUrl(lessonData.data.imageUrl));
        }
        
        // Fetch exercises for this lesson
        const exercisesRes = await fetch(`/api/exercises?lessonId=${id}`);
        const exercisesData = await exercisesRes.json();
        
        if (exercisesData.success) {
          const exercisesList = exercisesData.data?.exercises || exercisesData.data || [];
          setExercises(Array.isArray(exercisesList) ? exercisesList : []);
        }
      } catch (error) {
        console.error('Error fetching lesson:', error);
        setNotFoundError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchLessonData();
  }, [params]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFoundError || !lesson) {
    return notFound();
  }

  const handleImageError = () => {
    // استخراج معرف الملف من الرابط الحالي
    let fileId = null;
    
    try {
      // استخدام URL API لاستخراج المعاملات بشكل أدق وموثوق
      // نستخدم base وهمي للتعامل مع الروابط النسبية
      const urlObj = new URL(currentImageSrc, 'http://localhost');
      fileId = urlObj.searchParams.get('fileId') || urlObj.searchParams.get('id');
    } catch (e) {
      // محاولة استخراج بديلة في حال فشل URL parsing
      const idMatch = currentImageSrc.match(/[\?&](fileId|id)=([^&]+)/);
      if (idMatch) fileId = idMatch[2];
    }

    if (!fileId) {
      setImageError(true);
      return;
    }

    // التسلسل: Proxy -> Direct (uc) -> Thumbnail
    if (currentImageSrc.includes('/api/images/proxy')) {
      console.warn("Proxy failed, falling back to direct Google Drive URL");
      setCurrentImageSrc(`https://drive.google.com/uc?export=view&id=${fileId}`);
    } else if (currentImageSrc.includes('uc?export=view')) {
      console.warn("Direct URL failed, falling back to Thumbnail URL");
      // رابط Thumbnail يعمل غالباً حتى لو فشلت الروابط الأخرى
      setCurrentImageSrc(`https://drive.google.com/thumbnail?id=${fileId}&sz=w1920`);
    } else {
      // إذا فشل كل شيء (بما في ذلك Thumbnail)
      console.error("All image loading attempts failed");
      setImageError(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        {lesson.subject && (
          <Badge variant="secondary" className="mb-2">{lesson.subject.name}</Badge>
        )}
        <h1 className="text-4xl font-bold tracking-tight">{lesson.title}</h1>
        {lesson.author && (
          <p className="text-muted-foreground mt-2">
            الأستاذ: {lesson.author.firstName} {lesson.author.lastName}
          </p>
        )}
      </div>

      <Card className="mb-8 overflow-hidden">
        {lesson.videoUrl && (
          <div className="aspect-video">
            <iframe
              className="w-full h-full"
              src={lesson.videoUrl.replace('watch?v=', 'embed/')}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
        <CardHeader>
          <CardTitle>محتوى الدرس</CardTitle>
        </CardHeader>
        <CardContent>
          <MathContent 
            content={lesson.content}
            className="prose prose-lg max-w-none dark:prose-invert text-foreground" 
          />
        </CardContent>
      </Card>

      {/* عرض صورة الدرس */}
      {lesson.imageUrl && (
        <Card className="mb-8 overflow-hidden">
          <div className="relative w-full h-[400px] bg-muted flex items-center justify-center">
            {!imageError ? (
              <img
                src={currentImageSrc}
                alt={lesson.title}
                className="w-full h-full object-cover"
                onError={handleImageError}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-4 text-muted-foreground">
                <FileQuestion className="h-10 w-10 mb-2 opacity-50" />
                <p className="text-sm">تعذر تحميل الصورة</p>
                <code className="text-[10px] mt-2 bg-black/5 p-1 rounded max-w-full break-all dir-ltr">{currentImageSrc}</code>
              </div>
            )}
          </div>
        </Card>
      )}

      {lesson.pdfUrl && (
        <Card className="mb-8 overflow-hidden" id="pdf-viewer-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>ملف PDF المرفق</span>
              <div className="flex gap-2">
                <Link href={lesson.pdfUrl} target="_blank" passHref>
                  <Button variant="outline" size="sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    <span>تحميل</span>
                  </Button>
                </Link>
                <Link href={lesson.pdfUrl} target="_blank" passHref>
                  <Button variant="outline" size="sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                    <span>فتح في نافذة جديدة</span>
                  </Button>
                </Link>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full h-[800px]">
              <iframe
                src={getPdfPreviewUrl(lesson.pdfUrl)}
                className="w-full h-full border-0"
                title="PDF Viewer"
              />
            </div>
          </CardContent>
        </Card>
      )}
      
      {exercises.length > 0 && (
        <>
          <Separator className="my-8" />
          
          <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
              <FileQuestion className="text-primary"/>
              تمارين الدرس
              <Badge variant="secondary" className="mr-auto">
                {exercises.length} {exercises.length === 1 ? 'تمرين' : 'تمرين'}
              </Badge>
            </h2>
            
            <Tabs defaultValue="0" className="w-full">
              <TabsList className="w-full justify-start flex-wrap h-auto">
                {exercises.map((exercise, index) => (
                  <TabsTrigger key={exercise.id} value={String(index)} className="gap-2">
                    <span>تمرين {index + 1}</span>
                    <Badge 
                      variant={
                        exercise.type === 'main' 
                          ? 'default' 
                          : exercise.type === 'support_with_results' 
                          ? 'secondary' 
                          : 'outline'
                      }
                      className="text-xs"
                    >
                      {exercise.type === 'main' 
                        ? 'رئيسي' 
                        : exercise.type === 'support_with_results' 
                        ? 'دعم+نتائج' 
                        : 'دعم'}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>

              {exercises.map((exercise, index) => (
                <TabsContent key={exercise.id} value={String(index)} className="mt-6">
                  {exercise.type === 'main' && (
                    <MainExercise 
                      exercise={exercise}
                      studentId={session?.user?.id ? String(session.user.id) : ''}
                    />
                  )}
                  {exercise.type === 'support_with_results' && (
                    <SupportWithResultsExercise exercise={exercise} />
                  )}
                  {exercise.type === 'support_only' && (
                    <SupportOnlyExercise exercise={exercise} />
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </>
      )}
      
      {exercises.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileQuestion className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">لا توجد تمارين لهذا الدرس بعد</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
