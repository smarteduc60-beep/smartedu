import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';

// POST /api/messages/broadcast - إرسال رسالة جماعية (المدير فقط)
export async function POST(request: NextRequest) {
  try {
    const session = await requireRole(['directeur']);

    const body = await request.json();
    const { recipientIds, recipientRole, content, subject } = body;

    if (!content || !subject) {
      return errorResponse('الموضوع والمحتوى مطلوبان', 400);
    }

    let targetUserIds: string[] = [];

    // إذا تم تحديد دور معين
    if (recipientRole && recipientRole !== 'all') {
      const roleRecord = await prisma.role.findFirst({
        where: { name: recipientRole }
      });

      if (roleRecord) {
        const usersInRole = await prisma.user.findMany({
          where: { roleId: roleRecord.id },
          select: { id: true }
        });
        targetUserIds = usersInRole.map(u => u.id);
      }
    }
    // إذا تم تحديد مستخدمين محددين
    else if (recipientIds && Array.isArray(recipientIds) && recipientIds.length > 0) {
      targetUserIds = recipientIds;
    }
    // إرسال للجميع
    else if (recipientRole === 'all') {
      const allUsers = await prisma.user.findMany({
        where: {
          id: { not: session.user.id } // عدا المدير نفسه
        },
        select: { id: true }
      });
      targetUserIds = allUsers.map(u => u.id);
    } else {
      return errorResponse('يجب تحديد المستلمين', 400);
    }

    if (targetUserIds.length === 0) {
      return errorResponse('لم يتم العثور على مستخدمين', 400);
    }

    // إنشاء رسائل متعددة
    const messages = await prisma.message.createMany({
      data: targetUserIds.map(recipientId => ({
        senderId: session.user.id,
        recipientId,
        subject,
        content,
        isRead: false,
      })),
    });

    return successResponse(
      { count: messages.count },
      `تم إرسال ${messages.count} رسالة بنجاح`,
      201
    );
  } catch (error: any) {
    console.error('Error broadcasting message:', error);
    return errorResponse(error.message || 'فشل في إرسال الرسائل', 500);
  }
}
