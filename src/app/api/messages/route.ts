import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';

// GET /api/messages - جلب رسائل المستخدم
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);

    const type = searchParams.get('type'); // sent | received | all
    const isRead = searchParams.get('isRead'); // true | false

    let where: any = {};

    if (type === 'sent') {
      where.senderId = session.user.id;
    } else if (type === 'received') {
      where.recipientId = session.user.id;
      if (isRead !== null) {
        where.isRead = isRead === 'true';
      }
    } else {
      // all - الرسائل المرسلة والمستقبلة
      where = {
        OR: [
          { senderId: session.user.id },
          { recipientId: session.user.id },
        ],
      };
    }

    const messages = await prisma.message.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
            role: {
              select: {
                name: true,
              },
            },
          },
        },
        recipient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse({ messages });
  } catch (error: any) {
    return errorResponse(error.message || 'فشل في جلب الرسائل', 500);
  }
}

// POST /api/messages - إرسال رسالة جديدة
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { recipientId, subject, content } = body;

    if (!recipientId || !subject || !content) {
      return errorResponse('المستلم والموضوع والمحتوى مطلوبة', 400);
    }

    // التحقق من وجود المستلم
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
    });

    if (!recipient) {
      return errorResponse('المستلم غير موجود', 404);
    }

    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        recipientId,
        subject,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
        recipient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
      },
    });

    return successResponse(message, 'تم إرسال الرسالة بنجاح', 201);
  } catch (error: any) {
    console.error('Error sending message:', error);
    return errorResponse(error.message || 'فشل في إرسال الرسالة', 500);
  }
}
