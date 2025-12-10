import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import bcrypt from 'bcryptjs';

// POST /api/auth/signup - تسجيل مستخدم جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      password,
      roleName, // student, teacher, parent
      stageId,
      levelId,
      subjectId,
    } = body;

    // التحقق من البيانات
    if (!firstName || !lastName || !email || !password || !roleName) {
      return errorResponse('جميع الحقول مطلوبة', 400);
    }

    // التحقق من طول كلمة المرور
    if (password.length < 6) {
      return errorResponse('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 400);
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse('البريد الإلكتروني غير صحيح', 400);
    }

    // التحقق من وجود البريد الإلكتروني
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return errorResponse('البريد الإلكتروني مستخدم بالفعل', 400);
    }

    // التحقق من الدور المسموح به (المدير لا يمكن تسجيله عبر الصفحة)
    if (!['student', 'teacher', 'parent'].includes(roleName)) {
      return errorResponse('الدور غير مسموح به', 400);
    }

    // الحصول على الدور
    const role = await prisma.role.findFirst({
      where: { name: roleName },
    });

    if (!role) {
      return errorResponse('الدور غير موجود', 400);
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء كود فريد للمعلم أو ولي الأمر
    let teacherCode: string | undefined;
    let parentCode: string | undefined;

    if (roleName === 'teacher') {
      teacherCode = `T${Date.now().toString().slice(-6)}`;
    } else if (roleName === 'parent') {
      parentCode = `P${Date.now().toString().slice(-6)}`;
    }

    // إنشاء المستخدم مع التفاصيل
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        roleId: role.id,
        userDetails: {
          create: {
            stageId: stageId ? parseInt(stageId) : null,
            levelId: levelId ? parseInt(levelId) : null,
            subjectId: subjectId ? parseInt(subjectId) : null,
            teacherCode,
            parentCode,
            aiEvalMode: roleName === 'student' ? 'auto' : 'manual',
          },
        },
      },
      include: {
        role: true,
        userDetails: true,
      },
    });

    // إزالة كلمة المرور من الاستجابة
    const { password: _, ...userWithoutPassword } = user;

    return successResponse(
      {
        user: userWithoutPassword,
        message: 'تم التسجيل بنجاح! يمكنك الآن تسجيل الدخول.',
      },
      'تم التسجيل بنجاح',
      201
    );
  } catch (error: any) {
    console.error('Error in signup:', error);
    return errorResponse(error.message || 'فشل في التسجيل', 500);
  }
}
