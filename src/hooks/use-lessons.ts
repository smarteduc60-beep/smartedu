import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface Lesson {
  id: number;
  title: string;
  description: string | null;
  content: string;
  videoUrl: string | null;
  pdfUrl: string | null;
  type: 'public' | 'private';
  status: 'pending' | 'approved' | 'rejected';
  subjectId: number;
  levelId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  subject?: {
    id: number;
    name: string;
  };
  level?: {
    id: number;
    name: string;
    stage: {
      id: number;
      name: string;
    };
  };
  author?: {
    id: number;
    name: string;
    email: string;
  };
  _count?: {
    exercises: number;
  };
}

interface UseLessonsParams {
  subjectId?: number;
  levelId?: number;
  status?: 'pending' | 'approved' | 'rejected';
  authorId?: number;
  page?: number;
  limit?: number;
}

interface UseLessonsReturn {
  lessons: Lesson[];
  total: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  createLesson: (data: CreateLessonData) => Promise<{ success: boolean; data?: Lesson; error?: string }>;
  updateLesson: (id: number, data: UpdateLessonData) => Promise<{ success: boolean; data?: Lesson; error?: string }>;
  deleteLesson: (id: number) => Promise<{ success: boolean; error?: string }>;
}

interface CreateLessonData {
  title: string;
  description?: string;
  content: string;
  videoUrl?: string;
  pdfUrl?: string;
  subjectId: number;
  levelId: number;
}

interface UpdateLessonData {
  title?: string;
  description?: string;
  content?: string;
  videoUrl?: string;
  pdfUrl?: string;
  status?: 'pending' | 'approved' | 'rejected';
  subjectId?: number;
  levelId?: number;
}

export function useLessons(params?: UseLessonsParams): UseLessonsReturn {
  const { data: session } = useSession();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLessons = useCallback(async () => {
    if (!session) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (params?.subjectId) queryParams.append('subjectId', params.subjectId.toString());
      if (params?.levelId) queryParams.append('levelId', params.levelId.toString());
      if (params?.status) queryParams.append('status', params.status);
      if (params?.authorId) queryParams.append('authorId', params.authorId.toString());
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const response = await fetch(`/api/lessons?${queryParams.toString()}`);
      const result = await response.json();

      if (result.success) {
        // Handle different API response formats
        const lessonsData = result.data?.lessons || result.lessons || result.data || [];
        setLessons(Array.isArray(lessonsData) ? lessonsData : []);
        setTotal(result.total || (Array.isArray(lessonsData) ? lessonsData.length : 0));
      } else {
        setError(result.error || 'فشل في تحميل الدروس');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تحميل الدروس');
      console.error('Error fetching lessons:', err);
    } finally {
      setIsLoading(false);
    }
  }, [session, params?.subjectId, params?.levelId, params?.status, params?.authorId, params?.page, params?.limit]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const createLesson = async (data: CreateLessonData) => {
    try {
      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        await fetchLessons();
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error || 'فشل في إنشاء الدرس' };
      }
    } catch (err) {
      console.error('Error creating lesson:', err);
      return { success: false, error: 'حدث خطأ أثناء إنشاء الدرس' };
    }
  };

  const updateLesson = async (id: number, data: UpdateLessonData) => {
    try {
      const response = await fetch(`/api/lessons/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        await fetchLessons();
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error || 'فشل في تحديث الدرس' };
      }
    } catch (err) {
      console.error('Error updating lesson:', err);
      return { success: false, error: 'حدث خطأ أثناء تحديث الدرس' };
    }
  };

  const deleteLesson = async (id: number) => {
    try {
      const response = await fetch(`/api/lessons/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await fetchLessons();
        return { success: true };
      } else {
        return { success: false, error: result.error || 'فشل في حذف الدرس' };
      }
    } catch (err) {
      console.error('Error deleting lesson:', err);
      return { success: false, error: 'حدث خطأ أثناء حذف الدرس' };
    }
  };

  return {
    lessons,
    total,
    isLoading,
    error,
    refetch: fetchLessons,
    createLesson,
    updateLesson,
    deleteLesson,
  };
}
