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

  const lessonTitle = "الدائرة - تسميات وتعاريف";

  // Content with SVGs
  const content = `
🔍 تمهيد: ماذا نعني بالدائرة؟
<div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0; text-align: center;">
  <p>الدائرة هي مجموعة جميع النقاط التي تبعد نفس المسافة عن نقطة ثابتة تسمى <strong>مركز الدائرة</strong>.</p>
  
  <div style="margin: 20px auto; width: 200px;">
    <svg width="200" height="200" viewBox="0 0 200 200" style="background: white; border-radius: 50%; border: 1px solid #eee;">
      <circle cx="100" cy="100" r="80" stroke="#1976D2" stroke-width="3" fill="none" />
      <circle cx="100" cy="100" r="4" fill="red" />
      <text x="105" y="115" fill="red" font-weight="bold" font-size="14">O</text>
      
      <!-- Point M on circle -->
      <circle cx="180" cy="100" r="4" fill="blue" />
      <text x="195" y="115" fill="blue" font-weight="bold" font-size="14">M</text>
      <line x1="100" y1="100" x2="180" y2="100" stroke="green" stroke-width="2" stroke-dasharray="4" />
      
      <!-- Point N inside -->
      <circle cx="140" cy="140" r="4" fill="green" />
      <text x="155" y="145" fill="green" font-weight="bold" font-size="14">N</text>
    </svg>
  </div>
  <p>نكتب: (C) دائرة مركزها O ونصف قطرها R</p>
</div>

📝 المصطلحات والترميزات الأساسية
<div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0; overflow-x: auto;">
<table style="width:100%; text-align:right; border-collapse: collapse; min-width: 500px;">
<tr style="border-bottom: 1px solid #ccc;"><th>المصطلح</th><th>التعريف</th><th>الترميز</th><th>مثال</th></tr>
<tr><td>المركز</td><td>النقطة الثابتة التي تبعد عنها جميع نقاط الدائرة نفس المسافة</td><td>O •</td><td>مركز الدائرة</td></tr>
<tr><td>نصف القطر</td><td>المسافة بين المركز وأي نقطة على الدائرة</td><td>R أو r</td><td>OM = R</td></tr>
<tr><td>القُطر</td><td>قطعة مستقيمة تمر بالمركز وطرفاها على الدائرة</td><td>[AB]</td><td>AB = 2R</td></tr>
<tr><td>الوتر</td><td>قطعة مستقيمة طرفاها على الدائرة</td><td>[CD]</td><td>CD</td></tr>
<tr><td>القوس</td><td>جزء من الدائرة بين نقطتين</td><td>⌒AB</td><td>قوس AB</td></tr>
</table>
</div>

📐 العناصر الأساسية للدائرة

<div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">

  <!-- Center -->
  <div style="background-color: #f6f6f6; padding: 15px; border-radius: 15px; width: 45%; min-width: 300px; text-align: center;">
    <h3>① المركز (O)</h3>
    <p>نقطة ثابتة داخل الدائرة تبعد عنها جميع نقاط الدائرة نفس المسافة.</p>
    <svg width="150" height="150" viewBox="0 0 150 150" style="margin: 10px auto; background: white; border-radius: 10px;">
      <circle cx="75" cy="75" r="60" stroke="#1976D2" stroke-width="2" fill="none" />
      <circle cx="75" cy="75" r="4" fill="red" />
      <text x="95" y="80" fill="red" font-weight="bold" font-size="16">O</text>
    </svg>
    <p>نرمز للمركز بحرف كبير مثل O</p>
  </div>

  <!-- Radius -->
  <div style="background-color: #f6f6f6; padding: 15px; border-radius: 15px; width: 45%; min-width: 300px; text-align: center;">
    <h3>② نصف القطر (R)</h3>
    <p>المسافة بين المركز وأي نقطة على الدائرة.</p>
    <svg width="150" height="150" viewBox="0 0 150 150" style="margin: 10px auto; background: white; border-radius: 10px;">
      <circle cx="75" cy="75" r="60" stroke="#1976D2" stroke-width="2" fill="none" />
      <circle cx="75" cy="75" r="4" fill="red" />
      <text x="65" y="70" fill="red" font-weight="bold">O</text>
      <line x1="75" y1="75" x2="127" y2="45" stroke="green" stroke-width="3" />
      <circle cx="127" cy="45" r="4" fill="blue" />
      <text x="140" y="40" fill="blue" font-weight="bold">M</text>
      <text x="95" y="55" fill="green" font-weight="bold">r</text>
    </svg>
    <p><strong>OM = r</strong> (جميع أنصاف الأقطار متساوية)</p>
  </div>

  <!-- Diameter -->
  <div style="background-color: #f6f6f6; padding: 15px; border-radius: 15px; width: 45%; min-width: 300px; text-align: center;">
    <h3>③ القُطر [AB]</h3>
    <p>قطعة مستقيمة تمر بالمركز وطرفاها على الدائرة.</p>
    <svg width="150" height="150" viewBox="0 0 150 150" style="margin: 10px auto; background: white; border-radius: 10px;">
      <circle cx="75" cy="75" r="60" stroke="#1976D2" stroke-width="2" fill="none" />
      <circle cx="75" cy="75" r="4" fill="red" />
      <text x="70" y="90" fill="red" font-weight="bold">O</text>
      <line x1="15" y1="75" x2="135" y2="75" stroke="purple" stroke-width="3" />
      <circle cx="15" cy="75" r="4" fill="blue" />
      <text x="15" y="70" fill="blue" font-weight="bold">A</text>
      <circle cx="135" cy="75" r="4" fill="blue" />
      <text x="145" y="70" fill="blue" font-weight="bold">B</text>
    </svg>
    <p><strong>AB = 2 × r</strong> (القطر ضعف نصف القطر)</p>
  </div>

  <!-- Chord -->
  <div style="background-color: #f6f6f6; padding: 15px; border-radius: 15px; width: 45%; min-width: 300px; text-align: center;">
    <h3>④ الوتر [CD]</h3>
    <p>قطعة مستقيمة طرفاها على الدائرة (لا يشترط أن تمر بالمركز).</p>
    <svg width="150" height="150" viewBox="0 0 150 150" style="margin: 10px auto; background: white; border-radius: 10px;">
      <circle cx="75" cy="75" r="60" stroke="#1976D2" stroke-width="2" fill="none" />
      <circle cx="75" cy="75" r="4" fill="red" />
      <text x="80" y="90" fill="red" font-weight="bold">O</text>
      <line x1="30" y1="110" x2="120" y2="110" stroke="orange" stroke-width="3" />
      <circle cx="30" cy="110" r="4" fill="green" />
      <text x="20" y="125" fill="green" font-weight="bold">C</text>
      <circle cx="120" cy="110" r="4" fill="green" />
      <text x="135" y="125" fill="green" font-weight="bold">D</text>
    </svg>
    <p>القطر هو أطول وتر في الدائرة.</p>
  </div>

  <!-- Arc -->
  <div style="background-color: #f6f6f6; padding: 15px; border-radius: 15px; width: 45%; min-width: 300px; text-align: center;">
    <h3>⑤ القوس ⌒AB</h3>
    <p>جزء من الدائرة محصور بين نقطتين.</p>
    <svg width="150" height="150" viewBox="0 0 150 150" style="margin: 10px auto; background: white; border-radius: 10px;">
      <circle cx="75" cy="75" r="60" stroke="#1976D2" stroke-width="1" fill="none" opacity="0.3" />
      <path d="M 135 75 A 60 60 0 0 0 75 15" stroke="orange" stroke-width="4" fill="none" />
      <circle cx="75" cy="75" r="4" fill="red" />
      <text x="70" y="90" fill="red" font-weight="bold">O</text>
      <circle cx="135" cy="75" r="4" fill="blue" />
      <text x="140" y="75" fill="blue" font-weight="bold">B</text>
      <circle cx="75" cy="15" r="4" fill="blue" />
      <text x="70" y="10" fill="blue" font-weight="bold">A</text>
    </svg>
    <p>نرمز للقوس بـ: ⌒AB</p>
  </div>

</div>

✅ أمثلة تطبيقية محلولة
<div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h4>📌 المثال 1: تحديد العناصر</h4>
  <div style="text-align: center;">
    <svg width="200" height="200" viewBox="0 0 200 200" style="background: white; border-radius: 10px; border: 1px solid #ccc;">
      <circle cx="100" cy="100" r="80" stroke="#1976D2" stroke-width="2" fill="none" />
      <circle cx="100" cy="100" r="4" fill="red" />
      <text x="95" y="95" fill="red" font-weight="bold">O</text>
      
      <!-- Diameter AB -->
      <line x1="100" y1="20" x2="100" y2="180" stroke="blue" stroke-width="2" />
      <text x="95" y="15" fill="blue">A</text>
      <text x="95" y="195" fill="blue">B</text>
      
      <!-- Radius OC -->
      <line x1="100" y1="100" x2="180" y2="100" stroke="green" stroke-width="2" />
      <text x="195" y="105" fill="green">C</text>
      
      <!-- Chord DE -->
      <line x1="40" y1="155" x2="160" y2="155" stroke="purple" stroke-width="2" />
      <text x="35" y="160" fill="purple">D</text>
      <text x="175" y="160" fill="purple">E</text>
    </svg>
  </div>
  <p><strong>الحل:</strong></p>
  <ul>
    <li>مركز الدائرة: O</li>
    <li>نصف قطر: [OC] (وأيضاً [OA] و [OB])</li>
    <li>قطر: [AB]</li>
    <li>وتر: [DE]</li>
  </ul>
</div>

📊 جدول ملخص
<div style="background-color: #fff3cd; padding: 20px; border-radius: 15px; margin: 30px 0;">
راجع الجدول في بداية الدرس للملخص الكامل.
<br>
<strong>تذكر:</strong> القطر = 2 × نصف القطر (AB = 2r)
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

  const lesson = await prisma.lesson.create({
    data: {
      title: lessonTitle,
      content: content,
      subject: { connect: { id: subject.id } },
      level: { connect: { id: level.id } },
      author: { connect: { id: teacher.id } },
      type: 'public',
      status: 'approved',
      published: true,
    },
  });

  console.log(`✅ Lesson created successfully with ID: ${lesson.id}`);

  // إضافة التمارين
  const exercises = [
    { type: 'support_with_results', question: 'أكمل الفراغات:\n1. الدائرة هي مجموعة جميع النقاط التي تبعد نفس المسافة عن نقطة ثابتة تسمى ⬜\n2. المسافة بين المركز وأي نقطة على الدائرة تسمى ⬜\n3. القطعة المستقيمة التي تمر بالمركز وطرفاها على الدائرة تسمى ⬜\n4. القطعة المستقيمة التي طرفاها على الدائرة (ولا تمر بالمركز) تسمى ⬜\n5. جزء من الدائرة محصور بين نقطتين يسمى ⬜', expectedResults: [{ question: "1", result: "المركز" }, { question: "2", result: "نصف القطر" }, { question: "3", result: "القطر" }, { question: "4", result: "الوتر" }, { question: "5", result: "القوس" }] },
    { type: 'support_with_results', question: 'اختر الإجابة الصحيحة:\n1. نصف القطر يرمز له بـ ... (R / D / O)\n2. القُطر يساوي ... (R / 2R / R/2)\n3. مركز الدائرة يرمز له بـ ... (حرف كبير / حرف صغير / رقم)\n4. الوتر هو قطعة طرفاها ... (على الدائرة / خارج الدائرة / داخل الدائرة)\n5. أطول وتر في الدائرة هو ... (نصف القطر / القُطر / القوس)', expectedResults: [{ question: "1", result: "R" }, { question: "2", result: "2R" }, { question: "3", result: "حرف كبير" }, { question: "4", result: "على الدائرة" }, { question: "5", result: "القطر" }] },
    { type: 'support_with_results', question: 'أكمل بالكلمة المناسبة (داخل - على - خارج):\nدائرة مركزها O ونصف قطرها R = 6 cm:\n1. نقطة A حيث OA = 4 cm ← النقطة A تكون ⬜ الدائرة\n2. نقطة B حيث OB = 6 cm ← النقطة B تكون ⬜ الدائرة\n3. نقطة C حيث OC = 8 cm ← النقطة C تكون ⬜ الدائرة\n4. نقطة D حيث OD = 5 cm ← النقطة D تكون ⬜ الدائرة\n5. نقطة E حيث OE = 6 cm ← النقطة E تكون ⬜ الدائرة', expectedResults: [{ question: "1", result: "داخل" }, { question: "2", result: "على" }, { question: "3", result: "خارج" }, { question: "4", result: "داخل" }, { question: "5", result: "على" }] },
    { type: 'support_with_results', question: 'أوجد الطول المطلوب:\nدائرة مركزها O ونصف قطرها R = 3 cm:\n1. طول القُطر = ⬜ cm\n2. إذا كانت A نقطة على الدائرة، فإن OA = ⬜ cm\n3. إذا كان [AB] قطراً، فإن AB = ⬜ cm\n4. إذا كانت C نقطة داخل الدائرة، فإن OC < ⬜ cm\n5. إذا كانت D نقطة خارج الدائرة، فإن OD > ⬜ cm', expectedResults: [{ question: "1", result: "6" }, { question: "2", result: "3" }, { question: "3", result: "6" }, { question: "4", result: "3" }, { question: "5", result: "3" }] },
    { type: 'support_with_results', question: 'ارسم ثم أكمل:\nعلى ورقة بيضاء: ارسم دائرة مركزها O ونصف قطرها 4 cm. عين A على الدائرة، B بحيث [AB] قطر، C على الدائرة، D داخل الدائرة، E خارج الدائرة.\n\n1. OA = ⬜ cm\n2. OB = ⬜ cm\n3. AB = ⬜ cm\n4. OD < ⬜ cm\n5. OE > ⬜ cm', expectedResults: [{ question: "1", result: "4" }, { question: "2", result: "4" }, { question: "3", result: "8" }, { question: "4", result: "4" }, { question: "5", result: "4" }] },
    { type: 'support_with_results', question: 'صحح الخطأ (اكتب "صحيح" أو التصحيح):\n1. نصف القطر هو قطعة تمر بالمركز\n2. القُطر هو المسافة من المركز للدائرة\n3. جميع الأوتار في الدائرة متساوية\n4. القطر هو أقصر وتر في الدائرة\n5. مركز الدائرة يرمز له بحرف صغير', expectedResults: [{ question: "1", result: "المسافة من المركز للدائرة" }, { question: "2", result: "قطعة تمر بالمركز" }, { question: "3", result: "خطأ" }, { question: "4", result: "أطول وتر" }, { question: "5", result: "حرف كبير" }] },
    { type: 'support_with_results', question: 'لاحظ الشكل (دائرة مركزها O، نقاط A,B,C,D على الدائرة، E خارجها) ثم أجب:\n1. مركز الدائرة هو: ⬜\n2. أنصاف الأقطار: [OA]، [OB]، [⬜]، [OD]\n3. قطر في الدائرة: [⬜]\n4. أوتار في الدائرة: [CD]، [⬜]\n5. النقطة E تقع ⬜ الدائرة', expectedResults: [{ question: "1", result: "O" }, { question: "2", result: "OC" }, { question: "3", result: "AB" }, { question: "4", result: "CE" }, { question: "5", result: "خارج" }] },
    { type: 'main', question: 'مسألة إنشاء دائرة:\nالمعطيات: قطعة مستقيمة [AB] طولها 8 cm، O منتصف [AB].\nالمطلوب:\n1. باستخدام المدور والمسطرة، أنشئ دائرة مركزها O ونصف قطرها OA.\n2. ما هو طول OA؟\n3. ما هو طول OB؟\n4. هل [AB] قطر في هذه الدائرة؟\n5. عين نقطة C على الدائرة مختلفة عن A و B. أوجد طول OC.', modelAnswer: '1. الرسم\n2. OA = 4 cm\n3. OB = 4 cm\n4. نعم\n5. OC = 4 cm' },
    { type: 'main', question: 'مسألة: مثلث داخل دائرة:\nالمعطيات: دائرة مركزها O ونصف قطرها R = 5 cm، [AB] قطر في الدائرة، C نقطة على الدائرة.\nالمطلوب:\n1. ما هو طول AB؟\n2. ما هو طول OC؟\n3. ما هو طول OA؟\n4. إذا كانت M نقطة داخل الدائرة، ماذا يمكننا أن نقول عن OM؟\n5. إذا كانت N نقطة خارج الدائرة، ماذا يمكننا أن نقول عن ON؟', modelAnswer: '1. AB = 10 cm\n2. OC = 5 cm\n3. OA = 5 cm\n4. OM < 5 cm\n5. ON > 5 cm' },
    { type: 'main', question: 'التحدي الكبير - إنشاء متكامل:\nالوضعية: ارسم دائرة مركزها O ونصف قطرها 4 cm. عين النقاط: A و B على الدائرة بحيث [AB] قطر، C على الدائرة، D داخل الدائرة (2 cm عن O)، E خارج الدائرة (5 cm عن O).\n\nأكمل الجدول:\nالقطعة | الطول\nOA | ⬜\nOB | ⬜\nOC | ⬜\nAB | ⬜\nOD | ⬜\nOE | ⬜\n\nموقع النقاط (داخل/على/خارج):\nA: ⬜, B: ⬜, C: ⬜, D: ⬜, E: ⬜', modelAnswer: 'الأطوال: 4, 4, 4, 8, 2, 5\nالمواقع: على, على, على, داخل, خارج' },
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