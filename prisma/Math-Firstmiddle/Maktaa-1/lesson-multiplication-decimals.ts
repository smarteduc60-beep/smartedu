import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding Lesson: Multiplication by 0.1, 0.01, 0.001 ...');

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
        <h3>🏪 مشكلة: شراء جزء من كيلوغرام من الفواكه</h3>
        <p>ذهبت سارة مع والدتها إلى السوق لشراء الفواكه. أرادت شراء كمية قليلة من الفواكه المختلفة:</p>
      </div>

      <div style="display: flex; justify-content: center; gap: 30px; margin: 30px 0; flex-wrap: wrap;">
        <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <div style="background-color: #ffcdd2; padding: 15px; border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
            <span style="font-size: 2.5em;">🍎</span>
          </div>
          <p style="font-weight: bold;">تفاح</p>
          <p style="background-color: #1976D2; color: white; padding: 5px 15px; border-radius: 20px;">0,1 kg</p>
          <p style="font-size: 0.9em;">ثمن الكيلو: 40 DA</p>
        </div>
        <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <div style="background-color: #ffebee; padding: 15px; border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
            <span style="font-size: 2.5em;">🍓</span>
          </div>
          <p style="font-weight: bold;">فراولة</p>
          <p style="background-color: #FF9800; color: white; padding: 5px 15px; border-radius: 20px;">0,01 kg</p>
          <p style="font-size: 0.9em;">ثمن الكيلو: 800 DA</p>
        </div>
        <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <div style="background-color: #e8f5e9; padding: 15px; border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
            <span style="font-size: 2.5em;">🍇</span>
          </div>
          <p style="font-weight: bold;">عنب</p>
          <p style="background-color: #4CAF50; color: white; padding: 5px 15px; border-radius: 20px;">0,001 kg</p>
          <p style="font-size: 0.9em;">ثمن الكيلو: 1200 DA</p>
        </div>
      </div>
      <p>🔍 تحتاج سارة لحساب ثمن كل كمية: 40 × 0,1 = ؟ ، 800 × 0,01 = ؟ ، 1200 × 0,001 = ؟</p>
      <p><strong>❓ التساؤلات:</strong></p>
      <ul>
        <li>كيف نضرب في 0,1 بسرعة؟</li>
        <li>ما العلاقة بين 40 × 0,1 و 40 ÷ 10؟</li>
        <li>هل هناك قاعدة سهلة للضرب في 0,1 ، 0,01 ، 0,001؟</li>
      </ul>

      <!-- 2️⃣ مرحلة البحث والاكتشاف -->
      <div style="background-color: #fff9e6; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <h3>🧪 نشاط استكشافي: هيا نكتشف السر!</h3>
        <h4>📌 النشاط 1: اكتشاف العلاقة مع القسمة</h4>
        <p>لاحظ الجدول التالي وأكمل:</p>
        <div style="background-color: white; padding: 20px; border-radius: 15px; margin: 20px 0; overflow-x: auto;">
          <table style="width:100%; text-align:center;">
            <tr><th>العملية</th><th>النتيجة</th><th>العملية المكافئة</th></tr>
            <tr><td>40 × 0,1</td><td><span style="background-color: #1976D2; color: white; padding: 5px 15px; border-radius: 20px;">4</span></td><td>40 ÷ 10 = 4</td></tr>
            <tr><td>800 × 0,01</td><td><span style="background-color: #FF9800; color: white; padding: 5px 15px; border-radius: 20px;">8</span></td><td>800 ÷ 100 = 8</td></tr>
            <tr><td>1200 × 0,001</td><td><span style="background-color: #4CAF50; color: white; padding: 5px 15px; border-radius: 20px;">1,2</span></td><td>1200 ÷ 1000 = 1,2</td></tr>
          </table>
        </div>
        <h4>📌 النشاط 2: اكتشاف حركة الفاصلة</h4>
        <div style="display: flex; justify-content: space-around; margin: 30px 0; flex-wrap: wrap;">
          <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <p style="font-size: 1.2em;">40 × 0,1 = 4</p>
            <p><span style="background-color: #1976D2; color: white; padding: 5px 10px; border-radius: 20px;">الفاصلة ←</span></p>
          </div>
          <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <p style="font-size: 1.2em;">800 × 0,01 = 8</p>
            <p><span style="background-color: #FF9800; color: white; padding: 5px 10px; border-radius: 20px;">الفاصلة ←←</span></p>
          </div>
        </div>
        <p><strong>❓ أسئلة موجهة:</strong></p>
        <ul>
          <li>كم مرة تحركت الفاصلة عند الضرب في 0,1؟ <span style="background-color: #1976D2; color: white; padding: 3px 8px; border-radius: 15px;">مرة واحدة</span></li>
          <li>كم مرة تحركت الفاصلة عند الضرب في 0,01؟ <span style="background-color: #FF9800; color: white; padding: 3px 8px; border-radius: 15px;">مرتين</span></li>
          <li>كم مرة تحركت الفاصلة عند الضرب في 0,001؟ <span style="background-color: #4CAF50; color: white; padding: 3px 8px; border-radius: 15px;">ثلاث مرات</span></li>
          <li>في أي اتجاه تحركت الفاصلة؟ <span style="background-color: #c2185b; color: white; padding: 3px 8px; border-radius: 15px;">إلى اليسار</span></li>
        </ul>
      </div>

      <!-- 3️⃣ بناء المفهوم -->
      <div style="background: linear-gradient(135deg, #43C6AC 0%, #191654 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
        <h3>📚 ضرب عدد في 0,1 أو 0,01 أو 0,001</h3>
      </div>
      <div style="background-color: #e3f2fd; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="border-right: 8px solid #1976D2; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h4>🔷 <span style="color: #1976D2;">القاعدة الأساسية</span></h4>
          <p>الضرب في 0,1 أو 0,01 أو 0,001 يعني القسمة على 10 أو 100 أو 1000.</p>
          <ul>
            <li>× 0,1 : نحرك الفاصلة رقمًا واحدًا لليسار</li>
            <li>× 0,01 : نحرك الفاصلة رقمين لليسار</li>
            <li>× 0,001 : نحرك الفاصلة ثلاثة أرقام لليسار</li>
          </ul>
        </div>
        <div style="border-right: 8px solid #c2185b; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h4>🔷 <span style="color: #c2185b;">الضرب في 0,1</span></h4>
          <p>الضرب في 0,1 = القسمة على 10</p>
          <p>مثال: 34 × 0,1 = 3,4</p>
        </div>
        <div style="border-right: 8px solid #4CAF50; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h4>🔷 <span style="color: #4CAF50;">الضرب في 0,01</span></h4>
          <p>الضرب في 0,01 = القسمة على 100</p>
          <p>مثال: 5 × 0,01 = 0,05</p>
        </div>
        <div style="border-right: 8px solid #9C27B0; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h4>🔷 <span style="color: #9C27B0;">الضرب في 0,001</span></h4>
          <p>الضرب في 0,001 = القسمة على 1000</p>
          <p>مثال: 120 × 0,001 = 0,12</p>
        </div>
      </div>

      <!-- 4️⃣ تمثيل متعدد للمفهوم -->
      <div style="background: linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
        <h3>🎭 أربع تمثيلات للضرب في 0,1 - 0,01 - 0,001</h3>
      </div>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;">
        <div style="background: linear-gradient(145deg, #ffffff, #e3f2fd); padding: 20px; border-radius: 15px;">
          <h4 style="color: #1976D2; text-align: center;">🔢 تمثيل عددي</h4>
          <p style="text-align: center;">34 × 0,1 = 3,4</p>
          <p style="text-align: center;">5 × 0,01 = 0,05</p>
        </div>
        <div style="background: linear-gradient(145deg, #ffffff, #ffebee); padding: 20px; border-radius: 15px;">
          <h4 style="color: #c2185b; text-align: center;">📝 تمثيل لفظي</h4>
          <p style="text-align: center;">"نضرب في 0,1 = نقسم على 10"</p>
        </div>
      </div>

      <!-- 5️⃣ أمثلة محلولة تدريجيًا -->
      <div style="background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #ddd;">
        <h4>📌 مثال 1: بسيط جدًا</h4>
        <p><strong>المطلوب:</strong> احسب 34 × 0,1</p>
        <p><strong>الحل:</strong> نحرك الفاصلة رقمًا واحدًا لليسار. النتيجة: 3,4</p>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #ddd;">
        <h4>📌 مثال 3: يتطلب تحليل</h4>
        <p><strong>المطلوب:</strong> احسب 120 × 0,001</p>
        <p><strong>الحل:</strong> نحرك الفاصلة 3 مرات لليسار. النتيجة: 0,12</p>
      </div>

      <!-- 6️⃣ أخطاء شائعة -->
      <div style="background-color: #ffebee; padding: 25px; border-radius: 15px; margin: 20px 0;">
        <h3>⚠️ أخطاء شائعة</h3>
        <ul>
          <li><strong>الخطأ:</strong> 5 × 0,1 = 5,0 (نسيان تحريك الفاصلة).</li>
          <li><strong>الصواب:</strong> 0,1 = 1/10 → نقسم على 10. النتيجة 0,5.</li>
          <li><strong>الخطأ:</strong> تحريك الفاصلة لليمين بدل اليسار.</li>
          <li><strong>الصواب:</strong> الضرب في عدد أصغر من 1 يصغر العدد، الفاصلة تتحرك لليسار.</li>
        </ul>
      </div>

      <!-- ✨ خلاصة الدرس -->
      <div style="background: linear-gradient(135deg, #43C6AC 0%, #191654 100%); padding: 30px; border-radius: 15px; margin: 30px 0; text-align: center; color: white;">
        <h3>📌 الخلاصة</h3>
        <p style="font-size: 1.5em;">✨ القاعدة الذهبية: الضرب في 0,1 ، 0,01 ، 0,001 = القسمة على 10 ، 100 ، 1000 ✨</p>
      </div>
    </div>
  `;

  // 5. Create Lesson
  const lesson = await prisma.lesson.create({
    data: {
      title: 'ضرب عدد طبيعي أو عشري في 0,1 أو 0,01 أو 0,001',
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
            question: 'التمرين 01: أكمل الجدول التالي:\n1) 8 × 0,1 = ...\n2) 8 × 0,01 = ...\n3) 8 × 0,001 = ...\n4) 0,8 × 0,1 = ...\n5) 0,8 × 0,01 = ...\n6) 0,8 × 0,001 = ...',
            expectedResults: [
              { question: "1", result: "0,8", tolerance: 0 },
              { question: "2", result: "0,08", tolerance: 0 },
              { question: "3", result: "0,008", tolerance: 0 },
              { question: "4", result: "0,08", tolerance: 0 },
              { question: "5", result: "0,008", tolerance: 0 },
              { question: "6", result: "0,0008", tolerance: 0 }
            ],
            displayOrder: 1,
            maxScore: 6
          },
          {
            type: 'support_with_results',
            question: 'التمرين 02: أكمل بتحريك الفاصلة:\n1) 43 × 0,1 = ...\n2) 43 × 0,01 = ...\n3) 43 × 0,001 = ...\n4) 5,2 × 0,1 = ...\n5) 5,2 × 0,01 = ...\n6) 5,2 × 0,001 = ...',
            expectedResults: [
              { question: "1", result: "4,3", tolerance: 0 },
              { question: "2", result: "0,43", tolerance: 0 },
              { question: "3", result: "0,043", tolerance: 0 },
              { question: "4", result: "0,52", tolerance: 0 },
              { question: "5", result: "0,052", tolerance: 0 },
              { question: "6", result: "0,0052", tolerance: 0 }
            ],
            displayOrder: 2,
            maxScore: 6
          },
          {
            type: 'support_with_results',
            question: 'التمرين 03: طابق بين العملية ونتيجتها (اكتب النتيجة):\n1) 12 × 0,1\n2) 12 × 0,01\n3) 12 × 0,001\n4) 120 × 0,1\n5) 120 × 0,001',
            expectedResults: [
              { question: "1", result: "1,2", tolerance: 0 },
              { question: "2", result: "0,12", tolerance: 0 },
              { question: "3", result: "0,012", tolerance: 0 },
              { question: "4", result: "12", tolerance: 0 },
              { question: "5", result: "0,12", tolerance: 0 }
            ],
            displayOrder: 3,
            maxScore: 5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 04: ضع الفاصلة في مكانها الصحيح:\n1) 47 × 0,1 = 47\n2) 47 × 0,01 = 047\n3) 250 × 0,001 = 025\n4) 6,3 × 0,1 = 063\n5) 6,3 × 0,01 = 0063',
            expectedResults: [
              { question: "1", result: "4,7", tolerance: 0 },
              { question: "2", result: "0,47", tolerance: 0 },
              { question: "3", result: "0,25", tolerance: 0 },
              { question: "4", result: "0,63", tolerance: 0 },
              { question: "5", result: "0,063", tolerance: 0 }
            ],
            displayOrder: 4,
            maxScore: 5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 05: أكمل الجدول (اكتب النتائج بالترتيب ×0,1, ×0,01, ×0,001):\n1) 7\n2) 25\n3) 3,6',
            expectedResults: [
              { question: "1", result: "0,7, 0,07, 0,007", tolerance: 0 },
              { question: "2", result: "2,5, 0,25, 0,025", tolerance: 0 },
              { question: "3", result: "0,36, 0,036, 0,0036", tolerance: 0 }
            ],
            displayOrder: 5,
            maxScore: 3
          },
          {
            type: 'support_with_results',
            question: 'التمرين 06: حل ذهنياً:\n1) 9 × 0,1\n2) 9 × 0,01\n3) 30 × 0,1\n4) 30 × 0,01\n5) 30 × 0,001\n6) 0,4 × 0,1',
            expectedResults: [
              { question: "1", result: "0,9", tolerance: 0 },
              { question: "2", result: "0,09", tolerance: 0 },
              { question: "3", result: "3", tolerance: 0 },
              { question: "4", result: "0,3", tolerance: 0 },
              { question: "5", result: "0,03", tolerance: 0 },
              { question: "6", result: "0,04", tolerance: 0 }
            ],
            displayOrder: 6,
            maxScore: 6
          },
          {
            type: 'support_with_results',
            question: 'التمرين 07: قارن بين النتائج (اكتب = أو ≠):\n1) 24 × 0,1 و 2,4\n2) 50 × 0,01 و 0,5\n3) 8 × 0,001 و 0,08\n4) 0,3 × 0,1 و 0,03\n5) 120 × 0,01 و 12 × 0,1',
            expectedResults: [
              { question: "1", result: "=", tolerance: 0 },
              { question: "2", result: "=", tolerance: 0 },
              { question: "3", result: "≠", tolerance: 0 },
              { question: "4", result: "=", tolerance: 0 },
              { question: "5", result: "=", tolerance: 0 }
            ],
            displayOrder: 7,
            maxScore: 5
          },
          // 🔴 التمارين الرئيسية (30%)
          {
            type: 'main',
            question: 'التمرين 08: مشكلة شراء الفواكه\nفي السوق، ثمن الكيلوغرام من الفواكه المختلفة:\n- تفاح: 40 DA/kg\n- فراولة: 800 DA/kg\n- عنب: 1200 DA/kg\nالمطلوب:\n1) كم ثمن 0,1 كغ من التفاح؟\n2) كم ثمن 0,01 كغ من الفراولة؟\n3) كم ثمن 0,001 كغ من العنب؟',
            modelAnswer: '1) ثمن التفاح: 40 × 0,1 = 4 دنانير.\n2) ثمن الفراولة: 800 × 0,01 = 8 دنانير.\n3) ثمن العنب: 1200 × 0,001 = 1,2 دينار.',
            displayOrder: 8,
            maxScore: 5
          },
          {
            type: 'main',
            question: 'التمرين 09: مشكلة شراء قماش\nثمن المتر الواحد من القماش هو 250 ديناراً. تريد خياطة شراء كميات صغيرة.\nالمطلوب:\n1) كم ثمن 0,1 m من القماش؟\n2) كم ثمن 0,01 m من القماش؟\n3) كم ثمن 0,001 m من القماش؟',
            modelAnswer: '1) ثمن 0,1 م: 250 × 0,1 = 25 ديناراً.\n2) ثمن 0,01 م: 250 × 0,01 = 2,5 ديناراً.\n3) ثمن 0,001 م: 250 × 0,001 = 0,25 ديناراً.',
            displayOrder: 9,
            maxScore: 5
          },
          {
            type: 'main',
            question: 'التمرين 10: التحدي الكبير - الأرقام المفقودة\nجد العدد الناقص في كل عملية:\n1) ... × 0,1 = 6\n2) ... × 0,01 = 0,5\n3) ... × 0,001 = 0,04\n4) 24 × ... = 2,4\n5) 300 × ... = 0,3',
            modelAnswer: '1) 60\n2) 50\n3) 40\n4) 0,1\n5) 0,001',
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