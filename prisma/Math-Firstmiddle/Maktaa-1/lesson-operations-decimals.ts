import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding Lesson: Operations on Decimals ...');

  // 1. Fetch the Teacher
  const teacherEmail = 'ladj14013@gmail.com';
  const teacher = await prisma.user.findUnique({
    where: { email: teacherEmail },
    include: { userDetails: true }
  });

  if (!teacher || !teacher.userDetails?.subjectId) {
    console.error(`❌ Teacher ${teacherEmail} not found or has no subject. Please run 'prisma/seed-math-1cem.ts' first.`);
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

  // 3. Prepare Content
  const lessonContent = `
    <h3 style="color: #2563eb;">🔍 تذكير: ما هو العدد العشري؟</h3>
    <p>العدد العشري هو عدد يتكون من جزء صحيح وجزء عشري تفصل بينهما فاصلة.</p>

    <div style="background-color: #f0f9ff; padding: 20px; border-radius: 10px; text-align: center; margin: 15px 0;">
      <span style="font-size: 2em; font-weight: bold;">24<span style="color: red;">,</span>75</span>
      <div style="display: flex; justify-content: center; gap: 20px; margin-top: 10px; flex-wrap: wrap;">
        <div style="background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px;"><strong>الجزء الصحيح: 24</strong></div>
        <div style="background-color: #2196F3; color: white; padding: 10px 20px; border-radius: 5px;"><strong>الجزء العشري: 75</strong></div>
      </div>
    </div>

    <h3 style="color: #2563eb;">🧮 أولاً: جمع الأعداد العشرية</h3>
    <div style="background-color: #e6f7ff; padding: 20px; border-radius: 10px; margin: 15px 0;">
      <h4 style="margin-top: 0;">📋 قاعدة جمع الأعداد العشرية</h4>
      <ul>
        <li>📌 الخطوة 1: نكتب الأعداد بشكل عمودي</li>
        <li>📌 الخطوة 2: نرص الفاصلات تحت بعضها تماماً</li>
        <li>📌 الخطوة 3: نضيف أصفاراً لتساوي عدد الخانات العشرية</li>
        <li>📌 الخطوة 4: نجمع كأنها أعداد طبيعية من اليمين إلى اليسار</li>
        <li>📌 الخطوة 5: نضع الفاصلة في النتيجة تحت الفواصل</li>
      </ul>
    </div>

    <h4 style="color: #d97706;">✅ أمثلة محلولة: جمع الأعداد العشرية</h4>
    
    <div style="background-color: #f6f6f6; padding: 20px; border-radius: 10px; margin-bottom: 15px;">
      <p><strong>📌 المثال 1:</strong> 12,5 + 3,4 = ؟</p>
      <div style="direction: ltr; text-align: center; font-family: monospace; font-size: 1.2em; background: white; padding: 10px; border-radius: 5px; width: fit-content; margin: 10px auto;">
        &nbsp;&nbsp;12<span style="color: red;">,</span>5<br>
        +&nbsp;&nbsp;3<span style="color: red;">,</span>4<br>
        -------<br>
        &nbsp;&nbsp;15<span style="color: red;">,</span>9
      </div>
      <p style="text-align: center;">النتيجة: <span style="color: red; font-size: 1.2em; font-weight: bold;">15,9</span></p>
    </div>

    <div style="background-color: #f6f6f6; padding: 20px; border-radius: 10px; margin-bottom: 15px;">
      <p><strong>📌 المثال 2:</strong> 7,25 + 3,8 = ؟</p>
      <p>نضيف صفراً للعدد 3,8 ليصبح 3,80</p>
      <div style="direction: ltr; text-align: center; font-family: monospace; font-size: 1.2em; background: white; padding: 10px; border-radius: 5px; width: fit-content; margin: 10px auto;">
        &nbsp;&nbsp;7<span style="color: red;">,</span>25<br>
        +&nbsp;3<span style="color: red;">,</span>80<br>
        -------<br>
        &nbsp;10<span style="color: red;">,</span>05
      </div>
      <p style="text-align: center;">النتيجة: <span style="color: red; font-size: 1.2em; font-weight: bold;">10,05</span></p>
    </div>

    <h3 style="color: #2563eb;">➖ ثانياً: طرح الأعداد العشرية</h3>
    <div style="background-color: #fff3e0; padding: 20px; border-radius: 10px; margin: 15px 0;">
      <h4 style="margin-top: 0;">📋 قاعدة طرح الأعداد العشرية</h4>
      <ul>
        <li>📌 الخطوة 1: نكتب العدد الأكبر فوق الأصغر</li>
        <li>📌 الخطوة 2: نرص الفاصلات تحت بعضها</li>
        <li>📌 الخطوة 3: نضيف أصفاراً لتساوي عدد الخانات</li>
        <li>📌 الخطوة 4: نطرح من اليمين إلى اليسار (مع الاستلاف عند الحاجة)</li>
        <li>📌 الخطوة 5: نضع الفاصلة في النتيجة تحت الفواصل</li>
      </ul>
    </div>

    <h4 style="color: #d97706;">✅ أمثلة محلولة: طرح الأعداد العشرية</h4>
    
    <div style="background-color: #f6f6f6; padding: 20px; border-radius: 10px; margin-bottom: 15px;">
      <p><strong>📌 المثال 1:</strong> 15,8 - 3,5 = ؟</p>
      <div style="direction: ltr; text-align: center; font-family: monospace; font-size: 1.2em; background: white; padding: 10px; border-radius: 5px; width: fit-content; margin: 10px auto;">
        &nbsp;&nbsp;15<span style="color: red;">,</span>8<br>
        -&nbsp;&nbsp;3<span style="color: red;">,</span>5<br>
        -------<br>
        &nbsp;&nbsp;12<span style="color: red;">,</span>3
      </div>
      <p style="text-align: center;">النتيجة: <span style="color: red; font-size: 1.2em; font-weight: bold;">12,3</span></p>
    </div>

    <div style="background-color: #f6f6f6; padding: 20px; border-radius: 10px; margin-bottom: 15px;">
      <p><strong>📌 المثال 2:</strong> 24,3 - 8,57 = ؟</p>
      <p>نضيف صفراً للعدد 24,3 ليصبح 24,30</p>
      <div style="direction: ltr; text-align: center; font-family: monospace; font-size: 1.2em; background: white; padding: 10px; border-radius: 5px; width: fit-content; margin: 10px auto;">
        &nbsp;&nbsp;24<span style="color: red;">,</span>30<br>
        -&nbsp;&nbsp;8<span style="color: red;">,</span>57<br>
        -------<br>
        &nbsp;&nbsp;15<span style="color: red;">,</span>73
      </div>
      <p style="text-align: center;">النتيجة: <span style="color: red; font-size: 1.2em; font-weight: bold;">15,73</span></p>
    </div>

    <h3 style="color: #2563eb;">✖️ ثالثاً: ضرب الأعداد العشرية</h3>
    <div style="background-color: #e8f5e9; padding: 20px; border-radius: 10px; margin: 15px 0;">
      <h4 style="margin-top: 0;">📋 قاعدة ضرب الأعداد العشرية</h4>
      <ul>
        <li>📌 الخطوة 1: نضرب الأعداد كأنها أعداد طبيعية (نتجاهل الفواصل)</li>
        <li>📌 الخطوة 2: نعد عدد الخانات العشرية في العددين معاً</li>
        <li>📌 الخطوة 3: في النتيجة، نضع الفاصلة بعدد الخانات التي حسبناها من اليمين إلى اليسار</li>
      </ul>
    </div>

    <h4 style="color: #d97706;">✅ أمثلة محلولة: ضرب الأعداد العشرية</h4>
    
    <div style="background-color: #f6f6f6; padding: 20px; border-radius: 10px; margin-bottom: 15px;">
      <p><strong>📌 المثال 1:</strong> 3,5 × 2 = ؟</p>
      <p>35 × 2 = 70. لدينا خانة عشرية واحدة (في 3,5). إذن النتيجة 7,0.</p>
      <p style="text-align: center;">النتيجة: <span style="color: red; font-size: 1.2em; font-weight: bold;">7</span></p>
    </div>

    <div style="background-color: #f6f6f6; padding: 20px; border-radius: 10px; margin-bottom: 15px;">
      <p><strong>📌 المثال 2:</strong> 2,4 × 3,6 = ؟</p>
      <p>24 × 36 = 864. لدينا خانتان عشريتان (واحدة في كل عدد). نضع الفاصلة بعد رقمين من اليمين.</p>
      <p style="text-align: center;">النتيجة: <span style="color: red; font-size: 1.2em; font-weight: bold;">8,64</span></p>
    </div>

    <div style="background-color: #f6f6f6; padding: 20px; border-radius: 10px; margin-bottom: 15px;">
      <p><strong>📌 المثال 3:</strong> 0,5 × 0,4 = ؟</p>
      <p>5 × 4 = 20. لدينا خانتان عشريتان. نضع الفاصلة بعد رقمين من اليمين لتصبح 0,20.</p>
      <p style="text-align: center;">النتيجة: <span style="color: red; font-size: 1.2em; font-weight: bold;">0,2</span></p>
    </div>

    <h3 style="color: #059669;">🎯 جدول خلاصة العمليات</h3>
    <table border="1" cellpadding="10" style="border-collapse: collapse; width: 100%; border: 2px solid #e5e7eb; text-align: center;">
      <thead>
        <tr style="background-color: #ecfdf5;">
          <th>العملية</th>
          <th>القاعدة الأساسية</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>الجمع</td><td>نرص الفواصل ثم نجمع من اليمين</td></tr>
        <tr><td>الطرح</td><td>نرص الفواصل ثم نطرح من اليمين</td></tr>
        <tr><td>الضرب</td><td>نضرب الأعداد ثم نضع الفاصلة بعدد الخانات العشرية</td></tr>
      </tbody>
    </table>

    <hr style="border-top: 2px dashed #d1d5db; margin: 20px 0;">
    <div style="background-color: #d4edda; padding: 20px; border-radius: 10px; text-align: center; font-size: 1.2em; border: 2px solid #28a745;">
      <p><strong>تذكر دائماً:</strong></p>
      <p>للجمع والطرح: رص الفواصل ثم احسب من اليمين</p>
      <p>للضرب: اضرب الأعداد ثم ضع الفاصلة بعدد الخانات العشرية</p>
      <p>لا تنس إضافة الأصفار عند الحاجة لتساوي الخانات</p>
    </div>
  `;

  // 4. Create Lesson
  const lesson = await prisma.lesson.create({
    data: {
      title: 'جمع وطرح وضرب أعداد عشرية في وضعيات مختلفة',
      content: lessonContent,
      subjectId: teacher.userDetails!.subjectId!,
      levelId: level.id,
      authorId: teacher.id,
      status: 'published',
      type: 'public',
      exercises: {
        create: [
          // 🟢 تمارين الدعم (70%)
          {
            type: 'support_with_results',
            question: 'التمرين 01: أكمل عمليات الجمع التالية:\n1) 4,5 + 3,2\n2) 7,3 + 2,8\n3) 12,4 + 5,6\n4) 3,25 + 1,4\n5) 0,8 + 0,7',
            expectedResults: [
              { question: "1", result: "7.7", tolerance: 0 },
              { question: "2", result: "10.1", tolerance: 0 },
              { question: "3", result: "18", tolerance: 0 },
              { question: "4", result: "4.65", tolerance: 0 },
              { question: "5", result: "1.5", tolerance: 0 }
            ],
            displayOrder: 1,
            maxScore: 5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 02: أكمل عمليات الطرح التالية:\n1) 8,9 - 3,4\n2) 15,7 - 6,2\n3) 24,5 - 12,8\n4) 7,3 - 4,15\n5) 10 - 3,6',
            expectedResults: [
              { question: "1", result: "5.5", tolerance: 0 },
              { question: "2", result: "9.5", tolerance: 0 },
              { question: "3", result: "11.7", tolerance: 0 },
              { question: "4", result: "3.15", tolerance: 0 },
              { question: "5", result: "6.4", tolerance: 0 }
            ],
            displayOrder: 2,
            maxScore: 5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 03: أكمل عمليات الضرب التالية (عدد عشري × عدد طبيعي):\n1) 3,5 × 2\n2) 4,2 × 3\n3) 2,5 × 4\n4) 0,6 × 7\n5) 1,2 × 5',
            expectedResults: [
              { question: "1", result: "7", tolerance: 0 },
              { question: "2", result: "12.6", tolerance: 0 },
              { question: "3", result: "10", tolerance: 0 },
              { question: "4", result: "4.2", tolerance: 0 },
              { question: "5", result: "6", tolerance: 0 }
            ],
            displayOrder: 3,
            maxScore: 5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 04: أكمل عمليات الضرب التالية (عدد عشري × عدد عشري):\n1) 2,3 × 1,5\n2) 3,2 × 2,4\n3) 1,5 × 0,6\n4) 0,4 × 0,3\n5) 2,5 × 1,2',
            expectedResults: [
              { question: "1", result: "3.45", tolerance: 0 },
              { question: "2", result: "7.68", tolerance: 0 },
              { question: "3", result: "0.9", tolerance: 0 },
              { question: "4", result: "0.12", tolerance: 0 },
              { question: "5", result: "3", tolerance: 0 }
            ],
            displayOrder: 4,
            maxScore: 5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 05: احسب النتائج للعمليات التالية:\n1) 12,5 + 3,75\n2) 8,4 + 2,36\n3) 5,25 + 4,8',
            expectedResults: [
              { question: "1", result: "16.25", tolerance: 0 },
              { question: "2", result: "10.76", tolerance: 0 },
              { question: "3", result: "10.05", tolerance: 0 }
            ],
            displayOrder: 5,
            maxScore: 3
          },
          {
            type: 'support_with_results',
            question: 'التمرين 06: صحح الأخطاء في العمليات التالية (اكتب النتيجة الصحيحة):\n1) 4,5 + 3,2 (الخطأ: 7,7)\n2) 8,4 - 2,3 (الخطأ: 6,1)\n3) 3,2 × 4 (الخطأ: 12,8)\n4) 2,5 × 0,5 (الخطأ: 12,5)',
            expectedResults: [
              { question: "1", result: "7.7", tolerance: 0 }, // The "error" in prompt was actually correct for addition, assuming it meant verify. 4.5+3.2=7.7. Let's assume user re-enters correct value.
              { question: "2", result: "6.1", tolerance: 0 }, // 8.4-2.3=6.1. Correct.
              { question: "3", result: "12.8", tolerance: 0 }, // 3.2*4=12.8. Correct.
              { question: "4", result: "1.25", tolerance: 0 }  // 2.5*0.5=1.25. The prompt says error is 12.5.
            ],
            displayOrder: 6,
            maxScore: 4
          },
          {
            type: 'support_with_results',
            question: 'التمرين 07: حدد عدد الخانات العشرية في ناتج العمليات التالية:\n1) 4,2 × 3,5\n2) 7,35 × 2,4\n3) 0,8 × 0,6\n4) 12,5 × 3',
            expectedResults: [
              { question: "1", result: "2", tolerance: 0 },
              { question: "2", result: "3", tolerance: 0 },
              { question: "3", result: "2", tolerance: 0 },
              { question: "4", result: "1", tolerance: 0 }
            ],
            displayOrder: 7,
            maxScore: 4
          },
          // 🔴 التمارين الرئيسية (30%)
          {
            type: 'main',
            question: 'التمرين 08: مسألة شراء مستلزمات مدرسية\nاشترى أحمد: كراسة (2,5 دينار)، قلم (1,25 دينار)، مسطرة (0,75 دينار)، ممحاة (0,5 دينار).\n1) كم دفع أحمد ثمن الكراسة والقلم معاً؟\n2) كم دفع ثمن المسطرة والممحاة معاً؟\n3) كم دفع ثمن جميع المشتريات؟\n4) إذا أعطى البائع 5 دنانير، كم يرجع له؟',
            modelAnswer: '1) الكراسة والقلم: 2,5 + 1,25 = 3,75 دينار.\n2) المسطرة والممحاة: 0,75 + 0,5 = 1,25 دينار.\n3) المجموع الكلي: 3,75 + 1,25 = 5 دنانير.\n4) الباقي: 5 - 5 = 0 دينار.',
            displayOrder: 8,
            maxScore: 5
          },
          {
            type: 'main',
            question: 'التمرين 09: مسألة أطوال أشرطة\nلدى خياط ثلاثة أشرطة: الأول (2,5 م)، الثاني (1,75 م)، الثالث (3,2 م).\n1) كم مجموع أطوال الأشرطة الثلاثة؟\n2) كم يزيد طول الشريط الثالث عن الأول؟\n3) كم يزيد طول الشريط الأول عن الثاني؟\n4) إذا احتاج الخياط إلى 4 أمتار، هل تكفيه الأشرطة؟ وكم يزيد أو ينقص؟',
            modelAnswer: '1) المجموع: 2,5 + 1,75 + 3,2 = 7,45 متر.\n2) الفرق بين الثالث والأول: 3,2 - 2,5 = 0,7 متر.\n3) الفرق بين الأول والثاني: 2,5 - 1,75 = 0,75 متر.\n4) نعم تكفيه (7,45 > 4). يزيد بـ: 7,45 - 4 = 3,45 متر.',
            displayOrder: 9,
            maxScore: 5
          },
          {
            type: 'main',
            question: 'التمرين 10: مسألة سباحة\nفي مسابقة، قطع المتسابقون المسافات التالية:\nأحمد: 12,5m, 13,2m, 14,8m\nسارة: 11,8m, 13,5m, 14,2m\nمحمد: 12,3m, 12,9m, 13,7m\n1) كم مجموع مسافات أحمد؟\n2) كم مجموع مسافات سارة؟\n3) كم الفرق بين مجموع أحمد ومجموع محمد؟\n4) رتب المتسابقين حسب المجموع.',
            modelAnswer: '1) مجموع أحمد: 12,5 + 13,2 + 14,8 = 40,5 متر.\n2) مجموع سارة: 11,8 + 13,5 + 14,2 = 39,5 متر.\n3) مجموع محمد: 12,3 + 12,9 + 13,7 = 38,9 متر. الفرق: 40,5 - 38,9 = 1,6 متر.\n4) الترتيب: أحمد (40,5) > سارة (39,5) > محمد (38,9).',
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