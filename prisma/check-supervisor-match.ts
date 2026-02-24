import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'Math.teacher.1cem@smartedu.com';
  console.log(`🔍 جاري التحقق من التطابق للمستخدم: ${email}`);

  const user = await prisma.user.findUnique({
    where: { email },
    include: { userDetails: true }
  });

  if (!user) {
    console.log('❌ المستخدم غير موجود');
    return;
  }

  console.log(`👤 بيانات المستخدم (المشرف):`);
  console.log(`   - Subject ID: ${user.userDetails?.subjectId}`);
  console.log(`   - Level ID:   ${user.userDetails?.levelId}`);

  const lessons = await prisma.lesson.findMany({
    where: { authorId: user.id },
    select: { id: true, subjectId: true, levelId: true, published: true, status: true }
  });

  console.log(`📚 إجمالي الدروس المسجلة باسمه: ${lessons.length}`);
  
  if (user.userDetails?.subjectId && user.userDetails?.levelId) {
      const matchingLessons = lessons.filter(l => 
          l.subjectId === user.userDetails!.subjectId && 
          l.levelId === user.userDetails!.levelId
      );
      
      console.log(`✅ الدروس المطابقة تماماً (تظهر في اللوحة): ${matchingLessons.length}`);
      
      const publishedCount = matchingLessons.filter(l => l.published === true).length;
      console.log(`   - منشور (Published: true): ${publishedCount}`);
      console.log(`   - غير منشور (Published: false): ${matchingLessons.length - publishedCount}`);
      
      console.log(`⚠️ الدروس غير المطابقة (مخفية): ${lessons.length - matchingLessons.length}`);
  } else {
      console.log('❌ المستخدم يفتقد تحديد المادة أو المستوى في ملفه الشخصي.');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());