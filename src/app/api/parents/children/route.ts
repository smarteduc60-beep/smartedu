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

    // Get linked children with their details
    const parentChildLinks = await prisma.parentChildLink.findMany({
      where: { parentId },
      include: {
        child: {
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
        },
      },
    });

    // Get statistics for each child
    const childrenWithStats = await Promise.all(
      parentChildLinks.map(async (link) => {
        const childId = link.child.id;

        // Get all submissions for this child
        const submissions = await prisma.submission.findMany({
          where: {
            studentId: childId,
            status: 'graded',
          },
          select: {
            id: true,
            finalScore: true,
            aiScore: true,
            exerciseId: true,
          },
        });

        // Count completed lessons (unique exercises)
        const uniqueExercises = new Set(submissions.map(s => s.exerciseId));
        const completedLessons = uniqueExercises.size;

        // Calculate average score
        let totalScore = 0;
        submissions.forEach((sub) => {
          totalScore += Number(sub.finalScore || sub.aiScore || 0);
        });
        const averageScore = submissions.length > 0 
          ? Math.round((totalScore / submissions.length)) 
          : 0;

        return {
          id: link.child.id,
          firstName: link.child.firstName,
          lastName: link.child.lastName,
          email: link.child.email,
          image: link.child.image,
          level: link.child.userDetails?.level || null,
          stats: {
            completedLessons,
            averageScore,
            submissionCount: submissions.length,
          },
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        children: childrenWithStats,
      },
    });
  } catch (error) {
    console.error("Error fetching children:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch children" },
      { status: 500 }
    );
  }
}
