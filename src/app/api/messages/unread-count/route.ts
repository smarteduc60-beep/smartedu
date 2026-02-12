import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    // إرجاع 0 حالياً لإيقاف الأخطاء
    // TODO: ربط هذا بجدول Messages في قاعدة البيانات لاحقاً
    return successResponse({
      unreadCount: 0
    });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch unread count', 500);
  }
}