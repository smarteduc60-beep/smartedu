import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';
import { successResponse, errorResponse, notFoundResponse } from '@/lib/api-response';

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
    const { title, content, videoUrl, pdfUrl, type, isLocked, status } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    if (pdfUrl !== undefined) updateData.pdfUrl = pdfUrl;
    if (type !== undefined) updateData.type = type;
    if (isLocked !== undefined) updateData.isLocked = isLocked;
    
    // فقط المدير أو المشرف يمكنه تغيير الحالة
    if (status !== undefined && ['directeur', 'supervisor_specific', 'supervisor_general'].includes(session.user.role)) {
      updateData.status = status;
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
