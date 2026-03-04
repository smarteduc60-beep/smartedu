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

  const lessonTitle = "القيمة المقربة إلى الوحدة";

  const content = `
<div dir="rtl">
  🔍 <strong>تمهيد: مفهوم التقريب</strong>
  <div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0; text-align: center;">
    <p>عندما لا نحتاج إلى القيمة الدقيقة لعدد عشري، يمكننا استبداله بعدد صحيح قريب منه جداً. هذه العملية تسمى <strong>التدوير إلى الوحدة</strong>.</p>
  </div>

  📐 <strong>القاعدة باستخدام نصف المستقيم المدرج</strong>
  <div style="background-color: #fff; padding: 20px; border-radius: 15px; margin: 20px 0; border: 1px solid #e0e0e0;">
    <p>لإيجاد القيمة المقربة إلى الوحدة لعدد عشري، نضعه على نصف مستقيم مدرج وننظر إلى أقرب عدد صحيح له.</p>
    
    <div style="margin: 30px 0; text-align: center;">
      <svg width="500" height="150" viewBox="0 0 500 150" style="direction: ltr; margin: 0 auto; max-width: 100%;">
        <!-- الخط الرئيسي -->
        <line x1="50" y1="100" x2="450" y2="100" stroke="#333" stroke-width="2" marker-end="url(#arrow)" />
        
        <!-- التدريجات الرئيسية -->
        <line x1="50" y1="90" x2="50" y2="110" stroke="#333" stroke-width="2" />
        <text x="45" y="130" font-family="Arial" font-size="16">3</text>
        
        <line x1="450" y1="90" x2="450" y2="110" stroke="#333" stroke-width="2" />
        <text x="445" y="130" font-family="Arial" font-size="16">4</text>
        
        <!-- المنتصف -->
        <line x1="250" y1="95" x2="250" y2="105" stroke="#999" stroke-width="1" />
        <text x="240" y="130" font-family="Arial" font-size="14" fill="#666">3.5</text>

        <!-- المنطقة الحمراء (أقرب لـ 3) -->
        <rect x="50" y="80" width="200" height="5" fill="#FF5252" opacity="0.3" />
        <text x="100" y="70" font-family="Arial" font-size="14" fill="#D32F2F">أقرب إلى 3</text>

        <!-- المنطقة الخضراء (أقرب لـ 4) -->
        <rect x="250" y="80" width="200" height="5" fill="#4CAF50" opacity="0.3" />
        <text x="300" y="70" font-family="Arial" font-size="14" fill="#388E3C">أقرب إلى 4</text>

        <!-- مثال 3.2 -->
        <circle cx="130" cy="100" r="5" fill="#FF5252" />
        <text x="120" y="50" font-family="Arial" font-size="14" font-weight="bold" fill="#FF5252">3.2</text>
        <line x1="130" y1="55" x2="130" y2="95" stroke="#FF5252" stroke-width="1" stroke-dasharray="4" />

        <!-- مثال 3.7 -->
        <circle cx="330" cy="100" r="5" fill="#4CAF50" />
        <text x="320" y="50" font-family="Arial" font-size="14" font-weight="bold" fill="#4CAF50">3.7</text>
        <line x1="330" y1="55" x2="330" y2="95" stroke="#4CAF50" stroke-width="1" stroke-dasharray="4" />
      </svg>
    </div>

    <ul style="list-style-type: none; padding: 0;">
      <li style="margin-bottom: 10px;">🔴 <strong>3.2</strong> تقع في المنطقة الحمراء، فهي أقرب إلى <strong>3</strong>. إذن القيمة المقربة هي 3.</li>
      <li style="margin-bottom: 10px;">🟢 <strong>3.7</strong> تقع في المنطقة الخضراء، فهي أقرب إلى <strong>4</strong>. إذن القيمة المقربة هي 4.</li>
      <li style="margin-bottom: 10px;">⚖️ <strong>3.5</strong> (المنتصف) نتفق على تقريبها للأكبر، أي <strong>4</strong>.</li>
    </ul>
  </div>

  📝 <strong>قاعدة الحساب (بدون رسم)</strong>
  <div style="background-color: #e3f2fd; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <p>لمعرفة القيمة المقربة إلى الوحدة، ننظر فقط إلى <strong>الرقم الأول بعد الفاصلة</strong> (رقم الأعشار):</p>
    <div style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; margin-top: 20px;">
      <div style="background: white; padding: 15px; border-radius: 10px; border: 2px solid #1976D2; width: 45%;">
        <h3 style="color: #1976D2; margin-top: 0;">الحالة 1: الرقم أصغر من 5</h3>
        <p style="font-size: 1.2em;">(0, 1, 2, 3, 4)</p>
        <p>👈 نأخذ الجزء الصحيح كما هو.</p>
        <p>مثال: <strong>12.<span style="color:red">3</span></strong>4 → <strong>12</strong></p>
      </div>
      <div style="background: white; padding: 15px; border-radius: 10px; border: 2px solid #388E3C; width: 45%;">
        <h3 style="color: #388E3C; margin-top: 0;">الحالة 2: الرقم 5 أو أكبر</h3>
        <p style="font-size: 1.2em;">(5, 6, 7, 8, 9)</p>
        <p>👈 نضيف 1 إلى الجزء الصحيح.</p>
        <p>مثال: <strong>12.<span style="color:green">7</span></strong>1 → <strong>13</strong></p>
      </div>
    </div>
  </div>

  📊 <strong>أنواع التقريب الأخرى</strong>
  <div style="background-color: #fff3cd; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <table style="width: 100%; text-align: center; border-collapse: collapse;">
      <tr style="border-bottom: 2px solid #000;">
        <th style="padding: 10px;">العدد</th>
        <th style="padding: 10px;">القيمة المقربة بالنقصان<br><span style="font-size:0.8em; font-weight:normal">(الجزء الصحيح فقط)</span></th>
        <th style="padding: 10px;">القيمة المقربة بالزيادة<br><span style="font-size:0.8em; font-weight:normal">(الجزء الصحيح + 1)</span></th>
        <th style="padding: 10px; background-color: #e8f5e9;">القيمة المقربة إلى الوحدة<br><span style="font-size:0.8em; font-weight:normal">(الأقرب)</span></th>
      </tr>
      <tr>
        <td style="padding: 10px; font-weight: bold;">7.2</td>
        <td style="padding: 10px;">7</td>
        <td style="padding: 10px;">8</td>
        <td style="padding: 10px; background-color: #e8f5e9; font-weight: bold;">7</td>
      </tr>
      <tr>
        <td style="padding: 10px; font-weight: bold;">7.8</td>
        <td style="padding: 10px;">7</td>
        <td style="padding: 10px;">8</td>
        <td style="padding: 10px; background-color: #e8f5e9; font-weight: bold;">8</td>
      </tr>
      <tr>
        <td style="padding: 10px; font-weight: bold;">7.5</td>
        <td style="padding: 10px;">7</td>
        <td style="padding: 10px;">8</td>
        <td style="padding: 10px; background-color: #e8f5e9; font-weight: bold;">8</td>
      </tr>
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
      question: 'أكمل الجدول التالي بتحديد القيم المقربة:', 
      questionRichContent: `
      <table border="1" style="width:100%; text-align:center; border-collapse:collapse;">
        <tr><th>العدد</th><th>رقم الأعشار</th><th>القيمة المقربة إلى الوحدة</th></tr>
        <tr><td>15.3</td><td>3</td><td>......</td></tr>
        <tr><td>24.8</td><td>8</td><td>......</td></tr>
        <tr><td>9.5</td><td>5</td><td>......</td></tr>
        <tr><td>0.7</td><td>7</td><td>......</td></tr>
      </table>`,
      expectedResults: [
        { question: "15.3", result: "15" },
        { question: "24.8", result: "25" },
        { question: "9.5", result: "10" },
        { question: "0.7", result: "1" }
      ],
      displayOrder: 1
    },
    { 
      type: 'support_with_results', 
      question: 'حدد نوع التقريب (بالزيادة أو بالنقصان) للوصول إلى القيمة المقربة إلى الوحدة:', 
      questionRichContent: `
      <ul>
        <li>العدد 4.2 يقرب إلى 4 (......)</li>
        <li>العدد 4.9 يقرب إلى 5 (......)</li>
        <li>العدد 8.1 يقرب إلى 8 (......)</li>
      </ul>`,
      expectedResults: [
        { question: "4.2", result: "بالنقصان" },
        { question: "4.9", result: "بالزيادة" },
        { question: "8.1", result: "بالنقصان" }
      ],
      displayOrder: 2
    },
    { 
      type: 'main', 
      question: 'مسألة: شراء الخضروات', 
      questionRichContent: `
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 10px;">
        <p>اشترى أحمد خضروات بالأوزان التالية:</p>
        <ul>
          <li>طماطم: 2.3 كغ</li>
          <li>بطاطا: 4.8 كغ</li>
          <li>بصل: 3.5 كغ</li>
        </ul>
        <p><strong>المطلوب:</strong></p>
        <ol>
          <li>أعط القيمة المقربة إلى الوحدة لوزن كل نوع.</li>
          <li>احسب المجموع التقريبي للأوزان (باستخدام القيم المقربة).</li>
          <li>احسب المجموع الحقيقي للأوزان، ثم قربه إلى الوحدة. هل النتيجة هي نفسها؟</li>
        </ol>
      </div>`,
      modelAnswer: `
      <p><strong>1. القيم المقربة:</strong></p>
      <ul>
        <li>طماطم: 2.3 ← 2 كغ (لأن 3 < 5)</li>
        <li>بطاطا: 4.8 ← 5 كغ (لأن 8 ≥ 5)</li>
        <li>بصل: 3.5 ← 4 كغ (لأن 5 ≥ 5)</li>
      </ul>
      <p><strong>2. المجموع التقريبي:</strong></p>
      <p>2 + 5 + 4 = 11 كغ</p>
      <p><strong>3. المجموع الحقيقي:</strong></p>
      <p>2.3 + 4.8 + 3.5 = 10.6 كغ</p>
      <p>القيمة المقربة للمجموع الحقيقي (10.6) هي <strong>11 كغ</strong>.</p>
      <p>نعم، النتيجة هي نفسها في هذه الحالة.</p>
      `,
      displayOrder: 3
    },
    { 
      type: 'main', 
      question: 'تحدي: المسافة بين المدن', 
      questionRichContent: `
      <p>المسافة بين مدينتين هي 145.6 كم.</p>
      <p>يقول سائق الشاحنة: "المسافة تقريباً 145 كم".</p>
      <p>يقول سائق السيارة: "المسافة تقريباً 146 كم".</p>
      <p><strong>أيهما استخدم القيمة المقربة إلى الوحدة بشكل صحيح؟ ولماذا؟</strong></p>
      `,
      modelAnswer: `
      <p>سائق السيارة هو المحق.</p>
      <p><strong>التعليل:</strong></p>
      <p>العدد هو 145.6</p>
      <p>ننظر إلى رقم الأعشار وهو 6.</p>
      <p>بما أن 6 أكبر من أو يساوي 5 (6 ≥ 5)، فإننا نأخذ القيمة بالزيادة.</p>
      <p>إذن: 145.6 يقرب إلى <strong>146</strong>.</p>
      `,
      displayOrder: 4
    }
  ];

  console.log(`📝 Adding ${exercises.length} exercises...`);
  for (const [index, ex] of exercises.entries()) {
    await prisma.exercise.create({
      data: {
        lessonId: lesson.id,
        question: ex.question,
        questionRichContent: ex.questionRichContent,
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