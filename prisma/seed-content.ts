import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 بدء ملء المحتوى التعليمي...');

  try {
    // 1. إنشاء المراحل
    console.log('📝 إنشاء المراحل...');
    const primaryStage = await prisma.stage.create({
      data: {
        name: 'المرحلة الابتدائية',
        displayOrder: 1,
      },
    });

    const middleStage = await prisma.stage.create({
      data: {
        name: 'المرحلة المتوسطة',
        displayOrder: 2,
      },
    });

    const secondaryStage = await prisma.stage.create({
      data: {
        name: 'المرحلة الثانوية',
        displayOrder: 3,
      },
    });

    console.log('✅ تم إنشاء 3 مراحل');

    // 2. إنشاء المستويات
    console.log('📚 إنشاء المستويات...');
    const levels = [];
    
    // مستويات المرحلة الابتدائية
    for (let i = 1; i <= 6; i++) {
      const level = await prisma.level.create({
        data: {
          name: `الصف ${i} ابتدائي`,
          stageId: primaryStage.id,
          displayOrder: i,
        },
      });
      levels.push(level);
    }

    // مستويات المرحلة المتوسطة
    for (let i = 1; i <= 3; i++) {
      const level = await prisma.level.create({
        data: {
          name: `الصف ${i} متوسط`,
          stageId: middleStage.id,
          displayOrder: i,
        },
      });
      levels.push(level);
    }

    // مستويات المرحلة الثانوية
    for (let i = 1; i <= 3; i++) {
      const level = await prisma.level.create({
        data: {
          name: `الصف ${i} ثانوي`,
          stageId: secondaryStage.id,
          displayOrder: i,
        },
      });
      levels.push(level);
    }

    console.log(`✅ تم إنشاء ${levels.length} مستوى`);

    // 3. إنشاء المواد
    console.log('📖 إنشاء المواد...');
    const subjects = [
      { name: 'الرياضيات', stageId: primaryStage.id },
      { name: 'اللغة العربية', stageId: primaryStage.id },
      { name: 'العلوم', stageId: primaryStage.id },
      { name: 'الفيزياء', stageId: secondaryStage.id },
      { name: 'الكيمياء', stageId: secondaryStage.id },
      { name: 'الأحياء', stageId: secondaryStage.id },
    ];

    for (const subject of subjects) {
      await prisma.subject.create({
        data: subject,
      });
    }

    console.log(`✅ تم إنشاء ${subjects.length} مادة`);

    console.log('\n✅ تم ملء المحتوى التعليمي بنجاح!');
  } catch (error) {
    console.error('❌ خطأ:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
