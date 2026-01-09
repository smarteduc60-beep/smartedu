import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

// 1. تعريف الأنواع للبيانات المرتبطة
export interface Subject {
  id: number;
  name: string;
}

export interface Level {
  id: number;
  name: string;
}

// 2. تحديث نوع الدرس ليشمل الأنواع الجديدة
export interface Lesson {
  id: number;
  title: string;
  content: string;
  authorId: string;
  subjectId: number;
  levelId: number;
  createdAt: string;
  updatedAt: string;
  videoUrl?: string;
  imageUrl?: string;
  pdfUrl?: string;
  // تضمين الكائنات الكاملة للمادة والمستوى
  subject: Subject;
  level: Level;
}

interface CreateLessonData {
  title: string;
  content: string;
  subjectId: number;
  levelId: number;
  videoUrl?: string;
  imageUrl?: string;
  pdfUrl?: string;
}

// 3. تحديث البارامترات للسماح بطلب التضمين
interface UseLessonsParams {
  authorId?: string;
  subjectId?: number;
  levelId?: number;
  page?: number;
  limit?: number;
  status?: string;
  include?: { 
    subject?: boolean;
    level?: boolean;
  };
}

interface UseLessonsReturn {
  lessons: Lesson[];
  isLoading: boolean;
  error: string | null;
  createLesson: (data: CreateLessonData) => Promise<{ success: boolean; data?: Lesson; error?: string }>;
  deleteLesson: (id: number) => Promise<{ success: boolean; error?: string }>;
}

export function useLessons(params?: UseLessonsParams): UseLessonsReturn {
  const { data: session } = useSession();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLessons = useCallback(async () => {
    if (!session) {
        setIsLoading(false);
        return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      // 4. بناء الـ query string ديناميكياً ليشمل بارامترات `include`
      const queryParams = new URLSearchParams();
      if (params?.authorId) queryParams.append('authorId', params.authorId);
      if (params?.subjectId) queryParams.append('subjectId', params.subjectId.toString());
      if (params?.levelId) queryParams.append('levelId', params.levelId.toString());
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);

      // إضافة بارامترات التضمين إذا كانت موجودة
      if (params?.include) {
        const includes = Object.entries(params.include)
          .filter(([, value]) => value)
          .map(([key]) => key);
        if (includes.length > 0) {
          queryParams.append('include', includes.join(','));
        }
      }

      const response = await fetch(`/api/lessons?${queryParams.toString()}`);
      const result = await response.json();

      if (result.success) {
        // API returns { success: true, data: { lessons: [...], pagination: {...} } }
        const lessonsData = result.data?.lessons || result.data || [];
        setLessons(Array.isArray(lessonsData) ? lessonsData : []);
      } else {
        setError(result.error || 'فشل في تحميل الدروس');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تحميل الدروس');
      console.error('Error fetching lessons:', err);
    } finally {
      setIsLoading(false);
    }
  // 5. إضافة `params.include` إلى مصفوفة الـ dependencies
  }, [session, params?.authorId, params?.subjectId, params?.levelId, params?.page, params?.limit, params?.status, JSON.stringify(params?.include)]); 

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const createLesson = useCallback(async (lessonData: CreateLessonData) => {
    try {
      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lessonData),
      });
      const result = await response.json();
      if (result.success) {
        fetchLessons(); // Refetch lessons to show the new one
      }
      return result;
    } catch (err) {
      console.error('Error creating lesson:', err);
      return { success: false, error: 'حدث خطأ أثناء إنشاء الدرس' };
    }
  }, [fetchLessons]);

  const deleteLesson = useCallback(async (id: number) => {
    try {
      const response = await fetch(`/api/lessons/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // إذا لم تكن الاستجابة ناجحة، حاول قراءة الخطأ من الخادم
      if (!response.ok) {
        if (response.status === 401) throw new Error('يرجى تسجيل الدخول أولاً للقيام بهذه العملية');
        if (response.status === 403) throw new Error('ليس لديك صلاحية لحذف هذا الدرس');

        try {
          const errorResult = await response.json();
          throw new Error(errorResult.error || `فشل الحذف. رمز الحالة: ${response.status}`);
        } catch (e) {
          // إذا كان جسم الاستجابة فارغًا أو ليس JSON
          throw new Error(`فشل الحذف. رمز الحالة: ${response.status}`);
        }
      }

      // في حالة النجاح، قم بتحديث الحالة المحلية مباشرةً
      setLessons((prev) => prev.filter((lesson) => lesson.id !== id));
      return { success: true };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ أثناء حذف الدرس';
      console.error('Error deleting lesson:', errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  return {
    lessons,
    isLoading,
    error,
    createLesson,
    deleteLesson,
  };
}
