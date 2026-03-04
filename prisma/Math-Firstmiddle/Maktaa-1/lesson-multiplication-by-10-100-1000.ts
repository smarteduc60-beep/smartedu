import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding Lesson: Multiplication by 10, 100, 1000 ...');

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
      <!-- 1️⃣ وضعية انطلاق -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
        <h3>🏪 مشكلة: شراء الحلويات من البقالة</h3>
        <p>ذهب يوسف إلى البقالة لشراء حلوى لأصدقائه. ثمن القطعة الواحدة من الحلوى هو <span style="background-color: rgba(255,255,255,0.2); padding: 5px 10px; border-radius: 20px;">12,5 ديناراً</span>.</p>
      </div>

      <div style="display: flex; justify-content: center; gap: 30px; margin: 30px 0; flex-wrap: wrap;">
        <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <div style="background-color: #ffcdd2; padding: 15px; border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
            <span style="font-size: 2.5em;">🍬</span>
          </div>
          <p style="font-weight: bold;">قطعة واحدة</p>
          <p style="background-color: #1976D2; color: white; padding: 5px 15px; border-radius: 20px;">12,5 DA</p>
        </div>
        <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <div style="background-color: #ffebee; padding: 15px; border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
            <span style="font-size: 2.5em;">🍬🍬</span>
          </div>
          <p style="font-weight: bold;">10 قطع</p>
          <p style="background-color: #FF9800; color: white; padding: 5px 15px; border-radius: 20px;">125 DA</p>
        </div>
        <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <div style="background-color: #e8f5e9; padding: 15px; border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
            <span style="font-size: 2.5em;">🍬🍬🍬</span>
          </div>
          <p style="font-weight: bold;">100 قطعة</p>
          <p style="background-color: #4CAF50; color: white; padding: 5px 15px; border-radius: 20px;">1250 DA</p>
        </div>
      </div>
      <p>🔍 لاحظ يوسف أن الثمن يتغير بسرعة عندما يشتري 10 أو 100 قطعة!</p>
      <p><strong>❓ التساؤلات:</strong></p>
      <ul>
        <li>كيف حسب البقال ثمن 10 قطع بسرعة؟</li>
        <li>ما العلاقة بين 12,5 و 125 و 1250؟</li>
        <li>كيف نضرب عددًا عشريًا في 10، 100، 1000 بطريقة سهلة وسريعة؟</li>
      </ul>

      <!-- 2️⃣ مرحلة البحث والاكتشاف -->
      <div style="background-color: #fff9e6; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <h3>🧪 نشاط استكشافي: هيا نكتشف السر!</h3>
        <h4>📌 النشاط 1: اكتشاف النمط</h4>
        <p>لاحظ الجدول التالي وأكمل:</p>
        <div style="background-color: white; padding: 20px; border-radius: 15px; margin: 20px 0; overflow-x: auto;">
          <table style="width:100%; text-align:center;">
            <tr><th>العملية</th><th>النتيجة</th><th>ماذا حدث للفاصلة؟</th></tr>
            <tr><td>3,2485 × 10</td><td><span style="background-color: #1976D2; color: white; padding: 5px 15px; border-radius: 20px;">32,485</span></td><td><span style="color: #1976D2;">انتقلت رقمًا لليمين</span></td></tr>
            <tr><td>3,2485 × 100</td><td><span style="background-color: #FF9800; color: white; padding: 5px 15px; border-radius: 20px;">324,85</span></td><td><span style="color: #FF9800;">انتقلت رقمين لليمين</span></td></tr>
            <tr><td>3,2485 × 1000</td><td><span style="background-color: #4CAF50; color: white; padding: 5px 15px; border-radius: 20px;">3248,5</span></td><td><span style="color: #4CAF50;">انتقلت 3 أرقام لليمين</span></td></tr>
          </table>
        </div>
        <h4>📌 النشاط 2: تمثيل بياني للعملية</h4>
        <div style="display: flex; justify-content: space-around; margin: 30px 0; flex-wrap: wrap;">
          <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <p style="font-size: 1.2em;">3,25 × 10 = 32,5</p>
            <p><span style="background-color: #1976D2; color: white; padding: 5px 10px; border-radius: 20px;">الفاصلة →</span></p>
          </div>
          <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <p style="font-size: 1.2em;">3,25 × 100 = 325</p>
            <p><span style="background-color: #FF9800; color: white; padding: 5px 10px; border-radius: 20px;">الفاصلة →→</span></p>
          </div>
        </div>
        <p><strong>❓ أسئلة موجهة:</strong></p>
        <ul>
          <li>كم مرة تحركت الفاصلة عند الضرب في 10؟ <span style="background-color: #1976D2; color: white; padding: 3px 8px; border-radius: 15px;">مرة واحدة</span></li>
          <li>كم مرة تحركت الفاصلة عند الضرب في 100؟ <span style="background-color: #FF9800; color: white; padding: 3px 8px; border-radius: 15px;">مرتين</span></li>
          <li>كم مرة تحركت الفاصلة عند الضرب في 1000؟ <span style="background-color: #4CAF50; color: white; padding: 3px 8px; border-radius: 15px;">ثلاث مرات</span></li>
          <li>في أي اتجاه تحركت الفاصلة؟ <span style="background-color: #c2185b; color: white; padding: 3px 8px; border-radius: 15px;">إلى اليمين</span></li>
        </ul>
      </div>

      <!-- 3️⃣ بناء المفهوم -->
      <div style="background: linear-gradient(135deg, #43C6AC 0%, #191654 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
        <h3>📚 ضرب عدد في 10، 100، 1000</h3>
      </div>
      <div style="background-color: #e3f2fd; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="border-right: 8px solid #1976D2; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h4>🔷 <span style="color: #1976D2;">القاعدة الأساسية (لعدد عشري)</span></h4>
          <p>عند ضرب عدد عشري في 10 أو 100 أو 1000، نحرك الفاصلة إلى اليمين بعدد من الخانات يساوي عدد الأصفار.</p>
          <ul>
            <li>× 10 : نحرك الفاصلة رقمًا واحدًا لليمين</li>
            <li>× 100 : نحرك الفاصلة رقمين لليمين</li>
            <li>× 1000 : نحرك الفاصلة ثلاثة أرقام لليمين</li>
          </ul>
        </div>
        <div style="border-right: 8px solid #c2185b; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h4>🔷 <span style="color: #c2185b;">حالة الأعداد الطبيعية</span></h4>
          <p>الأعداد الطبيعية ليس لها فاصلة ظاهرة، لكن الفاصلة موجودة بعد العدد مباشرة (مثال: 25 = 25,0). عند الضرب، نضيف أصفارًا على اليمين.</p>
        </div>
        <div style="border-right: 8px solid #4CAF50; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h4>🔷 <span style="color: #4CAF50;">حالة خاصة: نفاد الأرقام</span></h4>
          <p>إذا لم توجد أرقام كافية على يمين الفاصلة، نضيف أصفارًا.</p>
          <p>مثال: 5,6 × 100 = 560</p>
        </div>
      </div>

      <!-- 4️⃣ تمثيل متعدد للمفهوم -->
      <div style="background: linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
        <h3>🎭 أربع تمثيلات للضرب في 10، 100، 1000</h3>
      </div>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;">
        <div style="background: linear-gradient(145deg, #ffffff, #e3f2fd); padding: 20px; border-radius: 15px;">
          <h4 style="color: #1976D2; text-align: center;">🔢 تمثيل عددي</h4>
          <p style="text-align: center;">3,25 × 10 = 32,5</p>
          <p style="text-align: center;">3,25 × 100 = 325</p>
        </div>
        <div style="background: linear-gradient(145deg, #ffffff, #ffebee); padding: 20px; border-radius: 15px;">
          <h4 style="color: #c2185b; text-align: center;">📝 تمثيل لفظي</h4>
          <p style="text-align: center;">"نضرب في 10، الفاصلة تتحرك مرة لليمين"</p>
        </div>
      </div>

      <!-- 5️⃣ أمثلة محلولة تدريجيًا -->
      <div style="background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #ddd;">
        <h4>📌 مثال 1: بسيط جدًا</h4>
        <p><strong>المطلوب:</strong> احسب 3,8 × 10</p>
        <p><strong>الحل:</strong> نحرك الفاصلة رقمًا واحدًا لليمين. النتيجة: 38</p>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #ddd;">
        <h4>📌 مثال 2: يتطلب تحليل</h4>
        <p><strong>المطلوب:</strong> احسب 5,6 × 1000</p>
        <p><strong>الحل:</strong> نحتاج 3 حركات. لدينا رقم واحد (6). نضيف صفرين. النتيجة: 5600</p>
      </div>

      <!-- 6️⃣ أخطاء شائعة -->
      <div style="background-color: #ffebee; padding: 25px; border-radius: 15px; margin: 20px 0;">
        <h3>⚠️ أخطاء شائعة</h3>
        <ul>
          <li><strong>الخطأ:</strong> 0,5 × 100 = 0,500 (إضافة أصفار فقط دون تحريك الفاصلة).</li>
          <li><strong>الصواب:</strong> نحرك الفاصلة أولاً. 0,5 × 100 = 50.</li>
          <li><strong>الخطأ:</strong> تحريك الفاصلة لليسار (الخلط مع القسمة).</li>
          <li><strong>الصواب:</strong> الضرب يكبر العدد، الفاصلة تتحرك لليمين.</li>
        </ul>
      </div>

      <!-- ✨ خلاصة الدرس -->
      <div style="background: linear-gradient(135deg, #43C6AC 0%, #191654 100%); padding: 30px; border-radius: 15px; margin: 30px 0; text-align: center; color: white;">
        <h3>📌 الخلاصة</h3>
        <p style="font-size: 1.5em;">✨ القاعدة الذهبية: عدد حركات الفاصلة لليمين = عدد الأصفار في المضروب به ✨</p>
      </div>
    </div>
  `;

  // 5. Create Lesson
  const lesson = await prisma.lesson.create({
    data: {
      title: 'ضرب عدد طبيعي أو عشري في 10 أو 100 أو 1000',
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
            question: 'التمرين 01: أكمل الجدول التالي:\n1) 3,8 × 10 = ...\n2) 0,42 × 100 = ...\n3) 125 × 1000 = ...\n4) 9,05 × 10 = ...\n5) 0,007 × 1000 = ...',
            expectedResults: [
              { question: "1", result: "38", tolerance: 0 },
              { question: "2", result: "42", tolerance: 0 },
              { question: "3", result: "125000", tolerance: 0 },
              { question: "4", result: "90,5", tolerance: 0 },
              { question: "5", result: "7", tolerance: 0 }
            ],
            displayOrder: 1,
            maxScore: 5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 02: أكمل بتحريك الفاصلة:\n1) 43 × 10 = ...\n2) 43 × 100 = ...\n3) 43 × 1000 = ...\n4) 5,2 × 10 = ...\n5) 5,2 × 100 = ...\n6) 5,2 × 1000 = ...',
            expectedResults: [
              { question: "1", result: "430", tolerance: 0 },
              { question: "2", result: "4300", tolerance: 0 },
              { question: "3", result: "43000", tolerance: 0 },
              { question: "4", result: "52", tolerance: 0 },
              { question: "5", result: "520", tolerance: 0 },
              { question: "6", result: "5200", tolerance: 0 }
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
            question: 'التمرين 04: ضع الفاصلة في مكانها الصحيح:\n1) 47 × 10 = 470\n2) 47 × 100 = ...\n3) 250 × 1000 = ...\n4) 6,3 × 10 = ...\n5) 6,3 × 100 = ...',
            expectedResults: [
              { question: "1", result: "470", tolerance: 0 },
              { question: "2", result: "4700", tolerance: 0 },
              { question: "3", result: "250000", tolerance: 0 },
              { question: "4", result: "63", tolerance: 0 },
              { question: "5", result: "630", tolerance: 0 }
            ],
            displayOrder: 4,
            maxScore: 5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 05: أكمل الجدول (اكتب النتائج بالترتيب x10, x100, x1000):\n1) 7,2\n2) 0,35\n3) 12',
            expectedResults: [
              { question: "1", result: "72, 720, 7200", tolerance: 0 },
              { question: "2", result: "3,5, 35, 350", tolerance: 0 },
              { question: "3", result: "120, 1200, 12000", tolerance: 0 }
            ],
            displayOrder: 5,
            maxScore: 3
          },
          {
            type: 'support_with_results',
            question: 'التمرين 06: حل ذهنياً:\n1) 9 × 10\n2) 9 × 100\n3) 30 × 10\n4) 30 × 100\n5) 30 × 1000\n6) 0,4 × 100',
            expectedResults: [
              { question: "1", result: "90", tolerance: 0 },
              { question: "2", result: "900", tolerance: 0 },
              { question: "3", result: "300", tolerance: 0 },
              { question: "4", result: "3000", tolerance: 0 },
              { question: "5", result: "30000", tolerance: 0 },
              { question: "6", result: "40", tolerance: 0 }
            ],
            displayOrder: 6,
            maxScore: 6
          },
          {
            type: 'support_with_results',
            question: 'التمرين 07: قارن بين النتائج (اكتب = أو ≠):\n1) 3,15 × 10 و 31,5\n2) 0,8 × 100 و 80\n3) 12 × 100 و 1200\n4) 0,02 × 1000 و 20',
            expectedResults: [
              { question: "1", result: "=", tolerance: 0 },
              { question: "2", result: "=", tolerance: 0 },
              { question: "3", result: "=", tolerance: 0 },
              { question: "4", result: "=", tolerance: 0 }
            ],
            displayOrder: 7,
            maxScore: 4
          },
          // 🔴 التمارين الرئيسية (30%)
          {
            type: 'main',
            question: 'التمرين 08: مشكلة شراء أقلام\nيريد مدير مدرسة شراء 1000 قلم لتوزيعها على التلاميذ. ثمن القلم الواحد هو 12,5 ديناراً.\nالمطلوب:\n1) احسب ثمن 10 أقلام.\n2) احسب ثمن 100 قلم.\n3) احسب ثمن 1000 قلم.',
            modelAnswer: '1) ثمن 10 أقلام: 12,5 × 10 = 125 ديناراً.\n2) ثمن 100 قلم: 12,5 × 100 = 1250 ديناراً.\n3) ثمن 1000 قلم: 12,5 × 1000 = 12500 ديناراً.',
            displayOrder: 8,
            maxScore: 5
          },
          {
            type: 'main',
            question: 'التمرين 09: مشكلة شراء قماش\nثمن المتر الواحد من القماش هو 24,75 ديناراً. اشترت الخياطة 10 أمتار، ثم 100 متر، ثم 1000 متر.\nالمطلوب:\n1) احسب ثمن 10 أمتار.\n2) احسب ثمن 100 متر.\n3) احسب ثمن 1000 متر.',
            modelAnswer: '1) ثمن 10 أمتار: 24,75 × 10 = 247,5 ديناراً.\n2) ثمن 100 متر: 24,75 × 100 = 2475 ديناراً.\n3) ثمن 1000 متر: 24,75 × 1000 = 24750 ديناراً.',
            displayOrder: 9,
            maxScore: 5
          },
          {
            type: 'main',
            question: 'التمرين 10: التحدي الكبير - الأرقام المفقودة\nجد العدد الناقص في كل عملية:\n1) 4,25 × 10 = ...\n2) ... × 100 = 250\n3) 0,3 × ... = 300\n4) 5,6 × 1000 = ...\n5) 12 × 10 = ...',
            modelAnswer: '1) 42,5\n2) 2,5\n3) 1000\n4) 5600\n5) 120',
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