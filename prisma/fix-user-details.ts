import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'ladj14013@gmail.com';
  console.log(`🔍 Fixing user details for: ${email}`);

  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true }
  });

  if (!user) {
    console.error('❌ User not found.');
    return;
  }

  console.log(`👤 User found: ${user.firstName} ${user.lastName} (${user.role.name})`);

  // البحث عن المادة والمستوى
  const subject = await prisma.subject.findFirst({ where: { name: 'الرياضيات' } });
  const level = await prisma.level.findFirst({ where: { name: { contains: 'أولى متوسط' } } });

  if (!subject || !level) {
    console.error('❌ Subject or Level not found in DB.');
    return;
  }

  console.log(`📚 Linking to Subject: ${subject.name} (ID: ${subject.id})`);
  console.log(`🎓 Linking to Level: ${level.name} (ID: ${level.id})`);

  // تحديث تفاصيل المستخدم
  await prisma.userDetails.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      subjectId: subject.id,
      levelId: level.id,
      teacherCode: 'T-LADJ-MATH',
      aiEvalMode: 'auto',
    },
    update: {
      subjectId: subject.id,
      levelId: level.id,
    }
  });

  console.log('✅ User details updated successfully. The lesson should now appear in the dashboard.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });