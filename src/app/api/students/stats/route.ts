import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';

// GET /api/students/stats - جلب إحصائيات الطالب
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();

    if (session.user.role !== 'student') {
      return errorResponse('فقط الطلاب يمكنهم الوصول لهذه الصفحة', 403);
    }

    // جلب جميع إجابات الطالب
    const submissions = await prisma.submission.findMany({
      where: { studentId: session.user.id },
      include: {
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
    });

    // حساب الإحصائيات
    const totalSubmissions = submissions.length;
    
    // الدروس المكتملة (دروس فيها تمارين محلولة)
    const completedLessons = new Set(
      submissions.map(s => s.exercise.lessonId)
    ).size;

    // حساب متوسط الدرجات
    const totalScore = submissions.reduce((acc, s) => acc + (s.score || 0), 0);
    const maxPossibleScore = submissions.reduce((acc, s) => acc + (s.exercise.maxScore || 10), 0);
    const averageScore = maxPossibleScore > 0 
      ? Math.round((totalScore / maxPossibleScore) * 100) 
      : 0;

    // التمارين المعلقة (تمارين بدون إجابة)
    // أولاً: جلب الأساتذة المرتبطين
    const teacherLinks = await prisma.teacherStudentLink.findMany({
      where: { studentId: session.user.id },
      select: { teacherId: true },
    });
    const teacherIds = teacherLinks.map(link => link.teacherId);

    // جلب تفاصيل الطالب
    const studentDetails = await prisma.userDetails.findUnique({
      where: { userId: session.user.id },
    });

    // جلب كل التمارين المتاحة للطالب
    const availableExercises = await prisma.exercise.findMany({
      where: {
        lesson: {
          OR: [
            { type: 'public' }, // دروس عامة
            { authorId: { in: teacherIds } }, // دروس الأساتذة المرتبطين
          ],
          levelId: studentDetails?.levelId || undefined,
        },
      },
      select: { id: true },
    });

    const solvedExerciseIds = submissions.map(s => s.exerciseId);
    const pendingExercises = availableExercises.filter(
      ex => !solvedExerciseIds.includes(ex.id)
    ).length;

    return successResponse({
      stats: {
        completedLessons,
        totalSubmissions,
        averageScore,
        pendingExercises,
      },
    });
  } catch (error: any) {
    console.error('Error fetching student stats:', error);
    return errorResponse(error.message || 'فشل في جلب الإحصائيات', 500);
  }
}
