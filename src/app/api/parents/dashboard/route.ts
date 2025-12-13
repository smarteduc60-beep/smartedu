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

    console.log('Parent Dashboard - Session User:', session.user);
    console.log('Parent ID:', parentId);

    // Get parent details
    const parent = await prisma.user.findUnique({
      where: { id: parentId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: {
          select: {
            name: true,
          },
        },
        userDetails: {
          select: {
            parentCode: true,
          },
        },
      },
    });

    console.log('Found parent:', parent);

    if (!parent) {
      console.log('Parent not found for ID:', parentId);
      return NextResponse.json(
        { success: false, error: "Parent not found" },
        { status: 404 }
      );
    }

    // Get linked children
    const parentChildLinks = await prisma.parentChildLink.findMany({
      where: { parentId },
      select: {
        child: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
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

    const children = parentChildLinks.map((link) => ({
      id: link.child.id,
      firstName: link.child.firstName,
      lastName: link.child.lastName,
      email: link.child.email,
      level: link.child.userDetails?.level || null,
    }));

    // Get all submissions for all children
    const childrenIds = children.map((c) => c.id);
    
    const allSubmissions = await prisma.submission.findMany({
      where: {
        studentId: { in: childrenIds },
        status: 'graded', // Only count graded submissions
      },
      select: {
        finalScore: true,
        aiScore: true,
      },
    });

    // Calculate statistics
    const totalSubmissions = allSubmissions.length;
    
    // Calculate average score with proper percentage calculation
    let totalScore = 0;
    let totalMaxScore = 0;
    
    // Get max scores for each submission
    const submissionsWithExercises = await prisma.submission.findMany({
      where: {
        studentId: { in: childrenIds },
        status: 'graded',
      },
      select: {
        finalScore: true,
        aiScore: true,
        exercise: {
          select: {
            maxScore: true,
          },
        },
      },
    });
    
    submissionsWithExercises.forEach((sub) => {
      const score = Number(sub.finalScore || sub.aiScore || 0);
      const maxScore = Number(sub.exercise.maxScore || 20);
      totalScore += score;
      totalMaxScore += maxScore;
    });
    
    // Calculate percentage properly
    const averageScore =
      totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;

    // Get unread messages count
    const unreadMessages = await prisma.message.count({
      where: {
        recipientId: parentId,
        isRead: false,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        parent: {
          id: parent.id,
          firstName: parent.firstName,
          lastName: parent.lastName,
          email: parent.email,
          parentCode: parent.userDetails?.parentCode || null,
        },
        children,
        stats: {
          totalChildren: children.length,
          totalSubmissions,
          averageScore,
          unreadMessages,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching parent dashboard:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch parent dashboard" },
      { status: 500 }
    );
  }
}
