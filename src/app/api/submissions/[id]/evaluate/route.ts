import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';

// POST /api/submissions/[id]/evaluate - تقييم الإجابة بالذكاء الاصطناعي
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const submissionId = parseInt(id);

    console.log('🔍 Evaluating submission ID:', submissionId);

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        exercise: {
          select: {
            id: true,
            question: true,
            modelAnswer: true,
            maxScore: true,
          },
        },
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    console.log('📄 Submission found:', submission ? 'Yes' : 'No');
    
    if (!submission) {
      return errorResponse('الإجابة غير موجودة', 404);
    }

    // التحقق من الصلاحيات
    if (session.user.role === 'student' && submission.studentId !== session.user.id) {
      return errorResponse('غير مصرح بالوصول', 403);
    }

    // التقييم بالذكاء الاصطناعي
    // TODO: استدعاء AI للتقييم الفعلي
    const feedback = `تقييم تلقائي:\n\n` +
      `لقد قمت بحل التمرين. ` +
      `\n\nملاحظات:\n` +
      `- حاول شرح إجابتك بشكل أوضح.\n` +
      `- راجع الدرس للتأكد من فهمك الكامل للموضوع.\n` +
      `- قارن إجابتك مع الإجابة النموذجية أعلاه.`;

    // حساب الدرجة (بشكل عشوائي للآن - سيتم استبداله بـ AI)
    const maxScoreValue = submission.exercise.maxScore ? parseFloat(submission.exercise.maxScore.toString()) : 20;
    const calculatedScore = Math.floor(Math.random() * (maxScoreValue + 1));

    console.log('📊 Max score:', maxScoreValue, 'Generated score:', calculatedScore);

    // تحديث الإجابة
    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        aiScore: calculatedScore,
        finalScore: calculatedScore,
        aiFeedback: feedback,
        gradedAt: new Date(),
        status: 'graded',
      },
      include: {
        exercise: {
          select: {
            id: true,
            question: true,
            maxScore: true,
          },
        },
      },
    });

    return successResponse(updatedSubmission, 'تم تقييم الإجابة بنجاح');
  } catch (error: any) {
    console.error('Error evaluating submission:', error);
    return errorResponse(error.message || 'فشل في تقييم الإجابة', 500);
  }
}
