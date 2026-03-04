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

  const lessonTitle = "التعرف على الأشكال البسيطة المتناظرة";

  const content = `
<div dir="rtl">
  🔍 <strong>تمهيد: نشاط يدوي باكتشاف التناظر</strong>
  <div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0; text-align: center;">
    <h3>🖐️ نشاط عملي: الطي والتناظر</h3>
    <div style="display: flex; justify-content: center; gap: 30px; margin: 30px 0; flex-wrap: wrap;">
      <div style="background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); width: 200px;">
        <p><strong>الخطوة ①</strong></p>
        <svg width="100" height="100" viewBox="0 0 100 100">
          <rect x="20" y="20" width="60" height="60" fill="none" stroke="black" stroke-width="2"/>
          <text x="40" y="60" fill="black" font-size="12">مربع</text>
        </svg>
        <p>نرسم شكلاً على ورقة</p>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); width: 200px;">
        <p><strong>الخطوة ②</strong></p>
        <svg width="100" height="100" viewBox="0 0 100 100">
          <line x1="20" y1="20" x2="80" y2="80" stroke="blue" stroke-width="3" stroke-dasharray="5"/>
          <rect x="20" y="20" width="60" height="60" fill="none" stroke="black" stroke-width="2"/>
          <text x="40" y="60" fill="black" font-size="12">مربع</text>
        </svg>
        <p>نطوي الورقة على خط منصف</p>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); width: 200px;">
        <p><strong>الخطوة ③</strong></p>
        <svg width="100" height="100" viewBox="0 0 100 100">
          <rect x="20" y="20" width="60" height="60" fill="#b3e5fc" stroke="black" stroke-width="2"/>
          <line x1="20" y1="20" x2="80" y2="80" stroke="red" stroke-width="3" stroke-dasharray="5"/>
          <text x="35" y="60" fill="black" font-size="12">مطابق</text>
        </svg>
        <p>نلاحظ تطابق الجزئين</p>
      </div>
    </div>
    <p style="background-color: #fff3cd; padding: 10px; border-radius: 5px;"><strong>🔍 ماذا نلاحظ؟</strong> عندما نطوي الورقة، ينطبق أحد جزئي الشكل على الآخر تماماً. هذا هو التناظر!</p>
  </div>

  📐
  📐 <strong>أولا: محور التناظر</strong>
  
  📝 <strong>تعريف محور التناظر</strong>
  <div style="background-color: #e8f5e9; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <p>محور التناظر هو مستقيم يقسم الشكل إلى جزأين متطابقين تماماً، ينطبق أحدهما على الآخر عند طي الشكل على هذا المستقيم.</p>
    <div style="display: flex; justify-content: center; margin: 30px 0;">
      <svg width="300" height="150" viewBox="0 0 300 150">
        <!-- شكل فراشة مبسط -->
        <ellipse cx="100" cy="75" rx="30" ry="40" fill="#ffcdd2" stroke="black" stroke-width="2"/>
        <ellipse cx="200" cy="75" rx="30" ry="40" fill="#ffcdd2" stroke="black" stroke-width="2"/>
        <circle cx="150" cy="75" r="20" fill="#fff9c4" stroke="black" stroke-width="2"/>
        
        <!-- محور التناظر -->
        <line x1="150" y1="20" x2="150" y2="130" stroke="red" stroke-width="3" stroke-dasharray="5"/>
        <text x="155" y="30" fill="red">محور التناظر</text>
        
        <!-- نقطة على اليسار ونظيرتها على اليمين -->
        <circle cx="120" cy="60" r="3" fill="blue"/>
        <text x="100" y="55" fill="blue">A</text>
        <circle cx="180" cy="60" r="3" fill="blue"/>
        <text x="185" y="55" fill="blue">A'</text>
      </svg>
    </div>
    <p style="background-color: #fff3cd; padding: 10px; border-radius: 5px;"><strong>🔍 نلاحظ:</strong> النقطة A على يسار المحور، ونظيرتها A' على اليمين على نفس البعد من المحور.</p>
  </div>

  🎯 <strong>خاصيات محور التناظر</strong>
  <div style="background-color: #f3e5f5; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <table style="width: 100%; text-align: center;" border="1" cellpadding="10">
      <tr><th>الخاصية</th><th>الشرح</th></tr>
      <tr><td>خاصية ①</td><td>محور التناظر هو محور لكل قطعة تصل بين نقطة ونظيرتها</td></tr>
      <tr><td>خاصية ②</td><td>كل نقطة على محور التناظر هي نظيرتها نفسها</td></tr>
      <tr><td>خاصية ③</td><td>المسافة من نقطة إلى المحور تساوي المسافة من نظيرتها إلى المحور</td></tr>
      <tr><td>خاصية ④</td><td>المستقيم الواصل بين نقطة ونظيرتها عمودي على محور التناظر</td></tr>
    </table>
  </div>

  📐 <strong>ثالثاً: التعرف على الأشكال البسيطة المتناظرة</strong>
  
  📊 <strong>جدول محاور تناظر الأشكال البسيطة</strong>
  <div style="background-color: #fff3cd; padding: 20px; border-radius: 15px; margin: 30px 0;">
    <table style="width: 100%; text-align: center;" border="1" cellpadding="10">
      <tr><th>الشكل</th><th>عدد محاور التناظر</th><th>رسم توضيحي</th></tr>
      <tr><td>المربع</td><td>4 محاور</td><td><svg width="80" height="80" viewBox="0 0 80 80"><rect x="10" y="10" width="60" height="60" fill="none" stroke="black"/><line x1="40" y1="10" x2="40" y2="70" stroke="red"/><line x1="10" y1="40" x2="70" y2="40" stroke="red"/><line x1="15" y1="15" x2="65" y2="65" stroke="red" stroke-dasharray="3"/><line x1="65" y1="15" x2="15" y2="65" stroke="red" stroke-dasharray="3"/></svg></td></tr>
      <tr><td>المستطيل</td><td>2 محاور</td><td><svg width="100" height="70" viewBox="0 0 100 70"><rect x="15" y="10" width="70" height="50" fill="none" stroke="black"/><line x1="50" y1="10" x2="50" y2="60" stroke="red"/><line x1="15" y1="35" x2="85" y2="35" stroke="red"/></svg></td></tr>
      <tr><td>المعين</td><td>2 محاور</td><td><svg width="80" height="80" viewBox="0 0 80 80"><polygon points="40,10 70,40 40,70 10,40" fill="none" stroke="black"/><line x1="40" y1="10" x2="40" y2="70" stroke="red"/><line x1="10" y1="40" x2="70" y2="40" stroke="red"/></svg></td></tr>
      <tr><td>المثلث المتساوي الساقين</td><td>1 محور</td><td><svg width="80" height="80" viewBox="0 0 80 80"><polygon points="40,10 70,70 10,70" fill="none" stroke="black"/><line x1="40" y1="10" x2="40" y2="70" stroke="red"/></svg></td></tr>
      <tr><td>المثلث المتساوي الأضلاع</td><td>3 محاور</td><td><svg width="80" height="80" viewBox="0 0 80 80"><polygon points="40,10 70,70 10,70" fill="none" stroke="black"/><line x1="40" y1="10" x2="40" y2="70" stroke="red"/><line x1="10" y1="70" x2="55" y2="30" stroke="red" stroke-dasharray="3"/><line x1="70" y1="70" x2="25" y2="30" stroke="red" stroke-dasharray="3"/></svg></td></tr>
      <tr><td>الدائرة</td><td>عدد لا نهائي من المحاور</td><td><svg width="80" height="80" viewBox="0 0 80 80"><circle cx="40" cy="40" r="30" fill="none" stroke="black"/><line x1="40" y1="10" x2="40" y2="70" stroke="red"/><line x1="10" y1="40" x2="70" y2="40" stroke="red"/><line x1="20" y1="20" x2="60" y2="60" stroke="red" stroke-dasharray="3"/><line x1="60" y1="20" x2="20" y2="60" stroke="red" stroke-dasharray="3"/></svg></td></tr>
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
      question: 'أكمل الفراغات:\n1. محور قطعة مستقيم هو المستقيم ...... على هذه القطعة في .......\n2. محور التناظر يقسم الشكل إلى جزأين ...... تماماً.\n3. المربع له ...... محاور تناظر.\n4. المستطيل له ...... محاور تناظر.\n5. الدائرة لها عدد ...... من محاور التناظر.', 
      expectedResults: [
        { question: "1", result: "العمودي, منتصفها" },
        { question: "2", result: "متطابقين" },
        { question: "3", result: "4" },
        { question: "4", result: "2" },
        { question: "5", result: "لا نهائي" }
      ],
      displayOrder: 1
    },
    { 
      type: 'support_with_results', 
      question: 'كم محور تناظر لكل شكل؟\n1. المربع\n2. المستطيل\n3. المثلث متساوي الساقين\n4. المثلث متساوي الأضلاع\n5. الدائرة', 
      expectedResults: [
        { question: "1", result: "4" },
        { question: "2", result: "2" },
        { question: "3", result: "1" },
        { question: "4", result: "3" },
        { question: "5", result: "عدد لا نهائي" }
      ],
      displayOrder: 2
    },
    { 
      type: 'support_with_results', 
      question: 'اختر الإجابة الصحيحة (صواب/خطأ):\n1. للمربع 4 محاور تناظر\n2. للمستطيل 4 محاور تناظر\n3. للدائرة محور تناظر واحد\n4. للمثلث متساوي الأضلاع 3 محاور\n5. كل شكل له محور تناظر', 
      expectedResults: [
        { question: "1", result: "صواب" },
        { question: "2", result: "خطأ" },
        { question: "3", result: "خطأ" },
        { question: "4", result: "صواب" },
        { question: "5", result: "خطأ" }
      ],
      displayOrder: 3
    },
    { 
      type: 'support_with_results', 
      question: 'ارسم محاور التناظر للمربع. كم عددها؟', 
      expectedResults: [
        { question: "عددها", result: "4" }
      ],
      displayOrder: 4
    },
    { 
      type: 'support_with_results', 
      question: 'باستخدام المحور (d)، أكمل:\n1. نظيرة A هي ...\n2. نظيرة B هي ...\n3. نظيرة C هي ...', 
      expectedResults: [
        { question: "1", result: "A' (على نفس البعد يمين المحور)" },
        { question: "2", result: "B' (يسار المحور)" },
        { question: "3", result: "C' (يمين المحور)" }
      ],
      displayOrder: 5
    },
    { 
      type: 'support_with_results', 
      question: 'صل بين الشكل وعدد محاور تناظره:\n1. المربع\n2. المستطيل\n3. الدائرة\n4. مثلث متساوي الأضلاع', 
      expectedResults: [
        { question: "1", result: "4" },
        { question: "2", result: "2" },
        { question: "3", result: "عدد لا نهائي" },
        { question: "4", result: "3" }
      ],
      displayOrder: 6
    },
    { 
      type: 'support_with_results', 
      question: 'لاحظ الشكل ثم أجب عن عدد محاور التناظر:\n1. الشكل 1 (مربع)\n2. الشكل 2 (مستطيل)\n3. الشكل 3 (دائرة)', 
      expectedResults: [
        { question: "1", result: "4" },
        { question: "2", result: "2" },
        { question: "3", result: "عدد لا نهائي" }
      ],
      displayOrder: 7
    },
    // تمارين رئيسية (30%)
    { 
      type: 'main', 
      question: 'نشاط عملي: قص وطي\nالوضعية: خذ ورقة مربعة الشكل طول ضلعها 10 cm.\nالمطلوب:\n1. طي الورقة إلى نصفين. كم محور تناظر استعملت؟\n2. طي الورقة مرة أخرى إلى نصفين في الاتجاه الآخر. كم محوراً استعملت الآن؟\n3. هل يمكن طي الورقة قطرياً بحيث ينطبق الجزءان؟ جرب ذلك.\n4. كم محور تناظر وجدت للمربع؟', 
      modelAnswer: '1. الطية الأولى: محور عمودي\n2. الطية الثانية: محور أفقي\n3. نعم، يمكن الطي قطرياً (محوران قطريان)\n4. المربع له 4 محاور تناظر' 
    },
    { 
      type: 'main', 
      question: 'مسألة: رسم وتحديد\nالوضعية: ارسم شكلاً سداسياً منتظماً على ورقة.\nالمطلوب:\n1. كم محور تناظر لهذا الشكل؟\n2. ارسم جميع محاور التناظر.\n3. اختر نقطة على الشكل وحدد نظيرتها بالنسبة لأحد المحاور.\n4. ماذا تلاحظ على المسافات من المحور؟', 
      modelAnswer: '1. السداسي المنتظم له 6 محاور تناظر\n2. (الرسم)\n3. النقطة ونظيرتها على نفس البعد من المحور\n4. المستقيم الواصل بين النقطة ونظيرتها عمودي على المحور' 
    },
    { 
      type: 'main', 
      question: 'التحدي الكبير - تصميم شكل متناظر\nالوضعية: صمم شكلاً بسيطاً (مثل فراشة أو ورقة شجر) له محور تناظر واحد.\nالمطلوب:\n1. ارسم شكلك على ورقة\n2. حدد محور التناظر\n3. اختر 3 نقاط على يسار المحور وحدد نظائرها على اليمين\n4. تحقق من أن المسافات متساوية', 
      modelAnswer: 'يجب أن يكون الشكل متطابقاً عند طيه على المحور، والنقاط المختارة يجب أن تكون على مسافات متساوية من المحور.' 
    }
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