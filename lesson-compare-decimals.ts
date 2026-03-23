import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding Lesson: Comparing and Ordering Decimal Numbers ...');

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
        <h3>🏆 مشكلة: ترتيب المتسابقين في مسابقة الوثب العالي</h3>
        <p>نظمت متوسطة "الإخوة مزيان" مسابقة في الوثب العالي. إليك نتائج خمسة متسابقين:</p>
      </div>

      <div style="display: flex; justify-content: center; gap: 20px; margin: 30px 0; flex-wrap: wrap;">
        <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1); width: 150px;">
          <div style="background-color: #ffcdd2; padding: 10px; border-radius: 50%; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
            <span style="font-size: 2em;">👤</span>
          </div>
          <p style="font-weight: bold;">أحمد</p>
          <p style="background-color: #1976D2; color: white; padding: 5px 10px; border-radius: 20px;">1,75 m</p>
        </div>
        <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1); width: 150px;">
          <div style="background-color: #ffebee; padding: 10px; border-radius: 50%; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
            <span style="font-size: 2em;">👤</span>
          </div>
          <p style="font-weight: bold;">سارة</p>
          <p style="background-color: #FF9800; color: white; padding: 5px 10px; border-radius: 20px;">1,8 m</p>
        </div>
        <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1); width: 150px;">
          <div style="background-color: #e8f5e9; padding: 10px; border-radius: 50%; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
            <span style="font-size: 2em;">👤</span>
          </div>
          <p style="font-weight: bold;">كريم</p>
          <p style="background-color: #4CAF50; color: white; padding: 5px 10px; border-radius: 20px;">1,68 m</p>
        </div>
        <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1); width: 150px;">
          <div style="background-color: #f3e5f5; padding: 10px; border-radius: 50%; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
            <span style="font-size: 2em;">👤</span>
          </div>
          <p style="font-weight: bold;">ليلى</p>
          <p style="background-color: #9C27B0; color: white; padding: 5px 10px; border-radius: 20px;">1,72 m</p>
        </div>
        <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1); width: 150px;">
          <div style="background-color: #ffccbc; padding: 10px; border-radius: 50%; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
            <span style="font-size: 2em;">👤</span>
          </div>
          <p style="font-weight: bold;">عمر</p>
          <p style="background-color: #FF5722; color: white; padding: 5px 10px; border-radius: 20px;">1,85 m</p>
        </div>
      </div>
      <p>🔍 يريد الحكام ترتيب المتسابقين من الأقل قفزاً إلى الأكثر قفزاً.</p>
      <p><strong>❓ التساؤلات:</strong></p>
      <ul>
        <li>كيف نقارن بين 1,75 و 1,8 و 1,68؟</li>
        <li>أي عدد أكبر: 1,75 أم 1,8؟</li>
        <li>كيف نرتب هذه الأعداد تصاعدياً؟</li>
      </ul>

      <!-- 2️⃣ مرحلة البحث والاكتشاف -->
      <div style="background-color: #fff9e6; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <h3>🧪 نشاط استكشافي: هيا نكتشف مقارنة الأعداد العشرية!</h3>
        <h4>📌 النشاط 1: المقارنة باستعمال نصف مستقيم</h4>
        <div style="text-align: center; margin: 30px 0;">
          <svg width="500" height="100" viewBox="0 0 500 100">
            <line x1="30" y1="50" x2="470" y2="50" stroke="black" stroke-width="3"/>
            <circle cx="30" cy="50" r="4" fill="red"/>
            <text x="25" y="40" fill="red">1,6</text>
            <line x1="110" y1="45" x2="110" y2="55" stroke="black"/>
            <text x="105" y="40">1,68</text>
            <circle cx="110" cy="50" r="4" fill="blue"/>
            <line x1="190" y1="45" x2="190" y2="55" stroke="black"/>
            <text x="185" y="40">1,72</text>
            <circle cx="190" cy="50" r="4" fill="green"/>
            <line x1="270" y1="45" x2="270" y2="55" stroke="black"/>
            <text x="265" y="40">1,75</text>
            <circle cx="270" cy="50" r="4" fill="orange"/>
            <line x1="350" y1="45" x2="350" y2="55" stroke="black"/>
            <text x="345" y="40">1,8</text>
            <circle cx="350" cy="50" r="4" fill="purple"/>
            <line x1="430" y1="45" x2="430" y2="55" stroke="black"/>
            <text x="425" y="40">1,85</text>
            <circle cx="430" cy="50" r="4" fill="brown"/>
            <polygon points="470,50 460,45 460,55" fill="black"/>
            <text x="150" y="80" fill="red">الأعداد تتزايد نحو اليمين</text>
          </svg>
          <p><strong>على نصف المستقيم، العدد الذي على اليمين هو الأكبر</strong></p>
        </div>
        <h4>📌 النشاط 2: اكتشاف القاعدة</h4>
        <p><strong>❓ أسئلة موجهة:</strong></p>
        <ul>
          <li>كيف قارنا بين 1,75 و 1,8؟ <span style="background-color: #1976D2; color: white; padding: 3px 8px; border-radius: 15px;">قارنا الجزء العشري بعد تساوي الجزء الصحيح</span></li>
          <li>ماذا نفعل إذا اختلف عدد الخانات العشرية؟ <span style="background-color: #FF9800; color: white; padding: 3px 8px; border-radius: 15px;">نضيف أصفاراً</span></li>
          <li>كيف نرتب الأعداد تصاعدياً؟ <span style="background-color: #4CAF50; color: white; padding: 3px 8px; border-radius: 15px;">من الأصغر إلى الأكبر</span></li>
        </ul>
      </div>

      <!-- 3️⃣ بناء المفهوم -->
      <div style="background: linear-gradient(135deg, #43C6AC 0%, #191654 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
        <h3>📚 مقارنة وترتيب الأعداد العشرية</h3>
      </div>
      <div style="background-color: #e3f2fd; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="border-right: 8px solid #1976D2; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h4>🔷 <span style="color: #1976D2;">مكونات العدد العشري</span></h4>
          <p>يتكون العدد العشري من جزء صحيح وجزء عشري تفصل بينهما فاصلة.</p>
        </div>
        <div style="border-right: 8px solid #c2185b; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h4>🔷 <span style="color: #c2185b;">رموز المقارنة</span></h4>
          <ul>
            <li>&gt; : أكبر من</li>
            <li>&lt; : أصغر من</li>
            <li>= : يساوي</li>
          </ul>
        </div>
        <div style="border-right: 8px solid #4CAF50; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h4>🔷 <span style="color: #4CAF50;">خطوات مقارنة عددين عشريين</span></h4>
          <ol>
            <li>قارن الجزء الصحيح أولاً.</li>
            <li>إذا تساوى الجزء الصحيح، قارن الجزء العشري خانة بخانة من اليسار إلى اليمين.</li>
            <li>إذا اختلف عدد الخانات العشرية، أضف أصفاراً إلى اليمين حتى يتساوى الطول.</li>
          </ol>
        </div>
      </div>

      <!-- 4️⃣ تمثيل متعدد للمفهوم -->
      <div style="background: linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
        <h3>🎭 أربع تمثيلات لمقارنة الأعداد العشرية</h3>
      </div>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;">
        <div style="background: linear-gradient(145deg, #ffffff, #e3f2fd); padding: 20px; border-radius: 15px;">
          <h4 style="color: #1976D2; text-align: center;">🔢 تمثيل عددي</h4>
          <p style="text-align: center;">12,5 &gt; 12,3</p>
        </div>
        <div style="background: linear-gradient(145deg, #ffffff, #ffebee); padding: 20px; border-radius: 15px;">
          <h4 style="color: #c2185b; text-align: center;">📝 تمثيل لفظي</h4>
          <p style="text-align: center;">"اثنا عشر فاصل خمسة أكبر من اثنا عشر فاصل ثلاثة"</p>
        </div>
      </div>

      <!-- 5️⃣ أمثلة محلولة تدريجيًا -->
      <div style="background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #ddd;">
        <h4>📌 مثال 1: بسيط جدًا</h4>
        <p><strong>المطلوب:</strong> قارن بين 15,3 و 12,8</p>
        <p><strong>الحل:</strong> الجزء الصحيح 15 أكبر من 12. إذن 15,3 &gt; 12,8.</p>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #ddd;">
        <h4>📌 مثال 2: متوسط</h4>
        <p><strong>المطلوب:</strong> قارن بين 7,25 و 7,3</p>
        <p><strong>الحل:</strong> الجزء الصحيح متساوٍ. نضيف صفراً: 7,30. نقارن 25 و 30. إذن 7,25 &lt; 7,3.</p>
      </div>

      <!-- 6️⃣ أخطاء شائعة -->
      <div style="background-color: #ffebee; padding: 25px; border-radius: 15px; margin: 20px 0;">
        <h3>⚠️ أخطاء شائعة</h3>
        <ul>
          <li><strong>الخطأ:</strong> 4,3 &lt; 4,25 (الاعتقاد أن 25 أكبر من 3). <strong>الحل:</strong> نكتب 4,3 = 4,30 ثم نقارن.</li>
          <li><strong>الخطأ:</strong> 0,7 = 0,07. <strong>الحل:</strong> 0,7 = 0,70 وليس 0,07.</li>
        </ul>
      </div>

      <!-- ✨ خلاصة الدرس -->
      <div style="background: linear-gradient(135deg, #43C6AC 0%, #191654 100%); padding: 30px; border-radius: 15px; margin: 30px 0; text-align: center; color: white;">
        <h3>📌 الخلاصة</h3>
        <p style="font-size: 1.5em;">✨ القاعدة الذهبية: العدد الذي على اليمين في نصف المستقيم هو الأكبر ✨</p>
      </div>
    </div>
  `;

  const lessonTitle = 'مقارنة عددين عشريين وترتيب أعداد عشرية';

  // حذف الدرس القديم لتجنب التكرار
  await prisma.lesson.deleteMany({
    where: {
      title: lessonTitle,
      authorId: teacher.id,
    },
  });

  // 5. Create Lesson
  const lesson = await prisma.lesson.create({
    data: {
      title: lessonTitle,
      content: lessonContent,
      subjectId: subject.id,
      levelId: level.id,
      authorId: teacher.id,
      status: 'approved',
      type: 'public',
      lessonFileIds: [],
      exercises: {
        create: [
          // 🟢 تمارين الدعم (70%)
          {
            type: 'support_with_results',
            question: 'التمرين 01: ضع الرمز المناسب (> أو < أو =):\n1) 5,3 ... 3,9\n2) 12,7 ... 12,9\n3) 4,25 ... 4,3\n4) 0,8 ... 0,80\n5) 6,02 ... 6,019\n6) 7,4 ... 7,40',
            expectedResults: [
              { question: "1", result: ">", tolerance: 0 },
              { question: "2", result: "<", tolerance: 0 },
              { question: "3", result: "<", tolerance: 0 },
              { question: "4", result: "=", tolerance: 0 },
              { question: "5", result: ">", tolerance: 0 },
              { question: "6", result: "=", tolerance: 0 }
            ],
            displayOrder: 1,
            maxScore: 6,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([])
          },
          {
            type: 'support_with_results',
            question: 'التمرين 03: اختر العدد الأكبر في كل زوج:\n1) 7,8 أو 7,75\n2) 0,3 أو 0,29\n3) 5,02 أو 5,2',
            expectedResults: [
              { question: "1", result: "7,8", tolerance: 0 },
              { question: "2", result: "0,3", tolerance: 0 },
              { question: "3", result: "5,2", tolerance: 0 }
            ],
            displayOrder: 2,
            maxScore: 3,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([])
          },
          {
            type: 'support_with_results',
            question: 'التمرين 05: رتب الأعداد التالية تصاعدياً (اكتب الأعداد مفصولة بفاصلة):\n4,2 - 3,8 - 4,15 - 3,75',
            expectedResults: [
              { question: "1", result: "3,75, 3,8, 4,15, 4,2", tolerance: 0 }
            ],
            displayOrder: 3,
            maxScore: 4,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([])
          },
          {
            type: 'support_with_results',
            question: 'التمرين 06: رتب الأعداد التالية تنازلياً (اكتب الأعداد مفصولة بفاصلة):\n12,3 - 12,03 - 12,33 - 12',
            expectedResults: [
              { question: "1", result: "12,33, 12,3, 12,03, 12", tolerance: 0 }
            ],
            displayOrder: 4,
            maxScore: 4,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([])
          },
          // 🔴 التمارين الرئيسية (30%)
          {
            type: 'main',
            question: 'التمرين 08: أطوال 5 أقلام بالسنتمترات: أ(12,5)، ب(12,25)، ج(13)، د(12,75)، هـ(12,5).\nالمطلوب:\n1) رتب الأقلام تصاعدياً حسب الطول.\n2) ما هو أطول قلم؟\n3) ما هو أقصر قلم؟',
            modelAnswer: '1) الترتيب: 12,25 < 12,5 = 12,5 < 12,75 < 13\n2) أطول قلم: ج (13 cm)\n3) أقصر قلم: ب (12,25 cm)',
            displayOrder: 5,
            maxScore: 5,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([])
          },
          {
            type: 'main',
            question: 'التمرين 09: درجات الحرارة في 5 مدن: أ(24,5°)، ب(23,8°)، ج(25,2°)، د(24,15°)، هـ(23,75°).\nالمطلوب:\n1) رتب المدن تنازلياً حسب درجة الحرارة.\n2) ما هي المدينة الأكثر حرارة؟\n3) ما هي المدينة الأقل حرارة؟',
            modelAnswer: '1) الترتيب: ج > أ > د > ب > هـ\n2) الأكثر حرارة: ج\n3) الأقل حرارة: هـ',
            displayOrder: 6,
            maxScore: 5
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([])
          },
          {
            type: 'main',
            question: 'التمرين 10: نتائج مسابقة القفز العالي (بالأمتار): أحمد(1,75)، سارة(1,8)، محمد(1,68)، فاطمة(1,72)، عمر(1,85).\nالمطلوب:\n1) رتب المتسابقين تصاعدياً.\n2) من هو الفائز بالمركز الأول؟\n3) من هو صاحب المركز الأخير؟',
            modelAnswer: '1) محمد < فاطمة < أحمد < سارة < عمر\n2) الفائز: عمر\n3) الأخير: محمد',
            displayOrder: 7,
            maxScore: 5
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([])
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