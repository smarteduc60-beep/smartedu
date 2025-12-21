import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

// GET /api/statistics/public
export async function GET(request: NextRequest) {
  try {
    // 1. Fetch Statistics
    const [
      studentCount,
      teacherCount,
      lessonCount,
      exerciseCount
    ] = await prisma.$transaction([
      prisma.user.count({ where: { role: { name: 'student' } } }),
      prisma.user.count({ where: { role: { name: { in: ['teacher', 'supervisor_specific', 'supervisor_general'] } } } }),
      prisma.lesson.count(),
      prisma.exercise.count(),
    ]);

    // 2. Fetch Top Students
    const studentAverages = await prisma.submission.groupBy({
      by: ['studentId'],
      _avg: {
        finalScore: true,
      },
      where: {
        finalScore: { not: null },
      },
    });

    let topStudents: any[] = [];
    if (studentAverages.length > 0) {
      const sortedStudents = studentAverages
        .filter(s => s._avg.finalScore !== null)
        .sort((a, b) => b._avg.finalScore!.toNumber() - a._avg.finalScore!.toNumber());

      const studentIds = sortedStudents.map(s => s.studentId);
      const studentsWithDetails = await prisma.user.findMany({
        where: { id: { in: studentIds } },
        include: {
          userDetails: {
            include: {
              level: true,
            },
          },
        },
      });
      
      const studentDetailsMap = new Map(studentsWithDetails.map(s => [s.id, s]));
      const topStudentPerLevel: { [levelId: number]: any } = {};

      for (const student of sortedStudents) {
        const details = studentDetailsMap.get(student.studentId);
        const levelId = details?.userDetails?.level?.id;
        const levelName = details?.userDetails?.level?.name;

        if (levelId && !topStudentPerLevel[levelId]) {
          topStudentPerLevel[levelId] = {
            id: details.id,
            firstName: details.firstName,
            lastName: details.lastName,
            levelName: levelName,
            averageScore: student._avg.finalScore!.toNumber(),
          };
        }
      }
      topStudents = Object.values(topStudentPerLevel);
    }
    
    // 3. Combine and return data
    return successResponse({
      studentCount,
      teacherCount,
      lessonCount,
      exerciseCount,
      topStudents,
    });

  } catch (error: any) {
    console.error('Error fetching public stats:', error);
    return errorResponse(error.message || 'فشل في جلب الإحصائيات العامة', 500);
  }
}
