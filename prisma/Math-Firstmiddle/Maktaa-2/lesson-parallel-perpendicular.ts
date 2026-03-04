import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 بدء إنشاء درس التوازي والتعامد...');

  // 1. البحث عن المعلم المحدد (ladj14013@gmail.com)
  const targetEmail = 'ladj14013@gmail.com';

  let teacher = await prisma.user.findFirst({
    where: { email: targetEmail }
  });

  // إذا لم يكن المعلم موجوداً، نقوم بإنشائه
  if (!teacher) {
    console.log(`⚠️ المعلم ${targetEmail} غير موجود. جاري إنشاؤه...`);
    const teacherRole = await prisma.role.findFirst({ where: { name: 'teacher' } });
    
    if (!teacherRole) {
      console.error('❌ لم يتم العثور على دور المعلم في النظام. يرجى تشغيل seed.ts أولاً.');
      return;
    }

    teacher = await prisma.user.create({
      data: {
        email: targetEmail,
        firstName: 'لخضر', 
        lastName: 'جديد',
        roleId: teacherRole.id,
        password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOal/mwGj0.J0.J0.J0.J0.J0.J0.J0', // كلمة مرور افتراضية
      }
    });
  }

  console.log(`👤 سيتم تعيين الدرس للمعلم: ${teacher.firstName} ${teacher.lastName} (${teacher.email})`);

  // 2. البحث عن المادة (الرياضيات)
  const subject = await prisma.subject.findFirst({
    where: { name: 'الرياضيات' },
  });

  if (!subject) {
    console.error('❌ لم يتم العثور على مادة الرياضيات.');
    return;
  }

  // 3. البحث عن المستوى (أولى متوسط)
  const level = await prisma.level.findFirst({
    where: { name: { contains: 'أولى متوسط' } },
  });

  if (!level) {
    console.error('❌ لم يتم العثور على مستوى أولى متوسط.');
    return;
  }

  // 4. محتوى الدرس
  const lessonContent = `
🔍 تمهيد: ماذا نعني بالتوازي والتعامد؟
<div style="display: flex; justify-content: space-around; margin: 20px 0;"><div style="background-color: #e3f2fd; padding: 20px; border-radius: 15px; text-align: center; width: 45%;"> <div style="font-size: 3em; color: #1976D2;">∥</div> <h3>التوازي</h3> <p>مستقيمان لا يلتقيان أبدًا</p> <p>المسافة بينهما ثابتة</p> <p style="font-size: 1.3em; margin-top: 10px;">(d) // (l)</p> <div style="margin-top: 15px;"> <pre style="background-color: white; padding: 10px; border-radius: 5px;"> (d) ────────────────── (l) ────────────────── </pre> </div> </div><div style="background-color: #ffebee; padding: 20px; border-radius: 15px; text-align: center; width: 45%;"> <div style="font-size: 3em; color: #c2185b;">⟂</div> <h3>التعامد</h3> <p>مستقيمان يتقاطعان</p> <p>يشكلان زاوية قائمة (90°)</p> <p style="font-size: 1.3em; margin-top: 10px;">(d) ⊥ (l)</p> <div style="margin-top: 15px;"> <pre style="background-color: white; padding: 10px; border-radius: 5px;"> (d) ─────┼───── │ │ (l) </pre> </div> </div></div>
📝 المصطلحات والترميزات الأساسية
<div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0;">
المصطلح	معناه	الترميز	مثال
نقطة	موقع محدد في المستوى	حرف كبير	A • ، B × ، M •
مستقيم	خط غير محدود من الجهتين	حرف صغير بين قوسين	(d)، (l)
يشمل	المستقيم يمر بالنقطة	A ∈ (d)	A ∈ (d)
لا يشمل	المستقيم لا يمر بالنقطة	A ∉ (d)	B ∉ (d)
يوازي	مستقيمان متوازيان	(d) // (l)	(d) // (l)
يعامد	مستقيمان متعامدان	(d) ⊥ (l)	(d) ⊥ (l)
يتقاطعان في	نقطة التقاطع	(d) ∩ (l) = {A}	(d) ∩ (l) = {A}
</div>
📐 أولاً: إنشاء مستقيم يشمل نقطة ويوازي مستقيمًا معلومًا
🎯 القاعدة الأساسية:
لإنشاء مستقيم (l) يشمل نقطة A ويوازي مستقيمًا معلومًا (d)، ننقل الزاوية التي يصنعها مستقيم مساعد مع (d) إلى النقطة A باستخدام المدور والمسطرة

✅ الإنشاء بالخطوات:
مثال: أنشئ مستقيمًا (l) يشمل النقطة A ويوازي المستقيم (d)
<div style="background-color: #f6f6f6; padding: 20px; border-radius: 15px; margin: 20px 0;">
المعطيات:
مستقيم (d) مرسوم
نقطة A × خارج المستقيم (d)
<div style="text-align: center; margin: 20px 0;"> <div style="background-color: white; padding: 20px; border-radius: 10px; display: inline-block; font-family: monospace; font-size: 1.2em;"> <pre> × A
(d) ─────────────────────
</pre>
</div>
</div>
الخطوات:
الخطوة	الشرح	الرسم التوضيحي
①	نرسم مستقيمًا مساعدًا (Δ) مارًا بالنقطة A ويقطع (d) في نقطة O •	<div style="background-color: white; padding: 10px; text-align: center; font-family: monospace;"><pre> × A
╲
╲
(d) ──────• O───────(Δ)</pre></div>
②	باستخدام المدور، ننقل قياس الزاوية المحصورة بين (d) و (Δ) عند O إلى النقطة A	
③	نرسم المستقيم (l) مارًا بـ A بحيث يصنع نفس الزاوية مع (Δ)	
النتيجة النهائية:
<div style="text-align: center; margin: 20px 0;"> <div style="background-color: white; padding: 20px; border-radius: 10px; display: inline-block; font-family: monospace; font-size: 1.2em;"> <pre> × A ╲ ╲ (l) ───────────────╲ ╲ (d) ───────────────────── </pre> </div> </div></div><div style="background-color: #d4edda; padding: 15px; border-radius: 10px; margin: 20px 0;">
✍️ الترميز الصحيح:
(l) // (d) (المستقيم (l) يوازي المستقيم (d))
A ∈ (l) (النقطة A تنتمي إلى المستقيم (l))
(l) ∩ (d) = ∅ (المستقيمان لا يتقاطعان)
</div>
📐 ثانيًا: إنشاء مستقيم يشمل نقطة ويعامد مستقيمًا معلومًا
🎯 القاعدة الأساسية:
المستقيمان المتعامدان يحددان زاوية قائمة (90°)

✅ الإنشاء بالخطوات:
الحالة ①: النقطة A • تقع على المستقيم (d)
<div style="background-color: #f6f6f6; padding: 20px; border-radius: 15px; margin: 20px 0;">
المعطيات:
مستقيم (d) مرسوم
نقطة A • تقع على (d)
<div style="text-align: center; margin: 20px 0;"> <div style="background-color: white; padding: 20px; border-radius: 10px; display: inline-block; font-family: monospace; font-size: 1.2em;"> <pre> (d) ─────────────────• A───────────────── </pre> </div> </div>
الخطوات:
الخطوة	الشرح	الرسم التوضيحي
①	نضع سن المدور في A ونرسم قوسين يقطعان (d) في نقطتين B • و C • على يمين ويسار A	<div style="background-color: white; padding: 10px; text-align: center; font-family: monospace;"><pre> • B • A • C
(d) ──┼──┼──┼──</pre></div>
②	نفتح المدور بفتحة أكبر ونرسم قوسين من B و C يتقاطعان فوق (d) في نقطة E •	
③	نصل A مع E فنحصل على المستقيم (l) العمودي	
النتيجة النهائية:
<div style="text-align: center; margin: 20px 0;"> <div style="background-color: white; padding: 20px; border-radius: 10px; display: inline-block; font-family: monospace; font-size: 1.2em;"> <pre> • E │ │ (d) ───────────• A─────────── │ │ • F </pre> </div> </div></div>
الحالة ②: النقطة A × خارج المستقيم (d)
<div style="background-color: #f6f6f6; padding: 20px; border-radius: 15px; margin: 20px 0;">
المعطيات:
مستقيم (d) مرسوم
نقطة A × خارج (d)
<div style="text-align: center; margin: 20px 0;"> <div style="background-color: white; padding: 20px; border-radius: 10px; display: inline-block; font-family: monospace; font-size: 1.2em;"> <pre> × A
(d) ─────────────────────
</pre>
</div>
</div>
الخطوات:
الخطوة	الشرح	الرسم التوضيحي
①	نضع سن المدور في A ونرسم قوسًا يقطع (d) في نقطتين B • و C •	<div style="background-color: white; padding: 10px; text-align: center; font-family: monospace;"><pre> × A
/ <br> / <br>(d) ──────• B───• C──</pre></div>
②	نفتح المدور بفتحة أكبر ونرسم قوسين من B و C يتقاطعان أسفل (d) في نقطة E •	
③	نصل A مع E فنحصل على المستقيم (l) العمودي	
النتيجة النهائية:
<div style="text-align: center; margin: 20px 0;"> <div style="background-color: white; padding: 20px; border-radius: 10px; display: inline-block; font-family: monospace; font-size: 1.2em;"> <pre> × A │ │ (d) ───────────┼─────────── │ │ • E </pre> </div> </div></div><div style="background-color: #d4edda; padding: 15px; border-radius: 10px; margin: 20px 0;">
✍️ الترميز الصحيح:
(l) ⊥ (d) (المستقيم (l) يعامد المستقيم (d))
A ∈ (l) (النقطة A تنتمي إلى المستقيم (l))
(l) ∩ (d) = {H} حيث H • هي نقطة التقاطع (وتسمى المسقط العمودي)
نرمز للزاوية القائمة بـ ∟
</div>
✅ أمثلة تطبيقية محلولة
📌 المثال 1: أكمل بالرمز المناسب
<div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0;"><div style="text-align: center; margin: 20px 0;"> <div style="background-color: white; padding: 20px; border-radius: 10px; display: inline-block; font-family: monospace; font-size: 1.2em;"> <pre> • C
(d) ───────────• A───────────

text
            • B
    </pre>
    <p style="margin-top: 10px;"><strong>(l)</strong> هو المستقيم المار بـ B و C</p>
</div>
</div>
العبارة	الرمز المناسب
A تنتمي إلى (d)	A ⬜ (d)
B لا تنتمي إلى (d)	B ⬜ (d)
(d) و (l) متعامدان	(d) ⬜ (l)
C تنتمي إلى (l)	C ⬜ (l)
الحل:
A ∈ (d)
B ∉ (d)
(d) ⊥ (l)
C ∈ (l)
</div>
📌 المثال 2: أنشئ ثم اكتب
<div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0;">
المعطيات:
مستقيم (d) أفقي
نقطة A × فوق (d) بمسافة 3cm
نقطة B • على (d)
<div style="text-align: center; margin: 20px 0;"> <div style="background-color: white; padding: 20px; border-radius: 10px; display: inline-block; font-family: monospace; font-size: 1.2em;"> <pre> × A
(d) ───────────• B───────────
</pre>
</div>
</div>
الإنشاء:
ننشئ مستقيم (l) يشمل A ويوازي (d)
ننشئ مستقيم (p) يشمل B ويعامد (d)
العلاقات:
(l) // (d)
(p) ⊥ (d)
A ∈ (l)
B ∈ (p) و B ∈ (d)
</div>
📊 جدول ملخص الرموز والمصطلحات
<div style="background-color: #fff3cd; padding: 20px; border-radius: 15px; margin: 30px 0;">
الرمز	القراءة	المعنى
A • أو A ×	النقطة A	حرف كبير للنقاط
(d)	المستقيم d	حرف صغير بين قوسين للمستقيمات
A ∈ (d)	A تنتمي إلى d	النقطة A تقع على المستقيم (d)
A ∉ (d)	A لا تنتمي إلى d	النقطة A لا تقع على المستقيم (d)
(d) // (l)	d يوازي l	المستقيمان (d) و (l) متوازيان
(d) ⊥ (l)	d يعامد l	المستقيمان (d) و (l) متعامدان
(d) ∩ (l) = {A}	تقاطع d و l هو A	المستقيمان يتقاطعان في النقطة A
∅	المجموعة الخالية	لا تقاطع
∟	زاوية قائمة	زاوية قياسها 90°
</div>
  `;

  // حذف الدرس القديم لنفس المعلم إذا وجد لتجنب التكرار
  await prisma.lesson.deleteMany({
    where: {
      title: 'إنشاء مستقيم يشمل نقطة ويوازي مستقيمًا - مستقيم يشمل نقطة ويعامد مستقيمًا + مصطلحات وترميزات',
      authorId: teacher.id
    }
  });

  // 5. إنشاء الدرس
  const lesson = await prisma.lesson.create({
    data: {
      title: 'إنشاء مستقيم يشمل نقطة ويوازي مستقيمًا - مستقيم يشمل نقطة ويعامد مستقيمًا + مصطلحات وترميزات',
      content: lessonContent,
      subjectId: subject.id,
      levelId: level.id,
      authorId: teacher.id,
      type: 'public',
      status: 'approved',
    },
  });

  console.log(`✅ تم إنشاء الدرس: ${lesson.title}`);

  // 6. إنشاء التمارين
  const exercises = [
    // تمارين الدعم (70%)
    { type: 'support_only', question: 'أكمل بالرمز المناسب:\nالمستقيمان المتوازيان: (d) .... (l) ← ⬜\nالمستقيمان المتعامدان: (m) .... (n) ← ⬜\nالنقطة A • تقع على المستقيم (d): A .... (d) ← ⬜\nالنقطة B × لا تقع على المستقيم (l): B .... (l) ← ⬜\nالمستقيم (s) يعامد المستقيم (t): (s) .... (t) ← ⬜\nالمستقيم (p) يوازي المستقيم (q): (p) .... (q) ← ⬜\nتقاطع (d) و (l) هو النقطة M •: (d) ∩ (l) = {....} ← ⬜', modelAnswer: '1. //\n2. ⊥\n3. ∈\n4. ∉\n5. ⊥\n6. //\n7. M' },
    { type: 'support_only', question: 'اكتب العلاقة بالكلمات:\n(AB) // (CD) ← المستقيم (AB) ⬜ المستقيم (CD)\n(EF) ⊥ (GH) ← المستقيم (EF) ⬜ المستقيم (GH)\nM ∈ (AB) ← النقطة M ⬜ المستقيم (AB)\nP ∉ (CD) ← النقطة P ⬜ المستقيم (CD)\n(AB) ∩ (CD) = {O} ← المستقيمان (AB) و (CD) ⬜ في النقطة O', modelAnswer: '1. يوازي\n2. يعامد\n3. تنتمي إلى\n4. لا تنتمي إلى\n5. يتقاطعان' },
    { type: 'support_only', question: 'اختر الإجابة الصحيحة:\n1. المستقيمان المتوازيان ... (لا يلتقيان / يلتقيان في نقطة / يتعامدان)\n2. رمز التعامد هو ... (// / ⊥ / ∈)\n3. إذا كانت A ∈ (d) فهذا يعني ... (A على المستقيم / A خارج المستقيم)\n4. الزاوية القائمة قياسها ... (180° / 90° / 360°)\n5. المستقيم (l) يعامد (d) نكتب ... ((l) // (d) / (l) ⊥ (d))', modelAnswer: '1. لا يلتقيان\n2. ⊥\n3. A على المستقيم\n4. 90°\n5. (l) ⊥ (d)' },
    { type: 'support_only', question: 'لاحظ الشكل ثم أجب:\n(شكل يوضح مستقيم (d) ونقاط A, B, C)\nاكتب مستقيمين متوازيين: ⬜ و ⬜ (ليس في الشكل)\nاكتب مستقيمين متعامدين: (d) ⊥ (AB)\nالنقطة A تنتمي إلى: A ∈ (d) و A ∈ ⬜\nالنقطة C تنتمي إلى: C ∈ ⬜\nالنقطة B لا تنتمي إلى: B ∉ ⬜', modelAnswer: '1. لا يوجد\n2. (d) ⊥ (AB)\n3. (AB)\n4. (AB)\n5. (d)' },
    { type: 'support_only', question: 'أكمل الجملة:\nالمستقيمان (d) و (l) لا يلتقيان أبدًا، إذن هما ⬜\nالمستقيم (m) يعامد المستقيم (n)، إذن الرمز هو: (m) ⬜ (n)\nإذا كانت A نقطة تقع على المستقيم (d)، نكتب: A ⬜ (d)\nالزاوية بين مستقيمين متعامدين قياسها ⬜ درجة\nنقطة تقاطع مستقيمين نرمز لها بالرمز ⬜', modelAnswer: '1. متوازيان\n2. ⊥\n3. ∈\n4. 90\n5. ∩' },
    { type: 'support_only', question: 'صحح الخطأ:\n1. (AB) ⊥ (CD) يعني أن المستقيمين متوازيان\n2. M ∉ (EF) يعني أن M على المستقيم\n3. المستقيمان المتوازيان يلتقيان في نقطة\n4. رمز التوازي هو ⊥\n5. A ∈ (d) يعني أن A خارج المستقيم', modelAnswer: '1. متعامدان\n2. خارج المستقيم\n3. لا يلتقيان\n4. //\n5. على المستقيم' },
    { type: 'support_only', question: 'أنشئ ثم اكتب:\nعلى ورقة بيضاء:\nارسم مستقيمًا أفقيًا (d)\nعين نقطة A × فوق المستقيم\nأنشئ مستقيم (l) يشمل A ويوازي (d)\nعين نقطة B • على المستقيم (d)\nأنشئ مستقيم (m) يشمل B ويعامد (d)\nثم اكتب العلاقات:\n(l) .... (d)\n(m) .... (d)\nA .... (l)\nB .... (m) و B .... (d)', modelAnswer: '(l) // (d) ، (m) ⊥ (d) ، A ∈ (l) ، B ∈ (m) و B ∈ (d)' },
    
    // التمارين الرئيسية (30%)
    { type: 'main', question: 'مسألة إنشاء - مثلث قائم:\nالمعطيات: مثلث ABC قائم الزاوية في B، (AB) ⊥ (BC)، النقطة M منتصف [AC].\nالمطلوب:\n1. ارسم الشكل المطلوب.\n2. أنشئ مستقيم (l) يشمل M ويوازي (AB).\n3. أنشئ مستقيم (p) يشمل M ويعامد (AB).\n4. اكتب العلاقات التالية:\n(l) .... (AB)\n(p) .... (AB)\n(l) .... (BC) (هل هما متوازيان أم متعامدان؟)', modelAnswer: '(l) // (AB) ، (p) ⊥ (AB) ، (l) // (BC)' },
    { type: 'main', question: 'مسألة: مستطيل وأقطاره:\nالمعطيات: مستطيل EFGH حيث (EF) // (GH) و (EH) // (FG)، القطر [EG] والقطر [FH] يتقاطعان في O.\nالمطلوب:\n1. ارسم المستطيل.\n2. أنشئ مستقيم (l) يشمل O ويوازي (EF).\n3. أنشئ مستقيم (m) يشمل O ويعامد (EF).\n4. اكتب جميع علاقات التوازي والتعامد في الشكل.', modelAnswer: 'المتوازيات: (EF)//(GH)، (EH)//(FG)\nالمتعامدات: (EF)⊥(EH)، (EF)⊥(FG)' },
    { type: 'main', question: 'التحدي الكبير - إنشاء متكامل:\nالوضعية: مربع PQRS طول ضلعه 6cm. النقطة I منتصف [PQ]، والنقطة J منتصف [RS].\nالمطلوب:\n1. ارسم المربع.\n2. أنشئ المستقيم (l) يشمل I ويوازي (PS).\n3. أنشئ المستقيم (m) يشمل J ويعامد (QR).\n4. سم نقطة تقاطع (l) و (m) بـ O.\n5. أكمل بكتابة الرموز المناسبة:\n(PQ) .... (RS)\n(PS) .... (PQ)\nI .... (PQ)\n(l) .... (PS)\n(m) .... (QR)\n(l) ∩ (m) {....}', modelAnswer: '(PQ)//(RS)، (PS)⊥(PQ)، I∈(PQ)، (l)//(PS)، (m)⊥(QR)، (l)∩(m)={O}' },
  ];

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

  console.log(`✅ تم إنشاء ${exercises.length} تمرين بنجاح.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });