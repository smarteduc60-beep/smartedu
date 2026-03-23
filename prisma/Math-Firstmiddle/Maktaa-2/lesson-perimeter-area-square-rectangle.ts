import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🏗️ بدء إضافة درس "محيط ومساحة المربع والمستطيل"...');

  const teacher = await prisma.user.findUnique({
    where: { email: 'ladj14013@gmail.com' },
    include: { userDetails: true },
  });

  if (!teacher) {
    console.error('❌ لم يتم العثور على المعلم ladj14013@gmail.com');
    return;
  }

  if (!teacher.userDetails?.subjectId) {
    console.error('❌ لم يتم تعيين مادة لهذا المعلم في ملفه الشخصي.');
    return;
  }

  const subject = await prisma.subject.findUnique({
    where: { id: teacher.userDetails.subjectId },
  });

  const level = await prisma.level.findFirst({
    where: { name: { contains: 'أولى متوسط' } },
  });

  if (!subject || !level) {
    console.error('❌ لم يتم العثور على المادة أو المستوى المطلوب.');
    return;
  }

  const lessonContent = `
<div dir="rtl">

  <!-- 1️⃣ وضعية انطلاق -->
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
    <h3>🏠 مشكلة: سياج حول حديقة المنزل</h3>
    <p>يريد الأب بناء حديقة مستطيلة الشكل في منزلهم الجديد. طولها 8 m وعرضها 5 m. يريد وضع سياج حول الحديقة وزراعة العشب داخلها.</p>
  </div>
  <div style="display: flex; justify-content: center; gap: 30px; margin: 30px 0; flex-wrap: wrap;">
    <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
      <svg width="200" height="150" viewBox="0 0 200 150">
        <rect x="20" y="20" width="150" height="80" fill="#c8e6c9" stroke="#2E7D32" stroke-width="3"/>
        <text x="80" y="70" fill="black">حديقة</text>
        <text x="80" y="110" fill="black">5 m</text>
        <text x="160" y="50" fill="black">8 m</text>
      </svg>
      <p><strong>الحديقة المستطيلة</strong></p>
    </div>
    <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
      <svg width="150" height="150" viewBox="0 0 150 150">
        <rect x="30" y="30" width="90" height="90" fill="#bbdefb" stroke="#1976D2" stroke-width="3"/>
        <text x="65" y="80" fill="black">مربع</text>
        <text x="60" y="120" fill="black">6 m</text>
      </svg>
      <p><strong>نافورة مربعة</strong></p>
    </div>
  </div>
  <p>🔍 كيف يمكن حساب طول السياج اللازم ومساحة العشب؟</p>
  <p><strong>❓ التساؤلات:</strong></p>
  <ul>
    <li>كيف نحسب المحيط (طول السياج)؟</li>
    <li>كيف نحسب المساحة (كمية العشب)؟</li>
    <li>ما الفرق بين المحيط والمساحة؟</li>
  </ul>

  <!-- 2️⃣ مرحلة البحث والاكتشاف -->
  <div style="background-color: #fff9e6; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
    <h3>🧪 نشاط استكشافي: هيا نكتشف المحيط والمساحة!</h3>
    <h4>📌 النشاط 1: مفهوم المحيط</h4>
    <p>المحيط هو طول الحدود الخارجية للشكل. تخيل أنك تمشي حول الحديقة، فالمسافة التي تمشيها هي المحيط.</p>
    <div style="display: flex; justify-content: center; margin: 20px 0;">
      <svg width="250" height="150" viewBox="0 0 250 150">
        <rect x="30" y="30" width="180" height="80" fill="none" stroke="blue" stroke-width="3"/>
        <circle cx="30" cy="30" r="5" fill="red"/>
        <text x="15" y="20" fill="red">انطلاق</text>
        <path d="M30 30 L210 30 L210 110 L30 110 L30 30" stroke="green" stroke-width="3" stroke-dasharray="5" fill="none"/>
      </svg>
    </div>
    <p><strong>❓ أسئلة موجهة:</strong></p>
    <ul>
      <li>كم ضلعاً للمستطيل؟ <span style="background-color: #1976D2; color: white; padding: 3px 8px; border-radius: 15px;">4 أضلاع</span></li>
      <li>كيف نحسب المحيط؟ <span style="background-color: #FF9800; color: white; padding: 3px 8px; border-radius: 15px;">نجمع أطوال الأضلاع</span></li>
    </ul>
    <h4>📌 النشاط 2: مفهوم المساحة</h4>
    <p>المساحة هي عدد المربعات التي تغطي سطح الشكل. تخيل أنك تريد تغطية الأرضية بالبلاط.</p>
    <div style="display: flex; justify-content: center; margin: 20px 0;">
      <svg width="200" height="150" viewBox="0 0 200 150">
        <rect x="20" y="20" width="150" height="80" fill="none" stroke="black" stroke-width="3"/>
        <line x1="20" y1="40" x2="170" y2="40" stroke="gray" stroke-width="1" stroke-dasharray="3"/><line x1="20" y1="60" x2="170" y2="60" stroke="gray" stroke-width="1" stroke-dasharray="3"/><line x1="20" y1="80" x2="170" y2="80" stroke="gray" stroke-width="1" stroke-dasharray="3"/><line x1="20" y1="100" x2="170" y2="100" stroke="gray" stroke-width="1" stroke-dasharray="3"/>
        <line x1="50" y1="20" x2="50" y2="100" stroke="gray" stroke-width="1" stroke-dasharray="3"/><line x1="80" y1="20" x2="80" y2="100" stroke="gray" stroke-width="1" stroke-dasharray="3"/><line x1="110" y1="20" x2="110" y2="100" stroke="gray" stroke-width="1" stroke-dasharray="3"/><line x1="140" y1="20" x2="140" y2="100" stroke="gray" stroke-width="1" stroke-dasharray="3"/>
        <rect x="20" y="20" width="90" height="60" fill="#1976D2" opacity="0.3"/>
      </svg>
    </div>
  </div>
</div>
  `;

  const lesson = await prisma.lesson.create({
    data: {
      title: 'محيط ومساحة المربع والمستطيل',
      content: lessonContent,
      authorId: teacher.id,
      subjectId: subject.id,
      levelId: level.id,
      type: 'private',
      status: 'approved',
      published: true,
      contentType: 'ARTICLE',
      lessonFileIds: '[]',
      exercises: {
        create: [
          {
            type: 'support_with_results',
            question: 'أكمل الفراغات:\n1) محيط المستطيل = ...\n2) مساحة المستطيل = ...\n3) محيط المربع = ...\n4) مساحة المربع = ...',
            expectedResults: JSON.stringify([
              { question: "1", result: "2 × (L + l)" },
              { question: "2", result: "L × l" },
              { question: "3", result: "4 × c" },
              { question: "4", result: "c × c" }
            ]),
            displayOrder: 1, maxScore: 4, exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'support_with_results',
            question: 'أحسب المحيط والمساحة:\n| الشكل | الأبعاد | المحيط | المساحة |\n|---|---|---|---|\n| مستطيل | L=7, l=4 | ؟ | ؟ |\n| مستطيل | L=9, l=6 | ؟ | ؟ |\n| مربع | c=5 | ؟ | ؟ |\n| مربع | c=8 | ؟ | ؟ |',
            expectedResults: JSON.stringify([
              { question: "مستطيل 1 - محيط", result: "22" },
              { question: "مستطيل 1 - مساحة", result: "28" },
              { question: "مستطيل 2 - محيط", result: "30" },
              { question: "مستطيل 2 - مساحة", result: "54" },
              { question: "مربع 1 - محيط", result: "20" },
              { question: "مربع 1 - مساحة", result: "25" },
              { question: "مربع 2 - محيط", result: "32" },
              { question: "مربع 2 - مساحة", result: "64" }
            ]),
            displayOrder: 2, maxScore: 8, exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'support_with_results',
            question: 'اختر الإجابة الصحيحة:\n1) محيط مربع طول ضلعه 6 cm\n2) مساحة مستطيل طوله 8 وعرضه 3\n3) محيط مستطيل طوله 10 وعرضه 4\n4) مساحة مربع طول ضلعه 7 cm',
            expectedResults: JSON.stringify([
              { question: "1", result: "24 cm" },
              { question: "2", result: "24 cm²" },
              { question: "3", result: "28 cm" },
              { question: "4", result: "49 cm²" }
            ]),
            displayOrder: 3, maxScore: 4, exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'support_with_results',
            question: 'أكمل الجدول (المربع):\n| طول الضلع (cm) | المحيط (cm) | المساحة (cm²) |\n|---|---|---|\n| 4 | ؟ | ؟ |\n| 7 | ؟ | ؟ |\n| ؟ | 20 | 25 |\n| ؟ | 36 | 81 |',
            expectedResults: JSON.stringify([
              { question: "صف 1 - محيط", result: "16" },
              { question: "صف 1 - مساحة", result: "16" },
              { question: "صف 2 - محيط", result: "28" },
              { question: "صف 2 - مساحة", result: "49" },
              { question: "صف 3 - ضلع", result: "5" },
              { question: "صف 4 - ضلع", result: "9" }
            ]),
            displayOrder: 4, maxScore: 6, exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'support_with_results',
            question: 'مستطيل محيطه 32 cm وعرضه 6 cm. أحسب طوله.',
            expectedResults: JSON.stringify([{ question: "1", result: "10 cm" }]),
            displayOrder: 5, maxScore: 2, exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'support_with_results',
            question: 'مربع أول ضلعه 8 cm، مربع ثان ضلعه 10 cm. قارن بين محيطيهما ومساحتيهما.',
            expectedResults: JSON.stringify([
              { question: "P₁", result: "32 cm" },
              { question: "P₂", result: "40 cm" },
              { question: "S₁", result: "64 cm²" },
              { question: "S₂", result: "100 cm²" }
            ]),
            displayOrder: 6, maxScore: 4, exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'support_with_results',
            question: 'أكمل الجدول (المستطيل):\n| الطول (L) | العرض (l) | المحيط (P) | المساحة (S) |\n|---|---|---|---|\n| 12 | 5 | ؟ | ؟ |\n| ؟ | 7 | 30 | 56 |\n| 15 | ؟ | 42 | 90 |\n| ؟ | ؟ | 26 | 36 |',
            expectedResults: JSON.stringify([
              { question: "صف 1 - محيط", result: "34" },
              { question: "صف 1 - مساحة", result: "60" },
              { question: "صف 2 - طول", result: "8" },
              { question: "صف 3 - عرض", result: "6" },
              { question: "صف 4 - طول", result: "9" },
              { question: "صف 4 - عرض", result: "4" }
            ]),
            displayOrder: 7, maxScore: 6, exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'main',
            question: 'حديقة مستطيلة طولها 20 m وعرضها 15 m. يراد وضع سياج حولها وزراعة العشب داخلها.\n1) ما هو طول السياج؟\n2) ما هي مساحة العشب؟\n3) إذا كان ثمن المتر من السياج 500 DA، فما هي التكلفة؟',
            modelAnswer: '1) طول السياج (المحيط) = 70 متر.\n2) مساحة العشب = 300 متر مربع.\n3) التكلفة = 35000 دينار جزائري.',
            displayOrder: 8, maxScore: 5, exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'main',
            question: 'غرفة مستطيلة طولها 5 m وعرضها 4 m، وغرفة مربعة طول ضلعها 4,5 m. قارن بين محيطيهما ومساحتيهما.',
            modelAnswer: 'محيط المستطيل = 18 م، محيط المربع = 18 م (متساويان).\nمساحة المستطيل = 20 م²، مساحة المربع = 20.25 م² (مساحة المربع أكبر).',
            displayOrder: 9, maxScore: 5, exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'main',
            question: 'قطعة أرض مستطيلة طولها 25 m وعرضها 20 m. أقيم عليها منزل مربع طول ضلعه 10 m. ما هي مساحة الحديقة المتبقية؟',
            modelAnswer: 'مساحة الأرض = 500 م². مساحة المنزل = 100 م². مساحة الحديقة = 500 - 100 = 400 م².',
            displayOrder: 10, maxScore: 5, exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          }
        ]
      }
    },
  });

  console.log(`✅ تم إنشاء درس "${lesson.title}" بنجاح (ID: ${lesson.id})`);
}

main()
  .catch((e) => {
    console.error('❌ خطأ في إنشاء الدرس:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });