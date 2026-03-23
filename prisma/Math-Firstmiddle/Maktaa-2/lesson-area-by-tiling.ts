import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🏗️ بدء إضافة درس "تعيين مساحة سطح مستو باستعمال رصف بسيط"...');

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
    <h3>🏠 مشكلة: تبليط غرفة المنزل</h3>
    <p>يريد والد سلمى تبليط غرفة المعيشة ببلاط مربع الشكل. لديه بلاطة طول ضلعها 1 m. يريد معرفة عدد البلاطات اللازمة لتغطية أرضية الغرفة بالكامل.</p>
  </div>
  <div style="display: flex; justify-content: center; gap: 30px; margin: 30px 0; flex-wrap: wrap;">
    <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
      <svg width="200" height="150" viewBox="0 0 200 150">
        <rect x="20" y="20" width="160" height="100" fill="#e3f2fd" stroke="#1976D2" stroke-width="3"/>
        <line x1="20" y1="45" x2="180" y2="45" stroke="#1976D2" stroke-width="1" stroke-dasharray="5"/>
        <line x1="20" y1="70" x2="180" y2="70" stroke="#1976D2" stroke-width="1" stroke-dasharray="5"/>
        <line x1="20" y1="95" x2="180" y2="95" stroke="#1976D2" stroke-width="1" stroke-dasharray="5"/>
        <line x1="50" y1="20" x2="50" y2="120" stroke="#1976D2" stroke-width="1" stroke-dasharray="5"/>
        <line x1="80" y1="20" x2="80" y2="120" stroke="#1976D2" stroke-width="1" stroke-dasharray="5"/>
        <line x1="110" y1="20" x2="110" y2="120" stroke="#1976D2" stroke-width="1" stroke-dasharray="5"/>
        <line x1="140" y1="20" x2="140" y2="120" stroke="#1976D2" stroke-width="1" stroke-dasharray="5"/>
        <text x="150" y="140" fill="black">أرضية الغرفة</text>
      </svg>
      <p><strong>الغرفة مجهولة المساحة</strong></p>
    </div>
    <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <rect x="20" y="20" width="60" height="60" fill="#ffebee" stroke="#c2185b" stroke-width="3"/>
        <line x1="50" y1="15" x2="50" y2="25" y2="120" stroke="#1976D2" stroke-width="2"/>
        <line x1="50" y1="75" x2="50" y2="85" y2="120" stroke="#1976D2" stroke-width="2"/>
        <line x1="15" y1="50" x2="25" y2="50" y2="120" stroke="#1976D2" stroke-width="2"/>
        <line x1="75" y1="50" x2="85" y2="50" y2="120" stroke="#1976D2" stroke-width="2"/>

        <text x="60" y="55" fill="black">بلاطة</text>
        <text x="55" y="100" fill="black">1 m</text>
      </svg>
      <p><strong>بلاطة وحدة المساحة</strong></p>
    </div>
  </div>
  <p>🔍 كيف يمكن لسلمى مساعدة والدها في حساب عدد البلاطات دون قياس الأطوال؟</p>
  <p><strong>❓ التساؤلات:</strong></p>
  <ul>
    <li>كيف نقيس مساحة سطح باستخدام وحدات صغيرة؟</li>
    <li>ماذا نعني برصف سطح؟</li>
    <li>كيف نحسب عدد البلاطات اللازمة؟</li>
  </ul>

  <!-- 2️⃣ مرحلة البحث والاكتشاف -->
  <div style="background-color: #fff9e6; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
    <h3>🧪 نشاط استكشافي: هيا نكتشف المساحة بالرصف!</h3>
    <h4>📌 النشاط 1: تغطية سطح بالوحدات</h4>
    <p>لاحظ الأشكال التالية المكونة من مربعات متطابقة:</p>
    <div style="display: flex; justify-content: space-around; margin: 30px 0; flex-wrap: wrap;">
      <div style="text-align: center;">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <rect x="10" y="10" width="100" height="100" fill="none" stroke="black" stroke-width="2"/>
          <line x1="10" y1="35" x2="110" y2="35" stroke="black" stroke-width="1"/><line x1="10" y1="60" x2="110" y2="60" stroke="black" stroke-width="1"/><line x1="10" y1="85" x2="110" y2="85" stroke="black" stroke-width="1"/><line x1="35" y1="10" x2="35" y2="110" stroke="black" stroke-width="1"/><line x1="60" y1="10" x2="60" y2="110" stroke="black" stroke-width="1"/><line x1="85" y1="10" x2="85" y2="110" stroke="black" stroke-width="1"/>
          <rect x="10" y="10" width="75" height="75" fill="#1976D2" opacity="0.5"/>
        </svg>
        <p>الشكل 1</p>
      </div>
      <div style="text-align: center;">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <rect x="10" y="10" width="100" height="100" fill="none" stroke="black" stroke-width="2"/>
          <line x1="10" y1="35" x2="110" y2="35" stroke="black" stroke-width="1"/><line x1="10" y1="60" x2="110" y2="60" stroke="black" stroke-width="1"/><line x1="10" y1="85" x2="110" y2="85" stroke="black" stroke-width="1"/><line x1="35" y1="10" x2="35" y2="110" stroke="black" stroke-width="1"/><line x1="60" y1="10" x2="60" y2="110" stroke="black" stroke-width="1"/><line x1="85" y1="10" x2="85" y2="110" stroke="black" stroke-width="1"/>
          <rect x="10" y="10" width="50" height="50" fill="#FF9800" opacity="0.5"/><rect x="60" y="10" width="25" height="25" fill="#FF9800" opacity="0.5"/><rect x="10" y="60" width="25" height="25" fill="#FF9800" opacity="0.5"/>
        </svg>
        <p>الشكل 2</p>
      </div>
      <div style="text-align: center;">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <rect x="10" y="10" width="100" height="100" fill="none" stroke="black" stroke-width="2"/>
          <line x1="10" y1="35" x2="110" y2="35" stroke="black" stroke-width="1"/><line x1="10" y1="60" x2="110" y2="60" stroke="black" stroke-width="1"/><line x1="10" y1="85" x2="110" y2="85" stroke="black" stroke-width="1"/><line x1="35" y1="10" x2="35" y2="110" stroke="black" stroke-width="1"/><line x1="60" y1="10" x2="60" y2="110" stroke="black" stroke-width="1"/><line x1="85" y1="10" x2="85" y2="110" stroke="black" stroke-width="1"/>
          <polygon points="10,10 85,10 60,35 35,35" fill="#4CAF50" opacity="0.5"/><polygon points="60,35 85,10 110,35 85,60" fill="#4CAF50" opacity="0.5"/>
        </svg>
        <p>الشكل 3</p>
      </div>
    </div>
    <p><strong>❓ أسئلة موجهة:</strong></p>
    <ul>
      <li>كم مربعاً كاملاً في الشكل 1؟ <span style="background-color: #1976D2; color: white; padding: 3px 8px; border-radius: 15px;">9 مربعات</span></li>
      <li>كم مربعاً كاملاً في الشكل 2؟ <span style="background-color: #FF9800; color: white; padding: 3px 8px; border-radius: 15px;">3 مربعات</span></li>
      <li>هل يمكن قياس مساحة الشكل 3 بنفس الطريقة؟ <span style="background-color: #4CAF50; color: white; padding: 3px 8px; border-radius: 15px;">نعم، باستعمال أنصاف المربعات</span></li>
    </ul>
    <h4>📌 النشاط 2: مفهوم الرصف</h4>
    <p>الرصف هو تغطية سطح ما بوحدات مساحة متطابقة دون تداخل أو فراغات.</p>
    <div style="display: flex; justify-content: center; margin: 20px 0;">
      <svg width="300" height="150" viewBox="0 0 300 150">
        <rect x="20" y="20" width="200" height="80" fill="none" stroke="black" stroke-width="3"/>
        <rect x="20" y="20" width="40" height="40" fill="#1976D2" opacity="0.5" stroke="black"/>
        <rect x="60" y="20" width="40" height="40" fill="#1976D2" opacity="0.5" stroke="black"/>
        <rect x="100" y="20" width="40" height="40" fill="#1976D2" opacity="0.5" stroke="black"/>
        <rect x="140" y="20" width="40" height="40" fill="#1976D2" opacity="0.5" stroke="black"/>
        <rect x="180" y="20" width="40" height="40" fill="#1976D2" opacity="0.5" stroke="black"/>
        <rect x="20" y="60" width="40" height="40" fill="#1976D2" opacity="0.5" stroke="black"/>
        <rect x="60" y="60" width="40" height="40" fill="#1976D2" opacity="0.5" stroke="black"/>
        <rect x="100" y="60" width="40" height="40" fill="#1976D2" opacity="0.5" stroke="black"/>
        <rect x="140" y="60" width="40" height="40" fill="#1976D2" opacity="0.5" stroke="black"/>
        <rect x="180" y="60" width="40" height="40" fill="#1976D2" opacity="0.5" stroke="black"/>
      </svg>
    </div>
  </div>
