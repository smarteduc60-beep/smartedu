import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getLogs, LogLevel, LogCategory } from '@/lib/logger';

/**
 * Get system logs with filters
 * GET /api/logs?level=INFO&category=AUTH&startDate=...&endDate=...&limit=50&offset=0
 * Only accessible by Director role
 */
export async function GET(req: NextRequest) {
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

    // Parse query parameters
    const searchParams = req.nextUrl.searchParams;
    const level = searchParams.get('level') as LogLevel | undefined;
    const category = searchParams.get('category') as LogCategory | undefined;
    const userId = searchParams.get('userId') || undefined;
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined;
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { logs, total } = await getLogs({
      level,
      category,
      userId,
      startDate,
      endDate,
      limit,
      offset
    });

    return NextResponse.json({
      logs,
      total,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error: any) {
    console.error('Logs fetch error:', error);
    return NextResponse.json(
      { error: 'فشل في جلب السجلات' },
      { status: 500 }
    );
  }
}
