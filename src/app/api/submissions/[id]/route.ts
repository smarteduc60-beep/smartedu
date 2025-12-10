import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';
import { successResponse, errorResponse, notFoundResponse } from '@/lib/api-response';

// PATCH /api/submissions/[id] - تصحيح المعلم
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();

    // فقط المعلمون والمشرفون يمكنهم التصحيح
    if (!['teacher', 'supervisor_specific', 'supervisor_general', 'directeur'].includes(session.user.role)) {
      return errorResponse('غير مصرح بالتصحيح', 403);
    }

    const submissionId = parseInt(params.id);
    const body = await request.json();
    const { finalScore, teacherNotes, status } = body;

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        exercise: {
          include: {
            lesson: true,
          },
        },
      },
    });

    if (!submission) {
      return notFoundResponse('الإجابة غير موجودة');
    }

    // التحقق من أن المعلم هو معلم الدرس
    if (session.user.role === 'teacher' && submission.exercise.lesson.authorId !== session.user.id) {
      return errorResponse('غير مصرح بتصحيح هذه الإجابة', 403);
    }

    const updateData: any = {};
    if (finalScore !== undefined) updateData.finalScore = parseFloat(finalScore);
    if (teacherNotes !== undefined) updateData.teacherNotes = teacherNotes;
    if (status !== undefined) updateData.status = status;

    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: updateData,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
        exercise: {
          include: {
            lesson: true,
          },
        },
      },
    });

    return successResponse(updatedSubmission, 'تم تحديث التصحيح بنجاح');
  } catch (error: any) {
    console.error('Error updating submission:', error);
    return errorResponse(error.message || 'فشل في تحديث التصحيح', 500);
  }
}
