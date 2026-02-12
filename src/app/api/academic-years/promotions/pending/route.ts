import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';

// GET /api/academic-years/promotions/pending - الحصول على الترقيات المعلقة لولي الأمر
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();

    // فقط أولياء الأمور
    if (session.user.role !== 'parent') {
      return successResponse([], 'لا توجد ترقيات معلقة');
    }

    // البحث عن جميع الترقيات المعلقة (pending) لهذا الولي
    const pendingPromotions = await prisma.studentPromotion.findMany({
      where: {
        parentId: session.user.id,
        status: 'pending',
        parentResponse: null, // لم يتم الرد بعد
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        fromLevel: {
          select: {
            id: true,
            name: true,
          },
        },
        toLevel: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc', // الأقدم أولاً
      },
    });

    return successResponse(
      pendingPromotions,
      pendingPromotions.length > 0
        ? `لديك ${pendingPromotions.length} ترقية معلقة`
        : 'لا توجد ترقيات معلقة'
    );
  } catch (error: any) {
    console.error('Error fetching pending promotions:', error);
    return errorResponse(error.message || 'فشل في جلب الترقيات المعلقة', 500);
  }
}
