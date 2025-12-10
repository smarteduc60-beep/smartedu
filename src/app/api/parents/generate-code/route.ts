import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Generate random 8-character code
function generateParentCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "P-"; // Prefix for Parent
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const parentId = session.user.id;

    // Check if user is a parent
    const user = await prisma.user.findUnique({
      where: { id: parentId },
      include: { role: true },
    });

    if (!user || user.role.name !== "parent") {
      return NextResponse.json(
        { success: false, error: "Only parents can generate parent codes" },
        { status: 403 }
      );
    }

    // Get current parent code
    const currentDetails = await prisma.userDetails.findUnique({
      where: { userId: parentId },
      select: { parentCode: true },
    });

    // If regenerating, unlink all children first
    if (currentDetails?.parentCode) {
      await prisma.parentChildLink.deleteMany({
        where: { parentId },
      });
    }

    // Generate new unique code
    let newCode = generateParentCode();
    let isUnique = false;

    while (!isUnique) {
      const existing = await prisma.userDetails.findUnique({
        where: { parentCode: newCode },
      });
      if (!existing) {
        isUnique = true;
      } else {
        newCode = generateParentCode();
      }
    }

    // Update parent code in userDetails
    await prisma.userDetails.upsert({
      where: { userId: parentId },
      update: { parentCode: newCode },
      create: {
        userId: parentId,
        parentCode: newCode,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        parentCode: newCode,
        message: currentDetails?.parentCode
          ? "تم توليد كود جديد وفك الارتباط بالأبناء السابقين"
          : "تم توليد كود ولي الأمر بنجاح",
      },
    });
  } catch (error) {
    console.error("Error generating parent code:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate parent code" },
      { status: 500 }
    );
  }
}
