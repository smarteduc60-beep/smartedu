import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireRole } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { GoogleDriveService, getRootFolderId } from '@/lib/google-drive';
import { log, LogLevel, LogCategory } from '@/lib/logger';
import { saveBase64ToFile } from '@/lib/file-handler';

// Configure API route to accept larger payloads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

// GET /api/lessons - قائمة الدروس
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);

    const subjectId = searchParams.get('subjectId');
    const levelId = searchParams.get('levelId');
    const type = searchParams.get('type'); // public | private
    const authorId = searchParams.get('authorId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: any = {};
    const userRole = session.user.role?.toLowerCase();

    // فلترة حسب المعلمات
    if (subjectId) where.subjectId = parseInt(subjectId);
    if (levelId) where.levelId = parseInt(levelId);
    if (type) where.type = type;
    if (authorId) where.authorId = authorId;

    // الطلاب يرون فقط الدروس العامة + دروس معلمهم
    if (userRole === 'student') {
      const userDetails = await prisma.userDetails.findUnique({
        where: { userId: session.user.id },
        select: { levelId: true },
      });

      if (!userDetails?.levelId) {
        return successResponse({
          lessons: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        });
      }

      // البحث عن جميع المعلمين المرتبطين بالتلميذ
      const teacherLinks = await prisma.teacherStudentLink.findMany({
        where: { studentId: session.user.id },
        select: { teacherId: true },
      });

      const teacherIds = teacherLinks.map(link => link.teacherId);

      console.log('=== Student Lessons Debug ===');
      console.log('Student ID:', session.user.id);
      console.log('Student Level ID:', userDetails.levelId);
      console.log('Teacher Links:', teacherLinks);
      console.log('Teacher IDs:', teacherIds);
      console.log('Subject ID Filter:', subjectId);

      // إعادة بناء شرط WHERE للطلاب
      const studentWhere: any = {
        OR: [
          // 1. الدروس العامة من مستوى التلميذ
          {
            type: 'public',
            levelId: userDetails.levelId,
            ...(subjectId && { subjectId: parseInt(subjectId) }),
          },
          // 2. جميع دروس أساتذة التلميذ (عامة أو خاصة)
          ...(teacherIds.length > 0 ? [{
            authorId: { in: teacherIds },
            levelId: userDetails.levelId,
            ...(subjectId && { subjectId: parseInt(subjectId) }),
          }] : []),
        ],
      };

      console.log('Student WHERE condition:', JSON.stringify(studentWhere, null, 2));

      // استبدال where بالشرط الجديد
      Object.keys(where).forEach(key => delete where[key]);
      Object.assign(where, studentWhere);
    }

    // مشرف المادة يرى فقط دروسه لمادته ومستواه
    if (userRole === 'supervisor_specific') {
      const userDetails = await prisma.userDetails.findUnique({
        where: { userId: session.user.id },
        select: {
          subjectId: true,
          levelId: true,
        },
      });

      if (!userDetails?.subjectId || !userDetails?.levelId) {
        return successResponse({
          lessons: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        });
      }

      // تصفية بناءً على المؤلف والمادة والمستوى
      where.authorId = session.user.id;
      where.subjectId = userDetails.subjectId;
      where.levelId = userDetails.levelId;
    }

    // المعلم يرى فقط دروسه
    if (userRole === 'teacher') {
      where.authorId = session.user.id;
    }

    const [lessons, total] = await Promise.all([
      prisma.lesson.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              image: true,
            },
          },
          subject: true,
          level: true,
          _count: {
            select: {
              exercises: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: [
          { level: { displayOrder: 'asc' } }, // ترتيب حسب تسلسل المستوى أولاً
          { createdAt: 'desc' }               // ثم الأحدث فالأقدم
        ],
      }),
      prisma.lesson.count({ where }),
    ]);

    return successResponse({
      lessons,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return errorResponse(error.message || 'فشل في جلب الدروس', 500);
  }
}

