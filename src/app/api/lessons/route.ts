import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireRole } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';

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

    // فلترة حسب المعلمات
    if (subjectId) where.subjectId = parseInt(subjectId);
    if (levelId) where.levelId = parseInt(levelId);
    if (type) where.type = type;
    if (authorId) where.authorId = authorId;

    // الطلاب يرون فقط الدروس العامة + دروس معلمهم
    if (session.user.role === 'student') {
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

      // إعادة بناء شرط WHERE للطلاب
      const studentWhere: any = {
        OR: [
          // 1. الدروس العامة من مستوى التلميذ
          { 
            type: 'public', 
            levelId: userDetails.levelId,
          },
          // 2. جميع دروس أساتذة التلميذ (عامة أو خاصة)
          ...(teacherIds.length > 0 ? [{ authorId: { in: teacherIds } }] : []),
        ],
      };

      console.log('Student WHERE condition:', JSON.stringify(studentWhere, null, 2));

      // تطبيق الفلاتر الإضافية إذا كانت موجودة
      if (subjectId) {
        studentWhere.subjectId = parseInt(subjectId);
      }

      // استبدال where بالشرط الجديد
      Object.keys(where).forEach(key => delete where[key]);
      Object.assign(where, studentWhere);
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
        orderBy: { createdAt: 'desc' },
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
    const {
      title,
      content,
      videoUrl,
      pdfUrl,
      subjectId,
      levelId,
      type = 'private',
      isLocked = false,
    } = body;

    // التحقق من البيانات
    if (!title || !subjectId || !levelId) {
      return errorResponse('العنوان والمادة والمستوى مطلوبة', 400);
    }

    // إنشاء الدرس
    const lesson = await prisma.lesson.create({
      data: {
        title,
        content: content || '',
        videoUrl: videoUrl || null,
        pdfUrl: pdfUrl || null,
        subjectId: parseInt(subjectId),
        levelId: parseInt(levelId),
        authorId: session.user.id,
        type,
        isLocked,
        status: 'approved', // جميع الدروس معتمدة مباشرة
      },
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
      },
    });

    return successResponse(lesson, 'تم إنشاء الدرس بنجاح', 201);
  } catch (error: any) {
    console.error('Error creating lesson:', error);
    return errorResponse(error.message || 'فشل في إنشاء الدرس', 500);
  }
}
