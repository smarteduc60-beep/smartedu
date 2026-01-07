import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';
import { successResponse, errorResponse, notFoundResponse } from '@/lib/api-response';
import { GoogleDriveService } from '@/lib/google-drive'; // Import GoogleDriveService

// GET /api/subjects/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const subjectId = parseInt(params.id);

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        levels: true, // تأكد من وجود هذا السطر
        stage: true,
      },
    });

    if (!subject) {
      return notFoundResponse('المادة غير موجودة');
    }

    return successResponse(subject);
  } catch (error: any) {
    return errorResponse(error.message || 'فشل في جلب المادة', 500);
  }
}

// PUT /api/subjects/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    if (session.user.role !== 'directeur') {
      return errorResponse('فقط المدير يمكنه تعديل المواد', 403);
    }

    const subjectId = parseInt(params.id);
    const body = await request.json();
    const { name, description, stageId, levelIds } = body; // تأكد من استقبال levelIds

    // Basic validation
    if (!name) {
      return errorResponse('اسم المادة مطلوب', 400);
    }

    // Prepare data for Prisma update
    const dataToUpdate: any = {
      name,
      description,
    };

    // Handle stage relationship
    if (stageId) {
      dataToUpdate.stage = { connect: { id: stageId } };
    } else {
      // If stageId is not provided, disconnect any existing stage
      dataToUpdate.stage = { disconnect: true };
    }

    // Handle many-to-many relationship with levels
    if (Array.isArray(levelIds)) {
      dataToUpdate.levels = {
        set: levelIds.map((id: number) => ({ id: Number(id) })),
      };
    }

    const updatedSubject = await prisma.subject.update({
      where: { id: subjectId },
      data: dataToUpdate,
      include: { stage: true, levels: true }, // تأكد من إرجاع المستويات المحدثة
    });

    return successResponse({ subject: updatedSubject }, 'تم تحديث المادة بنجاح');

  } catch (error: any) {
    console.error('Subject update error:', error);
    return errorResponse(error.message || 'فشل في تحديث المادة', 500);
  }
}
// DELETE /api/subjects/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    if (session.user.role !== 'directeur') {
      return errorResponse('فقط المدير يمكنه حذف المواد', 403);
    }

    const subjectId = parseInt(params.id);

    const subjectToDelete = await prisma.subject.findUnique({
      where: { id: subjectId },
    });

    if (!subjectToDelete) {
      return notFoundResponse('المادة غير موجودة');
    }

    // 1. Delete associated Google Drive folder if exists
    if (subjectToDelete.driveFolderId) {
      try {
        await GoogleDriveService.deleteFolder(subjectToDelete.driveFolderId);
      } catch (gdError: any) {
        console.error(`Failed to delete Google Drive folder for subject ${subjectId}:`, gdError);
        // Log and proceed to delete from DB to maintain data integrity within the app
      }
    }

    // 2. Delete the subject from the database
    await prisma.subject.delete({
      where: { id: subjectId },
    });

    return successResponse(null, 'تم حذف المادة والمجلد المرتبط بها بنجاح');
  } catch (error: any) {
    console.error('Subject deletion error:', error);
    return errorResponse(error.message || 'فشل في حذف المادة', 500);
  }
}
