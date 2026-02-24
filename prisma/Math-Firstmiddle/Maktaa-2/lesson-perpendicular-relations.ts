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

  const lessonTitle = "المستقيمان العموديان - علاقات التوازي والتعامد على نفس المستقيم";

  // Content with SVGs
  const content = `
🔍 تمهيد: ماذا نعني بمستقيم عمودي على مستقيم آخر؟
<div style="display: flex; justify-content: space-around; margin: 20px 0; flex-wrap: wrap; gap: 20px;">
  <div style="background-color: #e3f2fd; padding: 20px; border-radius: 15px; text-align: center; width: 45%; min-width: 300px;">
    <h3>مستقيمان متعامدان</h3>
    <div style="margin: 20px 0; background-color: white; padding: 10px; border-radius: 10px;">
      <svg width="200" height="150" viewBox="0 0 200 150">
        <line x1="20" y1="120" x2="180" y2="120" stroke="black" stroke-width="2" />
        <text x="180" y="115" font-size="14">(l)</text>
        <line x1="100" y1="20" x2="100" y2="140" stroke="red" stroke-width="2" />
        <text x="105" y="30" font-size="14" fill="red">(d)</text>
        <rect x="100" y="110" width="10" height="10" fill="none" stroke="black" />
      </svg>
    </div>
    <p><strong>(d) ⊥ (l)</strong></p>
    <p>المستقيمان يتقاطعان بزاوية قائمة 90°</p>
  </div>
  <div style="background-color: #ffebee; padding: 20px; border-radius: 15px; text-align: center; width: 45%; min-width: 300px;">
    <h3>خاصية هامة</h3>
    <div style="margin: 20px 0; background-color: white; padding: 10px; border-radius: 10px;">
      <svg width="200" height="150" viewBox="0 0 200 150">
        <line x1="20" y1="50" x2="180" y2="50" stroke="blue" stroke-width="2" />
        <text x="180" y="45" font-size="14" fill="blue">(l)</text>
        <line x1="20" y1="100" x2="180" y2="100" stroke="blue" stroke-width="2" />
        <text x="180" y="95" font-size="14" fill="blue">(m)</text>
        <line x1="80" y1="20" x2="80" y2="130" stroke="red" stroke-width="2" />
        <text x="85" y="30" font-size="14" fill="red">(d)</text>
        <rect x="80" y="50" width="10" height="10" fill="none" stroke="black" />
        <rect x="80" y="100" width="10" height="10" fill="none" stroke="black" />
      </svg>
    </div>
    <p><strong>إذا كان (l) // (m) و (d) ⊥ (l) فإن (d) ⊥ (m)</strong></p>
  </div>
</div>

📝 المصطلحات والترميزات الأساسية
<div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0; overflow-x: auto;">
<table style="width:100%; text-align:right; border-collapse: collapse; min-width: 500px;">
<tr style="border-bottom: 1px solid #ccc;"><th>المصطلح</th><th>معناه</th><th>الترميز</th><th>مثال</th></tr>
<tr><td>نقطة</td><td>موقع محدد في المستوى</td><td>حرف كبير</td><td>A •</td></tr>
<tr><td>مستقيم</td><td>خط غير محدود من الجهتين</td><td>حرف صغير بين قوسين</td><td>(d)، (l)</td></tr>
<tr><td>عمودي على</td><td>مستقيمان متعامدان</td><td>(d) ⊥ (l)</td><td>(d) ⊥ (l)</td></tr>
<tr><td>يوازي</td><td>مستقيمان متوازيان</td><td>(d) // (l)</td><td>(d) // (l)</td></tr>
<tr><td>خاصية 1</td><td>إذا كان مستقيمان متوازيين، فكل عمودي على أحدهما يكون عمودياً على الآخر</td><td>(l) // (m) و (d) ⊥ (l) ⇒ (d) ⊥ (m)</td><td></td></tr>
<tr><td>خاصية 2</td><td>إذا كان مستقيمان متعامدين مع مستقيم ثالث، فإنهما متوازيان</td><td>(d) ⊥ (l) و (m) ⊥ (l) ⇒ (d) // (m)</td><td></td></tr>
</table>
</div>

📐 أولاً: العلاقة بين التوازي والتعامد
🎯 الخاصية الأساسية رقم 1:
إذا كان مستقيمان متوازيين، فكل مستقيم عمودي على أحدهما يكون عمودياً على الآخر

<div style="background-color: #f6f6f6; padding: 20px; border-radius: 15px; margin: 20px 0;">
<strong>المعطيات:</strong>
<br>
(l) // (m) (المستقيمان (l) و (m) متوازيان)
<br>
(d) ⊥ (l) (المستقيم (d) عمودي على (l))
<br><br>
<strong>النتيجة:</strong>
<br>
(d) ⊥ (m) (المستقيم (d) عمودي على (m) أيضاً)

<div style="text-align: center; margin: 30px 0;">
  <div style="background-color: white; padding: 20px; border-radius: 10px; display: inline-block;">
    <svg width="250" height="180" viewBox="0 0 250 180">
      <!-- Parallel lines -->
      <line x1="20" y1="60" x2="230" y2="60" stroke="#1976D2" stroke-width="2" />
      <text x="235" y="65" font-size="14" fill="#1976D2">(l)</text>
      <line x1="20" y1="120" x2="230" y2="120" stroke="#1976D2" stroke-width="2" />
      <text x="235" y="125" font-size="14" fill="#1976D2">(m)</text>
      
      <!-- Perpendicular line -->
      <line x1="100" y1="20" x2="100" y2="160" stroke="#C2185B" stroke-width="2" />
      <text x="105" y="30" font-size="14" fill="#C2185B">(d)</text>
      
      <!-- Right angle symbols -->
      <rect x="100" y="60" width="12" height="12" fill="none" stroke="black" />
      <rect x="100" y="120" width="12" height="12" fill="none" stroke="black" stroke-dasharray="2,2" />
      <text x="120" y="140" font-size="12" fill="green">؟</text>
    </svg>
  </div>
</div>
<strong>شرح بالكلمات:</strong>
<br>
المستقيم (d) يعامد (l) في نقطة
<br>
المستقيم (m) يوازي (l)
<br>
إذن (d) يعامد (m) أيضاً
</div>

🎯 الخاصية الأساسية رقم 2:
إذا كان مستقيمان عموديين على مستقيم ثالث، فإنهما متوازيان

<div style="background-color: #f6f6f6; padding: 20px; border-radius: 15px; margin: 20px 0;">
<strong>المعطيات:</strong>
<br>
(d) ⊥ (l) (المستقيم (d) عمودي على (l))
<br>
(m) ⊥ (l) (المستقيم (m) عمودي على (l))
<br><br>
<strong>النتيجة:</strong>
<br>
(d) // (m) (المستقيمان (d) و (m) متوازيان)

<div style="text-align: center; margin: 30px 0;">
  <div style="background-color: white; padding: 20px; border-radius: 10px; display: inline-block;">
    <svg width="250" height="180" viewBox="0 0 250 180">
      <!-- Base line -->
      <line x1="20" y1="140" x2="230" y2="140" stroke="black" stroke-width="2" />
      <text x="235" y="145" font-size="14">(l)</text>
      
      <!-- Perpendicular lines -->
      <line x1="80" y1="20" x2="80" y2="140" stroke="#1976D2" stroke-width="2" />
      <text x="85" y="30" font-size="14" fill="#1976D2">(d)</text>
      
      <line x1="160" y1="20" x2="160" y2="140" stroke="#1976D2" stroke-width="2" />
      <text x="165" y="30" font-size="14" fill="#1976D2">(m)</text>
      
      <!-- Right angle symbols -->
      <rect x="80" y="128" width="12" height="12" fill="none" stroke="red" />
      <rect x="160" y="128" width="12" height="12" fill="none" stroke="red" />
    </svg>
  </div>
</div>
<strong>شرح بالكلمات:</strong>
<br>
المستقيم (d) يعامد (l)
<br>
المستقيم (m) يعامد (l)
<br>
إذن (d) و (m) متوازيان
</div>

📊 جدول ملخص الخصائص
<div style="background-color: #fff3cd; padding: 20px; border-radius: 15px; margin: 30px 0;">
<table style="width:100%; text-align:right; border-collapse: collapse;">
<tr style="border-bottom: 1px solid #ccc;"><th>الخاصية</th><th>الشرط</th><th>النتيجة</th></tr>
<tr><td>الخاصية 1</td><td>(l) // (m) و (d) ⊥ (l)</td><td>(d) ⊥ (m)</td></tr>
<tr><td>الخاصية 2</td><td>(d) ⊥ (l) و (m) ⊥ (l)</td><td>(d) // (m)</td></tr>
<tr><td>نتيجة 1</td><td>(d) ⊥ (l) و (d) // (m)</td><td>(m) ⊥ (l)</td></tr>
<tr><td>نتيجة 2</td><td>(d) // (l) و (m) ⊥ (d)</td><td>(m) ⊥ (l)</td></tr>
</table>
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

  const lesson = await prisma.lesson.create({
    data: {
      title: lessonTitle,
      content: content,
      subject: { connect: { id: subject.id } },
      level: { connect: { id: level.id } },
      author: { connect: { id: teacher.id } },
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
      question: 'أكمل بالرمز المناسب (// أو ⊥):\n1. إذا كان (l) // (m) و (d) ⊥ (l)، فإن (d) .... (m)\n2. إذا كان (d) ⊥ (l) و (m) ⊥ (l)، فإن (d) .... (m)\n3. إذا كان (d) // (m) و (l) ⊥ (d)، فإن (l) .... (m)\n4. إذا كان (l) ⊥ (m) و (d) // (l)، فإن (d) .... (m)\n5. إذا كان (d) ⊥ (l) و (l) // (m)، فإن (d) .... (m)', 
      expectedResults: [
        { question: "1", result: "⊥" },
        { question: "2", result: "//" },
        { question: "3", result: "⊥" },
        { question: "4", result: "⊥" },
        { question: "5", result: "⊥" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'لاحظ الشكل ثم أكمل:\nالمعطيات: (d) ⊥ (l) ، (m) ⊥ (l) ، (n) ⊥ (d) ، (p) ⊥ (m)\n\n1. (d) .... (m)\n2. (n) .... (d)\n3. (n) .... (m)\n4. (p) .... (m)\n5. (n) .... (p)', 
      expectedResults: [
        { question: "1", result: "//" },
        { question: "2", result: "⊥" },
        { question: "3", result: "⊥" },
        { question: "4", result: "⊥" },
        { question: "5", result: "//" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'اختر الإجابة الصحيحة:\n1. إذا كان (d) ⊥ (l) و (m) ⊥ (l) فإن ... ( (d) ⊥ (m) / (d) // (m) / (d) = (m) )\n2. إذا كان (l) // (m) و (d) ⊥ (l) فإن ... ( (d) ⊥ (m) / (d) // (m) / (d) = (m) )\n3. مستقيمان عموديان على مستقيم ثالث يكونان ... ( متوازيين / متعامدين / متقاطعين )\n4. مستقيم يوازي أحد مستقيمين متوازيين فإنه ... ( يوازي الآخر / يعامد الآخر / يتقاطع مع الآخر )', 
      expectedResults: [
        { question: "1", result: "(d) // (m)" },
        { question: "2", result: "(d) ⊥ (m)" },
        { question: "3", result: "متوازيين" },
        { question: "4", result: "يوازي الآخر" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'أكمل الجملة:\n1. إذا كان (d) // (m) و (l) ⊥ (d)، فإن (l) .... (m)\n2. إذا كان (l) ⊥ (m) و (d) // (l)، فإن (d) .... (m)\n3. إذا كان (d) ⊥ (l) و (m) // (d)، فإن (m) .... (l)\n4. إذا كان (d) // (l) و (l) ⊥ (m)، فإن (d) .... (m)\n5. إذا كان (d) ⊥ (m) و (l) // (m)، فإن (d) .... (l)', 
      expectedResults: [
        { question: "1", result: "⊥" },
        { question: "2", result: "⊥" },
        { question: "3", result: "⊥" },
        { question: "4", result: "⊥" },
        { question: "5", result: "⊥" }
      ]
    },
    { 
      type: 'support_only', 
      question: 'ارسم ثم اكتب:\nعلى ورقة بيضاء:\n1. ارسم مستقيماً (d)\n2. ارسم مستقيماً (l) يعامد (d) في نقطة A •\n3. ارسم مستقيماً (m) يعامد (d) في نقطة B • مختلفة عن A\n\nماذا تلاحظ؟\n(l) .... (m) (لأنهما عموديان على نفس المستقيم (d))', 
      modelAnswer: '(l) // (m) - مستقيمان عموديان على نفس المستقيم هما متوازيان' 
    },
    { 
      type: 'support_with_results', 
      question: 'صحح الخطأ:\n1. إذا كان (d) ⊥ (l) و (m) ⊥ (l) فإن (d) ⊥ (m)\n2. إذا كان (l) // (m) و (d) ⊥ (l) فإن (d) // (m)\n3. مستقيمان عموديان على مستقيم ثالث يكونان متعامدين\n4. مستقيم عمودي على أحد مستقيمين متوازيين يكون موازياً للآخر', 
      expectedResults: [
        { question: "1", result: "(d) // (m)" },
        { question: "2", result: "(d) ⊥ (m)" },
        { question: "3", result: "متوازيين" },
        { question: "4", result: "عمودياً على الآخر" }
      ]
    },
    { 
      type: 'support_only', 
      question: 'أنشئ ثم استنتج:\nعلى ورقة بيضاء:\n1. ارسم مستقيماً (d)\n2. عين نقطة A • خارج (d)\n3. أنشئ مستقيماً (l) يشمل A ويعامد (d)\n4. عين نقطة B • أخرى خارج (d)\n5. أنشئ مستقيماً (m) يشمل B ويعامد (d)\n\nماذا تلاحظ؟ (l) .... (m)\nاكتب الخاصية: المستقيمان العموديان على نفس المستقيم هما ......', 
      modelAnswer: '(l) // (m) - مستقيمان عموديان على نفس المستقيم هما متوازيان' 
    },
    // تمارين رئيسية (30%)
    { 
      type: 'main', 
      question: 'مسألة إنشاء - مثلث قائم ومتوازيات:\nالمعطيات:\n- مثلث ABC قائم الزاوية في B\n- (AB) ⊥ (BC)\n- النقطة M • منتصف [AC]\n- النقطة N • منتصف [AB]\n- النقطة P • منتصف [BC]\n\nالمطلوب:\n1. ارسم الشكل\n2. أنشئ المستقيم (l) يشمل M ويوازي (AB)\n3. أنشئ المستقيم (m) يشمل M ويوازي (BC)\n4. ماذا تستنتج عن (l) و (BC)؟ ((l) .... (BC))\n5. ماذا تستنتج عن (m) و (AB)؟ ((m) .... (AB))\n6. ماذا تستنتج عن (l) و (m)؟ ((l) .... (m))', 
      modelAnswer: '4. (l) ⊥ (BC)\n5. (m) ⊥ (AB)\n6. (l) ⊥ (m)' 
    },
    { 
      type: 'main', 
      question: 'مسألة: مستطيل ومنتصفات:\nالمعطيات:\n- مستطيل EFGH حيث (EF) // (GH) و (EH) // (FG)\n- I • منتصف [EF]\n- J • منتصف [GH]\n- K • منتصف [EH]\n- L • منتصف [FG]\n\nالمطلوب:\n1. ارسم المستطيل\n2. أنشئ المستقيم (d) يشمل I ويعامد (EF)\n3. أنشئ المستقيم (l) يشمل J ويعامد (GH)\n4. ماذا تستنتج عن (d) و (l)؟ ((d) .... (l)) ولماذا؟\n5. أنشئ المستقيم (m) يشمل K ويعامد (EH)\n6. أنشئ المستقيم (n) يشمل L ويعامد (FG)\n7. ماذا تستنتج عن (m) و (n)؟ ((m) .... (n)) ولماذا؟', 
      modelAnswer: '4. (d) // (l) لأنهما عموديان على مستقيمين متوازيين (أو لأنهما عموديان على نفس المستقيم إذا اعتبرنا التمديد)\n7. (m) // (n)' 
    },
    { 
      type: 'main', 
      question: 'التحدي الكبير - إنشاء متكامل:\nالوضعية: مربع PQRS طول ضلعه 8cm.\n- I • منتصف [PQ]\n- J • منتصف [QR]\n- K • منتصف [RS]\n- L • منتصف [SP]\n- O • نقطة تقاطع القطرين [PR] و [QS]\n\nالمطلوب:\n1. ارسم المربع\n2. أنشئ المستقيم (d1) يشمل I ويعامد (PQ)\n3. أنشئ المستقيم (d2) يشمل K ويعامد (RS)\n4. أنشئ المستقيم (d3) يشمل J ويعامد (QR)\n5. أنشئ المستقيم (d4) يشمل L ويعامد (SP)\n\nأكمل بكتابة الرموز المناسبة:\n(PQ) .... (RS)\n(d1) .... (PQ)\n(d2) .... (RS)\n(d1) .... (d2)\n(d3) .... (d4)\n(d1) .... (d3)', 
      modelAnswer: '(PQ)//(RS)، (d1)⊥(PQ)، (d2)⊥(RS)، (d1)//(d2)، (d3)//(d4)، (d1)⊥(d3)' 
    },
  ];

  console.log(`📝 Adding ${exercises.length} exercises...`);
  for (const [index, ex] of exercises.entries()) {
    await prisma.exercise.create({
      data: {
        lessonId: lesson.id,
        question: ex.question,
        questionRichContent: ex.question,
        modelAnswer: ex.modelAnswer,
        expectedResults: ex.expectedResults,
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