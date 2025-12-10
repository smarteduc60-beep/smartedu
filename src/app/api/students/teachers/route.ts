import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';

// GET /api/students/teachers - جلب قائمة الأساتذة المرتبطين بالطالب
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();

    if (session.user.role !== 'student') {
      return errorResponse('فقط الطلاب يمكنهم الوصول لهذه الصفحة', 403);
    }

    const teacherLinks = await prisma.teacherStudentLink.findMany({
      where: { studentId: session.user.id },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
            userDetails: {
              select: {
                teacherCode: true,
                subject: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const teachers = teacherLinks.map(link => ({
      id: link.teacher.id,
      name: `${link.teacher.firstName} ${link.teacher.lastName}`,
      email: link.teacher.email,
      image: link.teacher.image,
      teacherCode: link.teacher.userDetails?.teacherCode,
      subject: link.teacher.userDetails?.subject,
    }));

    return successResponse({ teachers });
  } catch (error: any) {
    console.error('Error fetching teachers:', error);
    return errorResponse(error.message || 'فشل في جلب الأساتذة', 500);
  }
}
