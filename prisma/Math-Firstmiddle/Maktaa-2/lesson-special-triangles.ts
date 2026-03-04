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

  const lessonTitle = "المثلثات الخاصة + كيفية الإنشاء + خواص كل مثلث";

  // Content with SVGs
  const content = `
🔍 تمهيد: ما هي المثلثات الخاصة؟
<div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0; text-align: center;">
  <p>المثلثات الخاصة هي مثلثات تتميز بخصائص إضافية عن المثلث العادي، إما في أطوال أضلاعها أو في قياس زواياها.</p>

  <div style="display: flex; justify-content: center; gap: 20px; margin: 30px 0; flex-wrap: wrap;">
    <div style="text-align: center; background-color: white; padding: 15px; border-radius: 10px; border: 1px solid #ddd;">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <polygon points="20,80 80,80 50,20" fill="none" stroke="#1976D2" stroke-width="3"/>
        <text x="50" y="95" fill="black" font-size="10" text-anchor="middle">المثلث الكيفي</text>
      </svg>
    </div>
    <div style="text-align: center; background-color: white; padding: 15px; border-radius: 10px; border: 1px solid #ddd;">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <polygon points="20,80 80,80 50,30" fill="none" stroke="#c2185b" stroke-width="3"/>
        <line x1="70" y1="45" x2="60" y2="55" stroke="#c2185b" stroke-width="2"/>
        <line x1="30" y1="45" x2="40" y2="55" stroke="#c2185b" stroke-width="2"/>
        <text x="50" y="95" fill="black" font-size="10" text-anchor="middle">مثلث متساوي الساقين</text>
      </svg>
    </div>
    <div style="text-align: center; background-color: white; padding: 15px; border-radius: 10px; border: 1px solid #ddd;">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <polygon points="20,80 80,80 50,20" fill="none" stroke="#4CAF50" stroke-width="3"/>
        <line x1="30" y1="50" x2="40" y2="50" stroke="#c2185b" stroke-width="2"/>
        <line x1="60" y1="50" x2="70" y2="50" stroke="#c2185b" stroke-width="2"/>
        <line x1="45" y1="80" x2="55" y2="80" stroke="#c2185b" stroke-width="2" transform="rotate(90 50 80)"/>
        <text x="50" y="95" fill="black" font-size="10" text-anchor="middle">مثلث متقايس الأضلاع</text>
      </svg>
    </div>
    <div style="text-align: center; background-color: white; padding: 15px; border-radius: 10px; border: 1px solid #ddd;">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <polygon points="20,80 80,80 20,30" fill="none" stroke="#FF9800" stroke-width="3"/>
        <path d="M20 70 L30 70 L30 80 L20 80 Z" fill="green"/>
        <text x="50" y="95" fill="black" font-size="10" text-anchor="middle">مثلث قائم </text>
      </svg>
    </div>
  </div>
</div>

📐 أولاً: المثلث المتساوي الساقين
<div style="background-color: #f6f6f6; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h3>📝 التعريف</h3>
  <p>المثلث المتساوي الساقين هو مثلث له ضلعان متقايسان (متساويان في الطول).</p>
  
  <div style="display: flex; justify-content: center; align-items: center; gap: 50px; margin: 20px 0; flex-wrap: wrap;">
    <div style="text-align: center;">
      <svg width="200" height="150" viewBox="0 0 200 150">
        <polygon points="50,120 150,120 100,30" fill="none" stroke="#c2185b" stroke-width="3"/>
        <!-- Marks -->
        <line x1="70" y1="70" x2="80" y2="80" stroke="black" stroke-width="2"/>
        <line x1="120" y1="80" x2="130" y2="70" stroke="black" stroke-width="2"/>
        <!-- Labels -->
        <text x="40" y="135" fill="red">B</text>
        <text x="155" y="135" fill="red">C</text>
        <text x="95" y="20" fill="red">A</text>
        <text x="100" y="140" fill="green" font-size="12">القاعدة</text>
      </svg>
    </div>
    <div>
      <p><strong>مصطلحات:</strong></p>
      <ul>
        <li><strong>رأس المثلث:</strong> النقطة A (التي تلتقي فيها الساقان)</li>
        <li><strong>القاعدة:</strong> الضلع [BC] المقابل للرأس</li>
        <li><strong>الساقان:</strong> الضلعان المتساويان [AB] و [AC]</li>
      </ul>
      <p>نكتب: AB = AC</p>
    </div>
  </div>
</div>

<div style="background-color: #fff3cd; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h3>🌟 خواص المثلث المتساوي الساقين</h3>
  <ul>
    <li><strong>خاصية 1:</strong> زاويتا القاعدة متقايستان (B̂ = Ĉ).</li>
    <li><strong>خاصية 2:</strong> الارتفاع النازل من الرأس ينصف القاعدة ويكون محور تناظر للمثلث.</li>
  </ul>
</div>

<div style="background-color: #f6f6f6; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h3>✏️ كيفية الإنشاء (باستخدام المدور)</h3>
  <p><strong>مثال:</strong> أنشئ مثلثاً ABC متساوي الساقين رأسه A، قاعدته BC = 5cm وساقاه 6cm.</p>
  <ol>
    <li>ارسم القاعدة [BC] بطول 5cm.</li>
    <li>افتح المدور بفتحة 6cm.</li>
    <li>ضع إبرة المدور في B وارسم قوساً.</li>
    <li>بنفس الفتحة، ضع الإبرة في C وارسم قوساً يقطع الأول في A.</li>
    <li>صل النقاط.</li>
  </ol>
</div>

📐 ثانياً: المثلث متقايس الأضلاع
<div style="background-color: #f6f6f6; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h3>📝 التعريف</h3>
  <p>المثلث متقايس الأضلاع هو مثلث أضلاعه الثلاثة متقايسة.</p>
  
  <div style="text-align: center; margin: 20px 0;">
    <svg width="200" height="150" viewBox="0 0 200 150">
      <polygon points="50,120 150,120 100,33" fill="none" stroke="#4CAF50" stroke-width="3"/>
      <!-- Marks -->
      <line x1="95" y1="120" x2="105" y2="120" stroke="black" stroke-width="2" transform="rotate(90 100 120)"/>
      <line x1="70" y1="70" x2="80" y2="80" stroke="black" stroke-width="2"/>
      <line x1="120" y1="80" x2="130" y2="70" stroke="black" stroke-width="2"/>
      <text x="40" y="135" fill="red">B</text>
      <text x="155" y="135" fill="red">C</text>
      <text x="95" y="25" fill="red">A</text>
    </svg>
    <p>نكتب: AB = BC = AC</p>
  </div>
</div>

<div style="background-color: #fff3cd; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h3>🌟 خواص المثلث متقايس الأضلاع</h3>
  <ul>
    <li>جميع الأضلاع متساوية الطول.</li>
    <li>جميع الزوايا متقايسة وقياس كل منها <strong>60°</strong>.</li>
  </ul>
</div>

📐 ثالثاً: المثلث القائم
<div style="background-color: #f6f6f6; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h3>📝 التعريف</h3>
  <p>المثلث القائم هو مثلث له زاوية قائمة (90°).</p>
  
  <div style="display: flex; justify-content: center; align-items: center; gap: 50px; margin: 20px 0; flex-wrap: wrap;">
    <div style="text-align: center;">
      <svg width="200" height="150" viewBox="0 0 200 150">
        <polygon points="50,120 50,30 150,120" fill="none" stroke="#FF9800" stroke-width="3"/>
        <!-- Right Angle Mark -->
        <path d="M50 110 L60 110 L60 120" fill="none" stroke="black" stroke-width="2"/>
        <text x="40" y="135" fill="red">A</text>
        <text x="40" y="25" fill="red">B</text>
        <text x="155" y="135" fill="red">C</text>
        <text x="100" y="70" fill="blue" font-size="12">الوتر</text>
      </svg>
    </div>
    <div>
      <p><strong>مصطلحات:</strong></p>
      <ul>
        <li><strong>الزاوية القائمة:</strong> الزاوية A = 90°</li>
        <li><strong>الضلعان القائمان:</strong> [AB] و [AC]</li>
        <li><strong>الوتر:</strong> [BC] (الضلع المقابل للزاوية القائمة وهو الأطول)</li>
      </ul>
    </div>
  </div>
</div>

📊 جدول ملخص
<div style="background-color: #e3f2fd; padding: 20px; border-radius: 15px; margin: 30px 0; overflow-x: auto;">
  <table style="width:100%; text-align:right; border-collapse: collapse; min-width: 500px;">
    <tr style="border-bottom: 1px solid #ccc;"><th>نوع المثلث</th><th>الأضلاع</th><th>الزوايا</th></tr>
    <tr><td>متساوي الساقين</td><td>ضلعان متساويان</td><td>زاويتا القاعدة متساويتان</td></tr>
    <tr><td>متقايس الأضلاع</td><td>3 أضلاع متساوية</td><td>3 زوايا متساوية (60°)</td></tr>
    <tr><td>قائم الزاوية</td><td>ضلعان قائمان + وتر</td><td>زاوية قائمة (90°)</td></tr>
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
    // تمارين الدعم + نتائج (70%)
    { 
      type: 'support_with_results', 
      question: 'أكمل الفراغات:\n1. المثلث المتساوي الساقين له ...... ضلعان متساويان\n2. المثلث المتساوي الأضلاع له ...... أضلاع متساوية\n3. المثلث القائم الزاوية له زاوية قياسها ...... درجة\n4. في المثلث المتساوي الساقين، زاويتا القاعدة ...... متساويتان\n5. في المثلث المتساوي الأضلاع، كل زاوية قياسها ...... درجة', 
      expectedResults: [
        { question: "1", result: "ضلعان" },
        { question: "2", result: "ثلاثة" },
        { question: "3", result: "90" },
        { question: "4", result: "متساويتان" },
        { question: "5", result: "60" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'حدد نوع المثلث بناءً على أطوال أضلاعه:\n1. AB = 5 cm، BC = 5 cm، AC = 5 cm\n2. AB = 4 cm، BC = 4 cm، AC = 6 cm\n3. AB = 3 cm، BC = 4 cm، AC = 5 cm (علماً أن 3² + 4² = 5²)\n4. AB = 7 cm، BC = 7 cm، AC = 7 cm\n5. AB = 6 cm، BC = 8 cm، AC = 10 cm', 
      expectedResults: [
        { question: "1", result: "متساوي الأضلاع" },
        { question: "2", result: "متساوي الساقين" },
        { question: "3", result: "قائم الزاوية" },
        { question: "4", result: "متساوي الأضلاع" },
        { question: "5", result: "قائم الزاوية" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'أوجد قياس الزوايا الناقصة:\n1. ABC متساوي الأضلاع، قياس الزاوية A = ...\n2. ABC متساوي الساقين رأسه A، الزاوية B = 40°، إذن الزاوية C = ...\n3. ABC قائم في A، الزاوية B = 30°، إذن الزاوية C = ...\n4. ABC متساوي الساقين رأسه A، الزاوية A = 50°، إذن الزاوية B = ...\n5. ABC قائم في B، الزاوية A = 45°، إذن الزاوية C = ...', 
      expectedResults: [
        { question: "1", result: "60" },
        { question: "2", result: "40" },
        { question: "3", result: "60" },
        { question: "4", result: "65" },
        { question: "5", result: "45" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'اختر الإجابة الصحيحة:\n1. في المثلث المتساوي الساقين، زاويتا القاعدة ... (متساويتان / مختلفتان / قائمتان)\n2. في المثلث المتساوي الأضلاع، كل زاوية تساوي ... (60° / 90° / 45°)\n3. الوتر هو أطول ضلع في المثلث ... (القائم / المتساوي الساقين / المتساوي الأضلاع)\n4. مجموع الزاويتين الحادتين في المثلث القائم يساوي ... (90° / 180° / 60°)\n5. المثلث الذي أضلاعه 3cm، 4cm، 5cm هو ... (قائم / متساوي الساقين / متساوي الأضلاع)', 
      expectedResults: [
        { question: "1", result: "متساويتان" },
        { question: "2", result: "60°" },
        { question: "3", result: "القائم" },
        { question: "4", result: "90°" },
        { question: "5", result: "قائم" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'أكمل الجدول (اكتب العدد):\n1. عدد الأضلاع المتساوية في المثلث متساوي الساقين\n2. عدد الزوايا المتساوية في المثلث متساوي الساقين\n3. عدد الأضلاع المتساوية في المثلث متساوي الأضلاع\n4. عدد الزوايا المتساوية في المثلث متساوي الأضلاع\n5. عدد الزوايا القائمة في المثلث القائم', 
      expectedResults: [
        { question: "1", result: "2" },
        { question: "2", result: "2" },
        { question: "3", result: "3" },
        { question: "4", result: "3" },
        { question: "5", result: "1" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'احسب الطول المطلوب:\n1. ABC متساوي الأضلاع محيطه 18 cm، طول الضلع = ...\n2. ABC متساوي الساقين (AB = AC)، AB = 5 cm، BC = 6 cm، المحيط = ...\n3. ABC قائم في A، AB = 3 cm، AC = 4 cm، BC = ... (علماً أن 3² + 4² = BC²)', 
      expectedResults: [
        { question: "1", result: "6" },
        { question: "2", result: "16" },
        { question: "3", result: "5" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'صحح الخطأ (اكتب "صحيح" أو التصحيح):\n1. المثلث المتساوي الأضلاع له ضلعان متساويان فقط\n2. المثلث القائم الزاوية له زاوية منفرجة\n3. في المثلث المتساوي الساقين، جميع الزوايا متساوية\n4. الوتر هو أقصر ضلع في المثلث القائم\n5. المثلث الذي أضلاعه 5cm، 5cm، 5cm هو متساوي الساقين فقط', 
      expectedResults: [
        { question: "1", result: "ثلاثة أضلاع" },
        { question: "2", result: "زاوية قائمة" },
        { question: "3", result: "زاويتا القاعدة فقط" },
        { question: "4", result: "أطول ضلع" },
        { question: "5", result: "متساوي الأضلاع" }
      ]
    },
    // تمارين رئيسية (30%)
    { 
      type: 'main', 
      question: 'مسألة إنشاء - مثلث متساوي الساقين:\nالوضعية: أنشئ مثلثاً ABC متساوي الساقين رأسه A بحيث:\n- قاعدة المثلث BC = 6 cm\n- طول كل ساق AB = AC = 5 cm\n\nالمطلوب:\n1. أرسم الشكل باتباع خطوات الإنشاء.\n2. احسب محيط المثلث.\n3. عين النقطة H مسقط A على (BC) (ارسم الارتفاع).\n4. ماذا تلاحظ بخصوص (AH) و (BC)؟ وبخصوص الطولين BH و HC؟', 
      modelAnswer: '1. الرسم (قاعدة 6سم، قوسين 5سم من الطرفين).\n2. المحيط = 5 + 5 + 6 = 16 cm.\n3. الرسم.\n4. (AH) ⊥ (BC) و BH = HC = 3 cm.' 
    },
    { 
      type: 'main', 
      question: 'مسألة إنشاء - مثلث متقايس الأضلاع:\nالوضعية: أنشئ مثلثاً XYZ متقايس الأضلاع طول ضلعه 4 cm.\n\nالمطلوب:\n1. أرسم الشكل بدقة.\n2. ما هو قياس الزاوية X؟ والزاوية Y؟\n3. احسب محيط هذا المثلث.\n4. إذا علمت أن ارتفاعه يساوي تقريباً 3.5 cm، احسب مساحته (القاعدة × الارتفاع ÷ 2).', 
      modelAnswer: '1. الرسم.\n2. X = 60°، Y = 60°.\n3. المحيط = 4 × 3 = 12 cm.\n4. المساحة = (4 × 3.5) ÷ 2 = 7 cm².' 
    },
    { 
      type: 'main', 
      question: 'مسألة إنشاء - مثلث قائم:\nالوضعية: أنشئ مثلثاً EFG قائماً في E، حيث EF = 3 cm و EG = 4 cm.\n\nالمطلوب:\n1. أرسم الشكل.\n2. قس طول الوتر [FG] بالمسطرة.\n3. احسب مساحة المثلث (جداء الضلعين القائمين ÷ 2).\n4. ما هو نوع المثلث إذا كان EF = EG؟', 
      modelAnswer: '1. الرسم.\n2. FG = 5 cm.\n3. المساحة = (3 × 4) ÷ 2 = 6 cm².\n4. مثلث قائم ومتساوي الساقين.' 
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