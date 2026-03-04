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

  const lessonTitle = "إنشاء نظير الأشكال البسيطة بالنسبة لمحور";

  const content = `
<div dir="rtl">
  🔍 <strong>تمهيد: ماذا نعني بالنظير بالنسبة لمحور؟</strong>
  <div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0; text-align: center;">
    نظير شكل بالنسبة لمحور هو الشكل الذي نحصل عليه بعد طي الورقة على هذا المحور، بحيث ينطبق الشكل الأصلي على نظيره تماماً.
    <div style="display: flex; justify-content: center; gap: 30px; margin: 30px 0; flex-wrap: wrap;">
      <div style="background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <svg width="120" height="120" viewBox="0 0 120 120" style="direction: ltr;">
          <line x1="60" y1="20" x2="60" y2="100" stroke="red" stroke-width="3" stroke-dasharray="5"/>
          <text x="65" y="30" fill="red">(d)</text>
          <circle cx="30" cy="50" r="4" fill="blue"/>
          <text x="20" y="45" fill="blue">A</text>
          <circle cx="90" cy="50" r="4" fill="green"/>
          <text x="95" y="45" fill="green">A'</text>
          <line x1="30" y1="50" x2="90" y2="50" stroke="gray" stroke-width="1" stroke-dasharray="3"/>
        </svg>
        <p><strong>نظير نقطة A</strong> هي A'</p>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <svg width="120" height="120" viewBox="0 0 120 120" style="direction: ltr;">
          <line x1="60" y1="20" x2="60" y2="100" stroke="red" stroke-width="3" stroke-dasharray="5"/>
          <polygon points="30,50 30,80 50,65" fill="#b3e5fc" stroke="blue" stroke-width="2"/>
          <text x="20" y="40" fill="blue">شكل</text>
          <polygon points="90,50 90,80 70,65" fill="#ffcdd2" stroke="green" stroke-width="2"/>
          <text x="85" y="40" fill="green">نظيره</text>
        </svg>
        <p><strong>نظير شكل</strong> هو شكل مطابق</p>
      </div>
    </div>
  </div>

  📝 <strong>المصطلحات الأساسية</strong>
  <div style="background-color: #fff3cd; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <table style="width: 100%; text-align: center;" border="1" cellpadding="10">
      <tr><th>المصطلح</th><th>التعريف</th><th>الترميز</th></tr>
      <tr><td>محور التناظر</td><td>مستقيم نطوي الورقة عليه</td><td>(d)</td></tr>
      <tr><td>النقطة الأصلية</td><td>النقطة التي نريد إيجاد نظيرها</td><td>A</td></tr>
      <tr><td>نظير النقطة</td><td>صورة النقطة بعد الطي على المحور</td><td>A' (نقرأ: A شرطة)</td></tr>
      <tr><td>المسافة إلى المحور</td><td>البعد العمودي بين النقطة والمحور</td><td>AH حيث H مسقط A على (d)</td></tr>
    </table>
    <p style="margin-top: 10px;"><strong>خاصية أساسية:</strong> AH = A'H و (AH) ⊥ (d)</p>
  </div>

  📐 <strong>أولاً: إنشاء نظير نقطة بالنسبة لمحور</strong>
  <div style="background-color: #e3f2fd; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <p>لإنشاء نظير نقطة A بالنسبة لمحور (d)، نتبع الخطوات التالية:</p>
    <div style="display: flex; justify-content: space-around; margin: 30px 0; flex-wrap: wrap;">
      <div style="text-align: center; width: 200px;"><p><strong>الخطوة ①</strong></p><svg width="150" height="120" viewBox="0 0 150 120" style="direction: ltr;"><line x1="60" y1="20" x2="60" y2="100" stroke="red" stroke-width="3" stroke-dasharray="5"/><text x="65" y="30" fill="red">(d)</text><circle cx="30" cy="60" r="4" fill="blue"/><text x="20" y="55" fill="blue">A</text></svg><p>نرسم المحور (d) والنقطة A</p></div>
      <div style="text-align: center; width: 200px;"><p><strong>الخطوة ②</strong></p><svg width="150" height="120" viewBox="0 0 150 120" style="direction: ltr;"><line x1="60" y1="20" x2="60" y2="100" stroke="red" stroke-width="3" stroke-dasharray="5"/><circle cx="30" cy="60" r="4" fill="blue"/><text x="20" y="55" fill="blue">A</text><line x1="30" y1="60" x2="60" y2="60" stroke="green" stroke-width="2"/><circle cx="60" cy="60" r="2" fill="green"/><text x="65" y="55" fill="green">H</text></svg><p>نرسم العمودي من A على (d)، ونحصل على H</p></div>
      <div style="text-align: center; width: 200px;"><p><strong>الخطوة ③</strong></p><svg width="150" height="120" viewBox="0 0 150 120" style="direction: ltr;"><line x1="60" y1="20" x2="60" y2="100" stroke="red" stroke-width="3" stroke-dasharray="5"/><circle cx="30" cy="60" r="4" fill="blue"/><text x="20" y="55" fill="blue">A</text><circle cx="60" cy="60" r="2" fill="green"/><text x="65" y="55" fill="green">H</text><circle cx="90" cy="60" r="4" fill="purple"/><text x="95" y="55" fill="purple">A'</text><line x1="60" y1="60" x2="90" y2="60" stroke="green" stroke-width="2"/></svg><p>نمدد المستقيم (AH) ونأخذ HA' = HA</p></div>
    </div>
  </div>

  📐 <strong>ثانياً: إنشاء نظير قطعة مستقيم</strong>
  <div style="background-color: #fff3e0; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <p>نظير قطعة مستقيم هو قطعة مستقيم أخرى، ننشئها بإنشاء نظيرتي طرفيها ثم نصل بينهما.</p>
    <div style="display: flex; justify-content: center; margin: 30px 0;"><svg width="300" height="150" viewBox="0 0 300 150" style="direction: ltr;"><line x1="150" y1="20" x2="150" y2="130" stroke="red" stroke-width="3" stroke-dasharray="5"/><text x="155" y="30" fill="red">(d)</text><line x1="50" y1="50" x2="100" y2="90" stroke="blue" stroke-width="3"/><circle cx="50" cy="50" r="4" fill="blue"/><text x="40" y="45" fill="blue">A</text><circle cx="100" cy="90" r="4" fill="blue"/><text x="105" y="95" fill="blue">B</text><circle cx="200" cy="50" r="4" fill="green"/><text x="205" y="45" fill="green">A'</text><circle cx="250" cy="90" r="4" fill="green"/><text x="255" y="95" fill="green">B'</text><line x1="200" y1="50" x2="250" y2="90" stroke="green" stroke-width="3"/><line x1="50" y1="50" x2="200" y2="50" stroke="gray" stroke-width="1" stroke-dasharray="3"/><line x1="100" y1="90" x2="250" y2="90" stroke="gray" stroke-width="1" stroke-dasharray="3"/></svg></div>
  </div>

  📐 <strong>ثالثاً: إنشاء نظير مستقيم</strong>
  <div style="background-color: #e8f5e9; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <p>نظير مستقيم هو مستقيم آخر، ننشئه بإنشاء نظيرتي نقطتين مختلفتين منه ثم نصل بينهما.</p>
    <div style="display: flex; justify-content: center; margin: 30px 0;"><svg width="300" height="150" viewBox="0 0 300 150" style="direction: ltr;"><line x1="150" y1="20" x2="150" y2="130" stroke="red" stroke-width="3" stroke-dasharray="5"/><text x="155" y="30" fill="red">(d)</text><line x1="30" y1="40" x2="100" y2="110" stroke="blue" stroke-width="3"/><text x="20" y="35" fill="blue">(l)</text><circle cx="50" cy="60" r="4" fill="blue"/><text x="40" y="55" fill="blue">M</text><circle cx="80" cy="90" r="4" fill="blue"/><text x="85" y="95" fill="blue">N</text><circle cx="220" cy="60" r="4" fill="green"/><text x="225" y="55" fill="green">M'</text><circle cx="250" cy="90" r="4" fill="green"/><text x="255" y="95" fill="green">N'</text><line x1="200" y1="40" x2="270" y2="110" stroke="green" stroke-width="3"/><text x="260" y="35" fill="green">(l')</text></svg></div>
  </div>

  📐 <strong>رابعاً: إنشاء نظير دائرة</strong>
  <div style="background-color: #f3e5f5; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <p>نظير دائرة هو دائرة أخرى لها نفس نصف القطر، ومركزها هو نظير مركز الدائرة الأصلية.</p>
    <div style="display: flex; justify-content: center; margin: 30px 0;"><svg width="300" height="150" viewBox="0 0 300 150" style="direction: ltr;"><line x1="150" y1="20" x2="150" y2="130" stroke="red" stroke-width="3" stroke-dasharray="5"/><text x="155" y="30" fill="red">(d)</text><circle cx="80" cy="70" r="30" fill="none" stroke="blue" stroke-width="3"/><circle cx="80" cy="70" r="3" fill="blue"/><text x="85" y="60" fill="blue">O</text><circle cx="220" cy="70" r="3" fill="green"/><text x="225" y="60" fill="green">O'</text><circle cx="220" cy="70" r="30" fill="none" stroke="green" stroke-width="3"/><line x1="80" y1="70" x2="220" y2="70" stroke="gray" stroke-width="1" stroke-dasharray="3"/></svg></div>
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
      question: 'أكمل الفراغات:\n1. نظير نقطة A بالنسبة لمحور (d) هي النقطة ...... حيث (AH) ⊥ (d) و ......\n2. لإنشاء نظير قطعة، ننشئ نظيرتي ...... ثم نصل بينهما.\n3. نظير دائرة هو دائرة لها نفس ...... ومركزها هو نظير ......\n4. إذا كان المستقيم يوازي المحور، فإن نظيره هو ......\n5. عند إنشاء نظير شكل، نبدأ بإنشاء نظير ...... المكونة للشكل.', 
      expectedResults: [
        { question: "1", result: "A', AH = A'H" },
        { question: "2", result: "طرفيها" },
        { question: "3", result: "نصف القطر, مركز الدائرة" },
        { question: "4", result: "نفس المستقيم" },
        { question: "5", result: "النقاط الهامة" }
      ],
      displayOrder: 1
    },
    { 
      type: 'support_with_results', 
      question: 'أكمل الجدول (نظائر النقاط):\n1. نظيرة A هي ...\n2. نظيرة B هي ...\n3. نظيرة ... هي C\'\n4. نظيرة ... هي D\'', 
      expectedResults: [
        { question: "1", result: "A'" },
        { question: "2", result: "B'" },
        { question: "3", result: "C" },
        { question: "4", result: "D" }
      ],
      displayOrder: 2
    },
    { 
      type: 'support_with_results', 
      question: 'اختر الإجابة الصحيحة (صواب/خطأ):\n1. نظير نقطة يبعد نفس المسافة عن المحور\n2. نظير دائرة له نصف قطر مختلف\n3. لإنشاء نظير قطعة ننشئ نظيرتي طرفيها\n4. المستقيم العمودي على المحور نظيره هو نفسه\n5. نظير شكل هو شكل مطابق للشكل الأصلي', 
      expectedResults: [
        { question: "1", result: "صواب" },
        { question: "2", result: "خطأ" },
        { question: "3", result: "صواب" },
        { question: "4", result: "صواب" },
        { question: "5", result: "صواب" }
      ],
      displayOrder: 3
    },
    { 
      type: 'support_with_results', 
      question: 'ارسم نظير النقاط التالية:\n1. A\' في ...\n2. B\' في ...\n3. C\' في ...', 
      expectedResults: [
        { question: "1", result: "يمين المحور بنفس البعد" },
        { question: "2", result: "يمين المحور بنفس البعد" },
        { question: "3", result: "يمين المحور بنفس البعد" }
      ],
      displayOrder: 4
    },
    { 
      type: 'support_with_results', 
      question: 'أكمل إنشاء نظير القطعة [AB]:\n1. نظيرة B هي ...\n2. نصل ... و ...', 
      expectedResults: [
        { question: "1", result: "B'" },
        { question: "2", result: "A', B'" }
      ],
      displayOrder: 5
    },
    { 
      type: 'support_with_results', 
      question: 'أوجد نظير الدائرة:\nنظير الدائرة هو دائرة مركزها ... ونفس نصف القطر ...', 
      expectedResults: [
        { question: "1", result: "O'" },
        { question: "2", result: "20" }
      ],
      displayOrder: 6
    },
    { 
      type: 'support_with_results', 
      question: 'لاحظ الشكل ثم أجب:\n1. عدد النقاط الهامة التي ننشئ نظائرها: ...\n2. نبدأ بإنشاء نظير ...', 
      expectedResults: [
        { question: "1", result: "النقاط الهامة (رؤوس المستطيل ومركز الدائرة)" },
        { question: "2", result: "النقاط الهامة" }
      ],
      displayOrder: 7
    },
    // تمارين رئيسية (30%)
    { 
      type: 'main', 
      question: 'نشاط عملي: إنشاء نظير شكل\nالوضعية: لدينا شكل مركب من مربع ومثلث كما في الرسم.\nالمطلوب:\n1. حدد النقاط الهامة في هذا الشكل.\n2. أنشئ نظير كل نقطة.\n3. أعد رسم الشكل باستخدام النظائر.\n4. تحقق من أن الشكلين متناظران.', 
      modelAnswer: '1. النقاط الهامة: رؤوس المربع (4 نقاط) ورؤوس المثلث (3 نقاط)\n2. ننشئ نظير كل نقطة على يمين المحور\n3. نعيد رسم المربع والمثلث باستخدام النظائر\n4. الشكلان متناظران' 
    },
    { 
      type: 'main', 
      question: 'مسألة: تصميم شكل متناظر\nالوضعية: أردنا تصميم شكل متناظر بالنسبة لمحور (d). لدينا نصف الشكل المرسوم على اليسار.\nالمطلوب:\n1. حدد رؤوس الشكل (نقاطه الهامة).\n2. أنشئ نظير كل رأس.\n3. ارسم النصف الآخر من الشكل.\n4. تحقق من التناظر.', 
      modelAnswer: '1. الرؤوس: (40,50)، (60,30)، (70,70)، (50,90)\n2. نظائرها: (160,50)، (140,30)، (130,70)، (150,90)\n3. نصل النظائر لنحصل على الشكل الكامل' 
    },
    { 
      type: 'main', 
      question: 'التحدي الكبير - إنشاء شكل من نظيره\nالوضعية: لدينا شكل ونظيره بالنسبة لمحور (d). نعرف إحداثيات النظائر، والمطلوب إيجاد الشكل الأصلي.\nالمطلوب:\n1. استنتج موقع الشكل الأصلي (بالنسبة للمحور).\n2. أنشئ النقاط الأصلية (كل نقطة ونظيرتها متناظرتان).\n3. ارسم الشكل الأصلي.\n4. قارن بين الشكلين.', 
      modelAnswer: '1. الشكل الأصلي على يسار المحور\n2. لكل نقطة نظيرة، ننشئ النقطة الأصلية بنفس البعد على الجهة الأخرى\n3. نصل النقاط الأصلية لنحصل على الشكل' 
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