import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding Lesson: Division by 10, 100, 1000 ...');

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
        <h3>🏪 مشكلة: توزيع النقود بالتساوي</h3>
        <p>ذهب كريم مع أصدقائه إلى مدينة الألعاب. لديه <span style="background-color: rgba(255,255,255,0.2); padding: 5px 10px; border-radius: 20px;">2500 ديناراً</span> يريد توزيعها بالتساوي على 10 أصدقاء. ثم فكر في توزيع <span style="background-color: rgba(255,255,255,0.2); padding: 5px 10px; border-radius: 20px;">5000 ديناراً</span> على 100 طفل في حفلة مدرسية.</p>
      </div>

      <div style="display: flex; justify-content: center; gap: 30px; margin: 30px 0; flex-wrap: wrap;">
        <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <div style="background-color: #ffcdd2; padding: 15px; border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
            <span style="font-size: 2.5em;">💰</span>
          </div>
          <p style="font-weight: bold;">2500 دينار</p>
          <p style="background-color: #1976D2; color: white; padding: 5px 15px; border-radius: 20px;">÷ 10 أطفال</p>
          <p style="font-size: 1.2em; margin-top: 10px;">كم يأخذ كل طفل؟</p>
        </div>
        <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <div style="background-color: #ffebee; padding: 15px; border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
            <span style="font-size: 2.5em;">💰💰</span>
          </div>
          <p style="font-weight: bold;">5000 دينار</p>
          <p style="background-color: #FF9800; color: white; padding: 5px 15px; border-radius: 20px;">÷ 100 طفل</p>
          <p style="font-size: 1.2em; margin-top: 10px;">كم يأخذ كل طفل؟</p>
        </div>
        <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <div style="background-color: #e8f5e9; padding: 15px; border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
            <span style="font-size: 2.5em;">💰💰💰</span>
          </div>
          <p style="font-weight: bold;">75000 دينار</p>
          <p style="background-color: #4CAF50; color: white; padding: 5px 15px; border-radius: 20px;">÷ 1000 شخص</p>
          <p style="font-size: 1.2em; margin-top: 10px;">كم يأخذ كل شخص؟</p>
        </div>
      </div>
      <p>🔍 لاحظ كريم أن الإجابة تصبح أصغر كلما زاد عدد الأشخاص!</p>
      <p><strong>❓ التساؤلات:</strong></p>
      <ul>
        <li>كيف نحسب 250 ÷ 10 بسرعة؟</li>
        <li>ما العلاقة بين 250 و 25؟</li>
        <li>كيف نكتب قاعدة سهلة للقسمة على 10، 100، 1000؟</li>
      </ul>

      <!-- 2️⃣ مرحلة البحث والاكتشاف -->
      <div style="background-color: #fff9e6; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <h3>🧪 نشاط استكشافي: هيا نكتشف السر!</h3>
        <h4>📌 النشاط 1: اكتشاف النمط</h4>
        <p>لاحظ الجدول التالي وأكمل:</p>
        <div style="background-color: white; padding: 20px; border-radius: 15px; margin: 20px 0; overflow-x: auto;">
          <table style="width:100%; text-align:center;">
            <tr><th>العملية</th><th>النتيجة</th><th>ماذا حدث للفاصلة؟</th></tr>
            <tr><td>45 ÷ 10</td><td><span style="background-color: #1976D2; color: white; padding: 5px 15px; border-radius: 20px;">4,5</span></td><td><span style="color: #1976D2;">انتقلت رقمًا لليسار</span></td></tr>
            <tr><td>372 ÷ 100</td><td><span style="background-color: #FF9800; color: white; padding: 5px 15px; border-radius: 20px;">3,72</span></td><td><span style="color: #FF9800;">انتقلت رقمين لليسار</span></td></tr>
            <tr><td>5000 ÷ 1000</td><td><span style="background-color: #4CAF50; color: white; padding: 5px 15px; border-radius: 20px;">5</span></td><td><span style="color: #4CAF50;">انتقلت 3 أرقام لليسار</span></td></tr>
          </table>
        </div>
        <h4>📌 النشاط 2: تمثيل بياني للعملية</h4>
        <div style="display: flex; justify-content: space-around; margin: 30px 0; flex-wrap: wrap;">
          <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <p style="font-size: 1.2em;">45 ÷ 10 = 4,5</p>
            <p><span style="background-color: #1976D2; color: white; padding: 5px 10px; border-radius: 20px;">الفاصلة ←</span></p>
          </div>
          <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <p style="font-size: 1.2em;">372 ÷ 100 = 3,72</p>
            <p><span style="background-color: #FF9800; color: white; padding: 5px 10px; border-radius: 20px;">الفاصلة ←←</span></p>
          </div>
        </div>
        <p><strong>❓ أسئلة موجهة:</strong></p>
        <ul>
          <li>كم مرة تحركت الفاصلة عند القسمة على 10؟ <span style="background-color: #1976D2; color: white; padding: 3px 8px; border-radius: 15px;">مرة واحدة</span></li>
          <li>كم مرة تحركت الفاصلة عند القسمة على 100؟ <span style="background-color: #FF9800; color: white; padding: 3px 8px; border-radius: 15px;">مرتين</span></li>
          <li>كم مرة تحركت الفاصلة عند القسمة على 1000؟ <span style="background-color: #4CAF50; color: white; padding: 3px 8px; border-radius: 15px;">ثلاث مرات</span></li>
          <li>في أي اتجاه تحركت الفاصلة؟ <span style="background-color: #c2185b; color: white; padding: 3px 8px; border-radius: 15px;">إلى اليسار</span></li>
        </ul>
      </div>

      <!-- 3️⃣ بناء المفهوم -->
      <div style="background: linear-gradient(135deg, #43C6AC 0%, #191654 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
        <h3>📚 قسمة عدد على 10، 100، 1000</h3>
      </div>
      <div style="background-color: #e3f2fd; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="border-right: 8px solid #1976D2; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h4>🔷 <span style="color: #1976D2;">القاعدة الأساسية</span></h4>
          <p>عند قسمة عدد (طبيعي أو عشري) على 10 أو 100 أو 1000، نحرك الفاصلة إلى اليسار بعدد من الخانات يساوي عدد الأصفار.</p>
          <ul>
            <li>÷ 10 : نحرك الفاصلة رقمًا واحدًا لليسار</li>
            <li>÷ 100 : نحرك الفاصلة رقمين لليسار</li>
            <li>÷ 1000 : نحرك الفاصلة ثلاثة أرقام لليسار</li>
          </ul>
        </div>
        <div style="border-right: 8px solid #c2185b; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h4>🔷 <span style="color: #c2185b;">حالة الأعداد الطبيعية</span></h4>
          <p>الأعداد الطبيعية ليس لها فاصلة ظاهرة، لكن الفاصلة موجودة بعد العدد مباشرة (مثال: 45 = 45,0).</p>
        </div>
        <div style="border-right: 8px solid #4CAF50; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h4>🔷 <span style="color: #4CAF50;">حالة خاصة: إضافة أصفار</span></h4>
          <p>إذا لم توجد أرقام كافية على يسار الفاصلة، نضيف أصفارًا على اليسار.</p>
          <p>مثال: 3,8 ÷ 10 = 0,38</p>
        </div>
      </div>

      <!-- 4️⃣ تمثيل متعدد للمفهوم -->
      <div style="background: linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
        <h3>🎭 أربع تمثيلات للقسمة على 10، 100، 1000</h3>
      </div>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;">
        <div style="background: linear-gradient(145deg, #ffffff, #e3f2fd); padding: 20px; border-radius: 15px;">
          <h4 style="color: #1976D2; text-align: center;">🔢 تمثيل عددي</h4>
          <p style="text-align: center;">45 ÷ 10 = 4,5</p>
          <p style="text-align: center;">372 ÷ 100 = 3,72</p>
        </div>
        <div style="background: linear-gradient(145deg, #ffffff, #ffebee); padding: 20px; border-radius: 15px;">
          <h4 style="color: #c2185b; text-align: center;">📝 تمثيل لفظي</h4>
          <p style="text-align: center;">"نقسم على 10، الفاصلة تتحرك مرة لليسار"</p>
        </div>
      </div>

      <!-- 5️⃣ أمثلة محلولة تدريجيًا -->
      <div style="background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #ddd;">
        <h4>📌 مثال 1: بسيط جدًا</h4>
        <p><strong>المطلوب:</strong> احسب 45 ÷ 10</p>
        <p><strong>الحل:</strong> نحرك الفاصلة رقمًا واحدًا لليسار. النتيجة: 4,5</p>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #ddd;">
        <h4>📌 مثال 3: يتطلب تحليل</h4>
        <p><strong>المطلوب:</strong> احسب 3,8 ÷ 10</p>
        <p><strong>الحل:</strong> نحرك الفاصلة لليسار. لا يوجد رقم، نضيف صفرًا. النتيجة: 0,38</p>
      </div>

      <!-- 6️⃣ أخطاء شائعة -->
      <div style="background-color: #ffebee; padding: 25px; border-radius: 15px; margin: 20px 0;">
        <h3>⚠️ أخطاء شائعة</h3>
        <ul>
          <li><strong>الخطأ:</strong> 3,8 ÷ 10 = 3,80 (إضافة صفر لليمين بدل تحريك الفاصلة).</li>
          <li><strong>الصواب:</strong> القسمة تصغر العدد، الفاصلة تتحرك لليسار. 3,8 ÷ 10 = 0,38.</li>
          <li><strong>الخطأ:</strong> 5 ÷ 1000 = 0,5 (نسيان عدد الأصفار).</li>
          <li><strong>الصواب:</strong> 1000 يتطلب 3 حركات. 5 ÷ 1000 = 0,005.</li>
        </ul>
      </div>

      <!-- ✨ خلاصة الدرس -->
      <div style="background: linear-gradient(135deg, #43C6AC 0%, #191654 100%); padding: 30px; border-radius: 15px; margin: 30px 0; text-align: center; color: white;">
        <h3>📌 الخلاصة</h3>
        <p style="font-size: 1.5em;">✨ القاعدة الذهبية: عدد حركات الفاصلة لليسار = عدد الأصفار في المقسوم عليه ✨</p>
      </div>
    </div>
  `;

  // 5. Create Lesson
  const lesson = await prisma.lesson.create({
    data: {
      title: 'قسمة عدد طبيعي أو عشري على 10 أو 100 أو 1000',
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
            question: 'التمرين 01: أكمل الجدول التالي:\n1) 60 ÷ 10 = ...\n2) 60 ÷ 100 = ...\n3) 60 ÷ 1000 = ...\n4) 6 ÷ 10 = ...\n5) 6 ÷ 100 = ...\n6) 6 ÷ 1000 = ...',
            expectedResults: [
              { question: "1", result: "6", tolerance: 0 },
              { question: "2", result: "0,6", tolerance: 0 },
              { question: "3", result: "0,06", tolerance: 0 },
              { question: "4", result: "0,6", tolerance: 0 },
              { question: "5", result: "0,06", tolerance: 0 },
              { question: "6", result: "0,006", tolerance: 0 }
            ],
            displayOrder: 1,
            maxScore: 6
          },
          {
            type: 'support_with_results',
            question: 'التمرين 02: أكمل بتحريك الفاصلة:\n1) 123 ÷ 10 = ...\n2) 123 ÷ 100 = ...\n3) 123 ÷ 1000 = ...\n4) 45,6 ÷ 10 = ...\n5) 45,6 ÷ 100 = ...\n6) 45,6 ÷ 1000 = ...',
            expectedResults: [
              { question: "1", result: "12,3", tolerance: 0 },
              { question: "2", result: "1,23", tolerance: 0 },
              { question: "3", result: "0,123", tolerance: 0 },
              { question: "4", result: "4,56", tolerance: 0 },
              { question: "5", result: "0,456", tolerance: 0 },
              { question: "6", result: "0,0456", tolerance: 0 }
            ],
            displayOrder: 2,
            maxScore: 6
          },
          {
            type: 'support_with_results',
            question: 'التمرين 03: طابق بين العملية ونتيجتها (اكتب النتيجة):\n1) 250 ÷ 10\n2) 250 ÷ 100\n3) 250 ÷ 1000\n4) 25 ÷ 10\n5) 2500 ÷ 100',
            expectedResults: [
              { question: "1", result: "25", tolerance: 0 },
              { question: "2", result: "2,5", tolerance: 0 },
              { question: "3", result: "0,25", tolerance: 0 },
              { question: "4", result: "2,5", tolerance: 0 },
              { question: "5", result: "25", tolerance: 0 }
            ],
            displayOrder: 3,
            maxScore: 5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 04: ضع الفاصلة في مكانها الصحيح:\n1) 47 ÷ 10 = 47\n2) 47 ÷ 100 = 047\n3) 320 ÷ 1000 = 032\n4) 6,3 ÷ 10 = 063\n5) 6,3 ÷ 100 = 0063',
            expectedResults: [
              { question: "1", result: "4,7", tolerance: 0 },
              { question: "2", result: "0,47", tolerance: 0 },
              { question: "3", result: "0,32", tolerance: 0 },
              { question: "4", result: "0,63", tolerance: 0 },
              { question: "5", result: "0,063", tolerance: 0 }
            ],
            displayOrder: 4,
            maxScore: 5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 05: أكمل الجدول (اكتب النتائج بالترتيب ÷10, ÷100, ÷1000):\n1) 75\n2) 320\n3) 6,4',
            expectedResults: [
              { question: "1", result: "7,5, 0,75, 0,075", tolerance: 0 },
              { question: "2", result: "32, 3,2, 0,32", tolerance: 0 },
              { question: "3", result: "0,64, 0,064, 0,0064", tolerance: 0 }
            ],
            displayOrder: 5,
            maxScore: 3
          },
          {
            type: 'support_with_results',
            question: 'التمرين 06: حل ذهنياً:\n1) 90 ÷ 10\n2) 900 ÷ 100\n3) 9000 ÷ 1000\n4) 4,8 ÷ 10\n5) 4,8 ÷ 100\n6) 4,8 ÷ 1000',
            expectedResults: [
              { question: "1", result: "9", tolerance: 0 },
              { question: "2", result: "9", tolerance: 0 },
              { question: "3", result: "9", tolerance: 0 },
              { question: "4", result: "0,48", tolerance: 0 },
              { question: "5", result: "0,048", tolerance: 0 },
              { question: "6", result: "0,0048", tolerance: 0 }
            ],
            displayOrder: 6,
            maxScore: 6
          },
          {
            type: 'support_with_results',
            question: 'التمرين 07: قارن بين النتائج (اكتب = أو ≠):\n1) 240 ÷ 10 و 24\n2) 500 ÷ 100 و 5\n3) 8 ÷ 1000 و 0,008\n4) 0,3 ÷ 10 و 0,03\n5) 1200 ÷ 1000 و 12 ÷ 10',
            expectedResults: [
              { question: "1", result: "=", tolerance: 0 },
              { question: "2", result: "=", tolerance: 0 },
              { question: "3", result: "=", tolerance: 0 },
              { question: "4", result: "=", tolerance: 0 },
              { question: "5", result: "=", tolerance: 0 }
            ],
            displayOrder: 7,
            maxScore: 5
          },
          // 🔴 التمارين الرئيسية (30%)
          {
            type: 'main',
            question: 'التمرين 08: مشكلة توزيع النقود\nيريد الأب توزيع 250 ديناراً بالتساوي على 10 أبناء، و500 ديناراً على 100 محتاج، و7500 ديناراً على 1000 شخص.\nالمطلوب:\n1) كم يأخذ كل ابن من الـ 250 ديناراً؟\n2) كم يأخذ كل محتاج من الـ 500 ديناراً؟\n3) كم يأخذ كل شخص من الـ 7500 ديناراً؟',
            modelAnswer: '1) 250 ÷ 10 = 25 ديناراً.\n2) 500 ÷ 100 = 5 دنانير.\n3) 7500 ÷ 1000 = 7,5 ديناراً.',
            displayOrder: 8,
            maxScore: 5
          },
          {
            type: 'main',
            question: 'التمرين 09: مشكلة تعبئة الصناديق\nمصنع ينتج 3600 قارورة ماء. يريد تعبئتها في صناديق.\nالمطلوب:\n1) كم صندوقاً نحتاج إذا كان كل صندوق يسع 10 قوارير؟\n2) كم صندوقاً نحتاج إذا كان كل صندوق يسع 100 قارورة؟\n3) كم صندوقاً نحتاج إذا كان كل صندوق يسع 1000 قارورة؟',
            modelAnswer: '1) 3600 ÷ 10 = 360 صندوقاً.\n2) 3600 ÷ 100 = 36 صندوقاً.\n3) 3600 ÷ 1000 = 3,6 (أي 3 صناديق كاملة والباقي 600 قارورة).',
            displayOrder: 9,
            maxScore: 5
          },
          {
            type: 'main',
            question: 'التمرين 10: التحدي الكبير - الأرقام المفقودة\nجد العدد الناقص في كل عملية:\n1) 54 ÷ ... = 5,4\n2) 54 ÷ ... = 0,54\n3) 54 ÷ ... = 0,054\n4) 7 ÷ 10 = ...\n5) 7 ÷ 100 = ...',
            modelAnswer: '1) 10\n2) 100\n3) 1000\n4) 0,7\n5) 0,07',
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