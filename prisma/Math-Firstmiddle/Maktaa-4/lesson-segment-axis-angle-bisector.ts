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

  const lessonTitle = "التعرف على محور قطعة مستقيم وإنشائه ثم التعرف على منصف زاوية وإنشائه";

  const content = `
<div dir="rtl">
  <!-- وضعية انطلاق -->
  <div style="background-color: #f0f9ff; padding: 25px; border-radius: 15px; margin: 20px 0;">
    <h3>🏠 مشكلة: تنظيم طاولات في قاعة الأفراح</h3>
    <p>الحاج محمد يريد تنظيم طاولات في قاعة الأفراح بطريقة متناظرة. لديه طاولتان مستطيلتان متطابقتان يريد وضعهما على جانبي ممر رئيسي بحيث تكون المسافة بين كل طاولة والممر متساوية. كما يريد تزيين زوايا القاعة بنجفات بحيث تكون الزوايا مقسمة إلى نصفين متساويين.</p>
    <div style="display: flex; justify-content: center; gap: 30px; margin: 30px 0; flex-wrap: wrap;">
      <div style="text-align: center; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <svg width="200" height="150" viewBox="0 0 200 150">
          <line x1="100" y1="10" x2="100" y2="140" stroke="red" stroke-width="4" stroke-dasharray="5"/>
          <text x="90" y="25" fill="red" font-size="14">الممر</text>
          <rect x="30" y="40" width="50" height="30" fill="#b33b3b" stroke="black" stroke-width="2"/>
          <text x="50" y="90" fill="black" font-size="12">طاولة 1</text>
          <rect x="120" y="40" width="50" height="30" fill="#2a9d8f" stroke="black" stroke-width="2"/>
          <text x="140" y="90" fill="black" font-size="12">طاولة 2</text>
        </svg>
        <p><strong>تنظيم الطاولات</strong></p>
      </div>
      <div style="text-align: center; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <svg width="150" height="150" viewBox="0 0 150 150">
          <line x1="40" y1="100" x2="40" y2="40" stroke="black" stroke-width="3"/>
          <line x1="40" y1="100" x2="110" y2="100" stroke="black" stroke-width="3"/>
          <circle cx="65" cy="70" r="10" fill="#f4d03f"/>
          <text x="80" y="65" fill="black" font-size="12">نجفة</text>
          <!-- علامات تساوي الزوايا -->
          <path d="M 40 85 A 15 15 0 0 1 55 100" stroke="black" fill="none" stroke-width="1"/>
        </svg>
        <p><strong>تزيين الزوايا</strong></p>
      </div>
    </div>
    <p><strong>🔍 التساؤلات:</strong></p>
    <ul>
      <li>كيف يمكن للحاج محمد تحديد موقع الطاولة الثانية بدقة لضمان تناظرها مع الأولى؟</li>
      <li>كيف يمكنه تحديد مكان النجفة بالضبط في منتصف الزاوية؟</li>
    </ul>
  </div>

  <!-- مرحلة البحث والاكتشاف -->
  <div style="background-color: #fff9e6; padding: 25px; border-radius: 15px; margin: 20px 0;" dir="rtl">
    <h3>🧪 نشاط استكشافي: نكتشف معًا!</h3>
    
    <p><strong>📌 النشاط 1: اكتشاف محور قطعة مستقيم</strong></p>
    <p>خذ قطعة مستقيم [AB] مرسومة على ورقة. حاول إيجاد خط مستقيم يقسمها إلى نصفين متساويين ويكون عموديًا عليها.</p>
    <div style="display: flex; justify-content: space-around; margin: 30px 0; flex-wrap: wrap;">
      <div style="text-align: center;">
        <svg width="150" height="80" viewBox="0 0 150 80">
          <line x1="20" y1="40" x2="130" y2="40" stroke="black" stroke-width="3"/>
          <circle cx="30" cy="40" r="4" fill="blue"/>
          <text x="20" y="30" fill="blue">A</text>
          <circle cx="120" cy="40" r="4" fill="blue"/>
          <text x="120" y="30" fill="blue">B</text>
        </svg>
        <p>① القطعة [AB]</p>
      </div>
      <div style="text-align: center;">
        <svg width="150" height="80" viewBox="0 0 150 80">
          <line x1="20" y1="40" x2="130" y2="40" stroke="black" stroke-width="3"/>

          <circle cx="30" cy="40" r="4" fill="blue"/>
          <text x="20" y="30" fill="blue">A</text>
          <circle cx="120" cy="40" r="4" fill="blue"/>
          <text x="120" y="30" fill="blue">B</text>

          <line x1="75" y1="10" x2="75" y2="70" stroke="red" stroke-width="3" stroke-dasharray="5"/>
          <circle cx="75" cy="40" r="3" fill="green"/>
          <!-- علامة الزاوية القائمة -->
          <path d="M75 40 L75 32 L83 32 L83 40 Z" fill="green"/>
          <text x="75" y="5 L100 45 L100 50 Z" fill="green"/>

          <text x="75" y="30" fill="green">M</text>
          <!-- علامات تساوي المسافات -->
          <line x1="45" y1="35" x2="45" y2="45" stroke="black" stroke-width="2"/>
          <line x1="50" y1="35" x2="50" y2="45" stroke="black" stroke-width="2"/>
          <line x1="100" y1="35" x2="100" y2="45" stroke="black" stroke-width="2"/>
          <line x1="105" y1="35" x2="105" y2="45" stroke="black" stroke-width="2"/>
        </svg>
        <p>② المحور يمر بالمنتصف M</p>
      </div>
    </div>
    <p><strong>❓ أسئلة موجهة:</strong></p>
    <ul>
      <li>ما هي العلاقة بين المحور والقطعة [AB]؟ <span style="color: #1976D2;">(عمودي)</span></li>
      <li>أين يلتقي المحور مع القطعة؟ <span style="color: #1976D2;">(في المنتصف)</span></li>
      <li>ماذا نسمي النقطة M؟ <span style="color: #1976D2;">(منتصف القطعة)</span></li>
    </ul>

    <p><strong>📌 النشاط 2: اكتشاف منصف زاوية</strong></p>
    <p>ارسم زاوية xOy على ورقة. حاول إيجاد خط يقسمها إلى زاويتين متساويتين.</p>
    <div style="display: flex; justify-content: space-around; margin: 30px 0; flex-wrap: wrap;">
      <div style="text-align: center;">
        <svg width="120" height="100" viewBox="0 0 120 100" dir="rtl">
          <line x1="20" y1="80" x2="100" y2="20" stroke="black" stroke-width="3"/>
          <line x1="20" y1="80" x2="100" y2="80" stroke="black" stroke-width="3"/>
          <circle cx="20" cy="80" r="3" fill="blue"/>
          <text x="15" y="90" fill="blue">O</text>
          <text x="90" y="30" fill="black">x</text>
          <text x="105" y="95" fill="black">y</text>
        </svg>
        <p>① الزاوية xOy</p>
      </div>
      <div style="text-align: center;">
        <svg width="200" height="100" viewBox="0 0 120 100">
          <line x1="20" y1="80" x2="100" y2="20" stroke="black" stroke-width="3"/>
          <line x1="20" y1="80" x2="100" y2="80" stroke="black" stroke-width="3"/>
          <line x1="20" y1="80" x2="100" y2="50" stroke="red" stroke-width="3"/>
          <text x="15" y="90" fill="blue">O</text>
          <text x="85" y="30" fill="black">x</text>
          <text x="105" y="95" fill="black">y</text>
          <text x="150" y="55" fill="red" font-size="14"> (oz]المنصف</text>
          <!-- علامات تساوي الزوايا -->
          <path d="M 45 80 A 20 20 0 0 0 40 73" stroke="green" fill="none" stroke-width="2"/>
          <path d="M 40 73 A 20 20 0 0 0 35 65" stroke="green" fill="none" stroke-width="2"/>
        </svg>
        <p>② المنصف يقسم الزاوية</p>
      </div>
    </div>
    <p><strong>❓ أسئلة موجهة:</strong></p>
    <ul>
      <li>كم زاوية نحصل بعد رسم المنصف؟ <span style="color: #1976D2;">(زاويتان)</span></li>
      <li>هل هما متساويتان؟ <span style="color: #1976D2;">(نعم)</span></li>
    </ul>
  </div>

  <!-- بناء المفهوم -->
  <div style="background-color: #e3f2fd; padding: 25px; border-radius: 15px; margin: 20px 0;">
    <h3>📚 تعريفات ومصطلحات</h3>
    
    <div style="border-right: 5px solid #1976D2; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
      <h4>🔷 محور قطعة مستقيم</h4>
      <p>محور قطعة مستقيم [AB] هو المستقيم العمودي على هذه القطعة في منتصفها.</p>
      <ul>
        <li>يمر بالنقطة M منتصف [AB]</li>
        <li>(d) ⊥ (AB)</li>
        <li>AM = MB</li>
        <li>كل نقطة على المحور تكون على مسافة متساوية من A و B</li>
      </ul>
      <div style="text-align: center;">
        <svg width="200" height="100" viewBox="0 0 200 100">
          <line x1="30" y1="50" x2="170" y2="50" stroke="black" stroke-width="3"/>
          <circle cx="40" cy="50" r="4" fill="blue"/>
          <text x="30" y="40">A</text>
          <circle cx="160" cy="50" r="4" fill="blue"/>
          <text x="170" y="40">B</text>
          <circle cx="100" cy="50" r="3" fill="green"/>
          <text x="120" y="45">M</text>
          <line x1="100" y1="05" x2="100" y2="100" stroke="red" stroke-width="3" stroke-dasharray="5"/>
          <text x="100" y="10" fill="red">(d)</text>
          <path d="M95 50 L95 45 L100 45 L100 50 Z" fill="green"/>
          <!-- علامات تساوي المسافات -->
          <line x1="65" y1="45" x2="65" y2="55" stroke="black" stroke-width="2"/>
          <line x1="70" y1="45" x2="70" y2="55" stroke="black" stroke-width="2"/>
          <line x1="130" y1="45" x2="130" y2="55" stroke="black" stroke-width="2"/>
          <line x1="135" y1="45" x2="135" y2="55" stroke="black" stroke-width="2"/>
        </svg>
      </div>
    </div>

    <div style="border-right: 5px solid #c2185b; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
      <h4>🔷 منصف زاوية</h4>
      <p>منصف زاوية هو نصف المستقيم الذي يقسم الزاوية إلى زاويتين متساويتين.</p>
      <ul>
        <li>ينطلق من رأس الزاوية O</li>
        <li>xOz = zOy (الزاويتان متساويتان)</li>
        <li>كل نقطة على المنصف تكون على مسافة متساوية من ضلعي الزاوية</li>
      </ul>
      <div style="text-align: center;">
        <svg width="200" height="100" viewBox="0 0 200 100">
          <line x1="30" y1="80" x2="100" y2="20" stroke="black" stroke-width="3"/>
          <line x1="30" y1="80" x2="125" y2="80" stroke="black" stroke-width="3"/>
          <circle cx="30" cy="80" r="3" fill="blue"/>
          <text x="20" y="90">O</text>
          <line x1="30" y1="80" x2="130" y2="40" stroke="red" stroke-width="3"/>
          
          <text x="85" y="30" fill="black">x</text>
          <text x="120" y="95" fill="black">y</text>
          <text x="150" y="45" fill="red">(oz]</text>
          <!-- علامات تساوي الزوايا -->
          <path d="M 55 80 A 20 20 0 0 0 50 73" stroke="green" fill="none" stroke-width="2"/>
          <path d="M 50 73 A 20 20 0 0 0 45 65" stroke="green" fill="none" stroke-width="2"/>
        </svg>
      </div>
    </div>
  </div>

  <!-- تمثيل متعدد للمفهوم -->
  <div style="background-color: #f3e5f5; padding: 25px; border-radius: 15px; margin: 20px 0;">
    <h3>🎭 تمثيل متعدد للمفهوم</h3>
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
      <div style="background-color: white; padding: 20px; border-radius: 10px; text-align: center;">
        <h4 style="color: #1976D2;">🔢 تمثيل عددي</h4>
        <p><strong>محور قطعة:</strong> AB = 8 cm → AM = MB = 4 cm</p>
        <p><strong>منصف زاوية:</strong> xOy = 60° → xOz = zOy = 30°</p>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 10px; text-align: center;">
        <h4 style="color: #c2185b;">📝 تمثيل لفظي</h4>
        <p>"محور قطعة هو الخط العمودي عليها في منتصفها."</p>
        <p>"منصف زاوية هو الخط الذي يقسمها إلى نصفين متساويين."</p>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 10px; text-align: center;">
        <h4 style="color: #4CAF50;">📐 تمثيل هندسي</h4>
        <svg width="150" height="120" viewBox="0 0 150 120">
          <line x1="30" y1="60" x2="120" y2="60" stroke="black" stroke-width="2"/>
          <circle cx="30" cy="60" r="3" fill="blue"/><text x="20" y="55">A</text>
          <circle cx="120" cy="60" r="3" fill="blue"/><text x="125" y="55">B</text>
          <line x1="75" y1="30" x2="75" y2="90" stroke="red" stroke-width="2" stroke-dasharray="5"/>
          <path d="M70 60 L70 55 L75 55 L75 60 Z" fill="green"/>
          <line x1="50" y1="55" x2="50" y2="65" stroke="black" stroke-width="2"/>
          <line x1="100" y1="55" x2="100" y2="65" stroke="black" stroke-width="2"/>
        </svg>
        <p>محور القطعة</p>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 10px; text-align: center;">
        <h4 style="color: #FF9800;">📊 تمثيل جدولي</h4>
        <table style="width:100%; border-collapse: collapse;">
          <tr><th>الخاصية</th><th>محور قطعة</th><th>منصف زاوية</th></tr>
          <tr><td>عمودي</td><td>✓</td><td>✗</td></tr>
          <tr><td>يقسم</td><td>القطعة</td><td>الزاوية</td></tr>
          <tr><td>إلى</td><td>نصفين متساويين</td><td>زاويتين متساويتين</td></tr>
        </table>
      </div>
    </div>
  </div>
  <div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <h3>✅ أمثلة محلولة تدريجيًا</h3>
    
    <div style="margin-bottom: 20px;">
      <h4>📌 مثال 1: بسيط جدًا - إنشاء محور قطعة مستقيم</h4>
      <p>المعطيات: قطعة مستقيم [AB] طولها 6 cm.</p>
      <div style="display: flex; gap: 30px; align-items: center;">
        <div><svg width="150" height="120" viewBox="0 0 150 120"><line x1="30" y1="60" x2="120" y2="60" stroke="black" stroke-width="3"/><circle cx="30" cy="60" r="4" fill="blue"/><text x="20" y="55">A</text><circle cx="120" cy="60" r="4" fill="blue"/><text x="125" y="55">B</text></svg></div>
        <div>
          <p><strong>الخطوة 1:</strong> نضع سن المدور في A ونفتحه بفتحة أكبر من نصف القطعة، نرسم قوسًا.</p>
          <p><strong>الخطوة 2:</strong> نكرر نفس الفتحة من B ونرسم قوسًا يقطع الأول في نقطتين C و D.</p>
          <p><strong>الخطوة 3:</strong> نصل C و D فنحصل على المحور (d).</p>
          <p><strong>النتيجة:</strong> (d) هو محور [AB].</p>
        </div>
      </div>
    </div>
    <div style="margin-bottom: 20px;">
      <h4>📌 مثال 2: متوسط - إنشاء منصف زاوية</h4>
      <p>المعطيات: زاوية xOy رأسها O.</p>
      <div style="display: flex; gap: 30px;">
        <div><svg width="150" height="120" viewBox="0 0 150 120"><line x1="50" y1="80" x2="50" y2="30" stroke="black" stroke-width="3"/><line x1="50" y1="80" x2="120" y2="80" stroke="black" stroke-width="3"/><circle cx="50" cy="80" r="4" fill="blue"/><text x="40" y="95">O</text></svg></div>
        <div>
          <p><strong>الخطوة 1:</strong> نضع سن المدور في O ونرسم قوسًا يقطع الضلعين في A و B.</p>
          <p><strong>الخطوة 2:</strong> نضع سن المدور في A ونرسم قوسًا داخل الزاوية.</p>
          <p><strong>الخطوة 3:</strong> نكرر من B بنفس الفتحة ونحصل على نقطة C.</p>
          <p><strong>الخطوة 4:</strong> نصل O مع C فنحصل على المنصف (Oz].</p>
          <p><strong>النتيجة:</strong> (Oz] منصف الزاوية xOy.</p>
        </div>
      </div>
    </div>
    <div style="margin-bottom: 20px;">
      <h4>📌 مثال 3: يتطلب تحليل - إيجاد نقطة على المحور</h4>
      <p>المعطيات: قطعة [AB] طولها 8 cm. نريد إيجاد نقطة P على محورها تبعد 5 cm عن A.</p>
      <div>
        <p><strong>🔍 تحليل:</strong> نقطة P على المحور تعني PA = PB.</p>
        <p><strong>الخطوة 1:</strong> ننشئ محور القطعة (d).</p>
        <p><strong>الخطوة 2:</strong> نضع سن المدور في A بفتحة 5 cm ونرسم قوسًا يقطع (d) في نقطتين P و P'.</p>
        <p><strong>النتيجة:</strong> P و P' هما النقطتان المطلوبتان.</p>
      </div>
    </div>
    <div>
      <h4>📌 مثال 4: تطبيقي من الحياة اليومية</h4>
      <p>الوضعية: نجار يريد تركيب رف في منتصف خزانة طولها 120 cm. كيف يحدد منتصف الخزانة؟</p>
      <p>🔍 التفكير: يستعمل محور القطعة. يعتبر الخزانة قطعة [AB] طولها 120 cm، محورها يمر بمنتصفها (60 cm).</p>
      <div style="text-align: center;">
        <svg width="250" height="200" viewBox="0 0 250 100">
          <rect x="30" y="30" width="180" height="120" fill="#d2b48c" stroke="brown" stroke-width="3"/>
          <line x1="120" y1="10" x2="120" y2="180" stroke="red" stroke-width="3" stroke-dasharray="5"/>
          <text x="115" y="15" fill="red">المحور</text>
          <circle cx="30" cy="90" r="3"/>
          <text x="20" y="90">A</text>
          <circle cx="210" cy="90" r="3"/>
          <text x="220" y="90">B</text>
        </svg>
      </div>
    </div>
  </div>
  <div style="background-color: #ffebee; padding: 25px; border-radius: 15px; margin: 20px 0;">
    <h3>⚠️ أخطاء شائعة وتحليلها</h3>
    <table style="width:100%; border-collapse: collapse; text-align: center;" border="1" cellpadding="10">
      <tr><th>الخطأ</th><th>لماذا يحدث؟</th><th>كيف نتفاداه؟</th></tr>
      <tr><td>المحور لا يمر بالمنتصف</td><td>عدم دقة في اختيار فتحة المدور</td><td>نتأكد أن فتحة المدور > نصف القطعة</td></tr>
      <tr><td>المحور غير عمودي</td><td>عدم رسم قوسين متقاطعين بشكل صحيح</td><td>نرسم قوسين من A و B بفتحة واحدة</td></tr>
      <tr><td>منصف زاوية لا يقسمها بالتساوي</td><td>عدم دقة في إنشاء النقطة</td><td>نرسم القوسين بنفس الفتحة</td></tr>
      <tr><td>الخلط بين المحور والمنصف</td><td>عدم فهم الفرق بينهما</td><td>نركز على أن المحور للقطعة والمنصف للزاوية</td></tr>
    </table>
    <p><strong>✅ كيف نتحقق من صحة الحل؟</strong></p>
    <ul>
      <li>للمحور: نتحقق من أن AM = MB وأن (d) ⊥ (AB)</li>
      <li>للمنصف: نتحقق من أن الزاويتين متساويتان باستعمال المنقلة</li>
    </ul>
  </div>
  <div style="background-color: #d4edda; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <h3>🇩🇿 الهوية والقيم</h3>
    <p>الدقة والنظام والعدل. منصف الزاوية يرمز للعدل والمساواة، ومحور القطعة يرمز للتوازن في الحياة.</p>
    <p><strong>"العدل والتوازن أساس الحياة، كما أن المنصف والمحور أساس الهندسة."</strong></p>
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

  // إضافة التمارين
  const exercises = [
    { 
      type: 'support_with_results', 
      question: 'أكمل الفراغات:\n1. محور قطعة مستقيم [AB] هو المستقيم ...... على هذه القطعة في .......\n2. نقطة تلاقي المحور مع القطعة تسمى ...... القطعة.\n3. منصف زاوية هو نصف المستقيم الذي يقسم الزاوية إلى ...... متساويتين.\n4. كل نقطة على محور قطعة تكون على ...... متساوية من طرفي القطعة.', 
      expectedResults: [
        { question: "1", result: "العمودي, منتصفها" },
        { question: "2", result: "منتصف" },
        { question: "3", result: "زاويتين" },
        { question: "4", result: "مسافة" }
      ],
      displayOrder: 1
    },
    { 
      type: 'support_with_results', 
      question: 'أكمل الجدول:\nطول القطعة [AB] | طول [AM] (M منتصف) | طول [MB]\n10 cm | ⬜ | ⬜\n8 cm | ⬜ | 4 cm\n⬜ | 6 cm | 6 cm', 
      expectedResults: [
        { question: "1", result: "5, 5" },
        { question: "2", result: "4, 4" },
        { question: "3", result: "12" }
      ],
      displayOrder: 2
    },
    { 
      type: 'support_with_results', 
      question: 'اختر الإجابة الصحيحة:\n1. محور قطعة يمر بأحد طرفيها (صواب/خطأ)\n2. منصف زاوية ينطلق من رأسها (صواب/خطأ)\n3. المحور عمودي على القطعة (صواب/خطأ)\n4. المنصف يقسم الزاوية إلى 3 أجزاء (صواب/خطأ)', 
      expectedResults: [
        { question: "1", result: "خطأ" },
        { question: "2", result: "صواب" },
        { question: "3", result: "صواب" },
        { question: "4", result: "خطأ" }
      ],
      displayOrder: 3
    },
    { 
      type: 'support_with_results', 
      question: 'ارسم قطعة [AB] طولها 7 cm، ثم أنشئ محورها باستعمال المدور والمسطرة. ما هي الخاصية التي تستخدمها؟', 
      expectedResults: [
        { question: "الخاصية", result: "كل نقطة على المحور تبعد نفس المسافة عن طرفي القطعة" }
      ],
      displayOrder: 4
    },
    { 
      type: 'support_with_results', 
      question: 'ارسم زاوية قياسها 80°، ثم أنشئ منصفها باستعمال المدور والمسطرة. كم قياس كل زاوية ناتجة؟', 
      expectedResults: [
        { question: "القياس", result: "40°" }
      ],
      displayOrder: 5
    },
    { 
      type: 'support_with_results', 
      question: 'لدينا قطعة [AB] طولها 10 cm. نريد إيجاد نقطة P على محورها تبعد 6 cm عن A. كم تبعد P عن B؟', 
      expectedResults: [
        { question: "بعد P عن B", result: "6 cm" }
      ],
      displayOrder: 6
    },
    { 
      type: 'main', 
      question: 'مشكلة: تصميم حديقة\nالوضعية: حديقة مستطيلة الشكل طولها 40 m وعرضها 30 m. يراد إنشاء نافورة في منتصف الحديقة (على بعد متساو من الجوانب) وممرين من زاويتي الحديقة يلتقيان عند النافورة.\nالمطلوب:\n1. حدد موقع النافورة (مركز المستطيل = منتصف القطرين).\n2. أنشئ محوري القطرين.\n3. ماذا تلاحظ؟', 
      modelAnswer: '1. النافورة في مركز المستطيل.\n2. يتم إنشاء محوري القطرين.\n3. نلاحظ أن محوري القطرين يتقاطعان في مركز المستطيل، وهو موقع النافورة.' 
    },
    { 
      type: 'main', 
      question: 'مشكلة حياتية: تنظيم مباراة\nالوضعية: في ساحة المدرسة، يريد التلاميذ تنظيم مباراة في كرة القدم. وضعوا قائمين للمرمى على بعد 10 m من بعضهما. يريدون وضع علامة في منتصف المرمى لضربات الجزاء، وخط يحدد منتصف الملعب.\nالمطلوب:\n1. كيف تحدد منتصف المرمى باستعمال المحور؟\n2. كيف تحدد منتصف الملعب؟', 
      modelAnswer: '1. منتصف المرمى هو منتصف القطعة بين القائمين، ويمكن إيجاده بإنشاء محور هذه القطعة.\n2. منتصف الملعب هو نقطة تقاطع قطري الملعب، ويمكن إيجاده بإنشاء محوري القطرين.' 
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