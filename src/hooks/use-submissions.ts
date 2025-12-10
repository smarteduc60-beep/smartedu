import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface Submission {
  id: number;
  answer: string;
  fileUrl: string | null;
  submittedAt: string;
  aiEvalMode: 'auto' | 'manual';
  aiFeedback: string | null;
  aiScore: number | null;
  teacherNotes: string | null;
  finalScore: number | null;
  gradedAt: string | null;
  exerciseId: number;
  studentId: number;
  gradedById: number | null;
  exercise?: {
    id: number;
    title: string;
    question: string;
    points: number;
    difficulty: string;
    type: string;
    lesson: {
      id: number;
      title: string;
      subject: {
        id: number;
        name: string;
      };
    };
  };
  student?: {
    id: number;
    name: string;
    email: string;
  };
  gradedBy?: {
    id: number;
    name: string;
    email: string;
  };
}

interface UseSubmissionsParams {
  exerciseId?: number;
  studentId?: number;
  gradedById?: number;
  page?: number;
  limit?: number;
}

interface UseSubmissionsReturn {
  submissions: Submission[];
  total: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  createSubmission: (data: CreateSubmissionData) => Promise<{ success: boolean; data?: Submission; error?: string }>;
  gradeSubmission: (id: number, data: GradeSubmissionData) => Promise<{ success: boolean; data?: Submission; error?: string }>;
}

interface CreateSubmissionData {
  exerciseId: number;
  answer: string;
  fileUrl?: string;
  aiEvalMode: 'auto' | 'manual';
}

interface GradeSubmissionData {
  finalScore: number;
  teacherNotes?: string;
}

export function useSubmissions(params?: UseSubmissionsParams): UseSubmissionsReturn {
  const { data: session } = useSession();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    if (!session) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (params?.exerciseId) queryParams.append('exerciseId', params.exerciseId.toString());
      if (params?.studentId) queryParams.append('studentId', params.studentId.toString());
      if (params?.gradedById) queryParams.append('gradedById', params.gradedById.toString());
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const response = await fetch(`/api/submissions?${queryParams.toString()}`);
      const result = await response.json();

      if (result.success) {
        setSubmissions(result.data);
        setTotal(result.total || result.data.length);
      } else {
        setError(result.error || 'فشل في تحميل الإجابات');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تحميل الإجابات');
      console.error('Error fetching submissions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [session, params?.exerciseId, params?.studentId, params?.gradedById, params?.page, params?.limit]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const createSubmission = async (data: CreateSubmissionData) => {
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        await fetchSubmissions();
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error || 'فشل في إرسال الإجابة' };
      }
    } catch (err) {
      console.error('Error creating submission:', err);
      return { success: false, error: 'حدث خطأ أثناء إرسال الإجابة' };
    }
  };

  const gradeSubmission = async (id: number, data: GradeSubmissionData) => {
    try {
      const response = await fetch(`/api/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        await fetchSubmissions();
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error || 'فشل في تقييم الإجابة' };
      }
    } catch (err) {
      console.error('Error grading submission:', err);
      return { success: false, error: 'حدث خطأ أثناء تقييم الإجابة' };
    }
  };

  return {
    submissions,
    total,
    isLoading,
    error,
    refetch: fetchSubmissions,
    createSubmission,
    gradeSubmission,
  };
}
