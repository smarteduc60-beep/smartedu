import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'ladj14013@gmail.com';
  console.log(`🔧 جاري إصلاح ظهور الدروس للمستخدم: ${email}`);

  const user = await prisma.user.findUnique({
    where: { email },
    include: { userDetails: true }
  });

  if (!user) {
    console.error('❌ المستخدم غير موجود');
    return;
  }

  // 1. تحديد معرف المادة الصحيح (رياضيات المتوسط)
  // بناءً على تقرير التشخيص، الدروس المخفية تستخدم ID 4
  const targetSubjectId = 4; 

  console.log(`✅ المادة المستهدفة للإصلاح: ID ${targetSubjectId}`);

  // 2. تحديث ملف المعلم ليتطابق مع مادة الدروس (المتوسط)
  if (user.userDetails?.subjectId !== targetSubjectId) {
      console.log(`🔄 تحديث مادة المعلم من ${user.userDetails?.subjectId} إلى ${targetSubjectId}...`);
      await prisma.userDetails.update({
          where: { userId: user.id },
          data: { subjectId: targetSubjectId }
      });
  } else {
      console.log('✅ ملف المعلم مطابق للمادة الصحيحة.');
  }

  // 3. نشر جميع دروس المعلم وتوحيد المادة والمستوى
  // هذا سيصلح الدروس القديمة التي قد تكون مرتبطة بمستويات أو مواد خاطئة
  const result = await prisma.lesson.updateMany({
      where: { 
          authorId: user.id,
          // لا نضع شرطًا على المستوى هنا لنصلح جميع الدروس
      },
      data: { 
          published: true,       // نشر الدرس
          subjectId: targetSubjectId, // تصحيح المادة لتتطابق مع المعلم
          levelId: user.userDetails?.levelId // تصحيح المستوى ليتطابق مع المعلم
      }
  });

  console.log(`✨ تم تحديث وإظهار ${result.count} درس بنجاح!`);
  console.log('🎉 يمكنك الآن تحديث صفحة لوحة التحكم لرؤية الدروس.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });