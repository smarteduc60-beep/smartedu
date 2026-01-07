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

    // 1. Check if mysqldump is installed
    try {
      await execAsync('mysqldump --version');
    } catch (e) {
      throw new Error('أداة mysqldump غير مثبتة على السيرفر أو غير متاحة في مسار النظام (PATH).');
    }

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
    let dbConfig;
    try {
      const url = new URL(process.env.DATABASE_URL || '');
      dbConfig = {
        user: url.username,
        password: url.password,
        // 2. Force TCP connection by using 127.0.0.1 instead of localhost
        host: url.hostname === 'localhost' ? '127.0.0.1' : url.hostname,
        port: url.port || '3306',
        database: url.pathname.substring(1),
      };
    } catch (e) {
      throw new Error('Invalid DATABASE_URL');
    }

    // Execute mysqldump
    // Added --column-statistics=0 which is often needed for compatibility between different MySQL versions
    const dumpCommand = `mysqldump -h "${dbConfig.host}" -P "${dbConfig.port}" -u "${dbConfig.user}" --single-transaction --quick --lock-tables=false "${dbConfig.database}" > "${filepath}"`;
    
    // 3. Capture stderr to see warnings/errors
    const { stderr } = await execAsync(dumpCommand, {
      env: { ...process.env, MYSQL_PWD: dbConfig.password },
      // Increase buffer size for large outputs if needed
      maxBuffer: 1024 * 1024 * 10 // 10MB
    }).catch((err) => {
       throw new Error(`فشل تنفيذ mysqldump: ${err.message}`);
    });

    // Get file size
    const stats = await fs.stat(filepath);

    if (stats.size === 0) {
      await fs.unlink(filepath);
      // Return the actual error from stderr
      throw new Error(`فشل إنشاء النسخة الاحتياطية (ملف فارغ). تفاصيل الخطأ: ${stderr || 'تأكد من صلاحيات قاعدة البيانات.'}`);
    }

    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

    // Save backup record to database
    const backup = await prisma.backup.create({
      data: {
        filename,
        filepath: `backups/${filename}`, // Store relative path
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
        id: backup.id,
        filename,
        filepath: `backups/${filename}`,
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
        error: error.message || 'فشل في إنشاء النسخة الاحتياطية',
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
      size: Number(backup.size), // Fix: Convert BigInt to Number explicitly to avoid JSON serialization error
      sizeInMB: (Number(backup.size) / (1024 * 1024)).toFixed(2)
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
