import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding Lesson: Division by 10, 100, 1000 ...');

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
    <h3 style="color: #2563eb;">🔍 اكتشاف: ماذا تعني القسمة على 10؟</h3>
    <p>عندما نقسم عدداً على 10، فهذا يعني أننا نوزع هذا العدد إلى 10 أجزاء متساوية، ونأخذ جزءاً واحداً فقط.</p>

    <h4 style="color: #d97706;">🖍️ مثال حياتي:</h4>
    <p>إذا كان معي 30 ديناراً، وأردت توزيعها بالتساوي على 10 أطفال، فكم يأخذ كل طفل؟</p>

    <div style="background-color: #f0f9ff; padding: 15px; border-radius: 10px; text-align: center; margin: 15px 0; border: 1px solid #bae6fd;">
      <p style="font-size: 1.2em; font-weight: bold;">30 ديناراً</p>
      <p>⬇️ نقسم على 10 أطفال ⬇️</p>
      <p style="font-size: 1.2em; font-weight: bold; color: #0284c7;">3 دنانير لكل طفل</p>
    </div>
    <p>إذن: <strong>30 ÷ 10 = 3</strong></p>

    <h3 style="color: #2563eb;">📊 ماذا تعني القسمة على 100 و 1000؟</h3>
    <table border="1" cellpadding="10" style="border-collapse: collapse; width: 100%; border: 2px solid #e5e7eb;">
      <thead>
        <tr style="background-color: #f3f4f6;">
          <th>العملية</th>
          <th>معناها</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>÷ 10</td>
          <td>تقسيم العدد إلى 10 أجزاء متساوية</td>
        </tr>
        <tr>
          <td>÷ 100</td>
          <td>تقسيم العدد إلى 100 جزء متساوٍ</td>
        </tr>
        <tr>
          <td>÷ 1000</td>
          <td>تقسيم العدد إلى 1000 جزء متساوٍ</td>
        </tr>
      </tbody>
    </table>

    <h3 style="color: #d97706;">💡 القاعدة الذهبية</h3>
    <p>عند القسمة على 10 أو 100 أو 1000، <strong>يَصغُر العدد وتتحرك الفاصلة إلى اليسار</strong></p>

    <div style="background-color: #e6f7ff; padding: 20px; border-radius: 10px; border-right: 5px solid #1890ff;">
      <p>📍 <strong>القسمة على 10</strong> (عدد به صفر واحد) ← نحرك الفاصلة <strong>رقمًا واحدًا</strong> إلى اليسار</p>
      <p>📍 <strong>القسمة على 100</strong> (عدد به صفران) ← نحرك الفاصلة <strong>رقمين</strong> إلى اليسار</p>
      <p>📍 <strong>القسمة على 1000</strong> (عدد به ثلاثة أصفار) ← نحرك الفاصلة <strong>ثلاثة أرقام</strong> إلى اليسار</p>
    </div>

    <h3 style="color: #9333ea;">🧮 كيف نحرك الفاصلة؟</h3>
    <div style="display: flex; justify-content: space-around; margin: 20px 0; gap: 10px; flex-wrap: wrap;">
      <div style="background-color: #e8f5e8; padding: 15px; border-radius: 10px; text-align: center; flex: 1; min-width: 150px;">
        <div style="font-size: 2em; color: #4CAF50;">10</div>
        <div style="font-size: 1.5em;">⬅️</div>
        <div>نحرك <span style="color: red; font-weight: bold;">خانة واحدة</span> لليسار</div>
      </div>
      <div style="background-color: #fff3e0; padding: 15px; border-radius: 10px; text-align: center; flex: 1; min-width: 150px;">
        <div style="font-size: 2em; color: #FF9800;">100</div>
        <div style="font-size: 1.5em;">⬅️⬅️</div>
        <div>نحرك <span style="color: red; font-weight: bold;">خانتين</span> لليسار</div>
      </div>
      <div style="background-color: #ffebee; padding: 15px; border-radius: 10px; text-align: center; flex: 1; min-width: 150px;">
        <div style="font-size: 2em; color: #f44336;">1000</div>
        <div style="font-size: 1.5em;">⬅️⬅️⬅️</div>
        <div>نحرك <span style="color: red; font-weight: bold;">ثلاث خانات</span> لليسار</div>
      </div>
    </div>

    <h3 style="color: #16a34a;">✅ أمثلة محلولة خطوة بخطوة</h3>
    
    <div style="background-color: #f6f6f6; padding: 15px; border-radius: 10px; margin-bottom: 10px;">
      <p><strong>📌 المثال 1:</strong> 45 ÷ 10 = ؟</p>
      <p>العدد الأصلي: 45 (نكتبه 45,0)</p>
      <p>نحرك الفاصلة رقمًا واحدًا لليسار ← <strong>4,5</strong></p>
    </div>

    <div style="background-color: #f6f6f6; padding: 15px; border-radius: 10px; margin-bottom: 10px;">
      <p><strong>📌 المثال 2:</strong> 372 ÷ 100 = ؟</p>
      <p>العدد الأصلي: 372 (نكتبه 372,00)</p>
      <p>نحرك الفاصلة رقمين لليسار ← <strong>3,72</strong></p>
    </div>

    <div style="background-color: #f6f6f6; padding: 15px; border-radius: 10px; margin-bottom: 10px;">
      <p><strong>📌 المثال 3:</strong> 5000 ÷ 1000 = ؟</p>
      <p>العدد الأصلي: 5000 (نكتبه 5000,000)</p>
      <p>نحرك الفاصلة ثلاثة أرقام لليسار ← <strong>5</strong></p>
    </div>

    <div style="background-color: #f6f6f6; padding: 15px; border-radius: 10px; margin-bottom: 10px;">
      <p><strong>📌 المثال 4:</strong> 3,8 ÷ 10 = ؟</p>
      <p>العدد الأصلي: 3,8</p>
      <p>نحرك الفاصلة رقمًا واحدًا لليسار ← <strong>0,38</strong></p>
    </div>

    <div style="background-color: #f6f6f6; padding: 15px; border-radius: 10px; margin-bottom: 10px;">
      <p><strong>📌 المثال 5:</strong> 0,5 ÷ 100 = ؟</p>
      <p>العدد الأصلي: 0,5</p>
      <p>نحرك الفاصلة رقمين لليسار ← <strong>0,005</strong></p>
    </div>

    <h3 style="color: #059669;">🎯 جدول خلاصة</h3>
    <table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%; text-align: center;">
      <tr style="background-color: #ecfdf5;"><th>العدد</th><th>÷ 10</th><th>÷ 100</th><th>÷ 1000</th></tr>
      <tr><td>75</td><td>7,5</td><td>0,75</td><td>0,075</td></tr>
      <tr><td>320</td><td>32</td><td>3,2</td><td>0,32</td></tr>
      <tr><td>6,4</td><td>0,64</td><td>0,064</td><td>0,0064</td></tr>
      <tr><td>5000</td><td>500</td><td>50</td><td>5</td></tr>
    </table>

    <hr style="border-top: 2px dashed #d1d5db; margin: 20px 0;">
    <div style="background-color: #d4edda; padding: 20px; border-radius: 10px; text-align: center; font-size: 1.2em; border: 2px solid #28a745;">
      <p><strong>تذكر دائماً:</strong></p>
      <p>القسمة على 10 ← الفاصلة تتحرك رقمًا واحدًا لليسار</p>
      <p>القسمة على 100 ← الفاصلة تتحرك رقمين لليسار</p>
      <p>القسمة على 1000 ← الفاصلة تتحرك ثلاثة أرقام لليسار</p>
    </div>
  `;

  // 4. Create Lesson
  const lesson = await prisma.lesson.create({
    data: {
      title: 'القسمة على 10 أو 100 أو 1000',
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
            question: 'التمرين 01: أكمل الجدول التالي (اكتب النتيجة فقط):\n1) 60 ÷ 10\n2) 60 ÷ 100\n3) 60 ÷ 1000\n4) 6 ÷ 10\n5) 6 ÷ 100\n6) 6 ÷ 1000',
            expectedResults: [
              { question: "1", result: "6", tolerance: 0 },
              { question: "2", result: "0.6", tolerance: 0 },
              { question: "3", result: "0.06", tolerance: 0 },
              { question: "4", result: "0.6", tolerance: 0 },
              { question: "5", result: "0.06", tolerance: 0 },
              { question: "6", result: "0.006", tolerance: 0 }
            ],
            displayOrder: 1,
            maxScore: 3
          },
          {
            type: 'support_with_results',
            question: 'التمرين 02: أكمل بتحريك الفاصلة:\n1) 123 ÷ 10\n2) 123 ÷ 100\n3) 123 ÷ 1000\n4) 45,6 ÷ 10\n5) 45,6 ÷ 100\n6) 45,6 ÷ 1000',
            expectedResults: [
              { question: "1", result: "12.3", tolerance: 0 },
              { question: "2", result: "1.23", tolerance: 0 },
              { question: "3", result: "0.123", tolerance: 0 },
              { question: "4", result: "4.56", tolerance: 0 },
              { question: "5", result: "0.456", tolerance: 0 },
              { question: "6", result: "0.0456", tolerance: 0 }
            ],
            displayOrder: 2,
            maxScore: 3
          },
          {
            type: 'support_with_results',
            question: 'التمرين 03: احسب النتائج التالية للمطابقة:\n1) 250 ÷ 10\n2) 250 ÷ 100\n3) 250 ÷ 1000\n4) 25 ÷ 10\n5) 2500 ÷ 100',
            expectedResults: [
              { question: "1", result: "25", tolerance: 0 },
              { question: "2", result: "2.5", tolerance: 0 },
              { question: "3", result: "0.25", tolerance: 0 },
              { question: "4", result: "2.5", tolerance: 0 },
              { question: "5", result: "25", tolerance: 0 }
            ],
            displayOrder: 3,
            maxScore: 2.5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 04: ضع الفاصلة في مكانها الصحيح (اكتب العدد كاملاً):\n1) 47 ÷ 10\n2) 47 ÷ 100\n3) 320 ÷ 1000\n4) 6,3 ÷ 10\n5) 6,3 ÷ 100',
            expectedResults: [
              { question: "1", result: "4.7", tolerance: 0 },
              { question: "2", result: "0.47", tolerance: 0 },
              { question: "3", result: "0.32", tolerance: 0 },
              { question: "4", result: "0.63", tolerance: 0 },
              { question: "5", result: "0.063", tolerance: 0 }
            ],
            displayOrder: 4,
            maxScore: 2.5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 05: قارن بوضع (=) أو (<) أو (>). (اكتب الرمز فقط):\n1) 240 ÷ 10 ... 24\n2) 500 ÷ 100 ... 5\n3) 8 ÷ 1000 ... 0,008\n4) 0,3 ÷ 10 ... 0,03\n5) 1200 ÷ 100 ... 12 ÷ 10',
            expectedResults: [
              { question: "1", result: "=", tolerance: 0 },
              { question: "2", result: "=", tolerance: 0 },
              { question: "3", result: "=", tolerance: 0 },
              { question: "4", result: "=", tolerance: 0 },
              { question: "5", result: ">", tolerance: 0 }
            ],
            displayOrder: 5,
            maxScore: 2.5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 06: اكتب العدد الناقص (المقسوم عليه):\n1) 54 ÷ ... = 5,4\n2) 54 ÷ ... = 0,54\n3) 54 ÷ ... = 0,054\n4) 7 ÷ 10 = ...\n5) 7 ÷ 100 = ...',
            expectedResults: [
              { question: "1", result: "10", tolerance: 0 },
              { question: "2", result: "100", tolerance: 0 },
              { question: "3", result: "1000", tolerance: 0 },
              { question: "4", result: "0.7", tolerance: 0 },
              { question: "5", result: "0.07", tolerance: 0 }
            ],
            displayOrder: 6,
            maxScore: 2.5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 07: حل ذهنياً:\n1) 90 ÷ 10\n2) 900 ÷ 100\n3) 9000 ÷ 1000\n4) 4,8 ÷ 10\n5) 4,8 ÷ 100\n6) 4,8 ÷ 1000',
            expectedResults: [
              { question: "1", result: "9", tolerance: 0 },
              { question: "2", result: "9", tolerance: 0 },
              { question: "3", result: "9", tolerance: 0 },
              { question: "4", result: "0.48", tolerance: 0 },
              { question: "5", result: "0.048", tolerance: 0 },
              { question: "6", result: "0.0048", tolerance: 0 }
            ],
            displayOrder: 7,
            maxScore: 3
          },
          // 🔴 التمارين الرئيسية (30%)
          {
            type: 'main',
            question: 'التمرين 08: مسألة توزيع النقود\n1) لدى الأب 250 ديناراً وزعها على 10 أبناء. كم يأخذ كل ابن؟\n2) لدى الأم 500 ديناراً وزعتها على 100 محتاج. كم يأخذ كل محتاج؟\n3) ميراث 7500 دينار يوزع على 1000 شخص. كم نصيب كل شخص؟',
            modelAnswer: '1) 250 ÷ 10 = 25 دينار.\n2) 500 ÷ 100 = 5 دينار.\n3) 7500 ÷ 1000 = 7,5 دينار.',
            displayOrder: 8,
            maxScore: 5
          },
          {
            type: 'main',
            question: 'التمرين 09: مسألة تعبئة الصناديق (3600 قارورة)\n1) إذا كان الصندوق يسع 10 قوارير، كم صندوقاً نحتاج؟\n2) إذا كان يسع 100 قارورة؟\n3) إذا كان يسع 1000 قارورة؟',
            modelAnswer: '1) 3600 ÷ 10 = 360 صندوق.\n2) 3600 ÷ 100 = 36 صندوق.\n3) 3600 ÷ 1000 = 3,6 (نحتاج 4 صناديق أو نقول 3 صناديق وتبقى 600 قارورة، رياضياً النتيجة 3,6).',
            displayOrder: 9,
            maxScore: 5
          },
          {
            type: 'main',
            question: 'التمرين 10: لغز الأعداد (اكتشف العدد المجهول):\n1) ... ÷ 10 = 6\n2) ... ÷ 100 = 0,5\n3) ... ÷ 1000 = 0,04\n4) 24 ÷ ... = 2,4\n5) 300 ÷ ... = 0,3',
            modelAnswer: '1) 60\n2) 50\n3) 40\n4) 10\n5) 1000',
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