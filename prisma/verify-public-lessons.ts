import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 بدء التحقق من الدروس العامة، مشرفي المواد، والتلاميذ...\n');

  try {
    // 1. جلب جميع الدروس العامة
    const publicLessons = await prisma.lesson.findMany({
      where: { type: 'public' },
      include: {
        subject: true,
        level: true,
        author: { // المشرف
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (publicLessons.length === 0) {
      console.log('❌ لا توجد دروس عامة في قاعدة البيانات.');
      return;
    }

    console.log(`✅ تم العثور على ${publicLessons.length} دروس عامة:\n`);

    // 2. لكل درس، جلب الطلاب المعنيين
    for (const lesson of publicLessons) {
      console.log(`📚 الدرس: ${lesson.title} (المادة: ${lesson.subject?.name || 'غير محدد'}, المستوى: ${lesson.level?.name || 'غير محدد'})`);
      console.log(`   👤 المشرف: ${lesson.author?.firstName} ${lesson.author?.lastName} (${lesson.author?.email})`);

      // جلب الطلاب الذين هم في نفس مستوى الدرس
      const students = await prisma.user.findMany({
        where: {
          role: { name: 'student' },
          userDetails: { levelId: lesson.levelId },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      });

      if (students.length > 0) {
        console.log(`   👨‍🎓 التلاميذ المعنيون (${students.length}):`);
        students.forEach((student) => {
          console.log(`     - ${student.firstName} ${student.lastName} (${student.email})`);
        });
      } else {
        console.log('   ⚠️ لا يوجد تلاميذ في هذا المستوى');
      }
      console.log('\n-----------------------------------\n');
    }

  } catch (error) {
    console.error('❌ حدث خطأ أثناء التشغيل:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('❌ خطأ:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });