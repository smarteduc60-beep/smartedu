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

  const lessonTitle = "الرباعيات الخاصة (المربع - المستطيل - المعين) + الخواص";

  // Content with SVGs
  const content = `
🔍 تمهيد: ما هي الرباعيات الخاصة؟
<div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0; text-align: center;">
  <p>الرباعيات الخاصة هي أشكال هندسية رباعية الأضلاع تتميز بخصائص إضافية في أضلاعها وزواياها وأقطارها.</p>

  <div style="display: flex; justify-content: center; gap: 30px; margin: 30px 0; flex-wrap: wrap;">
    <div style="text-align: center; background-color: white; padding: 15px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <rect x="20" y="20" width="80" height="80" fill="none" stroke="#1976D2" stroke-width="3"/>
        <text x="60" y="110" fill="black" font-size="12" text-anchor="middle">المربع</text>
      </svg>
    </div>
    <div style="text-align: center; background-color: white; padding: 15px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <rect x="20" y="35" width="80" height="50" fill="none" stroke="#c2185b" stroke-width="3"/>
        <text x="60" y="110" fill="black" font-size="12" text-anchor="middle">المستطيل</text>
      </svg>
    </div>
    <div style="text-align: center; background-color: white; padding: 15px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <polygon points="60,20 100,60 60,100 20,60" fill="none" stroke="#4CAF50" stroke-width="3"/>
        <text x="60" y="110" fill="black" font-size="12" text-anchor="middle">المعين</text>
      </svg>
    </div>
  </div>
</div>

📐 أولاً: المستطيل
<div style="background-color: #f6f6f6; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h3>📝 التعريف</h3>
  <p>المستطيل هو رباعي أضلاع له أربع زوايا قائمة.</p>
  
  <div style="display: flex; justify-content: center; align-items: center; gap: 50px; margin: 20px 0; flex-wrap: wrap;">
    <div style="text-align: center;">
      <svg width="200" height="150" viewBox="0 0 200 150">
        <!-- Rectangle -->
        <rect x="30" y="30" width="140" height="80" fill="none" stroke="#c2185b" stroke-width="3"/>
        <!-- Right Angle Marks -->
        <path d="M30 30 L40 30 L40 40 L30 40 Z" fill="green"/>
        <path d="M170 30 L160 30 L160 40 L170 40 Z" fill="green"/>
        <path d="M30 110 L40 110 L40 100 L30 100 Z" fill="green"/>
        <path d="M170 110 L160 110 L160 100 L170 100 Z" fill="green"/>
        <!-- Labels -->
        <text x="20" y="25" fill="red">A</text>
        <text x="175" y="25" fill="red">B</text>
        <text x="175" y="125" fill="red">C</text>
        <text x="20" y="125" fill="red">D</text>
        <text x="100" y="20" fill="blue" text-anchor="middle">الطول L</text>
        <text x="185" y="75" fill="blue">العرض l</text>
      </svg>
    </div>
    <div>
      <p><strong>مصطلحات:</strong></p>
      <ul>
        <li><strong>الطول:</strong> الضلع الأطول AB أو CD</li>
        <li><strong>العرض:</strong> الضلع الأقصر AD أو BC</li>
        <li><strong>الأقطار:</strong> [AC] و [BD]</li>
      </ul>
      <p>نكتب: A = B = C = D = 90°</p>
    </div>
  </div>
</div>

<div style="background-color: #fff3cd; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h3>🌟 خواص المستطيل</h3>
  <ul>
    <li>كل ضلعين متقابلين متوازيان ومتساويان.</li>
    <li>جميع الزوايا قائمة (90°).</li>
    <li>القطران متساويان ومتناصفان (يتقاطعان في المنتصف O).</li>
  </ul>
  <div style="text-align: center; margin: 20px 0;">
    <svg width="200" height="150" viewBox="0 0 200 150">
      <rect x="30" y="30" width="140" height="80" fill="none" stroke="black" stroke-width="2"/>
      <!-- Diagonals -->
      <line x1="30" y1="30" x2="170" y2="110" stroke="red" stroke-width="2" stroke-dasharray="5"/>
      <line x1="170" y1="30" x2="30" y2="110" stroke="red" stroke-width="2" stroke-dasharray="5"/>
      <circle cx="100" cy="70" r="3" fill="red"/>
      <text x="100" y="60" fill="red" text-anchor="middle">O</text>
    </svg>
    <p><strong>O مركز تناظر المستطيل</strong></p>
  </div>
</div>

📐 ثانياً: المربع
<div style="background-color: #f6f6f6; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h3>📝 التعريف</h3>
  <p>المربع هو رباعي الأضلاع له أربع زوايا قائمة وأربع أضلاع متساوية.</p>
  
  <div style="display: flex; justify-content: center; margin: 20px 0;">
    <svg width="200" height="200" viewBox="0 0 200 200">
      <!-- Square -->
      <rect x="40" y="40" width="120" height="120" fill="none" stroke="#1976D2" stroke-width="3"/>
      <!-- Right Angle Marks -->
      <path d="M40 40 L50 40 L50 50 L40 50 Z" fill="green"/>
      <path d="M160 40 L150 40 L150 50 L160 50 Z" fill="green"/>
      <path d="M40 160 L50 160 L50 150 L40 150 Z" fill="green"/>
      <path d="M160 160 L150 160 L150 150 L160 150 Z" fill="green"/>
      <!-- Equal Sides Marks -->
      <line x1="70" y1="40" x2="80" y2="40" stroke="black" stroke-width="2"/>
      <line x1="75" y1="35" x2="85" y2="35" stroke="black" stroke-width="2"/>
      <line x1="120" y1="40" x2="130" y2="40" stroke="black" stroke-width="2"/>
      <line x1="125" y1="35" x2="135" y2="35" stroke="black" stroke-width="2"/>
      <!-- Labels -->
      <text x="30" y="35" fill="red">A</text>
      <text x="165" y="35" fill="red">B</text>
      <text x="165" y="175" fill="red">C</text>
      <text x="30" y="175" fill="red">D</text>
    </svg>
  </div>
  <p>نكتب: AB = BC = CD = DA و A = B = C = D = 90°</p>
</div>

<div style="background-color: #fff3cd; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h3>🌟 خواص المربع</h3>
  <ul>
    <li>جميع الأضلاع متساوية وجميع الزوايا قائمة.</li>
    <li>القطران متساويان، متعامدان، ومتناصفان.</li>
    <li>القطران ينصفان الزوايا.</li>
  </ul>
  <div style="display: flex; justify-content: center; gap: 30px; margin: 20px 0;">
    <svg width="150" height="150" viewBox="0 0 150 150">
      <rect x="25" y="25" width="100" height="100" fill="none" stroke="black" stroke-width="2"/>
      <line x1="25" y1="25" x2="125" y2="125" stroke="red" stroke-width="2"/>
      <line x1="125" y1="25" x2="25" y2="125" stroke="red" stroke-width="2"/>
      <circle cx="75" cy="75" r="3" fill="red"/>
      <text x="80" y="65" fill="red">O</text>
      <text x="90" y="90" fill="blue">⊥</text>
    </svg>
  </div>
</div>

📐 ثالثاً: المعين
<div style="background-color: #f6f6f6; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h3>📝 التعريف</h3>
  <p>المعين هو رباعي الأضلاع له أربع أضلاع متساوية (مربع مائل).</p>
  
  <div style="display: flex; justify-content: center; align-items: center; gap: 50px; margin: 20px 0; flex-wrap: wrap;">
    <div style="text-align: center;">
      <svg width="200" height="150" viewBox="0 0 200 150">
        <!-- Rhombus -->
        <polygon points="40,75 100,30 160,75 100,120" fill="none" stroke="#4CAF50" stroke-width="3"/>
        <!-- Equal Sides Marks -->
        <line x1="60" y1="60" x2="70" y2="70" stroke="black" stroke-width="2"/>
        <line x1="65" y1="55" x2="75" y2="65" stroke="black" stroke-width="2"/>
        <line x1="130" y1="60" x2="140" y2="70" stroke="black" stroke-width="2"/>
        <line x1="135" y1="55" x2="145" y2="65" stroke="black" stroke-width="2"/>
        <!-- Labels -->
        <text x="30" y="75" fill="red">A</text>
        <text x="100" y="20" fill="red">B</text>
        <text x="170" y="75" fill="red">C</text>
        <text x="100" y="135" fill="red">D</text>
      </svg>
    </div>
    <div>
      <p><strong>ملاحظة:</strong> المربع هو حالة خاصة من المعين (زواياه قائمة).</p>
    </div>
  </div>
  <p>نكتب: AB = BC = CD = DA</p>
</div>

<div style="background-color: #fff3cd; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h3>🌟 خواص المعين</h3>
  <ul>
    <li>جميع الأضلاع متساوية.</li>
    <li>كل زاويتين متقابلتين متقايستان.</li>
    <li>القطران متعامدان ومتناصفان.</li>
    <li>القطران ينصفان الزوايا.</li>
  </ul>
  <div style="text-align: center; margin: 20px 0;">
    <svg width="200" height="150" viewBox="0 0 200 150">
      <polygon points="40,75 100,30 160,75 100,120" fill="none" stroke="black" stroke-width="2"/>
      <line x1="40" y1="75" x2="160" y2="75" stroke="red" stroke-width="2" stroke-dasharray="4"/>
      <line x1="100" y1="30" x2="100" y2="120" stroke="red" stroke-width="2" stroke-dasharray="4"/>
      <circle cx="100" cy="75" r="3" fill="red"/>
      <text x="105" y="65" fill="red">O</text>
      <text x="110" y="55" fill="blue">⊥</text>
    </svg>
    <p><strong>القطران متعامدان: (AC) ⊥ (BD)</strong></p>
  </div>
</div>

📊 جدول مقارنة الرباعيات الخاصة
<div style="background-color: #e3f2fd; padding: 20px; border-radius: 15px; margin: 30px 0; overflow-x: auto;">
  <table style="width:100%; text-align:right; border-collapse: collapse; min-width: 500px;">
    <tr style="border-bottom: 1px solid #ccc;"><th>الخاصية</th><th>المستطيل</th><th>المربع</th><th>المعين</th></tr>
    <tr><td>جميع الأضلاع متساوية</td><td>✗</td><td>✓</td><td>✓</td></tr>
    <tr><td>جميع الزوايا قائمة (90°)</td><td>✓</td><td>✓</td><td>✗</td></tr>
    <tr><td>القطران متساويان</td><td>✓</td><td>✓</td><td>✗</td></tr>
    <tr><td>القطران متعامدان</td><td>✗</td><td>✓</td><td>✓</td></tr>
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

  // إضافة التمارين (100% دعم + نتائج)
  const exercises = [
    { 
      type: 'support_with_results', 
      question: 'أكمل الفراغات:\n1. المستطيل هو رباعي أضلاع له ...... زوايا قائمة\n2. المربع هو رباعي أضلاع له ...... أضلاع متساوية و ...... زوايا قائمة\n3. المعين هو رباعي أضلاع له ...... أضلاع متساوية\n4. في المستطيل، القطران ...... متساويان\n5. في المعين، القطران ...... متعامدان', 
      expectedResults: [
        { question: "1", result: "أربع" },
        { question: "2", result: "أربع" },
        { question: "3", result: "أربع" },
        { question: "4", result: "متساويان" },
        { question: "5", result: "متعامدان" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'اختر الإجابة الصحيحة:\n1. الشكل الذي جميع أضلاعه متساوية هو ... (المستطيل / المربع / كلاهما)\n2. الشكل الذي جميع زواياه قائمة هو ... (المعين / المستطيل / المربع والمستطيل)\n3. الشكل الذي قطراه متعامدان هو ... (المستطيل / المربع والمعين / المستطيل والمربع)\n4. الشكل الذي قطراه متساويان هو ... (المربع فقط / المستطيل فقط / المربع والمستطيل)\n5. الشكل الذي قطراه ينصفان الزوايا هو ... (المستطيل / المربع والمعين / المعين فقط)', 
      expectedResults: [
        { question: "1", result: "المربع" },
        { question: "2", result: "المربع والمستطيل" },
        { question: "3", result: "المربع والمعين" },
        { question: "4", result: "المربع والمستطيل" },
        { question: "5", result: "المربع والمعين" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'أكمل جدول الخصائص (اكتب "نعم" أو "لا"):\n1. المستطيل: جميع الأضلاع متساوية؟\n2. المربع: جميع الزوايا قائمة؟\n3. المعين: الأقطار متساوية؟\n4. المربع: الأقطار متعامدة؟\n5. المعين: الأقطار تنصف الزوايا؟', 
      expectedResults: [
        { question: "1", result: "لا" },
        { question: "2", result: "نعم" },
        { question: "3", result: "لا" },
        { question: "4", result: "نعم" },
        { question: "5", result: "نعم" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'صحح الخطأ (اكتب التصحيح):\n1. المستطيل له أربع أضلاع متساوية\n2. المعين له أربع زوايا قائمة\n3. المربع قطراه غير متساويين\n4. المعين قطراه متساويان\n5. المستطيل قطراه متعامدان', 
      expectedResults: [
        { question: "1", result: "له أربع زوايا قائمة وأضلاع متقابلة متساوية" },
        { question: "2", result: "له أربع أضلاع متساوية وزواياه ليست قائمة" },
        { question: "3", result: "قطراه متساويان" },
        { question: "4", result: "قطراه غير متساويين" },
        { question: "5", result: "قطراه غير متعامدين" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'لاحظ الشكل ثم أجب (اكتب اسم الشكل):\n1. الشكل ذو الأضلاع المتساوية والزوايا القائمة هو ...\n2. الشكل ذو الزوايا القائمة والأضلاع المتقابلة المتساوية فقط هو ...\n3. الشكل ذو الأضلاع المتساوية والزوايا غير القائمة هو ...\n4. الشكل الذي قطراه متعامدان (دون أن يكون مربعاً) هو ...', 
      expectedResults: [
        { question: "1", result: "المربع" },
        { question: "2", result: "المستطيل" },
        { question: "3", result: "المعين" },
        { question: "4", result: "المعين" }
      ]
    },
  ];

  console.log(`📝 Adding ${exercises.length} exercises...`);
  for (const [index, ex] of exercises.entries()) {
    await prisma.exercise.create({
      data: {
        lessonId: lesson.id,
        question: ex.question,
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