import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get teacher's messaging status
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teacherId = params.id;

    const teacher = await prisma.user.findUnique({
      where: { id: teacherId },
      include: {
        userDetails: {
          select: {
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

    return NextResponse.json({
      success: true,
      data: {
        allowMessaging: teacher.userDetails?.allowMessaging || false,
      },
    });
  } catch (error) {
    console.error("Error fetching teacher messaging status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch messaging status" },
      { status: 500 }
    );
  }
}
