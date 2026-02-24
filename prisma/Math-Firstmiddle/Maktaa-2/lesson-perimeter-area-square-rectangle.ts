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

  const lessonTitle = "محيط ومساحة المربع والمستطيل";

  // Content with SVGs
  const content = `
🔍 تمهيد: تذكير بالمربع والمستطيل
<div style="display: flex; justify-content: space-around; margin: 30px 0; flex-wrap: wrap; gap: 20px;">
  <div style="background-color: #e3f2fd; padding: 20px; border-radius: 15px; text-align: center; width: 45%; min-width: 300px;">
    <h3 style="color: #1976D2;">المربع</h3>
    <div style="display: flex; justify-content: center; margin: 15px 0;">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <rect x="20" y="20" width="80" height="80" fill="none" stroke="#1976D2" stroke-width="3"/>
        <text x="105" y="60" fill="black" text-anchor="middle">c</text>
        <text x="60" y="15" fill="black" text-anchor="middle">c</text>
        <text x="15" y="60" fill="black" text-anchor="middle">c</text>
        <text x="60" y="115" fill="black" text-anchor="middle">c</text>
        <circle cx="20" cy="20" r="2" fill="red"/>
        <text x="10" y="15" fill="red">A</text>
        <circle cx="100" cy="20" r="2" fill="red"/>
        <text x="105" y="15" fill="red">B</text>
        <circle cx="100" cy="100" r="2" fill="red"/>
        <text x="105" y="115" fill="red">C</text>
        <circle cx="20" cy="100" r="2" fill="red"/>
        <text x="10" y="105" fill="red">D</text>
      </svg>
    </div>
    <p><strong>خصائصه:</strong> أربع أضلاع متساوية، أربع زوايا قائمة</p>
    <p><strong>نكتب:</strong> AB = BC = CD = DA</p>
  </div>
  <div style="background-color: #ffebee; padding: 20px; border-radius: 15px; text-align: center; width: 45%; min-width: 300px;">
    <h3 style="color: #c2185b;">المستطيل</h3>
    <div style="display: flex; justify-content: center; margin: 15px 0;">
      <svg width="140" height="120" viewBox="0 0 140 120">
        <rect x="20" y="20" width="100" height="70" fill="none" stroke="#c2185b" stroke-width="3"/>
        <text x="70" y="15" fill="black" text-anchor="middle">L</text>
        <text x="125" y="60" fill="black" text-anchor="middle">l</text>
        <text x="15" y="60" fill="black" text-anchor="middle">l</text>
        <text x="70" y="105" fill="black" text-anchor="middle">L</text>
        <circle cx="20" cy="20" r="2" fill="red"/>
        <text x="10" y="15" fill="red">A</text>
        <circle cx="120" cy="20" r="2" fill="red"/>
        <text x="125" y="15" fill="red">B</text>
        <circle cx="120" cy="90" r="2" fill="red"/>
        <text x="125" y="95" fill="red">C</text>
        <circle cx="20" cy="90" r="2" fill="red"/>
        <text x="10" y="95" fill="red">D</text>
      </svg>
    </div>
    <p><strong>خصائصه:</strong> كل ضلعان متقابلان متقايسان ومتوازيان، أربع زوايا قائمة</p>
    <p><strong>نكتب:</strong> AB = CD = L, AD = BC = l</p>
  </div>
</div>

📐 أولاً: محيط المربع والمستطيل
<div style="background-color: #f6f6f6; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h3>📝 قانون محيط المربع</h3>
  <p>المربع له 4 أضلاع متساوية، إذن محيطه = مجموع أطوال أضلاعه الأربعة.</p>
  
  <div style="display: flex; align-items: center; justify-content: center; gap: 30px; margin: 20px 0; flex-wrap: wrap;">
    <svg width="100" height="100" viewBox="0 0 100 100">
      <rect x="20" y="20" width="60" height="60" fill="none" stroke="blue" stroke-width="3"/>
      <text x="45" y="15" fill="black" text-anchor="middle">c</text>
    </svg>
    <div style="font-size: 1.5em;">
      <strong>P = c + c + c + c = 4 × c</strong>
    </div>
  </div>
  <table style="width:100%; text-align:right; border-collapse: collapse; margin-top: 10px;">
    <tr style="border-bottom: 1px solid #ccc;"><th>الرمز</th><th>المعنى</th></tr>
    <tr><td>P</td><td>محيط المربع</td></tr>
    <tr><td>c</td><td>طول ضلع المربع</td></tr>
  </table>
</div>

<div style="background-color: #f6f6f6; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h3>📝 قانون محيط المستطيل</h3>
  <p>المستطيل له طول وعرض، والضلعان المتقابلان متساويان في الطول.</p>
  
  <div style="display: flex; align-items: center; justify-content: center; gap: 30px; margin: 20px 0; flex-wrap: wrap;">
    <svg width="120" height="80" viewBox="0 0 120 80">
      <rect x="20" y="20" width="80" height="40" fill="none" stroke="red" stroke-width="3"/>
      <text x="55" y="15" fill="black" text-anchor="middle">L</text>
      <text x="105" y="45" fill="black" text-anchor="middle">l</text>
    </svg>
    <div style="font-size: 1.5em;">
      <strong>P = L + l + L + l = 2 × (L + l)</strong>
    </div>
  </div>
  <table style="width:100%; text-align:right; border-collapse: collapse; margin-top: 10px;">
    <tr style="border-bottom: 1px solid #ccc;"><th>الرمز</th><th>المعنى</th></tr>
    <tr><td>P</td><td>محيط المستطيل</td></tr>
    <tr><td>L</td><td>طول المستطيل</td></tr>
    <tr><td>l</td><td>عرض المستطيل</td></tr>
  </table>
</div>

<div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h3>✅ أمثلة محلولة: حساب المحيط</h3>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
    <div>
      <h4>📌 المثال 1: محيط مربع</h4>
      <svg width="100" height="100" viewBox="0 0 100 100">
        <rect x="20" y="20" width="60" height="60" fill="none" stroke="#1976D2" stroke-width="3"/>
        <text x="45" y="15" fill="black" text-anchor="middle">5cm</text>
      </svg>
      <p><strong>المعطيات:</strong> مربع طول ضلعه c = 5 cm</p>
      <p><strong>الحل:</strong> P = 4 × 5 = 20 cm</p>
      <p><strong>✅ محيط المربع =20cm</strong></p>
    </div>
    <div>
      <h4>📌  (الوحدة هي cm) المثال 2: محيط مستطيل </h4>
      <svg width="140" height="100" viewBox="0 0 140 100">
        <rect x="20" y="20" width="90" height="50" fill="none" stroke="#c2185b" stroke-width="3"/>
        <text x="50" y="15" fill="black" text-anchor="middle">8</text>
        <text x="15" y="50" fill="black" text-anchor="middle">5</text>
      </svg>
      <p><strong>المعطيات:</strong> L = 8 cm, l = 5 cm</p>
      <p><strong>الحل:</strong> P = 2 × (8 + 5) = 2 × 13 = 26 cm</p>
      <p><strong>✅ محيط المستطيل = 26 cm</strong></p>
    </div>
    <div>
      <h4>📌 المثال 3: إيجاد طول الضلع من المحيط (مربع)</h4>
      <svg width="100" height="100" viewBox="0 0 100 100">
        <rect x="20" y="20" width="60" height="60" fill="none" stroke="#1976D2" stroke-width="3"/>
        <text x="105" y="55" fill="black" text-anchor="middle">?</text>
      </svg>
      <p><strong>المعطيات:</strong> محيط مربع P = 24 cm</p>
      <p><strong>الحل:</strong> c = 24 ÷ 4 = 6 cm</p>
      <p><strong>✅ طول ضلع المربع = 6 cm</strong></p>
    </div>
    <div>
      <h4>📌 المثال 4: إيجاد الطول من المحيط (مستطيل)</h4>
      <svg width="140" height="100" viewBox="0 0 140 100">
        <rect x="20" y="20" width="90" height="50" fill="none" stroke="#c2185b" stroke-width="3"/>
        <text x="50" y="15" fill="black" text-anchor="middle">L=?</text>
        <text x="15" y="50" fill="black" text-anchor="middle">l = 4 cm</text>
      </svg>
      <p><strong>المعطيات:</strong> P = 22 cm, l = 4 cm</p>
      <p><strong>الحل:</strong> L + 4 = 22 ÷ 2 = 11 → L = 11 - 4 = 7 cm</p>
      <p><strong>✅ طول المستطيل = 7 cm</strong></p>
    </div>
  </div>
</div>

📐 ثانياً: مساحة المربع والمستطيل
<div style="background-color: #f6f6f6; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h3>📝 قانون مساحة المربع</h3>
  <p>مساحة المربع هي عدد المربعات التي تغطي سطحه. بما أن طوله = عرضه، فإن:</p>
  
  <div style="display: flex; align-items: center; justify-content: center; gap: 30px; margin: 20px 0; flex-wrap: wrap;">
    <svg width="100" height="100" viewBox="0 0 100 100">
      <rect x="20" y="20" width="60" height="60" fill="#b3e5fc" stroke="blue" stroke-width="2"/>
      <text x="45" y="15" fill="black" text-anchor="middle">c</text>
    </svg>
    <div style="font-size: 1.5em;">
      <strong>S = c × c = c²</strong>
    </div>
  </div>
  <table style="width:100%; text-align:right; border-collapse: collapse; margin-top: 10px;">
    <tr style="border-bottom: 1px solid #ccc;"><th>الرمز</th><th>المعنى</th></tr>
    <tr><td>S</td><td>مساحة المربع</td></tr>
    <tr><td>c</td><td>طول ضلع المربع</td></tr>
  </table>
</div>

<div style="background-color: #f6f6f6; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h3>📝 قانون مساحة المستطيل</h3>
  <p>مساحة المستطيل هي عدد المربعات التي تغطي سطحه. وهي جداء الطول في العرض.</p>
  
  <div style="display: flex; align-items: center; justify-content: center; gap: 30px; margin: 20px 0; flex-wrap: wrap;">
    <svg width="120" height="80" viewBox="0 0 120 80">
      <rect x="20" y="20" width="80" height="40" fill="#ffcdd2" stroke="red" stroke-width="2"/>
      <text x="55" y="15" fill="black" text-anchor="middle">L</text>
      <text x="105" y="45" fill="black" text-anchor="middle">l</text>
    </svg>
    <div style="font-size: 1.5em;">
      <strong>S = L × l</strong>
    </div>
  </div>
  <table style="width:100%; text-align:right; border-collapse: collapse; margin-top: 10px;">
    <tr style="border-bottom: 1px solid #ccc;"><th>الرمز</th><th>المعنى</th></tr>
    <tr><td>S</td><td>مساحة المستطيل</td></tr>
    <tr><td>L</td><td>طول المستطيل</td></tr>
    <tr><td>l</td><td>عرض المستطيل</td></tr>
  </table>
  <p>ملاحظة: المساحة تقاس بـ m²، cm²، ...</p>
</div>

<div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h3>✅ أمثلة محلولة: حساب المساحة</h3>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
    <div>
      <h4>📌 المثال 5: مساحة مربع</h4>
      <svg width="100" height="100" viewBox="0 0 100 100">
        <rect x="20" y="20" width="60" height="60" fill="#b3e5fc" stroke="#1976D2" stroke-width="3"/>
        <text x="45" y="15" fill="black" text-anchor="middle">4cm</text>
      </svg>
      <p><strong>المعطيات:</strong> c = 4 cm</p>
      <p><strong>الحل:</strong> S = 4 × 4 = 16 cm²</p>
      <p><strong>✅ مساحة المربع = 16 cm²</strong></p>
    </div>
    <div>
      <h4>📌 المثال 6: مساحة مستطيل</h4>
      <svg width="140" height="100" viewBox="0 0 140 100">
        <rect x="20" y="20" width="90" height="50" fill="#ffcdd2" stroke="#c2185b" stroke-width="3"/>
        <text x="60" y="15" fill="black" text-anchor="middle">L = 7 cm</text>
        <text x="105" y="50" fill="black" text-anchor="middle">l = 3 cm</text>
      </svg>
      <p><strong>المعطيات:</strong> L = 7 cm, l = 3 cm</p>
      <p><strong>الحل:</strong> S = 7 × 3 = 21 cm²</p>
      <p><strong>✅ مساحة المستطيل = 21 cm²</strong></p>
    </div>
    <div>
      <h4>📌 المثال 7: إيجاد طول الضلع من المساحة (مربع)</h4>
      <svg width="100" height="100" viewBox="0 0 100 100">
        <rect x="20" y="20" width="60" height="60" fill="#b3e5fc" stroke="#1976D2" stroke-width="3"/>
        <text x="45" y="15" fill="black" text-anchor="middle">?</text>
      </svg>
      <p><strong>المعطيات:</strong> S = 25 cm²</p>
      <p><strong>الحل:</strong> c = 5 cm (لأن 5 × 5 = 25)</p>
      <p><strong>✅ طول ضلع المربع = 5 cm</strong></p>
    </div>
    <div>
      <h4>📌 المثال 8: إيجاد العرض من المساحة (مستطيل)</h4>
      <svg width="140" height="100" viewBox="0 0 140 100">
        <rect x="20" y="20" width="90" height="50" fill="#ffcdd2" stroke="#c2185b" stroke-width="3"/>
        <text x="55" y="15" fill="black" text-anchor="middle">L = 8 cm</text>
        <text x="110" y="50" fill="black" text-anchor="middle">l=?</text>
      </svg>
      <p><strong>المعطيات:</strong> S = 40 cm², L = 8 cm</p>
      <p><strong>الحل:</strong> l = 40 ÷ 8 = 5 cm</p>
      <p><strong>✅ عرض المستطيل = 5 cm</strong></p>
    </div>
  </div>
</div>

📊 جدول ملخص القوانين
<div style="background-color: #fff3cd; padding: 20px; border-radius: 15px; margin: 30px 0; overflow-x: auto;">
  <table style="width:100%; text-align:right; border-collapse: collapse; min-width: 500px;">
    <tr style="border-bottom: 1px solid #ccc;"><th>الشكل</th><th>المحيط (P)</th><th>المساحة (S)</th></tr>
    <tr><td>المربع</td><td>P = 4 × c</td><td>S = c × c = c²</td></tr>
    <tr><td>المستطيل</td><td>P = 2 × (L + l)</td><td>S = L × l</td></tr>
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
      question: 'أكمل الفراغات:\n1. محيط المربع = ...... × طول الضلع\n2. مساحة المربع = طول الضلع × ......\n3. محيط المستطيل = 2 × (...... + ......)\n4. مساحة المستطيل = ...... × العرض\n5. المحيط يقاس بوحدات ...... مثل cm\n6. المساحة تقاس بوحدات ...... مثل cm²', 
      expectedResults: [
        { question: "1", result: "4" },
        { question: "2", result: "نفسه" },
        { question: "3", result: "الطول، العرض" },
        { question: "4", result: "الطول" },
        { question: "5", result: "طولية" },
        { question: "6", result: "مربعة" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'احسب محيط الأشكال التالية:\n1. مربع c = 3 cm (المحيط = ...)\n2. مربع c = 7 cm (المحيط = ...)\n3. مستطيل L = 5 cm, l = 2 cm (المحيط = ...)\n4. مستطيل L = 8 cm, l = 4 cm (المحيط = ...)\n5. مربع c = 6.5 cm (المحيط = ...)', 
      expectedResults: [
        { question: "1", result: "12" },
        { question: "2", result: "28" },
        { question: "3", result: "14" },
        { question: "4", result: "24" },
        { question: "5", result: "26" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'احسب مساحة الأشكال التالية:\n1. مربع c = 4 cm (المساحة = ...)\n2. مربع c = 9 cm (المساحة = ...)\n3. مستطيل L = 6 cm, l = 3 cm (المساحة = ...)\n4. مستطيل L = 10 cm, l = 5 cm (المساحة = ...)\n5. مربع c = 2.5 cm (المساحة = ...)', 
      expectedResults: [
        { question: "1", result: "16" },
        { question: "2", result: "81" },
        { question: "3", result: "18" },
        { question: "4", result: "50" },
        { question: "5", result: "6.25" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'أوجد الطول المجهول:\n1. مربع P = 20 cm (c = ...)\n2. مربع S = 36 cm² (c = ...)\n3. مستطيل P = 24 cm, l = 5 cm (L = ...)\n4. مستطيل S = 42 cm², L = 7 cm (l = ...)\n5. مستطيل P = 30 cm, L = 9 cm (l = ...)', 
      expectedResults: [
        { question: "1", result: "5" },
        { question: "2", result: "6" },
        { question: "3", result: "7" },
        { question: "4", result: "6" },
        { question: "5", result: "6" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'أكمل الجدول (المربع):\nطول الضلع (cm) | المحيط (cm) | المساحة (cm²)\n3 | 12 | 9\n5 | ⬜ | ⬜\n⬜ | 32 | ⬜\n⬜ | ⬜ | 49\n10 | ⬜ | ⬜', 
      expectedResults: [
        { question: "1", result: "20" },
        { question: "2", result: "25" },
        { question: "3", result: "8" },
        { question: "4", result: "64" },
        { question: "5", result: "7" },
        { question: "6", result: "28" },
        { question: "7", result: "40" },
        { question: "8", result: "100" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'أكمل الجدول (المستطيل):\nالطول L | العرض l | المحيط P | المساحة S\n6 | 4 | ⬜ | ⬜\n8 | 3 | ⬜ | ⬜\n10 | ⬜ | 30 | ⬜\n⬜ | 5 | ⬜ | 40\n12 | 6 | ⬜ | ⬜', 
      expectedResults: [
        { question: "1", result: "20" },
        { question: "2", result: "24" },
        { question: "3", result: "22" },
        { question: "4", result: "24" },
        { question: "5", result: "5" },
        { question: "6", result: "50" },
        { question: "7", result: "8" },
        { question: "8", result: "26" },
        { question: "9", result: "36" },
        { question: "10", result: "72" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'اختر الإجابة الصحيحة:\n1. محيط مربع طول ضلعه 5 cm هو ... (20 cm / 25 cm / 10 cm)\n2. مساحة مربع طول ضلعه 6 cm هي ... (24 cm² / 36 cm² / 12 cm²)\n3. محيط مستطيل طوله 7 cm وعرضه 3 cm هو ... (20 cm / 21 cm / 10 cm)\n4. مساحة مستطيل طوله 8 cm وعرضه 4 cm هي ... (32 cm² / 24 cm² / 12 cm²)\n5. مربع مساحته 25 cm²، طول ضلعه ... (5 cm / 10 cm / 20 cm)', 
      expectedResults: [
        { question: "1", result: "20 cm" },
        { question: "2", result: "36 cm²" },
        { question: "3", result: "20 cm" },
        { question: "4", result: "32 cm²" },
        { question: "5", result: "5 cm" }
      ]
    },
    // تمارين رئيسية (30%)
    { 
      type: 'main', 
      question: 'مسألة: حديقة مستطيلة:\nحديقة مستطيلة الشكل طولها 12 m وعرضها 8 m. يراد وضع سياج حولها وزراعة العشب داخلها.\n\nالمطلوب:\n1. احسب محيط الحديقة (طول السياج).\n2. احسب مساحة الحديقة.\n3. إذا كان ثمن المتر الواحد من السياج 500 DA، احسب تكلفة السياج.\n4. إذا كان ثمن المتر المربع من العشب 300 DA، احسب تكلفة العشب.\n5. احسب التكلفة الكلية.', 
      modelAnswer: '1. المحيط = 40 m\n2. المساحة = 96 m²\n3. تكلفة السياج = 20000 DA\n4. تكلفة العشب = 28800 DA\n5. التكلفة الكلية = 48800 DA' 
    },
    { 
      type: 'main', 
      question: 'مسألة: غرفتان:\nغرفة مستطيلة الشكل طولها 5 m وعرضها 4 m، وغرفة مربعة الشكل طول ضلعها 4.5 m.\n\nالمطلوب:\n1. احسب محيط كل غرفة.\n2. احسب مساحة كل غرفة.\n3. أي الغرفتين أكبر محيطاً؟\n4. أي الغرفتين أكبر مساحة؟\n5. كم تزيد مساحة الغرفة الأكبر عن الأخرى؟', 
      modelAnswer: '1. محيط الأولى = 18 m، محيط الثانية = 18 m\n2. مساحة الأولى = 20 m²، مساحة الثانية = 20.25 m²\n3. المحيطان متساويان\n4. الثانية أكبر مساحة\n5. الفرق = 0.25 m²' 
    },
    { 
      type: 'main', 
      question: 'التحدي الكبير - قطعة أرض:\nقطعة أرض مستطيلة الشكل طولها 20 m وعرضها 15 m. أقيم عليها منزل مربع الشكل طول ضلعه 8 m، وبقي الباقي حديقة.\n\nالمطلوب:\n1. احسب محيط قطعة الأرض كلها.\n2. احسب مساحة قطعة الأرض كلها.\n3. احسب مساحة المنزل.\n4. احسب مساحة الحديقة (الباقي).\n5. إذا أردنا تسييج الحديقة فقط (المنزل لا يسور)، ما هو طول السياج اللازم؟', 
      modelAnswer: '1. محيط الأرض = 70 m\n2. مساحة الأرض = 300 m²\n3. مساحة المنزل = 64 m²\n4. مساحة الحديقة = 236 m²\n5. محيط الحديقة = 70 m' 
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