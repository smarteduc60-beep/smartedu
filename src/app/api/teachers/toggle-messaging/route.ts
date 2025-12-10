import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Toggle teacher messaging setting
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const teacherId = session.user.id;

    // Get current setting
    const currentDetails = await prisma.userDetails.findUnique({
      where: { userId: teacherId },
    });

    const newAllowMessaging = !currentDetails?.allowMessaging;

    // Update teacher's messaging setting
    const updatedDetails = await prisma.userDetails.upsert({
      where: { userId: teacherId },
      update: { allowMessaging: newAllowMessaging },
      create: {
        userId: teacherId,
        allowMessaging: newAllowMessaging,
        aiEvalMode: 'auto',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        allowMessaging: updatedDetails.allowMessaging,
        message: updatedDetails.allowMessaging
          ? "تم تفعيل التواصل مع أولياء الأمور"
          : "تم تعطيل التواصل مع أولياء الأمور",
      },
    });
  } catch (error) {
    console.error("Error updating messaging setting:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update setting" },
      { status: 500 }
    );
  }
}
