import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { GoogleDriveService, getRootFolderId } from '@/lib/google-drive';

export const dynamic = 'force-dynamic';

// GET /api/subjects?levelId=1&stageId=1
export async function GET(request: NextRequest) {
  try {
    // محاولة الحصول على الجلسة، لكن لا نوقف الطلب إذا فشلت (للسماح بصفحة التسجيل)
    let session = null;
    try {
      session = await requireAuth();
    } catch (e) {
      // المستخدم غير مسجل الدخول، نستمر كزائر
    }

    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode');
    console.log(`[API Subjects] Request Params: ${JSON.stringify(Object.fromEntries(searchParams))}`);

    const where: any = {};
    const userRole = session?.user?.role?.toLowerCase();

    if (userRole === 'student') {
      // For students, ignore query params and fetch subjects for their level
      const userDetails = await prisma.userDetails.findUnique({
        where: { userId: session.user.id },
        select: { levelId: true },
      });

      if (!userDetails?.levelId) {
        // Student has no level assigned, return no subjects
        return successResponse([], 'لم يتم تعيين مستوى للطالب');
      }
      where.levels = {
        some: {
          id: userDetails.levelId
        }
      };

    } else {
      // For other roles (admin, etc.), use query params for filtering
      const levelId = searchParams.get('levelId');
      const stageId = searchParams.get('stageId');
      if (levelId) {
        where.levels = {
          some: {
            id: parseInt(levelId)
          }
        };
      }
      if (stageId) {
        where.stageId = parseInt(stageId);
      }
    }

    const subjects = await prisma.subject.findMany({
      where,
      distinct: mode === 'distinct' ? ['name'] : undefined,
      include: {
        levels: true,
        stage: true,
        _count: {
          select: {
            lessons: true,
          },
        },
      },
      orderBy: { id: 'asc' },
    });

    return successResponse(subjects, `تم جلب ${subjects.length} مادة`);
  } catch (error: any) {
    console.error('Error fetching subjects:', error);
    return errorResponse(error.message || 'فشل في جلب المواد', 500);
  }
}

// POST /api/subjects
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();

    if (session.user.role !== 'directeur') {
      return errorResponse('فقط المدير يمكنه إضافة المواد', 403);
    }

    const body = await request.json();
    const { name, description, levelIds, stageId } = body;

    if (!name) {
      return errorResponse('اسم المادة مطلوب', 400);
    }

    // Create single subject with connections to multiple levels
    const subject = await prisma.subject.create({
      data: {
        name,
        description: description || null,
        stageId: stageId ? parseInt(stageId) : null,
        levels: {
          connect: Array.isArray(levelIds) 
            ? levelIds.map((id: any) => ({ id: parseInt(id) }))
            : []
        }
      },
      include: {
        levels: true,
        stage: true,
      },
    });

    // --- Google Drive Automation: Create Subject Folders ---
    try {
      // We assume all subjects belong to the same stage (since stageId is passed once)
      if (subject.stage) {
        // 1. Get Root ID
        const rootId = getRootFolderId();
        const stage = subject.stage;

        // 2. Ensure Stage Folder Exists (Once for the batch)
        let stageFolderId = stage.driveFolderId;
        if (!stageFolderId) {
          console.log(`Creating missing Drive folder for Stage: ${stage.name}`);
          stageFolderId = await GoogleDriveService.getOrCreateFolder(stage.name, rootId);
          await prisma.stage.update({
            where: { id: stage.id },
            data: { driveFolderId: stageFolderId },
          });
        }

        // 3. Create Subject Folders inside Stage Folder (Parallel)
        const subjectFolderId = await GoogleDriveService.createFolder(subject.name, stageFolderId!);
        await prisma.subject.update({
          where: { id: subject.id },
          data: { driveFolderId: subjectFolderId },
        });
      }
    } catch (driveError) {
      console.error('Failed to auto-create Drive folders for Subjects:', driveError);
      // We continue without failing the request, as the DB record is created successfully.
    }
    // ----------------------------------------------------

    return successResponse({ subject }, 'تم إنشاء المادة بنجاح', 201);
  } catch (error: any) {
    console.error('Error creating subject:', error);
    return errorResponse(error.message || 'فشل في إنشاء المادة', 500);
  }
}
