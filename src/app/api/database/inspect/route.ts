import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    await requireRole(['directeur']);

    const [
      usersCount,
      lessonsCount,
      exercisesCount,
      submissionsCount,
      stagesCount,
      levelsCount,
      subjectsCount,
      messagesCount,
      notificationsCount,
      logsCount,
      backupsCount,
      academicYearsCount,
      promotionsCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.lesson.count(),
      prisma.exercise.count(),
      prisma.submission.count(),
      prisma.stage.count(),
      prisma.level.count(),
      prisma.subject.count(),
      prisma.message.count(),
      prisma.notification.count(),
      prisma.log.count(),
      prisma.backup.count(),
      prisma.academicYear.count(),
      prisma.studentPromotion.count(),
    ]);

    const stats = {
      users: usersCount,
      lessons: lessonsCount,
      exercises: exercisesCount,
      submissions: submissionsCount,
      stages: stagesCount,
      levels: levelsCount,
      subjects: subjectsCount,
      messages: messagesCount,
      notifications: notificationsCount,
      logs: logsCount,
      backups: backupsCount,
      academicYears: academicYearsCount,
      promotions: promotionsCount,
      total: usersCount + lessonsCount + exercisesCount + submissionsCount + stagesCount + levelsCount + subjectsCount + messagesCount,
    };

    return successResponse(stats, 'تم جلب إحصائيات قاعدة البيانات بنجاح');
  } catch (error: any) {
    console.error('Database inspect error:', error);
    return errorResponse(error.message || 'فشل في جلب إحصائيات قاعدة البيانات', 500);
  }
}
