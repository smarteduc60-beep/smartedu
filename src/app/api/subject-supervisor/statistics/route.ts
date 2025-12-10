import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';

// GET /api/subject-supervisor/statistics
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
      return errorResponse('لم يتم العثور علمى شرف المادة أو المادة أو المستوى', 404);
    }

    const subjectId = supervisor.userDetails.subjectId;
    const levelId = supervisor.userDetails.levelId;

    // Get lessons count for this level (all lessons, not just supervisor's)
    const lessonsCount = await prisma.lesson.count({
      where: {
        subjectId,
        levelId,
      },
    });

    // Get exercises count for lessons in this level
    const exercisesCount = await prisma.exercise.count({
      where: {
        lesson: {
          subjectId,
          levelId,
        },
      },
    });

    // Get teachers count who teach this subject
    const teachersCount = await prisma.user.count({
      where: {
        role: {
          name: 'teacher',
        },
        userDetails: {
          subjectId,
        },
      },
    });

    // Get students count linked to teachers of this subject
    const teachersInSubject = await prisma.user.findMany({
      where: {
        role: {
          name: 'teacher',
        },
        userDetails: {
          subjectId,
        },
      },
      select: {
        userDetails: {
          select: {
            teacherCode: true,
          },
        },
      },
    });

    const teacherCodes = teachersInSubject
      .map(t => t.userDetails?.teacherCode)
      .filter(Boolean) as string[];

    const studentsCount = await prisma.user.count({
      where: {
        role: {
          name: 'student',
        },
        userDetails: {
          teacherCode: {
            in: teacherCodes,
          },
        },
      },
    });

    // Get top teachers by lesson count
    const teachers = await prisma.user.findMany({
      where: {
        role: {
          name: 'teacher',
        },
        userDetails: {
          subjectId,
        },
      },
      include: {
        _count: {
          select: {
            authoredLessons: true,
          },
        },
      },
      orderBy: {
        authoredLessons: {
          _count: 'desc',
        },
      },
      take: 5,
    });

    const topTeachers = teachers.map(teacher => ({
      id: teacher.id,
      name: `${teacher.firstName} ${teacher.lastName}`,
      email: teacher.email,
      image: teacher.image,
      lessonCount: teacher._count.authoredLessons,
    }));

    return successResponse({
      supervisor: {
        id: supervisor.id,
        name: `${supervisor.firstName} ${supervisor.lastName}`,
        email: supervisor.email,
        subject: supervisor.userDetails.subject,
        level: supervisor.userDetails.level,
      },
      stats: {
        lessons: lessonsCount,
        exercises: exercisesCount,
        teachers: teachersCount,
        students: studentsCount,
      },
      topTeachers,
    });
  } catch (error: any) {
    console.error('Error fetching supervisor statistics:', error);
    return errorResponse(error.message || 'فشل في جلب الإحصائيات', 500);
  }
}
