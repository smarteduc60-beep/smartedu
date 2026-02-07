import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/exercises/[id] - Get single exercise
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const exerciseId = parseInt(resolvedParams.id);

    if (isNaN(exerciseId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid exercise ID' },
        { status: 400 }
      );
    }

    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            authorId: true,
          },
        },
      },
    });

    if (!exercise) {
      return NextResponse.json(
        { success: false, error: 'Exercise not found' },
        { status: 404 }
      );
    }

    // Check if user has access (is the author or admin)
    if (exercise.lesson.authorId !== session.user.id && session.user.role !== 'directeur') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Convert Decimal fields to numbers
    const exerciseData = {
      ...exercise,
      maxScore: exercise.maxScore ? parseFloat(exercise.maxScore.toString()) : null,
      lessonId: exercise.lessonId,
      question: exercise.question || exercise.questionRichContent || '',
      modelAnswer: exercise.modelAnswer || '',
      questionFileUrl: exercise.questionFileUrl || '',
    };

    return NextResponse.json({
      success: true,
      data: exerciseData,
    });
  } catch (error) {
    console.error('Error fetching exercise:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/exercises/[id] - Update exercise
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const exerciseId = parseInt(resolvedParams.id);

    if (isNaN(exerciseId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid exercise ID' },
        { status: 400 }
      );
    }

    // Check if exercise exists and user has access
    const existingExercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      include: {
        lesson: {
          select: { authorId: true },
        },
      },
    });

    if (!existingExercise) {
      return NextResponse.json(
        { success: false, error: 'Exercise not found' },
        { status: 404 }
      );
    }

    if (existingExercise.lesson.authorId !== session.user.id && session.user.role !== 'directeur') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      lessonId,
      type,
      question,
      questionRichContent,
      geometryCommands,
      modelAnswer,
      modelAnswerImage,
      expectedResults,
      maxScore,
      allowRetry,
      maxAttempts,
      questionFileUrl,
    } = body;

    // Build update data dynamically
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (lessonId !== undefined) updateData.lessonId = lessonId;
    if (type !== undefined) updateData.type = type;
    if (question !== undefined) updateData.question = question;
    if (questionRichContent !== undefined) updateData.questionRichContent = questionRichContent;
    if (geometryCommands !== undefined) updateData.geometryCommands = geometryCommands;
    if (questionFileUrl !== undefined) updateData.questionFileUrl = questionFileUrl;

    // Type-specific fields
    if (type === 'main' || existingExercise.type === 'main') {
      if (modelAnswer !== undefined) updateData.modelAnswer = modelAnswer;
      if (modelAnswerImage !== undefined) updateData.modelAnswerImage = modelAnswerImage;
      if (maxScore !== undefined) updateData.maxScore = maxScore;
      if (allowRetry !== undefined) updateData.allowRetry = allowRetry;
      if (maxAttempts !== undefined) updateData.maxAttempts = maxAttempts;
    }

    if (type === 'support_with_results' || existingExercise.type === 'support_with_results') {
      if (expectedResults !== undefined) updateData.expectedResults = expectedResults;
    }

    const updatedExercise = await prisma.exercise.update({
      where: { id: exerciseId },
      data: updateData,
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Convert Decimal to number
    const exerciseData = {
      ...updatedExercise,
      maxScore: updatedExercise.maxScore ? parseFloat(updatedExercise.maxScore.toString()) : null,
    };

    return NextResponse.json({
      success: true,
      exercise: exerciseData,
    });
  } catch (error) {
    console.error('Error updating exercise:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/exercises/[id] - Delete exercise
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const exerciseId = parseInt(resolvedParams.id);

    if (isNaN(exerciseId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid exercise ID' },
        { status: 400 }
      );
    }

    // Check if exercise exists and user has access
    const existingExercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      select: { googleDriveFolderId: true, lesson: { select: { authorId: true } } }, // Select googleDriveFolderId and authorId from lesson
    });

    if (!existingExercise) {
      return NextResponse.json(
        { success: false, error: 'Exercise not found' },
        { status: 404 }
      );
    }

    if (existingExercise.lesson.authorId !== session.user.id && session.user.role !== 'directeur') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // 1. Delete associated Google Drive folder if exists
    if (existingExercise.googleDriveFolderId) {
      try {
        await GoogleDriveService.deleteFolder(existingExercise.googleDriveFolderId);
      } catch (gdError) {
        console.error(`Failed to delete Google Drive folder for exercise ${exerciseId}:`, gdError);
        // Log and proceed to delete from DB to maintain data integrity within the app
      }
    }

    // Delete all submissions first
    await prisma.submission.deleteMany({
      where: { exerciseId: exerciseId },
    });

    // Delete exercise
    await prisma.exercise.delete({
      where: { id: exerciseId },
    });

    return NextResponse.json({
      success: true,
      message: 'Exercise deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting exercise:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
