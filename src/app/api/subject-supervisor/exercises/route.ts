import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';

// GET /api/subject-supervisor/exercises
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session?.user?.id) {
      return errorResponse('يجب تسجيل الدخول', 401);
    }

    const supervisorId = session.user.id;

    // Get supervisor with subject and level details
    const supervisor = await prisma.user.findUnique({
      where: { id: supervisorId },
      include: {
        userDetails: {
          include: {
            subject: true,
            level: true,
          },
        },
      },
    });

    if (!supervisor || !supervisor.userDetails?.subjectId || !supervisor.userDetails?.levelId) {
      return errorResponse('لم يتم العثور على مشرف المادة أو المادة أو المستوى', 404);
    }

    const subjectId = supervisor.userDetails.subjectId;
    const levelId = supervisor.userDetails.levelId;

    // Get only exercises for lessons created by this supervisor
    const exercises = await prisma.exercise.findMany({
      where: {
        lesson: {
          authorId: supervisorId, // فقط الدروس التي أنشأها المشرف
          subjectId,
          levelId,
        },
      },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const formattedExercises = exercises.map(exercise => ({
      id: exercise.id,
      question: exercise.question,
      lesson: {
        id: exercise.lesson.id,
        title: exercise.lesson.title,
      },
    }));

    return successResponse(formattedExercises, `تم جلب ${formattedExercises.length} تمرين`);
  } catch (error: any) {
    console.error('Error fetching exercises:', error);
    return errorResponse(error.message || 'فشل في جلب التمارين', 500);
  }
}
