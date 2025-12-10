import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole, getSession } from '@/lib/api-auth';
import { successResponse, errorResponse, notFoundResponse } from '@/lib/api-response';
import bcrypt from 'bcryptjs';

// GET /api/users/[id] - جلب معلومات مستخدم
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('يجب تسجيل الدخول أولاً', 401);
    }

    const userId = params.id;

    // المستخدم يمكنه رؤية معلوماته أو المدير يمكنه رؤية الجميع
    if (session.user.id !== userId && session.user.role !== 'directeur') {
      return errorResponse('غير مصرح بالوصول', 403);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        userDetails: {
          include: {
            stage: true,
            level: true,
            subject: true,
          },
        },
      },
    });

    if (!user) {
      return notFoundResponse('المستخدم غير موجود');
    }

    // إزالة كلمة المرور من الاستجابة
    const { password, ...userWithoutPassword } = user;

    return successResponse(userWithoutPassword);
  } catch (error: any) {
    return errorResponse(error.message || 'فشل في جلب المستخدم', 500);
  }
}

// PATCH /api/users/[id] - تحديث معلومات مستخدم
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('يجب تسجيل الدخول أولاً', 401);
    }

    const { id: userId } = await params;

    // المستخدم يمكنه تعديل معلوماته أو المدير يمكنه تعديل الجميع
    if (session.user.id !== userId && session.user.role !== 'directeur') {
      return errorResponse('غير مصرح بالوصول', 403);
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      password,
      image,
      role,
      stageId,
      levelId,
      subjectId,
      aiEvalMode,
      isBanned,
    } = body;

    // التحقق من البريد الإلكتروني إذا تم تغييره
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: { not: userId },
        },
      });

      if (existingUser) {
        return errorResponse('البريد الإلكتروني مستخدم بالفعل', 400);
      }
    }

    // إعداد البيانات للتحديث
    const updateData: any = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (image !== undefined) updateData.image = image;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    
    // تحديث الدور إذا تم تقديمه (المدير فقط)
    if (role && session.user.role === 'directeur') {
      const roleRecord = await prisma.role.findFirst({
        where: { name: role },
      });
      if (roleRecord) {
        updateData.roleId = roleRecord.id;
      }
    }

    // تحديث المستخدم
    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        role: true,
        userDetails: true,
      },
    });

    // تحديث التفاصيل إذا كانت موجودة
    if (stageId !== undefined || levelId !== undefined || subjectId !== undefined || aiEvalMode !== undefined) {
      const detailsUpdateData: any = {};
      if (stageId !== undefined) detailsUpdateData.stageId = stageId;
      if (levelId !== undefined) detailsUpdateData.levelId = levelId;
      if (subjectId !== undefined) detailsUpdateData.subjectId = subjectId;
      if (aiEvalMode !== undefined) detailsUpdateData.aiEvalMode = aiEvalMode;

      await prisma.userDetails.upsert({
        where: { userId },
        update: detailsUpdateData,
        create: {
          userId,
          ...detailsUpdateData,
        },
      });
    }

    // جلب المستخدم المحدث مع العلاقات
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        userDetails: {
          include: {
            stage: true,
            level: true,
            subject: true,
          },
        },
      },
    });

    // إزالة كلمة المرور
    const { password: _, ...userWithoutPassword } = updatedUser!;

    return successResponse(userWithoutPassword, 'تم تحديث المعلومات بنجاح');
  } catch (error: any) {
    console.error('Error updating user:', error);
    return errorResponse(error.message || 'فشل في تحديث المستخدم', 500);
  }
}

// DELETE /api/users/[id] - حذف مستخدم (المدير فقط)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(['directeur']);

    const userId = params.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return notFoundResponse('المستخدم غير موجود');
    }

    // حذف المستخدم (سيتم حذف التفاصيل تلقائياً بسبب onDelete: Cascade)
    await prisma.user.delete({
      where: { id: userId },
    });

    return successResponse(null, 'تم حذف المستخدم بنجاح');
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return errorResponse(error.message || 'فشل في حذف المستخدم', 500);
  }
}
