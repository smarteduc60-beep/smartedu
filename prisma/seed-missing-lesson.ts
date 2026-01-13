import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // القيم بناءً على تشخيصك السابق
  const levelId = 5;   // ثالثة متوسط
  const subjectId = 8; // العلوم الفيزيائية

  console.log(`🌱 جاري إنشاء درس عام تجريبي (المادة: ${subjectId}, المستوى: ${levelId})...`);

  // البحث عن مؤلف (مدير أو معلم) لربط الدرس به
  const author = await prisma.user.findFirst({
    where: {
      role: {
        name: { in: ['directeur', 'teacher', 'supervisor_specific'] }
      }
    }
  });

  if (!author) {
    console.error('❌ لم يتم العثور على مستخدم مناسب ليكون مؤلف الدرس (مدير أو معلم).');
    return;
  }

  const lesson = await prisma.lesson.create({
    data: {
      title: 'مقدمة في العلوم الفيزيائية (درس تجريبي)',
      content: '<h1>مرحباً بك</h1><p>هذا درس عام تجريبي للتأكد من ظهور الدروس للطلاب.</p>',
      subjectId: subjectId,
      levelId: levelId,
      authorId: author.id,
      type: 'public',
      status: 'approved',
      isLocked: false
    }
  });

  console.log(`✅ تم إنشاء الدرس بنجاح!`);
  console.log(`   ID: ${lesson.id}`);
  console.log(`   العنوان: ${lesson.title}`);
  console.log(`   النوع: ${lesson.type}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });