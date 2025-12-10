import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';

// GET /api/directeur/stats - إحصائيات المدير
export async function GET(request: NextRequest) {
  try {
    await requireRole(['directeur']);

    // جلب جميع الإحصائيات في استعلام واحد
    const [
      totalUsers,
      students,
      teachers,
      parents,
      lessons,
      exercises,
      submissions,
      subjects,
      stages,
      levels,
      messages,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          role: {
            name: 'student'
          }
        }
      }),
      prisma.user.count({
        where: {
          role: {
            name: {
              in: ['teacher', 'supervisor_specific']
            }
          }
        }
      }),
      prisma.user.count({
        where: {
          role: {
            name: 'parent'
          }
        }
      }),
      prisma.lesson.count(),
      prisma.exercise.count(),
      prisma.submission.count(),
      prisma.subject.count(),
      prisma.stage.count(),
      prisma.level.count(),
      prisma.message.count(),
    ]);

    return successResponse({
      totalUsers,
      students,
      teachers,
      parents,
      lessons,
      exercises,
      submissions,
      subjects,
      stages,
      levels,
      messages,
    });
  } catch (error: any) {
    console.error('Error fetching directeur stats:', error);
    return errorResponse(error.message || 'فشل في جلب الإحصائيات', 500);
  }
}
