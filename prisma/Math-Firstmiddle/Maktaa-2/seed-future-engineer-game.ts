import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding "Future Engineers" game lesson...');

  const teacher = await prisma.user.findUnique({
    where: { email: 'ladj14013@gmail.com' },
  });

  if (!teacher) {
    console.error('Teacher with email ladj14013@gmail.com not found.');
    return;
  }

  const subject = await prisma.subject.findFirst({
    where: { name: 'الرياضيات' },
  });

  const level = await prisma.level.findFirst({
    where: { name: 'أولى متوسط' },
  });

  if (!subject || !level) {
    console.error('Subject "الرياضيات" or Level "أولى متوسط" not found.');
    return;
  }

  const gameConfig: Prisma.JsonObject = {
    type: 'MATCHING_GAME',
    title: 'لعبة مهندسو المستقبل: مطابقة الأشكال الهندسية',
    description: 'صل كل شكل هندسي بالتعريف الصحيح له.',
    pairs: [
      { id: '1', question: 'المربع', answer: 'رباعي أضلاعه متقايسة وزواياه قائمة.' },
      { id: '2', question: 'المستطيل', answer: 'رباعي له أربع زوايا قائمة وكل ضلعين متقابلين متقايسان.' },
      { id: '3', question: 'المعين', answer: 'رباعي أضلاعه الأربعة متقايسة.' },
      { id: '4', question: 'المثلث القائم', answer: 'مثلث له زاوية قائمة (90 درجة).' },
      { id: '5', question: 'الدائرة', answer: 'مجموعة من النقاط التي تبعد نفس المسافة عن نقطة ثابتة تسمى المركز.' },
      { id: '6', question: 'متوازي الأضلاع', answer: 'رباعي فيه كل ضلعين متقابلين متوازيان.' },
    ],
  };

  const lesson = await prisma.lesson.create({
    data: {
      title: 'لعبة مهندسو المستقبل',
      content: 'لعبة تفاعلية لتعلم خصائص الأشكال الهندسية الأساسية.',
      authorId: teacher.id,
      subjectId: subject.id,
      levelId: level.id,
      type: 'public',
      status: 'approved',
      contentType: 'GAME',
      gameConfig: gameConfig,
      isLocked: false,
      lessonFileIds: '[]', // إضافة الحقل المفقود
    },
  });

  console.log(`✅ Created "Future Engineers" game lesson with ID: ${lesson.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });