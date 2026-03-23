import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding Lesson: Parallel Lines ...');

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
        <h3>🚆 مشكلة: خطوط السكة الحديدية</h3>
        <p>في محطة القطارات بالجزائر العاصمة، لاحظ سامي أن قضبان السكة الحديدية متوازية ولا تلتقي أبدًا. سأل والده: "كيف يمكن أن تبقى هذه القضبان على نفس المسافة طوال الوقت؟"</p>
      </div>

      <div style="display: flex; justify-content: center; gap: 30px; margin: 30px 0; flex-wrap: wrap;">
        <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <svg width="250" height="120" viewBox="0 0 250 120">
            <!-- قضبان متوازية -->
            <line x1="20" y1="40" x2="230" y2="40" stroke="black" stroke-width="4"/>
            <line x1="20" y1="80" x2="230" y2="80" stroke="black" stroke-width="4"/>
            <!-- عوارض عرضية -->
            <line x1="30" y1="40" x2="30" y2="80" stroke="gray" stroke-width="2" stroke-dasharray="5"/>
            <line x1="220" y1="40" x2="220" y2="80" stroke="gray" stroke-width="2" stroke-dasharray="5"/>
            <line x1="90" y1="40" x2="90" y2="80" stroke="gray" stroke-width="2" stroke-dasharray="5"/>
            <line x1="160" y1="40" x2="160" y2="80" stroke="gray" stroke-width="2" stroke-dasharray="5"/>
            <!-- تسميات -->
            <text x="20" y="30" fill="blue">(d)</text>
            <text x="20" y="95" fill="red">(l)</text>
          </svg>
          <p style="margin-top: 10px;"><strong>قضبان متوازية: (d) // (l)</strong></p>
        </div>
        <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <svg width="200" height="120" viewBox="0 0 200 120">
            <!-- مستقيمان غير متوازيين -->
            <line x1="20" y1="20" x2="180" y2="100" stroke="red" stroke-width="4"/>
            <line x1="20" y1="100" x2="180" y2="20" stroke="blue" stroke-width="4"/>
            <circle cx="100" cy="60" r="5" fill="black"/>
            <text x="105" y="55" fill="black">O</text>
            <text x="20" y="15" fill="red">(d)</text>
            <text x="150" y="30" fill="blue">(l)</text>
          </svg>
          <p><strong>مستقيمان متقاطعان: (d) ∩ (l) = {O}</strong></p>
        </div>
      </div>
      <p>🔍 لاحظ سامي أن القضبان الحديدية لا تلتقي أبدًا، بينما بعض الخطوط الأخرى تتقاطع.</p>
      <p><strong>❓ التساؤلات:</strong></p>
      <ul>
        <li>كيف نعرف أن مستقيمين متوازيان؟</li>
        <li>ما الفرق بين المستقيمات المتوازية والمتقاطعة؟</li>
        <li>كيف نرمز للمستقيمين المتوازيين؟</li>
      </ul>

      <!-- 2️⃣ مرحلة البحث والاكتشاف -->
      <div style="background-color: #fff9e6; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <h3>🧪 نشاط استكشافي: هيا نكتشف التوازي!</h3>
        <h4>📌 النشاط 1: مستقيمان لا يلتقيان</h4>
        <p>ارسم على ورقة مستقيمين لا يلتقيان مهما مددتهما.</p>
        <div style="display: flex; justify-content: center; margin: 30px 0;">
          <svg width="350" height="100" viewBox="0 0 350 100">
            <line x1="20" y1="30" x2="330" y2="30" stroke="#1976D2" stroke-width="4"/>
            <line x1="20" y1="70" x2="330" y2="70" stroke="#FF9800" stroke-width="4"/>
            <text x="20" y="20" fill="#1976D2">(d)</text>
            <text x="20" y="90" fill="#FF9800">(l)</text>
          </svg>
        </div>
        <p><strong>❓ أسئلة موجهة:</strong></p>
        <ul>
          <li>هل يلتقي هذان المستقيمان؟ <span style="background-color: #1976D2; color: white; padding: 3px 8px; border-radius: 15px;">لا</span></li>
          <li>المسافة بينهما متساوية؟ <span style="background-color: #FF9800; color: white; padding: 3px 8px; border-radius: 15px;">نعم</span></li>
          <li>ماذا نسميهما؟ <span style="background-color: #4CAF50; color: white; padding: 3px 8px; border-radius: 15px;">متوازيان</span></li>
        </ul>

        <h4>📌 النشاط 2: مستقيمان متقاطعان</h4>
        <p>ارسم مستقيمين يتقاطعان في نقطة واحدة.</p>
        <div style="display: flex; justify-content: center; margin: 30px 0;">
          <svg width="250" height="150" viewBox="0 0 250 150">
            <line x1="30" y1="30" x2="220" y2="120" stroke="red" stroke-width="4"/>
            <line x1="30" y1="120" x2="220" y2="30" stroke="blue" stroke-width="4"/>
            <circle cx="125" cy="75" r="5" fill="black"/>
            <text x="130" y="70" fill="black">O</text>
          </svg>
        </div>
        <p><strong>❓ أسئلة موجهة:</strong></p>
        <ul>
          <li>كم نقطة مشتركة بين المستقيمين؟ <span style="background-color: #c2185b; color: white; padding: 3px 8px; border-radius: 15px;">نقطة واحدة</span></li>
          <li>ماذا نسميها؟ <span style="background-color: #9C27B0; color: white; padding: 3px 8px; border-radius: 15px;">نقطة التقاطع</span></li>
          <li>هل هما متوازيان؟ <span style="background-color: #FF5722; color: white; padding: 3px 8px; border-radius: 15px;">لا</span></li>
        </ul>

        <h4>📌 النشاط 3: اكتشاف الرمز</h4>
        <table style="width:100%; text-align:center; border-collapse: collapse; margin: 10px 0;">
          <tr style="background-color: #f0f0f0;"><th>الشكل</th><th>عدد نقاط التقاطع</th><th>الرمز</th></tr>
          <tr><td>متوازيان</td><td>0</td><td>(d) // (l)</td></tr>
          <tr><td>متقاطعان</td><td>1</td><td>(d) ∩ (l) = {O}</td></tr>
        </table>
      </div>

      <!-- 3️⃣ بناء المفهوم -->
      <div style="background: linear-gradient(135deg, #43C6AC 0%, #191654 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
        <h3>📚 مفهوم توازي مستقيمين</h3>
      </div>
      <div style="background-color: #e3f2fd; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="border-right: 8px solid #1976D2; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h4>🔷 <span style="color: #1976D2;">تعريف المستقيمين المتوازيين</span></h4>
          <p>مستقيمان متوازيان هما مستقيمان لا يلتقيان مهما مددناها، والمسافة بينهما ثابتة.</p>
          <div style="text-align: center; margin: 20px 0;">
            <svg width="300" height="120" viewBox="0 0 300 120">
              <line x1="30" y1="40" x2="270" y2="40" stroke="blue" stroke-width="4"/>
              <line x1="30" y1="80" x2="270" y2="80" stroke="red" stroke-width="4"/>
              <!-- مسافات متساوية -->
              <line x1="50" y1="40" x2="50" y2="80" stroke="green" stroke-width="2" stroke-dasharray="5"/>
              <line x1="150" y1="40" x2="150" y2="80" stroke="green" stroke-width="2" stroke-dasharray="5"/>
              <line x1="250" y1="40" x2="250" y2="80" stroke="green" stroke-width="2" stroke-dasharray="5"/>
              <text x="45" y="95" fill="green">d</text>
              <text x="145" y="95" fill="green">d</text>
              <text x="245" y="95" fill="green">d</text>
            </svg>
            <p><strong>(d) // (l)</strong> تعني أن (d) يوازي (l)</p>
          </div>
        </div>
        <div style="border-right: 8px solid #c2185b; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h4>🔷 <span style="color: #c2185b;">مستقيمان متقاطعان</span></h4>
          <p>مستقيمان متقاطعان هما مستقيمان يشتركان في نقطة واحدة تسمى نقطة التقاطع.</p>
          <div style="text-align: center; margin: 20px 0;">
            <svg width="250" height="150" viewBox="0 0 250 150">
              <line x1="30" y1="30" x2="220" y2="120" stroke="blue" stroke-width="4"/>
              <line x1="30" y1="120" x2="220" y2="30" stroke="red" stroke-width="4"/>
              <circle cx="125" cy="75" r="5" fill="black"/>
              <text x="130" y="70" fill="black">O</text>
              <text x="30" y="25" fill="blue">(d)</text>
              <text x="200" y="30" fill="red">(l)</text>
            </svg>
            <p><strong>(d) ∩ (l) = {O}</strong> يعني أن (d) و (l) يتقاطعان في O</p>
          </div>
        </div>
        <div style="border-right: 8px solid #4CAF50; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h4>🔷 <span style="color: #4CAF50;">الرموز والمصطلحات</span></h4>
          <table style="width:100%; border-collapse: collapse;">
            <tr><th>الرمز</th><th>القراءة</th><th>المعنى</th></tr>
            <tr><td>(d) // (l)</td><td>(d) يوازي (l)</td><td>المستقيمان متوازيان</td></tr>
            <tr><td>(d) ∩ (l) = {A}</td><td>تقاطع (d) و (l) هو A</td><td>المستقيمان يتقاطعان في A</td></tr>
            <tr><td>A ∈ (d)</td><td>A تنتمي إلى (d)</td><td>النقطة A تقع على المستقيم (d)</td></tr>
            <tr><td>∅</td><td>مجموعة خالية</td><td>لا تقاطع</td></tr>
          </table>
        </div>
        <div style="border-right: 8px solid #FF9800; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h4>🔷 <span style="color: #FF9800;">خاصية هامة</span></h4>
          <p>إذا كان مستقيمان متوازيين، فكل عمودي على أحدهما يكون عمودياً على الآخر.</p>
          <div style="text-align: center; margin: 20px 0;">
            <svg width="250" height="150" viewBox="0 0 250 150">
              <line x1="30" y1="40" x2="220" y2="40" stroke="blue" stroke-width="4"/>
              <line x1="30" y1="100" x2="220" y2="100" stroke="red" stroke-width="4"/>
              <line x1="125" y1="20" x2="125" y2="120" stroke="green" stroke-width="4" stroke-dasharray="5"/>
              <path d="M120 40 L120 35 L125 35 L125 40 Z" fill="green"/>
              <path d="M120 100 L120 95 L125 95 L125 100 Z" fill="green"/>
              <text x="100" y="15" fill="green">(p)</text>
            </svg>
            <p>إذا كان (d) // (l) و (p) ⊥ (d) فإن (p) ⊥ (l)</p>
          </div>
        </div>
      </div>

      <!-- 4️⃣ تمثيل متعدد للمفهوم -->
      <div style="background: linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
        <h3>🎭 أربع تمثيلات لتوازي مستقيمين</h3>
      </div>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;">
        <div style="background: linear-gradient(145deg, #ffffff, #e3f2fd); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <h4 style="color: #1976D2; text-align: center; font-size: 1.5em;">🔢 تمثيل هندسي</h4>
          <div style="text-align: center;">
            <svg width="200" height="100" viewBox="0 0 200 100">
              <line x1="20" y1="30" x2="180" y2="30" stroke="blue" stroke-width="4"/>
              <line x1="20" y1="70" x2="180" y2="70" stroke="red" stroke-width="4"/>
              <text x="20" y="25" fill="blue">(d)</text>
              <text x="20" y="90" fill="red">(l)</text>
            </svg>
          </div>
        </div>
        <div style="background: linear-gradient(145deg, #ffffff, #ffebee); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <h4 style="color: #c2185b; text-align: center; font-size: 1.5em;">📝 تمثيل لفظي</h4>
          <ul style="font-size: 1.2em; list-style-type: none; padding: 0;">
            <li style="margin: 15px 0;">✓ "المستقيمان لا يلتقيان"</li>
            <li style="margin: 15px 0;">✓ "المسافة بينهما ثابتة"</li>
            <li style="margin: 15px 0;">✓ "لهما نفس الاتجاه"</li>
          </ul>
        </div>
        <div style="background: linear-gradient(145deg, #ffffff, #e8f5e9); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <h4 style="color: #4CAF50; text-align: center; font-size: 1.5em;">🔣 تمثيل رمزي</h4>
          <div style="text-align: center; font-size: 2em;">
            <p>(d) // (l)</p>
            <p>(d) ∩ (l) = ∅</p>
          </div>
        </div>
        <div style="background: linear-gradient(145deg, #ffffff, #fff3e0); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <h4 style="color: #FF9800; text-align: center; font-size: 1.5em;">📊 تمثيل جدولي</h4>
          <table style="width:100%; border-collapse: collapse; text-align: center;">
            <tr style="background-color: #FF9800; color: white;">
              <th style="padding: 10px;">الحالة</th>
              <th style="padding: 10px;">عدد نقاط التقاطع</th>
              <th style="padding: 10px;">الرمز</th>
            </tr>
            <tr style="background-color: #fff3e0;">
              <td>متوازيان</td>
              <td>0</td>
              <td>(d) // (l)</td>
            </tr>
            <tr style="background-color: #ffe0b2;">
              <td>متقاطعان</td>
              <td>1</td>
              <td>(d) ∩ (l) = {O}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- 5️⃣ أمثلة محلولة تدريجيًا -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 15px; margin: 20px 0;">
        <div style="background-color: white; padding: 20px; border-radius: 10px;">
          <h4>📌 مثال 1: بسيط جدًا - التعرف على المستقيمات المتوازية</h4>
          <p style="font-size: 1.3em;"><strong style="color: #1976D2;">المطلوب:</strong> حدد المستقيمات المتوازية في الشكل</p>
          <div style="text-align: center;">
            <svg width="300" height="150" viewBox="0 0 300 150">
              <line x1="30" y1="30" x2="270" y2="30" stroke="blue" stroke-width="3"/>
              <text x="30" y="25" fill="blue">(d)</text>
              <line x1="30" y1="70" x2="270" y2="70" stroke="red" stroke-width="3"/>
              <text x="30" y="65" fill="red">(l)</text>
              <line x1="30" y1="110" x2="270" y2="110" stroke="green" stroke-width="3"/>
              <text x="30" y="105" fill="green">(m)</text>
              <line x1="50" y1="10" x2="200" y2="130" stroke="purple" stroke-width="3"/>
              <text x="200" y="140" fill="purple">(n)</text>
            </svg>
          </div>
          <div style="margin-top: 20px;">
            <p><strong style="color: #1976D2;">🔍 التفكير:</strong> المستقيمات المتوازية هي التي لها نفس الاتجاه ولا تلتقي</p>
            <p><strong style="color: #1976D2;">النتيجة:</strong> (d) // (l) // (m) لأنها أفقية، بينما (n) متقاطع معها</p>
          </div>
        </div>
      </div>

      <div style="background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%); padding: 20px; border-radius: 15px; margin: 20px 0;">
        <div style="background-color: white; padding: 20px; border-radius: 10px;">
          <h4>📌 مثال 2: متوسط - كتابة العلاقات</h4>
          <p style="font-size: 1.3em;"><strong style="color: #FF9800;">المطلوب:</strong> اكتب العلاقات بين المستقيمات في الشكل</p>
          <div style="text-align: center;">
            <svg width="300" height="150" viewBox="0 0 300 150">
              <line x1="30" y1="40" x2="270" y2="40" stroke="blue" stroke-width="3"/>
              <text x="30" y="35" fill="blue">(d)</text>
              <line x1="30" y1="90" x2="270" y2="90" stroke="red" stroke-width="3"/>
              <text x="30" y="85" fill="red">(l)</text>
              <line x1="50" y1="30" x2="260" y2="110" stroke="green" stroke-width="3"/>
              <text x="260" y="130" fill="green">(m)</text>
            </svg>
          </div>
          <div style="margin-top: 20px;">
            <p><strong style="color: #FF9800;">🔍 التفكير:</strong> (d) و (l) متوازيان، (m) يقطعهما</p>
            <p><strong style="color: #FF9800;">النتيجة:</strong> (d) // (l) ، (d) ∩ (m) = {A} ، (l) ∩ (m) = {B}</p>
          </div>
        </div>
      </div>

      <div style="background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%); padding: 20px; border-radius: 15px; margin: 20px 0;">
        <div style="background-color: white; padding: 20px; border-radius: 10px;">
          <h4>📌 مثال 3: يتطلب تحليل - إيجاد المستقيمات المتوازية في شكل معقد</h4>
          <p style="font-size: 1.3em;"><strong style="color: #4CAF50;">المعطيات:</strong> مستطيل ABCD حيث (AB) // (CD) و (AD) // (BC)</p>
          <div style="text-align: center;">
            <svg width="250" height="150" viewBox="0 0 250 150">
              <rect x="40" y="30" width="170" height="80" fill="none" stroke="black" stroke-width="3"/>
              <text x="30" y="25" fill="blue">A</text>
              <text x="215" y="25" fill="blue">B</text>
              <text x="215" y="125" fill="blue">C</text>
              <text x="30" y="125" fill="blue">D</text>
              <line x1="30" y1="70" x2="220" y2="70" stroke="red" stroke-width="2" stroke-dasharray="5"/>
              <text x="250" y="70" fill="red">(EF)</text>
            </svg>
          </div>
          <p><strong style="color: #4CAF50;">🔍 تحليل:</strong> نبحث عن جميع علاقات التوازي</p>
          <p><strong style="color: #4CAF50;">النتيجة:</strong> (AB) // (CD)، (AD) // (BC)، (EF) // (AB) // (CD)</p>
        </div>
      </div>

      <div style="background: linear-gradient(135deg, #9C27B0 0%, #6A1B9A 100%); padding: 20px; border-radius: 15px; margin: 20px 0;">
        <div style="background-color: white; padding: 20px; border-radius: 10px;">
          <h4>📌 مثال 4: تطبيقي من الحياة اليومية</h4>
          <p style="font-size: 1.3em;"><strong style="color: #9C27B0;">الوضعية:</strong> في ملعب كرة القدم، خطا التماس متوازيان، وخطا المرمى متوازيان أيضاً.</p>
          <div style="text-align: center;">
            <svg width="300" height="150" viewBox="0 0 300 150">
              <rect x="40" y="30" width="220" height="80" fill="#c8e6c9" stroke="green" stroke-width="4"/>
              <line x1="30" y1="30" x2="270" y2="30" stroke="white" stroke-width="3"/>
              <text x="1000" y="25" fill="black">(d)</text>
              <line x1="30" y1="110" x2="270" y2="110" stroke="white" stroke-width="3"/>
              <text x="100" y="125" fill="black">(l)</text>
              <line x1="40" y1="20" x2="40" y2="140" stroke="white" stroke-width="3"/>
              <text x="25" y="70" fill="black">(m)</text>
              <line x1="260" y1="20" x2="260" y2="140" stroke="white" stroke-width="3"/>
              <text x="280" y="60" fill="black">(n)</text>
            </svg>
          </div>
          <p><strong style="color: #9C27B0;">🔍 التفكير:</strong> (d) // (l) (خطا التماس)، (m) // (n) (خطا المرمى)</p>
          <p><strong style="color: #9C27B0;">النتيجة:</strong> (d) // (l) ، (m) // (n)</p>
        </div>
      </div>

      <!-- 6️⃣ أخطاء شائعة وتحليلها -->
      <div style="background-color: #ffebee; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <h3>⚠️ لماذا نقع في الخطأ؟ وكيف نتفاداه؟</h3>
        <div style="overflow-x: auto;">
          <table style="width:100%; border-collapse: collapse; text-align: center;">
            <tr style="background-color: #c62828; color: white;">
              <th style="padding: 15px;">الخطأ</th>
              <th style="padding: 15px;">مثاله</th>
              <th style="padding: 15px;">لماذا يحدث؟</th>
              <th style="padding: 15px;">كيف نتفاداه؟</th>
            </tr>
            <tr style="background-color: #ffcdd2;">
              <td style="padding: 15px; font-weight: bold;">الخطأ 1</td>
              <td style="padding: 15px;">الاعتقاد أن أي مستقيمين لا يلتقيان في الرسم متوازيان</td>
              <td style="padding: 15px;">قد يلتقيان خارج الرسم</td>
              <td style="padding: 15px;">نتأكد من أن المسافة بينهما ثابتة</td>
            </tr>
            <tr style="background-color: #ef9a9a;">
              <td style="padding: 15px; font-weight: bold;">الخطأ 2</td>
              <td style="padding: 15px;">كتابة (d) ⊥ (l) بدل (d) // (l)</td>
              <td style="padding: 15px;">الخلط بين الرموز</td>
              <td style="padding: 15px;">نتذكر: // للتوازي، ⊥ للتعامد</td>
            </tr>
            <tr style="background-color: #e57373;">
              <td style="padding: 15px; font-weight: bold;">الخطأ 3</td>
              <td style="padding: 15px;">الاعتقاد أن المستقيمين المتقاطعين متوازيان</td>
              <td style="padding: 15px;">عدم فهم التعريف</td>
              <td style="padding: 15px;">المتوازيان لا يلتقيان أبداً</td>
            </tr>
            <tr style="background-color: #ef5350;">
              <td style="padding: 15px; font-weight: bold;">الخطأ 4</td>
              <td style="padding: 15px;">(d) // (l) تعني أن (d) عمودي على (l)</td>
              <td style="padding: 15px;">الخلط بين المصطلحات</td>
              <td style="padding: 15px;">// تعني يوازي وليس يعامد</td>
            </tr>
          </table>
        </div>
        <div style="background-color: #c8e6c9; padding: 20px; border-radius: 10px; margin-top: 20px;">
          <h4>✅ كيف نتحقق من صحة الحل؟</h4>
          <ul style="font-size: 1.1em;">
            <li>✓ نمدد المستقيمين ذهنياً: هل يلتقيان؟</li>
            <li>✓ نقيس المسافة بينهما في عدة نقاط: هل هي ثابتة؟</li>
            <li>✓ نتحقق من الرمز المستخدم: // للتوازي</li>
          </ul>
        </div>
      </div>

      <!-- 8️⃣ فقرة "نفكر معًا" -->
      <div style="background: linear-gradient(135deg, #FF6B6B 0%, #C2185B 100%); padding: 30px; border-radius: 15px; margin: 20px 0;">
        <div style="background-color: white; padding: 25px; border-radius: 10px; text-align: center;">
          <h3>💭 سؤال مفتوح للتفكير</h3>
          <p style="font-size: 1.5em; color: #c2185b; font-weight: bold;">هل يمكن لمستقيمين أن يكونا متوازيين ومتقاطعين في نفس الوقت؟</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-top: 20px;">
            <p>🔍 فكر في التعريف:</p>
            <p>المتوازيان لا يلتقيان أبداً</p>
            <p>المتقاطعان يلتقيان في نقطة</p>
            <p>إذن لا يمكن!</p>
          </div>
        </div>
      </div>

      <!-- 9️⃣ تقويم تكويني قصير -->
      <div style="background: linear-gradient(135deg, #4ECDC4 0%, #2C3E50 100%); padding: 25px; border-radius: 15px; margin: 20px 0;">
        <div style="background-color: white; padding: 25px; border-radius: 10px;">
          <h3>📝 5 أسئلة سريعة</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
            <div style="background-color: #e3f2fd; padding: 15px; border-radius: 10px;">
              <p><strong>1. رمز التوازي هو؟</strong></p>
              <p style="background-color: #1976D2; color: white; padding: 10px; border-radius: 5px;">//</p>
            </div>
            <div style="background-color: #fff3e0; padding: 15px; border-radius: 10px;">
              <p><strong>2. مستقيمان متوازيان ...</strong></p>
              <p style="background-color: #FF9800; color: white; padding: 10px; border-radius: 5px;">لا يلتقيان</p>
            </div>
            <div style="background-color: #e8f5e9; padding: 15px; border-radius: 10px;">
              <p><strong>3. (d) // (l) تعني؟</strong></p>
              <p style="background-color: #4CAF50; color: white; padding: 10px; border-radius: 5px;">d يوازي l</p>
            </div>
            <div style="background-color: #f3e5f5; padding: 15px; border-radius: 10px;">
              <p><strong>4. إذا تقاطع مستقيمان في نقطة O نكتب؟</strong></p>
              <p style="background-color: #9C27B0; color: white; padding: 10px; border-radius: 5px;">(d) ∩ (l) = {O}</p>
            </div>
            <div style="grid-column: span 2; background-color: #ffebee; padding: 15px; border-radius: 10px;">
              <p><strong>5. عدد نقاط تقاطع مستقيمين متوازيين؟</strong></p>
              <p style="background-color: #c2185b; color: white; padding: 10px; border-radius: 5px;">0</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ✨ خلاصة الدرس -->
      <div style="background: linear-gradient(135deg, #43C6AC 0%, #191654 100%); padding: 30px; border-radius: 15px; margin: 30px 0; text-align: center; color: white;">
        <h3>📌 ملخص توازي مستقيمين</h3>
        <div style="display: flex; justify-content: space-around; margin: 30px 0; flex-wrap: wrap;">
          <div style="background-color: rgba(255,255,255,0.9); padding: 25px; border-radius: 15px; width: 40%; margin: 10px;">
          <h3 style="color: #1976D2;">🔷 المستقيمان المتوازيان</h3>
            
          <svg width="250" height="120" viewBox="0 0 250 120">
            <!-- قضبان متوازية -->
            <line x1="20" y1="40" x2="230" y2="40" stroke="black" stroke-width="4"/>
            <line x1="20" y1="80" x2="230" y2="80" stroke="black" stroke-width="4"/>
            <!-- عوارض عرضية -->
            <line x1="30" y1="40" x2="30" y2="80" stroke="gray" stroke-width="2" stroke-dasharray="5"/>
            <line x1="220" y1="40" x2="220" y2="80" stroke="gray" stroke-width="2" stroke-dasharray="5"/>
            <line x1="90" y1="40" x2="90" y2="80" stroke="gray" stroke-width="2" stroke-dasharray="5"/>
            <line x1="160" y1="40" x2="160" y2="80" stroke="gray" stroke-width="2" stroke-dasharray="5"/>
            <!-- تسميات -->
            <text x="20" y="30" fill="blue">(d)</text>
            <text x="20" y="95" fill="red">(l)</text>
          </svg>
            <p style="color: #100000;">لا يلتقيان</p>
            <p style="color: #100000;">المسافة ثابتة</p>
            <p style="font-size: 1.5em; color: #100000;">(d) // (l)</p>
          </div>
          <div style="background-color: rgba(255,255,255,0.9); padding: 25px; border-radius: 15px; width: 40%; margin: 10px;">
            <h3 style="color: #c2185b;">🔶 المستقيمان المتقاطعان</h3>

            <svg width="200" height="120" viewBox="0 0 200 120">
                <!-- مستقيمان غير متوازيين -->
                <line x1="20" y1="20" x2="180" y2="100" stroke="red" stroke-width="4"/>
                <line x1="20" y1="100" x2="180" y2="20" stroke="blue" stroke-width="4"/>
                <circle cx="100" cy="60" r="5" fill="black"/>
                <text x="105" y="55" fill="black">O</text>
                <text x="20" y="15" fill="red">(d)</text>
                <text x="150" y="30" fill="blue">(l)</text>
            </svg>
            <p  style="color: #100000;">يلتقيان في نقطة</p>
            <p  style="color: #100000;">نقطة تقاطع واحدة</p>
            <p style="font-size: 1.5em; color: #100000;">(d) ∩ (l) = {O}</p>
          </div>
        </div>
        <p style="background-color: rgba(255,255,255,0.95); padding: 20px; border-radius: 50px; font-size: 1.5em; color: #333; margin-top: 20px;">
          <strong>✨ التوازي: نفس الاتجاه، المسافة ثابتة، لا يلتقيان ✨</strong>
        </p>
      </div>
    </div>
  `;

  // 5. Create Lesson
  const lesson = await prisma.lesson.create({
    data: {
      title: 'توازي مستقيمين',
      content: lessonContent,
      subjectId: subject.id,
      levelId: level.id,
      authorId: teacher.id,
      status: 'approved',
      type: 'public',
      lessonFileIds: JSON.stringify([]),
      exercises: {
        create: [
          // 🟢 تمارين الدعم (70%)
          {
            type: 'support_with_results',
            question: 'التمرين 01: أكمل الفراغات:\n1) مستقيمان متوازيان هما مستقيمان ...\n2) المسافة بين مستقيمين متوازيين ...\n3) رمز التوازي هو ...\n4) إذا كان (d) // (l) فإن عدد نقاط تقاطعهما هو ...',
            expectedResults: JSON.stringify([
              { question: "1", result: "لا يلتقيان", tolerance: 0 },
              { question: "2", result: "ثابتة", tolerance: 0 },
              { question: "3", result: "//", tolerance: 0 },
              { question: "4", result: "0", tolerance: 0 }
            ]),
            displayOrder: 1,
            maxScore: 4,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'support_with_results',
            question: 'التمرين 02: ضع الرمز المناسب:\n1) (d) يوازي (l)\n2) (m) و (n) متوازيان\n3) (p) و (q) متقاطعان في O\n4) (d) لا يوازي (l)',
            expectedResults: JSON.stringify([
              { question: "1", result: "(d) // (l)", tolerance: 0 },
              { question: "2", result: "(m) // (n)", tolerance: 0 },
              { question: "3", result: "(p) ∩ (q) = {O}", tolerance: 0 },
              { question: "4", result: "(d) ∦ (l)", tolerance: 0 }
            ]),
            displayOrder: 2,
            maxScore: 4,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'support_with_results',
            question: 'التمرين 03: اختر الإجابة الصحيحة:\n1) مستقيمان متوازيان ...\n2) رمز التوازي هو ...\n3) إذا كان (d) ∩ (l) = {A} فهما ...\n4) عدد نقاط تقاطع مستقيمين متوازيين',
            expectedResults: JSON.stringify([
              { question: "1", result: "لا يلتقيان", tolerance: 0 },
              { question: "2", result: "//", tolerance: 0 },
              { question: "3", result: "متقاطعان", tolerance: 0 },
              { question: "4", result: "0", tolerance: 0 }
            ]),
            displayOrder: 3,
            maxScore: 4,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'support_with_results',
            question: 'التمرين 04: لاحظ الشكل ثم أجب:\n1) المستقيمان المتوازيان:\n2) المستقيمان المتقاطعان:',
            expectedResults: JSON.stringify([
              { question: "1", result: "(d) // (l)", tolerance: 0 },
              { question: "2", result: "(d) و (m) ، (l) و (m)", tolerance: 0 }
            ]),
            displayOrder: 4,
            maxScore: 4,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'support_with_results',
            question: 'التمرين 05: أكمل بالرموز:\n1) (d) ... (l)\n2) (d) ... (m)\n3) (l) ... (m)',
            expectedResults: JSON.stringify([
              { question: "1", result: "//", tolerance: 0 },
              { question: "2", result: "//", tolerance: 0 },
              { question: "3", result: "//", tolerance: 0 }
            ]),
            displayOrder: 5,
            maxScore: 3,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'support_only',
            question: 'التمرين 06: ارسم مستقيمين متوازيين (d) و (l)، ثم ارسم مستقيماً (m) يقطعهما. اكتب العلاقات.',
            modelAnswer: '(d) // (l), (d) ∩ (m) = {A}, (l) ∩ (m) = {B}',
            displayOrder: 6,
            maxScore: 3,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'support_with_results',
            question: 'التمرين 07: حدد نوع العلاقة:\n1) (AB) // (CD)\n2) (EF) ⊥ (GH)\n3) (MN) ∩ (PQ) = {O}',
            expectedResults: JSON.stringify([
              { question: "1", result: "متوازيان", tolerance: 0 },
              { question: "2", result: "متعامدان", tolerance: 0 },
              { question: "3", result: "متقاطعان", tolerance: 0 }
            ]),
            displayOrder: 7,
            maxScore: 3,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          // 🔴 التمارين الرئيسية (30%)
          {
            type: 'main',
            question: 'التمرين 08: في مستطيل ABCD، القطران [AC] و [BD] يتقاطعان في O.\nالمطلوب: اكتب علاقات التوازي في الشكل.',
            modelAnswer: '(AB) // (CD)\n(AD) // (BC)\n(AB) // (CD) // (EF) حيث EF منتصفات',
            displayOrder: 8,
            maxScore: 5,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'main',
            question: 'التمرين 09: في مثلث ABC، النقطة M منتصف [AB]، النقطة N منتصف [AC]. المستقيم (MN) يوازي (BC).\nالمطلوب: اكتب جميع علاقات التوازي.',
            modelAnswer: '(MN) // (BC)\nإذا رسمنا (MP) // (AC) فإن (MP) // (AC) و P منتصف [BC]',
            displayOrder: 9,
            maxScore: 5,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'main',
            question: 'التمرين 10: ارسم مستقيمين متوازيين (d) و (l). ارسم مستقيماً (m) يقطعهما في A و B. ارسم مستقيماً (n) يوازي (m) ويقطع (d) و (l) في C و D.\nالمطلوب: اكتب جميع علاقات التوازي.',
            modelAnswer: '(d) // (l)\n(m) // (n)\n(m) يقطع (d) في A و (l) في B\n(n) يقطع (d) في C و (l) في D',
            displayOrder: 10,
            maxScore: 5,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
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