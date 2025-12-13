import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import bcrypt from 'bcryptjs';

// GET /api/users - قائمة المستخدمين (المدير فقط)
export async function GET(request: NextRequest) {
  try {
    console.log('🔵 Starting GET /api/users');
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
      console.log('Role record:', roleRecord);
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

    console.log('Where clause:', JSON.stringify(where));
    console.log('🔵 Fetching users from database...');

    // خطوة 1: جلب المستخدمين بدون includes معقدة
    const users = await prisma.user.findMany({
      where,
      include: {
        role: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    console.log(`✅ Found ${users.length} users`);

    // خطوة 2: جلب userDetails بشكل منفصل
    const userIds = users.map(u => u.id);
    const userDetails = await prisma.userDetails.findMany({
      where: {
        userId: { in: userIds }
      },
      include: {
        stage: true,
        level: true,
        subject: true,
      },
    });

    console.log(`✅ Found ${userDetails.length} user details`);

    // خطوة 3: ربط البيانات يدوياً
    const usersWithDetails = users.map(user => {
      const details = userDetails.find(d => d.userId === user.id);
      return {
        ...user,
        userDetails: details || null,
      };
    });

    // خطوة 4: تنسيق النتائج
    const formattedUsers = usersWithDetails.map(user => ({
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      image: user.image,
      role: user.role.name,
      profileComplete: user.profileComplete,
      isBanned: user.userDetails?.isBanned || false,
      lessonsCount: 0, // لا توجد علاقة مباشرة
      exercisesCount: 0, // سنضيفها لاحقاً إذا لزم الأمر
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      details: user.userDetails ? {
        phone: user.userDetails.phone,
        address: user.userDetails.address,
        bio: user.userDetails.bio,
        stageId: user.userDetails.stageId,
        levelId: user.userDetails.levelId,
        subjectId: user.userDetails.subjectId,
        parentCode: user.userDetails.parentCode,
        teacherCode: user.userDetails.teacherCode,
        stage: user.userDetails.stage,
        level: user.userDetails.level,
        subject: user.userDetails.subject,
      } : null,
    }));

    const total = await prisma.user.count({ where });

    console.log('✅ Returning response');

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
    console.error('❌❌❌ CRITICAL ERROR in GET /api/users ❌❌❌');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error object:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'فشل في جلب المستخدمين',
        error: error.toString(),
      },
      { status: 500 }
    );
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
