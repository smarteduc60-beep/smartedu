import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const userId = session.user.id;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to last 50 notifications
    });

    const unreadCount = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return successResponse({
      notifications,
      unreadCount,
    });
  } catch (error: any) {
    // Handle auth errors gracefully, which the frontend expects
    if (error.message?.includes('يجب تسجيل الدخول أولاً')) {
        return errorResponse('Unauthorized', 401);
    }
    console.error('[API Notifications GET] Error:', error);
    return errorResponse(error.message || 'فشل في جلب الإشعارات', 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAuth();
    const userId = session.user.id;
    const body = await request.json();
    const { notificationId, markAllAsRead } = body;

    if (markAllAsRead) {
      await prisma.notification.updateMany({
        where: {
          userId,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });
      return successResponse(null, 'تم تعليم كل الإشعارات كمقروءة');
    }

    if (notificationId) {
      await prisma.notification.update({
        where: {
          id: notificationId,
          userId: userId, // Ensure user can only update their own notifications
        },
        data: {
          isRead: true,
        },
      });
      return successResponse(null, 'تم تعليم الإشعار كمقروء');
    }

    return errorResponse('لم يتم تحديد أي إجراء', 400);
  } catch (error: any) {
    console.error('[API Notifications PATCH] Error:', error);
    return errorResponse(error.message || 'فشل في تحديث الإشعارات', 500);
  }
}