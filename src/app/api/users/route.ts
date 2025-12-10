import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import bcrypt from 'bcryptjs';

// GET /api/users - قائمة المستخدمين (المدير فقط)
export async function GET(request: NextRequest) {
  try {
    await requireRole(['directeur']);

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const skip = (page - 1) * limit;

    console.log('Query params:', { role, search, page, limit });

    const where: any = {};
    
    // Role filter
    if (role) {
      const roleRecord = await prisma.role.findFirst({ where: { name: role } });
      if (roleRecord) {
        where.roleId = roleRecord.id;
      }
    }

    // Search filter
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
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
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    // Format response to match frontend expectations
    const formattedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      image: user.image,
      role: user.role.name,
      profileComplete: user.profileComplete,
      isBanned: user.userDetails?.isBanned || false,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      details: user.userDetails ? {
        phone: user.userDetails.phone,
        address: user.userDetails.address,
        bio: user.userDetails.bio,
        stageId: user.userDetails.stageId,
        subjectId: user.userDetails.subjectId,
        levelId: user.userDetails.levelId,
        parentCode: user.userDetails.parentCode,
        teacherCode: user.userDetails.teacherCode,
        subject: user.userDetails.subject,
        level: user.userDetails.level ? {
          ...user.userDetails.level,
          stage: user.userDetails.level.stage
        } : undefined,
      } : undefined,
    }));

    return NextResponse.json({
      success: true,
      data: formattedUsers,
      total,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return errorResponse(error.message || 'فشل في جلب المستخدمين', 500);
  }
}

// POST /api/users - إنشاء مستخدم جديد
export async function POST(request: NextRequest) {
  try {
    await requireRole(['directeur']);

    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      password,
      roleName,
      stageId,
      levelId,
      subjectId,
    } = body;

    // التحقق من البيانات
    if (!firstName || !lastName || !email || !password || !roleName) {
      return errorResponse('جميع الحقول مطلوبة', 400);
    }

    // التحقق من وجود البريد الإلكتروني
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return errorResponse('البريد الإلكتروني مستخدم بالفعل', 400);
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

    if (roleName === 'teacher' || roleName === 'supervisor_specific') {
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
            stageId: stageId || null,
            levelId: levelId || null,
            subjectId: subjectId || null,
            teacherCode,
            parentCode,
          },
        },
      },
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

    return successResponse(user, 'تم إنشاء المستخدم بنجاح', 201);
  } catch (error: any) {
    console.error('Error creating user:', error);
    return errorResponse(error.message || 'فشل في إنشاء المستخدم', 500);
  }
}
