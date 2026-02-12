import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { GoogleDriveService } from '@/lib/google-drive';

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
  let stageId: number | undefined;
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
    
    const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
    if (!rootFolderId) {
        return errorResponse('لم يتم تكوين المجلد الجذر لـ Google Drive', 500);
    }

    // --- Step 1: Create the stage record in the database ---
    let order = displayOrder;
    if (!order) {
      const lastStage = await prisma.stage.findFirst({
        orderBy: { displayOrder: 'desc' },
      });
      order = lastStage ? lastStage.displayOrder + 1 : 1;
    }

    const newStage = await prisma.stage.create({
      data: {
        name,
        displayOrder: order,
      },
    });
    stageId = newStage.id; // Store ID for potential rollback

    // --- Step 2: Create the corresponding folder in Google Drive ---
    const driveFolderId = await GoogleDriveService.getOrCreateFolder(name, rootFolderId);

    // --- Step 3: Update the stage record with the Drive Folder ID ---
    const updatedStage = await prisma.stage.update({
      where: { id: stageId },
      data: { driveFolderId: driveFolderId },
    });

    return successResponse(updatedStage, 'تم إنشاء المرحلة والمجلد بنجاح', 201);
  } catch (error: any) {
    // --- Rollback Logic ---
    // If an error occurs after the stage was created in the DB, delete it.
    if (stageId) {
      await prisma.stage.delete({ where: { id: stageId } }).catch(rollbackError => {
        // Log the rollback error, but don't overshadow the original error
        console.error('Rollback failed for stage deletion:', rollbackError);
      });
    }
    return errorResponse(error.message || 'فشل في إنشاء المرحلة', 500);
  }
}

/**
 * Delete an academic stage
 * DELETE /api/stages?id=<stageId>
 * Only accessible by Director
 */
export async function DELETE(request: NextRequest) {
    try {
        const session = await requireAuth();
        if (session.user.role !== 'directeur') {
            return errorResponse('فقط المدير يمكنه حذف المراحل', 403);
        }

        const { searchParams } = new URL(request.url);
        const stageId = searchParams.get('id');

        if (!stageId) {
            return errorResponse('معرف المرحلة مطلوب', 400);
        }

        const stageToDelete = await prisma.stage.findUnique({
            where: { id: parseInt(stageId) },
        });

        if (!stageToDelete) {
            return errorResponse('المرحلة غير موجودة', 404);
        }

        // 1. Delete associated Google Drive folder if exists
        if (stageToDelete.driveFolderId) {
            try {
                await GoogleDriveService.deleteFolder(stageToDelete.driveFolderId);
            } catch (gdError: any) {
                console.error(`Failed to delete Google Drive folder for stage ${stageId}:`, gdError);
                // Depending on requirements, you might want to return an error here or proceed with DB deletion
                // For now, we will log and proceed to delete from DB to maintain data integrity within the app
            }
        }

        // 2. Delete the stage from the database
        await prisma.stage.delete({
            where: { id: parseInt(stageId) },
        });

        return successResponse(null, 'تم حذف المرحلة والمجلد المرتبط بها بنجاح');
    } catch (error: any) {
        console.error('Academic stage deletion error:', error);
        return errorResponse(error.message || 'فشل في حذف المرحلة', 500);
    }
}

