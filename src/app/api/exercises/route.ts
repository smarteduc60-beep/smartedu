import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { GoogleDriveService } from '@/lib/google-drive';
import { log, LogLevel, LogCategory } from '@/lib/logger';

/**
 * Helper to extract file ID from URL
 */
function extractFileId(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = url.match(/id=([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/fileId=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

/**
 * Handles the creation of a Google Drive folder for a new exercise.
 * Path: /<LESSON_FOLDER>/Exercise <EXERCISE_ID>
 * @param exercise - The newly created exercise object, with its parent lesson included.
 * @param userId - The ID of the user initiating the creation.
 */
async function handleExerciseFolderCreation(exercise: any, userId: string) {
  if (!exercise.lesson?.driveFolderId) {
    await log({
      level: LogLevel.WARNING,
      category: LogCategory.DRIVE,
      action: 'EXERCISE_DRIVE_SETUP_SKIPPED',
      userId,
      details: `Skipping Drive folder creation for exercise ${exercise.id} because parent lesson ${exercise.lessonId} has no Drive folder.`,
    });
    return;
  }

  try {
    const lessonFolderId = exercise.lesson.driveFolderId;
    const exerciseFolderName = `Exercise ${exercise.id}`;

    await log({
      level: LogLevel.INFO,
      category: LogCategory.DRIVE,
      action: 'EXERCISE_DRIVE_SETUP_START',
      userId,
      details: `Starting Drive folder setup for exercise "${exerciseFolderName}" (ID: ${exercise.id}).`,
    });

    // 1. Get or create the Exercise folder inside the parent Lesson folder
    const exerciseFolderId = await GoogleDriveService.getOrCreateFolder(exerciseFolderName, lessonFolderId);

    // 2. Update the exercise record with the new folder ID
    await prisma.exercise.update({
      where: { id: exercise.id },
      data: { driveFolderId: exerciseFolderId },
    });

    await log({
      level: LogLevel.SUCCESS,
      category: LogCategory.DRIVE,
      action: 'EXERCISE_DRIVE_SETUP_SUCCESS',
      userId,
      details: `Successfully created Drive folder for exercise ${exercise.id}. Folder ID: ${exerciseFolderId}`,
    });

    // 3. نقل الملفات المرتبطة بالتمرين إلى المجلد الجديد
    const filesToMove = [
      extractFileId(exercise.questionFileUrl),
      extractFileId(exercise.modelAnswerImage)
    ].filter(Boolean) as string[];

    if (filesToMove.length > 0) {
      console.log(`[Exercise Drive Setup] Moving ${filesToMove.length} files to exercise folder...`);
      await Promise.all(filesToMove.map(fileId => GoogleDriveService.moveFile(fileId, exerciseFolderId)));
    }
  } catch (error: any) {
    await log({
      level: LogLevel.ERROR,
      category: LogCategory.DRIVE,
      action: 'EXERCISE_DRIVE_SETUP_FAILED',
      userId,
      details: {
        message: `Failed to create Google Drive folder for exercise ${exercise.id}.`,
        error: error.message,
      },
    });
  }
}

// GET /api/exercises?lessonId=1&authorId=xxx
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');
    const authorId = searchParams.get('authorId');

    const where: any = {};
    if (lessonId) {
      where.lessonId = parseInt(lessonId);
    }
    
    // تصفية حسب مؤلف الدروس
    if (authorId) {
      where.lesson = {
        authorId: authorId,
      };
    }

    const exercises = await prisma.exercise.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return successResponse({ exercises });
  } catch (error: any) {
    return errorResponse(error.message || 'فشل في جلب التمارين', 500);
  }
}

// POST /api/exercises
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();

    // فقط المعلمون والمشرفون والمدير
    if (!['teacher', 'supervisor_specific', 'supervisor_general', 'directeur'].includes(session.user.role)) {
      return errorResponse('غير مصرح بإنشاء التمارين', 403);
    }

    const body = await request.json();
    console.log('📥 Received exercise data:', JSON.stringify(body, null, 2));
    
    const { 
      lessonId, 
      type = 'main',
      questionRichContent,
      question, 
      questionFileIds, 
      questionFileUrl,
      geometryCommands, // إضافة الحقل الجديد
      modelAnswer,
      modelAnswerFileIds,
      modelAnswerImage,
      expectedResults,
      maxScore = 20,
      allowRetry = true,
      maxAttempts = 3,
      displayOrder 
    } = body;

    if (!lessonId || (!questionRichContent && !question)) {
      return errorResponse('معرف الدرس والسؤال مطلوبان', 400);
    }

    const parsedLessonId = parseInt(lessonId);
    if (isNaN(parsedLessonId)) {
        return errorResponse('معرف الدرس غير صالح', 400);
    }

    if (type === 'main' && !modelAnswer) {
      return errorResponse('الحل النموذجي مطلوب للتمرين الرئيسي', 400);
    }

    if (type === 'support_with_results' && (!expectedResults || expectedResults.length === 0)) {
      return errorResponse('النتائج المتوقعة مطلوبة لتمرين الدعم + نتائج', 400);
    }

    // التحقق من ملكية الدرس
    const lesson = await prisma.lesson.findUnique({
      where: { id: parsedLessonId },
    });

    if (!lesson) {
      return errorResponse('الدرس غير موجود', 404);
    }

    if (lesson.authorId !== session.user.id && session.user.role !== 'directeur') {
      return errorResponse('غير مصرح بإضافة تمارين لهذا الدرس', 403);
    }

    // الحصول على آخر displayOrder
    let order = displayOrder;
    if (!order) {
      const lastExercise = await prisma.exercise.findFirst({
        where: { lessonId: parsedLessonId },
        orderBy: { displayOrder: 'desc' },
      });
      order = lastExercise ? lastExercise.displayOrder + 1 : 1;
    }

    const exerciseData: any = {
      lessonId: parsedLessonId,
      type,
      question: question || null,
      questionRichContent: questionRichContent || null,
      questionFileIds: Array.isArray(questionFileIds) ? questionFileIds : [],
      geometryCommands: geometryCommands || null, // إضافة الحقل الجديد
      questionFileUrl: questionFileUrl || null,
      displayOrder: order,
    };

    // إضافة الحقول حسب نوع التمرين
    if (type === 'main') {
      exerciseData.modelAnswer = modelAnswer;
      exerciseData.modelAnswerFileIds = Array.isArray(modelAnswerFileIds) ? modelAnswerFileIds : [];
      exerciseData.modelAnswerImage = modelAnswerImage || null;
      const parsedMaxScore = parseFloat(String(maxScore));
      exerciseData.maxScore = isNaN(parsedMaxScore) ? 20 : parsedMaxScore;
      exerciseData.allowRetry = Boolean(allowRetry);
      const parsedMaxAttempts = parseInt(String(maxAttempts));
      exerciseData.maxAttempts = isNaN(parsedMaxAttempts) ? 3 : parsedMaxAttempts;
    } else if (type === 'support_with_results') {
      exerciseData.expectedResults = expectedResults;
    }

    console.log('💾 Creating exercise with data:', JSON.stringify(exerciseData, null, 2));

    const exercise = await prisma.exercise.create({
      data: exerciseData,
      include: {
        lesson: true,
      },
    });

    // Fire-and-forget Google Drive folder creation
    if (exercise) {
      handleExerciseFolderCreation(exercise, session.user.id);
    }

    return successResponse(exercise, 'تم إنشاء التمرين بنجاح', 201);
  } catch (error: any) {
    console.error('Error creating exercise:', error);
    return errorResponse(error.message || 'فشل في إنشاء التمرين', 500);
  }
}
