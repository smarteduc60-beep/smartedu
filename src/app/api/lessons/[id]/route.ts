import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';
import { errorResponse, successResponse } from '@/lib/api-response';
import { GoogleDriveService } from '@/lib/google-drive';

// جلب بيانات درس محدد (لصفحة التعديل)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();

    if (!session?.user) {
      return errorResponse('Authentication failed: User is null', 401);
    }

    const { id } = await params;
    const lessonId = parseInt(id);

    if (isNaN(lessonId)) {
      return errorResponse('معرف الدرس غير صالح', 400);
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        subject: true,
        level: true,
      }
    });

    if (!lesson) {
      return errorResponse('الدرس غير موجود', 404);
    }

    return successResponse(lesson);
  } catch (error: any) {
    console.error('Error fetching lesson:', error);
    return errorResponse('حدث خطأ أثناء جلب الدرس', 500);
  }
}

// دالة مشتركة لتحديث الدرس (تستخدم لـ PUT و PATCH)
async function updateLesson(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
     const session = await requireAuth();

    if (!session?.user) {
      return errorResponse('Authentication failed: User is null', 401);
    }
    const user = session.user;

    const { id } = await params;
    const lessonId = parseInt(id);

    if (isNaN(lessonId)) {
      return errorResponse('معرف الدرس غير صالح', 400);
    }

    const body = await request.json();
    const { title, content, videoUrl, imageUrl, pdfUrl, subjectId, levelId, type } = body;

    // التحقق من وجود الدرس وملكيته
    const existingLesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { authorId: true }
    });

    if (!existingLesson) {
        return errorResponse('الدرس غير موجود', 404);
    }

    // التحقق من أن المستخدم هو صاحب الدرس أو مدير
    if (existingLesson.authorId && existingLesson.authorId !== user.id && user.role !== 'directeur') {
      return errorResponse(`غير مصرح لك بتعديل هذا الدرس.`, 403);
    }

    const dataToUpdate: any = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (content !== undefined) dataToUpdate.content = content;
    if (videoUrl !== undefined) dataToUpdate.videoUrl = videoUrl;
    if (imageUrl !== undefined) dataToUpdate.imageUrl = imageUrl;
    if (pdfUrl !== undefined) dataToUpdate.pdfUrl = pdfUrl;
    if (subjectId !== undefined) dataToUpdate.subjectId = parseInt(subjectId);
    if (levelId !== undefined) dataToUpdate.levelId = parseInt(levelId);
    if (type !== undefined) dataToUpdate.type = type;

    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: dataToUpdate,
    });

    return successResponse(updatedLesson, 'تم تحديث الدرس بنجاح');
  } catch (error: any) {
    console.error('Error updating lesson:', error);
    return errorResponse('حدث خطأ أثناء تحديث الدرس', 500);
  }
}

// تصدير دوال PUT و PATCH
export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return updateLesson(req, ctx);
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return updateLesson(req, ctx);
}

// حذف الدرس (إضافي)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();

    if (!session?.user) {
      return errorResponse('Authentication failed: User is null', 401);
    }
    const user = session.user;

    const { id } = await params;
    const lessonId = parseInt(id);

    if (isNaN(lessonId)) {
      return errorResponse('معرف الدرس غير صالح', 400);
    }

    const existingLesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { authorId: true, driveFolderId: true }
    });

    if (!existingLesson) {
        return errorResponse('الدرس غير موجود', 404);
    }

    if (existingLesson.authorId && existingLesson.authorId !== user.id && user.role !== 'directeur') {
      return errorResponse(`غير مصرح لك بحذف هذا الدرس.`, 403);
    }

    // 1. حذف جميع الإجابات (Submissions) المرتبطة بتمارين هذا الدرس
    // هذا ضروري لأن قاعدة البيانات قد تمنع حذف التمارين إذا كان لها إجابات مرتبطة
    const exercises = await prisma.exercise.findMany({
      where: { lessonId: lessonId },
      select: { id: true }
    });

    if (exercises.length > 0) {
      const exerciseIds = exercises.map(e => e.id);
      await prisma.submission.deleteMany({
        where: { exerciseId: { in: exerciseIds } }
      });
    }

    // 2. محاولة حذف مجلد الدرس من Google Drive (تنظيف)
    if (existingLesson.driveFolderId) {
      try {
        await GoogleDriveService.deleteFolder(existingLesson.driveFolderId);
      } catch (gdError) {
        console.error(`[API] Failed to delete Drive folder for lesson ${lessonId}:`, gdError);
        // نستمر في الحذف حتى لو فشل حذف المجلد
      }
    }

    // 3. حذف الدرس (سيتم حذف التمارين تلقائياً بفضل Cascade في Prisma)
    await prisma.lesson.delete({
      where: { id: lessonId },
    });

    return successResponse(null, 'تم حذف الدرس بنجاح');
  } catch (error: any) {
    console.error('Error deleting lesson:', error);
    return errorResponse(`حدث خطأ أثناء حذف الدرس: ${error.message}`, 500);
  }
}
