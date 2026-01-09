import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * Get promotion statistics and details
 * GET /api/academic-years/promotions/stats
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const academicYearId = searchParams.get('academicYearId');

    if (!academicYearId) {
      return NextResponse.json({ error: 'معرف السنة الدراسية مطلوب' }, { status: 400 });
    }

    const [
      total,
      pending,
      approved,
      rejected,
      completed
    ] = await Promise.all([
      prisma.studentPromotion.count({
        where: { academicYearId }
      }),
      prisma.studentPromotion.count({
        where: { academicYearId, status: 'pending' }
      }),
      prisma.studentPromotion.count({
        where: { academicYearId, status: 'approved' }
      }),
      prisma.studentPromotion.count({
        where: { academicYearId, status: 'rejected' }
      }),
      prisma.studentPromotion.count({
        where: { academicYearId, status: 'completed' }
      })
    ]);

    // Get detailed promotions list
    const promotions = await prisma.studentPromotion.findMany({
      where: { academicYearId },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        parent: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        fromLevel: {
          select: {
            id: true,
            name: true
          }
        },
        toLevel: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get students who were skipped (no promotion record for this year)
    const skippedStudents = await prisma.user.findMany({
      where: {
        role: { name: 'student' },
        userDetails: { levelId: { not: null } },
        studentPromotions: {
          none: { academicYearId }
        }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        userDetails: {
          select: { level: { select: { name: true } } }
        },
        parentLinks: {
          take: 1
        }
      }
    });

    return NextResponse.json({
      stats: {
        total,
        pending,
        approved,
        rejected,
        completed,
        responseRate: total > 0 ? Math.round(((approved + rejected) / total) * 100) : 0
      },
      promotions,
      skippedStudents: skippedStudents.map(s => ({
        id: s.id,
        firstName: s.firstName,
        lastName: s.lastName,
        email: s.email,
        levelName: s.userDetails?.level?.name,
        hasParent: s.parentLinks.length > 0
      }))
    });

  } catch (error: any) {
    console.error('Promotion stats error:', error);
    return NextResponse.json(
      { error: 'فشل في جلب إحصائيات الترقيات' },
      { status: 500 }
    );
  }
}
