import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';

// GET /api/subject-supervisor/dashboard
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
            level: {
              include: {
                stage: true,
              },
            },
          },
        },
      },
    });

    if (!supervisor || !supervisor.userDetails?.subjectId || !supervisor.userDetails?.levelId) {
      return errorResponse('لم يتم العثور على مشرف المادة أو المادة أو المستوى', 404);
    }

    const subjectId = supervisor.userDetails.subjectId;
    const levelId = supervisor.userDetails.levelId;

    // Get lessons count for this level (lessons created by supervisor)
    const lessonsCount = await prisma.lesson.count({
      where: {
        subjectId,
        levelId,
        authorId: supervisorId,
      },
    });

    // Get exercises count for supervisor's lessons in this level
    const supervisorLessons = await prisma.lesson.findMany({
      where: {
        subjectId,
        levelId,
        authorId: supervisorId,
      },
      select: { id: true },
    });

    const lessonIds = supervisorLessons.map(l => l.id);
    
    const exercisesCount = await prisma.exercise.count({
      where: {
        lessonId: { in: lessonIds },
      },
    });

    // Get all teachers teaching this subject
    const teachersCount = await prisma.userDetails.count({
      where: {
        subjectId,
        user: {
          role: {
            name: 'teacher',
          },
        },
      },
    });

    // Get all students enrolled in this subject (through teacher links)
    const teachersWithSubject = await prisma.userDetails.findMany({
      where: {
        subjectId,
        user: {
          role: {
            name: 'teacher',
          },
        },
      },
      select: {
        userId: true,
      },
    });

    const teacherIds = teachersWithSubject.map(t => t.userId);
    
    // Get unique students count
    const uniqueStudents = await prisma.teacherStudentLink.findMany({
      where: {
        teacherId: { in: teacherIds },
      },
      select: {
        studentId: true,
      },
      distinct: ['studentId'],
    });
    
    const studentsCount = uniqueStudents.length;

    // Get recent lessons for this level
    const recentLessons = await prisma.lesson.findMany({
      where: {
        subjectId,
        levelId,
        authorId: supervisorId,
      },
      include: {
        level: {
          include: {
            stage: true,
          },
        },
        _count: {
          select: {
            exercises: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    return successResponse({
      supervisor: {
        id: supervisor.id,
        name: `${supervisor.firstName} ${supervisor.lastName}`,
        email: supervisor.email,
        subject: supervisor.userDetails.subject,
        level: supervisor.userDetails.level,
        allowMessaging: supervisor.userDetails.allowMessaging || false,
        teacherCode: supervisor.userDetails.teacherCode,
      },
      stats: {
        lessons: lessonsCount,
        exercises: exercisesCount,
        teachers: teachersCount,
        students: studentsCount,
      },
      recentLessons: recentLessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        levelName: lesson.level?.name,
        stageName: lesson.level?.stage?.name,
        exercisesCount: lesson._count.exercises,
        createdAt: lesson.createdAt.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error('Error fetching supervisor dashboard:', error);
    return errorResponse(error.message || 'فشل في جلب البيانات', 500);
  }
}