// POST /api/lessons - إنشاء درس جديد
export async function POST(request: NextRequest) {
  try {
    const session = await requireRole(['teacher', 'supervisor_specific', 'supervisor_general', 'directeur']);

    const body = await request.json();
    console.log('--- DIAGNOSTIC: LESSON CREATION BODY ---', body);
    const {
      title,
      content,
      videoUrl,
      imageUrl, // Prioritize direct URL
      pdfUrl,   // Prioritize direct URL
      imageBase64,
      pdfBase64,
      subjectId,
      levelId,
      type = 'private',
      isLocked = false,
    } = body;

    if (!title || !subjectId || !levelId) {
      return errorResponse('العنوان والمادة والمستوى مطلوبة', 400);
    }

    let driveFolderId: string | null = null;
    let finalImageUrl: string | null = imageUrl?.trim() || null;
    let finalPdfUrl: string | null = pdfUrl?.trim() || null;
    const lessonFileIds: string[] = [];

    // --- Google Drive Automation ---
    try {
      const subject = await prisma.subject.findUnique({
        where: { id: parseInt(subjectId) },
        include: { stage: true },
      });

      if (subject) {
        let subjectFolderId = subject.driveFolderId;

        // Self-healing: Ensure Subject folder exists if missing
        if (!subjectFolderId) {
          try {
            console.log(`Subject "${subject.name}" missing Drive folder. Attempting to fix...`);
            const rootId = getRootFolderId();
            let stageFolderId = subject.stage?.driveFolderId;

            // Ensure Stage folder exists
            if (!stageFolderId && subject.stage) {
              stageFolderId = await GoogleDriveService.getOrCreateFolder(subject.stage.name, rootId);
              await prisma.stage.update({ where: { id: subject.stage.id }, data: { driveFolderId: stageFolderId } });
            }

            if (stageFolderId) {
              subjectFolderId = await GoogleDriveService.getOrCreateFolder(subject.name, stageFolderId);
              await prisma.subject.update({ where: { id: subject.id }, data: { driveFolderId: subjectFolderId } });
            }
          } catch (fixError) {
            console.error('Failed to auto-fix Drive folders:', fixError);
          }
        }

        if (subjectFolderId) {
        // 1. Create/Get Teacher folder inside Subject folder
        let teacherName = 'Unknown Teacher';
        
        // Ensure we have the correct name even if session is missing fields
        if (session.user.firstName && session.user.lastName) {
             teacherName = `${session.user.firstName} ${session.user.lastName}`;
        } else {
             // Fallback: fetch from DB to ensure we don't get "undefined undefined"
             const author = await prisma.user.findUnique({
                 where: { id: session.user.id },
                 select: { firstName: true, lastName: true }
             });
             if (author && author.firstName && author.lastName) {
                 teacherName = `${author.firstName} ${author.lastName}`;
             } else if (session.user.name) {
                 teacherName = session.user.name;
             } else {
                 teacherName = `Teacher ${session.user.id}`;
             }
        }

        const teacherFolderId = await GoogleDriveService.getOrCreateFolder(teacherName, subjectFolderId);

        // 2. Create Lesson folder inside Teacher folder
        const safeTitle = title.replace(/[\\/:"*?<>|]+/g, '_').trim();
        driveFolderId = await GoogleDriveService.createFolder(safeTitle, teacherFolderId);

        // 3. Upload files (if any) into the new lesson folder
        if (!finalImageUrl && imageBase64 && typeof imageBase64 === 'string') {
          const mimeTypeMatch = imageBase64.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,/);
          const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/png';
          const base64Data = imageBase64.split(';base64,').pop() || '';
          const buffer = Buffer.from(base64Data, 'base64');

          const uploadResult = await GoogleDriveService.uploadFile(
            `Cover Image - ${safeTitle}`,
            buffer,
            mimeType,
            driveFolderId
          );
          if (uploadResult?.fileId) {
            finalImageUrl = `https://drive.google.com/uc?export=view&id=${uploadResult.fileId}`;
            lessonFileIds.push(uploadResult.fileId);
          }
        }

        if (!finalPdfUrl && pdfBase64 && typeof pdfBase64 === 'string') {
          const base64Data = pdfBase64.split(';base64,').pop() || '';
          const buffer = Buffer.from(base64Data, 'base64');
          const uploadResult = await GoogleDriveService.uploadFile(
            `Lesson PDF - ${safeTitle}.pdf`,
            buffer,
            'application/pdf',
            driveFolderId
          );
          if (uploadResult?.fileId) {
            finalPdfUrl = `https://drive.google.com/uc?export=view&id=${uploadResult.fileId}`;
            lessonFileIds.push(uploadResult.fileId);
          }
        }
        } else {
          console.warn(`Could not create Drive folder for lesson "${title}" because parent subject (ID: ${subjectId}) has no driveFolderId.`);
        }
      }
    } catch (driveError) {
      console.error('Google Drive Integration Error:', driveError);
    }

    // Fallback: Save files locally if Drive upload failed or was skipped
    if (!finalImageUrl && imageBase64 && typeof imageBase64 === 'string') {
      console.log('Saving image locally (Drive upload skipped or failed)...');
      try {
        const extensionMatch = imageBase64.match(/data:image\/(.*?);base64,/);
        const extension = extensionMatch ? `.${extensionMatch[1]}` : '.png';
        finalImageUrl = saveBase64ToFile(imageBase64, 'lessons-images', extension);
      } catch (e: any) {
        console.error("Failed to save image from Base64:", e.message);
        return errorResponse(`فشل في حفظ ملف الصورة: ${e.message}`, 500);
      }
    }

    if (!finalPdfUrl && pdfBase64 && typeof pdfBase64 === 'string') {
      try {
        const extensionMatch = pdfBase64.match(/data:application\/(.*?);base64,/);
        const extension = extensionMatch ? `.${extensionMatch[1]}` : '.pdf';
        finalPdfUrl = saveBase64ToFile(pdfBase64, 'lessons-pdfs', extension);
      } catch (e: any) {
        console.error("Failed to save PDF from Base64:", e.message);
        return errorResponse(`فشل في حفظ ملف PDF: ${e.message}`, 500);
      }
    }

    // إنشاء الدرس
    const lesson = await prisma.lesson.create({
      data: {
        title,
        content: content || '',
        videoUrl: videoUrl || null,
        imageUrl: finalImageUrl,
        pdfUrl: finalPdfUrl,
        subjectId: parseInt(subjectId),
        levelId: parseInt(levelId),
        authorId: session.user.id,
        type,
        isLocked,
        status: 'approved', // جميع الدروس معتمدة مباشرة
        driveFolderId: driveFolderId, // حفظ معرف المجلد
        lessonFileIds: lessonFileIds, // حفظ معرفات الملفات
      },
    });

    console.log(`✅ Lesson created successfully: "${lesson.title}" (ID: ${lesson.id})`);

    return successResponse(lesson, 'تم إنشاء الدرس بنجاح', 201);
  } catch (error: any) {
    console.error('Error creating lesson:', error);
    return errorResponse(error.message || 'فشل في إنشاء الدرس', 500);
  }
}
