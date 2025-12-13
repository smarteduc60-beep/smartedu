import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

/**
 * Export database backup
 * POST /api/backup/export
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

    await logger.backup.started(session.user.id, 'EXPORT');

    // Create backups directory if not exists
    const backupsDir = path.join(process.cwd(), 'backups');
    try {
      await fs.access(backupsDir);
    } catch {
      await fs.mkdir(backupsDir, { recursive: true });
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `smartedu_backup_${timestamp}.sql`;
    const filepath = path.join(backupsDir, filename);

    // Get database connection details from environment
    const dbUrl = process.env.DATABASE_URL || '';
    const dbMatch = dbUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);

    if (!dbMatch) {
      throw new Error('Invalid DATABASE_URL format');
    }

    const [, dbUser, dbPassword, dbHost, dbPort, dbName] = dbMatch;

    // Execute mysqldump
    const dumpCommand = `mysqldump -h ${dbHost} -P ${dbPort} -u ${dbUser} -p${dbPassword} ${dbName} > "${filepath}"`;
    
    await execAsync(dumpCommand);

    // Get file size
    const stats = await fs.stat(filepath);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

    // Save backup record to database
    await prisma.backup.create({
      data: {
        filename,
        filepath,
        size: stats.size,
        type: 'FULL',
        status: 'COMPLETED',
        createdById: session.user.id
      }
    });

    await logger.backup.completed(session.user.id, filename, stats.size);

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء النسخة الاحتياطية بنجاح',
      backup: {
        filename,
        size: `${sizeInMB} MB`,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('Backup export error:', error);
    
    const session = await getServerSession(authOptions);
    if (session?.user) {
      await logger.backup.failed(session.user.id, error);
    }

    return NextResponse.json(
      { 
        error: 'فشل في إنشاء النسخة الاحتياطية',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * List all backups
 * GET /api/backup/export
 */
export async function GET(req: NextRequest) {
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

    const backups = await prisma.backup.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Convert size to MB
    const backupsWithSize = backups.map(backup => ({
      ...backup,
      sizeInMB: (backup.size / (1024 * 1024)).toFixed(2)
    }));

    return NextResponse.json({ backups: backupsWithSize });

  } catch (error: any) {
    console.error('Backup list error:', error);
    return NextResponse.json(
      { error: 'فشل في جلب قائمة النسخ الاحتياطية' },
      { status: 500 }
    );
  }
}
