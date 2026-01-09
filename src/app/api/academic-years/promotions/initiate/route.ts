import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

/**
 * Initiate student promotion process
 * POST /api/academic-years/promotions/initiate
 * Sends messages to all parents asking about their children's results
 * Only accessible by Director
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

    const { academicYearId } = await req.json();

    if (!academicYearId) {
      return NextResponse.json({ error: 'معرف السنة الدراسية مطلوب' }, { status: 400 });
    }

    // Get current academic year
    const academicYear = await prisma.academicYear.findUnique({
      where: { id: academicYearId }
    });

    if (!academicYear) {
      return NextResponse.json({ error: 'السنة الدراسية غير موجودة' }, { status: 404 });
    }

    // Get all students eligible for promotion (students with a level assigned)
    const students = await prisma.user.findMany({
      where: {
        role: { name: 'student' },
        userDetails: {
          levelId: { not: null }
        }
      },
      include: {
        userDetails: {
          include: {
            level: {
              include: { stage: true }
            }
          }
        },
        parentLinks: {
          include: {
            parent: true
          }
        }
      }
    });

    let messagesCreated = 0;
    let promotionsCreated = 0;
    let studentAlertsSent = 0;

    for (const student of students) {
      const currentLevel = student.userDetails?.level;

      if (!currentLevel) continue;

      // Check if promotion already exists
      const existingPromotion = await prisma.studentPromotion.findUnique({
        where: {
          academicYearId_studentId: {
            academicYearId,
            studentId: student.id
          }
        }
      });

      if (existingPromotion) continue;

      // Determine parent (take the first one if available)
      const parent = student.parentLinks[0]?.parent;

      if (!parent) {
        // Student has no parent linked - Send alert to student
        await prisma.message.create({
          data: {
            senderId: session.user.id,
            recipientId: student.id,
            subject: '⚠️ تنبيه هام: ربط حساب ولي الأمر مطلوب للترقية',
            content: `
<div style="direction: rtl; text-align: right; font-family: Arial, sans-serif;">
  <p>عزيزي الطالب <strong>${student.firstName}</strong>،</p>
  <p>نود إعلامك بأن عملية الترقية للسنة الدراسية القادمة قد بدأت.</p>
  <p style="color: #e11d48; font-weight: bold;">
    لإتمام عملية الترقية، يجب عليك ربط حسابك بحساب ولي أمرك في أقرب وقت ممكن.
  </p>
  <p>يرجى الطلب من ولي أمرك إنشاء حساب واستخدام كود الربط الخاص بك، أو تزويد الإدارة ببيانات ولي الأمر.</p>
  <p>تحياتنا،<br/>إدارة المدرسة</p>
</div>
            `.trim()
          }
        });

        await prisma.notification.create({
          data: {
            userId: student.id,
            title: '⚠️ ربط ولي الأمر مطلوب',
            message: 'يجب ربط حسابك بولي الأمر لإتمام عملية الترقية السنوية.',
            type: 'system_alert'
          }
        });
        
        studentAlertsSent++;
        continue; // Skip promotion creation
      }

      // Find next level
      const nextLevel = await prisma.level.findFirst({
        where: {
          stageId: currentLevel.stageId,
          displayOrder: currentLevel.displayOrder + 1
        }
      });

      // Create promotion record
      const promotion = await prisma.studentPromotion.create({
        data: {
          academicYearId,
          studentId: student.id,
          parentId: parent.id,
          fromLevelId: currentLevel.id,
          toLevelId: nextLevel?.id || null,
          status: 'pending'
        }
      });

      promotionsCreated++;

      // Send message to parent
      const studentName = `${student.firstName} ${student.lastName}`;
      const levelName = currentLevel.name;
      const nextLevelName = nextLevel?.name || 'نهاية المرحلة';

      const message = await prisma.message.create({
        data: {
          senderId: session.user.id,
          recipientId: parent.id,
          subject: `📚 استفسار عن نتائج ${studentName} - السنة الدراسية ${academicYear.name}`,
          content: `
<div style="direction: rtl; text-align: right; padding: 20px; font-family: Arial, sans-serif;">
  <h2 style="color: #3F51B5;">السلام عليكم ورحمة الله وبركاته 🌟</h2>
  
  <p>عزيزي ولي الأمر،</p>
  
  <p>نأمل أن تكونوا بخير. نحن في منصة SmartEdu نهتم بمتابعة مسيرة أبنائنا الطلاب التعليمية.</p>
  
  <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <p><strong>الطالب/ة:</strong> ${studentName}</p>
    <p><strong>المستوى الحالي:</strong> ${levelName}</p>
    <p><strong>المستوى التالي:</strong> ${nextLevelName}</p>
  </div>
  
  <p style="font-size: 18px; font-weight: bold; color: #2196F3;">
    🎓 هل نجح/ت ${studentName} في الانتقال إلى ${nextLevelName}؟
  </p>
  
  <p>يرجى الرد على هذه الرسالة بـ:</p>
  <ul>
    <li><strong>"نعم"</strong> - إذا نجح الطالب وانتقل إلى المستوى الأعلى</li>
    <li><strong>"لا"</strong> - إذا سيعيد الطالب نفس المستوى</li>
  </ul>
  
  <p style="color: #666; font-size: 14px; margin-top: 20px;">
    ملاحظة: سيتم تحديث بيانات الطالب تلقائياً بناءً على إجابتك.
  </p>
  
  <p>شكراً لتعاونكم 💙</p>
  
  <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
  
  <p style="color: #999; font-size: 12px;">
    منصة SmartEdu - ${new Date().toLocaleDateString('ar')}
  </p>
</div>
          `.trim()
        }
      });

      messagesCreated++;

      // Update promotion with message ID
      await prisma.studentPromotion.update({
        where: { id: promotion.id },
        data: {
          messageId: message.id,
          notifiedAt: new Date()
        }
      });

      // Create notification for parent
      await prisma.notification.create({
        data: {
          userId: parent.id,
          title: '📚 استفسار عن نتائج ابنك/ابنتك',
          message: `يرجى الرد على الرسالة الخاصة بنتائج ${studentName}`,
          type: 'message_received',
          relatedId: message.id
        }
      });
    }

    await logger.system.warning(`Promotion process initiated for ${promotionsCreated} students`, {
      academicYearId,
      userId: session.user.id,
      messagesCreated,
      promotionsCreated
    });

    return NextResponse.json({
      success: true,
      message: `تم إرسال ${messagesCreated} رسالة لأولياء الأمور، وتنبيه ${studentAlertsSent} طالب لعدم وجود ولي أمر.`,
      stats: {
        messagesCreated,
        promotionsCreated,
        studentAlertsSent
      }
    });

  } catch (error: any) {
    console.error('Promotion initiation error:', error);
    return NextResponse.json(
      { error: 'فشل في بدء عملية الترقية' },
      { status: 500 }
    );
  }
}
