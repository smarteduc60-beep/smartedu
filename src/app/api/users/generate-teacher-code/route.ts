import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';

// Generate a unique teacher code
function generateTeacherCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// POST /api/users/generate-teacher-code
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();

    if (session.user.role !== 'teacher') {
      return errorResponse('فقط الأساتذة يمكنهم توليد كود الربط', 403);
    }

    // Generate unique code
    let teacherCode = generateTeacherCode();
    let exists = await prisma.userDetails.findFirst({
      where: { teacherCode }
    });

    // Ensure uniqueness
    while (exists) {
      teacherCode = generateTeacherCode();
      exists = await prisma.userDetails.findFirst({
        where: { teacherCode }
      });
    }

    // Unlink all students connected with this teacher
    await prisma.teacherStudentLink.deleteMany({
      where: { teacherId: session.user.id },
    });

    // Update user details with new teacher code
    await prisma.userDetails.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        teacherCode,
      },
      update: {
        teacherCode,
      },
    });

    return successResponse({ teacherCode }, 'تم توليد كود الربط بنجاح وفك ارتباط التلاميذ السابقين');
  } catch (error: any) {
    console.error('Error generating teacher code:', error);
    return errorResponse(error.message || 'فشل في توليد كود الربط', 500);
  }
}
