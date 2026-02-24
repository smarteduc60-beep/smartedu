import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const lessonTitle = 'إنشاء مستقيم يشمل نقطة ويوازي مستقيمًا - مستقيم يشمل نقطة ويعامد مستقيمًا + مصطلحات وترميزات';
  
  console.log(`🔍 البحث عن الدرس: "${lessonTitle}"...`);

  const lessons = await prisma.lesson.findMany({
    where: { title: lessonTitle },
    include: { author: true },
    orderBy: { createdAt: 'desc' }
  });

  if (lessons.length === 0) {
    console.log('❌ لم يتم العثور على الدرس.');
  } else {
    console.log(`✅ تم العثور على ${lessons.length} نسخة من الدرس.`);
    lessons.forEach((l, i) => {
      console.log(`\n--- نسخة ${i + 1} (ID: ${l.id}) ---`);
      console.log(`📅 تم الإنشاء: ${l.createdAt}`);
      console.log(`👤 المعلم: ${l.author?.firstName} ${l.author?.lastName}`);
      console.log(`📧 البريد الإلكتروني: ${l.author?.email}`);
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });