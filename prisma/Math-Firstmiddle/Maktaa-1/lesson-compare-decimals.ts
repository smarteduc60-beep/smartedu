import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding Lesson: Comparing Decimals...');

  // 1. Fetch the Teacher
  const teacherEmail = 'ladj14013@gmail.com';
  const teacher = await prisma.user.findUnique({
    where: { email: teacherEmail },
    include: { userDetails: true }
  });

  if (!teacher || !teacher.userDetails?.subjectId) {
    console.error(`❌ Teacher ${teacherEmail} not found or has no subject. Please run 'prisma/seed-math-1cem.ts' first.`);
    process.exit(1);
  }

  // 2. Fetch Level (1CEM)
  const level = await prisma.level.findFirst({
    where: { name: 'أولى متوسط' }
  });

  if (!level) {
    console.error('❌ Level "أولى متوسط" not found. Please run the base seed.');
    process.exit(1);
  }

  // 3. Prepare Content
  const lessonContent = `
    <h3 style="color: #2563eb;">🔢 ماذا تعني المقارنة؟</h3>
    <p>المقارنة تعني أن نحدد أي العددين أكبر وأيهما أصغر، أو هل هما متساويان.</p>

    <div style="background-color: #f0f9ff; padding: 15px; border-radius: 10px; margin: 15px 0;">
      <h4 style="text-align: center; margin-bottom: 10px;">رموز المقارنة</h4>
      <table border="1" cellpadding="10" style="border-collapse: collapse; width: 80%; margin: auto; text-align: center;">
        <tr style="background-color: #e0f2fe;"><th>الرمز</th><th>معناه</th><th>مثال</th></tr>
        <tr><td>&gt;</td><td>أصغر من</td><td><spa dir="ltr">3 &lt; 5</span></td></tr>
        <tr><td>&lt;</td><td>أكبر من</td><td><spa dir="ltr">4 &gt; 2</span></td></tr>
        <tr><td>=</td><td>يساوي</td><td>7 = 7</td></tr>
      </table>
    </div>

    <h3 style="color: #2563eb;">🧩 مما يتكون العدد العشري؟</h3>
    <div style="display: flex; justify-content: center; margin: 20px 0;">
      <div style="background-color: #e8f5e8; padding: 20px; border-radius: 10px; text-align: center; width: 80%;">
        <span style="font-size: 2em; font-weight: bold;">12<span style="color: red;">,</span>75</span>
        <div style="display: flex; justify-content: space-around; margin-top: 10px; gap: 10px;">
        <div style="background-color: #2196F3; color: white; padding: 10px; border-radius: 5px; width: 45%;"><strong>75 الجزء العشري</strong></div>
          <div style="background-color: #4CAF50; color: white; padding: 10px; border-radius: 5px; width: 45%;"><strong>12 الجزء الصحيح</strong></div>
        </div>
      </div>
    </div>

    <h3 style="color: #16a34a;">📋 خطوات مقارنة عددين عشريين</h3>
    <div style="background-color: #e6f7ff; padding: 20px; border-radius: 10px; margin: 15px 0;">
      <p>🥇 <strong>الخطوة 1:</strong> قارن الجزء الصحيح أولاً. العدد الذي جزؤه الصحيح أكبر هو الأكبر.</p>
      <p>🥈 <strong>الخطوة 2:</strong> إذا تساوى الجزء الصحيح، نقارن الجزء العشري خانة بخانة من اليسار إلى اليمين.</p>
      <p>🥉 <strong>الخطوة 3:</strong> إذا اختلف عدد الخانات العشرية، نضيف أصفاراً إلى يمين العدد الذي خاناته أقل حتى يتساوى الطول.</p>
    </div>

    <h3 style="color: #d97706;">✅ أمثلة محلولة خطوة بخطوة</h3>
    
    <div style="background-color: #f6f6f6; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
      <p><strong>📌 المثال 1:</strong> قارن بين 15,3 و 12,8</p>
      <p>الخطوة 1: نقارن الجزء الصحيح → 12 أصغر من 15.</p>
      <p>النتيجة: <strong style="color: red; font-size: 1.2em;">15,3 &gt; 12,8</strong></p>
    </div>

    <div style="background-color: #f6f6f6; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
      <p><strong>📌 المثال 2:</strong> قارن بين 7,25 و 7,3</p>
      <p>الخطوة 1: الجزء الصحيح متساو (7 = 7).</p>
      <p>الخطوة 2: نوحد عدد الخانات العشرية بإضافة صفر: 7,3 → 7,30.</p>
      <p>الخطوة 3: نقارن الأعشار (أول رقم بعد الفاصلة): 2 أصغر من 3.</p>
      <p>النتيجة: <strong style="color: red; font-size: 1.2em;">7,3 &gt; 7,25</strong></p>
    </div>

    <div style="background-color: #f6f6f6; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
      <p><strong>📌 المثال 3:</strong> قارن بين 0,5 و 0,50</p>
      <p>الخطوة 1: الجزء الصحيح متساو (0 = 0).</p>
      <p>الخطوة 2: الأعشار متساوية (5 = 5).</p>
      <p>الخطوة 3: نضيف صفرًا لـ 0,5 فتصبح 0,50. نجد أن العددين متطابقان.</p>
      <p>النتيجة: <strong style="color: red; font-size: 1.2em;">0,5 = 0,50</strong> (الأصفار على يمين الجزء العشري لا تغير قيمة العدد).</p>
    </div>

    <div style="background-color: #f6f6f6; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
      <p><strong>📌 المثال 4:</strong> قارن بين 4,127 و 4,13</p>
      <p>الخطوة 1: الجزء الصحيح متساو (4 = 4).</p>
      <p>الخطوة 2: نوحد الخانات: 4,130 → 4,13.</p>
      <p>الخطوة 3: نقارن الأعشار (1 = 1)، ثم أجزاء المئة (<span dir="ltr">2 &lt; 3)</span>.</p>
      <p>النتيجة: <strong style="color: red; font-size: 1.2em;"><span dir="ltr">4,127 &lt; 4,13</span></strong></p>
    </div>

    <h3 style="color: #9333ea;">📏 ترتيب الأعداد العشرية</h3>
    <p><strong>الترتيب التصاعدي:</strong> من الأصغر إلى الأكبر (مثل صعود السلم).</p>
    <p><strong>الترتيب التنازلي:</strong> من الأكبر إلى الأصغر (مثل نزول السلم).</p>
    <div style="background-color: #fff3e0; padding: 15px; border-radius: 10px; margin: 15px 0;">
      <p><strong>مثال:</strong> رتب الأعداد تصاعدياً: 3,2 - 2,8 - 3,15 - 2,75</p>
      <p><strong>الحل:</strong></p>
      <ol>
        <li>نوحد عدد الخانات لكل عدد عشري: 3,20 - 2,80 - 3,15 - 2,75.</li>
        <li>نقارن الأجزاء الصحيحة: (2,80 و 2,75) أصغر من (3,20 و 3,15).</li>
        <li>نرتب مجموعة الـ 2: <span dir="ltr">2,75 &lt; 2,80</span>.</li>
        <li>نرتب مجموعة الـ 3: <span dir="ltr">3,15 &lt; 3,20</span>.</li>
      </ol>
      <p><strong>الترتيب النهائي:</strong><span  dir="ltr"> 2,75 &lt; 2,8 &lt; 3,15 &lt; 3,2</span></p>
    </div>

    <div style="background-color: #d4edda; padding: 20px; border-radius: 10px; text-align: center; font-size: 1.2em; border: 2px solid #28a745;">
      <p><strong>تذكر دائماً:</strong></p>
      <p>1. قارن الجزء الصحيح أولاً.</p>
      <p>2. إذا تساوى، قارن الجزء العشري خانة بخانة من اليسار.</p>
      <p>3. أضف أصفاراً لتوحيد عدد الخانات عند الحاجة.</p>
    </div>
  `;

  // 4. Create Lesson
  const lesson = await prisma.lesson.create({
    data: {
      title: 'مقارنة عددين عشريين وترتيب أعداد عشرية',
      content: lessonContent,
      subjectId: teacher.userDetails!.subjectId!,
      levelId: level.id,
      authorId: teacher.id,
      status: 'published',
      type: 'public',
      exercises: {
        create: [
          // 🟢 تمارين الدعم (70%)
          {
            type: 'support_with_results',
            question: 'التمرين 01: ضع الرمز المناسب (> أو < أو =):\n1) 5,3 ... 3,9\n2) 12,7 ... 12,9\n3) 4,25 ... 4,3\n4) 0,8 ... 0,80\n5) 6,02 ... 6,019\n6) 7,4 ... 7,40',
            expectedResults: [
              { question: "1", result: ">", tolerance: 0 },
              { question: "2", result: "<", tolerance: 0 },
              { question: "3", result: "<", tolerance: 0 },
              { question: "4", result: "=", tolerance: 0 },
              { question: "5", result: ">", tolerance: 0 },
              { question: "6", result: "=", tolerance: 0 }
            ],
            displayOrder: 1,
            maxScore: 6
          },
          {
            type: 'support_with_results',
            question: 'التمرين 02: قارن بين الأعداد التالية:\n1) 15,3 ... 15,03\n2) 0,5 ... 0,05\n3) 2,37 ... 2,370\n4) 8,01 ... 8,009\n5) 3,14 ... 3,141',
            expectedResults: [
              { question: "1", result: ">", tolerance: 0 },
              { question: "2", result: ">", tolerance: 0 },
              { question: "3", result: "=", tolerance: 0 },
              { question: "4", result: ">", tolerance: 0 },
              { question: "5", result: "<", tolerance: 0 }
            ],
            displayOrder: 2,
            maxScore: 5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 03: رتب الأعداد تصاعدياً (من الأصغر إلى الأكبر) وافصل بينها بـ " < ":\nالمجموعة 1: 4,2 - 3,8 - 4,15 - 3,75',
            expectedResults: [
              { question: "1", result: "3,75 < 3,8 < 4,15 < 4,2", tolerance: 0 }
            ],
            displayOrder: 3,
            maxScore: 4
          },
          {
            type: 'support_with_results',
            question: 'التمرين 04: رتب الأعداد تنازلياً (من الأكبر إلى الأصغر) وافصل بينها بـ " > ":\nالمجموعة 1: 12,3 - 12,03 - 12,33 - 12',
            expectedResults: [
              { question: "1", result: "12,33 > 12,3 > 12,03 > 12", tolerance: 0 }
            ],
            displayOrder: 4,
            maxScore: 4
          },
          {
            type: 'support_with_results',
            question: 'التمرين 05: اختر العدد الأكبر في كل زوج:\n1) 7,8 أو 7,75\n2) 0,3 أو 0,29\n3) 5,02 أو 5,2\n4) 1,5 أو 1,50',
            expectedResults: [
              { question: "1", result: "7,8", tolerance: 0 },
              { question: "2", result: "0,3", tolerance: 0 },
              { question: "3", result: "5,2", tolerance: 0 },
              { question: "4", result: "متساويان", tolerance: 0 }
            ],
            displayOrder: 5,
            maxScore: 4
          },
          {
            type: 'support_with_results',
            question: 'التمرين 06: أكمل بعدد مناسب (اكتب أي عدد صحيح يجعل المقارنة صحيحة):\n1) 3,5 > 3,...\n2) 2,4 < 2,...',
            expectedResults: [
              { question: "1", result: "4", tolerance: 0 }, // Any digit from 0-4 works
              { question: "2", result: "5", tolerance: 0 }  // Any digit from 5-9 works
            ],
            displayOrder: 6,
            maxScore: 2
          },
          {
            type: 'support_with_results',
            question: 'التمرين 07: صحح الخطأ في المقارنات التالية:\n1) 4,3 < 4,25\n2) 0,7 = 0,07',
            expectedResults: [
              { question: "1", result: "4,3 > 4,25", tolerance: 0 },
              { question: "2", result: "0,7 > 0,07", tolerance: 0 }
            ],
            displayOrder: 7,
            maxScore: 2
          },
          // 🔴 التمارين الرئيسية (30%)
          {
            type: 'main',
            question: 'التمرين 08: مسألة أطوال أقلام\nقياس أطوال 5 أقلام بالسنتمترات: القلم أ: 12,5 cm، القلم ب: 12,25 cm، القلم ج: 13 cm، القلم د: 12,75 cm، القلم هـ: 12,5 cm.\n1) رتب الأقلام تصاعدياً حسب الطول.\n2) ما هو أطول قلم؟\n3) ما هو أقصر قلم؟\n4) هل هناك أقلام متساوية في الطول؟',
            modelAnswer: '1) الترتيب التصاعدي: ب (12,25) < أ (12,5) = هـ (12,5) < د (12,75) < ج (13).\n2) أطول قلم هو القلم ج.\n3) أقصر قلم هو القلم ب.\n4) نعم، القلم أ والقلم هـ متساويان في الطول.',
            displayOrder: 8,
            maxScore: 5
          },
          {
            type: 'main',
            question: 'التمرين 09: مسألة درجات الحرارة\nدرجات الحرارة المسجلة في 5 مدن: أ: 24,5°، ب: 23,8°، ج: 25,2°، د: 24,15°، هـ: 23,75°.\n1) رتب المدن تنازلياً حسب درجة الحرارة.\n2) ما هي المدينة الأكثر حرارة؟\n3) ما هي المدينة الأقل حرارة؟\n4) كم الفرق بين أعلى وأقل درجة؟',
            modelAnswer: '1) الترتيب التنازلي: ج > أ > د > ب > هـ.\n2) المدينة الأكثر حرارة هي المدينة ج (25,2°).\n3) المدينة الأقل حرارة هي المدينة هـ (23,75°).\n4) الفرق = 25,2 - 23,75 = 1,45 درجة.',
            displayOrder: 9,
            maxScore: 5
          },
          {
            type: 'main',
            question: 'التمرين 10: مسألة نتائج مسابقة\nفي مسابقة للقفز العالي، حقق 5 متسابقين النتائج التالية (بالأمتار): أحمد: 1,75 m، سارة: 1,8 m، محمد: 1,68 m، فاطمة: 1,72 m، عمر: 1,85 m.\n1) من هو الفائز بالمركز الأول؟\n2) رتب المتسابقين على منصة التتويج (الذهب، الفضة، البرونز).',
            modelAnswer: '1) الفائز بالمركز الأول هو عمر لأنه حقق أعلى قفزة (1,85 م).\n2) منصة التتويج:\n- المركز الأول (الذهب): عمر (1,85 م)\n- المركز الثاني (الفضة): سارة (1,8 م)\n- المركز الثالث (البرونز): أحمد (1,75 م)',
            displayOrder: 10,
            maxScore: 5
          }
        ]
      }
    }
  });

  console.log(`✅ Lesson created successfully: ${lesson.title} (ID: ${lesson.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });