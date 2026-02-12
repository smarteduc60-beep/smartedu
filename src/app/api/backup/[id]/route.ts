import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Download a backup file
 * GET /api/backup/[id]
 * Only accessible by Director role
 */
export async function GET(
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

    const backup = await prisma.backup.findUnique({
      where: { id: backupId }
    });

    if (!backup) {
      return NextResponse.json({ error: 'النسخة الاحتياطية غير موجودة' }, { status: 404 });
    }

    const absolutePath = path.join(process.cwd(), 'backups', backup.filename);

    try {
      const fileBuffer = await fs.readFile(absolutePath);
      
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Disposition': `attachment; filename="${backup.filename}"`,
          'Content-Type': 'application/sql',
          'Content-Length': fileBuffer.length.toString(),
        },
      });
    } catch (error) {
      return NextResponse.json({ error: 'ملف النسخة الاحتياطية غير موجود على السيرفر' }, { status: 404 });
    }

  } catch (error: any) {
    console.error('Backup download error:', error);
    return NextResponse.json(
      { error: 'فشل في تحميل النسخة الاحتياطية' },
      { status: 500 }
    );
  }
}

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
      // Construct absolute path from the stored web path
      const absolutePath = path.join(process.cwd(), 'backups', backup.filename);
      await fs.unlink(absolutePath);
    } catch (error) {
      console.warn('File already deleted or not found');
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
