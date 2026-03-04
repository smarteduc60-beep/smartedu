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
    console.error(`❌ Teacher with email ${teacherEmail} not found. Please create the user first.`);
    return;
  }

  // 1. البحث عن المستوى أولاً (أولى متوسط)
  const level = await prisma.level.findFirst({
    where: { name: { contains: 'أولى متوسط' } },
  });

  if (!level) {
    console.error('❌ Level "أولى متوسط" not found.');
    return;
  }

  // 2. البحث عن مادة الرياضيات الخاصة بمرحلة هذا المستوى (المتوسطة)
  // هذا يمنع اختيار رياضيات الابتدائي (ID 1) بالخطأ
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

  console.log(`✅ Selected Subject: ${subject.name} (ID: ${subject.id}) for Level: ${level.name}`);

  // 3. ضمان تطابق ملف الأستاذ مع المادة الصحيحة
  if (teacher.userDetails && teacher.userDetails.subjectId !== subject.id) {
    console.log(`🔄 Updating teacher profile to match subject ID ${subject.id}...`);
    await prisma.userDetails.update({
      where: { userId: teacher.id },
      data: { subjectId: subject.id }
    });
  }

  const lessonTitle = "إنشاء مستقيم يشمل نقطة ويوازي مستقيمًا - مستقيم يشمل نقطة ويعامد مستقيمًا + مصطلحات وترميزات";

  // المحتوى بتنسيق HTML كما ورد في الطلب
  const content = `
🔍 تمهيد: ماذا نعني بالتوازي والتعامد؟
<div style="display: flex; justify-content: space-around; margin: 20px 0; flex-wrap: wrap; gap: 20px;">
  <div style="background-color: #e3f2fd; padding: 20px; border-radius: 15px; text-align: center; width: 45%; min-width: 300px;">
    <div style="font-size: 3em; color: #1976D2;">∥</div>
    <h3>التوازي</h3>
    <p>مستقيمان لا يلتقيان أبدًا</p>
    <p>المسافة بينهما ثابتة</p>
    <p style="font-size: 1.3em; margin-top: 10px;">(d) // (l)</p>
    <div style="margin-top: 15px; background-color: white; padding: 10px; border-radius: 5px;">
      <svg width="100%" height="100" viewBox="0 0 200 100">
        <line x1="10" y1="30" x2="190" y2="30" stroke="black" stroke-width="2" />
        <text x="180" y="25" font-size="12">(d)</text>
        <line x1="10" y1="70" x2="190" y2="70" stroke="black" stroke-width="2" />
        <text x="180" y="65" font-size="12">(l)</text>
      </svg>
    </div>
  </div>
  <div style="background-color: #ffebee; padding: 20px; border-radius: 15px; text-align: center; width: 45%; min-width: 300px;">
    <div style="font-size: 3em; color: #c2185b;">⟂</div>
    <h3>التعامد</h3>
    <p>مستقيمان يتقاطعان</p>
    <p>يشكلان زاوية قائمة (90°)</p>
    <p style="font-size: 1.3em; margin-top: 10px;">(d) ⊥ (l)</p>
    <div style="margin-top: 15px; background-color: white; padding: 10px; border-radius: 5px;">
      <svg width="100%" height="100" viewBox="0 0 200 100">
        <line x1="10" y1="80" x2="190" y2="80" stroke="black" stroke-width="2" />
        <text x="180" y="75" font-size="12">(d)</text>
        <line x1="100" y1="10" x2="100" y2="90" stroke="black" stroke-width="2" />
        <text x="105" y="20" font-size="12">(l)</text>
        <rect x="100" y="70" width="10" height="10" fill="none" stroke="red" stroke-width="1" />
      </svg>
    </div>
  </div>
</div>
📝 المصطلحات والترميزات الأساسية
<div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0; overflow-x: auto;">
<table style="width:100%; text-align:right; border-collapse: collapse; min-width: 500px;">
<tr style="border-bottom: 1px solid #ccc;"><th>المصطلح</th><th>معناه</th><th>الترميز</th><th>مثال</th></tr>
<tr><td>نقطة</td><td>موقع محدد في المستوى</td><td>حرف كبير</td><td>A • ، B × ، M •</td></tr>
<tr><td>مستقيم</td><td>خط غير محدود من الجهتين</td><td>حرف صغير بين قوسين</td><td>(d)، (l)</td></tr>
<tr><td>يشمل</td><td>المستقيم يمر بالنقطة</td><td>A ∈ (d)</td><td>A ∈ (d)</td></tr>
<tr><td>لا يشمل</td><td>المستقيم لا يمر بالنقطة</td><td>A ∉ (d)</td><td>B ∉ (d)</td></tr>
<tr><td>يوازي</td><td>مستقيمان متوازيان</td><td>(d) // (l)</td><td>(d) // (l)</td></tr>
<tr><td>يعامد</td><td>مستقيمان متعامدان</td><td>(d) ⊥ (l)</td><td>(d) ⊥ (l)</td></tr>
<tr><td>يتقاطعان في</td><td>نقطة التقاطع</td><td>(d) ∩ (l) = {A}</td><td>(d) ∩ (l) = {A}</td></tr>
</table>
</div>
📐 أولاً: إنشاء مستقيم يشمل نقطة ويوازي مستقيمًا معلومًا
🎯 القاعدة الأساسية:
لإنشاء مستقيم (l) يشمل نقطة A ويوازي مستقيمًا معلومًا (d)، ننقل الزاوية التي يصنعها مستقيم مساعد مع (d) إلى النقطة A باستخدام المدور والمسطرة.

✅ الإنشاء بالخطوات:
<div style="background-color: #f6f6f6; padding: 20px; border-radius: 15px; margin: 20px 0;">
<strong>المعطيات:</strong> مستقيم (d) مرسوم، ونقطة A × خارج المستقيم (d).
<br><strong>الطريقة:</strong> نستخدم الكوس لتعيين نقطة ثانية B تبعد عن المستقيم (d) بنفس مسافة النقطة A.
<br><br>
<div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">
  <div style="text-align: center;">
    <p><strong>1. نضع الكوس عمودياً</strong></p>
    <svg width="200" height="150" viewBox="0 0 200 150" style="background: white; border-radius: 10px;">
      <line x1="10" y1="120" x2="190" y2="120" stroke="black" stroke-width="2" />
      <text x="180" y="115" font-size="12">(d)</text>
      <circle cx="70" cy="50" r="3" fill="red" />
      <text x="70" y="40" font-size="12" fill="red">A</text>
      <!-- Dashed perpendicular line representing the set square measurement -->
      <line x1="70" y1="50" x2="70" y2="120" stroke="gray" stroke-width="2" stroke-dasharray="5,5" />
      <rect x="70" y="110" width="10" height="10" fill="none" stroke="black" />
    </svg>
  </div>
  <div style="text-align: center;">
    <p><strong>2. نعين النقطة B</strong></p>
    <svg width="200" height="150" viewBox="0 0 200 150" style="background: white; border-radius: 10px;">
      <line x1="10" y1="120" x2="190" y2="120" stroke="black" stroke-width="2" />
      <circle cx="70" cy="50" r="3" fill="red" />
      <text x="70" y="40" font-size="12" fill="red">A</text>
      <!-- Second point B at same distance -->
      <line x1="140" y1="50" x2="140" y2="120" stroke="gray" stroke-width="2" stroke-dasharray="5,5" />
      <circle cx="140" cy="50" r="3" fill="red" />
      <text x="140" y="40" font-size="12" fill="red">B</text>
      <rect x="140" y="110" width="10" height="10" fill="none" stroke="black" />
    </svg>
  </div>
  <div style="text-align: center;">
    <p><strong>3. نصل بين A و B</strong></p>
    <svg width="200" height="150" viewBox="0 0 200 150" style="background: white; border-radius: 10px;">
      <line x1="10" y1="120" x2="190" y2="120" stroke="black" stroke-width="2" />
      <text x="180" y="115" font-size="12">(d)</text>
      <!-- The parallel line -->
      <line x1="10" y1="50" x2="190" y2="50" stroke="#1976D2" stroke-width="3" />
      <text x="180" y="45" font-size="12" fill="blue">(l)</text>
      <circle cx="70" cy="50" r="3" fill="red" />
      <text x="70" y="40" font-size="12" fill="red">A</text>
      <circle cx="140" cy="50" r="3" fill="red" />
      <text x="140" y="40" font-size="12" fill="red">B</text>
    </svg>
  </div>
</div>
</div>
<div style="background-color: #d4edda; padding: 15px; border-radius: 10px; margin: 20px 0;">
✍️ الترميز الصحيح: (l) // (d) ، A ∈ (l) ، (l) ∩ (d) = ∅
</div>

📐 ثانيًا: إنشاء مستقيم يشمل نقطة ويعامد مستقيمًا معلومًا
🎯 القاعدة الأساسية: المستقيمان المتعامدان يحددان زاوية قائمة (90°).

✅ الإنشاء بالخطوات (باستخدام المدور):
<div style="background-color: #f6f6f6; padding: 20px; border-radius: 15px; margin: 20px 0;">
<strong>: النقطة A تنتمي للمستقيم</strong>
<div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; margin-top: 15px;">
  <div style="text-align: center;">
    <p><strong>1. قوسين بفتحة ثابتة</strong></p>
    <svg width="200" height="100" viewBox="0 0 200 100" style="background: white; border-radius: 10px;">
      <line x1="10" y1="80" x2="190" y2="80" stroke="black" stroke-width="2" />
      <circle cx="100" cy="80" r="3" fill="red" />
      <text x="100" y="70" font-size="12" fill="red">A</text>
      <!-- Thicker, clearer arcs -->
      <path d="M 70 70 Q 65 80 70 90" stroke="#2E7D32" stroke-width="3" fill="none" />
      <path d="M 130 70 Q 135 80 130 90" stroke="#2E7D32" stroke-width="3" fill="none" />
    </svg>
  </div>
  <div style="text-align: center;">
    <p><strong>2. قوسين أكبر للتقاطع</strong></p>
    <svg width="200" height="100" viewBox="0 0 200 100" style="background: white; border-radius: 10px;">
      <line x1="10" y1="80" x2="190" y2="80" stroke="black" stroke-width="2" />
      <circle cx="100" cy="80" r="3" fill="red" />
      <!-- Intersecting arcs -->
      <path d="M 80 30 Q 100 10 120 30" stroke="#C2185B" stroke-width="3" fill="none" />
      <path d="M 80 10 Q 100 30 120 10" stroke="#C2185B" stroke-width="3" fill="none" />
      <circle cx="100" cy="20" r="3" fill="blue" />
    </svg>
  </div>
  <div style="text-align: center;">
    <p><strong>3. رسم العمود</strong></p>
    <svg width="200" height="100" viewBox="0 0 200 100" style="background: white; border-radius: 10px;">
      <line x1="10" y1="80" x2="190" y2="80" stroke="black" stroke-width="2" />
      <line x1="100" y1="10" x2="100" y2="90" stroke="#C2185B" stroke-width="3" />
      <rect x="100" y="70" width="10" height="10" fill="none" stroke="red" />
    </svg>
  </div>
</div>

<br>

</div>
<div style="background-color: #d4edda; padding: 15px; border-radius: 10px; margin: 20px 0;">
✍️ الترميز الصحيح: (l) ⊥ (d) ، A ∈ (l) ، (l) ∩ (d) = {H} (نقطة التقاطع)
</div>

📊 جدول ملخص الرموز والمصطلحات
<div style="background-color: #fff3cd; padding: 20px; border-radius: 15px; margin: 30px 0;">
راجع الجدول في بداية الدرس للملخص الكامل.
</div>

📝 تمارين الدرس متوفرة في قسم التمارين.
`;

  console.log(`📝 Creating/Updating lesson: ${lessonTitle}...`);

  // حذف الدرس القديم لتجنب التكرار
  await prisma.lesson.deleteMany({
    where: {
      title: lessonTitle,
      authorId: teacher.id,
    },
  });

  const lesson = await prisma.lesson.create({
    data: {
      title: lessonTitle,
      content: content,
      subject: { connect: { id: subject.id } },
      level: { connect: { id: level.id } },
      author: { connect: { id: teacher.id } },
      type: 'public',
      status: 'approved',
      published: true, // إعادة تفعيل خاصية النشر
    },
  });

  console.log(`✅ Lesson created successfully with ID: ${lesson.id}`);

  // إضافة التمارين
  const exercises = [
    { type: 'support_only', question: 'أكمل بالرمز المناسب:\nالمستقيمان المتوازيان: (d) .... (l) ← ⬜\nالمستقيمان المتعامدان: (m) .... (n) ← ⬜\nالنقطة A • تقع على المستقيم (d): A .... (d) ← ⬜\nالنقطة B × لا تقع على المستقيم (l): B .... (l) ← ⬜\nالمستقيم (s) يعامد المستقيم (t): (s) .... (t) ← ⬜\nالمستقيم (p) يوازي المستقيم (q): (p) .... (q) ← ⬜\nتقاطع (d) و (l) هو النقطة M •: (d) ∩ (l) = {....} ← ⬜', modelAnswer: '1. //\n2. ⊥\n3. ∈\n4. ∉\n5. ⊥\n6. //\n7. M' },
    { type: 'support_only', question: 'اكتب العلاقة بالكلمات:\n(AB) // (CD) ← المستقيم (AB) ⬜ المستقيم (CD)\n(EF) ⊥ (GH) ← المستقيم (EF) ⬜ المستقيم (GH)\nM ∈ (AB) ← النقطة M ⬜ المستقيم (AB)\nP ∉ (CD) ← النقطة P ⬜ المستقيم (CD)\n(AB) ∩ (CD) = {O} ← المستقيمان (AB) و (CD) ⬜ في النقطة O', modelAnswer: '1. يوازي\n2. يعامد\n3. تنتمي إلى\n4. لا تنتمي إلى\n5. يتقاطعان' },
    { type: 'support_only', question: 'اختر الإجابة الصحيحة:\n1. المستقيمان المتوازيان ... (لا يلتقيان / يلتقيان في نقطة / يتعامدان)\n2. رمز التعامد هو ... (// / ⊥ / ∈)\n3. إذا كانت A ∈ (d) فهذا يعني ... (A على المستقيم / A خارج المستقيم)\n4. الزاوية القائمة قياسها ... (180° / 90° / 360°)\n5. المستقيم (l) يعامد (d) نكتب ... ((l) // (d) / (l) ⊥ (d))', modelAnswer: '1. لا يلتقيان\n2. ⊥\n3. A على المستقيم\n4. 90°\n5. (l) ⊥ (d)' },
    { type: 'support_only', question: 'لاحظ الشكل ثم أجب:\n(شكل يوضح مستقيم (d) ونقاط A, B, C)\nاكتب مستقيمين متوازيين: ⬜ و ⬜ (ليس في الشكل)\nاكتب مستقيمين متعامدين: (d) ⊥ (AB)\nالنقطة A تنتمي إلى: A ∈ (d) و A ∈ ⬜\nالنقطة C تنتمي إلى: C ∈ ⬜\nالنقطة B لا تنتمي إلى: B ∉ ⬜', modelAnswer: '1. لا يوجد\n2. (d) ⊥ (AB)\n3. (AB)\n4. (AB)\n5. (d)' },
    { type: 'support_only', question: 'أكمل الجملة:\nالمستقيمان (d) و (l) لا يلتقيان أبدًا، إذن هما ⬜\nالمستقيم (m) يعامد المستقيم (n)، إذن الرمز هو: (m) ⬜ (n)\nإذا كانت A نقطة تقع على المستقيم (d)، نكتب: A ⬜ (d)\nالزاوية بين مستقيمين متعامدين قياسها ⬜ درجة\nنقطة تقاطع مستقيمين نرمز لها بالرمز ⬜', modelAnswer: '1. متوازيان\n2. ⊥\n3. ∈\n4. 90\n5. ∩' },
    { type: 'support_only', question: 'صحح الخطأ:\n1. (AB) ⊥ (CD) يعني أن المستقيمين متوازيان\n2. M ∉ (EF) يعني أن M على المستقيم\n3. المستقيمان المتوازيان يلتقيان في نقطة\n4. رمز التوازي هو ⊥\n5. A ∈ (d) يعني أن A خارج المستقيم', modelAnswer: '1. متعامدان\n2. خارج المستقيم\n3. لا يلتقيان\n4. //\n5. على المستقيم' },
    { type: 'support_only', question: 'أنشئ ثم اكتب:\nعلى ورقة بيضاء:\nارسم مستقيمًا أفقيًا (d)\nعين نقطة A × فوق المستقيم\nأنشئ مستقيم (l) يشمل A ويوازي (d)\nعين نقطة B • على المستقيم (d)\nأنشئ مستقيم (m) يشمل B ويعامد (d)\nثم اكتب العلاقات:\n(l) .... (d)\n(m) .... (d)\nA .... (l)\nB .... (m) و B .... (d)', modelAnswer: '(l) // (d) ، (m) ⊥ (d) ، A ∈ (l) ، B ∈ (m) و B ∈ (d)' },
    { type: 'main', question: 'مسألة إنشاء - مثلث قائم:\nالمعطيات: مثلث ABC قائم الزاوية في B، (AB) ⊥ (BC)، النقطة M منتصف [AC].\nالمطلوب:\n1. ارسم الشكل المطلوب.\n2. أنشئ مستقيم (l) يشمل M ويوازي (AB).\n3. أنشئ مستقيم (p) يشمل M ويعامد (AB).\n4. اكتب العلاقات التالية:\n(l) .... (AB)\n(p) .... (AB)\n(l) .... (BC) (هل هما متوازيان أم متعامدان؟)', modelAnswer: '(l) // (AB) ، (p) ⊥ (AB) ، (l) // (BC)' },
    { type: 'main', question: 'مسألة: مستطيل وأقطاره:\nالمعطيات: مستطيل EFGH حيث (EF) // (GH) و (EH) // (FG)، القطر [EG] والقطر [FH] يتقاطعان في O.\nالمطلوب:\n1. ارسم المستطيل.\n2. أنشئ مستقيم (l) يشمل O ويوازي (EF).\n3. أنشئ مستقيم (m) يشمل O ويعامد (EF).\n4. اكتب جميع علاقات التوازي والتعامد في الشكل.', modelAnswer: 'المتوازيات: (EF)//(GH)، (EH)//(FG)\nالمتعامدات: (EF)⊥(EH)، (EF)⊥(FG)' },
    { type: 'main', question: 'التحدي الكبير - إنشاء متكامل:\nالوضعية: مربع PQRS طول ضلعه 6cm. النقطة I منتصف [PQ]، والنقطة J منتصف [RS].\nالمطلوب:\n1. ارسم المربع.\n2. أنشئ المستقيم (l) يشمل I ويوازي (PS).\n3. أنشئ المستقيم (m) يشمل J ويعامد (QR).\n4. سم نقطة تقاطع (l) و (m) بـ O.\n5. أكمل بكتابة الرموز المناسبة:\n(PQ) .... (RS)\n(PS) .... (PQ)\nI .... (PQ)\n(l) .... (PS)\n(m) .... (QR)\n(l) ∩ (m) {....}', modelAnswer: '(PQ)//(RS)، (PS)⊥(PQ)، I∈(PQ)، (l)//(PS)، (m)⊥(QR)، (l)∩(m)={O}' },
  ];

  console.log(`📝 Adding ${exercises.length} exercises...`);
  for (const [index, ex] of exercises.entries()) {
    await prisma.exercise.create({
      data: {
        lessonId: lesson.id,
        question: ex.question,
        modelAnswer: ex.modelAnswer,
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