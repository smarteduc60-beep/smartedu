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

  const lessonTitle = "مفهوم المساحة ومفهوم المحيط";

  // Content with SVGs
  const content = `
🔍 تمهيد: ماذا نقصد بالمحيط والمساحة؟
<div style="display: flex; justify-content: space-around; margin: 30px 0; flex-wrap: wrap; gap: 20px;">
  <div style="background-color: #e3f2fd; padding: 20px; border-radius: 15px; text-align: center; width: 45%; min-width: 300px;">
    <div style="font-size: 3em; color: #1976D2;">📏</div>
    <h3 style="color: #1976D2;">المحيط</h3>
    <div style="background-color: white; padding: 20px; border-radius: 10px; margin: 15px 0;">
      <svg width="150" height="120" viewBox="0 0 150 120">
        <!-- شكل بسيط -->
        <polygon points="30,50 70,20 120,40 110,90 50,100" fill="none" stroke="#1976D2" stroke-width="4"/>
        <!-- نقاط على المحيط -->
        <circle cx="30" cy="50" r="3" fill="red"/>
        <circle cx="70" cy="20" r="3" fill="red"/>
        <circle cx="120" cy="40" r="3" fill="red"/>
        <circle cx="110" cy="90" r="3" fill="red"/>
        <circle cx="50" cy="100" r="3" fill="red"/>
        <!-- خط منقط يتبع المحيط -->
        <polygon points="30,50 70,20 120,40 110,90 50,100" fill="none" stroke="green" stroke-width="2" stroke-dasharray="4"/>
      </svg>
    </div>
    <p><strong>هو طول الخط الذي يحيط بالشكل</strong></p>
    <p>نقيسه بـ وحدات الطول: cm, m</p>
  </div>
  <div style="background-color: #ffebee; padding: 20px; border-radius: 15px; text-align: center; width: 45%; min-width: 300px;">
    <div style="font-size: 3em; color: #c2185b;">🟦</div>
    <h3 style="color: #c2185b;">المساحة</h3>
    <div style="background-color: white; padding: 20px; border-radius: 10px; margin: 15px 0;">
      <svg width="150" height="120" viewBox="0 0 150 120">
        <!-- شكل مملوء بنقاط -->
        <polygon points="30,50 70,20 120,40 110,90 50,100" fill="#ffcdd2" stroke="#c2185b" stroke-width="3"/>
        <!-- نقاط داخلية -->
        <circle cx="60" cy="50" r="2" fill="black"/>
        <circle cx="80" cy="40" r="2" fill="black"/>
        <circle cx="70" cy="70" r="2" fill="black"/>
        <circle cx="90" cy="60" r="2" fill="black"/>
        <circle cx="50" cy="70" r="2" fill="black"/>
      </svg>
    </div>
    <p><strong>هو مساحة السطح داخل الشكل</strong></p>
    <p>نقيسها بـ وحدات مربعة: cm², m²</p>
  </div>
</div>

📐 أولاً: مفهوم المحيط
<div style="background-color: #f6f6f6; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h3>🎯  المحيط بطريقة مبسطة</h3>
  <p>المحيط هو المسافة التي تقطعها عندما تمشي حول شكل ما. تخيل أنك تمشي حول حديقة، فالمسافة التي تمشيها هي محيط الحديقة.</p>
  
  <div style="display: flex; justify-content: center; margin: 30px 0;">
    <div style="text-align: center;">
      <svg width="250" height="180" viewBox="0 0 250 180">
        <!-- شكل بركة أو حديقة -->
        <ellipse cx="120" cy="90" rx="80" ry="50" fill="none" stroke="blue" stroke-width="4"/>
        <ellipse cx="120" cy="90" rx="80" ry="50" fill="none" stroke="green" stroke-width="2" stroke-dasharray="5" stroke-dashoffset="5"/>
        <!-- شخص يمشي -->
        <circle cx="40" cy="90" r="10" fill="brown"/>
        <line x1="40" y1="100" x2="40" y2="120" stroke="brown" stroke-width="3"/>
        <line x1="40" y1="100" x2="20" y2="110" stroke="brown" stroke-width="3"/>
        <line x1="40" y1="100" x2="60" y2="110" stroke="brown" stroke-width="3"/>
        <!-- Footprints -->
        <circle cx="55" cy="130" r="3" fill="gray"/>
        <circle cx="70" cy="140" r="3" fill="gray"/>
        <circle cx="90" cy="145" r="3" fill="gray"/>
        <text x="125" y="30" fill="red" text-anchor="middle">المحيط = المسافة المقطوعة</text>
      </svg>
    </div>
  </div>
</div>

<div style="background-color: #fff3cd; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h3>🔍 كيف نحسب المحيط؟</h3>
  <p>لحساب محيط أي شكل، نجمع أطوال جميع أضلاعه.</p>
  <p style="font-size: 1.3em; text-align: center;"><strong>المحيط = الضلع 1 + الضلع 2 + الضلع 3 + ...</strong></p>
</div>

<div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h3>✅ أمثلة محلولة: حساب المحيط</h3>
  
  <div style="display: flex; flex-wrap: wrap; gap: 30px; margin-bottom: 20px;">
    <div style="flex: 1; min-width: 250px;">
      <h4>📌 المثال 1: محيط شكل خماسي</h4>
      <svg width="200" height="150" viewBox="0 0 200 150">
        <polygon points="40,80 80,30 140,40 160,90 100,120" fill="none" stroke="#1976D2" stroke-width="3"/>
        <text x="45" y="70" fill="red">4cm</text>
        <text x="120" y="30" fill="red">5cm</text>
        <text x="185" y="60" fill="red">6cm</text>
        <text x="170" y="110" fill="red">7cm</text>
        <text x="90" y="125" fill="red">8cm</text>
      </svg>
      <p><strong>أطوال الأضلاع:</strong> 4cm، 5cm، 6cm، 7cm، 8cm</p>
      <p><strong>الحل:</strong> P = 4 + 5 + 6 + 7 + 8 = 30 cm</p>
      <p><strong>✅ المحيط = 30 cm</strong></p>
    </div>
    
    <div style="flex: 1; min-width: 250px;">
      <h4>📌 المثال 2: محيط شكل سداسي غير منتظم</h4>
      <svg width="200" height="150" viewBox="0 0 200 150">
        <polygon points="50,60 80,30 130,30 160,60 140,110 70,110" fill="none" stroke="#c2185b" stroke-width="3"/>
        <text x="55" y="50" fill="red">3cm</text>
        <text x="120" y="25" fill="red">4cm</text>
        <text x="190" y="50" fill="red">4cm</text>
        <text x="185" y="90" fill="red">5cm</text>
        <text x="130" y="125" fill="red">6cm</text>
        <text x="60" y="100" fill="red">5cm</text>
      </svg>
      <p><strong>أطوال الأضلاع:</strong> 3، 4، 4، 5، 6، 5 cm</p>
      <p><strong>الحل:</strong> P = 3 + 4 + 4 + 5 + 6 + 5 = 27 cm</p>
      <p><strong>✅ المحيط = 27 cm</strong></p>
    </div>
  </div>
</div>

📐 ثانياً: مفهوم المساحة
<div style="background-color: #f6f6f6; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h3>🎯 شرح المساحة بطريقة مبسطة</h3>
  <p>المساحة هي عدد المربعات التي تغطي سطح الشكل. تخيل أنك تريد تغطية أرضية غرفة ببلاط مربع، فعدد البلاطات التي تحتاجها هو مساحة الغرفة.</p>
  
  <div style="display: flex; justify-content: center; margin: 30px 0;">
    <div style="text-align: center;">
      <svg width="200" height="150" viewBox="0 0 200 150">
        <!-- شكل مقسم إلى مربعات -->
        <rect x="30" y="20" width="120" height="90" fill="none" stroke="black" stroke-width="2"/>
        <!-- خطوط التقسيم -->
        <line x1="30" y1="50" x2="150" y2="50" stroke="gray" stroke-width="1"/>
        <line x1="30" y1="80" x2="150" y2="80" stroke="gray" stroke-width="1"/>
        <line x1="60" y1="20" x2="60" y2="110" stroke="gray" stroke-width="1"/>
        <line x1="90" y1="20" x2="90" y2="110" stroke="gray" stroke-width="1"/>
        <line x1="120" y1="20" x2="120" y2="110" stroke="gray" stroke-width="1"/>
        <!-- أرقام المربعات -->
        <text x="45" y="40" fill="red" text-anchor="middle">1</text>
        <text x="75" y="40" fill="red" text-anchor="middle">2</text>
        <text x="105" y="40" fill="red" text-anchor="middle">3</text>
        <text x="135" y="40" fill="red" text-anchor="middle">4</text>
        <text x="45" y="70" fill="red" text-anchor="middle">5</text>
        <text x="75" y="70" fill="red" text-anchor="middle">6</text>
        <text x="105" y="70" fill="red" text-anchor="middle">7</text>
        <text x="135" y="70" fill="red" text-anchor="middle">8</text>
        <text x="45" y="100" fill="red" text-anchor="middle">9</text>
        <text x="75" y="100" fill="red" text-anchor="middle">10</text>
        <text x="105" y="100" fill="red" text-anchor="middle">11</text>
        <text x="135" y="100" fill="red" text-anchor="middle">12</text>
      </svg>
      <p><strong>هذا الشكل مقسم إلى 12 مربعاً، إذن مساحته = 12 وحدة مربعة</strong></p>
    </div>
  </div>
</div>

<div style="background-color: #fff3cd; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h3>🔍 كيف نحسب المساحة؟</h3>
  <p>لحساب مساحة أي شكل، نعد المربعات التي تغطيه.</p>
  <p style="font-size: 1.3em; text-align: center;"><strong>المساحة = عدد المربعات الكاملة + أنصاف المربعات + ...</strong></p>
</div>

<div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h3>✅ أمثلة محلولة: حساب المساحة</h3>
  
  <div style="display: flex; flex-wrap: wrap; gap: 30px;">
    <div style="flex: 1; min-width: 250px;">
      <h4>📌 المثال 4: مساحة شكل بسيط</h4>
      <svg width="150" height="150" viewBox="0 0 150 150">
        <!-- Grid -->
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="gray" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="150" height="150" fill="url(#grid)" />
        <!-- Shape L -->
        <rect x="20" y="20" width="60" height="20" fill="#ffcdd2" stroke="none"/>
        <rect x="20" y="40" width="20" height="60" fill="#e4eb17" stroke="none"/>
      </svg>
      <p><strong>المربعات الكاملة:</strong></p>
      <p>الجزء العلوي: 3 مربعات</p>
      <p>الجزء السفلي: 3 مربعات</p>
      <p><strong>المساحة = 3 + 3  = 6 مربعات</strong></p>
      <p>✅ المساحة = 6 وحدات مربعة</p>
    </div>
  </div>
</div>

📊 جدول مقارنة بين المحيط والمساحة
<div style="background-color: #e3f2fd; padding: 20px; border-radius: 15px; margin: 30px 0; overflow-x: auto;">
  <table style="width:100%; text-align:right; border-collapse: collapse; min-width: 500px;">
    <tr style="border-bottom: 1px solid #ccc;"><th>عنصر المقارنة</th><th>المحيط</th><th>المساحة</th></tr>
    <tr><td>التعريف</td><td>طول الخط المحيط بالشكل</td><td>مساحة السطح داخل الشكل</td></tr>
    <tr><td>ماذا نقيس؟</td><td>المسافة حول الشكل</td><td>السطح داخل الشكل</td></tr>
    <tr><td>كيف نحسب؟</td><td>نجمع أطوال الأضلاع</td><td>نعد المربعات الداخلية</td></tr>
    <tr><td>الوحدة</td><td>cm, m</td><td>cm², m²</td></tr>
    <tr><td>مثال</td><td>طول السياج حول حديقة</td><td>كمية العشب لتغطية الحديقة</td></tr>
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
      question: 'أكمل الفراغات:\n1. المحيط هو ...... الذي يحيط بالشكل\n2. المساحة هي ...... داخل الشكل\n3. لحساب المحيط، نجمع ...... الأضلاع\n4. لحساب المساحة، نعد ...... التي تغطي الشكل\n5. المحيط يقاس بوحدات ...... مثل cm\n6. المساحة تقاس بوحدات ...... مثل cm²', 
      expectedResults: [
        { question: "1", result: "طول الخط" },
        { question: "2", result: "السطح" },
        { question: "3", result: "أطوال" },
        { question: "4", result: "المربعات" },
        { question: "5", result: "طولية" },
        { question: "6", result: "مربعة" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'احسب محيط الأشكال التالية (اجمع الأضلاع):\n1. شكل أضلاعه: 3, 4, 5, 4, 3 (المجموع = ...)\n2. شكل أضلاعه: 2, 3, 4, 3, 3 (المجموع = ...)', 
      expectedResults: [
        { question: "1", result: "19" },
        { question: "2", result: "15" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'احسب مساحة الأشكال (بالمربعات):\n1. مستطيل طوله 4 مربعات وعرضه 2 مربع (المساحة = ...)\n2. مربع طول ضلعه 4 مربعات (المساحة = ...)', 
      expectedResults: [
        { question: "1", result: "8" },
        { question: "2", result: "16" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'أكمل الجدول (محيط):\nالأضلاع (cm) | المحيط (cm)\n3, 5, 4, 6 | ⬜\n2, 2, 3, 3, 4 | ⬜\n5, 5, 5, 5, 5, 5 | ⬜\n7, 8, 5, 6, 4 | ⬜', 
      expectedResults: [
        { question: "1", result: "18" },
        { question: "2", result: "14" },
        { question: "3", result: "30" },
        { question: "4", result: "30" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'أكمل الجدول (مساحة تقريبية):\nالشكل | المربعات الكاملة | أنصاف المربعات | المساحة\nشكل 1 | 8 | 4 | ⬜\nشكل 2 | 12 | 6 | ⬜\nشكل 3 | 5 | 8 | ⬜\nشكل 4 | 10 | 2 | ⬜', 
      expectedResults: [
        { question: "1", result: "10" },
        { question: "2", result: "15" },
        { question: "3", result: "9" },
        { question: "4", result: "11" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'اختر الإجابة الصحيحة:\n1. المحيط هو ... (طول الخط حول الشكل / السطح داخل الشكل)\n2. المساحة هي ... (طول الخط حول الشكل / السطح داخل الشكل)\n3. لحساب المحيط نجمع ... (أطوال الأضلاع / عدد المربعات)\n4. لحساب المساحة نعد ... (أطوال الأضلاع / عدد المربعات)\n5. المحيط يقاس بـ ... (cm / cm²)', 
      expectedResults: [
        { question: "1", result: "طول الخط حول الشكل" },
        { question: "2", result: "السطح داخل الشكل" },
        { question: "3", result: "أطوال الأضلاع" },
        { question: "4", result: "عدد المربعات" },
        { question: "5", result: "cm" }
      ]
    },
    { 
      type: 'support_only', 
      question: 'أوجد المحيط (باستخدام المسطرة على الرسم):\n(شكل مرسوم بمقياس 1cm = 2cm)\nالضلع | الطول على الرسم | الطول الحقيقي\nAB | 2 cm | 4 cm\nBC | 3 cm | 6 cm\nCD | 2.5 cm | 5 cm\nDE | 3 cm | 6 cm\nEF | 2 cm | 4 cm\nFA | 2.5 cm | 5 cm\n\nالمحيط = ...', 
      modelAnswer: 'المحيط = 4 + 6 + 5 + 6 + 4 + 5 = 30 cm' 
    },
    // تمارين رئيسية (30%)
    { 
      type: 'main', 
      question: 'مسألة: حديقة منزلية:\nحديقة منزلية على شكل مستطيل طولها 8 m وعرضها 5 m. يراد وضع سياج حولها وزراعة العشب داخلها.\n\nالمطلوب:\n1. احسب محيط الحديقة (طول السياج).\n2. احسب مساحة الحديقة (باستخدام المربعات).\n3. إذا كان ثمن المتر الواحد من السياج 200 DA، احسب تكلفة السياج.\n4. إذا كان ثمن المتر المربع من العشب 150 DA، احسب تكلفة العشب.', 
      modelAnswer: '1. المحيط = 26 m\n2. المساحة = 40 m²\n3. تكلفة السياج = 5200 DA\n4. تكلفة العشب = 6000 DA' 
    },
    { 
      type: 'main', 
      question: 'مسألة: شكل غير منتظم:\nشكل أرض (مقسم إلى مربعات 1m²).\n\nالمطلوب:\n1. احسب مساحة هذه الأرض (بعد المربعات).\n2. احسب محيط هذه الأرض (احسب أطوال الأضلاع من الرسم).\n3. إذا أردنا تسييج هذه الأرض، كم متراً من السياج نحتاج؟\n4. إذا أردنا تبليطها ببلاط كل بلاطة تغطي 1 m²، كم بلاطة نحتاج؟', 
      modelAnswer: '1. المساحة = 18 m²\n2. المحيط = 20 m\n3. السياج = 20 m\n4. البلاط = 18 بلاطة' 
    },
    { 
      type: 'main', 
      question: 'التحدي الكبير - مقارنة بين شكلين:\nلدينا شكلان A و B مرسومان على شبكة من المربعات (1cm).\nالشكل A: مربع 3×3\nالشكل B: مستطيل 4×2\n\nالمطلوب:\n1. احسب مساحة الشكل A.\n2. احسب مساحة الشكل B.\n3. احسب محيط الشكل A.\n4. احسب محيط الشكل B.\n5. قارن بين الشكلين (أيهما أكبر مساحة؟ أيهما أكبر محيط؟).', 
      modelAnswer: '1. مساحة A = 9 cm²\n2. مساحة B = 8 cm²\n3. محيط A = 12 cm\n4. محيط B = 12 cm\n5. المساحة: A > B، المحيط: A = B' 
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