'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Level {
  id: number;
  name: string;
  stageId: number;
  displayOrder: number;
  stage?: {
    id: number;
    name: string;
  };
}

export interface UseLevelsParams {
  stageId?: number;
}

export interface UseLevelsReturn {
  levels: Level[];
  isLoading: boolean;
  error: string | null;
  createLevel: (data: Omit<Level, 'id' | 'stage'>) => Promise<{ success: boolean; level?: Level; error?: string }>;
  updateLevel: (data: Omit<Level, 'stage'>) => Promise<{ success: boolean; level?: Level; error?: string }>;
  deleteLevel: (id: number) => Promise<{ success: boolean; error?: string }>;
  refetch: () => Promise<void>;
}

export function useLevels(params?: UseLevelsParams): UseLevelsReturn {
  const [levels, setLevels] = useState<Level[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLevels = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (params?.stageId) {
        queryParams.append('stageId', params.stageId.toString());
      }

      const response = await fetch(`/api/levels?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch levels');
      }

      const data = await response.json();
      // Handle both response formats: { levels: [...] } or { data: { levels: [...] } }
      const levelsData = data.levels || data.data?.levels || [];
      setLevels(levelsData);
    } catch (err) {
      console.error('Error fetching levels:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [params?.stageId]);

  useEffect(() => {
    fetchLevels();
  }, [fetchLevels]);

  const createLevel = async (levelData: Omit<Level, 'id' | 'stage'>) => {
    try {
      const response = await fetch('/api/levels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(levelData),
      });

      if (!response.ok) {
        const data = await response.json();
        return { success: false, error: data.error || 'Failed to create level' };
      }

      const data = await response.json();
      setLevels((prev) => [...prev, data.level]);
      return { success: true, level: data.level };
    } catch (err) {
      console.error('Error creating level:', err);
      return { success: false, error: 'An error occurred' };
    }
  };

  const updateLevel = async (levelData: Omit<Level, 'stage'>) => {
    try {
      const response = await fetch('/api/levels', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(levelData),
      });

      if (!response.ok) {
        const data = await response.json();
        return { success: false, error: data.error || 'Failed to update level' };
      }

      const data = await response.json();
      setLevels((prev) => prev.map((l) => (l.id === data.level.id ? data.level : l)));
      return { success: true, level: data.level };
    } catch (err) {
      console.error('Error updating level:', err);
      return { success: false, error: 'An error occurred' };
    }
  };

  const deleteLevel = async (id: number) => {
    try {
      const response = await fetch(`/api/levels?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        return { success: false, error: data.error || 'Failed to delete level' };
      }

      setLevels((prev) => prev.filter((l) => l.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting level:', err);
      return { success: false, error: 'An error occurred' };
    }
  };

  return {
    levels,
    isLoading,
    error,
    createLevel,
    updateLevel,
    deleteLevel,
    refetch: fetchLevels,
  };
}
