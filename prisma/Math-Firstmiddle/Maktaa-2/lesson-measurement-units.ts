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

  const lessonTitle = "وحدات القياس (الأطوال - المساحات - الأوزان)";

  // Content with SVGs
  const content = `
🔍 تمهيد: لماذا نحتاج وحدات القياس؟
<div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0; text-align: center;">
  <p>وحدات القياس هي أدوات موحدة نستخدمها لتحديد مقدار الأشياء من حولنا.</p>

  <div style="display: flex; justify-content: space-around; margin: 30px 0; flex-wrap: wrap; gap: 20px;">
    <div style="text-align: center; background-color: white; padding: 15px; border-radius: 10px; width: 30%; min-width: 200px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
      <div style="font-size: 3em;">📏</div>
      <h3>الأطوال</h3>
      <p>نقيس بها المسافات والأبعاد</p>
    </div>
    <div style="text-align: center; background-color: white; padding: 15px; border-radius: 10px; width: 30%; min-width: 200px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
      <div style="font-size: 3em;">🟦</div>
      <h3>المساحات</h3>
      <p>نقيس بها السطوح والأراضي</p>
    </div>
    <div style="text-align: center; background-color: white; padding: 15px; border-radius: 10px; width: 30%; min-width: 200px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
      <div style="font-size: 3em;">⚖️</div>
      <h3>الأوزان</h3>
      <p>نقيس بها الكتلة والثقل</p>
    </div>
  </div>
</div>

📐 أولاً: وحدات قياس الأطوال
<div style="background-color: #e3f2fd; padding: 20px; border-radius: 15px; margin: 20px 0; overflow-x: auto;">
  <h3>📝 جدول وحدات الأطوال</h3>
  <table style="width:100%; text-align:right; border-collapse: collapse; min-width: 500px;">
    <tr style="border-bottom: 1px solid #ccc;"><th>الوحدة</th><th>الرمز</th><th>القيمة بالمتر</th><th>مثال</th></tr>
    <tr><td>الكيلومتر</td><td>km</td><td>1000 m</td><td>المسافة بين المدن</td></tr>
    <tr><td>الهكتومتر</td><td>hm</td><td>100 m</td><td>المسافة بين الأحياء</td></tr>
    <tr><td>الديكامتر</td><td>dam</td><td>10 m</td><td>طول حقل صغير</td></tr>
    <tr><td>المتر</td><td>m</td><td>1 m</td><td>طول غرفة، ارتفاع باب</td></tr>
    <tr><td>الديسيمتر</td><td>dm</td><td>0.1 m</td><td>عرض كتاب، طول مسطرة</td></tr>
    <tr><td>السنتيمتر</td><td>cm</td><td>0.01 m</td><td>طول قلم، عرض إصبع</td></tr>
    <tr><td>المليمتر</td><td>mm</td><td>0.001 m</td><td>سمك ورقة، طول حبة أرز</td></tr>
  </table>
</div>

<div style="background-color: #fff3cd; padding: 20px; border-radius: 15px; margin: 20px 0; text-align: center;">
  <h3>📊 جدول التحويل بين وحدات الأطوال</h3>
  <p>للتذكير: كل وحدة أكبر بـ 10 مرات من التي تليها</p>
  
  <div style="display: flex; justify-content: center; margin: 20px 0; overflow-x: auto;">
    <svg width="600" height="100" viewBox="0 0 600 100">
      <!-- Arrows -->
      <defs>
        <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="blue" />
        </marker>
        <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="red" />
        </marker>
      </defs>
      
      <line x1="50" y1="30" x2="550" y2="30" stroke="blue" stroke-width="2" marker-end="url(#arrowhead-blue)" />
      <text x="300" y="20" fill="blue" font-size="14" text-anchor="middle">×10 (للتحويل إلى الأصغر)</text>
      
      <line x1="550" y1="80" x2="50" y2="80" stroke="red" stroke-width="2" marker-end="url(#arrowhead-red)" />
      <text x="300" y="95" fill="red" font-size="14" text-anchor="middle">÷10 (للتحويل إلى الأكبر)</text>
      
      <!-- Units -->
      <text x="50" y="60" fill="black" font-weight="bold" text-anchor="middle">km</text>
      <text x="130" y="60" fill="black" font-weight="bold" text-anchor="middle">hm</text>
      <text x="210" y="60" fill="black" font-weight="bold" text-anchor="middle">dam</text>
      <text x="290" y="60" fill="black" font-weight="bold" text-anchor="middle">m</text>
      <text x="370" y="60" fill="black" font-weight="bold" text-anchor="middle">dm</text>
      <text x="450" y="60" fill="black" font-weight="bold" text-anchor="middle">cm</text>
      <text x="530" y="60" fill="black" font-weight="bold" text-anchor="middle">mm</text>
    </svg>
  </div>
</div>

<div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h3>✅ أمثلة محلولة: تحويل الأطوال</h3>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
    <div>
      <h4>📌 تحويل من متر إلى أجزائه</h4>
      <ul>
        <li>5 m = 5 × 100 = 500 cm</li>
        <li>3 m = 3 × 1000 = 3000 mm</li>
        <li>7 m = 7 × 10 = 70 dm</li>
      </ul>
    </div>
    <div>
      <h4>📌 تحويل من أجزاء المتر إلى متر</h4>
      <ul>
        <li>200 cm = 200 ÷ 100 = 2 m</li>
        <li>5000 mm = 5000 ÷ 1000 = 5 m</li>
        <li>30 dm = 30 ÷ 10 = 3 m</li>
      </ul>
    </div>
    <div>
      <h4>📌 تحويل بين وحدات كبيرة</h4>
      <ul>
        <li>3 km = 3 × 1000 = 3000 m</li>
        <li>5 km = 5 × 100 = 500 dam</li>
        <li>1200 m = 1200 ÷ 1000 = 1.2 km</li>
      </ul>
    </div>
  </div>
</div>

📐 ثانياً: وحدات قياس المساحات
<div style="background-color: #ffebee; padding: 20px; border-radius: 15px; margin: 20px 0; overflow-x: auto;">
  <h3>📝 جدول وحدات المساحات</h3>
  <table style="width:100%; text-align:right; border-collapse: collapse; min-width: 500px;">
    <tr style="border-bottom: 1px solid #ccc;"><th>الوحدة</th><th>الرمز</th><th>القيمة بالمتر المربع</th><th>مثال</th></tr>
    <tr><td>الكيلومتر المربع</td><td>km²</td><td>1,000,000 m²</td><td>مساحة مدينة</td></tr>
    <tr><td>الهكتومتر المربع</td><td>hm²</td><td>10,000 m²</td><td>مساحة حقل كبير</td></tr>
    <tr><td>الديكامتر المربع</td><td>dam²</td><td>100 m²</td><td>مساحة حديقة</td></tr>
    <tr><td>المتر المربع</td><td>m²</td><td>1 m²</td><td>مساحة غرفة صغيرة</td></tr>
    <tr><td>الديسيمتر المربع</td><td>dm²</td><td>0.01 m²</td><td>مساحة كتاب</td></tr>
    <tr><td>السنتيمتر المربع</td><td>cm²</td><td>0.0001 m²</td><td>مساحة طابع</td></tr>
    <tr><td>المليمتر المربع</td><td>mm²</td><td>0.000001 m²</td><td>مساحة رأس دبوس</td></tr>
  </table>
</div>

<div style="background-color: #e8f5e9; padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h3>🌟 وحدات خاصة لقياس الأراضي: الآر والهكتار</h3>
  <div style="display: flex; justify-content: center; gap: 50px; margin: 20px 0; flex-wrap: wrap;">
    <div style="text-align: center;">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <rect x="10" y="10" width="100" height="100" fill="#b3e5fc" stroke="blue" stroke-width="2"/>
        <text x="60" y="60" fill="black" text-anchor="middle" font-weight="bold">1 a</text>
        <text x="60" y="80" fill="black" text-anchor="middle" font-size="10">(100 m²)</text>
        <text x="60" y="115" fill="black" text-anchor="middle" font-size="10">10 m</text>
        <text x="5" y="60" fill="black" text-anchor="middle" font-size="10" transform="rotate(-90 5,60)">10 m</text>
      </svg>
      <p><strong>الآر (a)</strong></p>
    </div>
    <div style="text-align: center;">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <rect x="10" y="10" width="100" height="100" fill="#c8e6c9" stroke="green" stroke-width="2"/>
        <text x="60" y="60" fill="black" text-anchor="middle" font-weight="bold">1 ha</text>
        <text x="60" y="80" fill="black" text-anchor="middle" font-size="10">(10,000 m²)</text>
        <text x="60" y="115" fill="black" text-anchor="middle" font-size="10">100 m</text>
        <text x="5" y="60" fill="black" text-anchor="middle" font-size="10" transform="rotate(-90 5,60)">100 m</text>
      </svg>
      <p><strong>الهكتار (ha)</strong></p>
    </div>
  </div>
  <ul>
    <li>1 ha = 100 a</li>
    <li>1 ha = 10,000 m²</li>
    <li>1 a = 100 m²</li>
  </ul>
</div>

<div style="background-color: #fff3cd; padding: 20px; border-radius: 15px; margin: 20px 0; text-align: center;">
  <h3>📊 جدول التحويل بين وحدات المساحات</h3>
  <p>للتذكير: كل وحدة أكبر بـ 100 مرة من التي تليها</p>
  <div style="display: flex; justify-content: center; margin: 20px 0; overflow-x: auto;">
    <svg width="600" height="100" viewBox="0 0 600 100">
      <line x1="50" y1="30" x2="550" y2="30" stroke="blue" stroke-width="2" marker-end="url(#arrowhead-blue)" />
      <text x="300" y="20" fill="blue" font-size="14" text-anchor="middle">×100</text>
      
      <line x1="550" y1="80" x2="50" y2="80" stroke="red" stroke-width="2" marker-end="url(#arrowhead-red)" />
      <text x="300" y="95" fill="red" font-size="14" text-anchor="middle">÷100</text>
      
      <text x="50" y="60" fill="black" font-weight="bold" text-anchor="middle">km²</text>
      <text x="130" y="60" fill="black" font-weight="bold" text-anchor="middle">hm²</text>
      <text x="210" y="60" fill="black" font-weight="bold" text-anchor="middle">dam²</text>
      <text x="290" y="60" fill="black" font-weight="bold" text-anchor="middle">m²</text>
      <text x="370" y="60" fill="black" font-weight="bold" text-anchor="middle">dm²</text>
      <text x="450" y="60" fill="black" font-weight="bold" text-anchor="middle">cm²</text>
      <text x="530" y="60" fill="black" font-weight="bold" text-anchor="middle">mm²</text>
    </svg>
  </div>
</div>

📐 ثالثاً: وحدات قياس الأوزان (الكتلة)
<div style="background-color: #f3e5f5; padding: 20px; border-radius: 15px; margin: 20px 0; overflow-x: auto;">
  <h3>📝 جدول وحدات الأوزان</h3>
  <table style="width:100%; text-align:right; border-collapse: collapse; min-width: 500px;">
    <tr style="border-bottom: 1px solid #ccc;"><th>الوحدة</th><th>الرمز</th><th>القيمة بالكيلوغرام</th><th>مثال</th></tr>
    <tr><td>الطن</td><td>t</td><td>1000 kg</td><td>وزن سيارة</td></tr>
    <tr><td>القنطار</td><td>q</td><td>100 kg</td><td>كيس حبوب كبير</td></tr>
    <tr><td>الكيلوغرام</td><td>kg</td><td>1 kg</td><td>كيس سكر</td></tr>
    <tr><td>الغرام</td><td>g</td><td>0.001 kg</td><td>قطعة شوكولاتة</td></tr>
    <tr><td>المليغرام</td><td>mg</td><td>0.000001 kg</td><td>حبة رمل</td></tr>
  </table>
</div>

<div style="background-color: #e3f2fd; padding: 20px; border-radius: 15px; margin: 20px 0; text-align: center;">
  <h3>📊 جدول التحويل بين وحدات الأوزان</h3>
  <p>للتذكير: كل وحدة أكبر بـ 10 مرات من التي تليها</p>
  <div style="display: flex; justify-content: center; margin: 20px 0; overflow-x: auto;">
    <svg width="600" height="100" viewBox="0 0 600 100">
      <line x1="50" y1="30" x2="550" y2="30" stroke="blue" stroke-width="2" marker-end="url(#arrowhead-blue)" />
      <text x="300" y="20" fill="blue" font-size="14" text-anchor="middle">×10</text>
      
      <line x1="550" y1="80" x2="50" y2="80" stroke="red" stroke-width="2" marker-end="url(#arrowhead-red)" />
      <text x="300" y="95" fill="red" font-size="14" text-anchor="middle">÷10</text>
      
      <text x="50" y="60" fill="black" font-weight="bold" text-anchor="middle">t</text>
      <text x="110" y="60" fill="black" font-weight="bold" text-anchor="middle">q</text>
      <text x="170" y="60" fill="black" font-weight="bold" text-anchor="middle">.</text>
      <text x="230" y="60" fill="black" font-weight="bold" text-anchor="middle">kg</text>
      <text x="290" y="60" fill="black" font-weight="bold" text-anchor="middle">hg</text>
      <text x="350" y="60" fill="black" font-weight="bold" text-anchor="middle">dag</text>
      <text x="410" y="60" fill="black" font-weight="bold" text-anchor="middle">g</text>
      <text x="470" y="60" fill="black" font-weight="bold" text-anchor="middle">dg</text>
      <text x="530" y="60" fill="black" font-weight="bold" text-anchor="middle">cg</text>
    </svg>
  </div>
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

  // إضافة التمارين (70% دعم + نتائج، 30% رئيسي)
  const exercises = [
    { 
      type: 'support_with_results', 
      question: 'أكمل الفراغات بالقيم الصحيحة:\n1. 1 km = .... m\n2. 1 m = .... cm\n3. 1 km² = .... m²\n4. 1 ha = .... m²\n5. 1 a = .... m²\n6. 1 t = .... kg\n7. 1 q = .... kg\n8. 1 kg = .... g', 
      expectedResults: [
        { question: "1", result: "1000" },
        { question: "2", result: "100" },
        { question: "3", result: "1000000" },
        { question: "4", result: "10000" },
        { question: "5", result: "100" },
        { question: "6", result: "1000" },
        { question: "7", result: "100" },
        { question: "8", result: "1000" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'حول إلى الوحدة المطلوبة:\n1. 5 m = .... cm\n2. 3 km = .... m\n3. 4 m² = .... cm²\n4. 2 ha = .... m²\n5. 3 t = .... kg\n6. 5 kg = .... g\n7. 4 q = .... kg', 
      expectedResults: [
        { question: "1", result: "500" },
        { question: "2", result: "3000" },
        { question: "3", result: "40000" },
        { question: "4", result: "20000" },
        { question: "5", result: "3000" },
        { question: "6", result: "5000" },
        { question: "7", result: "400" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'حول إلى الوحدة المطلوبة (القسمة):\n1. 200 cm = .... m\n2. 5000 m = .... km\n3. 30000 cm² = .... m²\n4. 50000 m² = .... ha\n5. 2000 kg = .... t\n6. 800 kg = .... q\n7. 3000 g = .... kg', 
      expectedResults: [
        { question: "1", result: "2" },
        { question: "2", result: "5" },
        { question: "3", result: "3" },
        { question: "4", result: "5" },
        { question: "5", result: "2" },
        { question: "6", result: "8" },
        { question: "7", result: "3" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'أكمل جدول الأطوال:\nkm | hm | dam | m | dm | cm | mm\n2 | 20 | 200 | ⬜ | ⬜ | ⬜ | ⬜\n⬜ | ⬜ | ⬜ | 5 | 50 | 500 | 5000', 
      expectedResults: [
        { question: "1", result: "2000" },
        { question: "2", result: "20000" },
        { question: "3", result: "200000" },
        { question: "4", result: "2000000" },
        { question: "5", result: "0.005" },
        { question: "6", result: "0.05" },
        { question: "7", result: "0.5" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'أكمل جدول المساحات:\nkm² | hm² | dam² | m² | a | ha\n1 | 100 | 10000 | ⬜ | ⬜ | ⬜\n⬜ | ⬜ | ⬜ | 50000 | ⬜ | ⬜', 
      expectedResults: [
        { question: "1", result: "1000000" },
        { question: "2", result: "10000" },
        { question: "3", result: "100" },
        { question: "4", result: "0.05" },
        { question: "5", result: "500" },
        { question: "6", result: "5" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'أكمل جدول الأوزان:\nt | q | kg | hg | dag | g\n2 | 20 | ⬜ | ⬜ | ⬜ | ⬜\n⬜ | ⬜ | 500 | ⬜ | ⬜ | ⬜', 
      expectedResults: [
        { question: "1", result: "2000" },
        { question: "2", result: "20000" },
        { question: "3", result: "200000" },
        { question: "4", result: "2000000" },
        { question: "5", result: "0.5" },
        { question: "6", result: "5" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'اختر الإجابة الصحيحة:\n1. 1 km = .... m (100 / 1000 / 10000)\n2. 1 m² = .... cm² (100 / 1000 / 10000)\n3. 1 ha = .... m² (100 / 1000 / 10000)\n4. 1 t = .... kg (100 / 1000 / 10000)\n5. 1 q = .... kg (10 / 100 / 1000)', 
      expectedResults: [
        { question: "1", result: "1000" },
        { question: "2", result: "10000" },
        { question: "3", result: "10000" },
        { question: "4", result: "1000" },
        { question: "5", result: "100" }
      ]
    },
    // تمارين رئيسية (30%)
    { 
      type: 'main', 
      question: 'مسألة: قطعة أرض زراعية:\nفلاح يملك قطعة أرض زراعية مساحتها 3 هكتارات. زرع نصفها قمحاً والباقي شعيراً.\n\nالمطلوب:\n1. حول مساحة الأرض إلى المتر المربع.\n2. حول مساحة الأرض إلى الآر.\n3. ما مساحة الجزء المزروع قمحاً بالمتر المربع؟\n4. ما مساحة الجزء المزروع شعيراً بالآر؟', 
      modelAnswer: '1. 3 ha = 30000 m²\n2. 3 ha = 300 a\n3. مساحة القمح = 15000 m²\n4. مساحة الشعير = 150 a' 
    },
    { 
      type: 'main', 
      question: 'مسألة: حمولة شاحنة:\nشاحنة تحمل 5 أطنان من القمح. تم تفريغ 30 قنطاراً في مستودع، والباقي في مستودع آخر.\n\nالمطلوب:\n1. حول حمولة الشاحنة إلى الكيلوغرام.\n2. حول حمولة الشاحنة إلى القنطار.\n3. كم كيلوغراماً تم تفريغه في المستودع الأول؟\n4. كم قنطاراً بقي في الشاحنة بعد التفريغ الأول؟', 
      modelAnswer: '1. 5 t = 5000 kg\n2. 5 t = 50 q\n3. 30 q = 3000 kg\n4. الباقي = 50 - 30 = 20 q' 
    },
    { 
      type: 'main', 
      question: 'التحدي الكبير - رحلة بين الوحدات:\nمدينتان A و B المسافة بينهما 25 km. يوجد بينهما حقل مستطيل طوله 300 m وعرضه 200 m. تنتج هذه الأرض 3 q من القمح لكل آر.\n\nالمطلوب:\n1. حول المسافة بين المدينتين إلى المتر.\n2. احسب مساحة الحقل بالمتر المربع.\n3. حول مساحة الحقل إلى الآر.\n4. احسب كمية القمح المنتجة بالكيلوغرام.\n5. حول كمية القمح إلى الأطنان.', 
      modelAnswer: '1. 25000 m\n2. 60000 m²\n3. 600 a\n4. 180000 kg (600 * 3 * 100)\n5. 180 t' 
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