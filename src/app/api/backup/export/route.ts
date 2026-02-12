import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { uploadFile, findOrCreateFolder, getRootFolderId } from '@/lib/google-drive';

// دالة لمعالجة BigInt عند التحويل إلى JSON
const jsonReplacer = (key: string, value: any) => {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const uploadToDrive = searchParams.get('uploadToDrive') === 'true';

    // 1. التحقق من الصلاحيات
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'directeur') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    await logger.backup.started(session.user.id, 'FULL_JSON');

    // 2. جلب البيانات باستخدام Transaction لضمان الاتساق
    const backupData = await prisma.$transaction(async (tx) => {
      return {
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0',
          system: 'SmartEdu',
          exportedBy: session.user.email
        },
        data: {
          roles: await tx.role.findMany(),
          users: await tx.user.findMany({ include: { userDetails: true } }),
          stages: await tx.stage.findMany(),
          levels: await tx.level.findMany(),
          subjects: await tx.subject.findMany(),
          lessons: await tx.lesson.findMany({ include: { exercises: true } }),
          exercises: await tx.exercise.findMany(),
          submissions: await tx.submission.findMany(),
          messages: await tx.message.findMany(),
          notifications: await tx.notification.findMany(),
          academicYears: await tx.academicYear.findMany({ include: { promotions: true } }),
          studentPromotions: await tx.studentPromotion.findMany(),
          logs: await tx.log.findMany({ take: 2000, orderBy: { timestamp: 'desc' } }), // آخر 2000 سجل
        }
      };
    });

    // 3. تحويل البيانات إلى ملف JSON
    const jsonString = JSON.stringify(backupData, jsonReplacer, 2);
    const buffer = Buffer.from(jsonString, 'utf-8');
    const sizeInBytes = buffer.length;
    const filename = `smartedu_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;

    let filepath = 'download_stream';
    let driveUrl = '';

    // 4. (أ) الرفع إلى Google Drive إذا طلب ذلك
    if (uploadToDrive) {
      const rootId = getRootFolderId();
      // إنشاء أو العثور على مجلد خاص بالنسخ الاحتياطية
      const backupFolderId = await findOrCreateFolder('System Backups', rootId);
      
      const uploadResult = await uploadFile(buffer, filename, 'application/json', backupFolderId);
      filepath = uploadResult.webViewLink; // حفظ رابط الملف في قاعدة البيانات
      driveUrl = uploadResult.webViewLink;
    }

    // 4. (ب) تسجيل العملية
    await prisma.backup.create({
      data: {
        filename,
        filepath,
        size: BigInt(sizeInBytes),
        type: 'FULL_JSON',
        status: 'COMPLETED',
        createdById: session.user.id,
      },
    });
    
    await logger.backup.completed(session.user.id, filename, sizeInBytes);

    // إذا كان الطلب للرفع إلى Drive، نعيد استجابة JSON بدلاً من الملف
    if (uploadToDrive) {
      return NextResponse.json({
        success: true,
        message: 'تم إنشاء النسخة الاحتياطية ورفعها إلى Google Drive بنجاح',
        url: driveUrl
      });
    }

    // 5. إرجاع الملف للتحميل
    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error: any) {
    console.error('Backup export error:', error);
    return NextResponse.json(
      { error: 'فشل إنشاء النسخة الاحتياطية', details: error.message },
      { status: 500 }
    );
  }
}