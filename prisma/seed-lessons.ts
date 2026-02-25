import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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
      where: { 
        OR: [
          { name: { contains: 'الصف 1' } },
          { name: { contains: 'الصف الأول' } }
        ]
      },
    });

    // الحصول على مستوى أولى متوسط
    const level1Middle = await prisma.level.findFirst({
      where: { name: { contains: 'أولى متوسط' } },
    });

    if (!mathSubject || !arabicSubject) {
      console.error('❌ لم يتم العثور على المواد الأساسية');
      if (!mathSubject) console.error('   - المادة: الرياضيات (مفقودة)');
      if (!arabicSubject) console.error('   - المادة: اللغة العربية (مفقودة)');
      return;
    }

    if (!level && !level1Middle) {
        console.error('❌ لم يتم العثور على أي مستويات (ابتدائي أو متوسط)');
        console.error('   - المستوى: الصف الأول/1 (مفقود)');
        const allLevels = await prisma.level.findMany();
        console.log('   📋 المستويات الموجودة في قاعدة البيانات:', allLevels.map(l => `"${l.name}"`).join(', '));
        return;
    }

    console.log('📚 إنشاء الدروس...');

    if (level) {
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

      console.log('✅ تم إنشاء 7 تمارين (دروس تجريبية)');
    } else {
      console.log('⚠️ تم تخطي دروس المرحلة الابتدائية (الصف الأول) لعدم توفر المستوى.');
    }

    // ============================================================
    // درس جديد: الكسور العشرية (أولى متوسط)
    // ============================================================
    
    // 1. تجهيز الأستاذ المحدد للدرس
    const mathTeacherEmail = 'Math.teacher.1cem@smartedu.com';
    let mathTeacher = await prisma.user.findUnique({ where: { email: mathTeacherEmail } });

    if (!mathTeacher) {
        console.log(`👤 إنشاء حساب الأستاذ: ${mathTeacherEmail}`);
        const teacherRole = await prisma.role.findFirst({ where: { name: 'teacher' } });
        if (teacherRole) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            mathTeacher = await prisma.user.create({
                data: {
                    email: mathTeacherEmail,
                    firstName: 'أستاذ',
                    lastName: 'الرياضيات',
                    password: hashedPassword,
                    roleId: teacherRole.id,
                    userDetails: {
                        create: { teacherCode: 'MATH1CEM' }
                    }
                }
            });
        }
    }
    
    const authorId = mathTeacher ? mathTeacher.id : teacher.id;

    if (level1Middle) {
      console.log('📘 إنشاء درس الكسور العشرية (أولى متوسط)...');
      
      const decimalLesson = await prisma.lesson.create({
        data: {
          title: 'الكسور العشرية (الأجزاء من 10، 100، 1000)',
          content: `
<h1>الكسور العشرية</h1>
<p>الكسر العشري هو كسر مقامه 10، 100، 1000، إلخ.</p>
<h2>أمثلة:</h2>
<ul>
  <li>3/10 = 0.3 (ثلاثة أجزاء من عشرة)</li>
  <li>25/100 = 0.25 (خمسة وعشرون جزءاً من مئة)</li>
</ul>
<p>يمكن كتابة الكسر العشري على شكل عدد عشري بالفاصلة.</p>
          `,
          subjectId: mathSubject.id,
          levelId: level1Middle.id,
          authorId: authorId, // استخدام معرف الأستاذ المحدد
          type: 'public',
          status: 'approved',
        }
      });

      // 🟢 المستوى الأول: تمارين سهلة (1 – 5)
      
      // تمرين 1
      await prisma.exercise.create({
        data: {
          lessonId: decimalLesson.id,
          type: 'support_with_results',
          questionRichContent: '<p><strong>التمرين 01:</strong> حوّل الكسور التالية إلى أعداد عشرية:</p>',
          expectedResults: JSON.stringify([
            { question: "3/10", result: "0.3" },
            { question: "7/10", result: "0.7" },
            { question: "9/10", result: "0.9" },
            { question: "1/10", result: "0.1" }
          ]),
          displayOrder: 1,
          maxScore: 4,
        }
      });

      // تمرين 2
      await prisma.exercise.create({
        data: {
          lessonId: decimalLesson.id,
          type: 'support_with_results',
          questionRichContent: '<p><strong>التمرين 02:</strong> حوّل الكسور التالية إلى أعداد عشرية:</p>',
          expectedResults: JSON.stringify([
            { question: "25/100", result: "0.25" },
            { question: "47/100", result: "0.47" },
            { question: "83/100", result: "0.83" },
            { question: "5/100", result: "0.05" }
          ]),
          displayOrder: 2,
          maxScore: 4,
        }
      });

      // تمرين 3
      await prisma.exercise.create({
        data: {
          lessonId: decimalLesson.id,
          type: 'support_with_results',
          questionRichContent: '<p><strong>التمرين 03:</strong> حوّل الأعداد العشرية التالية إلى كسور (مثال: 4/10):</p>',
          expectedResults: JSON.stringify([
            { question: "0.4", result: "4/10" },
            { question: "0.6", result: "6/10" },
            { question: "0.9", result: "9/10" },
            { question: "0.2", result: "2/10" }
          ]),
          displayOrder: 3,
          maxScore: 4,
        }
      });

      // تمرين 4
      await prisma.exercise.create({
        data: {
          lessonId: decimalLesson.id,
          type: 'support_with_results',
          questionRichContent: '<p><strong>التمرين 04:</strong> حوّل الأعداد العشرية التالية إلى كسور (مثال: 25/100):</p>',
          expectedResults: JSON.stringify([
            { question: "0.25", result: "25/100" },
            { question: "0.37", result: "37/100" },
            { question: "0.81", result: "81/100" },
            { question: "0.09", result: "9/100" }
          ]),
          displayOrder: 4,
          maxScore: 4,
        }
      });

      // تمرين 5
      await prisma.exercise.create({
        data: {
          lessonId: decimalLesson.id,
          type: 'support_with_results',
          questionRichContent: '<p><strong>التمرين 05:</strong> اكتب الأعداد التالية بالكلمات:</p>',
          expectedResults: JSON.stringify([
            { question: "0.3", result: "ثلاثة أجزاء من عشرة" },
            { question: "0.7", result: "سبعة أجزاء من عشرة" },
            { question: "0.5", result: "خمسة أجزاء من عشرة" },
            { question: "0.1", result: "جزء من عشرة" }
          ]),
          displayOrder: 5,
          maxScore: 4,
        }
      });

      // 🟡 المستوى الثاني: تمارين متوسطة (6 – 12)

      // تمرين 6
      await prisma.exercise.create({
        data: {
          lessonId: decimalLesson.id,
          type: 'support_with_results',
          questionRichContent: '<p><strong>التمرين 06:</strong> أكمل الجدول (حول إلى عدد عشري):</p>',
          expectedResults: JSON.stringify([
            { question: "3/100", result: "0.03" },
            { question: "3/10", result: "0.3" },
            { question: "7/1000", result: "0.007" },
            { question: "45/100", result: "0.45" },
            { question: "8/1000", result: "0.008" }
          ]),
          displayOrder: 6,
          maxScore: 5,
        }
      });

      // تمرين 7
      await prisma.exercise.create({
        data: {
          lessonId: decimalLesson.id,
          type: 'support_with_results',
          questionRichContent: '<p><strong>التمرين 07:</strong> أكمل الفراغ بالعدد المناسب:</p>',
          expectedResults: JSON.stringify([
            { question: "0.8 = ؟ / 10", result: "8" },
            { question: "0.8 = ؟ / 100", result: "80" },
            { question: "0.08 = ؟ / 100", result: "8" },
            { question: "0.35 = 35 / ؟", result: "100" },
            { question: "0.125 = 125 / ؟", result: "1000" }
          ]),
          displayOrder: 7,
          maxScore: 5,
        }
      });

      // تمرين 8
      await prisma.exercise.create({
        data: {
          lessonId: decimalLesson.id,
          type: 'support_with_results',
          questionRichContent: '<p><strong>التمرين 08:</strong> رتّب الأعداد التالية من الأصغر إلى الأكبر (افصل بينها بفاصلة):</p>',
          expectedResults: JSON.stringify([
            { question: "0.5 – 0.3 – 0.8 – 0.1", result: "0.1, 0.3, 0.5, 0.8" },
            { question: "0.25 – 0.5 – 0.75 – 0.1", result: "0.1, 0.25, 0.5, 0.75" },
            { question: "0.125 – 0.25 – 0.5 – 0.05", result: "0.05, 0.125, 0.25, 0.5" }
          ]),
          displayOrder: 8,
          maxScore: 3,
        }
      });

      // تمرين 9
      await prisma.exercise.create({
        data: {
          lessonId: decimalLesson.id,
          type: 'support_with_results',
          questionRichContent: '<p><strong>التمرين 09:</strong> رتّب الأعداد التالية من الأكبر إلى الأصغر (افصل بينها بفاصلة):</p>',
          expectedResults: JSON.stringify([
            { question: "0.9 – 0.45 – 0.7 – 0.65", result: "0.9, 0.7, 0.65, 0.45" },
            { question: "1.2 – 1.09 – 1.5 – 1.05", result: "1.5, 1.2, 1.09, 1.05" },
            { question: "0.375 – 0.5 – 0.25 – 0.75", result: "0.75, 0.5, 0.375, 0.25" }
          ]),
          displayOrder: 9,
          maxScore: 3,
        }
      });

      // تمرين 10
      await prisma.exercise.create({
        data: {
          lessonId: decimalLesson.id,
          type: 'support_with_results',
          questionRichContent: '<p><strong>التمرين 10:</strong> ضع الرمز المناسب (< أو > أو =):</p>',
          expectedResults: JSON.stringify([
            { question: "0.7 ؟ 0.5", result: ">" },
            { question: "0.25 ؟ 0.3", result: "<" },
            { question: "0.75 ؟ 0.8", result: "<" },
            { question: "0.09 ؟ 0.1", result: "<" },
            { question: "0.125 ؟ 0.13", result: "<" },
            { question: "1.5 ؟ 1.50", result: "=" }
          ]),
          displayOrder: 10,
          maxScore: 6,
        }
      });

      // تمرين 11
      await prisma.exercise.create({
        data: {
          lessonId: decimalLesson.id,
          type: 'support_with_results',
          questionRichContent: '<p><strong>التمرين 11:</strong> اكتب الكسر بعد الاختزال (مثال: 1/2):</p>',
          expectedResults: JSON.stringify([
            { question: "0.5", result: "1/2" },
            { question: "0.25", result: "1/4" },
            { question: "0.75", result: "3/4" },
            { question: "0.2", result: "1/5" },
            { question: "0.125", result: "1/8" }
          ]),
          displayOrder: 11,
          maxScore: 5,
        }
      });

      // تمرين 12
      await prisma.exercise.create({
        data: {
          lessonId: decimalLesson.id,
          type: 'support_with_results',
          questionRichContent: '<p><strong>التمرين 12:</strong> اقرأ الأعداد العشرية (اكتبها بالكلمات):</p>',
          expectedResults: JSON.stringify([
            { question: "0.45", result: "خمسة وأربعون جزءاً من مئة" },
            { question: "0.08", result: "ثمانية أجزاء من مئة" },
            { question: "2.5", result: "اثنان ونصف" },
            { question: "3.75", result: "ثلاثة وخمسة وسبعون جزءاً من مئة" },
            { question: "1.05", result: "واحد وخمسة أجزاء من مئة" },
            { question: "0.007", result: "سبعة أجزاء من ألف" }
          ]),
          displayOrder: 12,
          maxScore: 6,
        }
      });

      // 🔴 المستوى الثالث: تمارين متقدمة (13 – 17)

      // تمرين 13
      await prisma.exercise.create({
        data: {
          lessonId: decimalLesson.id,
          type: 'support_with_results',
          questionRichContent: '<p><strong>التمرين 13:</strong> أكمل المتسلسلات (اكتب العدد التالي فقط):</p>',
          expectedResults: JSON.stringify([
            { question: "0.1 – 0.2 – 0.3 – 0.4", result: "0.5" },
            { question: "0.25 – 0.5 – 0.75 – 1", result: "1.25" },
            { question: "0.1 – 0.3 – 0.5 – 0.7", result: "0.9" },
            { question: "0.01 – 0.02 – 0.03 – 0.04", result: "0.05" },
            { question: "0.125 – 0.25 – 0.375 – 0.5", result: "0.625" }
          ]),
          displayOrder: 13,
          maxScore: 5,
        }
      });

      // تمرين 14
      await prisma.exercise.create({
        data: {
          lessonId: decimalLesson.id,
          type: 'support_with_results',
          questionRichContent: '<p><strong>التمرين 14:</strong> رتب الكسور التالية تصاعدياً بعد تحويلها ذهنياً (اكتب الكسور مرتبة مفصولة بفاصلة):</p>',
          expectedResults: JSON.stringify([
            { question: "3/10, 75/100, 4/10, 8/100", result: "8/100, 3/10, 4/10, 75/100" },
            { question: "25/100, 1/10, 5/100, 5/10", result: "5/100, 1/10, 25/100, 5/10" },
            { question: "125/1000, 25/100, 3/10, 5/100", result: "5/100, 125/1000, 25/100, 3/10" }
          ]),
          displayOrder: 14,
          maxScore: 3,
        }
      });

      // تمرين 15
      await prisma.exercise.create({
        data: {
          lessonId: decimalLesson.id,
          type: 'support_with_results',
          questionRichContent: '<p><strong>التمرين 15:</strong> أوجد العدد المجهول:</p>',
          expectedResults: JSON.stringify([
            { question: "0.5 + ؟ = 1", result: "0.5" },
            { question: "؟ + 0.25 = 1", result: "0.75" },
            { question: "0.75 – ؟ = 0.25", result: "0.5" },
            { question: "؟ – 0.3 = 0.5", result: "0.8" },
            { question: "0.125 × 4 = ؟", result: "0.5" }
          ]),
          displayOrder: 15,
          maxScore: 5,
        }
      });

      // تمرين 16 (Main Exercise - AI Grading)
      await prisma.exercise.create({
        data: {
          lessonId: decimalLesson.id,
          type: 'main',
          questionRichContent: `
<p><strong>التمرين 16: مسائل بسيطة</strong></p>
<ol>
  <li>طول قلم 0.15 متر، وطول مسطرة 0.3 متر. كم يزيد طول المسطرة على القلم؟</li>
  <li>اشترى محمد 0.75 كيلوغرام تفاح، واشترت أختاه 0.5 كيلوغرام. من اشترى أكثر؟</li>
  <li>قطعة قماش طولها 2.5 متر، قصصنا منها 1.25 متر. كم بقي؟</li>
  <li>زجاجة فيها 1.5 لتر من الحليب، شربنا 0.75 لتر. كم بقي؟</li>
</ol>
          `,
          modelAnswer: `
<ol>
  <li>الفرق = 0.3 - 0.15 = 0.15 متر.</li>
  <li>محمد اشترى 0.75 كغ، أخته 0.50 كغ. بما أن 0.75 > 0.50، فإن محمد اشترى أكثر.</li>
  <li>الباقي = 2.5 - 1.25 = 1.25 متر.</li>
  <li>الباقي = 1.5 - 0.75 = 0.75 لتر.</li>
</ol>
          `,
          displayOrder: 16,
          maxScore: 10,
          allowRetry: true,
          maxAttempts: 3,
        }
      });

      // تمرين 17
      await prisma.exercise.create({
        data: {
          lessonId: decimalLesson.id,
          type: 'support_with_results',
          questionRichContent: '<p><strong>التمرين 17:</strong> أيها الأكبر؟ (اكتب العدد الأكبر أو "=" إذا تساويا):</p>',
          expectedResults: JSON.stringify([
            { question: "0.3 أم 0.30؟", result: "=" },
            { question: "0.5 أم 0.50؟", result: "=" },
            { question: "0.25 أم 0.3؟", result: "0.3" },
            { question: "0.125 أم 0.13؟", result: "0.13" },
            { question: "1.4 أم 1.40؟", result: "=" }
          ]),
          displayOrder: 17,
          maxScore: 5,
        }
      });

      // ⚫ المستوى الرابع: تحديات (18 – 20)

      // تمرين 18
      await prisma.exercise.create({
        data: {
          lessonId: decimalLesson.id,
          type: 'support_with_results',
          questionRichContent: '<p><strong>التمرين 18:</strong> سر الأعداد المفقودة (اكتب العدد العشري):</p>',
          expectedResults: JSON.stringify([
            { question: "جزء صحيح 3، وجزء عشري 25 من مئة", result: "3.25" },
            { question: "جزء صحيح 0، وجزء عشري 75 من مئة", result: "0.75" },
            { question: "جزء صحيح 2، وجزء عشري 5 من عشرة", result: "2.5" },
            { question: "جزء صحيح 1، وجزء عشري 125 من ألف", result: "1.125" },
            { question: "جزء صحيح 0، وجزء عشري 7 من ألف", result: "0.007" }
          ]),
          displayOrder: 18,
          maxScore: 5,
        }
      });

      // تمرين 19
      await prisma.exercise.create({
        data: {
          lessonId: decimalLesson.id,
          type: 'support_with_results',
          questionRichContent: '<p><strong>التمرين 19:</strong> أحجية الكسور (أكمل الفراغ الناقص):</p>',
          expectedResults: JSON.stringify([
            { question: "0.25 = ؟/100", result: "25" },
            { question: "0.75 = 3/؟", result: "4" },
            { question: "0.2 = ؟/10", result: "2" },
            { question: "0.125 = 1/؟", result: "8" },
            { question: "0.4 = 2/؟", result: "5" }
          ]),
          displayOrder: 19,
          maxScore: 5,
        }
      });

      // تمرين 20 (Main Exercise - AI Grading)
      await prisma.exercise.create({
        data: {
          lessonId: decimalLesson.id,
          type: 'main',
          questionRichContent: `
<p><strong>التمرين 20: وضعية إدماجية (مسألة حياتية) 🏆</strong></p>
<p>ذهبت عائلة مكونة من 4 أفراد إلى مطعم. طلبوا:</p>
<ul>
  <li>شوربة: 2.50 دينار</li>
  <li>دجاج: 5.75 دينار</li>
  <li>سلطة: 1.25 دينار</li>
  <li>عصير: 1.50 دينار</li>
  <li>ماء: 0.75 دينار</li>
</ul>
<p><strong>المطلوب:</strong></p>
<ol>
  <li>احسب المجموع الكلي للفاتورة.</li>
  <li>إذا دفع الأب 15 ديناراً، فكم يرجع له الباقي؟</li>
  <li>أرادوا تقسيم باقي المبلغ بالتساوي على الأبناء الأربعة. كم يأخذ كل ابن؟</li>
</ol>
          `,
          modelAnswer: `
<ol>
  <li><strong>المجموع الكلي:</strong> 2.50 + 5.75 + 1.25 + 1.50 + 0.75 = 11.75 دينار.</li>
  <li><strong>الباقي:</strong> 15 - 11.75 = 3.25 دينار.</li>
  <li><strong>نصيب كل ابن:</strong> 3.25 ÷ 4 = 0.8125 دينار.</li>
</ol>
          `,
          displayOrder: 20,
          maxScore: 10,
          allowRetry: true,
          maxAttempts: 3,
        }
      });

      console.log('✅ تم إنشاء درس الكسور العشرية و 20 تمريناً بنجاح');
    }

    // ============================================================
    // درس جديد: التربية الإسلامية (أولى متوسط)
    // ============================================================
    const islamicSubject = await prisma.subject.findFirst({
      where: { name: { contains: 'التربية الإسلامية' } },
    });

    if (islamicSubject && level1Middle) {
      console.log('📘 إنشاء درس التربية الإسلامية (أولى متوسط)...');
      
      const islamicLesson = await prisma.lesson.create({
        data: {
          title: 'أركان الإيمان',
          content: `
<h1>أركان الإيمان</h1>
<p>الإيمان هو التصديق الجازم بوجود الله وملائكتة وكتبه ورسله واليوم الآخر والقدر خيره وشره.</p>
<h2>أركان الإيمان الستة:</h2>
<ul>
  <li><strong>الإيمان بالله:</strong> هو الاعتقاد الجازم بوجود الله تعالى وأنه رب كل شيء ومليكه.</li>
  <li><strong>الإيمان بالملائكة:</strong> التصديق بوجود مخلوقات نورانية لا يعصون الله ما أمرهم.</li>
  <li><strong>الإيمان بالكتب:</strong> التصديق بالكتب السماوية التي أنزلها الله على رسله.</li>
  <li><strong>الإيمان بالرسل:</strong> التصديق بجميع الرسل والأنبياء الذين بعثهم الله.</li>
  <li><strong>الإيمان باليوم الآخر:</strong> التصديق بيوم القيامة والبعث والحساب.</li>
  <li><strong>الإيمان بالقدر:</strong> الرضا بقضاء الله وقدره خيره وشره.</li>
</ul>
          `,
          subjectId: islamicSubject.id,
          levelId: level1Middle.id,
          authorId: authorId,
          type: 'public',
          status: 'approved',
        }
      });

      // تمرين 1: دعم مع نتائج
      await prisma.exercise.create({
        data: {
          lessonId: islamicLesson.id,
          type: 'support_with_results',
          questionRichContent: '<p><strong>التمرين 01:</strong> أكمل الفراغ: عدد أركان الإيمان هو ......</p>',
          expectedResults: JSON.stringify([
            { question: "عدد الأركان", result: "6" }
          ]),
          displayOrder: 1,
          maxScore: 5,
        }
      });

      // تمرين 2: رئيسي
      await prisma.exercise.create({
        data: {
          lessonId: islamicLesson.id,
          type: 'main',
          questionRichContent: `
<p><strong>التمرين 02:</strong></p>
<p>عرف الإيمان بالملائكة، واذكر اسم ملكين من الملائكة ووظيفة كل منهما.</p>
          `,
          modelAnswer: `
<p><strong>الإيمان بالملائكة:</strong> هو التصديق الجازم بوجود مخلوقات نورانية خلقها الله لعبادته وتنفيذ أوامره.</p>
<p><strong>أمثلة:</strong></p>
<ul>
<li><strong>جبريل عليه السلام:</strong> الموكل بالوحي.</li>
<li><strong>ميكائيل عليه السلام:</strong> الموكل بالقطر (المطر).</li>
</ul>
          `,
          displayOrder: 2,
          maxScore: 10,
          allowRetry: true,
          maxAttempts: 3,
        }
      });

      console.log('✅ تم إنشاء درس التربية الإسلامية وتمارينه بنجاح');
    } else {
       if (!islamicSubject) console.log('⚠️ لم يتم العثور على مادة التربية الإسلامية');
    }

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
