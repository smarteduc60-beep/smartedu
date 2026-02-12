import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface Message {
  id: number;
  subject: string;
  body: string;
  isRead: boolean;
  sentAt: string;
  senderId: number;
  recipientId: number;
  sender?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  recipient?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

interface UseMessagesParams {
  type?: 'sent' | 'received' | 'all';
  isRead?: boolean;
  page?: number;
  limit?: number;
}

interface UseMessagesReturn {
  messages: Message[];
  total: number;
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  sendMessage: (data: SendMessageData) => Promise<{ success: boolean; data?: Message; error?: string }>;
  markAsRead: (id: number) => Promise<{ success: boolean; error?: string }>;
  deleteMessage: (id: number) => Promise<{ success: boolean; error?: string }>;
}

interface SendMessageData {
  recipientId: number;
  subject: string;
  body: string;
}

export function useMessages(params?: UseMessagesParams): UseMessagesReturn {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!session) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (params?.type) queryParams.append('type', params.type);
      if (params?.isRead !== undefined) queryParams.append('isRead', params.isRead.toString());
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const response = await fetch(`/api/messages?${queryParams.toString()}`);
      const result = await response.json();

      if (result.success) {
        setMessages(result.data);
        setTotal(result.total || result.data.length);
        setUnreadCount(result.unreadCount || 0);
      } else {
        setError(result.error || 'فشل في تحميل الرسائل');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تحميل الرسائل');
      console.error('Error fetching messages:', err);
    } finally {
      setIsLoading(false);
    }
  }, [session, params?.type, params?.isRead, params?.page, params?.limit]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const sendMessage = async (data: SendMessageData) => {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        await fetchMessages();
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error || 'فشل في إرسال الرسالة' };
      }
    } catch (err) {
      console.error('Error sending message:', err);
      return { success: false, error: 'حدث خطأ أثناء إرسال الرسالة' };
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      });

      const result = await response.json();

      if (result.success) {
        await fetchMessages();
        return { success: true };
      } else {
        return { success: false, error: result.error || 'فشل في تحديث الرسالة' };
      }
    } catch (err) {
      console.error('Error marking message as read:', err);
      return { success: false, error: 'حدث خطأ أثناء تحديث الرسالة' };
    }
  };

  const deleteMessage = async (id: number) => {
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await fetchMessages();
        return { success: true };
      } else {
        return { success: false, error: result.error || 'فشل في حذف الرسالة' };
      }
    } catch (err) {
      console.error('Error deleting message:', err);
      return { success: false, error: 'حدث خطأ أثناء حذف الرسالة' };
    }
  };

  return {
    messages,
    total,
    unreadCount,
    isLoading,
    error,
    refetch: fetchMessages,
    sendMessage,
    markAsRead,
    deleteMessage,
  };
}
