import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding Lesson: Division by 0.1, 0.01, 0.001 ...');

  // 1. Fetch the Teacher
  const teacherEmail = 'ladj14013@gmail.com';
  const teacher = await prisma.user.findUnique({
    where: { email: teacherEmail },
    include: { userDetails: true }
  });

  if (!teacher) {
    console.error(`❌ Teacher ${teacherEmail} not found. Please run 'prisma/seed-math-1cem.ts' first.`);
    process.exit(1);
  }

  if (!teacher.userDetails?.subjectId) {
    console.error(`❌ Teacher ${teacherEmail} has no subject assigned.`);
    process.exit(1);
  }

  // 2. Fetch Level (1CEM)
  const level = await prisma.level.findFirst({
    where: { name: 'أولى متوسط' }
  });

  if (!level) {
    console.error('❌ Level "أولى متوسط" not found. Please run the base seed.');
    process.exit(1);
  }

  // 3. Prepare Content (HTML formatted for Rich Text Editor)
  const lessonContent = `
    <h3 style="color: #2563eb;">🔍 اكتشاف: ما معنى 0,1؟</h3>
    <p>قبل أن نقسم، دعنا نتذكر ماذا تعني هذه الأعداد:</p>
    <ul>
      <li><strong style="color: #d97706;">0,1 (عُشر)</strong> = <span style="color: #2563eb;">1/10</span></li>
      <li><strong style="color: #d97706;">0,01 (جزء من مئة)</strong> = <span style="color: #2563eb;">1/100</span></li>
      <li><strong style="color: #d97706;">0,001 (جزء من ألف)</strong> = <span style="color: #2563eb;">1/1000</span></li>
    </ul>

    <h3 style="color: #d97706;">✨ القاعدة الذهبية الأولى: السر المخفي</h3>
    <p>عندما تقسم عدداً على كسر (مثل 1/10)، فهذا يعني أنك <strong style="color: #16a34a;">تضرب العدد في مقلوب الكسر</strong>.</p>
    <p>ومقلوب الكسر يُحسب بقلب البسط والمقام:</p>
    <ul>
      <li>مقلوب 1/10 هو 10/1 = <strong style="color: #dc2626;">10</strong></li>
      <li>مقلوب 1/100 هو 100/1 = <strong style="color: #dc2626;">100</strong></li>
      <li>مقلوب 1/1000 هو 1000/1 = <strong style="color: #dc2626;">1000</strong></li>
    </ul>

    <h3 style="color: #d97706;">🌟 القاعدة الذهبية الثانية: التطبيق العملي</h3>
    <table border="1" cellpadding="10" style="border-collapse: collapse; width: 100%; border: 2px solid #e5e7eb;">
      <thead>
        <tr style="background-color: #f3f4f6;">
          <th style="color: #1f2937;">العملية</th>
          <th style="color: #1f2937;">معناها</th>
          <th style="color: #1f2937;">النتيجة</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="color: #4b5563;">5 ÷ 0,1</td>
          <td style="color: #4b5563;">5 × 10</td>
          <td style="color: #16a34a; font-weight: bold;">50</td>
        </tr>
        <tr>
          <td style="color: #4b5563;">5 ÷ 0,01</td>
          <td style="color: #4b5563;">5 × 100</td>
          <td style="color: #16a34a; font-weight: bold;">500</td>
        </tr>
        <tr>
          <td style="color: #4b5563;">5 ÷ 0,001</td>
          <td style="color: #4b5563;">5 × 1000</td>
          <td style="color: #16a34a; font-weight: bold;">5000</td>
        </tr>
      </tbody>
    </table>

    <h3 style="color: #9333ea;">🧮 قاعدة التحريك السريعة (الطريقة المختصرة)</h3>
    <p>لأن القسمة على عدد صغير (أقل من 1) <strong style="color: #dc2626;">تكبر العدد!</strong> نحرك الفاصلة لليمين:</p>
    <ul>
      <li><strong style="color: #2563eb;">÷ 0,1</strong>: نحرك الفاصلة <span style="text-decoration: underline;">رقماً واحداً</span> لليمين (مثال: 4,25 ÷ 0,1 = <strong style="color: #16a34a;">42,5</strong>)</li>
      <li><strong style="color: #2563eb;">÷ 0,01</strong>: نحرك الفاصلة <span style="text-decoration: underline;">رقمين</span> لليمين (مثال: 4,25 ÷ 0,01 = <strong style="color: #16a34a;">425</strong>)</li>
      <li><strong style="color: #2563eb;">÷ 0,001</strong>: نحرك الفاصلة <span style="text-decoration: underline;">ثلاثة أرقام</span> لليمين (مثال: 4,25 ÷ 0,001 = <strong style="color: #16a34a;">4250</strong>)</li>
    </ul>

    <h3 style="color: #dc2626;">⚠️ أمثلة مع حالات خاصة (نفاد الأرقام)</h3>
    <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; border: 1px solid #fecaca;">
      <p><strong>المثال 1:</strong> 0,5 ÷ 0,01 = 0,5 × 100 = <strong style="color: #dc2626;">50</strong></p>
      <p><strong>المثال 2:</strong> 12 ÷ 0,001 = 12 × 1000 = <strong style="color: #dc2626;">12000</strong></p>
      <p><strong>المثال 3 (تحدي):</strong> 0,02 ÷ 0,0001 = 0,02 × 10000 = <strong style="color: #dc2626;">200</strong></p>
    </div>

    <h3 style="color: #059669;">📝 مقارنة نهائية (لا تنسها أبداً!)</h3>
    <ul style="background-color: #ecfdf5; padding: 15px; border-radius: 8px;">
      <li>× 10, 100, 1000 -> الفاصلة لليمين -> <span style="color: #16a34a;">العدد يكبر</span></li>
      <li>÷ 10, 100, 1000 -> الفاصلة لليسار -> <span style="color: #dc2626;">العدد يصغر</span></li>
      <li><strong style="color: #d97706;">÷ 0,1, 0,01, 0,001 -> الفاصلة لليمين -> العدد يكبر (معكوس!)</strong></li>
    </ul>
    
    <hr style="border-top: 2px dashed #d1d5db; margin: 20px 0;">
    <p style="background-color: #eff6ff; padding: 10px; border-left: 4px solid #2563eb;">💡 <strong>نصيحة الأستاذ:</strong> لا تحفظ القواعد فقط، بل افهم المنطق. عندما تقسم على 0,1، فأنت تسأل: "كم مرة يتسع 0,1 في العدد؟".</p>
  `;

  // 4. Create Lesson
  const lesson = await prisma.lesson.create({
    data: {
      title: 'القسمة على 0,1 أو 0,01 أو 0,001',
      content: lessonContent,
      subjectId: teacher.userDetails!.subjectId!,
      levelId: level.id,
      authorId: teacher.id,
      status: 'published',
      type: 'public',
      exercises: {
        create: [
          // التمرين 01: أكمل الجدول (تطبيق مباشر)
          {
            type: 'support_with_results',
            question: 'أتمم العمليات التالية ذهنياً (اكتب الناتج فقط):\n1) 6 ÷ 0,1\n2) 6 ÷ 0,01\n3) 6 ÷ 0,001\n4) 0,6 ÷ 0,1\n5) 0,6 ÷ 0,01\n6) 0,6 ÷ 0,001',
            expectedResults: [
              { question: "1", result: "60", tolerance: 0 },
              { question: "2", result: "600", tolerance: 0 },
              { question: "3", result: "6000", tolerance: 0 },
              { question: "4", result: "6", tolerance: 0 },
              { question: "5", result: "60", tolerance: 0 },
              { question: "6", result: "600", tolerance: 0 }
            ],
            displayOrder: 1,
            maxScore: 6
          },
          // التمرين 02: صحح الخطأ
          {
            type: 'main',
            question: `صحح الأخطاء التالية واشرح السبب:\n1) 0,4 ÷ 0,1 = 0,04\n2) 25 ÷ 0,01 = 0,25\n3) 7,2 ÷ 0,001 = 0,0072`,
            modelAnswer: `1) التصحيح: 4. السبب: القسمة على 0,1 تكبر العدد (نزيح الفاصلة لليمين).\n2) التصحيح: 2500. السبب: القسمة على 0,01 تكافئ الضرب في 100.\n3) التصحيح: 7200. السبب: نزيح الفاصلة 3 مراتب لليمين.`,
            displayOrder: 2,
            maxScore: 6
          },
          // التمرين 03: صحيح أم خطأ مع التعليل
          {
            type: 'main',
            question: `ضع علامة (√) أو (×) مع التعليل:\n1) القسمة على 0,1 تكبر العدد.\n2) 8 ÷ 0,01 = 0,08.\n3) 0,05 ÷ 0,001 = 50.\n4) 120 ÷ 0,01 = 12000.`,
            modelAnswer: `1) (√) لأن المقسوم عليه أصغر من 1.\n2) (×) النتيجة 800 (نضرب في 100).\n3) (√) صحيح.\n4) (√) صحيح.`,
            displayOrder: 3,
            maxScore: 4
          },
          // التمرين 04: مشكلة حياتية
          {
            type: 'main',
            question: `حل المشكلات التالية:\n1) أشتري حلوى بسعر 0,1 دينار للقطعة. كم قطعة أشتري بـ 5 دنانير؟\n2) سعر القطعة 0,01 دينار. كم قطعة أشتري بـ 2 دينار؟\n3) معي 1,5 دينار وسعر القطعة 0,001 دينار. كم قطعة أشتري؟`,
            modelAnswer: `1) 5 ÷ 0,1 = 50 قطعة.\n2) 2 ÷ 0,01 = 200 قطعة.\n3) 1,5 ÷ 0,001 = 1500 قطعة.`,
            displayOrder: 4,
            maxScore: 6
          },
          // التمرين 05: تحدي
          {
            type: 'main',
            question: `أكمل الجدول التالي بناءً على العلاقة بين القسمة والضرب:\n1) 2,5 ÷ 0,1 = ...\n2) 2,5 ÷ 0,01 = ...\n3) 2,5 ÷ 0,001 = ...\n4) 0,03 ÷ 0,01 = ...\n5) 120 ÷ 0,001 = ...`,
            modelAnswer: `1) 25\n2) 250\n3) 2500\n4) 3\n5) 120000`,
            displayOrder: 5,
            maxScore: 5
          }
        ]
      }
    }
  });

  console.log(`✅ Lesson created successfully: ${lesson.title} (ID: ${lesson.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });