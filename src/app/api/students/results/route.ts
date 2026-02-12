import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const studentId = session.user.id; // Already a string

    // Get all submissions for this student
    const submissions = await prisma.submission.findMany({
      where: { studentId },
      orderBy: { submittedAt: 'desc' },
    });

    // Get related exercises and lessons
    const exerciseIds = submissions.map((s) => s.exerciseId);
    const exercises = await prisma.exercise.findMany({
      where: { id: { in: exerciseIds } },
      select: {
        id: true,
        question: true,
        lessonId: true,
      },
    });

    const lessonIds = [...new Set(exercises.map((e) => e.lessonId))];
    const lessons = await prisma.lesson.findMany({
      where: { id: { in: lessonIds } },
      select: {
        id: true,
        title: true,
      },
    });

    const exerciseMap = new Map(exercises.map((e) => [e.id, e]));
    const lessonMap = new Map(lessons.map((l) => [l.id, l]));

    // Transform to match frontend expectations
    const formattedSubmissions = submissions.map((sub) => {
      const exercise = exerciseMap.get(sub.exerciseId);
      const lesson = exercise ? lessonMap.get(exercise.lessonId) : null;

      return {
        id: sub.id,
        score: Number(sub.finalScore || 0),
        aiFeedback: sub.aiFeedback,
        submittedAt: sub.submittedAt.toISOString(),
        exercise: {
          id: exercise?.id || 0,
          question: exercise?.question || '',
          lesson: {
            id: lesson?.id || 0,
            title: lesson?.title || '',
          },
        },
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        submissions: formattedSubmissions,
      },
    });
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}
