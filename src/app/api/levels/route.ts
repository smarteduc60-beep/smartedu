import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';

// GET /api/levels?stageId=1
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const stageId = searchParams.get('stageId');

    const where: any = {};
    if (stageId) {
      where.stageId = parseInt(stageId);
    }

    const levels = await prisma.level.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
      include: {
        stage: true,
        _count: {
          select: {
            subjects: true,
          },
        },
      },
    });

    return successResponse({ levels });
  } catch (error: any) {
    return errorResponse(error.message || 'فشل في جلب المستويات', 500);
  }
}

// POST /api/levels
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();

    if (session.user.role !== 'directeur') {
      return errorResponse('فقط المدير يمكنه إضافة المستويات', 403);
    }

    const body = await request.json();
    const { name, stageId, displayOrder } = body;

    if (!name || !stageId) {
      return errorResponse('اسم المستوى والمرحلة مطلوبة', 400);
    }

    // الحصول على آخر displayOrder إذا لم يُحدد
    let order = displayOrder;
    if (!order) {
      const lastLevel = await prisma.level.findFirst({
        where: { stageId: parseInt(stageId) },
        orderBy: { displayOrder: 'desc' },
      });
      order = lastLevel ? lastLevel.displayOrder + 1 : 1;
    }

    const level = await prisma.level.create({
      data: {
        name,
        stageId: parseInt(stageId),
        displayOrder: order,
      },
      include: {
        stage: true,
      },
    });

    return successResponse(level, 'تم إنشاء المستوى بنجاح', 201);
  } catch (error: any) {
    return errorResponse(error.message || 'فشل في إنشاء المستوى', 500);
  }
}
