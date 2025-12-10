'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Stage {
  id: number;
  name: string;
  displayOrder: number;
}

export interface UseStagesReturn {
  stages: Stage[];
  isLoading: boolean;
  error: string | null;
  createStage: (data: Omit<Stage, 'id'>) => Promise<{ success: boolean; stage?: Stage; error?: string }>;
  updateStage: (data: Stage) => Promise<{ success: boolean; stage?: Stage; error?: string }>;
  deleteStage: (id: number) => Promise<{ success: boolean; error?: string }>;
  refetch: () => Promise<void>;
}

export function useStages(): UseStagesReturn {
  const [stages, setStages] = useState<Stage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/stages');
      if (!response.ok) {
        throw new Error('Failed to fetch stages');
      }

      const data = await response.json();
      // Handle both response formats: { stages: [...] } or { data: { stages: [...] } }
      const stagesData = data.stages || data.data?.stages || [];
      setStages(stagesData);
    } catch (err) {
      console.error('Error fetching stages:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStages();
  }, [fetchStages]);

  const createStage = async (stageData: Omit<Stage, 'id'>) => {
    try {
      const response = await fetch('/api/stages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stageData),
      });

      if (!response.ok) {
        const data = await response.json();
        return { success: false, error: data.error || 'Failed to create stage' };
      }

      const data = await response.json();
      setStages((prev) => [...prev, data.stage]);
      return { success: true, stage: data.stage };
    } catch (err) {
      console.error('Error creating stage:', err);
      return { success: false, error: 'An error occurred' };
    }
  };

  const updateStage = async (stageData: Stage) => {
    try {
      const response = await fetch('/api/stages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stageData),
      });

      if (!response.ok) {
        const data = await response.json();
        return { success: false, error: data.error || 'Failed to update stage' };
      }

      const data = await response.json();
      setStages((prev) => prev.map((s) => (s.id === data.stage.id ? data.stage : s)));
      return { success: true, stage: data.stage };
    } catch (err) {
      console.error('Error updating stage:', err);
      return { success: false, error: 'An error occurred' };
    }
  };

  const deleteStage = async (id: number) => {
    try {
      const response = await fetch(`/api/stages?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        return { success: false, error: data.error || 'Failed to delete stage' };
      }

      setStages((prev) => prev.filter((s) => s.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting stage:', err);
      return { success: false, error: 'An error occurred' };
    }
  };

  return {
    stages,
    isLoading,
    error,
    createStage,
    updateStage,
    deleteStage,
    refetch: fetchStages,
  };
}
