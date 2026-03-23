import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding Lesson: Intersection and Perpendicularity ...');

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
        <h3>🏗️ مشكلة: بناء منزل</h3>
        <p>في موقع بناء منزل بمدينة البليدة، وضع المهندس علامات لتحديد زوايا البناء. لاحظ العمال أن بعض الخطوط تتقاطع وبعضها متعامد.</p>
      </div>

      <div style="display: flex; justify-content: center; gap: 30px; margin: 30px 0; flex-wrap: wrap;">
        <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <svg width="200" height="150" viewBox="0 0 200 150">
            <!-- مستقيمان متقاطعان -->
            <line x1="30" y1="30" x2="170" y2="120" stroke="blue" stroke-width="4"/>
            <line x1="30" y1="120" x2="170" y2="30" stroke="red" stroke-width="4"/>
            <circle cx="100" cy="75" r="5" fill="black"/>
            <text x="105" y="65" fill="black">O</text>
            <text x="30" y="25" fill="blue">(d)</text>
            <text x="150" y="30" fill="red">(l)</text>
          </svg>
          <p><strong>مستقيمان متقاطعان</strong></p>
          <p>(d) ∩ (l) = {O}</p>
        </div>
        <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <svg width="200" height="150" viewBox="0 0 200 150">
            <!-- مستقيمان متعامدان -->
            <line x1="30" y1="75" x2="170" y2="75" stroke="blue" stroke-width="4"/>
            <line x1="100" y1="30" x2="100" y2="120" stroke="red" stroke-width="4"/>
            <circle cx="100" cy="75" r="5" fill="black"/>
            <path d="M90 75 L90 65 L100 65 L100 75 Z" fill="green"/>
            <text x="95" y="70" fill="black">O</text>
            <text x="30" y="65" fill="blue">(d)</text>
            <text x="80" y="25" fill="red">(l)</text>
          </svg>
          <p><strong>مستقيمان متعامدان</strong></p>
          <p>(d) ⊥ (l)</p>
        </div>
      </div>
      <p>🔍 لاحظ العمال أن بعض الخطوط تلتقي في نقطة، وبعضها الآخر يلتقي بزاوية قائمة.</p>
      <p><strong>❓ التساؤلات:</strong></p>
      <ul>
        <li>كيف نسمي المستقيمات التي تلتقي في نقطة؟</li>
        <li>ما الفرق بين المستقيمات المتقاطعة والمتعامدة؟</li>
        <li>كيف نرمز للتقاطع والتعامد؟</li>
      </ul>

      <!-- 2️⃣ مرحلة البحث والاكتشاف -->
      <div style="background-color: #fff9e6; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <h3>🧪 نشاط استكشافي: هيا نكتشف التقاطع والتعامد!</h3>
        <h4>📌 النشاط 1: مستقيمان متقاطعان</h4>
        <p>ارسم مستقيمين يتقاطعان في نقطة واحدة.</p>
        <div style="display: flex; justify-content: center; margin: 30px 0;">
          <svg width="250" height="150" viewBox="0 0 250 150">
            <line x1="30" y1="30" x2="220" y2="120" stroke="#1976D2" stroke-width="4"/>
            <line x1="30" y1="120" x2="220" y2="30" stroke="#FF9800" stroke-width="4"/>
            <circle cx="125" cy="75" r="5" fill="black"/>
            <text x="130" y="65" fill="black">O</text>
            <text x="30" y="25" fill="#1976D2">(d)</text>
            <text x="200" y="30" fill="#FF9800">(l)</text>
          </svg>
        </div>
        <p><strong>❓ أسئلة موجهة:</strong></p>
        <ul>
          <li>كم نقطة مشتركة بين المستقيمين؟ <span style="background-color: #1976D2; color: white; padding: 3px 8px; border-radius: 15px;">نقطة واحدة</span></li>
          <li>ماذا نسميها؟ <span style="background-color: #FF9800; color: white; padding: 3px 8px; border-radius: 15px;">نقطة التقاطع</span></li>
          <li>كيف نكتب ذلك بالرموز؟ <span style="background-color: #4CAF50; color: white; padding: 3px 8px; border-radius: 15px;">(d) ∩ (l) = {O}</span></li>
        </ul>

        <h4>📌 النشاط 2: مستقيمان متعامدان</h4>
        <p>ارسم مستقيمين متعامدين (يشكلان زاوية قائمة).</p>
        <div style="display: flex; justify-content: center; margin: 30px 0;">
          <svg width="250" height="150" viewBox="0 0 250 150">
            <line x1="30" y1="75" x2="220" y2="75" stroke="#1976D2" stroke-width="4"/>
            <line x1="125" y1="30" x2="125" y2="120" stroke="#FF9800" stroke-width="4"/>
            <circle cx="125" cy="75" r="5" fill="black"/>
            <path d="M115 75 L115 65 L125 65 L125 75 Z" fill="green"/>
            <text x="125" y="65" fill="black">O</text>
            <text x="30" y="65" fill="#1976D2">(d)</text>
            <text x="105" y="25" fill="#FF9800">(l)</text>
          </svg>
        </div>
        <p><strong>❓ أسئلة موجهة:</strong></p>
        <ul>
          <li>كم زاوية شكلها المستقيمان؟ <span style="background-color: #c2185b; color: white; padding: 3px 8px; border-radius: 15px;">4 زوايا</span></li>
          <li>ما قياس كل زاوية؟ <span style="background-color: #9C27B0; color: white; padding: 3px 8px; border-radius: 15px;">90°</span></li>
          <li>كيف نكتب ذلك بالرموز؟ <span style="background-color: #4CAF50; color: white; padding: 3px 8px; border-radius: 15px;">(d) ⊥ (l)</span></li>
        </ul>
      </div>

      <!-- 3️⃣ بناء المفهوم -->
      <div style="background: linear-gradient(135deg, #43C6AC 0%, #191654 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
        <h3>📚 تقاطع وتعامد مستقيمين</h3>
      </div>
      <div style="background-color: #e3f2fd; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="border-right: 8px solid #1976D2; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h4>🔷 <span style="color: #1976D2;">مستقيمان متقاطعان</span></h4>
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
            <p><strong>(d) ∩ (l) = {O}</strong> تعني أن (d) و (l) يتقاطعان في O</p>
          </div>
        </div>
        <div style="border-right: 8px solid #c2185b; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h4>🔷 <span style="color: #c2185b;">مستقيمان متعامدان</span></h4>
          <p>مستقيمان متعامدان هما مستقيمان متقاطعان يشكلان زاوية قائمة (قياسها 90°).</p>
          <div style="text-align: center; margin: 20px 0;">
            <svg width="250" height="150" viewBox="0 0 250 150">
              <line x1="30" y1="75" x2="220" y2="75" stroke="blue" stroke-width="4"/>
              <line x1="125" y1="30" x2="125" y2="120" stroke="red" stroke-width="4"/>
              <circle cx="125" cy="75" r="5" fill="black"/>
              <path d="M115 75 L115 65 L125 65 L125 75 Z" fill="green"/>
              <text x="125" y="65" fill="black">O</text>
              <text x="30" y="65" fill="blue">(d)</text>
              <text x="105" y="25" fill="red">(l)</text>
            </svg>
            <p><strong>(d) ⊥ (l)</strong> تعني أن (d) يعامد (l)</p>
          </div>
        </div>
        <div style="border-right: 8px solid #4CAF50; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h4>🔷 <span style="color: #4CAF50;">الرموز والمصطلحات</span></h4>
          <table style="width:100%; border-collapse: collapse;">
            <tr><th>الرمز</th><th>القراءة</th><th>المعنى</th></tr>
            <tr><td>(d) ∩ (l) = {A}</td><td>تقاطع (d) و (l) هو A</td><td>المستقيمان يتقاطعان في A</td></tr>
            <tr><td>(d) ⊥ (l)</td><td>(d) يعامد (l)</td><td>المستقيمان متعامدان</td></tr>
            <tr><td>∟</td><td>زاوية قائمة</td><td>زاوية قياسها 90°</td></tr>
            <tr><td>A ∈ (d)</td><td>A تنتمي إلى (d)</td><td>النقطة A تقع على المستقيم (d)</td></tr>
          </table>
        </div>
        <div style="border-right: 8px solid #FF9800; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h4>🔷 <span style="color: #FF9800;">العلاقة بين التقاطع والتعامد</span></h4>
          <p>كل مستقيمين متعامدين هما متقاطعان، ولكن ليس كل مستقيمين متقاطعين متعامدان.</p>
          <div style="text-align: center; margin: 20px 0;">
            <svg width="400" height="150" viewBox="0 0 400 150">
              <!-- متقاطعان غير متعامدين -->
              <line x1="30" y1="30" x2="170" y2="120" stroke="blue" stroke-width="3"/>
              <line x1="30" y1="120" x2="170" y2="30" stroke="blue" stroke-width="3"/>
              <text x="80" y="80" fill="black">60°</text>
              <text x="30" y="20">متقاطعان</text>
              <!-- متعامدان -->
              <line x1="230" y1="75" x2="370" y2="75" stroke="red" stroke-width="3"/>
              <line x1="300" y1="30" x2="300" y2="120" stroke="red" stroke-width="3"/>
              <path d="M290 75 L290 65 L300 65 L300 75 Z" fill="green"/>
              <text x="280" y="65" fill="green">90°</text>
              <text x="260" y="20">متعامدان</text>
            </svg>
          </div>
        </div>
      </div>

      <!-- 4️⃣ تمثيل متعدد للمفهوم -->
      <div style="background: linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
        <h3>🎭 أربع تمثيلات للتقاطع والتعامد</h3>
      </div>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;">
        <div style="background: linear-gradient(145deg, #ffffff, #e3f2fd); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <h4 style="color: #1976D2; text-align: center; font-size: 1.5em;">🔢 تمثيل هندسي</h4>
          <div style="text-align: center;">
            <svg width="200" height="150" viewBox="0 0 200 150">
              <line x1="30" y1="30" x2="170" y2="120" stroke="blue" stroke-width="3"/>
              <line x1="30" y1="120" x2="170" y2="30" stroke="red" stroke-width="3"/>
              <circle cx="100" cy="75" r="3" fill="black"/>
            </svg>
            <p>تقاطع</p>
          </div>
        </div>
        <div style="background: linear-gradient(145deg, #ffffff, #ffebee); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <h4 style="color: #c2185b; text-align: center; font-size: 1.5em;">🔢 تمثيل هندسي</h4>
          <div style="text-align: center;">
            <svg width="200" height="150" viewBox="0 0 200 150">
              <line x1="30" y1="75" x2="170" y2="75" stroke="blue" stroke-width="3"/>
              <line x1="100" y1="30" x2="100" y2="120" stroke="red" stroke-width="3"/>
              <path d="M90 75 L90 65 L100 65 L100 75 Z" fill="green"/>
              <circle cx="100" cy="75" r="3" fill="black"/>
            </svg>
            <p>تعامد</p>
          </div>
        </div>
        <div style="background: linear-gradient(145deg, #ffffff, #e8f5e9); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <h4 style="color: #4CAF50; text-align: center; font-size: 1.5em;">📝 تمثيل لفظي</h4>
          <ul style="font-size: 1.2em; list-style-type: none; padding: 0;">
            <li style="margin: 15px 0;">✓ "المستقيمان يلتقيان في نقطة"</li>
            <li style="margin: 15px 0;">✓ "يشكلان زاوية قائمة"</li>
            <li style="margin: 15px 0;">✓ "يتقاطعان في O"</li>
          </ul>
        </div>
        <div style="background: linear-gradient(145deg, #ffffff, #fff3e0); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <h4 style="color: #FF9800; text-align: center; font-size: 1.5em;">🔣 تمثيل رمزي</h4>
          <div style="text-align: center; font-size: 1.5em;">
            <p>(d) ∩ (l) = {O}</p>
            <p>(d) ⊥ (l)</p>
            <p>∟</p>
          </div>
        </div>
      </div>

      <!-- 5️⃣ أمثلة محلولة تدريجيًا -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 15px; margin: 20px 0;">
        <div style="background-color: white; padding: 20px; border-radius: 10px;">
          <h4>📌 مثال 1: بسيط جدًا - التعرف على المستقيمات المتقاطعة</h4>
          <p style="font-size: 1.3em;"><strong style="color: #1976D2;">المطلوب:</strong> حدد المستقيمات المتقاطعة في الشكل</p>
          <div style="text-align: center;">
            <svg width="300" height="150" viewBox="0 0 300 150">
              <line x1="30" y1="30" x2="270" y2="30" stroke="blue" stroke-width="3"/>
              <text x="30" y="25" fill="blue">(d)</text>
              <line x1="30" y1="120" x2="270" y2="120" stroke="red" stroke-width="3"/>
              <text x="30" y="115" fill="red">(l)</text>
              <line x1="125" y1="10" x2="125" y2="140" stroke="green" stroke-width="3"/>
              <text x="125" y="20" fill="green">(m)</text>
            </svg>
          </div>
          <div style="margin-top: 20px;">
            <p><strong style="color: #1976D2;">🔍 التفكير:</strong> المستقيمات المتقاطعة هي التي تلتقي في نقطة</p>
            <p><strong style="color: #1976D2;">النتيجة:</strong> (d) و (m) يتقاطعان، (l) و (m) يتقاطعان، (d) و (l) متوازيان</p>
          </div>
        </div>
      </div>

      <div style="background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%); padding: 20px; border-radius: 15px; margin: 20px 0;">
        <div style="background-color: white; padding: 20px; border-radius: 10px;">
          <h4>📌 مثال 2: متوسط - كتابة علاقات التقاطع</h4>
          <p style="font-size: 1.3em;"><strong style="color: #FF9800;">المطلوب:</strong> اكتب علاقات التقاطع في الشكل</p>
          <div style="text-align: center;">
            <svg width="250" height="150" viewBox="0 0 250 150">
              <line x1="30" y1="30" x2="220" y2="30" stroke="blue" stroke-width="3"/>
              <text x="30" y="25" fill="blue">(d)</text>
              <line x1="30" y1="120" x2="220" y2="120" stroke="red" stroke-width="3"/>
              <text x="30" y="115" fill="red">(l)</text>
              <line x1="125" y1="10" x2="125" y2="140" stroke="green" stroke-width="3"/>
              <text x="120" y="20" fill="green">(m)</text>
            </svg>
          </div>
          <div style="margin-top: 20px;">
            <p><strong style="color: #FF9800;">🔍 التفكير:</strong> (d) ∩ (m) = {A}، (l) ∩ (m) = {B}</p>
            <p><strong style="color: #FF9800;">النتيجة:</strong> (d) ∩ (m) = {A}، (l) ∩ (m) = {B}</p>
          </div>
        </div>
      </div>

      <div style="background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%); padding: 20px; border-radius: 15px; margin: 20px 0;">
        <div style="background-color: white; padding: 20px; border-radius: 10px;">
          <h4>📌 مثال 3: يتطلب تحليل - التعرف على المستقيمات المتعامدة</h4>
          <p style="font-size: 1.3em;"><strong style="color: #4CAF50;">المطلوب:</strong> حدد المستقيمات المتعامدة في الشكل</p>
          <div style="text-align: center;">
            <svg width="300" height="150" viewBox="0 0 300 150">
              <line x1="30" y1="75" x2="270" y2="75" stroke="blue" stroke-width="3"/>
              <text x="30" y="70" fill="blue">(d)</text>
              <line x1="150" y1="30" x2="150" y2="120" stroke="red" stroke-width="3"/>
              <text x="165" y="50" fill="red">(l)</text>
              <path d="M140 75 L140 65 L150 65 L150 75 Z" fill="green"/>
              <line x1="100" y1="30" x2="100" y2="120" stroke="purple" stroke-width="3" stroke-dasharray="5"/>
              <text x="95" y="50" fill="purple">(m)</text>
            </svg>
          </div>
          <div style="margin-top: 20px;">
            <p><strong style="color: #4CAF50;">🔍 تحليل:</strong> (d) ⊥ (l) لأن بينهما زاوية قائمة، (d) و (m) ليسا متعامدين</p>
            <p><strong style="color: #4CAF50;">النتيجة:</strong> (d) ⊥ (l)</p>
          </div>
        </div>
      </div>

      <div style="background: linear-gradient(135deg, #9C27B0 0%, #6A1B9A 100%); padding: 20px; border-radius: 15px; margin: 20px 0;">
        <div style="background-color: white; padding: 20px; border-radius: 10px;">
          <h4>📌 مثال 4: تطبيقي من الحياة اليومية</h4>
          <p style="font-size: 1.3em;"><strong style="color: #9C27B0;">الوضعية:</strong> في ملعب كرة القدم، خطا التماس متوازيان، وخط المرمى يتعامد مع خط التماس.</p>
          <div style="text-align: center;">
            <svg width="300" height="150" viewBox="0 0 300 150">
              <rect x="40" y="30" width="220" height="80" fill="#c8e6c9" stroke="green" stroke-width="4"/>
              <line x1="40" y1="30" x2="260" y2="30" stroke="white" stroke-width="3"/>
              <text x="100" y="25" fill="black">(d)</text>
              <line x1="40" y1="110" x2="260" y2="110" stroke="white" stroke-width="3"/>
              <text x="100" y="115" fill="black">(l)</text>
              <line x1="40" y1="30" x2="40" y2="110" stroke="white" stroke-width="3"/>
              <text x="30" y="60" fill="black">(m)</text>
              <path d="M40 30 L50 30 L50 40 L40 40 Z" fill="green"/>
            </svg>
          </div>
          <p><strong style="color: #9C27B0;">🔍 التفكير:</strong> (d) // (l)، (m) ⊥ (d)، (m) ⊥ (l)</p>
          <p><strong style="color: #9C27B0;">النتيجة:</strong> (d) // (l)، (m) ⊥ (d)، (m) ⊥ (l)</p>
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
              <td style="padding: 15px;">الاعتقاد أن كل مستقيمين متقاطعين متعامدان</td>
              <td style="padding: 15px;">الخلط بين التقاطع والتعامد</td>
              <td style="padding: 15px;">التعامد حالة خاصة من التقاطع</td>
            </tr>
            <tr style="background-color: #ef9a9a;">
              <td style="padding: 15px; font-weight: bold;">الخطأ 2</td>
              <td style="padding: 15px;">كتابة (d) ⊥ (l) بدل (d) ∩ (l) = {O}</td>
              <td style="padding: 15px;">الخلط بين الرموز</td>
              <td style="padding: 15px;">نتذكر: ⊥ للتعامد، ∩ للتقاطع</td>
            </tr>
            <tr style="background-color: #e57373;">
              <td style="padding: 15px; font-weight: bold;">الخطأ 3</td>
              <td style="padding: 15px;">نسيان كتابة نقطة التقاطع</td>
              <td style="padding: 15px;">عدم الدقة في الترميز</td>
              <td style="padding: 15px;">نكتب (d) ∩ (l) = {O} وليس فقط (d) ∩ (l)</td>
            </tr>
            <tr style="background-color: #ef5350;">
              <td style="padding: 15px; font-weight: bold;">الخطأ 4</td>
              <td style="padding: 15px;">عدم تمييز الزاوية القائمة</td>
              <td style="padding: 15px;">عدم استخدام الرمز ∟</td>
              <td style="padding: 15px;">نضع المربع الصغير للدلالة على الزاوية القائمة</td>
            </tr>
          </table>
        </div>
        <div style="background-color: #c8e6c9; padding: 20px; border-radius: 10px; margin-top: 20px;">
          <h4>✅ كيف نتحقق من صحة الحل؟</h4>
          <ul style="font-size: 1.1em;">
            <li>✓ نتحقق من وجود نقطة التقاطع</li>
            <li>✓ نقيس الزاوية بين المستقيمين للتأكد من التعامد</li>
            <li>✓ نستخدم الرموز الصحيحة: ∩ للتقاطع، ⊥ للتعامد</li>
          </ul>
        </div>
      </div>

      <!-- 8️⃣ فقرة "نفكر معًا" -->
      <div style="background: linear-gradient(135deg, #FF6B6B 0%, #C2185B 100%); padding: 30px; border-radius: 15px; margin: 20px 0;">
        <div style="background-color: white; padding: 25px; border-radius: 10px; text-align: center;">
          <h3>💭 سؤال مفتوح للتفكير</h3>
          <p style="font-size: 1.5em; color: #c2185b; font-weight: bold;">هل يمكن أن يكون مستقيمان متقاطعين وغير متعامدين؟ أعط مثالاً من الحياة اليومية.</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-top: 20px;">
            <p>🔰 نعم، مثل تقاطع خطين في مثلث غير قائم، أو تقاطع طريقين غير متعامدين.</p>
          </div>
        </div>
      </div>

      <!-- 9️⃣ تقويم تكويني قصير -->
      <div style="background: linear-gradient(135deg, #4ECDC4 0%, #2C3E50 100%); padding: 25px; border-radius: 15px; margin: 20px 0;">
        <div style="background-color: white; padding: 25px; border-radius: 10px;">
          <h3>📝 5 أسئلة سريعة</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
            <div style="background-color: #e3f2fd; padding: 15px; border-radius: 10px;">
              <p><strong>1. رمز التقاطع هو؟</strong></p>
              <p style="background-color: #1976D2; color: white; padding: 10px; border-radius: 5px;">∩</p>
            </div>
            <div style="background-color: #fff3e0; padding: 15px; border-radius: 10px;">
              <p><strong>2. رمز التعامد هو؟</strong></p>
              <p style="background-color: #FF9800; color: white; padding: 10px; border-radius: 5px;">⊥</p>
            </div>
            <div style="background-color: #e8f5e9; padding: 15px; border-radius: 10px;">
              <p><strong>3. قياس الزاوية القائمة؟</strong></p>
              <p style="background-color: #4CAF50; color: white; padding: 10px; border-radius: 5px;">90°</p>
            </div>
            <div style="background-color: #f3e5f5; padding: 15px; border-radius: 10px;">
              <p><strong>4. (d) ⊥ (l) تعني؟</strong></p>
              <p style="background-color: #9C27B0; color: white; padding: 10px; border-radius: 5px;">d يعامد l</p>
            </div>
            <div style="grid-column: span 2; background-color: #ffebee; padding: 15px; border-radius: 10px;">
              <p><strong>5. (d) ∩ (l) = {O} تعني؟</strong></p>
              <p style="background-color: #c2185b; color: white; padding: 10px; border-radius: 5px;">d و l يتقاطعان في O</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ✨ خلاصة الدرس -->
      <div style="background: linear-gradient(135deg, #43C6AC 0%, #191654 100%); padding: 30px; border-radius: 15px; margin: 30px 0; text-align: center; color: white;">
        <h3>📌 ملخص تقاطع وتعامد مستقيمين</h3>
        <div style="display: flex; justify-content: space-around; margin: 30px 0; flex-wrap: wrap;">
          <div style="background-color: rgba(255,255,255,0.9); padding: 25px; border-radius: 15px; width: 40%; margin: 10px;">
            <h3 style="color: #1976D2;">🔷 متقاطعان</h3>
            <svg width="200" height="150" viewBox="0 0 200 150">
                <!-- مستقيمان متقاطعان -->
                <line x1="30" y1="30" x2="170" y2="120" stroke="blue" stroke-width="4"/>
                <line x1="30" y1="120" x2="170" y2="30" stroke="red" stroke-width="4"/>
                <circle cx="100" cy="75" r="5" fill="black"/>
                <text x="105" y="65" fill="black">O</text>
                <text x="30" y="25" fill="blue">(d)</text>
                <text x="150" y="30" fill="red">(l)</text>
            </svg>
            <p style="color: #100000;">نقطة مشتركة واحدة</p>
            <p style="font-size: 1.3em; color: #100000">(d) ∩ (l) = {O}</p>
          </div>
          <div style="background-color: rgba(255,255,255,0.9); padding: 25px; border-radius: 15px; width: 40%; margin: 10px;">
            <h3 style="color: #c2185b;">🔶 متعامدان</h3>
            <svg width="200" height="150" viewBox="0 0 200 150">
                <!-- مستقيمان متعامدان -->
                <line x1="30" y1="75" x2="170" y2="75" stroke="blue" stroke-width="4"/>
                <line x1="100" y1="30" x2="100" y2="120" stroke="red" stroke-width="4"/>
                <circle cx="100" cy="75" r="5" fill="black"/>
                <path d="M90 75 L90 65 L100 65 L100 75 Z" fill="green"/>
                <text x="95" y="70" fill="black">O</text>
                <text x="30" y="65" fill="blue">(d)</text>
                <text x="80" y="25" fill="red">(l)</text>
            </svg>
            <p style="color: #100000;">زاوية قائمة 90°</p>
            <p style="font-size: 1.3em;  color: #100000">(d) ⊥ (l)</p>
          </div>
        </div>
        <p style="background-color: rgba(255,255,255,0.95); padding: 20px; border-radius: 50px; font-size: 1.5em; color: #333; margin-top: 20px;">
          <strong>✨ التعامد حالة خاصة من التقاطع ✨</strong>
        </p>
      </div>
    </div>
  `;

  // 5. Create Lesson
  const lesson = await prisma.lesson.create({
    data: {
      title: 'تقاطع وتعامد مستقيمين',
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
            question: 'التمرين 01: أكمل الفراغات:\n1) مستقيمان متقاطعان يشتركان في ...\n2) مستقيمان متعامدان يحددان زاوية قياسها ...\n3) رمز التعامد هو ...\n4) إذا كان (d) ∩ (l) = {O} فهما ...',
            expectedResults: JSON.stringify([
              { question: "1", result: "نقطة واحدة", tolerance: 0 },
              { question: "2", result: "90°", tolerance: 0 },
              { question: "3", result: "⊥", tolerance: 0 },
              { question: "4", result: "متقاطعان", tolerance: 0 }
            ]),
            displayOrder: 1,
            maxScore: 4,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'support_with_results',
            question: 'التمرين 02: ضع الرمز المناسب:\n1) (d) يعامد (l)\n2) (d) و (l) يتقاطعان في O\n3) الزاوية قائمة\n4) (d) و (l) متقاطعان',
            expectedResults: JSON.stringify([
              { question: "1", result: "(d) ⊥ (l)", tolerance: 0 },
              { question: "2", result: "(d) ∩ (l) = {O}", tolerance: 0 },
              { question: "3", result: "∟", tolerance: 0 },
              { question: "4", result: "(d) ∩ (l) ≠ ∅", tolerance: 0 }
            ]),
            displayOrder: 2,
            maxScore: 4,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'support_with_results',
            question: 'التمرين 03: اختر الإجابة الصحيحة:\n1) مستقيمان متعامدان قياس زاويتهما ...\n2) رمز التقاطع هو ...\n3) إذا كان (d) ⊥ (l) فهما ...\n4) عدد نقاط تقاطع مستقيمين متقاطعين ...',
            expectedResults: JSON.stringify([
              { question: "1", result: "90°", tolerance: 0 },
              { question: "2", result: "∩", tolerance: 0 },
              { question: "3", result: "متعامدان", tolerance: 0 },
              { question: "4", result: "1", tolerance: 0 }
            ]),
            displayOrder: 3,
            maxScore: 4,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'support_with_results',
            question: 'التمرين 04: لاحظ الشكل ثم أجب:\n1) المستقيمان (d) و (l) ...\n2) نقطة التقاطع هي ...\n3) نكتب: ...',
            expectedResults: JSON.stringify([
              { question: "1", result: "متقاطعان", tolerance: 0 },
              { question: "2", result: "O", tolerance: 0 },
              { question: "3", result: "(d) ∩ (l) = {O}", tolerance: 0 }
            ]),
            displayOrder: 4,
            maxScore: 3,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'support_with_results',
            question: 'التمرين 05: أكمل بالرموز:\n1) (d) ... (l)\n2) (d) ∩ (l) = ...',
            expectedResults: JSON.stringify([
              { question: "1", result: "⊥", tolerance: 0 },
              { question: "2", result: "{O}", tolerance: 0 }
            ]),
            displayOrder: 5,
            maxScore: 2,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'support_only',
            question: 'التمرين 06: ارسم مستقيمين متقاطعين (d) و (l) في نقطة A. اكتب العلاقات.',
            modelAnswer: '(d) ∩ (l) = {A}\nإذا كانت الزاوية 90° نكتب: (d) ⊥ (l)',
            displayOrder: 6,
            maxScore: 3,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'support_with_results',
            question: 'التمرين 07: حدد نوع العلاقة:\n1) (AB) ∩ (CD) = {O}\n2) (EF) ⊥ (GH)\n3) (MN) // (PQ)',
            expectedResults: JSON.stringify([
              { question: "1", result: "متقاطعان", tolerance: 0 },
              { question: "2", result: "متعامدان", tolerance: 0 },
              { question: "3", result: "متوازيان", tolerance: 0 }
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
            question: 'التمرين 08: في مستطيل ABCD، القطران [AC] و [BD] يتقاطعان في O.\nالمطلوب: اكتب علاقات التقاطع والتعامد.',
            modelAnswer: '(AC) ∩ (BD) = {O}\n(AB) ⊥ (AD)، (AB) ⊥ (BC)',
            displayOrder: 8,
            maxScore: 5,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'main',
            question: 'التمرين 09: في مثلث ABC قائم الزاوية في B.\nالمطلوب: اكتب علاقات التقاطع والتعامد.',
            modelAnswer: '(AB) ∩ (AC) = {A}\n(AB) ∩ (BC) = {B}\n(AC) ∩ (BC) = {C}\n(AB) ⊥ (BC)',
            displayOrder: 9,
            maxScore: 5,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'main',
            question: 'التمرين 10: في مربع PQRS، القطران [PR] و [QS] متعامدان ويتقاطعان في O.\nالمطلوب: اكتب جميع علاقات التقاطع والتعامد.',
            modelAnswer: '(PQ) ⊥ (QR)، (QR) ⊥ (RS)، (RS) ⊥ (SP)، (SP) ⊥ (PQ)\n(PR) ∩ (QS) = {O}\n(PR) ⊥ (QS)',
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