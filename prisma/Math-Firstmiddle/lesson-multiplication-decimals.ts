import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding Lesson: Multiplication by 0.1, 0.01, 0.001 ...');

  // 1. Fetch the Teacher
  const teacherEmail = 'ladj14013@gmail.com';
  const teacher = await prisma.user.findUnique({
    where: { email: teacherEmail },
    include: { userDetails: true }
  });

  if (!teacher) {
    console.error(`❌ Teacher ${teacherEmail} not found. Please run 'prisma/seed-math-1cem.ts' first.`);
    process.exit(1);
  }

  if (!teacher.userDetails?.subjectId) {
    console.error(`❌ Teacher ${teacherEmail} has no subject assigned.`);
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

  // 3. Prepare Content (HTML formatted for Rich Text Editor)
  const lessonContent = `
    <h3 style="color: #2563eb;">🔍 اكتشاف: ماذا يعني الضرب في 0,1؟</h3>
    <p>عندما نضرب عدداً في 0,1، فهذا يعني أننا نأخذ <strong>عُشر</strong> هذا العدد فقط.</p>

    <h4 style="color: #d97706;">🖍️ مثال حياتي:</h4>
    <p>إذا كان معي 20 ديناراً، وأخذت 0,1 منه (أي عُشره)، فكم آخذ؟</p>

    <div style="background-color: #f0f9ff; padding: 15px; border-radius: 10px; text-align: center; margin: 15px 0; border: 1px solid #bae6fd;">
      <p style="font-size: 1.2em; font-weight: bold;">20 ديناراً</p>
      <p>⬇️ أخذ العُشر ⬇️</p>
      <p style="font-size: 1.2em; font-weight: bold; color: #0284c7;">2 ديناران</p>
    </div>
    <p>إذن: <strong>20 × 0,1 = 2</strong></p>

    <h3 style="color: #2563eb;">📊 جدول المعاني</h3>
    <table border="1" cellpadding="10" style="border-collapse: collapse; width: 100%; border: 2px solid #e5e7eb;">
      <thead>
        <tr style="background-color: #f3f4f6;">
          <th>الكسر</th>
          <th>كتابة عشرية</th>
          <th>معناه</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1/10</td>
          <td>0,1</td>
          <td>عُشر الوحدة</td>
        </tr>
        <tr>
          <td>1/100</td>
          <td>0,01</td>
          <td>جزء من مئة</td>
        </tr>
        <tr>
          <td>1/1000</td>
          <td>0,001</td>
          <td>جزء من ألف</td>
        </tr>
      </tbody>
    </table>

    <h3 style="color: #d97706;">💡 القاعدة الذهبية</h3>
    <p>الضرب في 0,1 أو 0,01 أو 0,001 يعني <strong>القسمة على 10 أو 100 أو 1000</strong>.</p>
    <ul style="background-color: #fffbeb; padding: 15px; border-radius: 8px; border: 1px solid #fcd34d;">
      <li><strong>× 0,1</strong> تعني <strong>÷ 10</strong> (مثال: 5 × 0,1 = 5 ÷ 10 = 0,5)</li>
      <li><strong>× 0,01</strong> تعني <strong>÷ 100</strong> (مثال: 5 × 0,01 = 5 ÷ 100 = 0,05)</li>
      <li><strong>× 0,001</strong> تعني <strong>÷ 1000</strong> (مثال: 5 × 0,001 = 5 ÷ 1000 = 0,005)</li>
    </ul>

    <h3 style="color: #9333ea;">🧮 قاعدة تحريك الفاصلة</h3>
    <p>عند الضرب في 0,1 أو 0,01 أو 0,001، نحرك الفاصلة إلى <strong>اليسار</strong> بعدد من الخانات يساوي عدد الأصفار.</p>

    <div style="background-color: #e6f7ff; padding: 20px; border-radius: 10px; border-right: 5px solid #1890ff;">
      <p>📍 <strong>الضرب في 0,1</strong> (عدد به صفر واحد) ← نحرك الفاصلة <strong>رقمًا واحدًا</strong> إلى اليسار</p>
      <p>📍 <strong>الضرب في 0,01</strong> (عدد به صفران) ← نحرك الفاصلة <strong>رقمين</strong> إلى اليسار</p>
      <p>📍 <strong>الضرب في 0,001</strong> (عدد به ثلاثة أصفار) ← نحرك الفاصلة <strong>ثلاثة أرقام</strong> إلى اليسار</p>
    </div>

    <h3 style="color: #16a34a;">✅ أمثلة محلولة خطوة بخطوة</h3>
    
    <div style="background-color: #f6f6f6; padding: 15px; border-radius: 10px; margin-bottom: 10px;">
      <p><strong>📌 المثال 1:</strong> 34 × 0,1 = ؟</p>
      <p>العدد الأصلي: 34 (هو 34,0)</p>
      <p>نحرك الفاصلة رقمًا واحدًا لليسار ← <strong>3,4</strong></p>
    </div>

    <div style="background-color: #f6f6f6; padding: 15px; border-radius: 10px; margin-bottom: 10px;">
      <p><strong>📌 المثال 2:</strong> 5 × 0,01 = ؟</p>
      <p>العدد الأصلي: 5 (هو 5,00)</p>
      <p>نحرك الفاصلة رقمين لليسار ← <strong>0,05</strong></p>
    </div>

    <div style="background-color: #f6f6f6; padding: 15px; border-radius: 10px; margin-bottom: 10px;">
      <p><strong>📌 المثال 3:</strong> 120 × 0,001 = ؟</p>
      <p>العدد الأصلي: 120 (هو 120,000)</p>
      <p>نحرك الفاصلة ثلاثة أرقام لليسار ← <strong>0,12</strong></p>
    </div>

    <h3 style="color: #059669;">🎯 جدول خلاصة</h3>
    <table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%; text-align: center;">
      <tr style="background-color: #ecfdf5;"><th>العدد</th><th>× 0,1</th><th>× 0,01</th><th>× 0,001</th></tr>
      <tr><td>7</td><td>0,7</td><td>0,07</td><td>0,007</td></tr>
      <tr><td>25</td><td>2,5</td><td>0,25</td><td>0,025</td></tr>
      <tr><td>3,6</td><td>0,36</td><td>0,036</td><td>0,0036</td></tr>
      <tr><td>120</td><td>12</td><td>1,2</td><td>0,12</td></tr>
    </table>
  `;

  // 4. Create Lesson
  const lesson = await prisma.lesson.create({
    data: {
      title: 'الضرب في 0,1 أو 0,01 أو 0,001',
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
            question: 'التمرين 01: أكمل الجدول التالي (اكتب النتيجة فقط):\n1) 8 × 0,1\n2) 8 × 0,01\n3) 8 × 0,001\n4) 0,8 × 0,1\n5) 0,8 × 0,01\n6) 0,8 × 0,001',
            expectedResults: [
              { question: "1", result: "0.8", tolerance: 0 },
              { question: "2", result: "0.08", tolerance: 0 },
              { question: "3", result: "0.008", tolerance: 0 },
              { question: "4", result: "0.08", tolerance: 0 },
              { question: "5", result: "0.008", tolerance: 0 },
              { question: "6", result: "0.0008", tolerance: 0 }
            ],
            displayOrder: 1,
            maxScore: 3
          },
          {
            type: 'support_with_results',
            question: 'التمرين 02: أكمل بتحريك الفاصلة:\n1) 43 × 0,1\n2) 43 × 0,01\n3) 43 × 0,001\n4) 5,2 × 0,1\n5) 5,2 × 0,01\n6) 5,2 × 0,001',
            expectedResults: [
              { question: "1", result: "4.3", tolerance: 0 },
              { question: "2", result: "0.43", tolerance: 0 },
              { question: "3", result: "0.043", tolerance: 0 },
              { question: "4", result: "0.52", tolerance: 0 },
              { question: "5", result: "0.052", tolerance: 0 },
              { question: "6", result: "0.0052", tolerance: 0 }
            ],
            displayOrder: 2,
            maxScore: 3
          },
          {
            type: 'support_with_results',
            question: 'التمرين 03: احسب النتائج التالية للمطابقة:\n1) 12 × 0,1\n2) 12 × 0,01\n3) 12 × 0,001\n4) 120 × 0,1\n5) 120 × 0,001',
            expectedResults: [
              { question: "1", result: "1.2", tolerance: 0 },
              { question: "2", result: "0.12", tolerance: 0 },
              { question: "3", result: "0.012", tolerance: 0 },
              { question: "4", result: "12", tolerance: 0 },
              { question: "5", result: "0.12", tolerance: 0 }
            ],
            displayOrder: 3,
            maxScore: 2.5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 04: ضع الفاصلة في مكانها الصحيح (اكتب العدد كاملاً):\n1) 47 × 0,1\n2) 47 × 0,01\n3) 250 × 0,001\n4) 6,3 × 0,1\n5) 6,3 × 0,01',
            expectedResults: [
              { question: "1", result: "4.7", tolerance: 0 },
              { question: "2", result: "0.47", tolerance: 0 },
              { question: "3", result: "0.25", tolerance: 0 },
              { question: "4", result: "0.63", tolerance: 0 },
              { question: "5", result: "0.063", tolerance: 0 }
            ],
            displayOrder: 4,
            maxScore: 2.5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 05: قارن بوضع (=) أو (<) أو (>). (اكتب الرمز فقط):\n1) 24 × 0,1 ... 2,4\n2) 50 × 0,01 ... 0,5\n3) 8 × 0,001 ... 0,08\n4) 0,3 × 0,1 ... 0,03\n5) 120 × 0,01 ... 12 × 0,1',
            expectedResults: [
              { question: "1", result: "=", tolerance: 0 },
              { question: "2", result: "=", tolerance: 0 },
              { question: "3", result: "<", tolerance: 0 },
              { question: "4", result: "=", tolerance: 0 },
              { question: "5", result: "=", tolerance: 0 }
            ],
            displayOrder: 5,
            maxScore: 2.5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 06: اكتب النتيجة بالأرقام:\n1) 7 × 0,1\n2) 22 × 0,01\n3) 15 × 0,001\n4) 100 × 0,1\n5) 3 × 0,01',
            expectedResults: [
              { question: "1", result: "0.7", tolerance: 0 },
              { question: "2", result: "0.22", tolerance: 0 },
              { question: "3", result: "0.015", tolerance: 0 },
              { question: "4", result: "10", tolerance: 0 },
              { question: "5", result: "0.03", tolerance: 0 }
            ],
            displayOrder: 6,
            maxScore: 2.5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 07: حل ذهنياً:\n1) 9 × 0,1\n2) 9 × 0,01\n3) 30 × 0,1\n4) 30 × 0,01\n5) 30 × 0,001\n6) 0,4 × 0,1',
            expectedResults: [
              { question: "1", result: "0.9", tolerance: 0 },
              { question: "2", result: "0.09", tolerance: 0 },
              { question: "3", result: "3", tolerance: 0 },
              { question: "4", result: "0.3", tolerance: 0 },
              { question: "5", result: "0.03", tolerance: 0 },
              { question: "6", result: "0.04", tolerance: 0 }
            ],
            displayOrder: 7,
            maxScore: 3
          },
          // 🔴 التمارين الرئيسية (30%)
          {
            type: 'main',
            question: 'التمرين 08: مسألة شراء قماش\n1) ثمن المتر 40 دينار. اشتريت 0,1 متر. كم أدفع؟\n2) ثمن المتر 800 دينار. اشتريت 0,01 متر. كم أدفع؟\n3) ثمن المتر 1200 دينار. اشتريت 0,001 متر. كم أدفع؟',
            modelAnswer: '1) 40 × 0,1 = 4 دينار.\n2) 800 × 0,01 = 8 دينار.\n3) 1200 × 0,001 = 1,2 دينار.',
            displayOrder: 8,
            maxScore: 5
          },
          {
            type: 'main',
            question: 'التمرين 09: مسألة شراء حلوى\n1) سعر القطعة 0,1 دينار. كم ثمن 10 قطع؟\n2) كم ثمن 8 قطع؟\n3) معي 2 دينار، كم قطعة أشتري؟\n4) سعر القطعة 0,01 دينار. كم ثمن 50 قطعة؟\n5) كم ثمن 100 قطعة؟',
            modelAnswer: '1) 10 × 0,1 = 1 دينار.\n2) 8 × 0,1 = 0,8 دينار.\n3) 2 ÷ 0,1 = 20 قطعة.\n4) 50 × 0,01 = 0,5 دينار.\n5) 100 × 0,01 = 1 دينار.',
            displayOrder: 9,
            maxScore: 5
          },
          {
            type: 'main',
            question: 'التمرين 10: لغز الأعداد (اكتشف العدد المجهول):\n1) ... × 0,1 = 6\n2) ... × 0,01 = 0,5\n3) ... × 0,001 = 0,04\n4) 24 × ... = 2,4\n5) 300 × ... = 0,3',
            modelAnswer: '1) 60\n2) 50\n3) 40\n4) 0,1\n5) 0,001',
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