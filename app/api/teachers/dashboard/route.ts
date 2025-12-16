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

    const teacherId = session.user.id;

    // Get teacher details with code
    const teacher = await prisma.user.findUnique({
      where: { id: teacherId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        userDetails: {
          select: {
            teacherCode: true,
            allowMessaging: true,
          },
        },
      },
    });

    if (!teacher) {
      return NextResponse.json(
        { success: false, error: "Teacher not found" },
        { status: 404 }
      );
    }

    // Get teacher's lessons count
    const lessonsCount = await prisma.lesson.count({
      where: { authorId: teacherId },
    });

    // Get teacher's exercises count (from their lessons)
    const teacherLessons = await prisma.lesson.findMany({
      where: { authorId: teacherId },
      select: { id: true },
    });
    const lessonIds = teacherLessons.map(l => l.id);

    const exercisesCount = await prisma.exercise.count({
      where: { lessonId: { in: lessonIds } },
    });

    // Get connected students count via TeacherStudentLink
    const studentsCount = await prisma.teacherStudentLink.count({
      where: { teacherId },
    });

    // Get submissions count for teacher's exercises
    const exercises = await prisma.exercise.findMany({
      where: { lessonId: { in: lessonIds } },
      select: { id: true },
    });
    const exerciseIds = exercises.map(e => e.id);

    const submissionsCount = await prisma.submission.count({
      where: { exerciseId: { in: exerciseIds } },
    });

    // Get pending submissions count
    const pendingSubmissionsCount = await prisma.submission.count({
      where: {
        exerciseId: { in: exerciseIds },
        status: 'pending',
      },
    });

    // Get recent submissions
    const recentSubmissions = await prisma.submission.findMany({
      where: {
        exerciseId: { in: exerciseIds },
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        exercise: {
          include: {
            lesson: {
              select: {
                title: true,
              },
            },
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
      take: 5,
    });

    return NextResponse.json({
      success: true,
      data: {
        teacher: {
          id: teacher.id,
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          email: teacher.email,
          teacherCode: teacher.userDetails?.teacherCode || null,
          allowMessaging: teacher.userDetails?.allowMessaging || false,
        },
        stats: {
          lessons: lessonsCount,
          exercises: exercisesCount,
          students: studentsCount,
          submissions: submissionsCount,
          pendingSubmissions: pendingSubmissionsCount,
        },
        recentSubmissions: recentSubmissions.map(sub => ({
          id: sub.id,
          studentName: `${sub.student.firstName} ${sub.student.lastName}`,
          lessonTitle: sub.exercise.lesson.title,
          exerciseQuestion: sub.exercise.question,
          status: sub.status,
          score: sub.finalScore || sub.aiScore,
          submittedAt: sub.submittedAt,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching teacher dashboard:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch teacher dashboard" },
      { status: 500 }
    );
  }
}
