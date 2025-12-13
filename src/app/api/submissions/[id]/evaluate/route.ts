import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Helper function to notify parent
async function notifyParent(prisma: PrismaClient, studentId: string, submissionId: number) {
  try {
    // Get parent link
    const parentLink = await prisma.parentChildLink.findFirst({
      where: { childId: studentId },
      select: { parentId: true },
    });

    if (parentLink) {
      // Get submission details
      const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
        include: {
          exercise: {
            include: {
              lesson: {
                include: { subject: true },
              },
            },
          },
          student: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      if (submission) {
        const score = Number(submission.finalScore || submission.aiScore || 0);
        const maxScore = Number(submission.exercise.maxScore || 20);
        const percentage = Math.round((score / maxScore) * 100);
        const studentName = `${submission.student.firstName} ${submission.student.lastName}`;
        const subjectName = submission.exercise.lesson.subject.name;
        const lessonTitle = submission.exercise.lesson.title;

        let message = '';
        if (percentage >= 80) {
          message = `🎉 أحسنت! حصل ${studentName} على ${score}/${maxScore} (${percentage}%) في ${subjectName} - ${lessonTitle}`;
        } else if (percentage >= 60) {
          message = `✅ حصل ${studentName} على ${score}/${maxScore} (${percentage}%) في ${subjectName} - ${lessonTitle}`;
        } else {
          message = `⚠️ يحتاج ${studentName} إلى مزيد من التدريب. حصل على ${score}/${maxScore} (${percentage}%) في ${subjectName} - ${lessonTitle}`;
        }

        // Create notification (you can extend this to send email/SMS later)
        await prisma.notification.create({
          data: {
            userId: parentLink.parentId,
            title: 'نتيجة جديدة',
            message,
            type: 'submission_graded',
            relatedId: submissionId,
            isRead: false,
          },
        });
      }
    }
  } catch (error) {
    console.error('Error notifying parent:', error);
    // Don't throw - notification failure shouldn't break the main flow
  }
}
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';

// POST /api/submissions/[id]/evaluate - تقييم الإجابة بالذكاء الاصطناعي
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const submissionId = parseInt(id);

    console.log('🔍 Evaluating submission ID:', submissionId);

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        exercise: {
          select: {
            id: true,
            question: true,
            modelAnswer: true,
            maxScore: true,
          },
        },
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    console.log('📄 Submission found:', submission ? 'Yes' : 'No');
    
    if (!submission) {
      return errorResponse('الإجابة غير موجودة', 404);
    }

    // التحقق من الصلاحيات
    if (session.user.role === 'student' && submission.studentId !== session.user.id) {
      return errorResponse('غير مصرح بالوصول', 403);
    }

    // التقييم بالذكاء الاصطناعي
    // TODO: استدعاء AI للتقييم الفعلي
    const feedback = `تقييم تلقائي:\n\n` +
      `لقد قمت بحل التمرين. ` +
      `\n\nملاحظات:\n` +
      `- حاول شرح إجابتك بشكل أوضح.\n` +
      `- راجع الدرس للتأكد من فهمك الكامل للموضوع.\n` +
      `- قارن إجابتك مع الإجابة النموذجية أعلاه.`;

    // حساب الدرجة (بشكل عشوائي للآن - سيتم استبداله بـ AI)
    const maxScoreValue = submission.exercise.maxScore ? parseFloat(submission.exercise.maxScore.toString()) : 20;
    const calculatedScore = Math.floor(Math.random() * (maxScoreValue + 1));

    console.log('📊 Max score:', maxScoreValue, 'Generated score:', calculatedScore);

    // تحديث الإجابة
    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        aiScore: calculatedScore,
        finalScore: calculatedScore,
        aiFeedback: feedback,
        gradedAt: new Date(),
        status: 'graded',
      },
      include: {
        exercise: {
          select: {
            id: true,
            question: true,
            maxScore: true,
          },
        },
      },
    });

    console.log('✅ Submission updated successfully');

    // Send notification to parent
    await notifyParent(prisma, submission.studentId, submissionId);

    return successResponse(updatedSubmission, 'تم تقييم الإجابة بنجاح');
  } catch (error: any) {
    console.error('Error evaluating submission:', error);
    return errorResponse(error.message || 'فشل في تقييم الإجابة', 500);
  }
}
