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

  const lessonTitle = "خواص التناظر المحوري";

  const content = `
<div dir="rtl">
  <div style="background-color: #f0f9ff; padding: 25px; border-radius: 15px; margin: 20px 0;">
    <h3>🏠 مشكلة: رسم واجهة المنزل</h3>
    <p>أحمد يريد رسم واجهة منزله على ورقة بيضاء. لاحظ أن المنزل متماثل تمامًا بحيث ينقسم إلى نصفين متطابقين إذا رسمنا خطًا في منتصفه.</p>
    <div style="display: flex; justify-content: center; gap: 40px; margin: 30px 0; flex-wrap: wrap;">
      <div style="text-align: center; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <svg width="180" height="150" viewBox="0 0 180 150">
        <rect x="40" y="60" width="100" height="60" fill="#f9e6c2" stroke="brown" stroke-width="2"/>
        <polygon points="40,60 90,20 140,60" fill="#d4a373" stroke="brown" stroke-width="2"/>
        <rect x="70" y="85" width="40" height="35" fill="#b3e5fc" stroke="brown" stroke-width="2"/>
        <circle cx="90" cy="102" r="3" fill="black"/><rect x="80" y="95" width="20" height="5" fill="brown"/>
        <line x1="90" y1="10" x2="90" y2="140" stroke="red" stroke-width="3" stroke-dasharray="5"/>
        <text x="85" y="15" fill="red">(d)</text>
        </svg>
        <p><strong>الشكل الأصلي</strong></p>
      </div>
      <div style="text-align: center; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <svg width="180" height="150" viewBox="0 0 180 150"><rect x="40" y="60" width="50" height="60" fill="#f9e6c2" stroke="brown" stroke-width="2"/><polygon points="40,60 67,20 90,60" fill="#d4a373" stroke="brown" stroke-width="2"/><rect x="70" y="85" width="20" height="35" fill="#b3e5fc" stroke="brown" stroke-width="2"/>
        <line x1="90" y1="10" x2="90" y2="140" stroke="red" stroke-width="3" stroke-dasharray="5"/>
        <text x="85" y="15" fill="red">(d)</text>
        </svg>
        <p><strong>نصف الشكل فقط</strong></p>
      </div>
    </div>
    <p><strong>🔍 الملاحظة:</strong> رسم أحمد نصف المنزل فقط (الجزء الأيسر). كيف يمكنه الحصول على النصف الأيمن دون إعادة الرسم من جديد؟ وما هي العلاقة بين النقطتين المتناظرتين بالنسبة لهذا الخط؟</p>
  </div>
  <div style="background-color: #fff9e6; padding: 25px; border-radius: 15px; margin: 20px 0;">
    <h3>🧪 نشاط استكشافي: هيا نكتشف معًا!</h3>
    <p><strong>📌 النشاط 1: انعكاس النقاط</strong></p>
    <p>خذ ورقة شفافة وارسم محورًا أحمر. ضع نقاطًا على يسار المحور ثم اطوِ الورقة.</p>
    <div style="display: flex; justify-content: space-around; margin: 30px 0; flex-wrap: wrap;">
      <div style="text-align: center;">
      <svg width="120" height="120" viewBox="0 0 120 120">
      <line x1="60" y1="10" x2="60" y2="140" stroke="red" stroke-width="3" stroke-dasharray="5"/>
        <text x="85" y="15" fill="red">(d)</text>
        <circle cx="30" cy="40" r="4" fill="blue"/><text x="20" y="35" fill="blue">A</text><circle cx="30" cy="70" r="4" fill="blue"/><text x="20" y="65" fill="blue">B</text><circle cx="30" cy="100" r="4" fill="blue"/><text x="20" y="95" fill="blue">C</text></svg><p>① نرسم النقاط</p></div>
      <div style="text-align: center;">
      <svg width="120" height="120" viewBox="0 0 120 120">
      <line x1="60" y1="10" x2="60" y2="140" stroke="red" stroke-width="3" stroke-dasharray="5"/>
        <text x="85" y="15" fill="red">(d)</text>
      <circle cx="30" cy="40" r="4" fill="blue"/>
      <circle cx="90" cy="40" r="4" fill="green"/>
      <text x="105" y="35" fill="green">A'</text>
      <circle cx="30" cy="70" r="4" fill="blue"/>
      <circle cx="90" cy="70" r="4" fill="green"/>
      <text x="105" y="65" fill="green">B'</text>
      <circle cx="30" cy="100" r="4" fill="blue"/>
      <circle cx="90" cy="100" r="4" fill="green"/>
      <text x="105" y="95" fill="green">C'</text>
      </svg><p>② نظائرها بعد الطي</p></div>
    </div>
    <p><strong>❓ أسئلة موجهة:</strong></p>
    <ul>
      <li>ماذا تلاحظ على المسافة بين كل نقطة والمحور مقارنة بنظيرتها؟</li>
      <li>كيف يبدو المستقيم الواصل بين A و A' بالنسبة للمحور؟</li>
      <li>إذا كانت A على بعد 3 مربعات من المحور، فكم يكون بعد A'؟</li>
    </ul>
  </div>
  <div style="background-color: #e3f2fd; padding: 25px; border-radius: 15px; margin: 20px 0;">
    <h3>📚 تعريف: خواص التناظر المحوري</h3>
    <div style="border-right: 5px solid #1976D2; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
      <h4>🔷 الخاصية ①: التناظر المحوري يحافظ على المسافات</h4>
      <p>المسافات: طول أي قطعة مستقيمة يساوي طول نظيرتها. (AB = A'B').</p>
      <p>أي: إذا كانت A' نظيرة A بالنسبة للمحور (d)، وكانت H المسقط العمودي لـ A على (d)، فإن: <strong>AH = A'H</strong> و <strong>(AH) ⊥ (d)</strong></p>
    </div>
    <div style="border-right: 5px solid #c2185b; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
      <h4>🔷 الخاصية ②: التناظر المحوري يحافظ على أقياس الزوايا</h4>
      <p>أقياس الزوايا: قياس أي زاوية يساوي قياس نظيرتها. (Â = Â').</p>
    </div>
    <div style="border-right: 5px solid #4CAF50; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
      <h4>🔷 الخاصية ③: التناظر المحوري يحافظ على المساحة والمحيط</h4>
      <p>الشكل ونظيره بالنسبة لمحور (d) هما شكلان متطابقان تمامًا. هذا يعني أن التناظر المحوري يحافظ على:</p>
      <ul style="margin-right: 20px;">
      <li><strong>المساحة:</strong> مساحة أي شكل تساوي مساحة نظيره.</li>
      <li><strong>المحيط:</strong> محيط أي شكل يساوي محيط نظيره.</li>
      <li><strong>الاستقامة:</strong> نظائر نقاط على استقامة واحدة تكون هي أيضًا على استقامة واحدة.</li>
      </ul>
    </div>
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
      question: 'أكمل الفراغات:\n1. النقطة ونظيرتها تبعدان ...... المسافة عن محور التناظر.\n2. المستقيم الواصل بين نقطة ونظيرتها يكون ...... على محور التناظر.\n3. إذا كانت A على بعد 3 cm من المحور، فإن A\' على بعد ...... cm.\n4. إذا كانت A تقع على المحور، فإن نظيرتها هي ......', 
      expectedResults: [
        { question: "1", result: "نفس" },
        { question: "2", result: "عمودي" },
        { question: "3", result: "3" },
        { question: "4", result: "نفسها" }
      ],
      displayOrder: 1
    },
    { 
      type: 'support_with_results', 
      question: 'أكمل الجدول:\nالنقطة | بعدها عن المحور | نظيرتها | بعد نظيرتها\nA | 4 cm | A\' | ⬜\nB | ⬜ | B\' | 5 cm\nC | 2 cm | ⬜ | 2 cm', 
      expectedResults: [
        { question: "A'", result: "4 cm" },
        { question: "B", result: "5 cm" },
        { question: "C", result: "C'" }
      ],
      displayOrder: 2
    },
    { 
      type: 'support_with_results', 
      question: 'اختر الإجابة الصحيحة:\n1. نظيرة نقطة على المحور هي نفسها (صواب/خطأ)\n2. المسافات قد تختلف (صواب/خطأ)\n3. الشكل ونظيره متطابقان (صواب/خطأ)', 
      expectedResults: [
        { question: "1", result: "صواب" },
        { question: "2", result: "خطأ" },
        { question: "3", result: "صواب" }
      ],
      displayOrder: 3
    },
    { 
      type: 'support_with_results', 
      question: 'ارسم نظيرة كل نقطة:\nA\' في ...\nB\' في ...', 
      expectedResults: [
        { question: "A'", result: "يمين المحور بنفس البعد" },
        { question: "B'", result: "يمين المحور بنفس البعد" }
      ],
      displayOrder: 4
    },
    { 
      type: 'support_with_results', 
      question: 'لدينا قطعة [AB] طولها 6 cm، تبعد A عن المحور 2 cm، وتبعد B عن المحور 3 cm. أوجد طول القطعة النظيرة [A\'B\'] ومسافة كل من A\' و B\' عن المحور.', 
      expectedResults: [
        { question: "طول A'B'", result: "6 cm" },
        { question: "بعد A'", result: "2 cm" },
        { question: "بعد B'", result: "3 cm" }
      ],
      displayOrder: 5
    },
    { 
      type: 'main', 
      question: 'الوضعية: نصف شكل مرسوم على يسار محور. أكمل رسم الشكل ليكون متناظرًا.', 
      modelAnswer: 'يجب رسم النصف الآخر من الشكل بحيث يكون متطابقاً مع النصف الأول عند الطي على المحور.' 
    },
    { 
      type: 'main', 
      question: 'مشكلة حياتية: وضع سجادتان متماثلتان في غرفة مستطيلة. السجادة اليسرى تبعد 1.5 m عن الجدار الأيسر و 2 m عن الجدار الأمامي. إذا كان محور التناظر هو منتصف الغرفة، حدد موقع السجادة اليمنى.', 
      modelAnswer: 'السجادة اليمنى تبعد 1.5 m عن الجدار الأيمن و 2 m عن الجدار الأمامي.' 
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