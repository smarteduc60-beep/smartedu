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

    const parentId = session.user.id;

    // Get all linked children
    const parentChildLinks = await prisma.parentChildLink.findMany({
      where: { parentId },
      select: {
        childId: true,
      },
    });

    const childrenIds = parentChildLinks.map(link => link.childId);

    if (childrenIds.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          notifications: [],
        },
      });
    }

    // Get recent submissions from all children
    const submissions = await prisma.submission.findMany({
      where: {
        studentId: { in: childrenIds },
        status: 'graded', // Only show graded submissions
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
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
      take: 50, // Get last 50 notifications
    });

    const notifications = submissions.map(sub => {
      const score = Number(sub.finalScore || sub.aiScore || 0);
      let status: 'excellent' | 'good' | 'needs_improvement';
      
      if (score >= 8) {
        status = 'excellent';
      } else if (score >= 5) {
        status = 'good';
      } else {
        status = 'needs_improvement';
      }

      return {
        id: sub.id,
        student: {
          id: sub.student.id,
          firstName: sub.student.firstName,
          lastName: sub.student.lastName,
          image: sub.student.image,
        },
        exercise: {
          question: sub.exercise.question,
        },
        lesson: {
          title: sub.exercise.lesson.title,
        },
        subject: {
          name: sub.exercise.lesson.subject.name,
        },
        score,
        status,
        attemptNumber: sub.attemptNumber,
        submittedAt: sub.submittedAt,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        notifications,
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
