import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'Math.teacher.1cem@smartedu.com';
  console.log(`🔄 جاري إصلاح حالة الدروس للمعلم: ${email}...`);

  const teacher = await prisma.user.findUnique({
    where: { email },
  });

  if (!teacher) {
    console.error('❌ المعلم غير موجود!');
    return;
  }

  // تحديث الدروس من 'published' إلى 'approved'
  const result = await prisma.lesson.updateMany({
    where: { 
      authorId: teacher.id,
      status: 'published' 
    },
    data: { 
      status: 'approved' 
    }
  });

  console.log(`✅ تم تحديث ${result.count} درس من حالة 'published' إلى 'approved'.`);
  
  // التحقق من النتيجة
  const count = await prisma.lesson.count({
    where: { 
      authorId: teacher.id,
      status: 'approved'
    }
  });
  console.log(`📊 إجمالي الدروس المعتمدة (approved) الآن: ${count}`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());