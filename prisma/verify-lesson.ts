import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const lessonTitle = "مغامرة جزيرة الأعداد";
  
  console.log(`🔍 Searching for lesson: "${lessonTitle}"`);

  const lesson = await prisma.lesson.findFirst({
    where: {
      title: lessonTitle,
    },
    include: {
      author: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
      subject: true,
      level: true,
      exercises: {
        select: {
          id: true,
          type: true,
        }
      }
    },
    orderBy: {
        id: 'desc' // Get the latest one in case of duplicates
    }
  });

  if (!lesson) {
    console.error(`❌ Lesson not found in the database.`);
    return;
  }

  console.log('✅ Lesson found! Here are the details:');
  console.log('-----------------------------------------');
  console.log(`Lesson ID: ${lesson.id}`);
  console.log(`Title: ${lesson.title}`);
  console.log(`Published: ${lesson.published}`); // CRITICAL CHECK
  console.log(`Type: ${lesson.type}`);
  console.log(`Status: ${lesson.status}`);
  console.log('--- Author ---');
  console.log(`Author ID: ${lesson.author?.id}`);
  console.log(`Author Email: ${lesson.author?.email}`);
  console.log(`Author Name: ${lesson.author?.firstName} ${lesson.author?.lastName}`);
  console.log('--- Content ---');
  console.log(`Subject ID: ${lesson.subject?.id}`);
  console.log(`Subject Name: ${lesson.subject?.name}`);
  console.log(`Level ID: ${lesson.level?.id}`);
  console.log(`Level Name: ${lesson.level?.name}`);
  console.log('--- Exercises ---');
  console.log(`Exercises Count: ${lesson.exercises.length}`);
  console.log('-----------------------------------------');

  // Check if the author is the one we expect
  if (lesson.author?.email !== 'ladj14013@gmail.com') {
      console.warn(`⚠️ WARNING: The lesson author (${lesson.author?.email}) is not the expected teacher (ladj14013@gmail.com).`);
  } else {
      console.log('✅ Author email matches the expected teacher.');
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