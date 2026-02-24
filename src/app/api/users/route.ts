import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import bcrypt from 'bcryptjs';
import { GoogleDriveService } from '@/lib/google-drive';
import { log, LogLevel, LogCategory } from '@/lib/logger';

// إضافة هذا السطر لمنع التخزين المؤقت وضمان جلب الأرقام الصحيحة دائماً
export const dynamic = 'force-dynamic';

/**
 * Handles the creation of the necessary folder structure in Google Drive for a new teacher.
 * Stage > Subject > Teacher Name > Level
 * This function is designed to be resilient; it logs errors but does not throw them,
 * ensuring that a failure in Google Drive integration does not prevent user creation.
 * @param user - The newly created user object, including role and userDetails with relations.
 */
async function handleTeacherFolderCreation(user: any) {
  // Ensure user is a teacher and has the necessary details
  if (user.role.name !== 'teacher' || !user.userDetails) {
    return;
  }

  const { userDetails } = user;
  const { stage, subject, level } = userDetails;

  if (!stage?.name || !subject?.name || !level?.name) {
    await log({
        level: LogLevel.WARNING,
        category: LogCategory.DRIVE,
        action: 'DRIVE_SETUP_INCOMPLETE',
        userId: user.id,
        details: `Teacher ${user.id} created, but missing stage, subject, or level name for Drive folder setup.`
    });
    return;
  }

  try {
    await log({
        level: LogLevel.INFO,
        category: LogCategory.DRIVE,
        action: 'DRIVE_SETUP_START',
        userId: user.id,
        details: `Starting Google Drive folder setup for teacher ${user.id}.`
    });

    const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
    if (!rootFolderId) {
      throw new Error('GOOGLE_DRIVE_ROOT_FOLDER_ID is not set.');
    }

    // 1. Get or create Stage folder
    const stageFolderId = await GoogleDriveService.getOrCreateFolder(stage.name, rootFolderId);

    // 2. Get or create Subject folder within Stage
    const subjectFolderId = await GoogleDriveService.getOrCreateFolder(subject.name, stageFolderId);

    // 3. Create Teacher's main folder (e.g., "John Doe")
    const teacherName = `${user.firstName} ${user.lastName}`;
    const teacherFolderId = await GoogleDriveService.getOrCreateFolder(teacherName, subjectFolderId);

    // 4. Create Level sub-folder within the teacher's folder
    await GoogleDriveService.getOrCreateFolder(level.name, teacherFolderId);

    // 5. Update the user's details with their main Drive folder ID
    await prisma.userDetails.update({
      where: { userId: user.id },
      data: { teacherDriveFolderId: teacherFolderId },
    });

    await log({
        level: LogLevel.SUCCESS,
        category: LogCategory.DRIVE,
        action: 'DRIVE_SETUP_SUCCESS',
        userId: user.id,
        details: `Successfully created Drive folders for teacher ${user.id}. Folder ID: ${teacherFolderId}`
    });

  } catch (error: any) {
    await log({
        level: LogLevel.ERROR,
        category: LogCategory.DRIVE,
        action: 'DRIVE_SETUP_FAILED',
        userId: user.id,
        details: {
            message: `Failed to create Google Drive folders for teacher ${user.id}.`,
            error: error.message,
        }
    });
    // Do not re-throw; user creation should not fail due to this.
  }
}


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
      // جلب كل الأدوار والبحث يدوياً لضمان عدم التأثر بحالة الأحرف (Student vs student)
      const allRoles = await prisma.role.findMany();
      const roleRecord = allRoles.find(r => r.name.toLowerCase() === role.toLowerCase());
      
      console.log(`Role filter: requested "${role}", found record:`, roleRecord);
      
      if (roleRecord) {
        where.roleId = roleRecord.id;
      } else {
        // إذا تم طلب دور غير موجود، نعيد قائمة فارغة بدلاً من تجاهل الفلتر
        where.roleId = -1; 
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
        role: true
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    console.log(`✅ Found ${users.length} users`);

    // خطوة 2: جلب userDetails بشكل منفصل
    const userIds = users.map(u => u.id);

    // جلب عدد الدروس لكل مستخدم (بشكل منفصل لتجنب أخطاء العلاقات)
    const lessonsCounts = await prisma.lesson.groupBy({
      by: ['authorId'],
      _count: { id: true },
      where: { authorId: { in: userIds } }
    });

    const lessonsCountMap = new Map<string, number>();
    lessonsCounts.forEach(l => {
      lessonsCountMap.set(l.authorId, l._count.id);
    });
    
    // جلب عدد التمارين لكل مستخدم (عن طريق تجميع تمارين دروسهم)
    const lessonsWithCounts = await prisma.lesson.findMany({
      where: { authorId: { in: userIds } },
      select: {
        authorId: true,
        _count: { select: { exercises: true } }
      }
    });

    const exercisesCountMap = new Map<string, number>();
    lessonsWithCounts.forEach(l => {
      const current = exercisesCountMap.get(l.authorId) || 0;
      exercisesCountMap.set(l.authorId, current + l._count.exercises);
    });

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
      lessonsCount: lessonsCountMap.get(user.id) || 0,
      exercisesCount: exercisesCountMap.get(user.id) || 0,
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

    // Fire-and-forget Google Drive folder creation
    handleTeacherFolderCreation(user);

    return successResponse(user, 'تم إنشاء المستخدم بنجاح', 201);
  } catch (error: any) {
    console.error('Error creating user:', error);
    return errorResponse(error.message || 'فشل في إنشاء المستخدم', 500);
  }
}
