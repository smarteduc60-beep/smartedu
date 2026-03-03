import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding Game Lesson: Sorting Decimal Numbers ...');

  // 1. Fetch the Teacher
  const teacherEmail = 'ladj14013@gmail.com';
  const teacher = await prisma.user.findUnique({
    where: { email: teacherEmail },
    include: { userDetails: true }
  });

  if (!teacher) {
    console.error(`❌ Teacher ${teacherEmail} not found. Please run 'prisma/seed-users.ts' first.`);
    return;
  }

  // 2. Fetch Level (1CEM)
  const level = await prisma.level.findFirst({
    where: { name: { contains: 'أولى متوسط' } }
  });

  if (!level) {
    console.error('❌ Level "أولى متوسط" not found.');
    return;
  }

  // 3. Fetch Subject
  const subjectId = teacher.userDetails?.subjectId;

  if (!subjectId) {
     console.error('❌ Teacher has no subject assigned.');
     return;
  }

  const subject = await prisma.subject.findUnique({
      where: { id: subjectId }
  });

  if (!subject) {
      console.error('❌ Subject not found.');
      return;
  }

  // 4. Define the Game Configuration
  const gameConfig = {
    type: 'SORTING',
    data: {
      items: [
        { id: 'item-1', content: '1.75', value: 1.75 },
        { id: 'item-2', content: '1.8', value: 1.8 },
        { id: 'item-3', content: '1.68', value: 1.68 },
        { id: 'item-4', content: '1.72', value: 1.72 },
        { id: 'item-5', content: '1.85', value: 1.85 }
      ],
      direction: 'asc'
    }
  };

  // 5. Create the Game Lesson
  const gameLesson = await prisma.lesson.create({
    data: {
      title: 'لعبة: ترتيب نتائج الوثب العالي',
      content: 'هذه لعبة تفاعلية لمراجعة درس مقارنة وترتيب الأعداد العشرية. قم بسحب وإفلات النتائج لترتيبها من الأصغر إلى الأكبر.',
      subjectId: subject.id,
      levelId: level.id,
      authorId: teacher.id,
      status: 'approved',
      published: true,
      type: 'public',
      contentType: 'GAME', // Set the content type to GAME
      gameConfig: gameConfig, // Add the game configuration
    }
  });

  console.log(`✅ Game Lesson created successfully: "${gameLesson.title}" (ID: ${gameLesson.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });