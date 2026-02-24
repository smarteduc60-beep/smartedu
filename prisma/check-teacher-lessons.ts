import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'Math.teacher.1cem@smartedu.com';
  console.log(`🔍 جاري التحقق من دروس المعلم: ${email}...`);

  const teacher = await prisma.user.findUnique({
    where: { email },
  });

  if (!teacher) {
    console.error('❌ المعلم غير موجود!');
    return;
  }

  console.log(`✅ تم العثور على المعلم. المعرف: ${teacher.id}`);

  const lessons = await prisma.lesson.findMany({
    where: { authorId: teacher.id },
    select: { id: true, title: true, status: true, type: true, createdAt: true }
  });

  console.log(`📊 إجمالي الدروس الموجودة: ${lessons.length}`);
  
  if (lessons.length > 0) {
    console.log('📋 عينة من الدروس (أول 5):');
    console.table(lessons.slice(0, 5));
  } else {
    console.log('⚠️ لا توجد دروس لهذا المعلم.');
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());