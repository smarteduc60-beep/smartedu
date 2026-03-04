import 'dotenv/config';
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

  const lessonTitle = "القيمة المقربة إلى الوحدة بالزيادة وبالنقصان";

  const content = `
<div dir="rtl">
  🔍 <strong>تمهيد: ماذا نعني بالقيمة المقربة؟</strong>
  <div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0; text-align: center;">
    القيمة المقربة هي عدد صحيح قريب من عدد عشري، نستعمله لتسهيل الحسابات أو للتعبير عن قياسات تقريبية.

    <div style="display: flex; justify-content: center; gap: 30px; margin: 30px 0; flex-wrap: wrap;">
      <div style="background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <p style="font-size: 1.5em;">3,2 <span style="color: #1976D2;">⇢ 3</span></p>
        <p style="color: #4CAF50;">بالتقريب إلى الوحدة</p>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <p style="font-size: 1.5em;">3,2 <span style="color: #c2185b;">⇢ 4</span></p>
        <p style="color: #c2185b;">بالزيادة</p>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <p style="font-size: 1.5em;">3,2 <span style="color: #1976D2;">⇢ 3</span></p>
        <p style="color: #1976D2;">بالنقصان</p>
      </div>
    </div>
  </div>

  📝 <strong>المصطلحات الأساسية</strong>
  <div style="background-color: #fff3cd; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <table style="width: 100%; text-align: center;" border="1" cellpadding="10">
      <tr><th>المصطلح</th><th>التعريف</th><th>مثال (3,2)</th></tr>
      <tr><td>القيمة المقربة إلى الوحدة</td><td>أقرب عدد صحيح للعدد العشري</td><td>3,2 ⇢ 3</td></tr>
      <tr><td>القيمة المقربة بالزيادة</td><td>أصغر عدد صحيح أكبر من العدد العشري</td><td>3,2 ⇢ 4</td></tr>
      <tr><td>القيمة المقربة بالنقصان</td><td>أكبر عدد صحيح أصغر من العدد العشري</td><td>3,2 ⇢ 3</td></tr>
      <tr><td>الجزء العشري</td><td>الأرقام بعد الفاصلة</td><td>0,2</td></tr>
    </table>
  </div>

  📐 
  📐 <strong>أولاً: القيمة المقربة إلى الوحدة</strong>
  <div style="background-color: #e3f2fd; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <div style="display: flex; align-items: center; gap: 30px;">
      <div style="font-size: 3em; color: #1976D2;">①</div>
      <div><p style="font-size: 1.3em;"><strong>ننظر إلى رقم الأعشار (الرقم الأول بعد الفاصلة)</strong></p></div>
    </div>
    <div style="display: flex; align-items: center; gap: 30px; margin-top: 20px;">
      <div style="font-size: 3em; color: #1976D2;">②</div>
      <div><p style="font-size: 1.3em;"><strong>إذا كان رقم الأعشار < 5 : نأخذ نفس الجزء الصحيح (العدد الأقرب)</strong></p></div>
    </div>
    <div style="display: flex; align-items: center; gap: 30px; margin-top: 20px;">
      <div style="font-size: 3em; color: #1976D2;">③</div>
      <div><p style="font-size: 1.3em;"><strong>إذا كان رقم الأعشار ≥ 5 : نزيد 1 على الجزء الصحيح (العدد الأقرب)</strong></p></div>
    </div>
  </div>

  ✅ <strong>أمثلة محلولة مع نصف المستقيم المدرج</strong>
  <div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0; space-y-6;">
    
    <!-- المثال الأول -->
    <div style="border-bottom: 1px solid #ddd; padding-bottom: 15px;">
      <p><strong>مثال 1: تقريب العدد 3,2</strong></p>
      <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
        <div style="flex-shrink: 0;">
          <svg width="300" height="100" viewBox="0 0 300 100" style="direction: ltr;">
            <line x1="20" y1="50" x2="280" y2="50" stroke="black" stroke-width="2"/>
            <line x1="50" y1="45" x2="50" y2="55" stroke="black" stroke-width="2"/><text x="45" y="35">2</text>
            <line x1="110" y1="45" x2="110" y2="55" stroke="black" stroke-width="2"/><text x="105" y="35">3</text>
            <line x1="170" y1="45" x2="170" y2="55" stroke="black" stroke-width="2"/><text x="165" y="35">4</text>
            <line x1="230" y1="45" x2="230" y2="55" stroke="black" stroke-width="2"/><text x="225" y="35">5</text>
            <circle cx="122" cy="50" r="4" fill="red"/>
            <text x="115" y="75" fill="red" font-weight="bold">3,2</text>
          </svg>
        </div>
        <p>نلاحظ أن <strong>3,2</strong> أقرب إلى <strong>3</strong> منه إلى 4. إذن، القيمة المقربة إلى الوحدة هي <strong>3</strong>.</p>
      </div>
    </div>

    <!-- المثال الثاني -->
    <div style="padding-top: 15px;">
      <p><strong>مثال 2: تقريب العدد 4,7</strong></p>
      <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
        <div style="flex-shrink: 0;">
          <svg width="300" height="100" viewBox="0 0 300 100" style="direction: ltr;">
            <line x1="20" y1="50" x2="280" y2="50" stroke="black" stroke-width="2"/>
            <line x1="50" y1="45" x2="50" y2="55" stroke="black" stroke-width="2"/><text x="45" y="35">3</text>
            <line x1="110" y1="45" x2="110" y2="55" stroke="black" stroke-width="2"/><text x="105" y="35">4</text>
            <line x1="170" y1="45" x2="170" y2="55" stroke="black" stroke-width="2"/><text x="165" y="35">5</text>
            <line x1="230" y1="45" x2="230" y2="55" stroke="black" stroke-width="2"/><text x="225" y="35">6</text>
            <circle cx="158" cy="50" r="4" fill="red"/>
            <text x="151" y="75" fill="red" font-weight="bold">4,7</text>
          </svg>
        </div>
        <p>نلاحظ أن <strong>4,7</strong> أقرب إلى <strong>5</strong> منه إلى 4. إذن، القيمة المقربة إلى الوحدة هي <strong>5</strong>.</p>
      </div>
    </div>
  </div>

  📐 <strong>ثانياً: القيمة المقربة بالزيادة إلى الوحدة</strong>
  <div style="background-color: #ffebee; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <div style="display: flex; align-items: center; gap: 30px;">
      <div style="font-size: 3em; color: #c2185b;">↑</div>
      <div>
        <p style="font-size: 1.3em;"><strong>القيمة المقربة بالزيادة هي أصغر عدد صحيح أكبر من العدد العشري.</strong></p>
        <p style="margin-top: 10px;">ببساطة، نأخذ الجزء الصحيح ونضيف له 1 (إلا إذا كان العدد صحيحاً).</p>
      </div>
    </div>
    <div style="margin-top: 20px;">
      <p><strong>مثال: تقريب 3,2 بالزيادة</strong></p>
      <svg width="300" height="100" viewBox="0 0 300 100" style="direction: ltr;">
        <line x1="20" y1="50" x2="280" y2="50" stroke="black" stroke-width="2"/>
        <line x1="110" y1="45" x2="110" y2="55" stroke="black" stroke-width="2"/><text x="105" y="35">3</text>
        <line x1="170" y1="45" x2="170" y2="55" stroke="black" stroke-width="2"/><text x="165" y="35">4</text>
        <circle cx="122" cy="50" r="4" fill="red"/>
        <text x="115" y="75" fill="red" font-weight="bold">3,2</text>
        <path d="M 125 45 q 20 -20 42 0" fill="none" stroke="#c2185b" stroke-width="2"/>
        <polygon points="163,48 170,42 167,50" fill="#c2185b"/>
      </svg>
      <p>أصغر عدد صحيح أكبر من 3,2 هو <strong>4</strong>. إذن، القيمة المقربة بالزيادة هي <strong>4</strong>.</p>
    </div>
  </div>

  📐 <strong>ثالثاً: القيمة المقربة بالنقصان إلى الوحدة</strong>
  <div style="background-color: #e8f5e9; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <div style="display: flex; align-items: center; gap: 30px;">
      <div style="font-size: 3em; color: #4CAF50;">↓</div>
      <div>
        <p style="font-size: 1.3em;"><strong>القيمة المقربة بالنقصان هي أكبر عدد صحيح أصغر من العدد العشري.</strong></p>
        <p style="margin-top: 10px;">ببساطة، نأخذ الجزء الصحيح فقط ونتجاهل الجزء العشري.</p>
      </div>
    </div>
    <div style="margin-top: 20px;">
      <p><strong>مثال: تقريب 3,2 بالنقصان</strong></p>
      <svg width="300" height="100" viewBox="0 0 300 100" style="direction: ltr;">
        <line x1="20" y1="50" x2="280" y2="50" stroke="black" stroke-width="2"/>
        <line x1="110" y1="45" x2="110" y2="55" stroke="black" stroke-width="2"/><text x="105" y="35">3</text>
        <line x1="170" y1="45" x2="170" y2="55" stroke="black" stroke-width="2"/><text x="165" y="35">4</text>
        <circle cx="122" cy="50" r="4" fill="red"/>
        <text x="115" y="75" fill="red" font-weight="bold">3,2</text>
        <path d="M 120 45 q -5 -20 -10 0" fill="none" stroke="#4CAF50" stroke-width="2"/>
        <polygon points="107,48 110,42 113,50" fill="#4CAF50"/>
      </svg>
      <p>أكبر عدد صحيح أصغر من 3,2 هو <strong>3</strong>. إذن، القيمة المقربة بالنقصان هي <strong>3</strong>.</p>
    </div>
  </div>

  📐 <strong>رابعاً: المقارنة بين الأنواع الثلاثة</strong>
  <div style="background-color: #fff3cd; padding: 20px; border-radius: 15px; margin: 30px 0;">
    <table style="width: 100%; text-align: center;" border="1" cellpadding="10">
      <tr><th>العدد</th><th>إلى الوحدة (الأقرب)</th><th>بالزيادة (للأعلى)</th><th>بالنقصان (للأسفل)</th></tr>
      <tr><td>3,2</td><td>3</td><td>4</td><td>3</td></tr>
      <tr><td>4,7</td><td>5</td><td>5</td><td>4</td></tr>
      <tr><td>5,5</td><td>6</td><td>6</td><td>5</td></tr>
      <tr><td>8,3</td><td>8</td><td>9</td><td>8</td></tr>
      <tr><td>9,9</td><td>10</td><td>10</td><td>9</td></tr>
    </table>
  </div>
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
      question: 'أكمل الفراغات:\n1. القيمة المقربة إلى الوحدة للعدد 4,3 هي ......\n2. القيمة المقربة بالزيادة للعدد 4,3 هي ......\n3. القيمة المقربة بالنقصان للعدد 4,3 هي ......\n4. إذا كان رقم الأعشار < 5، فإن القيمة المقربة إلى الوحدة = ......\n5. إذا كان رقم الأعشار ≥ 5، فإن القيمة المقربة إلى الوحدة = ...... + 1', 
      expectedResults: [
        { question: "1", result: "4" },
        { question: "2", result: "5" },
        { question: "3", result: "4" },
        { question: "4", result: "الجزء الصحيح" },
        { question: "5", result: "الجزء الصحيح" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'أوجد القيمة المقربة إلى الوحدة:\n1. 2,3\n2. 5,8\n3. 7,5\n4. 9,1\n5. 6,7', 
      expectedResults: [
        { question: "1", result: "2" },
        { question: "2", result: "6" },
        { question: "3", result: "8" },
        { question: "4", result: "9" },
        { question: "5", result: "7" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'أوجد القيمة المقربة بالزيادة:\n1. 3,4\n2. 5,2\n3. 8,9\n4. 7,0\n5. 4,6', 
      expectedResults: [
        { question: "1", result: "4" },
        { question: "2", result: "6" },
        { question: "3", result: "9" },
        { question: "4", result: "7" },
        { question: "5", result: "5" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'أوجد القيمة المقربة بالنقصان:\n1. 6,7\n2. 3,9\n3. 5,2\n4. 9,4\n5. 8,0', 
      expectedResults: [
        { question: "1", result: "6" },
        { question: "2", result: "3" },
        { question: "3", result: "5" },
        { question: "4", result: "9" },
        { question: "5", result: "8" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'أكمل الجدول (إلى الوحدة، بالزيادة، بالنقصان):\n1. 2,4\n2. 5,7\n3. 8,5\n4. 3,2\n5. 7,9', 
      expectedResults: [
        { question: "1", result: "2, 3, 2" },
        { question: "2", result: "6, 6, 5" },
        { question: "3", result: "9, 9, 8" },
        { question: "4", result: "3, 4, 3" },
        { question: "5", result: "8, 8, 7" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'رتب الأعداد تصاعدياً حسب قيمها المقربة إلى الوحدة:\nالأعداد: 4,2 - 3,8 - 5,1 - 3,5 - 4,9\n\nالقيم المقربة:\n1. 3,5\n2. 3,8\n3. 4,2\n4. 4,9\n5. 5,1\n\nالترتيب: ... < ... < ... < ... < ...', 
      expectedResults: [
        { question: "1", result: "4" },
        { question: "2", result: "4" },
        { question: "3", result: "4" },
        { question: "4", result: "5" },
        { question: "5", result: "5" },
        { question: "الترتيب", result: "3,5 < 3,8 < 4,2 < 4,9 < 5,1" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'اختر الإجابة الصحيحة (الوحدة / الزيادة / النقصان):\n1. 6,3\n2. 7,8\n3. 9,5\n4. 4,1', 
      expectedResults: [
        { question: "1", result: "6, 7, 6" },
        { question: "2", result: "8, 8, 7" },
        { question: "3", result: "10, 10, 9" },
        { question: "4", result: "4, 5, 4" }
      ]
    },
    // تمارين رئيسية (30%)
    { 
      type: 'main', 
      question: 'مسألة: شراء حلوى:\nثمن قطعة الحلوى 12,5 ديناراً. مع أحمد 50 ديناراً.\n\nالمطلوب:\n1. كم قطعة يمكن لأحمد أن يشتري بالقيمة المقربة بالنقصان؟\n2. كم قطعة يمكن أن يشتري بالقيمة المقربة بالزيادة؟\n3. ما هو الثمن الفعلي للقطع التي اشتراها في الحالة الأولى؟\n4. كم ديناراً يتبقى معه في الحالة الأولى؟', 
      modelAnswer: '1. عدد القطع بالنقصان = 50 ÷ 12,5 = 4 قطع\n2. عدد القطع بالزيادة = 5 (لكن لا يملك الثمن)\n3. الثمن الفعلي = 4 × 12,5 = 50 ديناراً\n4. الباقي = 50 - 50 = 0 ديناراً' 
    },
    { 
      type: 'main', 
      question: 'مسألة: قياس أطوال:\nقام سعيد بقياس طول غرفته فوجده 4,65 m.\n\nالمطلوب:\n1. أعط القيمة المقربة لهذا الطول إلى الوحدة.\n2. أعط القيمة المقربة بالزيادة.\n3. أعط القيمة المقربة بالنقصان.\n4. إذا أراد شراء سجادة طولها 5 m، فهل تكفي الغرفة؟', 
      modelAnswer: '1. إلى الوحدة: 5 (لأن 6 ≥ 5)\n2. بالزيادة: 5\n3. بالنقصان: 4\n4. السجادة طولها 5 m > 4,65 m، فلا تكفي' 
    },
    { 
      type: 'main', 
      question: 'التحدي الكبير - مشروع بناء:\nمقاول يحتاج 125,7 كيس إسمنت لبناء جدار. كل شاحنة تحمل 20 كيساً.\n\nالمطلوب:\n1. كم كيس إسمنت يحتاج المقاول بالقيمة المقربة إلى الوحدة؟\n2. كم كيس إسمنت يحتاج بالقيمة المقربة بالزيادة؟\n3. كم كيس إسمنت يحتاج بالقيمة المقربة بالنقصان؟\n4. كم شاحنة يحتاج لنقل الكمية بالزيادة؟\n5. إذا كان ثمن الكيس الواحد 450,5 ديناراً، فكم سيدفع بالقيمة المقربة إلى الوحدة؟', 
      modelAnswer: '1. إلى الوحدة: 126\n2. بالزيادة: 126\n3. بالنقصان: 125\n4. عدد الشاحنات = 126 ÷ 20 = 6,3 → 7 شاحنات\n5. الثمن = 126 × 450,5 = 56763 ديناراً' 
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