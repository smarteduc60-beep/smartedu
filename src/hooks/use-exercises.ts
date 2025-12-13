import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface Exercise {
  id: number;
  lessonId: number;
  type: string;
  question?: string | null;
  questionFileUrl?: string | null;
  questionRichContent?: string | null;
  modelAnswer?: string | null;
  modelAnswerImage?: string | null;
  expectedResults?: any;
  maxScore: number;
  allowRetry: boolean;
  maxAttempts: number;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  lesson?: {
    id: number;
    title: string;
    subject?: {
      id: number;
      name: string;
    };
    level?: {
      id: number;
      name: string;
    };
  };
  _count?: {
    submissions: number;
  };
}

interface UseExercisesParams {
  lessonId?: number;
  authorId?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  type?: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'code';
  page?: number;
  limit?: number;
}

interface UseExercisesReturn {
  exercises: Exercise[];
  total: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  createExercise: (data: CreateExerciseData) => Promise<{ success: boolean; data?: Exercise; error?: string }>;
  updateExercise: (id: number, data: UpdateExerciseData) => Promise<{ success: boolean; data?: Exercise; error?: string }>;
  deleteExercise: (id: number) => Promise<{ success: boolean; error?: string }>;
}

interface CreateExerciseData {
  title: string;
  description?: string;
  question: string;
  correctAnswer?: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'code';
  lessonId: number;
}

interface UpdateExerciseData {
  title?: string;
  description?: string;
  question?: string;
  correctAnswer?: string;
  points?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  type?: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'code';
}

export function useExercises(params?: UseExercisesParams): UseExercisesReturn {
  const { data: session } = useSession();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = useCallback(async () => {
    if (!session) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (params?.lessonId) queryParams.append('lessonId', params.lessonId.toString());
      if (params?.authorId) queryParams.append('authorId', params.authorId);
      if (params?.difficulty) queryParams.append('difficulty', params.difficulty);
      if (params?.type) queryParams.append('type', params.type);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const response = await fetch(`/api/exercises?${queryParams.toString()}`);
      const result = await response.json();

      if (result.success) {
        const exercisesList = result.data?.exercises || result.data || [];
        setExercises(Array.isArray(exercisesList) ? exercisesList : []);
        setTotal(result.total || exercisesList.length);
      } else {
        setError(result.error || 'فشل في تحميل التمارين');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تحميل التمارين');
      console.error('Error fetching exercises:', err);
    } finally {
      setIsLoading(false);
    }
  }, [session, params?.lessonId, params?.authorId, params?.difficulty, params?.type, params?.page, params?.limit]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const createExercise = async (data: CreateExerciseData) => {
    try {
      const response = await fetch('/api/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        await fetchExercises();
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error || 'فشل في إنشاء التمرين' };
      }
    } catch (err) {
      console.error('Error creating exercise:', err);
      return { success: false, error: 'حدث خطأ أثناء إنشاء التمرين' };
    }
  };

  const updateExercise = async (id: number, data: UpdateExerciseData) => {
    try {
      const response = await fetch(`/api/exercises/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        await fetchExercises();
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error || 'فشل في تحديث التمرين' };
      }
    } catch (err) {
      console.error('Error updating exercise:', err);
      return { success: false, error: 'حدث خطأ أثناء تحديث التمرين' };
    }
  };

  const deleteExercise = async (id: number) => {
    try {
      const response = await fetch(`/api/exercises/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await fetchExercises();
        return { success: true };
      } else {
        return { success: false, error: result.error || 'فشل في حذف التمرين' };
      }
    } catch (err) {
      console.error('Error deleting exercise:', err);
      return { success: false, error: 'حدث خطأ أثناء حذف التمرين' };
    }
  };

  return {
    exercises,
    total,
    isLoading,
    error,
    refetch: fetchExercises,
    createExercise,
    updateExercise,
    deleteExercise,
  };
}
