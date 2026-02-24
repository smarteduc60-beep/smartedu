import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'Math.teacher.1cem@smartedu.com';
  console.log(`🔍 جاري فحص وإصلاح دروس المشرف: ${email}...`);

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      role: true,
      userDetails: true
    }
  });

  if (!user) {
    console.error('❌ المستخدم غير موجود!');
    return;
  }

  console.log(`👤 المستخدم: ${user.firstName} ${user.lastName} (${user.role.name})`);

  if (!user.userDetails?.subjectId || !user.userDetails?.levelId) {
    console.error('❌ المستخدم ليس لديه مادة أو مستوى محدد في ملفه الشخصي.');
    return;
  }

  const targetSubjectId = user.userDetails.subjectId;
  const targetLevelId = user.userDetails.levelId;

  console.log(`🎯 الهدف: ربط الدروس بالمادة ID ${targetSubjectId} والمستوى ID ${targetLevelId}`);

  // تحديث جميع دروس هذا المستخدم لتطابق مادته ومستواه
  const result = await prisma.lesson.updateMany({
    where: { 
      authorId: user.id,
      // نحدث فقط الدروس التي لا تطابق
      OR: [
        { subjectId: { not: targetSubjectId } },
        { levelId: { not: targetLevelId } }
      ]
    },
    data: {
      subjectId: targetSubjectId,
      levelId: targetLevelId
    }
  });

  console.log(`✅ تم تحديث ${result.count} درس لتطابق بيانات المشرف.`);
  
  // التحقق النهائي
  const count = await prisma.lesson.count({
    where: {
      authorId: user.id,
      subjectId: targetSubjectId,
      levelId: targetLevelId
    }
  });
  
  console.log(`📊 إجمالي الدروس الصالحة للعرض الآن: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });