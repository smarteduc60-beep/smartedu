import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export interface Submission {
  id: string; // Changed to string to match cuid from prisma schema
  answer: string;
  fileUrl: string | null;
  submittedAt: string; // DateTime
  aiEvalMode: 'auto' | 'manual';
  aiFeedback: string | null;
  aiScore: number | null;
  teacherNotes: string | null;
  finalScore: number | null;
  gradedAt: string | null; // DateTime
  exerciseId: string; // Changed to string
  studentId: string; // Changed to string
  gradedById: string | null; // Changed to string
  exercise: {
    id: string;
    questionRichContent: string;
    modelAnswer: string | null;
    maxScore: number | null;
    type: 'main' | 'support_with_results' | 'support_only';
    lesson: {
      id: string;
      title: string;
      subject: {
        id: string;
        name: string;
      };
      level: {
        id: string;
        name: string;
      }
    };
  };
  student: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  gradedBy: {
    id: string;
    name: string;
    email: string;
  } | null;
}

interface UseSubmissionReturn {
  submission: Submission | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  updateSubmission: (data: Partial<Submission>) => Promise<{ success: boolean; data?: Submission; error?: string }>;
}

export function useSubmission(submissionId: string | undefined): UseSubmissionReturn {
  const { data: session } = useSession();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmission = useCallback(async () => {
    if (!session || !submissionId) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/submissions/${submissionId}`);
      const result = await response.json();

      if (result.success) {
        setSubmission(result.data);
      } else {
        setError(result.error || 'فشل في تحميل الإجابة');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تحميل الإجابة');
      console.error('Error fetching submission:', err);
    } finally {
      setIsLoading(false);
    }
  }, [session, submissionId]);

  useEffect(() => {
    fetchSubmission();
  }, [fetchSubmission]);

  const updateSubmission = async (data: Partial<Submission>) => {
    if (!session || !submissionId) {
      return { success: false, error: 'غير مصرح لك أو لا يوجد معرف للإجابة' };
    }

    try {
      const response = await fetch(`/api/submissions/${submissionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setSubmission(result.data); // Update local state with the new data
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error || 'فشل في تحديث الإجابة' };
      }
    } catch (err) {
      console.error('Error updating submission:', err);
      return { success: false, error: 'حدث خطأ أثناء تحديث الإجابة' };
    }
  };


  return {
    submission,
    isLoading,
    error,
    refetch: fetchSubmission,
    updateSubmission,
  };
}