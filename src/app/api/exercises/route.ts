import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';

// GET /api/exercises?lessonId=1&authorId=xxx
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');
    const authorId = searchParams.get('authorId');

    const where: any = {};
    if (lessonId) {
      where.lessonId = parseInt(lessonId);
    }
    
    // تصفية حسب مؤلف الدروس
    if (authorId) {
      where.lesson = {
        authorId: authorId,
      };
    }

    const exercises = await prisma.exercise.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return successResponse({ exercises });
  } catch (error: any) {
    return errorResponse(error.message || 'فشل في جلب التمارين', 500);
  }
}

// POST /api/exercises
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();

    // فقط المعلمون والمشرفون والمدير
    if (!['teacher', 'supervisor_specific', 'supervisor_general', 'directeur'].includes(session.user.role)) {
      return errorResponse('غير مصرح بإنشاء التمارين', 403);
    }

    const body = await request.json();
    console.log('📥 Received exercise data:', JSON.stringify(body, null, 2));
    
    const { 
      lessonId, 
      type = 'main',
      questionRichContent,
      question, 
      questionFileUrl, 
      modelAnswer,
      modelAnswerImage,
      expectedResults,
      maxScore = 20,
      allowRetry = true,
      maxAttempts = 3,
      displayOrder 
    } = body;

    if (!lessonId || (!questionRichContent && !question)) {
      return errorResponse('معرف الدرس والسؤال مطلوبان', 400);
    }

    if (type === 'main' && !modelAnswer) {
      return errorResponse('الحل النموذجي مطلوب للتمرين الرئيسي', 400);
    }

    if (type === 'support_with_results' && (!expectedResults || expectedResults.length === 0)) {
      return errorResponse('النتائج المتوقعة مطلوبة لتمرين الدعم + نتائج', 400);
    }

    // التحقق من ملكية الدرس
    const lesson = await prisma.lesson.findUnique({
      where: { id: parseInt(lessonId) },
    });

    if (!lesson) {
      return errorResponse('الدرس غير موجود', 404);
    }

    if (lesson.authorId !== session.user.id && session.user.role !== 'directeur') {
      return errorResponse('غير مصرح بإضافة تمارين لهذا الدرس', 403);
    }

    // الحصول على آخر displayOrder
    let order = displayOrder;
    if (!order) {
      const lastExercise = await prisma.exercise.findFirst({
        where: { lessonId: parseInt(lessonId) },
        orderBy: { displayOrder: 'desc' },
      });
      order = lastExercise ? lastExercise.displayOrder + 1 : 1;
    }

    const exerciseData: any = {
      lessonId: parseInt(lessonId),
      type,
      question: question || null,
      questionRichContent: questionRichContent || null,
      questionFileUrl: questionFileUrl || null,
      displayOrder: order,
    };

    // إضافة الحقول حسب نوع التمرين
    if (type === 'main') {
      exerciseData.modelAnswer = modelAnswer;
      exerciseData.modelAnswerImage = modelAnswerImage || null;
      exerciseData.maxScore = parseFloat(String(maxScore));
      exerciseData.allowRetry = allowRetry;
      exerciseData.maxAttempts = parseInt(String(maxAttempts));
    } else if (type === 'support_with_results') {
      exerciseData.expectedResults = expectedResults;
    }

    console.log('💾 Creating exercise with data:', JSON.stringify(exerciseData, null, 2));

    const exercise = await prisma.exercise.create({
      data: exerciseData,
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return successResponse(exercise, 'تم إنشاء التمرين بنجاح', 201);
  } catch (error: any) {
    console.error('Error creating exercise:', error);
    return errorResponse(error.message || 'فشل في إنشاء التمرين', 500);
  }
}
