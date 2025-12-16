import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

/**
 * Process parent response for student promotion
 * POST /api/academic-years/promotions/respond
 * Parents respond with yes/no to promotion question
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { promotionId, response } = await req.json();

    if (!promotionId || !response) {
      return NextResponse.json({ error: 'البيانات المطلوبة ناقصة' }, { status: 400 });
    }

    if (!['yes', 'no'].includes(response.toLowerCase())) {
      return NextResponse.json({ error: 'الإجابة يجب أن تكون نعم أو لا' }, { status: 400 });
    }

    // Get promotion
    const promotion = await prisma.studentPromotion.findUnique({
      where: { id: promotionId },
      include: {
        student: true,
        parent: true,
        fromLevel: true,
        toLevel: true
      }
    });

    if (!promotion) {
      return NextResponse.json({ error: 'طلب الترقية غير موجود' }, { status: 404 });
    }

    // Check if user is the parent
    if (promotion.parentId !== session.user.id) {
      return NextResponse.json({ error: 'غير مصرح - يجب أن تكون ولي أمر الطالب' }, { status: 403 });
    }

    const isApproved = response.toLowerCase() === 'yes';
    const studentName = `${promotion.student.firstName} ${promotion.student.lastName}`;

    // Update promotion
    await prisma.studentPromotion.update({
      where: { id: promotionId },
      data: {
        parentResponse: response.toLowerCase(),
        respondedAt: new Date(),
        status: isApproved ? 'approved' : 'rejected'
      }
    });

    // If approved and there's a next level, promote the student
    if (isApproved && promotion.toLevelId) {
      await prisma.userDetails.update({
        where: { userId: promotion.studentId },
        data: { levelId: promotion.toLevelId }
      });

      await prisma.studentPromotion.update({
        where: { id: promotionId },
        data: {
          promotedAt: new Date(),
          status: 'completed'
        }
      });

      await logger.user.updated(
        promotion.studentId,
        session.user.id,
        { action: 'promoted', fromLevel: promotion.fromLevelId, toLevel: promotion.toLevelId }
      );

      // Send notification to student
      await prisma.notification.create({
        data: {
          userId: promotion.studentId,
          title: '🎉 مبروك! تم ترقيتك',
          message: `تهانينا! تم ترقيتك إلى ${promotion.toLevel?.name}`,
          type: 'system'
        }
      });
    } else if (!isApproved) {
      // Send encouragement notification to student
      await prisma.notification.create({
        data: {
          userId: promotion.studentId,
          title: '💪 لا تيأس!',
          message: 'لا تقلق، ستكون السنة القادمة أفضل بإذن الله. استمر في التعلم والتحسن!',
          type: 'system'
        }
      });
    }

    return NextResponse.json({
      success: true,
      isApproved,
      promoted: isApproved && promotion.toLevelId ? true : false,
      message: isApproved 
        ? `🎉 رائع! تم ترقية ${studentName} بنجاح`
        : `تم تسجيل الإجابة. ${studentName} سيعيد نفس المستوى`
    });

  } catch (error: any) {
    console.error('Promotion response error:', error);
    return NextResponse.json(
      { error: 'فشل في معالجة الإجابة' },
      { status: 500 }
    );
  }
}
