import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'Math.teacher.1cem@smartedu.com';
  console.log(`🔍 تشخيص إحصائيات المستخدم: ${email}`);

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      role: true,
      userDetails: true
    }
  });

  if (!user) {
    console.error('❌ المستخدم غير موجود في قاعدة البيانات!');
    return;
  }

  console.log(`✅ المستخدم موجود. ID: ${user.id}`);
  console.log(`👤 الاسم: ${user.firstName} ${user.lastName}`);
  console.log(`🔑 الدور: ${user.role.name}`);

  // 1. التحقق من عدد الدروس المباشر
  const directLessonCount = await prisma.lesson.count({
    where: { authorId: user.id }
  });
  console.log(`📚 عدد الدروس (Direct Count): ${directLessonCount}`);

  if (directLessonCount > 0) {
    const sampleLesson = await prisma.lesson.findFirst({
      where: { authorId: user.id },
      select: { id: true, title: true, subjectId: true, levelId: true }
    });
    console.log(`   - مثال على درس: "${sampleLesson?.title}" (Subject: ${sampleLesson?.subjectId}, Level: ${sampleLesson?.levelId})`);
  }

  // 2. التحقق من عدد التمارين (عبر الدروس)
  const lessons = await prisma.lesson.findMany({
    where: { authorId: user.id },
    select: { id: true }
  });
  const lessonIds = lessons.map(l => l.id);
  
  const exercisesCount = await prisma.exercise.count({
    where: { lessonId: { in: lessonIds } }
  });
  console.log(`✏️ عدد التمارين المرتبطة بدروسه: ${exercisesCount}`);

  // 3. محاكاة استعلام API (GroupBy) للتأكد من أنه يعمل كما هو متوقع
  const groupByResult = await prisma.lesson.groupBy({
    by: ['authorId'],
    _count: { id: true },
    where: { authorId: { in: [user.id] } }
  });

  console.log('📊 نتيجة استعلام التجميع (GroupBy Simulation):');
  console.dir(groupByResult, { depth: null });
}

main()
  .catch((e) => {
    console.error('❌ حدث خطأ أثناء التشخيص:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });