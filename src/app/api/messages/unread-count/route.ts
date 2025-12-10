import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get unread messages count
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Count unread messages
    const unreadCount = await prisma.message.count({
      where: {
        recipientId: userId,
        isRead: false,
      },
    });

    return NextResponse.json({
      success: true,
      data: { unreadCount },
    });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch unread count" },
      { status: 500 }
    );
  }
}
