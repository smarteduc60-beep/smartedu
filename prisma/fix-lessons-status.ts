import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🛠️ إصلاح حالة الدروس (status -> approved, published -> true)...');

  // تحديث الدروس التي حالتها 'published' لتصبح 'approved' وتعيين published=true
  const updateResult = await prisma.lesson.updateMany({
    where: {
      status: 'published'
    },
    data: {
      status: 'approved',
      published: true
    }
  });

  console.log(`✅ تم تحديث ${updateResult.count} درس لتصبح حالتها "approved" ومنشورة (published=true).`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