</div>
  `;

  const lesson = await prisma.lesson.create({
    data: {
      title: 'تعيين مساحة سطح مستو باستعمال رصف بسيط',
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
            question: 'أكمل الفراغات:\n1) المساحة هي عدد ... التي تغطي سطحاً\n2) وحدة المساحة هي مساحة ... طول ضلعه وحدة طول\n3) 1 cm² هو مساحة مربع طول ضلعه ...\n4) كل نصفين من المربع يشكلان ...',
            expectedResults: JSON.stringify([
              { question: "1", result: "الوحدات المربعة" },
              { question: "2", result: "مربع" },
              { question: "3", result: "1 cm" },
              { question: "4", result: "مربعاً كاملاً" }
            ]),
            displayOrder: 1, maxScore: 4, exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'support_with_results',
            question: 'أحسب مساحة الأشكال التالية:\n<div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 20px;"><div style="text-align: center;"><svg width="100" height="100" viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="80" fill="none" stroke="black" stroke-width="2"/><line x1="10" y1="30" x2="90" y2="30" stroke="black" stroke-width="1"/><line x1="10" y1="50" x2="90" y2="50" stroke="black" stroke-width="1"/><line x1="10" y1="70" x2="90" y2="70" stroke="black" stroke-width="1"/><line x1="30" y1="10" x2="30" y2="90" stroke="black" stroke-width="1"/><line x1="50" y1="10" x2="50" y2="90" stroke="black" stroke-width="1"/><line x1="70" y1="10" x2="70" y2="90" stroke="black" stroke-width="1"/><rect x="10" y="10" width="60" height="60" fill="#1976D2" opacity="0.5"/></svg><p>الشكل 1</p></div><div style="text-align: center;"><svg width="100" height="100" viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="80" fill="none" stroke="black" stroke-width="2"/><line x1="10" y1="30" x2="90" y2="30" stroke="black" stroke-width="1"/><line x1="10" y1="50" x2="90" y2="50" stroke="black" stroke-width="1"/><line x1="10" y1="70" x2="90" y2="70" stroke="black" stroke-width="1"/><line x1="30" y1="10" x2="30" y2="90" stroke="black" stroke-width="1"/><line x1="50" y1="10" x2="50" y2="90" stroke="black" stroke-width="1"/><line x1="70" y1="10" x2="70" y2="90" stroke="black" stroke-width="1"/><rect x="10" y="10" width="40" height="40" fill="#FF9800" opacity="0.5"/><rect x="50" y="10" width="20" height="20" fill="#FF9800" opacity="0.5"/><rect x="10" y="50" width="20" height="20" fill="#FF9800" opacity="0.5"/></svg><p>الشكل 2</p></div></div>',
            expectedResults: JSON.stringify([
              { question: "الشكل 1", result: "9" },
              { question: "الشكل 2", result: "4" }
            ]),
            displayOrder: 2, maxScore: 2, exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'support_with_results',
            question: 'اختر الإجابة الصحيحة:\n1) وحدة المساحة هي مساحة ...\n2) 1 m² تعني ...\n3) 4 أنصاف مربعات = ...\n4) المساحة تقاس بـ ...',
            expectedResults: JSON.stringify([
              { question: "1", result: "مربع" },
              { question: "2", result: "متر مربع" },
              { question: "3", result: "2 وحدات" },
              { question: "4", result: "cm², m²" }
            ]),
            displayOrder: 3, maxScore: 4, exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'support_with_results',
            question: 'أكمل الجدول:\n| المربعات الكاملة | أنصاف المربعات | المساحة (وحدة) |\n|---|---|---|\n| 8 | 4 | ؟ |\n| 12 | 2 | ؟ |\n| 6 | 8 | ؟ |\n| 15 | 0 | ؟ |',
            expectedResults: JSON.stringify([
              { question: "1", result: "10" },
              { question: "2", result: "13" },
              { question: "3", result: "10" },
              { question: "4", result: "15" }
            ]),
            displayOrder: 4, maxScore: 4, exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'support_with_results',
            question: 'أحسب مساحة الشكل:\n<div style="text-align: center;"><svg width="200" height="150" viewBox="0 0 200 150"><rect x="20" y="20" width="150" height="100" fill="none" stroke="black" stroke-width="3"/><line x1="20" y1="45" x2="170" y2="45" stroke="black" stroke-width="1"/><line x1="20" y1="70" x2="170" y2="70" stroke="black" stroke-width="1"/><line x1="20" y1="95" x2="170" y2="95" stroke="black" stroke-width="1"/><line x1="50" y1="20" x2="50" y2="120" stroke="black" stroke-width="1"/><line x1="80" y1="20" x2="80" y2="120" stroke="black" stroke-width="1"/><line x1="110" y1="20" x2="110" y2="120" stroke="black" stroke-width="1"/><line x1="140" y1="20" x2="140" y2="120" stroke="black" stroke-width="1"/><polygon points="20,20 80,20 110,45 110,70 80,95 20,95" fill="#FF9800" opacity="0.5"/><polygon points="110,45 140,45 140,70 110,70" fill="#FF9800" opacity="0.5"/></svg></div>',
            expectedResults: JSON.stringify([{ question: "1", result: "11" }]),
            displayOrder: 5, maxScore: 3, exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'support_with_results',
            question: 'قارن بين مساحتي الشكلين A و B:\n<div style="display: flex; justify-content: space-around; flex-wrap: wrap;"><div style="text-align: center;"><svg width="120" height="120" viewBox="0 0 120 120"><rect x="10" y="10" width="100" height="100" fill="none" stroke="black" stroke-width="2"/><line x1="10" y1="35" x2="110" y2="35" stroke="black" stroke-width="1"/><line x1="10" y1="60" x2="110" y2="60" stroke="black" stroke-width="1"/><line x1="10" y1="85" x2="110" y2="85" stroke="black" stroke-width="1"/><line x1="35" y1="10" x2="35" y2="110" stroke="black" stroke-width="1"/><line x1="60" y1="10" x2="60" y2="110" stroke="black" stroke-width="1"/><line x1="85" y1="10" x2="85" y2="110" stroke="black" stroke-width="1"/><rect x="10" y="10" width="75" height="50" fill="#4CAF50" opacity="0.5"/></svg><p>شكل A</p></div><div style="text-align: center;"><svg width="120" height="120" viewBox="0 0 120 120"><rect x="10" y="10" width="100" height="100" fill="none" stroke="black" stroke-width="2"/><line x1="10" y1="35" x2="110" y2="35" stroke="black" stroke-width="1"/><line x1="10" y1="60" x2="110" y2="60" stroke="black" stroke-width="1"/><line x1="10" y1="85" x2="110" y2="85" stroke="black" stroke-width="1"/><line x1="35" y1="10" x2="35" y2="110" stroke="black" stroke-width="1"/><line x1="60" y1="10" x2="60" y2="110" stroke="black" stroke-width="1"/><line x1="85" y1="10" x2="85" y2="110" stroke="black" stroke-width="1"/><rect x="10" y="10" width="50" height="75" fill="#FF9800" opacity="0.5"/></svg><p>شكل B</p></div></div>',
            expectedResults: JSON.stringify([
              { question: "مساحة A", result: "9" },
              { question: "مساحة B", result: "9" },
              { question: "المقارنة", result: "=" }
            ]),
            displayOrder: 6, maxScore: 3, exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'support_with_results',
            question: 'ارسم شكلاً على شبكة مربعات مساحته 12 وحدة مربعة.',
            expectedResults: JSON.stringify([{ question: "1", result: "رسم صحيح لشكل مساحته 12 وحدة" }]),
            displayOrder: 7, maxScore: 2, exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'main',
            question: 'مشكلة: غرفة مستطيلة طولها 5 m وعرضها 3 m. نريد تبليطها ببلاط مربع طول ضلعه 1 m. كم بلاطة نحتاج؟',
            modelAnswer: 'نحتاج 15 بلاطة. (5 * 3 = 15)',
            displayOrder: 8, maxScore: 5, exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'main',
            question: 'مسألة: حديقة مربعة الشكل طول ضلعها 8 m. نريد زراعتها بالعشب. احسب المساحة المراد زراعتها.',
            modelAnswer: 'المساحة هي 64 متر مربع. (8 * 8 = 64)',
            displayOrder: 9, maxScore: 5, exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'main',
            question: 'التحدي الكبير: شكل مكون من مستطيل طوله 6 وحدات وعرضه 4 وحدات، ومربع ملتصق به طول ضلعه 2 وحدات. احسب المساحة الكلية.',
            modelAnswer: 'مساحة المستطيل = 6 * 4 = 24. مساحة المربع = 2 * 2 = 4. المساحة الكلية = 24 + 4 = 28 وحدة مربعة.',
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

