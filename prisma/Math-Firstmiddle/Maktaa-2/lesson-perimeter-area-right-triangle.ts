import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const teacherEmail = 'Math.teacher.1cem@smartedu.com';
  
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

  const lessonTitle = "محيط ومساحة المثلث القائم";

  // Content with SVGs
  const content = `
🔍 تمهيد: ما هو المثلث القائم؟
<div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0; text-align: center;">
  <p>المثلث القائم هو مثلث يحتوي على زاوية قائمة (قياسها 90 درجة).</p>

  <div style="display: flex; justify-content: center; margin: 30px 0;">
    <svg width="200" height="150" viewBox="0 0 200 150">
      <!-- مثلث قائم الزاوية -->
      <polygon points="50,120 50,30 150,120" fill="none" stroke="#1976D2" stroke-width="3"/>
      <!-- رمز الزاوية القائمة -->
      <path d="M50 120 L65 120 L65 105 L50 105 Z" fill="green"/>
      <!-- التسميات -->
      <circle cx="50" cy="120" r="2" fill="red"/>
      <text x="40" y="125" fill="red">A</text>
      <circle cx="50" cy="30" r="2" fill="red"/>
      <text x="40" y="20" fill="red">B</text>
      <circle cx="150" cy="120" r="2" fill="red"/>
      <text x="165" y="125" fill="red">C</text>
      <!-- الشروحات -->
      <text x="40" y="60" fill="black" font-size="12">ضلع قائم</text>
      <text x="120" y="70" fill="black" font-size="12">الوتر</text>
      <text x="105" y="130" fill="black" font-size="12">ضلع قائم</text>
    </svg>
  </div>
</div>

📝 المصطلحات الأساسية
<div style="background-color: #fff3cd; padding: 20px; border-radius: 15px; margin: 20px 0; overflow-x: auto;">
  <table style="width:100%; text-align:right; border-collapse: collapse; min-width: 500px;">
    <tr style="border-bottom: 1px solid #ccc;"><th>المصطلح</th><th>التعريف</th><th>الرمز</th></tr>
    <tr><td>الزاوية القائمة</td><td>زاوية قياسها 90 درجة</td><td>∟</td></tr>
    <tr><td>ضلعا القائمة</td><td>الضلعان اللذان يحصران الزاوية القائمة</td><td>[AB] و [AC]</td></tr>
    <tr><td>الوتر</td><td>الضلع المقابل للزاوية القائمة (أطول ضلع)</td><td>[BC]</td></tr>
    <tr><td>القاعدة</td><td>أحد ضلعي القائمة</td><td>يمكن أن يكون [AB] أو [AC]</td></tr>
    <tr><td>الارتفاع</td><td>الضلع القائم الآخر</td><td>يمكن أن يكون [AC] أو [AB]</td></tr>
  </table>
  <p style="margin-top: 10px;"><strong>ملاحظة مهمة:</strong> في المثلث القائم، ضلعا القائمة هما اللذان يمثلان القاعدة و الارتفاع عند حساب المساحة. الوتر لا يستخدم في حساب المساحة مباشرة.</p>
</div>

📐 أولاً: محيط المثلث القائم
<div style="background-color: #f6f6f6; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h3>📝 قانون المحيط</h3>
  <p>محيط المثلث القائم هو مجموع أطوال أضلاعه الثلاثة.</p>
  
  <div style="display: flex; align-items: center; justify-content: center; gap: 30px; margin: 20px 0; flex-wrap: wrap;">
    <svg width="150" height="120" viewBox="0 0 150 120">
      <polygon points="30,90 30,30 110,90" fill="none" stroke="blue" stroke-width="3"/>
      
<path d="M30 90 L40 90 L40 80 L30 80 Z" fill="green"/>

      <text x="20" y="60" fill="red">a</text>
      <text x="70" y="105" fill="red">b</text>
      <text x="90" y="60" fill="red">c</text>
    </svg>
    <div style="font-size: 1.5em;">
      <strong>P = a + b + c</strong>
    </div>
  </div>
  <table style="width:100%; text-align:right; border-collapse: collapse; margin-top: 10px;">
    <tr style="border-bottom: 1px solid #ccc;"><th>الرمز</th><th>المعنى</th></tr>
    <tr><td>P</td><td>محيط المثلث القائم</td></tr>
    <tr><td>a</td><td>طول الضلع القائم الأول</td></tr>
    <tr><td>b</td><td>طول الضلع القائم الثاني</td></tr>
    <tr><td>c</td><td>طول الوتر</td></tr>
  </table>
  <p>ملاحظة: المحيط يقاس بوحدات طولية: cm، m، ...</p>
</div>

<div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h3>✅ أمثلة محلولة: حساب المحيط</h3>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
    <div>
      <h4>📌 المثال 1: محيط مثلث قائم معلوم الأضلاع</h4>
      <svg width="120" height="100" viewBox="0 0 120 100">
        <polygon points="30,70 30,20 90,70" fill="none" stroke="#1976D2" stroke-width="3"/>
        
       <path d="M30 70 L40 70 L40 60 L30 60 Z" fill="green"/>
        <text x="15" y="45" fill="black">3cm</text>
        <text x="105" y="105" fill="black">b</text>
        <text x="90" y="50" fill="black">c</text>
      </svg>
      <p><strong>المعطيات:</strong> مثلث قائم أضلاعه: 3 cm، 4 cm، 5 cm</p>
      <p><strong>الحل:</strong> P = 3 + 4 + 5 = 12 cm</p>
      <p><strong>✅ محيط المثلث = 12 cm</strong></p>
    </div>
    <div>
      <h4>📌 المثال 2: محيط مثلث قائم معلوم الأضلاع</h4>
      <svg width="120" height="100" viewBox="0 0 120 100">
        <polygon points="30,70 30,20 90,70" fill="none" stroke="#c2185b" stroke-width="3"/>
        <path d="M30 70 L40 70 L40 60 L30 60 Z" fill="green"/>

        
      </svg>
      <p><strong>المعطيات:</strong> مثلث قائم أضلاعه: 6 cm، 8 cm، 10 cm</p>
      <p><strong>الحل:</strong> P = 6 + 8 + 10 = 24 cm</p>
      <p><strong>✅ محيط المثلث = 24 cm</strong></p>
    </div>
    <div>
      <h4>📌 المثال 3: محيط مثلث قائم معلوم الأضلاع</h4>
      <svg width="120" height="100" viewBox="0 0 120 100">
        <polygon points="30,70 30,20 90,70" fill="none" stroke="#4CAF50" stroke-width="3"/>
        <path d="M30 70 L40 70 L40 60 L30 60 Z" fill="green"/>

        
      </svg>
      <p><strong>المعطيات:</strong> مثلث قائم أضلاعه: 5 cm، 12 cm، 13 cm</p>
      <p><strong>الحل:</strong> P = 5 + 12 + 13 = 30 cm</p>
      <p><strong>✅ محيط المثلث = 30 cm</strong></p>
    </div>
  </div>
</div>

📐 ثانياً: مساحة المثلث القائم
<div style="background-color: #f6f6f6; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h3>📝 قانون المساحة</h3>
  <p>مساحة المثلث القائم تساوي نصف جداء طولي ضلعي القائمة.</p>
  
  <div style="display: flex; align-items: center; justify-content: center; gap: 30px; margin: 20px 0; flex-wrap: wrap;">
    <svg width="150" height="120" viewBox="0 0 150 120">
      <polygon points="30,90 30,30 110,90" fill="#ffcdd2" stroke="red" stroke-width="3"/>
      <path d="M30 90 L40 90 L40 80 L30 80 Z" fill="green"/>


      <text x="20" y="60" fill="black">a</text>
      <text x="60" y="105" fill="black">b</text>
    </svg>
    <div style="font-size: 1.5em;">
      <strong>S = (a × b) ÷ 2</strong>
    </div>
  </div>
  <table style="width:100%; text-align:right; border-collapse: collapse; margin-top: 10px;">
    <tr style="border-bottom: 1px solid #ccc;"><th>الرمز</th><th>المعنى</th></tr>
    <tr><td>S</td><td>مساحة المثلث القائم</td></tr>
    <tr><td>a</td><td>طول الضلع القائم الأول (القاعدة)</td></tr>
    <tr><td>b</td><td>طول الضلع القائم الثاني (الارتفاع)</td></tr>
  </table>
  <p>ملاحظة: المساحة تقاس بوحدات مربعة: cm²، m²، ...</p>
</div>

<div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h3>✅    وحدة الطول cm أمثلة محلولة: حساب المساحة</h3>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
    <div>
      <h4>📌 المثال 4: مساحة مثلث قائم</h4>
      <svg width="120" height="100" viewBox="0 0 120 100">
        <polygon points="30,70 30,20 90,70" fill="#ffcdd2" stroke="#1976D2" stroke-width="3"/>
        <path d="M30 70 L40 70 L40 60 L30 60 Z" fill="green"/>

        <text x="15" y="45" fill="black">3</text>
        <text x="60" y="100" fill="black">4</text>
      </svg>
      <p><strong>المعطيات:</strong> ضلعا القائمة: 3 cm، 4 cm</p>
      <p><strong>الحل:</strong> S = (3 × 4) ÷ 2 = 6 cm²</p>
      <p><strong>✅ مساحة المثلث = 6 cm²</strong></p>
    </div>
    <div>
      <h4>📌 المثال 5: مساحة مثلث قائم</h4>
      <svg width="120" height="100" viewBox="0 0 120 100">
        <polygon points="30,70 30,20 90,70" fill="#ffcdd2" stroke="#c2185b" stroke-width="3"/>
        <path d="M30 70 L40 70 L40 60 L30 60 Z" fill="green"/>

        <text x="15" y="45" fill="black">6</text>
        <text x="60" y="100" fill="black">8</text>
      </svg>
      <p><strong>المعطيات:</strong> ضلعا القائمة: 6 cm، 8 cm</p>
      <p><strong>الحل:</strong> S = (6 × 8) ÷ 2 = 24 cm²</p>
      <p><strong>✅ مساحة المثلث = 24 cm²</strong></p>
    </div>
    <div>
      <h4>📌 المثال 6: مساحة مثلث قائم</h4>
      <svg width="120" height="100" viewBox="0 0 120 100">
        <polygon points="30,70 30,20 90,70" fill="#ffcdd2" stroke="#4CAF50" stroke-width="3"/>
        <path d="M30 70 L40 70 L40 60 L30 60 Z" fill="green"/>

        <text x="15" y="45" fill="black">5</text>
        <text x="60" y="100" fill="black">12</text>
      </svg>
      <p><strong>المعطيات:</strong> ضلعا القائمة: 5 cm، 12 cm</p>
      <p><strong>الحل:</strong> S = (5 × 12) ÷ 2 = 30 cm²</p>
      <p><strong>✅ مساحة المثلث = 30 cm²</strong></p>
    </div>
    <div>
      <h4>📌 المثال 7: مساحة مثلث قائم متساوي الساقين</h4>
      <svg width="120" height="100" viewBox="0 0 120 100">
        <polygon points="30,70 30,20 80,70" fill="#ffcdd2" stroke="#FF9800" stroke-width="3"/>
        <path d="M30 70 L40 70 L40 60 L30 60 Z" fill="green"/>

        <text x="15" y="45" fill="black">7</text>
        <text x="60" y="100" fill="black">7</text>
      </svg>
      <p><strong>المعطيات:</strong> مثلث قائم متساوي الساقين، طول كل ساق = 7 cm</p>
      <p><strong>الحل:</strong> S = (7 × 7) ÷ 2 = 24.5 cm²</p>
      <p><strong>✅ مساحة المثلث = 24.5 cm²</strong></p>
    </div>
  </div>
</div>

📊 جدول ملخص القوانين
<div style="background-color: #e3f2fd; padding: 20px; border-radius: 15px; margin: 30px 0; overflow-x: auto;">
  <table style="width:100%; text-align:right; border-collapse: collapse; min-width: 500px;">
    <tr style="border-bottom: 1px solid #ccc;"><th>المطلوب</th><th>القانون</th><th>مثال</th></tr>
    <tr><td>المحيط</td><td>P = a + b + c</td><td>إذا كانت a=3, b=4, c=5 فإن P=12</td></tr>
    <tr><td>المساحة</td><td>S = (a × b) ÷ 2</td><td>إذا كانت a=3, b=4 فإن S=6</td></tr>
  </table>
  <p><strong>الوحدات:</strong> المحيط: وحدات طولية (cm, m, ...) | المساحة: وحدات مربعة (cm², m², ...)</p>
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
    { 
      type: 'support_with_results', 
      question: 'أكمل الفراغات:\n1. المثلث القائم يحتوي على زاوية قياسها ...... درجة\n2. الضلعان اللذان يحصران الزاوية القائمة يسميان ...... القائمة\n3. الضلع المقابل للزاوية القائمة يسمى ......\n4. محيط المثلث القائم = ...... + ...... + ......\n5. مساحة المثلث القائم = (...... × ......) ÷ 2\n6. المحيط يقاس بوحدات ...... والمساحة تقاس بوحدات ......', 
      expectedResults: [
        { question: "1", result: "90" },
        { question: "2", result: "ضلعا" },
        { question: "3", result: "الوتر" },
        { question: "4", result: "a, b, c" },
        { question: "5", result: "a, b" },
        { question: "6", result: "طولية, مربعة" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'احسب محيط المثلث القائم (اجمع الأضلاع):\n1. a=3, b=4, c=5 (المحيط = ...)\n2. a=6, b=8, c=10 (المحيط = ...)\n3. a=5, b=12, c=13 (المحيط = ...)\n4. a=8, b=15, c=17 (المحيط = ...)\n5. a=9, b=12, c=15 (المحيط = ...)', 
      expectedResults: [
        { question: "1", result: "12" },
        { question: "2", result: "24" },
        { question: "3", result: "30" },
        { question: "4", result: "40" },
        { question: "5", result: "36" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'احسب مساحة المثلث القائم (نصف جداء الضلعين القائمين):\n1. a=3, b=4 (المساحة = ...)\n2. a=5, b=12 (المساحة = ...)\n3. a=6, b=8 (المساحة = ...)\n4. a=7, b=24 (المساحة = ...)\n5. a=9, b=40 (المساحة = ...)', 
      expectedResults: [
        { question: "1", result: "6" },
        { question: "2", result: "30" },
        { question: "3", result: "24" },
        { question: "4", result: "84" },
        { question: "5", result: "180" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'أكمل الجدول (المحيط):\na | b | c | المحيط\n3 | 4 | 5 | 12\n8 | 15 | 17 | ⬜\n⬜ | 12 | 13 | 30\n20 | ⬜ | 29 | 70\n⬜ | ⬜ | 25 | 60', 
      expectedResults: [
        { question: "1", result: "40" },
        { question: "2", result: "5" },
        { question: "3", result: "21" },
        { question: "4", result: "15" },
        { question: "5", result: "20" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'أكمل الجدول (المساحة):\na | b | المساحة\n6 | 8 | 24\n9 | 12 | ⬜\n⬜ | 15 | 60\n14 | ⬜ | 84\n⬜ | ⬜ | 200', 
      expectedResults: [
        { question: "1", result: "54" },
        { question: "2", result: "8" },
        { question: "3", result: "12" },
        { question: "4", result: "20" },
        { question: "5", result: "20" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'أكمل الجدول (المحيط والمساحة):\na | b | c | المحيط | المساحة\n3 | 4 | 5 | 12 | 6\n5 | 12 | 13 | ⬜ | ⬜\n8 | 15 | 17 | ⬜ | ⬜\n7 | 24 | 25 | ⬜ | ⬜\n20 | 21 | 29 | ⬜ | ⬜', 
      expectedResults: [
        { question: "1", result: "30" },
        { question: "2", result: "30" },
        { question: "3", result: "40" },
        { question: "4", result: "60" },
        { question: "5", result: "56" },
        { question: "6", result: "84" },
        { question: "7", result: "70" },
        { question: "8", result: "210" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'اختر الإجابة الصحيحة:\n1. محيط مثلث أضلاعه 3، 4، 5 هو ... (12 cm / 60 cm / 10 cm)\n2. محيط مثلث أضلاعه 6، 8، 10 هو ... (20 cm / 24 cm / 30 cm)\n3. مساحة مثلث قائم ضلعاه 3، 4 هي ... (12 cm² / 6 cm² / 7 cm²)\n4. مساحة مثلث قائم ضلعاه 5، 12 هي ... (60 cm² / 30 cm² / 17 cm²)\n5. محيط مثلث أضلاعه 9، 12، 15 هو ... (36 cm / 27 cm / 45 cm)', 
      expectedResults: [
        { question: "1", result: "12 cm" },
        { question: "2", result: "24 cm" },
        { question: "3", result: "6 cm²" },
        { question: "4", result: "30 cm²" },
        { question: "5", result: "36 cm" }
      ]
    },
    // تمارين رئيسية (30%)
    { 
      type: 'main', 
      question: 'مسألة: قطعة أرض مثلثة:\nقطعة أرض على شكل مثلث قائم الزاوية، طول ضلعي القائمة 30 m و 40 m، وطول الوتر 50 m.\n\nالمطلوب:\n1. احسب محيط قطعة الأرض.\n2. احسب مساحة قطعة الأرض.\n3. إذا كان ثمن المتر الواحد من السياج 500 DA، احسب تكلفة تسييج القطعة.\n4. إذا كان ثمن المتر المربع 2000 DA، احسب ثمن الأرض.', 
      modelAnswer: '1. المحيط = 120 m\n2. المساحة = 600 m²\n3. تكلفة السياج = 60000 DA\n4. ثمن الأرض = 1200000 DA' 
    },
    { 
      type: 'main', 
      question: 'مسألة: حديقة مثلثة:\nحديقة على شكل مثلث قائم الزاوية، ضلعا القائمة 25 m و 60 m، والوتر 65 m.\n\nالمطلوب:\n1. احسب محيط الحديقة.\n2. احسب مساحة الحديقة.\n3. إذا أردنا وضع سياج حول الحديقة، كم متراً من السياج نحتاج؟\n4. إذا أردنا زراعة العشب في الحديقة، كم متراً مربعاً من العشب نحتاج؟', 
      modelAnswer: '1. المحيط = 150 m\n2. المساحة = 750 m²\n3. السياج = 150 m\n4. العشب = 750 m²' 
    },
    { 
      type: 'main', 
      question: 'التحدي الكبير - مقارنة مثلثين:\nلدينا مثلثان قائمان:\n- المثلث A: ضلعا القائمة 9 m و 12 m، والوتر 15 m\n- المثلث B: ضلعا القائمة 8 m و 15 m، والوتر 17 m\n\nالمطلوب:\n1. احسب محيط كل مثلث.\n2. احسب مساحة كل مثلث.\n3. أي المثلثين أكبر محيطاً؟\n4. أي المثلثين أكبر مساحة؟\n5. كم يزيد محيط المثلث الأكبر عن الأصغر؟\n6. كم تزيد مساحة المثلث الأكبر عن الأصغر؟', 
      modelAnswer: '1. محيط A = 36 m، محيط B = 40 m\n2. مساحة A = 54 m²، مساحة B = 60 m²\n3. المثلث B أكبر محيطاً\n4. المثلث B أكبر مساحة\n5. الفرق في المحيط = 4 m\n6. الفرق في المساحة = 6 m²' 
    },
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