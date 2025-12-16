import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';

// GET /api/stages
export async function GET() {
  try {
    // No auth required for signup page
    const stages = await prisma.stage.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: {
            levels: true,
            subjects: true,
          },
        },
      },
    });

    return successResponse(stages, `تم جلب ${stages.length} مرحلة`);
  } catch (error: any) {
    return errorResponse(error.message || 'فشل في جلب المراحل', 500);
  }
}

// POST /api/stages
export async function POST(request: NextRequest) {
  await requireAuth();
  try {
    const session = await requireAuth();

    if (session.user.role !== 'directeur') {
      return errorResponse('فقط المدير يمكنه إضافة المراحل', 403);
    }

    const body = await request.json();
    const { name, displayOrder } = body;

    if (!name) {
      return errorResponse('اسم المرحلة مطلوب', 400);
    }

    // الحصول على آخر displayOrder إذا لم يُحدد
    let order = displayOrder;
    if (!order) {
      const lastStage = await prisma.stage.findFirst({
        orderBy: { displayOrder: 'desc' },
      });
      order = lastStage ? lastStage.displayOrder + 1 : 1;
    }

    const stage = await prisma.stage.create({
      data: {
        name,
        displayOrder: order,
      },
    });

    return successResponse(stage, 'تم إنشاء المرحلة بنجاح', 201);
  } catch (error: any) {
    return errorResponse(error.message || 'فشل في إنشاء المرحلة', 500);
  }
}
