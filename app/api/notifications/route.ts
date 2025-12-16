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

    const userId = session.user.id;

    // Get all notifications for user
    // @ts-ignore - Prisma client regeneration needed
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50, // Last 50 notifications
    });

    // Get unread count
    // @ts-ignore
    const unreadCount = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        unreadCount,
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

// Mark notification as read
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { notificationId, markAllAsRead } = await request.json();
    const userId = session.user.id;

    if (markAllAsRead) {
      // Mark all notifications as read
      // @ts-ignore
      await prisma.notification.updateMany({
        where: {
          userId,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });
    } else if (notificationId) {
      // Mark specific notification as read
      // @ts-ignore
      await prisma.notification.update({
        where: {
          id: notificationId,
          userId, // Ensure user owns this notification
        },
        data: {
          isRead: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "تم تحديث الإشعارات بنجاح",
    });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update notifications" },
      { status: 500 }
    );
  }
}
