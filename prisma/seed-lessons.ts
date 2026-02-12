import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 بدء إنشاء دروس وتمارين تجريبية...');

  try {
    // الحصول على المعلم
    const teacher = await prisma.user.findFirst({
      where: { 
        role: {
          name: 'teacher'
        }
      },
    });

    if (!teacher) {
      console.error('❌ لم يتم العثور على معلم');
      return;
    }

    // الحصول على مواد ومستويات
    const mathSubject = await prisma.subject.findFirst({
      where: { name: 'الرياضيات' },
    });

    const arabicSubject = await prisma.subject.findFirst({
      where: { name: 'اللغة العربية' },
    });

    const level = await prisma.level.findFirst({
      where: { name: { contains: 'الصف 1' } },
    });

    if (!mathSubject || !arabicSubject || !level) {
      console.error('❌ لم يتم العثور على المواد أو المستويات');
      return;
    }

    console.log('📚 إنشاء الدروس...');

    // درس 1: الجمع
    const lesson1 = await prisma.lesson.create({
      data: {
        title: 'مقدمة في الجمع',
        content: `
# مقدمة في الجمع

## ما هو الجمع؟
الجمع هو عملية حسابية نستخدمها لحساب المجموع الكلي لعددين أو أكثر.

## الرمز
نستخدم رمز (+) للجمع

## أمثلة:
- 2 + 3 = 5
- 5 + 4 = 9
- 10 + 15 = 25

## قواعد الجمع:
1. الجمع تبديلي: 3 + 5 = 5 + 3
2. الجمع تجميعي: (2 + 3) + 4 = 2 + (3 + 4)
        `,
        videoUrl: 'https://www.youtube.com/watch?v=example1',
        subjectId: mathSubject.id,
        levelId: level.id,
        authorId: teacher.id,
        type: 'public',
        status: 'approved',
      },
    });

    // درس 2: الطرح
    const lesson2 = await prisma.lesson.create({
      data: {
        title: 'مقدمة في الطرح',
        content: `
# مقدمة في الطرح

## ما هو الطرح؟
الطرح هو عملية حسابية نستخدمها لإيجاد الفرق بين عددين.

## الرمز
نستخدم رمز (-) للطرح

## أمثلة:
- 5 - 2 = 3
- 10 - 4 = 6
- 20 - 8 = 12

## قواعد الطرح:
1. الطرح ليس تبديلياً: 5 - 3 ≠ 3 - 5
2. طرح الصفر لا يغير العدد: 5 - 0 = 5
        `,
        subjectId: mathSubject.id,
        levelId: level.id,
        authorId: teacher.id,
        type: 'public',
        status: 'approved',
      },
    });

    // درس 3: الحروف العربية
    const lesson3 = await prisma.lesson.create({
      data: {
        title: 'الحروف الهجائية',
        content: `
# الحروف الهجائية

## الحروف العربية
اللغة العربية تحتوي على 28 حرفاً

## الحروف:
أ - ب - ت - ث - ج - ح - خ - د - ذ - ر - ز - س - ش - ص - ض - ط - ظ - ع - غ - ف - ق - ك - ل - م - ن - هـ - و - ي

## أشكال الحروف:
- في بداية الكلمة
- في وسط الكلمة  
- في نهاية الكلمة
- منفصلة
        `,
        subjectId: arabicSubject.id,
        levelId: level.id,
        authorId: teacher.id,
        type: 'public',
        status: 'approved',
      },
    });

    console.log(`✅ تم إنشاء ${3} دروس`);

    console.log('📝 إنشاء التمارين...');

    // تمارين للدرس 1 (الجمع)
    await prisma.exercise.create({
      data: {
        lessonId: lesson1.id,
        question: 'احسب ناتج: 5 + 3 = ؟',
        modelAnswer: '8',
        displayOrder: 1,
      },
    });

    await prisma.exercise.create({
      data: {
        lessonId: lesson1.id,
        question: 'احسب ناتج: 12 + 7 = ؟',
        modelAnswer: '19',
        displayOrder: 2,
      },
    });

    await prisma.exercise.create({
      data: {
        lessonId: lesson1.id,
        question: 'ما هو مجموع: 25 + 15 = ؟',
        modelAnswer: '40',
        displayOrder: 3,
      },
    });

    // تمارين للدرس 2 (الطرح)
    await prisma.exercise.create({
      data: {
        lessonId: lesson2.id,
        question: 'احسب ناتج: 10 - 4 = ؟',
        modelAnswer: '6',
        displayOrder: 1,
      },
    });

    await prisma.exercise.create({
      data: {
        lessonId: lesson2.id,
        question: 'احسب ناتج: 20 - 8 = ؟',
        modelAnswer: '12',
        displayOrder: 2,
      },
    });

    // تمارين للدرس 3 (الحروف)
    await prisma.exercise.create({
      data: {
        lessonId: lesson3.id,
        question: 'كم عدد الحروف في اللغة العربية؟',
        modelAnswer: '28 حرفاً',
        displayOrder: 1,
      },
    });

    await prisma.exercise.create({
      data: {
        lessonId: lesson3.id,
        question: 'اكتب أول خمسة حروف من الأبجدية العربية',
        modelAnswer: 'أ - ب - ت - ث - ج',
        displayOrder: 2,
      },
    });

    console.log('✅ تم إنشاء 7 تمارين');

    console.log('\n✅ تم إنشاء البيانات التجريبية بنجاح!');
    console.log(`\n📊 الملخص:`);
    console.log(`   - 3 دروس (2 رياضيات + 1 لغة عربية)`);
    console.log(`   - 7 تمارين`);
    console.log(`   - المعلم: ${teacher.firstName} ${teacher.lastName}`);

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
