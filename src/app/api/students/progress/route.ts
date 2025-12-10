import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

    // Get student details
    const student = await prisma.userDetails.findUnique({
      where: { userId: studentId },
      include: {
        level: {
          include: {
            subjects: true,
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Student not found" },
        { status: 404 }
      );
    }

    // Get connected teachers
    const teacherLinks = await prisma.teacherStudentLink.findMany({
      where: { studentId },
      select: { teacherId: true },
    });
    const connectedTeacherIds = teacherLinks.map((link) => link.teacherId);

    // Get subjects for student's level
    const subjects = student.levelId 
      ? await prisma.subject.findMany({
          where: { levelId: student.levelId },
        })
      : [];

    // Get all submissions for this student
    const submissions = await prisma.submission.findMany({
      where: { studentId },
      orderBy: { submittedAt: 'desc' },
    });

    // Calculate progress per subject
    const subjectsProgress = await Promise.all(
      subjects.map(async (subject, index) => {
        // Get lessons for this subject
        const lessons = await prisma.lesson.findMany({
          where: { subjectId: subject.id },
          select: { id: true },
        });
        const lessonIds = lessons.map((l) => l.id);

        // Get exercises for these lessons
        const exercises = await prisma.exercise.findMany({
          where: { lessonId: { in: lessonIds } },
          select: { id: true, maxScore: true },
        });
        const exerciseIds = exercises.map((e) => e.id);

        // Filter submissions for this subject
        const subjectSubmissions = submissions.filter((sub) =>
          exerciseIds.includes(sub.exerciseId)
        );

        if (subjectSubmissions.length === 0) {
          return {
            subject: subject.name,
            score: 0,
            color: `hsl(var(--chart-${(index % 5) + 1}))`,
          };
        }

        // Calculate average score
        const totalScore = subjectSubmissions.reduce(
          (acc, sub) => acc + Number(sub.finalScore || 0),
          0
        );
        const totalPossible = subjectSubmissions.reduce((acc, sub) => {
          const exercise = exercises.find((e) => e.id === sub.exerciseId);
          return acc + Number(exercise?.maxScore || 10);
        }, 0);
        const average =
          totalPossible > 0
            ? Math.round((totalScore / totalPossible) * 100)
            : 0;

        return {
          subject: subject.name,
          score: average,
          color: `hsl(var(--chart-${(index % 5) + 1}))`,
        };
      })
    );

    // Get recent lessons
    // First, get exercises with their lessons
    const exercisesWithLessons = await prisma.exercise.findMany({
      where: {
        id: { in: submissions.map((s) => s.exerciseId) },
      },
      select: { id: true, lessonId: true },
    });

    const exerciseLessonMap = new Map<number, number>();
    exercisesWithLessons.forEach((ex) => {
      exerciseLessonMap.set(ex.id, ex.lessonId);
    });

    const lessonSubmissions = new Map<number, any[]>();
    submissions.forEach((sub) => {
      const lessonId = exerciseLessonMap.get(sub.exerciseId);
      if (lessonId) {
        if (!lessonSubmissions.has(lessonId)) {
          lessonSubmissions.set(lessonId, []);
        }
        lessonSubmissions.get(lessonId)?.push(sub);
      }
    });

    const recentLessonIds = Array.from(lessonSubmissions.keys()).slice(0, 3);
    const recentLessons = await Promise.all(
      recentLessonIds.map(async (lessonId) => {
        const lesson = await prisma.lesson.findUnique({
          where: { id: lessonId },
          select: {
            id: true,
            title: true,
          },
        });

        if (!lesson) return null;

        // Get all exercises for this lesson
        const lessonExercises = await prisma.exercise.findMany({
          where: { lessonId },
          select: { id: true },
        });

        const totalExercises = lessonExercises.length;
        const solvedExercises = lessonExercises.filter((ex) =>
          submissions.some((sub) => sub.exerciseId === ex.id)
        ).length;

        const progress =
          totalExercises > 0
            ? Math.round((solvedExercises / totalExercises) * 100)
            : 0;

        return {
          id: lesson.id,
          title: lesson.title,
          progress,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        subjectsProgress,
        recentLessons: recentLessons.filter((lesson) => lesson !== null),
      },
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}
