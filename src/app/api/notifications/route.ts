import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // التحقق من المصادقة
    await requireAuth();

    // إرجاع قائمة فارغة حالياً لإيقاف الأخطاء
    // TODO: ربط هذا بجدول Notifications في قاعدة البيانات لاحقاً
    return successResponse({
      notifications: [],
      unreadCount: 0
    });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch notifications', 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAuth();
    return successResponse(null, 'Notifications updated');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update notifications', 500);
  }
}