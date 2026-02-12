import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';
import { successResponse, errorResponse, notFoundResponse } from '@/lib/api-response';

// PATCH /api/messages/[id] - تحديث حالة الرسالة (قراءة/عدم قراءة)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const messageId = parseInt(params.id);

    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return notFoundResponse('الرسالة غير موجودة');
    }

    // فقط المستلم يمكنه تحديث حالة القراءة
    if (message.recipientId !== session.user.id) {
      return errorResponse('غير مصرح بتحديث هذه الرسالة', 403);
    }

    const body = await request.json();
    const { isRead } = body;

    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { isRead: isRead !== undefined ? isRead : true },
    });

    return successResponse(updatedMessage, 'تم تحديث حالة الرسالة');
  } catch (error: any) {
    return errorResponse(error.message || 'فشل في تحديث الرسالة', 500);
  }
}

// DELETE /api/messages/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const messageId = parseInt(params.id);

    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return notFoundResponse('الرسالة غير موجودة');
    }

    // المرسل أو المستلم يمكنه حذف الرسالة
    if (message.senderId !== session.user.id && message.recipientId !== session.user.id) {
      return errorResponse('غير مصرح بحذف هذه الرسالة', 403);
    }

    await prisma.message.delete({
      where: { id: messageId },
    });

    return successResponse(null, 'تم حذف الرسالة بنجاح');
  } catch (error: any) {
    return errorResponse(error.message || 'فشل في حذف الرسالة', 500);
  }
}
