import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

/**
 * Get all academic years
 * GET /api/academic-years
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const years = await prisma.academicYear.findMany({
      orderBy: { startDate: 'desc' },
      include: {
        _count: {
          select: { promotions: true }
        }
      }
    });

    return NextResponse.json({ years });

  } catch (error: any) {
    console.error('Academic years fetch error:', error);
    return NextResponse.json(
      { error: 'فشل في جلب السنوات الدراسية' },
      { status: 500 }
    );
  }
}

/**
 * Create new academic year
 * POST /api/academic-years
 * Only accessible by Director
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    // Check if user is Director
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { role: true }
    });

    if (user?.role.name !== 'directeur') {
      return NextResponse.json({ error: 'غير مصرح - مخصص للمدير فقط' }, { status: 403 });
    }

    const { name, startDate, endDate, isCurrent } = await req.json();

    if (!name || !startDate || !endDate) {
      return NextResponse.json({ error: 'البيانات المطلوبة ناقصة' }, { status: 400 });
    }

    // If setting as current, unset other current years
    if (isCurrent) {
      await prisma.academicYear.updateMany({
        where: { isCurrent: true },
        data: { isCurrent: false }
      });
    }

    const year = await prisma.academicYear.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isCurrent: isCurrent || false,
        status: 'active'
      }
    });

    await logger.system.warning(`Academic year created: ${name}`, { 
      yearId: year.id, 
      userId: session.user.id 
    });

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء السنة الدراسية بنجاح',
      year
    });

  } catch (error: any) {
    console.error('Academic year creation error:', error);
    return NextResponse.json(
      { error: 'فشل في إنشاء السنة الدراسية' },
      { status: 500 }
    );
  }
}
