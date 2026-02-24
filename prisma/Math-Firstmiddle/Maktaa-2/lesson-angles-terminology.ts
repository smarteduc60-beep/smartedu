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

  const lessonTitle = "الزاوية + مصطلحات وترميزات";

  // Content with SVGs
  const content = `
🔍 تمهيد: ماذا نعني بالزاوية؟
<div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0; text-align: center;">
  <p>الزاوية هي المنطقة المحصورة بين مستقيمين (نصفي مستقيم) يلتقيان في نقطة مشتركة تسمى <strong>رأس الزاوية</strong>.</p>

  <div style="display: flex; justify-content: center; margin: 30px 0;">
    <div style="text-align: center; background: white; padding: 20px; border-radius: 10px; border: 1px solid #ddd;">
      <svg width="200" height="150" viewBox="0 0 200 150">
        <!-- Rays -->
        <line x1="50" y1="120" x2="150" y2="40" stroke="#1976D2" stroke-width="3" />
        <line x1="50" y1="120" x2="180" y2="120" stroke="#C2185B" stroke-width="3" />
        
        <!-- Points -->
        <circle cx="50" cy="120" r="4" fill="red" />
        <text x="35" y="135" fill="red" font-weight="bold" font-size="14">O</text>
        
        <circle cx="120" y1="64" r="3" fill="#1976D2" />
        <text x="125" y="55" fill="#1976D2" font-weight="bold" font-size="14">A</text>
        
        <circle cx="150" cy="120" r="3" fill="#C2185B" />
        <text x="150" y="140" fill="#C2185B" font-weight="bold" font-size="14">B</text>
        
        <!-- Angle Arc -->
        <path d="M 80 120 A 30 30 0 0 0 75 100" stroke="green" stroke-width="2" fill="none" />
      </svg>
      <p style="margin-top: 10px;"><strong>الزاوية AOB</strong></p>
    </div>
  </div>
  <p>نكتب: <span style="font-family: 'Times New Roman', serif; font-size: 1.2em;">AÔB</span> أو <span style="font-family: 'Times New Roman', serif; font-size: 1.2em;">Ô</span> أو <span style="font-family: 'Times New Roman', serif; font-size: 1.2em;">(OA, OB)</span></p>
</div>

📝 المصطلحات والترميزات الأساسية
<div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0; overflow-x: auto;">
<table style="width:100%; text-align:right; border-collapse: collapse; min-width: 500px;">
<tr style="border-bottom: 1px solid #ccc;"><th>المصطلح</th><th>التعريف</th><th>الترميز</th><th>مثال</th></tr>
<tr><td>رأس الزاوية</td><td>النقطة المشتركة حيث يلتقي الضلعان</td><td>حرف كبير</td><td>O •</td></tr>
<tr><td>ضلعا الزاوية</td><td>نصفا المستقيمين اللذان يشكلان الزاوية</td><td> (OA] و (OB]</td><td>(OA]</td></tr>
<tr><td>الزاوية</td><td>المنطقة المحصورة بين الضلعين</td><td>3 أحرف أو حرف واحد</td><td>AÔB</td></tr>
<tr><td>قياس الزاوية</td><td>مقدار فتحة الزاوية بالدرجات</td><td>رقم °</td><td>60°</td></tr>
</table>
</div>

📐 عناصر الزاوية

<div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">

  <!-- Vertex -->
  <div style="background-color: #f6f6f6; padding: 15px; border-radius: 15px; width: 45%; min-width: 300px; text-align: center;">
    <h3>① رأس الزاوية (Sommet)</h3>
    <p>هو النقطة المشتركة التي ينطلق منها ضلعا الزاوية.</p>
    <svg width="200" height="120" viewBox="0 0 200 120" style="margin: 10px auto; background: white; border-radius: 10px;">
      <line x1="50" y1="100" x2="120" y2="30" stroke="#ddd" stroke-width="2" />
      <line x1="50" y1="100" x2="150" y2="100" stroke="#ddd" stroke-width="2" />
      <circle cx="50" cy="100" r="6" fill="red" />
      <text x="30" y="115" fill="red" font-weight="bold" font-size="16">O</text>
    </svg>
    <p>يكتب دائماً في المنتصف: A<strong>Ô</strong>B</p>
  </div>

  <!-- Sides -->
  <div style="background-color: #f6f6f6; padding: 15px; border-radius: 15px; width: 45%; min-width: 300px; text-align: center;">
    <h3>② ضلعا الزاوية (Côtés)</h3>
    <p>هما نصفا المستقيمين اللذان ينطلقان من الرأس.</p>
    <svg width="200" height="120" viewBox="0 0 200 120" style="margin: 10px auto; background: white; border-radius: 10px;">
      <line x1="50" y1="100" x2="120" y2="30" stroke="#1976D2" stroke-width="4" />
      <line x1="50" y1="100" x2="150" y2="100" stroke="#C2185B" stroke-width="4" />
      <circle cx="50" cy="100" r="4" fill="black" />
      <text x="125" y="30" fill="#1976D2" font-weight="bold">(OA]</text>
      <text x="170" y="120" fill="#C2185B" font-weight="bold">(OB]</text>
    </svg>
    <p>نكتب: (OA] و (OB]</p>
  </div>

</div>

📐 أنواع الزوايا (Types d'angles)

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 30px 0;">
  
  <!-- Acute -->
  <div style="background-color: #ffebee; padding: 15px; border-radius: 10px; text-align: center;">
    <svg width="120" height="100" viewBox="0 0 120 100" style="margin: 0 auto;">
      <line x1="20" y1="80" x2="100" y2="80" stroke="black" stroke-width="2" />
      <line x1="20" y1="80" x2="80" y2="20" stroke="black" stroke-width="2" />
      <path d="M 40 80 A 20 20 0 0 0 35 65" stroke="red" fill="none" />
      <text x="50" y="50" fill="red" font-size="12">45°</text>
    </svg>
    <p><strong>زاوية حادة</strong></p>
    <p>أقل من 90°</p>
  </div>

  <!-- Right -->
  <div style="background-color: #e8f5e9; padding: 15px; border-radius: 10px; text-align: center;">
    <svg width="120" height="100" viewBox="0 0 120 100" style="margin: 0 auto;">
      <line x1="20" y1="80" x2="100" y2="80" stroke="black" stroke-width="2" />
      <line x1="20" y1="80" x2="20" y2="20" stroke="black" stroke-width="2" />
      <rect x="20" y="65" width="15" height="15" fill="none" stroke="green" stroke-width="2" />
      <text x="45" y="50" fill="green" font-size="12">90°</text>
    </svg>
    <p><strong>زاوية قائمة</strong></p>
    <p>تساوي 90°</p>
  </div>

  <!-- Obtuse -->
  <div style="background-color: #e3f2fd; padding: 15px; border-radius: 10px; text-align: center;">
    <svg width="120" height="100" viewBox="0 0 120 100" style="margin: 0 auto;">
      <line x1="60" y1="80" x2="110" y2="80" stroke="black" stroke-width="2" />
      <line x1="60" y1="80" x2="10" y2="30" stroke="black" stroke-width="2" />
      <path d="M 80 80 A 20 20 0 0 0 50 70" stroke="blue" fill="none" />
      <text x="50" y="40" fill="blue" font-size="12">135°</text>
    </svg>
    <p><strong>زاوية منفرجة</strong></p>
    <p>بين 90° و 180°</p>
  </div>

  <!-- Straight -->
  <div style="background-color: #fff3e0; padding: 15px; border-radius: 10px; text-align: center;">
    <svg width="120" height="100" viewBox="0 0 120 100" style="margin: 0 auto;">
      <line x1="10" y1="50" x2="110" y2="50" stroke="black" stroke-width="2" />
      <circle cx="60" cy="50" r="3" fill="orange" />
      <path d="M 80 50 A 20 20 0 0 0 40 50" stroke="orange" fill="none" />
      <text x="50" y="30" fill="orange" font-size="12">180°</text>
    </svg>
    <p><strong>زاوية مستقيمة</strong></p>
    <p>تساوي 180°</p>
  </div>

</div>

✅ أمثلة تطبيقية محلولة
<div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h4>📌 المثال 1: تسمية الزاوية</h4>
  <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
    <svg width="150" height="120" viewBox="0 0 150 120" style="background: white; border-radius: 10px;">
      <line x1="50" y1="80" x2="30" y2="20" stroke="#1976D2" stroke-width="3" />
      <line x1="50" y1="80" x2="120" y2="80" stroke="#C2185B" stroke-width="3" />
      <circle cx="50" cy="80" r="4" fill="red" />
      <text x="35" y="95" fill="red" font-weight="bold">O</text>
      <text x="20" y="15" fill="#1976D2">A</text>
      <text x="135" y="95" fill="#C2185B">B</text>
    </svg>
    <div>
      <p><strong>المطلوب:</strong> اكتب الزاوية بثلاث طرق.</p>
      <p><strong>الحل:</strong></p>
      <ul>
        <li>بالثلاثة أحرف: <strong>AÔB</strong></li>
        <li>برأس الزاوية: <strong>Ô</strong></li>
        <li>بالضلعين: <strong>(OA, OB)</strong></li>
      </ul>
    </div>
  </div>
</div>

📊 جدول ملخص
<div style="background-color: #fff3cd; padding: 20px; border-radius: 15px; margin: 30px 0;">
راجع الجدول في بداية الدرس للملخص الكامل.
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
      question: 'أكمل الفراغات:\n1. الزاوية هي المنطقة المحصورة بين ....... يلتقيان في نقطة مشتركة\n2. النقطة المشتركة تسمى ....... الزاوية\n3. نصفا المستقيمين اللذان يشكلان الزاوية يسميان ....... الزاوية\n4. نرمز للزاوية رأسها O بثلاثة أحرف: .... O ....\n5. الزاوية القائمة قياسها ....... درجة', 
      expectedResults: [
        { question: "1", result: "مستقيمين" },
        { question: "2", result: "رأس" },
        { question: "3", result: "ضلعا" },
        { question: "4", result: "AOB" },
        { question: "5", result: "90" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'حدد نوع الزاوية (حادة - قائمة - منفرجة - مستقيمة):\n1. 30°\n2. 90°\n3. 135°\n4. 180°\n5. 75°', 
      expectedResults: [
        { question: "1", result: "حادة" },
        { question: "2", result: "قائمة" },
        { question: "3", result: "منفرجة" },
        { question: "4", result: "مستقيمة" },
        { question: "5", result: "حادة" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'أكمل بالكلمة المناسبة:\n1. الزاوية التي قياسها 90° تسمى زاوية ........\n2. الزاوية التي قياسها أقل من 90° تسمى زاوية ........\n3. الزاوية التي قياسها أكبر من 90° تسمى زاوية ........\n4. الزاوية التي قياسها 180° تسمى زاوية ........\n5. في الزاوية AOB، رأس الزاوية هو النقطة ........', 
      expectedResults: [
        { question: "1", result: "قائمة" },
        { question: "2", result: "حادة" },
        { question: "3", result: "منفرجة" },
        { question: "4", result: "مستقيمة" },
        { question: "5", result: "O" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'لاحظ الشكل (زاوية AOB) واكتب بطرق مختلفة:\n1. بثلاثة أحرف: ....\n2. برأس الزاوية: ....\n3. بالضلعين: (...., ....)', 
      expectedResults: [
        { question: "1", result: "AOB" },
        { question: "2", result: "O" },
        { question: "3", result: "OA, OB" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'حدد العناصر للزاوية NMP:\n1. رأس الزاوية: ....\n2. الضلع الأول: [....)\n3. الضلع الثاني: [....)', 
      expectedResults: [
        { question: "1", result: "M" },
        { question: "2", result: "MN" },
        { question: "3", result: "MP" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'رتب الزوايا من الأصغر إلى الأكبر:\nالزوايا: 30° - 90° - 120° - 45° - 180° - 60°\n\nالترتيب:\n1. الأصغر\n2. الثاني\n3. الثالث\n4. الرابع\n5. الخامس\n6. الأكبر', 
      expectedResults: [
        { question: "1", result: "30" },
        { question: "2", result: "45" },
        { question: "3", result: "60" },
        { question: "4", result: "90" },
        { question: "5", result: "120" },
        { question: "6", result: "180" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'اختر الإجابة الصحيحة:\n1. رأس الزاوية AOB هو النقطة ... (A / O / B)\n2. الزاوية 45° هي زاوية ... (حادة / قائمة / منفرجة)\n3. الزاوية 90° هي زاوية ... (حادة / قائمة / منفرجة)\n4. الزاوية 120° هي زاوية ... (حادة / قائمة / منفرجة)\n5. الزاوية 180° هي زاوية ... (حادة / قائمة / مستقيمة)', 
      expectedResults: [
        { question: "1", result: "O" },
        { question: "2", result: "حادة" },
        { question: "3", result: "قائمة" },
        { question: "4", result: "منفرجة" },
        { question: "5", result: "مستقيمة" }
      ]
    },
    // تمارين رئيسية (30%)
    { 
      type: 'main', 
      question: 'مسألة: التعرف على الزوايا في شكل:\nفي الشكل (مستقيمان متقاطعان d1 و d2 في O، نقاط A,B,C,D):\n1. اكتب زاوية قائمة في الشكل (إن وجدت).\n2. اكتب زاوية حادة.\n3. اكتب زاوية منفرجة.\n4. اكتب زاوية مستقيمة.', 
      modelAnswer: '1. غير موجودة (المستقيمان ليسا متعامدين)\n2. AOC\n3. AOD\n4. AOB' 
    },
    { 
      type: 'main', 
      question: 'مسألة: زوايا المثلث:\nمثلث ABC قائم الزاوية في B، حيث AB = 3 cm و BC = 4 cm.\n1. ما نوع الزاوية ABC؟\n2. ما نوع الزاوية BAC؟\n3. ما نوع الزاوية BCA؟\n4. إذا كان قياس الزاوية BAC = 37°، فما قياس الزاوية BCA؟', 
      modelAnswer: '1. قائمة (90°)\n2. حادة\n3. حادة\n4. 53° (180 - 90 - 37)' 
    },
    { 
      type: 'main', 
      question: 'التحدي الكبير - إنشاء زوايا:\nباستخدام المنقلة والمسطرة:\n1. ارسم زاوية AOB قياسها 60°.\n2. ارسم زاوية MNP قياسها 120°.\n3. ارسم زاوية XYZ قياسها 90°.\n4. ما نوع كل زاوية من الزوايا السابقة؟', 
      modelAnswer: '1. رسم زاوية حادة\n2. رسم زاوية منفرجة\n3. رسم زاوية قائمة\n4. حادة، منفرجة، قائمة' 
    },
  ];

  console.log(`📝 Adding ${exercises.length} exercises...`);
  for (const [index, ex] of exercises.entries()) {
    await prisma.exercise.create({
      data: {
        lessonId: lesson.id,
        question: ex.question,
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