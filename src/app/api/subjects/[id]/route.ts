import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';
import { successResponse, errorResponse, notFoundResponse } from '@/lib/api-response';

// GET /api/subjects/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const subjectId = parseInt(params.id);

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        level: true,
        stage: true,
      },
    });

    if (!subject) {
      return notFoundResponse('المادة غير موجودة');
    }

    return successResponse(subject);
  } catch (error: any) {
    return errorResponse(error.message || 'فشل في جلب المادة', 500);
  }
}
