import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🏝️  بدء إضافة درس لعبة جزيرة الأعداد...');

  // 1. البحث عن المعلم والمادة والمستوى
  const teacher = await prisma.user.findUnique({
    where: { email: 'ladj14013@gmail.com' },
    include: { userDetails: true },
  });

  if (!teacher || !teacher.userDetails?.subjectId) {
    console.error('❌ لم يتم العثور على المعلم. تأكد من وجوده في قاعدة البيانات.');
    return;
  }

  const subjectId = teacher.userDetails.subjectId;
  const levelId = teacher.userDetails.levelId;
  const lessonTitle = 'مغامرة جزيرة الأعداد';

  const subject = await prisma.subject.findFirst({
    where: { name: 'الرياضيات' },
  });

  const level = await prisma.level.findFirst({
    where: { name: 'أولى متوسط' },
  });

  if (!levelId) {
    console.error('❌ لم يتم العثور على المادة أو المستوى. تأكد من وجود "الرياضيات" و "أولى متوسط".');
    return;
  }

  // 2. إعدادات اللعبة
  const gameConfig = {
    type: 'ISLAND',
    // لا توجد بيانات إضافية مطلوبة لهذه اللعبة لأنها مدمجة
  };

  // حذف الدرس القديم لتجنب التكرار
  await prisma.lesson.deleteMany({
    where: {
      title: lessonTitle,
      authorId: teacher.id,
    },
  });

  // 3. إنشاء الدرس
  const gameLesson = await prisma.lesson.create({
    data: {
      title: lessonTitle,
      content: 'لعبة تفاعلية لمراجعة أساسيات الأعداد والكسور العشرية.',
      authorId: teacher.id,
      subjectId: subjectId,
      levelId: levelId,
      type: 'public', // جعلها عامة للجميع في هذا المستوى
      status: 'approved',
      published: true,
      contentType: 'GAME', // تحديد نوع المحتوى كلعبة
      gameConfig: gameConfig, // إضافة إعدادات اللعبة
      lessonFileIds: '[]', // تأكد من أن هذا الحقل موجود وليس null
    },
  });

  console.log(`✅ تم إنشاء درس اللعبة بنجاح!`);
  console.log(`   - عنوان الدرس: ${gameLesson.title}`);
  console.log(`   - ID الدرس: ${gameLesson.id}`);
  console.log(`   - يمكنك الآن الوصول إليه من قائمة الدروس.`);
}

main()
  .catch((e) => {
    console.error('❌ خطأ في إضافة درس اللعبة:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });