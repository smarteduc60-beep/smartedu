import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';

// GET /api/levels?stageId=1
export async function GET(request: NextRequest) {
  try {
    // No auth required for signup page
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

    return successResponse(levels, `تم جلب ${levels.length} مستوى`);
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

/**
 * Delete a level
 * DELETE /api/levels?id=<levelId>
 * Only accessible by Director
 */
export async function DELETE(request: NextRequest) {
    try {
        const session = await requireAuth();
        if (session.user.role !== 'directeur') {
            return errorResponse('فقط المدير يمكنه حذف المستويات', 403);
        }

        const { searchParams } = new URL(request.url);
        const levelId = searchParams.get('id');

        if (!levelId) {
            return errorResponse('معرف المستوى مطلوب', 400);
        }

        const levelToDelete = await prisma.level.findUnique({
            where: { id: parseInt(levelId) },
        });

        if (!levelToDelete) {
            return errorResponse('المستوى غير موجود', 404);
        }

        // 1. Delete associated Google Drive folder if exists
        if (levelToDelete.driveFolderId) {
            try {
                await GoogleDriveService.deleteFolder(levelToDelete.driveFolderId);
            } catch (gdError: any) {
                console.error(`Failed to delete Google Drive folder for level ${levelId}:`, gdError);
                // Log and proceed with DB deletion to maintain app data integrity
            }
        }

        // 2. Delete the level from the database
        await prisma.level.delete({
            where: { id: parseInt(levelId) },
        });

        return successResponse(null, 'تم حذف المستوى والمجلد المرتبط به بنجاح');
    } catch (error: any) {
        console.error('Level deletion error:', error);
        return errorResponse(error.message || 'فشل في حذف المستوى', 500);
    }
}

