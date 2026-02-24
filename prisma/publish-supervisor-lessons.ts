import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'Math.teacher.1cem@smartedu.com';
  console.log(`🚀 جاري نشر جميع دروس المشرف: ${email}`);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log('❌ المستخدم غير موجود');
    return;
  }

  const result = await prisma.lesson.updateMany({
    where: { authorId: user.id },
    data: { published: true }
  });

  console.log(`✅ تم تحديث ${result.count} درس لتصبح (Published: true).`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());