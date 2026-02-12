'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Subject {
  id: number;
  name: string;
  description: string;
  stageId?: number;
  levelId?: number;
  levelIds?: number[];
  levels?: { id: number; name: string }[];
}

export interface UseSubjectsReturn {
  subjects: Subject[];
  isLoading: boolean;
  error: string | null;
  createSubject: (data: Omit<Subject, 'id'>) => Promise<{ success: boolean; subject?: Subject; error?: string }>;
  updateSubject: (data: Subject) => Promise<{ success: boolean; subject?: Subject; error?: string }>;
  deleteSubject: (id: number) => Promise<{ success: boolean; error?: string }>;
  refetch: () => Promise<void>;
}

export function useSubjects(): UseSubjectsReturn {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/subjects');
      if (!response.ok) {
        throw new Error('Failed to fetch subjects');
      }

      const data = await response.json();
      if (data.success) {
        const subjectsData = data.data?.subjects || data.subjects || data.data || [];
        setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
      } else {
        throw new Error(data.error || 'Failed to fetch subjects');
      }
    } catch (err) {
      console.error('Error fetching subjects:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const createSubject = async (subjectData: Omit<Subject, 'id'>) => {
    try {
      const response = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subjectData),
      });

      let result;
      try {
        result = await response.json();
      } catch (err) {
        result = { success: response.ok };
      }

      if (response.ok && result.success) {
        await fetchSubjects();
        return { success: true, subject: result.data?.subject || result.subject };
      } else {
        const errorMessage = result.error || `Request failed with status ${response.status}`;
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      console.error('Error creating subject:', err);
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const updateSubject = async (subjectData: Subject) => {
    try {
      const response = await fetch(`/api/subjects/${subjectData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subjectData),
      });

      let result: any = {};
      try {
        result = await response.json();
      } catch (err) {
        result = { success: response.ok };
      }

      if (response.ok && result.success) {
        await fetchSubjects();
        return { success: true, subject: result.data?.subject || result.subject };
      } else {
        const errorMessage = result.error || `Request failed with status ${response.status}`;
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      console.error('Error updating subject:', err);
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const deleteSubject = async (id: number) => {
    try {
      const response = await fetch(`/api/subjects/${id}`, {
        method: 'DELETE',
      });

      let result;
      try {
        result = await response.json();
      } catch (err) {
        result = { success: response.ok };
      }

      if (response.ok && result.success) {
        await fetchSubjects();
        return { success: true };
      } else {
        const errorMessage = result.error || `Request failed with status ${response.status}`;
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      console.error('Error deleting subject:', err);
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  return {
    subjects,
    isLoading,
    error,
    createSubject,
    updateSubject,
    deleteSubject,
    refetch: fetchSubjects,
  };
}
