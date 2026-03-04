import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding Lesson: Number Line (Half-line) ...');

  // 1. Fetch the Teacher
  const teacherEmail = 'ladj14013@gmail.com';
  const teacher = await prisma.user.findUnique({
    where: { email: teacherEmail },
    include: { userDetails: true }
  });

  if (!teacher) {
    console.error(`❌ Teacher ${teacherEmail} not found. Please run 'prisma/seed-users.ts' first.`);
    return;
  }

  // 2. Fetch Level (1CEM)
  const level = await prisma.level.findFirst({
    where: { name: { contains: 'أولى متوسط' } }
  });

  if (!level) {
    console.error('❌ Level "أولى متوسط" not found.');
    return;
  }

  // 3. Fetch Subject
  const subjectId = teacher.userDetails?.subjectId;

  if (!subjectId) {
     console.error('❌ Teacher has no subject assigned.');
     return;
  }

  const subject = await prisma.subject.findUnique({
      where: { id: subjectId }
  });

  if (!subject) {
      console.error('❌ Subject not found.');
      return;
  }

  // 4. Prepare Content (HTML formatted)
  const lessonContent = `
    <div dir="rtl">
      <!-- 1️⃣ وضعية انطلاق (Situation-problème) -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
        <h3>🏠 مشكلة: ترقيم المنازل في شارع العيد</h3>
        <p>في شارع "العيد" ببلدية الحراش، تم ترقيم المنازل بشكل منتظم. منزل رقم 0 في بداية الشارع، ثم منزل رقم 1 على بعد 50 مترًا، ومنزل رقم 2 على بعد 100 متر، وهكذا.</p>
      </div>

      <div style="display: flex; justify-content: center; gap: 20px; margin: 30px 0; flex-wrap: wrap;">
        <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1); width: 200px;">
          <div style="background-color: #ffcdd2; padding: 10px; border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
            <span style="font-size: 1.5em;">🏠</span>
          </div>
          <p style="font-weight: bold;">منزل 0</p>
          <p style="color: #1976D2;">بداية الشارع</p>
        </div>
        <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1); width: 200px;">
          <div style="background-color: #ffebee; padding: 10px; border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
            <span style="font-size: 1.5em;">🏠</span>
          </div>
          <p style="font-weight: bold;">منزل 1</p>
          <p style="color: #FF9800;">على بعد 50 m</p>
        </div>
        <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1); width: 200px;">
          <div style="background-color: #e8f5e9; padding: 10px; border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
            <span style="font-size: 1.5em;">🏠</span>
          </div>
          <p style="font-weight: bold;">منزل 2</p>
          <p style="color: #4CAF50;">على بعد 100 m</p>
        </div>
      </div>
      <p>🔍 يريد مقاول وضع منزل جديد بين المنزل 1 والمنزل 2، على بعد 75 مترًا من البداية.</p>
      <p><strong>❓ التساؤلات:</strong></p>
      <ul>
        <li>كيف نمثل هذا الشارع رياضياً؟</li>
        <li>كيف نحدد موقع المنزل الجديد بدقة؟</li>
        <li>كيف نكتب رقم هذا المنزل؟</li>
      </ul>

      <!-- 2️⃣ مرحلة البحث والاكتشاف -->
      <div style="background-color: #fff9e6; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <h3>🧪 نشاط استكشافي: هيا نكتشف نصف المستقيم المدرج!</h3>
        <h4>📌 النشاط 1: من الشارع إلى المستقيم</h4>
        <p>لنرسم الشارع على شكل خط مستقيم:</p>
        <div style="text-align: center; margin: 30px 0;">
          <svg width="500" height="80" viewBox="0 0 500 80">
            <line x1="30" y1="40" x2="470" y2="40" stroke="black" stroke-width="4"/>
            <circle cx="30" cy="40" r="5" fill="red"/>
            <text x="25" y="25" fill="red" font-size="14">0</text>
            <circle cx="150" cy="40" r="5" fill="blue"/>
            <text x="145" y="25" fill="blue" font-size="14">1</text>
            <circle cx="270" cy="40" r="5" fill="green"/>
            <text x="265" y="25" fill="green" font-size="14">2</text>
            <circle cx="390" cy="40" r="5" fill="purple"/>
            <text x="385" y="25" fill="purple" font-size="14">3</text>
            <line x1="30" y1="35" x2="30" y2="45" stroke="black" stroke-width="2"/>
            <line x1="150" y1="35" x2="150" y2="45" stroke="black" stroke-width="2"/>
            <line x1="270" y1="35" x2="270" y2="45" stroke="black" stroke-width="2"/>
            <line x1="390" y1="35" x2="390" y2="45" stroke="black" stroke-width="2"/>
            <polygon points="470,40 460,35 460,45" fill="black"/>
          </svg>
          <p style="margin-top: 10px;"><strong>نصف مستقيم مدرّج: نقطة البداية 0 والأعداد تتزايد نحو اليمين</strong></p>
        </div>
        <h4>📌 النشاط 2: اكتشاف المقياس</h4>
        <p>في شارعنا، المسافة بين كل منزلين متتاليين هي 50 متر.</p>
        <table style="width:100%; text-align:center; border-collapse: collapse; margin: 10px 0;">
          <tr style="background-color: #f0f0f0;"><th>المنزل</th><td>0</td><td>1</td><td>2</td><td>3</td></tr>
          <tr><th>المسافة من البداية</th><td>0 m</td><td>50 m</td><td>100 m</td><td>150 m</td></tr>
        </table>
        <p><strong>❓ أسئلة موجهة:</strong></p>
        <ul>
          <li>كم سنتيمتراً على الرسم يمثل 50 متراً في الحقيقة؟ <span style="background-color: #1976D2; color: white; padding: 3px 8px; border-radius: 15px;">هذا هو المقياس</span></li>
          <li>إذا أردنا وضع منزل على بعد 75 متراً، أين نضعه على الرسم؟ <span style="background-color: #FF9800; color: white; padding: 3px 8px; border-radius: 15px;">في منتصف المسافة بين 1 و 2</span></li>
        </ul>
      </div>

      <!-- 3️⃣ بناء المفهوم -->
      <div style="background: linear-gradient(135deg, #43C6AC 0%, #191654 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
        <h3>📚 نصف المستقيم المدرج</h3>
      </div>
      <div style="background-color: #e3f2fd; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="border-right: 8px solid #1976D2; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h4>🔷 <span style="color: #1976D2;">تعريف نصف المستقيم المدرج</span></h4>
          <p>نصف المستقيم المدرج هو خط مستقيم يبدأ من نقطة تسمى المبدأ (عادة 0)، ثم نضع عليه تدريجات متساوية تمثل الأعداد المتزايدة.</p>
        </div>
        <div style="border-right: 8px solid #c2185b; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h4>🔷 <span style="color: #c2185b;">مكونات نصف المستقيم المدرج</span></h4>
          <ul>
            <li><strong>المبدأ:</strong> نقطة البداية (عادة 0).</li>
            <li><strong>التدريجات:</strong> علامات متساوية المسافة.</li>
            <li><strong>الاتجاه:</strong> الأعداد تتزايد نحو اليمين.</li>
          </ul>
        </div>
        <div style="border-right: 8px solid #4CAF50; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h4>🔷 <span style="color: #4CAF50;">المقياس</span></h4>
          <p>المقياس هو طول الوحدة على الرسم، أي المسافة بين تدريج وآخر.</p>
        </div>
        <div style="border-right: 8px solid #FF9800; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h4>🔷 <span style="color: #FF9800;">كيف نعين نقطة على نصف مستقيم مدرج؟</span></h4>
          <ol>
            <li>نحدد المبدأ (0).</li>
            <li>نحدد المقياس (مثلاً 1 cm = 1).</li>
            <li>نحسب المسافة = العدد × المقياس.</li>
            <li>نضع النقطة على المسافة المحسوبة من المبدأ.</li>
          </ol>
        </div>
      </div>

      <!-- 4️⃣ تمثيل متعدد للمفهوم -->
      <div style="background: linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
        <h3>🎭 أربع تمثيلات لنصف المستقيم المدرج</h3>
      </div>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;">
        <div style="background: linear-gradient(145deg, #ffffff, #e3f2fd); padding: 20px; border-radius: 15px;">
          <h4 style="color: #1976D2; text-align: center;">🔢 تمثيل عددي</h4>
          <p style="text-align: center;">الأعداد: 0, 1, 2, 3, ...</p>
        </div>
        <div style="background: linear-gradient(145deg, #ffffff, #ffebee); padding: 20px; border-radius: 15px;">
          <h4 style="color: #c2185b; text-align: center;">📝 تمثيل لفظي</h4>
          <p style="text-align: center;">"نصف مستقيم يبدأ من 0، بتدريجات متساوية، يتزايد نحو اليمين"</p>
        </div>
      </div>

      <!-- 5️⃣ أمثلة محلولة تدريجيًا -->
      <div style="background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #ddd;">
        <h4>📌 مثال 1: بسيط جدًا</h4>
        <p><strong>المطلوب:</strong> مثل العدد 4 على نصف مستقيم مدرّج مقياسه 1 cm.</p>
        <p><strong>الحل:</strong> نضع النقطة عند المسافة 4 cm من 0.</p>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #ddd;">
        <h4>📌 مثال 2: متوسط</h4>
        <p><strong>المطلوب:</strong> مثل العدد 2,5 على نصف مستقيم مدرّج مقياسه 2 cm.</p>
        <p><strong>الحل:</strong> المسافة = 2,5 × 2 = 5 cm. نضع النقطة على بعد 5 cm من 0.</p>
      </div>

      <!-- 6️⃣ أخطاء شائعة -->
      <div style="background-color: #ffebee; padding: 25px; border-radius: 15px; margin: 20px 0;">
        <h3>⚠️ أخطاء شائعة</h3>
        <ul>
          <li><strong>الخطأ:</strong> عدم احترام المقياس. <strong>الحل:</strong> تذكر أن المسافة = العدد × المقياس.</li>
          <li><strong>الخطأ:</strong> نسيان نقطة البداية 0. <strong>الحل:</strong> دائماً ابدأ من 0.</li>
        </ul>
      </div>

      <!-- ✨ خلاصة الدرس -->
      <div style="background: linear-gradient(135deg, #43C6AC 0%, #191654 100%); padding: 30px; border-radius: 15px; margin: 30px 0; text-align: center; color: white;">
        <h3>📌 الخلاصة</h3>
        <p style="font-size: 1.5em;">✨ القاعدة الذهبية: المسافة = العدد × المقياس ✨</p>
      </div>
    </div>
  `;

  // 5. Create Lesson
  const lesson = await prisma.lesson.create({
    data: {
      title: 'التعليم وتعليم نقاط على نصف مستقيم مدرج',
      content: lessonContent,
      subjectId: subject.id,
      levelId: level.id,
      authorId: teacher.id,
      status: 'approved',
      published: true,
      type: 'public',
      exercises: {
        create: [
          // 🟢 تمارين الدعم (70%)
          {
            type: 'support_with_results',
            question: 'التمرين 01: أكمل الفراغات:\n1) نصف المستقيم المدرج يبدأ من النقطة ...\n2) المسافة بين تدريجين متتاليين تسمى ...\n3) الأعداد على نصف المستقيم ... نحو اليمين\n4) إذا كان المقياس 2 cm، فإن العدد 3 يبعد عن 0 مسافة ...',
            expectedResults: [
              { question: "1", result: "0", tolerance: 0 },
              { question: "2", result: "المقياس", tolerance: 0 },
              { question: "3", result: "تتزايد", tolerance: 0 },
              { question: "4", result: "6 cm", tolerance: 0 }
            ],
            displayOrder: 1,
            maxScore: 4
          },
          {
            type: 'support_with_results',
            question: 'التمرين 02: أكمل الجدول (احسب المسافة من 0):\n1) العدد 3 (مقياس 1 cm)\n2) العدد 4 (مقياس 2 cm)\n3) العدد 2,5 (مقياس 1 cm)\n4) العدد 1,5 (مقياس 2 cm)\n5) العدد 0,5 (مقياس 1 cm)',
            expectedResults: [
              { question: "1", result: "3 cm", tolerance: 0 },
              { question: "2", result: "8 cm", tolerance: 0 },
              { question: "3", result: "2,5 cm", tolerance: 0 },
              { question: "4", result: "3 cm", tolerance: 0 },
              { question: "5", result: "0,5 cm", tolerance: 0 }
            ],
            displayOrder: 2,
            maxScore: 5
          },
          {
            type: 'support_only',
            question: 'التمرين 03: ضع النقاط التالية على مستقيم مدرج (المقياس 1 cm):\nA(2), B(3,5), C(1,5)',
            modelAnswer: 'يتم رسم مستقيم مدرج وتعيين النقاط: A عند 2cm، B عند 3.5cm، C عند 1.5cm.',
            displayOrder: 3,
            maxScore: 3
          },
          {
            type: 'support_with_results',
            question: 'التمرين 04: أوجد العددين A و B من الرسم (المقياس 1 cm):\nالنقطة A تقع في المنتصف بين 2 و 3.\nالنقطة B تقع في المنتصف بين 3 و 4.',
            expectedResults: [
              { question: "A", result: "2,5", tolerance: 0 },
              { question: "B", result: "3,5", tolerance: 0 }
            ],
            displayOrder: 4,
            maxScore: 2
          },
          {
            type: 'support_only',
            question: 'التمرين 05: ارسم نصف مستقيم مدرّج مقياسه 1,5 cm، ثم مثل النقاط: 0، 1، 2، 3، 4.',
            modelAnswer: 'رسم مستقيم بتدريجات متباعدة بـ 1.5 cm.',
            displayOrder: 5,
            maxScore: 3
          },
          {
            type: 'support_with_results',
            question: 'التمرين 06: احسب الناقص:\n1) العدد ؟ (مقياس 1,5 cm، المسافة 6 cm)\n2) المقياس ؟ (العدد 2,2، المسافة 4,4 cm)',
            expectedResults: [
              { question: "1", result: "4", tolerance: 0 },
              { question: "2", result: "2 cm", tolerance: 0 }
            ],
            displayOrder: 6,
            maxScore: 2
          },
          {
            type: 'support_only',
            question: 'التمرين 07: ارسم نصف مستقيم مقياسه 2 cm، ثم مثل الأعداد: 0,5 - 1,2 - 2,7.',
            modelAnswer: 'رسم مستقيم بتدريجات 2cm. 0.5 عند 1cm، 1.2 عند 2.4cm، 2.7 عند 5.4cm.',
            displayOrder: 7,
            maxScore: 3
          },
          // 🔴 التمارين الرئيسية (30%)
          {
            type: 'main',
            question: 'التمرين 08: شارع طوله 500 متر، المنازل مرقمة من 0 إلى 10. المسافة بين منزل وآخر 50 متر.\nالمطلوب:\n1) كم متراً يبعد المنزل 7 عن المنزل 3؟',
            modelAnswer: 'المسافة = (7 - 3) × 50 = 200 متر.',
            displayOrder: 8,
            maxScore: 5
          },
          {
            type: 'main',
            question: 'التمرين 09: في مدينة الجلفة، سجلت درجات الحرارة التالية: الاثنين 15°، الثلاثاء 18°، الأربعاء 12°، الخميس 20°.\nالمطلوب: مثل كل درجة حرارة بنقطة على نصف مستقيم (مقياس 1 cm = 2°).',
            modelAnswer: 'الاثنين: 7.5cm، الثلاثاء: 9cm، الأربعاء: 6cm، الخميس: 10cm.',
            displayOrder: 9,
            maxScore: 5
          },
          {
            type: 'main',
            question: 'التمرين 10: على نصف مستقيم مدرّج مقياسه 1,5 cm، النقاط A(2), B(5). C منتصف [AB]. D تبعد عن C مسافة وحدة واحدة باتجاه الأعداد الكبيرة.\nالمطلوب: أوجد العدد الذي تمثله C والعدد الذي تمثله D.',
            modelAnswer: 'C = 3,5\nD = 4,5',
            displayOrder: 10,
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