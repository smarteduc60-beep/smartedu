import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
        { success: false, error: "Child not found or not linked to you" },
        { status: 404 }
      );
    }

    // Get child details
    const child = await prisma.user.findUnique({
      where: { id: childId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        userDetails: {
          select: {
            level: {
              select: {
                id: true,
                name: true,
                stage: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!child) {
      return NextResponse.json(
        { success: false, error: "Child not found" },
        { status: 404 }
      );
    }

    // Get all submissions with exercise and lesson details
    const submissions = await prisma.submission.findMany({
      where: {
        studentId: childId,
      },
      include: {
        exercise: {
          include: {
            lesson: {
              include: {
                subject: true,
              },
            },
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    // Calculate statistics
    const gradedSubmissions = submissions.filter(s => s.status === 'graded');
    let totalScore = 0;
    gradedSubmissions.forEach((sub) => {
      totalScore += Number(sub.finalScore || sub.aiScore || 0);
    });
    
    const averageScore = gradedSubmissions.length > 0 
      ? Math.round((totalScore / gradedSubmissions.length)) 
      : 0;

    // Group submissions by subject
    const submissionsBySubject: Record<string, any[]> = {};
    submissions.forEach((sub) => {
      const subjectName = sub.exercise.lesson.subject.name;
      if (!submissionsBySubject[subjectName]) {
        submissionsBySubject[subjectName] = [];
      }
      submissionsBySubject[subjectName].push({
        id: sub.id,
        exerciseQuestion: sub.exercise.question,
        lessonTitle: sub.exercise.lesson.title,
        score: Number(sub.finalScore || sub.aiScore || 0),
        status: sub.status,
        submittedAt: sub.submittedAt,
        attemptNumber: sub.attemptNumber,
      });
    });

    // Calculate subject averages
    const subjectStats = Object.entries(submissionsBySubject).map(([subject, subs]) => {
      const gradedSubs = subs.filter(s => s.status === 'graded');
      const total = gradedSubs.reduce((acc, s) => acc + s.score, 0);
      const avg = gradedSubs.length > 0 ? Math.round(total / gradedSubs.length) : 0;
      
      return {
        subject,
        averageScore: avg,
        submissionCount: subs.length,
        gradedCount: gradedSubs.length,
      };
    });

    // Get recent submissions (last 10)
    const recentSubmissions = submissions.slice(0, 10).map(sub => ({
      id: sub.id,
      exerciseQuestion: sub.exercise.question,
      lessonTitle: sub.exercise.lesson.title,
      subjectName: sub.exercise.lesson.subject.name,
      score: Number(sub.finalScore || sub.aiScore || 0),
      status: sub.status,
      submittedAt: sub.submittedAt,
      attemptNumber: sub.attemptNumber,
      aiFeedback: sub.aiFeedback,
      teacherNotes: sub.teacherNotes,
    }));

    return NextResponse.json({
      success: true,
      data: {
        child: {
          id: child.id,
          firstName: child.firstName,
          lastName: child.lastName,
          email: child.email,
          image: child.image,
          level: child.userDetails?.level || null,
        },
        stats: {
          totalSubmissions: submissions.length,
          gradedSubmissions: gradedSubmissions.length,
          averageScore,
          completedLessons: new Set(submissions.map(s => s.exercise.lessonId)).size,
        },
        subjectStats,
        recentSubmissions,
      },
    });
  } catch (error) {
    console.error("Error fetching child details:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch child details" },
      { status: 500 }
    );
  }
}
