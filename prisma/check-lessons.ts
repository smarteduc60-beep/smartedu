import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // القيم مأخوذة من السجلات التي أرسلتها (Level 5, Subject 8)
  const levelId = 5;
  const subjectId = 8;

  console.log(`🔍 تشخيص بيانات الدروس (Subject ${subjectId}, Level ${levelId})...`);

  // 1. التحقق من وجود المادة والمستوى
  const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
  const level = await prisma.level.findUnique({ where: { id: levelId } });

  console.log(`📌 المادة: ${subject ? subject.name : '❌ غير موجودة'}`);
  console.log(`📌 المستوى: ${level ? level.name : '❌ غير موجود'}`);

  // 2. البحث عن أي درس لهذه المادة والمستوى
  const lessons = await prisma.lesson.findMany({
    where: {
      levelId: levelId,
      subjectId: subjectId,
    },
    select: {
      id: true,
      title: true,
      type: true,
      status: true,
      authorId: true,
    }
  });

  if (lessons.length === 0) {
    console.log('❌ لا توجد أي دروس مسجلة لهذا المستوى والمادة.');
  } else {
    console.log(`✅ تم العثور على ${lessons.length} درس لهذا المستوى والمادة:`);
    console.table(lessons);
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