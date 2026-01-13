import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


import { prisma } from "@/lib/prisma";

// POST: Connect student to parent via parent code
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const studentId = session.user.id;
    const body = await request.json();
    const { parentCode } = body;

    if (!parentCode) {
      return NextResponse.json(
        { success: false, error: "Parent code is required" },
        { status: 400 }
      );
    }

    const codeToSearch = parentCode.trim().toUpperCase();
    
    // Add detailed logging before searching
    console.log(`[connect-parent] Received code from studentId: ${studentId}. Searching for code: "${codeToSearch}"`);

    // Find parent by code using the standardized uppercase format.
    const parentDetails = await prisma.userDetails.findUnique({
      where: { parentCode: codeToSearch },
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!parentDetails) {
      return NextResponse.json(
        { success: false, error: "لم يتم العثور على حساب ولي الأمر بهذا الكود" },
        { status: 404 }
      );
    }

    if (parentDetails.user.role.name !== "parent") {
      return NextResponse.json(
        { success: false, error: "الكود المدخل لا ينتمي لحساب ولي أمر" },
        { status: 400 }
      );
    }

    const parentId = parentDetails.userId;

    // Check if already linked
    const existingLink = await prisma.parentChildLink.findUnique({
      where: {
        parentId_childId: {
          parentId,
          childId: studentId,
        },
      },
    });

    if (existingLink) {
      return NextResponse.json(
        { success: false, error: "أنت مرتبط بالفعل بولي الأمر هذا" },
        { status: 400 }
      );
    }

    // Create link
    await prisma.parentChildLink.create({
      data: {
        parentId,
        childId: studentId,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        message: "تم الربط بولي الأمر بنجاح",
        parent: {
          id: parentDetails.user.id,
          firstName: parentDetails.user.firstName,
          lastName: parentDetails.user.lastName,
        },
      },
    });
  } catch (error) {
    console.error("Error connecting to parent:", error);
    return NextResponse.json(
      { success: false, error: "Failed to connect to parent" },
      { status: 500 }
    );
  }
}

// DELETE: Disconnect student from parent
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const studentId = session.user.id;
    const body = await request.json();
    const { parentId } = body;

    if (!parentId) {
      return NextResponse.json(
        { success: false, error: "Parent ID is required" },
        { status: 400 }
      );
    }

    // Delete link
    await prisma.parentChildLink.delete({
      where: {
        parentId_childId: {
          parentId,
          childId: studentId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        message: "تم فك الارتباط بولي الأمر بنجاح",
      },
    });
  } catch (error) {
    console.error("Error disconnecting from parent:", error);
    return NextResponse.json(
      { success: false, error: "Failed to disconnect from parent" },
      { status: 500 }
    );
  }
}
