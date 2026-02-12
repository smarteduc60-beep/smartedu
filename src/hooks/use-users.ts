import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface User {
  id: number;
  email: string;
  name: string;
  image: string | null;
  role: string;
  profileComplete: boolean;
  isBanned?: boolean;
  lessonsCount?: number;
  exercisesCount?: number;
  createdAt: string;
  updatedAt: string;
  details?: {
    phone: string | null;
    address: string | null;
    bio: string | null;
    stageId: number | null;
    subjectId: number | null;
    levelId: number | null;
    parentCode: string | null;
    teacherCode: string | null;
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
  };
}

interface UseUsersParams {
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface UseUsersReturn {
  users: User[];
  total: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  createUser: (data: CreateUserData) => Promise<{ success: boolean; data?: User; error?: string }>;
  updateUser: (id: number, data: UpdateUserData) => Promise<{ success: boolean; data?: User; error?: string }>;
  deleteUser: (id: number) => Promise<{ success: boolean; error?: string }>;
}

interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleName: string;
  stageId?: number;
  subjectId?: number;
  levelId?: number;
}

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  role?: string;
  password?: string;
  phone?: string;
  address?: string;
  bio?: string;
  subjectId?: number;
  levelId?: number;
  isBanned?: boolean;
}

export function useUsers(params?: UseUsersParams): UseUsersReturn {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!session) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (params?.role) queryParams.append('role', params.role);
      if (params?.search) queryParams.append('search', params.search);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const response = await fetch(`/api/users?${queryParams.toString()}`);
      const result = await response.json();

      if (result.success) {
        setUsers(result.data);
        setTotal(result.total || result.data.length);
      } else {
        setError(result.error || 'فشل في تحميل المستخدمين');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تحميل المستخدمين');
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  }, [session, params?.role, params?.search, params?.page, params?.limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = async (data: CreateUserData) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        await fetchUsers();
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error || 'فشل في إنشاء المستخدم' };
      }
    } catch (err) {
      console.error('Error creating user:', err);
      return { success: false, error: 'حدث خطأ أثناء إنشاء المستخدم' };
    }
  };

  const updateUser = async (id: number, data: UpdateUserData) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        await fetchUsers();
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error || 'فشل في تحديث المستخدم' };
      }
    } catch (err) {
      console.error('Error updating user:', err);
      return { success: false, error: 'حدث خطأ أثناء تحديث المستخدم' };
    }
  };

  const deleteUser = async (id: number) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await fetchUsers();
        return { success: true };
      } else {
        return { success: false, error: result.error || 'فشل في حذف المستخدم' };
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      return { success: false, error: 'حدث خطأ أثناء حذف المستخدم' };
    }
  };

  return {
    users,
    total,
    isLoading,
    error,
    refetch: fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}
