import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import * as fs from 'fs/promises';

/**
 * Delete a backup file
 * DELETE /api/backup/[id]
 * Only accessible by Director role
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    // Check if user is Director
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { role: true }
    });

    if (user?.role.name !== 'directeur') {
      return NextResponse.json({ error: 'غير مصرح - مخصص للمدير فقط' }, { status: 403 });
    }

    const backupId = params.id;

    // Get backup details
    const backup = await prisma.backup.findUnique({
      where: { id: backupId }
    });

    if (!backup) {
      return NextResponse.json({ error: 'النسخة الاحتياطية غير موجودة' }, { status: 404 });
    }

    // Delete file from disk
    try {
      await fs.unlink(backup.filepath);
    } catch (error) {
      console.warn('File already deleted or not found:', backup.filepath);
    }

    // Delete from database
    await prisma.backup.delete({
      where: { id: backupId }
    });

    return NextResponse.json({
      success: true,
      message: 'تم حذف النسخة الاحتياطية بنجاح'
    });

  } catch (error: any) {
    console.error('Backup delete error:', error);
    return NextResponse.json(
      { error: 'فشل في حذف النسخة الاحتياطية' },
      { status: 500 }
    );
  }
}
