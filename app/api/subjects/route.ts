import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';

// GET /api/subjects?levelId=1&stageId=1
export async function GET(request: NextRequest) {
  try {
    // No auth required for signup page
    const { searchParams } = new URL(request.url);
    const levelId = searchParams.get('levelId');
    const stageId = searchParams.get('stageId');

    const where: any = {};
    if (levelId) {
      where.levelId = parseInt(levelId);
    }
    if (stageId) {
      where.stageId = parseInt(stageId);
    }

    const subjects = await prisma.subject.findMany({
      where,
      include: {
        level: true,
        stage: true,
        _count: {
          select: {
            lessons: true,
          },
        },
      },
      orderBy: { id: 'asc' },
    });

    return successResponse(subjects, `تم جلب ${subjects.length} مادة`);
  } catch (error: any) {
    return errorResponse(error.message || 'فشل في جلب المواد', 500);
  }
}

// POST /api/subjects
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();

    if (session.user.role !== 'directeur') {
      return errorResponse('فقط المدير يمكنه إضافة المواد', 403);
    }

    const body = await request.json();
    const { name, description, levelId, stageId } = body;

    if (!name) {
      return errorResponse('اسم المادة مطلوب', 400);
    }

    const subject = await prisma.subject.create({
      data: {
        name,
        description: description || null,
        levelId: levelId ? parseInt(levelId) : null,
        stageId: stageId ? parseInt(stageId) : null,
      },
      include: {
        level: true,
        stage: true,
      },
    });

    return successResponse(subject, 'تم إنشاء المادة بنجاح', 201);
  } catch (error: any) {
    return errorResponse(error.message || 'فشل في إنشاء المادة', 500);
  }
}
