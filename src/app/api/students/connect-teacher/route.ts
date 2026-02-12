import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';

// POST /api/students/connect-teacher
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();

    if (session.user.role !== 'student') {
      return errorResponse('فقط الطلاب يمكنهم الربط بالأستاذ', 403);
    }

    const body = await request.json();
    const { teacherCode } = body;

    if (!teacherCode) {
      return errorResponse('كود الأستاذ مطلوب', 400);
    }

    // البحث عن الأستاذ بالكود
    const teacherDetails = await prisma.userDetails.findUnique({
      where: { teacherCode },
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!teacherDetails || teacherDetails.user.role.name !== 'teacher') {
      return errorResponse('كود الأستاذ غير صحيح', 404);
    }

    // التحقق من عدم وجود ربط مسبق
    const existingLink = await prisma.teacherStudentLink.findUnique({
      where: {
        teacherId_studentId: {
          teacherId: teacherDetails.userId,
          studentId: session.user.id,
        },
      },
    });

    if (existingLink) {
      return errorResponse('أنت مرتبط بالفعل بهذا الأستاذ', 400);
    }

    // إنشاء الربط
    await prisma.teacherStudentLink.create({
      data: {
        teacherId: teacherDetails.userId,
        studentId: session.user.id,
      },
    });

    return successResponse(
      {
        teacher: {
          id: teacherDetails.user.id,
          name: `${teacherDetails.user.firstName} ${teacherDetails.user.lastName}`,
          email: teacherDetails.user.email,
        },
      },
      'تم الربط بالأستاذ بنجاح'
    );
  } catch (error: any) {
    console.error('Error connecting to teacher:', error);
    return errorResponse(error.message || 'فشل في الربط بالأستاذ', 500);
  }
}

// DELETE /api/students/connect-teacher - فك الارتباط
export async function DELETE(request: NextRequest) {
  try {
    const session = await requireAuth();

    if (session.user.role !== 'student') {
      return errorResponse('فقط الطلاب يمكنهم فك الارتباط', 403);
    }

    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');

    if (!teacherId) {
      return errorResponse('معرف الأستاذ مطلوب', 400);
    }

    // حذف الربط
    await prisma.teacherStudentLink.delete({
      where: {
        teacherId_studentId: {
          teacherId: teacherId,
          studentId: session.user.id,
        },
      },
    });

    return successResponse(null, 'تم فك الارتباط بنجاح');
  } catch (error: any) {
    console.error('Error disconnecting from teacher:', error);
    return errorResponse(error.message || 'فشل في فك الارتباط', 500);
  }
}
