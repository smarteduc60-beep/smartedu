import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 جاري التحقق من المراحل الدراسية في قاعدة البيانات...\n');

  const stages = await prisma.stage.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  console.log(`📊 عدد المراحل الموجودة: ${stages.length}\n`);

  if (stages.length > 0) {
    console.log('✅ المراحل الموجودة:');
    stages.forEach((stage, index) => {
      console.log(`${index + 1}. ID: ${stage.id}, الاسم: "${stage.name}", الترتيب: ${stage.displayOrder}`);
    });
  } else {
    console.log('❌ لا توجد مراحل في قاعدة البيانات!');
  }

  console.log('\n-----------------------------------\n');

  // Check levels
  const levels = await prisma.level.findMany({
    orderBy: { displayOrder: 'asc' },
  });
  console.log(`📊 عدد المستويات الموجودة: ${levels.length}`);

  // Check subjects
  const subjects = await prisma.subject.findMany();
  console.log(`📊 عدد المواد الموجودة: ${subjects.length}`);

  // Check users
  const users = await prisma.user.findMany();
  console.log(`📊 عدد المستخدمين الموجودين: ${users.length}`);
}

main()
  .catch((e) => {
    console.error('❌ خطأ:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
