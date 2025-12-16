import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get teacher's subjects with messaging status
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const parentId = session.user.id;
    const childId = params.id;

    // Verify parent-child relationship
    const link = await prisma.parentChildLink.findUnique({
      where: {
        parentId_childId: {
          parentId,
          childId,
        },
      },
    });

    if (!link) {
      return NextResponse.json(
        { success: false, error: "Child not found or not linked" },
        { status: 404 }
      );
    }

    // Get child's level
    const child = await prisma.user.findUnique({
      where: { id: childId },
      include: {
        userDetails: {
          include: {
            level: {
              include: {
                subjects: true,
              },
            },
          },
        },
      },
    });

    if (!child || !child.userDetails?.level || !child.userDetails.levelId) {
      return NextResponse.json({
        success: true,
        data: {
          subjects: [],
        },
      });
    }

    const childLevelId = child.userDetails.levelId;

    // Get all subjects for this level
    const subjects = child.userDetails.level.subjects;

    // Get all teachers linked to this student
    const teacherLinks = await prisma.teacherStudentLink.findMany({
      where: {
        studentId: childId,
      },
      include: {
        teacher: {
          include: {
            userDetails: true,
          },
        },
      },
    });

    // For each subject, get teacher info and stats
    const subjectsWithDetails = await Promise.all(
      subjects.map(async (subject) => {
        // Find teacher for this subject from linked teachers
        const teacherLink = teacherLinks.find(
          (link) => link.teacher.userDetails?.subjectId === subject.id
        );
        const teacher = teacherLink?.teacher || null;

        // Get teacher's lessons for this subject and level
        const lessons = teacher
          ? await prisma.lesson.findMany({
              where: {
                authorId: teacher.id,
                subjectId: subject.id,
                levelId: childLevelId, // Filter by child's level
              },
              select: {
                id: true,
              },
            })
          : [];

        const lessonIds = lessons.map((l) => l.id);

        // Get exercises for these lessons
        const exercises = lessonIds.length
          ? await prisma.exercise.findMany({
              where: {
                lessonId: { in: lessonIds },
              },
              select: {
                id: true,
              },
            })
          : [];

        const exerciseIds = exercises.map((e) => e.id);

        // Get submissions for this child in these exercises
        const submissions = exerciseIds.length
          ? await prisma.submission.findMany({
              where: {
                studentId: childId,
                exerciseId: { in: exerciseIds },
              },
              select: {
                id: true,
                finalScore: true,
                aiScore: true,
                status: true,
              },
            })
          : [];

        // Calculate stats
        const gradedSubmissions = submissions.filter((s) => s.status === "graded");
        let totalScore = 0;
        gradedSubmissions.forEach((sub) => {
          totalScore += Number(sub.finalScore || sub.aiScore || 0);
        });

        const averageScore =
          gradedSubmissions.length > 0
            ? Math.round(totalScore / gradedSubmissions.length)
            : 0;

        return {
          id: subject.id,
          name: subject.name,
          teacher: teacher
            ? {
                id: teacher.id,
                firstName: teacher.firstName,
                lastName: teacher.lastName,
                allowMessaging: (teacher.userDetails as any)?.allowMessaging || false,
              }
            : null,
          stats: {
            totalLessons: lessons.length,
            totalExercises: exercises.length,
            totalSubmissions: submissions.length,
            gradedSubmissions: gradedSubmissions.length,
            averageScore,
          },
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        child: {
          id: child.id,
          firstName: child.firstName,
          lastName: child.lastName,
        },
        subjects: subjectsWithDetails,
      },
    });
  } catch (error) {
    console.error("Error fetching child subjects:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}
