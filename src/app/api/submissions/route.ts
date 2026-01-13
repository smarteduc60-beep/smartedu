import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';

// GET /api/submissions?studentId=xxx&exerciseId=xxx
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);

    const studentId = searchParams.get('studentId');
    const exerciseId = searchParams.get('exerciseId');
    const lessonId = searchParams.get('lessonId');
    const status = searchParams.get('status');

    const where: any = {};

    // الطلاب يرون إجاباتهم فقط
    if (session.user.role === 'student') {
      where.studentId = session.user.id;
    } else if (studentId) {
      where.studentId = studentId;
    }

    if (exerciseId) where.exerciseId = parseInt(exerciseId);
    if (status) where.status = status;

    // إذا كان lessonId موجود، نحتاج للانضمام مع exercises
    if (lessonId) {
      const exercisesInLesson = await prisma.exercise.findMany({
        where: { lessonId: parseInt(lessonId) },
        select: { id: true },
      });
      where.exerciseId = {
        in: exercisesInLesson.map(e => e.id),
      };
    }

    const submissions = await prisma.submission.findMany({
      where,
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
            lesson: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });

    return successResponse({ submissions });
  } catch (error: any) {
    return errorResponse(error.message || 'فشل في جلب الإجابات', 500);
  }
}

// POST /api/submissions - إرسال إجابة جديدة
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();

    // فقط الطلاب يمكنهم إرسال الإجابات
    if (session.user.role !== 'student') {
      return errorResponse('فقط الطلاب يمكنهم إرسال الإجابات', 403);
    }

    const body = await request.json();
    const { exerciseId, answerText, answerRichContent, submissionFileUrl } = body;

    // قبول answerText أو answerRichContent
    const answer = answerRichContent || answerText;

    if (!exerciseId || !answer) {
      return errorResponse('معرف التمرين والإجابة مطلوبة', 400);
    }

    // الحصول على التمرين مع الإجابة النموذجية
    const exercise = await prisma.exercise.findUnique({
      where: { id: parseInt(exerciseId) },
    });

    if (!exercise) {
      return errorResponse('التمرين غير موجود', 404);
    }

    // الحصول على المحاولات السابقة للتحقق من العدد والدرجات
    const previousSubmissions = await prisma.submission.findMany({
      where: {
        studentId: session.user.id,
        exerciseId: parseInt(exerciseId),
      },
      select: {
        aiScore: true,
        finalScore: true,
      },
    });

    const previousAttempts = previousSubmissions.length;

    // التحقق من الحد الأقصى للمحاولات
    if (exercise.maxAttempts && previousAttempts >= exercise.maxAttempts) {
      return errorResponse(`لقد استنفدت جميع المحاولات المتاحة (${exercise.maxAttempts}) لهذا التمرين.`, 400);
    }

    // التحقق مما إذا كان الطالب قد حصل على العلامة الكاملة سابقاً
    const maxScore = Number(exercise.maxScore || 20);
    const hasPerfectScore = previousSubmissions.some((sub) => {
      const score = Number(sub.finalScore ?? sub.aiScore ?? 0);
      return score >= maxScore;
    });

    if (hasPerfectScore) {
      return errorResponse('لقد حصلت بالفعل على العلامة الكاملة في هذا التمرين.', 400);
    }

    // تم تعطيل التقييم التلقائي لتحسين الأداء
    // سيتم التقييم عند الضغط على زر "تقييم" يدوياً
    let aiFeedback = null;
    let aiScore = null;

    // إنشاء الإجابة
    const submission = await prisma.submission.create({
      data: {
        studentId: session.user.id,
        exerciseId: parseInt(exerciseId),
        answerText: answerText || null,
        answerRichContent: answerRichContent || null,




        
        attemptNumber: previousAttempts + 1,
        aiFeedback,
        aiScore: aiScore ? parseFloat(aiScore.toFixed(2)) : null,
        status: 'pending',
      },
      include: {
        exercise: {
          include: {
            lesson: true,
          },
        },
      },
    });

    return successResponse(
      submission,
      aiFeedback ? 'تم إرسال الإجابة وتقييمها بنجاح' : 'تم إرسال الإجابة بنجاح',
      201
    );
  } catch (error: any) {
    console.error('Error creating submission:', error);
    return errorResponse(error.message || 'فشل في إرسال الإجابة', 500);
  }
}
