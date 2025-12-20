import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';
import { successResponse, errorResponse, notFoundResponse } from '@/lib/api-response';
import { saveBase64ToFile } from '@/lib/file-handler';

// Configure API route to accept larger payloads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

// GET /api/lessons/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();

    const { id } = await params;
    const lessonId = parseInt(id);

    if (isNaN(lessonId)) {
      return errorResponse('معرف الدرس غير صالح', 400);
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
        subject: true,
        level: true,
        exercises: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!lesson) {
      return notFoundResponse('الدرس غير موجود');
    }

    return successResponse(lesson);
  } catch (error: any) {
    return errorResponse(error.message || 'فشل في جلب الدرس', 500);
  }
}

// PATCH /api/lessons/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const lessonId = parseInt(id);

    if (isNaN(lessonId)) {
      return errorResponse('معرف الدرس غير صالح', 400);
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return notFoundResponse('الدرس غير موجود');
    }

    // التحقق من الصلاحية: المؤلف أو المدير
    if (lesson.authorId !== session.user.id && session.user.role !== 'directeur') {
      return errorResponse('غير مصرح بالتعديل', 403);
    }

    const body = await request.json();
    
    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.videoUrl !== undefined) updateData.videoUrl = body.videoUrl;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.isLocked !== undefined) updateData.isLocked = body.isLocked;

    // Handle Image Upload
    if (body.imageBase64 !== undefined) {
      if (body.imageBase64 && typeof body.imageBase64 === 'string') {
        try {
          const extensionMatch = body.imageBase64.match(/data:image\/(.*?);base64,/);
          const extension = extensionMatch ? `.${extensionMatch[1]}` : '.png';
          updateData.imageUrl = saveBase64ToFile(body.imageBase64, 'lessons-images', extension);
        } catch (e: any) {
          console.error("Failed to save image during update:", e.message);
        }
      } else {
        updateData.imageUrl = null;
      }
    }

    // Handle PDF Upload
    if (body.pdfBase64 !== undefined) {
      if (body.pdfBase64 && typeof body.pdfBase64 === 'string') {
        try {
          const extensionMatch = body.pdfBase64.match(/data:application\/(.*?);base64,/);
          const extension = extensionMatch ? `.${extensionMatch[1]}` : '.pdf';
          updateData.pdfUrl = saveBase64ToFile(body.pdfBase64, 'lessons-pdfs', extension);
        } catch (e: any) {
          console.error("Failed to save PDF during update:", e.message);
        }
      } else {
        updateData.pdfUrl = null;
      }
    }
    
    // فقط المدير أو المشرف يمكنه تغيير الحالة
    if (body.status !== undefined && ['directeur', 'supervisor_specific', 'supervisor_general'].includes(session.user.role)) {
      updateData.status = body.status;
    }

    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
        subject: true,
        level: true,
      },
    });

    return successResponse(updatedLesson, 'تم تحديث الدرس بنجاح');
  } catch (error: any) {
    console.error('Error updating lesson:', error);
    return errorResponse(error.message || 'فشل في تحديث الدرس', 500);
  }
}

// DELETE /api/lessons/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const lessonId = parseInt(id);

    if (isNaN(lessonId)) {
      return errorResponse('معرف الدرس غير صالح', 400);
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return notFoundResponse('الدرس غير موجود');
    }

    // التحقق من الصلاحية
    if (lesson.authorId !== session.user.id && session.user.role !== 'directeur') {
      return errorResponse('غير مصرح بالحذف', 403);
    }

    await prisma.lesson.delete({
      where: { id: lessonId },
    });

    return successResponse(null, 'تم حذف الدرس بنجاح');
  } catch (error: any) {
    console.error('Error deleting lesson:', error);
    return errorResponse(error.message || 'فشل في حذف الدرس', 500);
  }
}
