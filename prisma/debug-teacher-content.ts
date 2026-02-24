import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'ladj14013@gmail.com';
  console.log(`🔍 جاري فحص البيانات للمستخدم: ${email}`);

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      role: true,
      userDetails: {
        include: {
          subject: true,
          level: true
        }
      }
    }
  });

  if (!user) {
    console.log('❌ المستخدم غير موجود');
    return;
  }

  console.log(`👤 المستخدم: ${user.firstName} ${user.lastName}`);
  console.log(`   الدور: ${user.role.name}`);
  console.log(`   المادة في الملف الشخصي: ${user.userDetails?.subject?.name || 'غير محدد'} (ID: ${user.userDetails?.subjectId})`);
  console.log(`   المستوى في الملف الشخصي: ${user.userDetails?.level?.name || 'غير محدد'} (ID: ${user.userDetails?.levelId})`);

  console.log('\n📚 الدروس التي أنشأها هذا المستخدم:');
  const lessons = await prisma.lesson.findMany({
    where: { authorId: user.id },
    include: {
      subject: true,
      level: true,
      _count: {
        select: { exercises: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  if (lessons.length === 0) {
    console.log('   ❌ لا توجد دروس مسجلة باسم هذا المستخدم.');
  } else {
    console.log(`   📊 العدد الإجمالي: ${lessons.length} درس`);
    console.log('-----------------------------------');
    
    lessons.forEach(l => {
      const isSubjectMatch = l.subjectId === user.userDetails?.subjectId;
      const isLevelMatch = l.levelId === user.userDetails?.levelId;
      
      let visibility = '✅ ظاهر في اللوحة';
      const reasons = [];
      
      if (!l.published) reasons.push('غير منشور (Published=false)');
      if (!isSubjectMatch) reasons.push(`اختلاف المادة (درس: ${l.subjectId}، مستخدم: ${user.userDetails?.subjectId})`);
      if (!isLevelMatch) reasons.push(`اختلاف المستوى (درس: ${l.levelId}، مستخدم: ${user.userDetails?.levelId})`);

      if (reasons.length > 0) {
        visibility = `❌ مخفي (${reasons.join(', ')})`;
      }

      console.log(`   📌 العنوان: "${l.title}"`);
      console.log(`      المعرف: ${l.id}`);
      console.log(`      المادة: ${l.subject?.name}`);
      console.log(`      المستوى: ${l.level?.name}`);
      console.log(`      عدد التمارين: ${l._count.exercises}`);
      console.log(`      الحالة: ${visibility}`);
      console.log('-----------------------------------');
    });
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());