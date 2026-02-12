import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mark message as read
export async function POST(
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

    const messageId = parseInt(params.id);
    const userId = session.user.id;

    // Update message as read only if current user is the recipient
    const message = await prisma.message.update({
      where: {
        id: messageId,
        recipientId: userId,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: { message },
    });
  } catch (error) {
    console.error("Error marking message as read:", error);
    return NextResponse.json(
      { success: false, error: "Failed to mark message as read" },
      { status: 500 }
    );
  }
}
