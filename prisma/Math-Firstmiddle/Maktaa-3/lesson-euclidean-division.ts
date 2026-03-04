import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const teacherEmail = 'ladj14013@gmail.com';
  
  console.log(`🔍 Searching for teacher: ${teacherEmail}...`);

  const teacher = await prisma.user.findUnique({
    where: { email: teacherEmail },
    include: { userDetails: true }
  });

  if (!teacher) {
    console.error(`❌ Teacher with email ${teacherEmail} not found.`);
    return;
  }

  // 1. Find Level
  const level = await prisma.level.findFirst({
    where: { name: { contains: 'أولى متوسط' } },
  });

  if (!level) {
    console.error('❌ Level "أولى متوسط" not found.');
    return;
  }

  // 2. Find Subject
  const subject = await prisma.subject.findFirst({ 
    where: { 
      name: 'الرياضيات',
      stageId: level.stageId 
    },
  });

  if (!subject) {
    console.error(`❌ Subject "الرياضيات" for stage ${level.stageId} not found.`);
    return;
  }

  // 3. Ensure Teacher Profile matches
  if (teacher.userDetails && teacher.userDetails.subjectId !== subject.id) {
    console.log(`🔄 Updating teacher profile to match subject ID ${subject.id}...`);
    await prisma.userDetails.update({
      where: { userId: teacher.id },
      data: { subjectId: subject.id }
    });
  }

  const lessonTitle = "القسمة الإقليدية والمساواة المعبرة عنها";

  // Content with SVGs
  const content = `
🔍 تمهيد: ماذا نعني بالقسمة الإقليدية؟
<div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0; text-align: center;">
  <p>القسمة الإقليدية هي عملية تقسيم عدد صحيح طبيعي (المقسوم) على عدد صحيح طبيعي آخر (المقسوم عليه) للحصول على خارج القسمة وباقٍ، بحيث يكون الباقي أصغر من المقسوم عليه.</p>

  <div style="display: flex; justify-content: center; margin: 30px 0;">
    <div style="background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <p style="font-size: 2em;">17 ÷ 5 = 3 والباقي 2</p>
      <p style="color: #666;">لأن: 17 = (5 × 3) + 2</p>
    </div>
  </div>
</div>

📝 المصطلحات الأساسية
<div style="background-color: #fff3cd; padding: 20px; border-radius: 15px; margin: 20px 0; overflow-x: auto;">
  <table style="width:100%; text-align:right; border-collapse: collapse; min-width: 500px;">
    <tr style="border-bottom: 1px solid #ccc;"><th>المصطلح</th><th>التعريف</th><th>الرمز</th></tr>
    <tr><td>المقسوم</td><td>العدد الذي نريد قسمته</td><td>D</td></tr>
    <tr><td>المقسوم عليه</td><td>العدد الذي نقسم عليه</td><td>d</td></tr>
    <tr><td>خارج القسمة</td><td>ناتج القسمة (عدد المرات)</td><td>Q</td></tr>
    <tr><td>الباقي</td><td>العدد المتبقي بعد القسمة</td><td>R</td></tr>
    <tr><td>المساواة المعبرة</td><td>العلاقة بين هذه الأعداد</td><td>D = (d × Q) + R</td></tr>
  </table>
</div>

📐 قاعدة القسمة الإقليدية
<div style="background-color: #f6f6f6; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h3>🎯 القاعدة الأساسية:</h3>
  <p>المساواة المعبرة عن القسمة الإقليدية:</p>
  
  <div style="text-align: center; font-size: 2em; margin: 30px 0; color: #1976D2;">
    <strong>D = (d × Q) + R</strong>
  </div>
  <p>مع الشرط: <strong style="color: #c2185b;">0 ≤ R < d</strong> (الباقي دائماً أصغر من المقسوم عليه)</p>
  
  <table style="width:100%; text-align:right; border-collapse: collapse; margin-top: 10px;">
    <tr style="border-bottom: 1px solid #ccc;"><th>الرمز</th><th>المعنى</th></tr>
    <tr><td>D</td><td>المقسوم (Dividende)</td></tr>
    <tr><td>d</td><td>المقسوم عليه (Diviseur)</td></tr>
    <tr><td>Q</td><td>خارج القسمة (Quotient)</td></tr>
    <tr><td>R</td><td>الباقي (Reste)</td></tr>
  </table>
</div>

🔢 كيف نكتب القسمة الإقليدية؟
<div style="background-color: #e8f5e9; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <div style="display: flex; justify-content: center; gap: 50px; flex-wrap: wrap;">
    <div style="text-align: center;">
      <p style="font-size: 1.5em; font-weight: bold;">الكتابة الأفقية</p>
      <div style="background-color: white; padding: 20px; border-radius: 10px;">
        <p>23 = (4 × 5) + 3</p>
        <p>23 ÷ 4 = 5 والباقي 3</p>
      </div>
    </div>
    <div style="text-align: center;">
      <p style="font-size: 1.5em; font-weight: bold;">الكتابة العمودية</p>
      <div style="background-color: white; padding: 20px; border-radius: 10px; font-family: monospace;">
        <svg width="150" height="100" viewBox="0 0 150 100">
          <text x="20" y="30" font-size="20">23</text>
          <line x1="50" y1="10" x2="50" y2="90" stroke="black" stroke-width="2" />
          <line x1="50" y1="40" x2="140" y2="40" stroke="black" stroke-width="2" />
          <text x="60" y="30" font-size="20">4</text>
          <text x="60" y="70" font-size="20">5</text>
          <text x="20" y="70" font-size="20" fill="red">3</text>
        </svg>
      </div>
    </div>
  </div>
</div>

✅ أمثلة محلولة خطوة بخطوة
<div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <div style="display: flex; align-items: center; gap: 30px; flex-wrap: wrap;">
    <div style="background-color: white; padding: 20px; border-radius: 10px; font-family: monospace; font-size: 1.2em;">
      <svg width="150" height="100" viewBox="0 0 150 100">
        <text x="20" y="30" font-size="20">17</text>
        <line x1="50" y1="10" x2="50" y2="90" stroke="black" stroke-width="2" />
        <line x1="50" y1="40" x2="140" y2="40" stroke="black" stroke-width="2" />
        <text x="60" y="30" font-size="20">5</text>
        <text x="60" y="70" font-size="20">3</text>
        <text x="20" y="70" font-size="20" fill="red">2</text>
      </svg>
    </div>
    <div>
      <h4>📌 المثال 1: إيجاد خارج القسمة والباقي</h4>
      <p><strong>المطلوب:</strong> قسمة 17 على 5</p>
      <p><strong>الخطوات:</strong></p>
      <ol>
        <li>نبحث عن أكبر عدد نضربه في 5 ونحصل على ناتج ≤ 17</li>
        <li>5 × 3 = 15 (أقل من 17)</li>
        <li>17 - 15 = 2 (الباقي)</li>
        <li>نتحقق: 2 < 5 ✓</li>
      </ol>
      <p><strong>النتيجة:</strong> خارج القسمة = 3، الباقي = 2</p>
      <p><strong>المساواة المعبرة:</strong> 17 = (5 × 3) + 2</p>
    </div>
  </div>
</div>

<div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <div style="display: flex; align-items: center; gap: 30px; flex-wrap: wrap;">
    <div style="background-color: white; padding: 20px; border-radius: 10px; font-family: monospace; font-size: 1.2em;">
      <svg width="150" height="100" viewBox="0 0 150 100">
        <text x="20" y="30" font-size="20">36</text>
        <line x1="50" y1="10" x2="50" y2="90" stroke="black" stroke-width="2" />
        <line x1="50" y1="40" x2="140" y2="40" stroke="black" stroke-width="2" />
        <text x="60" y="30" font-size="20">9</text>
        <text x="60" y="70" font-size="20">4</text>
        <text x="20" y="70" font-size="20" fill="green">0</text>
      </svg>
    </div>
    <div>
      <h4>📌 المثال 3: قسمة بدون باقي (قسمة تامة)</h4>
      <p><strong>المطلوب:</strong> قسمة 36 على 9</p>
      <p><strong>الخطوات:</strong></p>
      <ol>
        <li>9 × 4 = 36 (يساوي المقسوم تماماً)</li>
        <li>36 - 36 = 0 (الباقي)</li>
      </ol>
      <p><strong>النتيجة:</strong> خارج القسمة = 4، الباقي = 0</p>
      <p><strong>المساواة المعبرة:</strong> 36 = (9 × 4) + 0</p>
      <p><span style="color: #4CAF50;">✓ هذه قسمة تامة (الباقي = 0)</span></p>
    </div>
  </div>
</div>

📊 شروط القسمة الإقليدية
<div style="background-color: #e3f2fd; padding: 20px; border-radius: 15px; margin: 30px 0; overflow-x: auto;">
  <table style="width:100%; text-align:right; border-collapse: collapse; min-width: 500px;">
    <tr style="border-bottom: 1px solid #ccc;"><th>الشرط</th><th>التوضيح</th><th>مثال صحيح</th><th>مثال خاطئ</th></tr>
    <tr><td>1</td><td>المقسوم والمقسوم عليه عددان طبيعيان</td><td>17 ÷ 5</td><td>17 ÷ (-5)</td></tr>
    <tr><td>2</td><td>المقسوم عليه ≠ 0</td><td>17 ÷ 5</td><td>17 ÷ 0</td></tr>
    <tr><td>3</td><td>الباقي أصغر من المقسوم عليه</td><td>17 = (5×3)+2 (2<5)</td><td>17 = (5×2)+7 (7>5) ✗</td></tr>
    <tr><td>4</td><td>الباقي أكبر من أو يساوي 0</td><td>17 = (5×3)+2 (2≥0)</td><td>17 = (5×4)+(-3) ✗</td></tr>
  </table>
</div>

✨ ختام الدرس - تذكير بالقوانين
<div style="background-color: #d4edda; padding: 20px; border-radius: 15px; text-align: center; font-size: 1.2em; border: 2px solid #28a745; margin: 30px 0;">
  📌 لنتذكر دائمًا:
  <div style="font-size: 2em; color: #1976D2; margin: 20px 0;">
    <strong>D = (d × Q) + R</strong>
  </div>
  <div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
    <div><p><strong>D</strong> : المقسوم</p><p><strong>d</strong> : المقسوم عليه</p></div>
    <div><p><strong>Q</strong> : خارج القسمة</p><p><strong>R</strong> : الباقي</p></div>
  </div>
  <p style="color: #c2185b; margin-top: 20px;"><strong>الشرط: 0 ≤ R < d</strong></p>
</div>
`;

  console.log(`📝 Creating/Updating lesson: ${lessonTitle}...`);

  // حذف الدرس القديم لتجنب التكرار
  await prisma.lesson.deleteMany({
    where: {
      title: lessonTitle,
      authorId: teacher.id,
    },
  });

  const lesson = await prisma.lesson.upsert({
    where: {
      title_authorId: {
        title: lessonTitle,
        authorId: teacher.id,
      },
    },
    update: {
      content: content,
      published: true,
      status: 'approved',
    },
    create: {
      title: lessonTitle,
      content: content,
      subjectId: subject.id,
      levelId: level.id,
      authorId: teacher.id,
      type: 'public',
      status: 'approved',
      published: true,
    },
  });

  console.log(`✅ Lesson created successfully with ID: ${lesson.id}`);

  // إضافة التمارين
  const exercises = [
    { 
      type: 'support_with_results', 
      question: 'أكمل الفراغات:\n1. في القسمة الإقليدية، العدد الذي نقسمه يسمى ......\n2. العدد الذي نقسم عليه يسمى ......\n3. ناتج القسمة يسمى ......\n4. العدد المتبقي بعد القسمة يسمى ......\n5. المساواة المعبرة عن القسمة الإقليدية هي: D = (d × ......) + ......\n6. يجب أن يكون الباقي دائماً ...... من المقسوم عليه', 
      expectedResults: [
        { question: "1", result: "المقسوم" },
        { question: "2", result: "المقسوم عليه" },
        { question: "3", result: "خارج القسمة" },
        { question: "4", result: "الباقي" },
        { question: "5", result: "Q, R" },
        { question: "6", result: "أصغر" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'أكمل القسمة التالية (خارج القسمة والباقي):\n1. 37 ÷ 6 = ... والباقي ...\n2. 45 ÷ 7 = ... والباقي ...\n3. 52 ÷ 8 = ... والباقي ...\n4. 63 ÷ 9 = ... والباقي ...', 
      expectedResults: [
        { question: "1", result: "6, 1" },
        { question: "2", result: "6, 3" },
        { question: "3", result: "6, 4" },
        { question: "4", result: "7, 0" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'أوجد خارج القسمة والباقي:\n1. 19 ÷ 5\n2. 31 ÷ 7\n3. 44 ÷ 6\n4. 50 ÷ 8\n5. 73 ÷ 9', 
      expectedResults: [
        { question: "1", result: "3, 4" },
        { question: "2", result: "4, 3" },
        { question: "3", result: "7, 2" },
        { question: "4", result: "6, 2" },
        { question: "5", result: "8, 1" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'أوجد المقسوم (D):\n1. d=5, Q=4, R=3 → D=...\n2. d=7, Q=6, R=2 → D=...\n3. d=6, Q=8, R=5 → D=...\n4. d=8, Q=9, R=4 → D=...\n5. d=9, Q=7, R=6 → D=...', 
      expectedResults: [
        { question: "1", result: "23" },
        { question: "2", result: "44" },
        { question: "3", result: "53" },
        { question: "4", result: "76" },
        { question: "5", result: "69" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'أوجد المقسوم عليه (d):\n1. 29 ÷ d = 4 والباقي 1\n2. 41 ÷ d = 5 والباقي 1\n3. 55 ÷ d = 6 والباقي 1\n4. 68 ÷ d = 7 والباقي 5\n5. 83 ÷ d = 9 والباقي 2', 
      expectedResults: [
        { question: "1", result: "7" },
        { question: "2", result: "8" },
        { question: "3", result: "9" },
        { question: "4", result: "9" },
        { question: "5", result: "9" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'أكمل الجدول:\nD | d | Q | R\n38 | 5 | 7 | 3\n47 | 6 | ⬜ | 5\n59 | 7 | 8 | ⬜\n⬜ | 8 | 6 | 3\n86 | ⬜ | 9 | 5', 
      expectedResults: [
        { question: "1", result: "7" },
        { question: "2", result: "3" },
        { question: "3", result: "51" },
        { question: "4", result: "9" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'اختر الإجابة الصحيحة:\n1. 25 ÷ 6 = ... (4 والباقي 1 / 3 والباقي 7 / 5 والباقي 0)\n2. 43 ÷ 8 = ... (5 والباقي 3 / 4 والباقي 11 / 6 والباقي 1)\n3. 52 ÷ 7 = ... (7 والباقي 3 / 8 والباقي 1 / 6 والباقي 10)\n4. إذا كان D=39, d=5, Q=7 فإن R=... (4 / 5 / 3)\n5. المساواة الصحيحة للقسمة 47÷9 هي ... (47=(9×5)+2 / 47=(9×4)+11 / 47=(9×6)-7)', 
      expectedResults: [
        { question: "1", result: "4 والباقي 1" },
        { question: "2", result: "5 والباقي 3" },
        { question: "3", result: "7 والباقي 3" },
        { question: "4", result: "4" },
        { question: "5", result: "47=(9×5)+2" }
      ]
    },
    // تمارين رئيسية (30%)
    { 
      type: 'main', 
      question: 'مسألة: توزيع الحلوى:\nلدى أحمد 47 حبة حلوى يريد توزيعها على 8 أطفال بالتساوي.\n\nالمطلوب:\n1. كم حبة حلوى يأخذ كل طفل؟\n2. كم حبة تتبقى مع أحمد؟\n3. اكتب المساواة المعبرة عن هذه القسمة.\n4. إذا أراد أحمد أن يعطي كل طفل 7 حبات، فكم حبة يحتاج إضافية؟', 
      modelAnswer: '1. 5 حبات\n2. 7 حبات\n3. 47 = (8 × 5) + 7\n4. يحتاج 9 حبات إضافية (56 - 47)' 
    },
    { 
      type: 'main', 
      question: 'مسألة: رحلة مدرسية:\nفي رحلة مدرسية، هناك 85 تلميذاً. كل حافلة تتسع لـ 12 تلميذاً.\n\nالمطلوب:\n1. كم حافلة نحتاج لنقل جميع التلاميذ؟\n2. كم تلميذاً سيكون في الحافلة الأخيرة؟\n3. اكتب المساواة المعبرة عن هذه القسمة.\n4. إذا أردنا أن تكون جميع الحافلات ممتلئة بالتساوي، كم تلميذاً إضافياً نحتاج؟', 
      modelAnswer: '1. 8 حافلات (7 ممتلئة + 1)\n2. تلميذ واحد\n3. 85 = (12 × 7) + 1\n4. 11 تلميذاً إضافياً' 
    },
    { 
      type: 'main', 
      question: 'التحدي الكبير - تنظيم حفل:\nيريد منظم حفل توزيع 150 هدية على المدعوين. كل مدعو يأخذ 4 هدايا.\n\nالمطلوب:\n1. كم عدد المدعوين الذين يمكنهم أخذ هدايا؟\n2. كم هدية تبقى؟\n3. اكتب المساواة المعبرة عن هذه القسمة.\n4. إذا زاد عدد المدعوين إلى 40 شخصاً، فكم هدية يأخذ كل شخص؟ وهل تبقى هدايا؟', 
      modelAnswer: '1. 37 مدعواً\n2. هديتان\n3. 150 = (4 × 37) + 2\n4. 3 هدايا لكل شخص، ويتبقى 30 هدية' 
    },
  ];

  console.log(`📝 Adding ${exercises.length} exercises...`);
  for (const [index, ex] of exercises.entries()) {
    await prisma.exercise.create({
      data: {
        lessonId: lesson.id,
        question: ex.question,
        modelAnswer: 'modelAnswer' in ex ? ex.modelAnswer : undefined,
        expectedResults: 'expectedResults' in ex ? ex.expectedResults : undefined,
        type: ex.type,
        displayOrder: index + 1,
      },
    });
  }

  console.log(`✅ Lesson and exercises created successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });