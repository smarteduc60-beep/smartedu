import { useState, useEffect, useCallback } from 'react';

// ==================== Stages Hook ====================

interface Stage {
  id: number;
  name: string;
  description: string;
}

interface UseStagesReturn {
  stages: Stage[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useStages(): UseStagesReturn {
  const [stages, setStages] = useState<Stage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStages = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stages');
      const result = await response.json();

      if (result.success) {
        const stagesData = result.data?.stages || result.data || [];
        setStages(Array.isArray(stagesData) ? stagesData : []);
      } else {
        setError(result.error || 'فشل في تحميل المراحل');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تحميل المراحل');
      console.error('Error fetching stages:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStages();
  }, [fetchStages]);

  return {
    stages,
    isLoading,
    error,
    refetch: fetchStages,
  };
}

// ==================== Levels Hook ====================

interface Level {
  id: number;
  name: string;
  stage_id: number;
  stage?: {
    id: number;
    name: string;
  };
}

interface UseLevelsParams {
  stageId?: number;
}

interface UseLevelsReturn {
  levels: Level[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useLevels(params?: UseLevelsParams): UseLevelsReturn {
  const [levels, setLevels] = useState<Level[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLevels = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (params?.stageId) queryParams.append('stageId', params.stageId.toString());

      const response = await fetch(`/api/levels?${queryParams.toString()}`);
      const result = await response.json();

      if (result.success) {
        // التعامل مع حالتين: data.levels أو data مباشرة
        const levelsData = result.data.levels || result.data;
        setLevels(Array.isArray(levelsData) ? levelsData : []);
      } else {
        setError(result.error || 'فشل في تحميل المستويات');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تحميل المستويات');
      console.error('Error fetching levels:', err);
    } finally {
      setIsLoading(false);
    }
  }, [params?.stageId]);

  useEffect(() => {
    fetchLevels();
  }, [fetchLevels]);

  return {
    levels,
    isLoading,
    error,
    refetch: fetchLevels,
  };
}

// ==================== Subjects Hook ====================

interface Subject {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
}

interface UseSubjectsReturn {
  subjects: Subject[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useSubjects(): UseSubjectsReturn {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/subjects');
      const result = await response.json();

      if (result.success) {
        const subjectsData = result.data?.subjects || result.data || [];
        setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
      } else {
        setError(result.error || 'فشل في تحميل المواد');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تحميل المواد');
      console.error('Error fetching subjects:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  return {
    subjects,
    isLoading,
    error,
    refetch: fetchSubjects,
  };
}
