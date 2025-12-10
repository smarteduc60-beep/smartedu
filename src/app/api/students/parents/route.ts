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

    const studentId = session.user.id;

    // Get linked parents
    const parentLinks = await prisma.parentChildLink.findMany({
      where: { childId: studentId },
      include: {
        parent: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    const parents = parentLinks.map((link) => ({
      id: link.parent.id,
      firstName: link.parent.firstName,
      lastName: link.parent.lastName,
      email: link.parent.email,
    }));

    return NextResponse.json({
      success: true,
      data: {
        parents,
      },
    });
  } catch (error) {
    console.error("Error fetching parents:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch parents" },
      { status: 500 }
    );
  }
}
