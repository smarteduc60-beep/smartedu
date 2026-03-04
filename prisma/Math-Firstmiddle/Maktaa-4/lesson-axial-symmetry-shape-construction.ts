import 'dotenv/config';
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

  const lessonTitle = "استعمال التناظر المحوري لإنشاء مثلث متساوي الساقين، مستطيل، مربع، معين";

  const content = `
<div dir="rtl">
  <div style="background-color: #f0f9ff; padding: 25px; border-radius: 15px; margin: 20px 0;">
    <h3>🏠 مشكلة: تصميم قصر الحمامات</h3>
    <p>ياسين فنان مختص في تصميم الزليج التقليدي الجزائري. كلف بتصميم نقشة لقصر الحمامات بالبليدة تتكون من أشكال هندسية متناظرة: مثلثات متساوية الساقين، مستطيلات، مربعات، ومعينات.</p>
    <div style="display: flex; justify-content: center; gap: 30px; margin: 30px 0; flex-wrap: wrap;">
      <div style="text-align: center; background-color: white; padding: 15px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"><svg width="120" height="120" viewBox="0 0 120 120"><polygon points="60,30 90,80 30,80" fill="#b33b3b" stroke="black" stroke-width="2"/><text x="45" y="100" fill="black">مثلث</text></svg></div>
      <div style="text-align: center; background-color: white; padding: 15px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"><svg width="120" height="120" viewBox="0 0 120 120"><rect x="20" y="40" width="80" height="50" fill="#2a9d8f" stroke="black" stroke-width="2"/><text x="45" y="110" fill="black">مستطيل</text></svg></div>
      <div style="text-align: center; background-color: white; padding: 15px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"><svg width="120" height="120" viewBox="0 0 120 120"><rect x="30" y="30" width="60" height="60" fill="#e9c46a" stroke="black" stroke-width="2"/><text x="45" y="110" fill="black">مربع</text></svg></div>
      <div style="text-align: center; background-color: white; padding: 15px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"><svg width="120" height="120" viewBox="0 0 120 120"><polygon points="60,30 90,60 60,90 30,60" fill="#9c89b8" stroke="black" stroke-width="2"/><text x="45" y="110" fill="black">معين</text></svg></div>
    </div>
    <p><strong>🔍 الملاحظة:</strong> لاحظ ياسين أنه يستطيع رسم نصف الشكل فقط ثم يستعمل محور التناظر للحصول على النصف الآخر. كيف يمكنه ذلك؟</p>
  </div>
  <div style="background-color: #fff9e6; padding: 25px; border-radius: 15px; margin: 20px 0;" dir="rtl">
    <h3>🧪 نشاط استكشافي: نكتشف معًا!</h3>
    <p><strong>📌 النشاط 1: إنشاء مثلث متساوي الساقين</strong></p>
    <p>خذ ورقة شفافة وارسم محورًا (d). ضع نقطة A على المحور ثم نقطة B على يسار المحور.</p>
    <div style="display: flex; justify-content: space-around; margin: 30px 0; flex-wrap: wrap;">
      <div style="text-align: center;">
      <svg width="150" height="120" viewBox="0 0 150 120">
      <line x1="75" y1="10" x2="75" y2="120" stroke="red" stroke-width="3" stroke-dasharray="5"/>
      <text x="70" y="10" fill="red">(d)</text>
      <circle cx="75" cy="40" r="4" fill="blue"/>
      <text x="90" y="35" fill="blue">A</text>
      <circle cx="40" cy="70" r="4" fill="blue"/>
      <text x="30" y="65" fill="blue">B</text>
      </svg><p>① نضع النقاط</p>
      </div>
      <div style="text-align: center;">
      <svg width="150" height="120" viewBox="0 0 150 120">
        <line x1="75" y1="10" x2="75" y2="120" stroke="red" stroke-width="3" stroke-dasharray="5"/>
        <text x="70" y="10" fill="red">(d)</text>
        <circle cx="75" cy="40" r="4" fill="blue"/>
        <circle cx="40" cy="70" r="4" fill="blue"/>
        <circle cx="110" cy="70" r="4" fill="green"/>
        <text x="115" y="65" fill="green">B'</text>
        <polygon points="75,40 40,70 110,70" fill="none" stroke="purple" stroke-width="3"/>
      </svg>
      <p">② نظيرة B → B' نحصل على مثلث ABB'</p></div>
    </div>
    <p><strong>❓ أسئلة موجهة:</strong></p>
    <ul>
      <li>قارن بين طولي [AB] و [AB']. ماذا تلاحظ؟</li>
      <li>ماذا نسمي المثلث ABB'؟</li>
      <li>كيف يمكن الحصول على مستطيل باستعمال المحور؟ (تلميح: نحتاج نقطتين على المحور)</li>
    </ul>
    <p><strong>📌 النشاط 2: استكشاف المستطيل</strong></p>
    <table style="width: 100%; text-align: center;" border="1" cellpadding="10">
      <tr><th>النقطة</th><th>موقعها</th></tr>
      <tr><td>A</td><td>على المحور (أعلى)</td></tr>
      <tr><td>A'</td><td>على المحور (أسفل)</td></tr>
      <tr><td>B</td><td>يسار المحور</td></tr>
      <tr><td>B'</td><td>نظيرة B</td></tr>
    </table>
    <p>🔍 صل النقاط A, B, B', A'. ماذا تحصل؟</p>
  </div>
  <div style="background-color: #e3f2fd; padding: 25px; border-radius: 15px; margin: 20px 0;">
    <h3>📚 قواعد إنشاء الأشكال بالتناظر المحوري</h3>
    <div style="border-right: 5px solid #1976D2; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
      <h4>🔷 المثلث المتساوي الساقين</h4>
      <p>نقطة واحدة على المحور + نقطة خارج المحور + نظيرتها = مثلث متساوي الساقين</p>
      <p>A ∈ (d) (رأس المثلث)</p>
      <p>B نقطة خارج المحور</p>
      <p>B' نظيرة B بالنسبة لـ (d)</p>
      <p>المثلث ABB' متساوي الساقين حيث AB = AB'</p>
    </div>
    <div style="border-right: 5px solid #c2185b; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
      <h4>🔷 المستطيل</h4>
      <p>نقطتان على المحور + نقطة خارج المحور + نظيرتها = مستطيل</p>
      <p>A ∈ (d) و A' ∈ (d) (ضلع على المحور)</p>
      <p>B نقطة خارج المحور</p>
      <p>B' نظيرة B</p>
      <p>الشكل A B B' A' هو مستطيل</p>
    </div>
    <div style="border-right: 5px solid #4CAF50; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
      <h4>🔷 المربع</h4>
      <p>مستطيل خاص حيث AB = AA'</p>
      <p>نفس خطوات المستطيل مع شرط تساوي البعدين</p>
    </div>
    <div style="border-right: 5px solid #FF9800; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
      <h4>🔷 المعين</h4>
      <p>نقطتان على المحور + نقطتان خارج المحور متناظرتان = معين</p>
      <p>A ∈ (d) و A' ∈ (d)</p>
      <p>B و C نقطتان خارج المحور (غير متناظرتين)</p>
      <p>B' و C' نظيرتاهما</p>
      <p>الشكل B C C' B' هو معين</p>
    </div>
  </div>
  <div style="background-color: #f3e5f5; padding: 25px; border-radius: 15px; margin: 20px 0;">
    <h3>🎭 أربع تمثيلات لإنشاء الأشكال بالتناظر</h3>
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
      <div style="background-color: white; padding: 20px; border-radius: 10px; text-align: center;">
        <h4 style="color: #1976D2;">🔢 تمثيل عددي</h4>
        <p>A على المحور، B على بعد 3 وحدات</p>
        <p>→ AB = AB' = 5 وحدات</p>
        <p>AA' = 6 وحدات، BB' = 8 وحدات</p>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 10px; text-align: center;">
        <h4 style="color: #c2185b;">📝 تمثيل لفظي</h4>
        <p>"ننشئ نظائر النقاط ثم نصلها بالترتيب المناسب."</p>
        <p>"التناظر يحافظ على الأطوال والزوايا."</p>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 10px; text-align: center;">
        <h4 style="color: #4CAF50;">📐 تمثيل هندسي</h4>
        <svg width="150" height="120" viewBox="0 0 150 120">
          <line x1="75" y1="10" x2="75" y2="120" stroke="red" stroke-width="3" stroke-dasharray="5"/>
          <text x="85" y="30" fill="red">(d)</text>
          <circle cx="75" cy="40" r="4" fill="blue"/>
          <text x="85" y="35">A</text>
          <circle cx="75" cy="80" r="4" fill="blue"/>
          <text x="85" y="95">A'</text>
          <circle cx="45" cy="60" r="4" fill="blue"/>
          <text x="35" y="55">B</text>
          <circle cx="105" cy="60" r="4" fill="green"/>
          <text x="120" y="55">B'</text>
          <rect x="45" y="40" width="60" height="40" fill="none" stroke="purple" stroke-width="3"/>
        </svg>
        <p>مستطيل </p>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 10px; text-align: center;">
        <h4 style="color: #FF9800;">📊 تمثيل جدولي</h4>
        <table style="width:100%; border-collapse: collapse;"><tr><th>الشكل</th><th>نقاط على المحور</th><th>نقاط خارج المحور</th></tr><tr><td>مثلث</td><td>1</td><td>2</td></tr><tr><td>مستطيل</td><td>2</td><td>2</td></tr><tr><td>مربع</td><td>2</td><td>2</td></tr><tr><td>معين</td><td>2</td><td>4</td></tr></table>
      </div>
    </div>
  </div>
  <div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <h3>✅ أمثلة محلولة تدريجيًا</h3>
    <div style="margin-bottom: 20px;">
      <h4>📌 مثال 1: بسيط جدًا - مثلث متساوي الساقين</h4>
      <p>المعطيات: محور (d)، نقطة A عليه، نقطة B على بعد 2 cm يساره.</p>
      <div style="display: flex; gap: 30px; align-items: center;">
        <div>
          <svg width="150" height="120" viewBox="0 0 150 120">
            <line x1="75" y1="20" x2="75" y2="100" stroke="red" stroke-width="3" stroke-dasharray="5"/>
            <text x="90" y="30" fill="red">(d)</text>
            <circle cx="75" cy="50" r="4" fill="blue"/>
            <text x="90" y="45" fill="blue">A</text>
            <circle cx="45" cy="70" r="4" fill="blue"/>
            <text x="35" y="65" fill="blue">B</text>
          </svg>
        </div>
        <div>
          <p><strong>الخطوة 1:</strong> ننشئ نظيرة B → B' (على بعد 2 cm يمين المحور)</p>
          <p><strong>الخطوة 2:</strong> نصل A مع B و A مع B'</p>
          <p><strong>النتيجة:</strong> المثلث ABB' متساوي الساقين (AB = AB')</p>
        </div>
      </div>
    </div>
    <div style="margin-bottom: 20px;">
      <h4>📌 مثال 2: متوسط - مستطيل</h4>
      <p>المعطيات: محور (d)، نقطتان عليه A و A' (البعد بينهما 5 cm)، نقطة B على بعد 2 cm يسار المحور.</p>
      <div style="display: flex; gap: 30px;">
        <div>
            <svg width="200" height="120" viewBox="0 0 200 120">
              <line x1="100" y1="10" x2="100" y2="120" stroke="red" stroke-width="3" stroke-dasharray="5"/>
              <text x="115" y="30" fill="red">(d)</text>
              <circle cx="100" cy="40" r="4" fill="blue"/>
              <text x="115" y="35">A</text>
              <circle cx="100" cy="80" r="4" fill="blue"/>
              <text x="115" y="85">A'</text>
              <circle cx="60" cy="60" r="4" fill="blue"/>
              <text x="50" y="55">B</text>
            </svg>
          </div>
        <div>
          <p><strong>الخطوة 1:</strong> ننشئ نظيرة B → B' (على بعد 2 cm يمين المحور)</p>
          <p><strong>الخطوة 2:</strong> نصل النقاط بالترتيب: A → B → B' → A' → A</p>
          <p><strong>النتيجة:</strong> المستطيل A B B' A'</p>
          <p><strong>الأبعاد:</strong> الطول = 5 cm، العرض = 4 cm</p>
        </div>
      </div>
    </div>
    <div style="margin-bottom: 20px;">
      <h4>📌 مثال 3: يتطلب تحليل - مربع</h4>
      <p>المعطيات: محور (d)، نريد إنشاء مربع طول ضلعه 4 cm.</p>
      <div>
        <p><strong>🔍 تحليل:</strong> في المربع، كل الأضلاع متساوية</p>
        <p><strong>الخطوة 1:</strong> نختار نقطتين على المحور A و A' بحيث AA' = 4 cm</p>
        <p><strong>الخطوة 2:</strong> نختار نقطة B على يسار المحور بحيث AB = 4 cm (أي على بعد 2 cm من المحور)</p>
        <p><strong>الخطوة 3:</strong> ننشئ نظيرة B → B'</p>
        <p><strong>النتيجة:</strong> المربع A B B' A' طول ضلعه 4 cm</p>
      </div>
    </div>
    <div>
      <h4>📌 مثال 4: تطبيقي من الحياة اليومية</h4>
      <p>الوضعية: نجار يصنع طاولة مستطيلة الشكل طولها 120 cm وعرضها 80 cm. يريد التأكد من تناظرها باستعمال محور.</p>
      <p>🔍 التفكير: يضع محورًا في منتصف الطاولة، ويتحقق من أن النقاط المتناظرة على نفس البعد.</p>
      <div style="text-align: center;">
        <svg width="250" height="150" viewBox="0 0 250 150">
          <rect x="40" y="30" width="170" height="90" fill="#d2b48c" stroke="brown" stroke-width="4"/>
          <line x1="125" y1="10" x2="125" y2="140" stroke="red" stroke-width="3" stroke-dasharray="5"/>
          <text x="115" y="20" fill="red">(d)</text>
          <circle cx="70" cy="60" r="4" fill="blue"/>
          <text x="60" y="55">B</text><circle cx="180" cy="60" r="4" fill="green"/>
          <text x="185" y="55">B'</text>
          <circle cx="70" cy="90" r="4" fill="blue"/>
          <text x="60" y="85">C</text>
          <circle cx="180" cy="90" r="4" fill="green"/>
          <text x="185" y="85">C'</text>
        </svg>
      </div>
    </div>
  </div>
  <div style="background-color: #ffebee; padding: 25px; border-radius: 15px; margin: 20px 0;">
    <h3>⚠️ أخطاء شائعة وتحليلها</h3>
    <table style="width: 100%; text-align: center;" border="1" cellpadding="10">
      <tr><th>الخطأ</th><th>مثاله</th><th>لماذا يحدث؟</th><th>كيف نتفاداه؟</th></tr>
      <tr><td>الخطأ 1</td><td>اختيار نقاط على المحور بمسافات غير مناسبة</td><td>عدم تقدير الأبعاد المطلوبة</td><td>نحدد الأبعاد قبل الإنشاء</td></tr>
      <tr><td>الخطأ 2</td><td>عدم احترام تعامد النقاط مع المحور</td><td>نسيان رسم العمودي</td><td>نبدأ دائمًا برسم العمودي من كل نقطة</td></tr>
      <tr><td>الخطأ 3</td><td>الخلط بين المستطيل والمربع</td><td>عدم الانتباه لتساوي الأضلاع</td><td>نتحقق من الشرط AB = AA' للمربع</td></tr>
      <tr><td>الخطأ 4</td><td>المعين يصبح مستطيلاً</td><td>اختيار نقاط غير مناسبة</td><td>نركز على أن الأقطار متعامدة</td></tr>
    </table>
    <p><strong>✅ كيف نتحقق من صحة الحل؟</strong></p>
    <ul>
      <li>نتحقق من تساوي المسافات عن المحور</li>
      <li>نتحقق من توازي الأضلاع المتقابلة</li>
      <li>نتحقق من تعامد الأقطار في المعين</li>
    </ul>
  </div>
  <div style="background-color: #fff3cd; padding: 25px; border-radius: 15px; margin: 20px 0;">
    <h3>💭 فقرة "نفكر معًا"</h3>
    <p>سؤال مفتوح: "هل يمكن إنشاء شكل سداسي منتظم باستعمال التناظر المحوري؟ كيف؟"</p>
    <p>🔍 للتفكير:</p>
    <ul>
      <li>ما هي محاور التناظر في الشكل السداسي؟</li>
      <li>كم نقطة نحتاج على المحور؟</li>
      <li>هل يمكن البدء بنصف شكل ثم إكماله؟</li>
    </ul>
  </div>
  <div style="background-color: #d4edda; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <h3>🇩🇿 الهوية والقيم</h3>
    <p>قيمنا في درس الرياضيات:</p>
    <ul>
      <li>الدقة: في القياس والإنشاء</li>
      <li>النظام: في ترتيب الخطوات</li>
      <li>الجمال: التناظر في التراث الجزائري</li>
      <li>الإتقان: في العمل بالمدور والمسطرة</li>
      <li>الهوية: الزخرفة الهندسية في فنوننا</li>
    </ul>
    <p>"التناظر يعكس جمال النظام في الكون، ونراه في تراثنا العريق."</p>
  </div>
  <div style="background-color: #d4edda; padding: 20px; border-radius: 15px; text-align: center; font-size: 1.2em; border: 2px solid #28a745; margin: 30px 0;">
    <h3>📌 خلاصة الدرس</h3>
    <table style="width: 100%; text-align: center;" border="1" cellpadding="10">
      <tr><th>الشكل</th><th>النقاط على المحور</th><th>النقاط خارج المحور</th><th>الشرط الخاص</th></tr>
      <tr><td>مثلث متساوي الساقين</td><td>1</td><td>2</td><td>AB = AB'</td></tr>
      <tr><td>مستطيل</td><td>2</td><td>2</td><td>الأضلاع المتقابلة متوازية</td></tr>
      <tr><td>مربع</td><td>2</td><td>2</td><td>AB = AA'</td></tr>
      <tr><td>معين</td><td>2</td><td>4</td><td>الأقطار متعامدة</td></tr>
    </table>
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

  const lesson = await prisma.lesson.upsert({
    where: {
      title_authorId: {
        title: lessonTitle,
        authorId: teacher.id,
      },
    },
    update: {
      content: content,
      published: true,
      status: 'approved',
    },
    create: {
      title: lessonTitle,
      content: content,
      subjectId: subject.id,
      levelId: level.id,
      authorId: teacher.id,
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
      question: 'أكمل الفراغات:\n1. لإنشاء مثلث متساوي الساقين، نضع ...... نقطة على المحور.\n2. المستطيل يحتاج إلى ...... نقطتين على المحور.\n3. المربع هو حالة خاصة من ...... حيث الأضلاع ......\n4. في المعين، الأقطار ......', 
      expectedResults: [
        { question: "1", result: "واحدة" },
        { question: "2", result: "نقطتين" },
        { question: "3", result: "المستطيل, متساوية" },
        { question: "4", result: "متعامدة" }
      ],
      displayOrder: 1
    },
    { 
      type: 'support_with_results', 
      question: 'أكمل الجدول:\nالشكل | عدد النقاط على المحور | عدد النقاط خارج المحور\nمثلث متساوي الساقين | ⬜ | ⬜\nمستطيل | ⬜ | ⬜\nمربع | ⬜ | ⬜\nمعين | ⬜ | ⬜', 
      expectedResults: [
        { question: "مثلث", result: "1, 2" },
        { question: "مستطيل", result: "2, 2" },
        { question: "مربع", result: "2, 2" },
        { question: "معين", result: "2, 4" }
      ],
      displayOrder: 2
    },
    { 
      type: 'support_with_results', 
      question: 'اختر الإجابة الصحيحة:\n1. المثلث المتساوي الساقين له رأس على المحور (صواب/خطأ)\n2. المستطيل له محورا تناظر فقط (صواب/خطأ)\n3. المربع يمكن إنشاؤه من مستطيل (صواب/خطأ)\n4. المعين أضلاعه غير متساوية (صواب/خطأ)', 
      expectedResults: [
        { question: "1", result: "صواب" },
        { question: "2", result: "صواب" },
        { question: "3", result: "صواب" },
        { question: "4", result: "خطأ" }
      ],
      displayOrder: 3
    },
    { 
      type: 'support_with_results', 
      question: 'لدينا A ∈ (d) و B على بعد 3 وحدات يسار المحور. ارسم B\' ثم المثلث ABB\'. ما هي إحداثيات B\'؟', 
      expectedResults: [
        { question: "B'", result: "(140,70)" }
      ],
      displayOrder: 4
    },
    { 
      type: 'support_with_results', 
      question: 'لدينا A و A\' على المحور ببعد 8 cm. نختار B على بعد 3 cm يسار المحور. أنشئ المستطيل. ما هو محيطه؟', 
      expectedResults: [
        { question: "المحيط", result: "28 cm" }
      ],
      displayOrder: 5
    },
    { 
      type: 'support_with_results', 
      question: 'نريد إنشاء مربع طول ضلعه 6 cm باستعمال التناظر. حدد مواقع النقاط A، A\'، B.', 
      expectedResults: [
        { question: "النتيجة", result: "AA' = 6 cm، AB = 6 cm → B على بعد 3 cm من المحور" }
      ],
      displayOrder: 6
    },
    { 
      type: 'main', 
      question: 'تصميم معين: أردنا إنشاء معين باستعمال التناظر. اخترنا نقطتين على المحور A و A\' ببعد 10 cm، ونقطتين B و C على يسار المحور بحيث AB = 6 cm و AC = 4 cm. أنشئ النظائر وارسم المعين.', 
      modelAnswer: '1. ننشئ نظائر B و C وهي B\' و C\'.\n2. نصل النقاط B, C, C\', B\' لنحصل على المعين.\n3. المحيط = 4 × BC (إذا كان BC معروفاً).' 
    },
    { 
      type: 'main', 
      question: 'مشكلة حياتية: حديقة مستطيلة الشكل طولها 30 m وعرضها 20 m. يراد إنشاء نافورة في منتصفها (على محور التناظر) وممرين متناظرين يصلان إلى زوايا الحديقة. حدد موقع النافورة ونقاط الممرات المتناظرة.', 
      modelAnswer: '1. النافورة في منتصف المحور.\n2. الممرات متناظرة، وطول كل ممر يمكن حسابه بنظرية فيثاغورس.' 
    }
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