import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@/lib/api-auth';
import { errorResponse, successResponse } from '@/lib/api-response';

const prisma = new PrismaClient();

// جلب بيانات درس محدد (لصفحة التعديل)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();

    if (!user) {
      console.error('[API - Lessons ID - GET] Authentication failed: User is null');
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

// تحديث بيانات الدرس
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
     const user = await requireAuth();

    if (!user) {
      console.error('[API - Lessons ID - PUT] Authentication failed: User is null');
      return errorResponse('Authentication failed: User is null', 401);
    }

    const { id } = await params;
    const lessonId = parseInt(id);

    if (isNaN(lessonId)) {
      return errorResponse('معرف الدرس غير صالح', 400);
    }

    const body = await request.json();
    const { title, content, videoUrl, imageUrl, pdfUrl, subjectId, levelId } = body;

    // التحقق من وجود الدرس وملكيته
    const existingLesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { authorId: true }
    });

    if (!existingLesson) {
        return errorResponse('الدرس غير موجود', 404);
    }

    if (!user || !user.id) {
      return errorResponse('المستخدم غير معرف. يرجى تسجيل الدخول.', 401);
    }

    console.log(`[DEBUG] Update Lesson: User ID (${user.id}) vs Author ID (${existingLesson.authorId})`);

    // التحقق من أن المستخدم هو صاحب الدرس
    if (existingLesson.authorId && existingLesson.authorId !== user.id) {
      return errorResponse(`غير مصرح لك بتعديل هذا الدرس. (المستخدم: ${user.id}، المؤلف: ${existingLesson.authorId})`, 403);
    }

    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title,
        content,
        videoUrl,
        imageUrl,
        pdfUrl,
        subjectId,
        levelId,
      },
    });

    return successResponse(updatedLesson, 'تم تحديث الدرس بنجاح');
  } catch (error: any) {
    console.error('Error updating lesson:', error);
    return errorResponse('حدث خطأ أثناء تحديث الدرس', 500);
  }
}

// حذف الدرس (إضافي)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();

    if (!user) {
      console.error('[API - Lessons ID - DELETE] Authentication failed: User is null');
      return errorResponse('Authentication failed: User is null', 401);
    }

    const { id } = await params;
    const lessonId = parseInt(id);

    if (isNaN(lessonId)) {
      return errorResponse('معرف الدرس غير صالح', 400);
    }

    const existingLesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { authorId: true }
    });

    if (!existingLesson) {
        return errorResponse('الدرس غير موجود', 404);
    }

    if (!user || !user.id) {
      return errorResponse('المستخدم غير معرف. يرجى تسجيل الدخول.', 401);
    }

    console.log(`[DEBUG] Delete Lesson: User ID (${user.id}) vs Author ID (${existingLesson.authorId})`);

    if (existingLesson.authorId && existingLesson.authorId !== user.id) {
      return errorResponse(`غير مصرح لك بحذف هذا الدرس. (المستخدم: ${user.id}، المؤلف: ${existingLesson.authorId})`, 403);
    }

    await prisma.lesson.delete({
      where: { id: lessonId },
    });

    return successResponse(null, 'تم حذف الدرس بنجاح');
  } catch (error: any) {
    console.error('Error deleting lesson:', error);
    return errorResponse('حدث خطأ أثناء حذف الدرس', 500);
  }
}
