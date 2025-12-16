import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Restore database from backup
 * POST /api/backup/import
 * Only accessible by Director role
 */
export async function POST(req: NextRequest) {
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

    const { backupId } = await req.json();

    if (!backupId) {
      return NextResponse.json({ error: 'معرف النسخة الاحتياطية مطلوب' }, { status: 400 });
    }

    // Get backup details
    const backup = await prisma.backup.findUnique({
      where: { id: backupId }
    });

    if (!backup) {
      return NextResponse.json({ error: 'النسخة الاحتياطية غير موجودة' }, { status: 404 });
    }

    await logger.backup.started(session.user.id, 'IMPORT');

    // Get database connection details
    const dbUrl = process.env.DATABASE_URL || '';
    const dbMatch = dbUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);

    if (!dbMatch) {
      throw new Error('Invalid DATABASE_URL format');
    }

    const [, dbUser, dbPassword, dbHost, dbPort, dbName] = dbMatch;

    // Execute mysql import
    const importCommand = `mysql -h ${dbHost} -P ${dbPort} -u ${dbUser} -p${dbPassword} ${dbName} < "${backup.filepath}"`;
    
    await execAsync(importCommand);

    await logger.backup.restored(session.user.id, backup.filename);

    return NextResponse.json({
      success: true,
      message: 'تم استعادة النسخة الاحتياطية بنجاح',
      backup: {
        filename: backup.filename,
        restoredAt: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('Backup import error:', error);
    
    const session = await getServerSession(authOptions);
    if (session?.user) {
      await logger.backup.failed(session.user.id, error);
    }

    return NextResponse.json(
      { 
        error: 'فشل في استعادة النسخة الاحتياطية',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
