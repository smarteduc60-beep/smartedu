import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding Lesson: Segment Midpoint and Length Transfer ...');

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
        <h3>🪑 مشكلة: صنع طاولة متوازنة</h3>
        <p>يريد النجار الحاج رشيد صنع طاولة مستطيلة الشكل. لديه لوح خشبي طوله 120 cm. يحتاج إلى وضع قائم دعم في منتصف الطاولة تماماً لضمان توازنها.</p>
      </div>

      <div style="display: flex; justify-content: center; gap: 30px; margin: 30px 0; flex-wrap: wrap;">
        <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <svg width="300" height="100" viewBox="0 0 300 100">
            <!-- لوح خشبي -->
            <rect x="30" y="30" width="240" height="20" fill="#8B4513" rx="5"/>
            <!-- النقاط -->
            <circle cx="30" cy="40" r="5" fill="blue"/>
            <text x="25" y="25" fill="blue">A</text>
            <circle cx="270" cy="40" r="5" fill="red"/>
            <text x="275" y="25" fill="red">B</text>
            <!-- منتصف الطاولة -->
            <circle cx="150" cy="40" r="5" fill="green"/>
            <text x="155" y="25" fill="green">M</text>
            <text x="120" y="70" fill="black">120 cm</text>
          </svg>
          <p><strong>قطعة مستقيم [AB]</strong></p>
          <p>A ●───────────M───────────● B</p>
        </div>
      </div>
      <p>🔍 يحتاج الحاج رشيد إلى تحديد منتصف القطعة [AB] بدقة ليوضع القائم في المنتصف.</p>
      <p><strong>❓ التساؤلات:</strong></p>
      <ul>
        <li>كيف يمكن تحديد منتصف قطعة مستقيم؟</li>
        <li>كيف يمكن نقل طول قطعة مستقيم إلى مكان آخر؟</li>
        <li>ما هي الأدوات التي نستعملها؟</li>
      </ul>

      <!-- 2️⃣ مرحلة البحث والاكتشاف -->
      <div style="background-color: #fff9e6; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <h3>🧪 نشاط استكشافي: هيا نكتشف نقل الطول وتعيين المنتصف!</h3>
        <h4>📌 النشاط 1: نقل طول قطعة مستقيم</h4>
        <p>لدينا قطعة [AB] ونريد نقل طولها إلى مستقيم آخر.</p>
        <div style="display: flex; justify-content: space-around; margin: 30px 0; flex-wrap: wrap;">
          <div style="text-align: center;">
            <svg width="200" height="100" viewBox="0 0 200 100">
              <line x1="30" y1="50" x2="130" y2="50" stroke="blue" stroke-width="4"/>
              <circle cx="30" cy="50" r="5" fill="blue"/>
              <text x="25" y="35" fill="blue">A</text>
              <circle cx="130" cy="50" r="5" fill="red"/>
              <text x="135" y="35" fill="red">B</text>
            </svg>
            <p>القطعة الأصلية [AB]</p>
          </div>
          <div style="text-align: center;">
            <svg width="200" height="100" viewBox="0 0 200 100">
              <line x1="30" y1="50" x2="200" y2="50" stroke="gray" stroke-width="2" stroke-dasharray="5"/>
              <circle cx="30" cy="50" r="5" fill="blue"/>
              <text x="25" y="35" fill="blue">C</text>
              <circle cx="130" cy="50" r="5" fill="green"/>
              <text x="135" y="35" fill="green">D</text>
            </svg>
            <p>ننقل الطول فنحصل على [CD]</p>
          </div>
        </div>
        <p><strong>❓ أسئلة موجهة:</strong></p>
        <ul>
          <li>كيف ننقل طول [AB] إلى مكان آخر؟ <span style="background-color: #1976D2; color: white; padding: 3px 8px; border-radius: 15px;">باستخدام المدور</span></li>
          <li>ماذا يجب أن نساوي؟ <span style="background-color: #FF9800; color: white; padding: 3px 8px; border-radius: 15px;">AB = CD</span></li>
        </ul>

        <h4>📌 النشاط 2: إيجاد منتصف قطعة مستقيم</h4>
        <p>نريد إيجاد النقطة M منتصف [AB].</p>
        <div style="display: flex; justify-content: center; margin: 30px 0;">
          <svg width="300" height="100" viewBox="0 0 300 100">
            <line x1="30" y1="50" x2="270" y2="50" stroke="black" stroke-width="4"/>
            <circle cx="30" cy="50" r="5" fill="blue"/>
            <text x="25" y="35" fill="blue">A</text>
            <circle cx="270" cy="50" r="5" fill="red"/>
            <text x="275" y="35" fill="red">B</text>
            <circle cx="150" cy="50" r="5" fill="green"/>
            <text x="155" y="35" fill="green">M</text>
            <text x="80" y="80" fill="black">AM = MB</text>
          </svg>
        </div>
        <p><strong>❓ أسئلة موجهة:</strong></p>
        <ul>
          <li>كم يجب أن تكون AM و MB؟ <span style="background-color: #4CAF50; color: white; padding: 3px 8px; border-radius: 15px;">متساويتين</span></li>
          <li>كيف نتحقق من ذلك؟ <span style="background-color: #c2185b; color: white; padding: 3px 8px; border-radius: 15px;">نقيس المسافة</span></li>
        </ul>
      </div>

      <!-- 3️⃣ بناء المفهوم -->
      <div style="background: linear-gradient(135deg, #43C6AC 0%, #191654 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
        <h3>📚 نقل طول وتعيين منتصف قطعة مستقيم</h3>
      </div>
      <div style="background-color: #e3f2fd; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="border-right: 8px solid #1976D2; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h4>🔷 <span style="color: #1976D2;">نقل طول قطعة مستقيم</span></h4>
          <p>نقل طول قطعة مستقيم يعني إنشاء قطعة مستقيم أخرى لها نفس الطول في مكان آخر.</p>
          <div style="text-align: center; margin: 20px 0;">
            <svg width="350" height="120" viewBox="0 0 350 120">
              <!-- القطعة الأصلية -->
              <line x1="30" y1="30" x2="130" y2="30" stroke="blue" stroke-width="4"/>
              <circle cx="30" cy="30" r="5" fill="blue"/>
              <text x="25" y="15" fill="blue">A</text>
              <circle cx="130" cy="30" r="5" fill="blue"/>
              <text x="135" y="15" fill="blue">B</text>
              <!-- نقل الطول -->
              <line x1="200" y1="70" x2="300" y2="70" stroke="red" stroke-width="4"/>
              <circle cx="200" cy="70" r="5" fill="red"/>
              <text x="195" y="55" fill="red">C</text>
              <circle cx="300" cy="70" r="5" fill="red"/>
              <text x="305" y="55" fill="red">D</text>
              <text x="130" y="80" fill="green">AB = CD</text>
            </svg>
          </div>
          <p>خطوات نقل الطول:</p>
          <ol>
            <li>نضع إبرة المدور في A ونفتحه حتى B</li>
            <li>ننقل المدور إلى النقطة C</li>
            <li>نرسم قوساً يقطع المستقيم في D</li>
            <li>CD = AB</li>
          </ol>
        </div>
        <div style="border-right: 8px solid #c2185b; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h4>🔷 <span style="color: #c2185b;">منتصف قطعة مستقيم</span></h4>
          <p>منتصف قطعة مستقيم [AB] هو نقطة M تنتمي إلى [AB] وتحقق: AM = MB.</p>
          <div style="text-align: center; margin: 20px 0;">
            <svg width="300" height="100" viewBox="0 0 300 100">
              <line x1="30" y1="50" x2="270" y2="50" stroke="black" stroke-width="4"/>
              <circle cx="30" cy="50" r="5" fill="blue"/>
              <text x="25" y="35" fill="blue">A</text>
              <circle cx="270" cy="50" r="5" fill="red"/>
              <text x="275" y="35" fill="red">B</text>
              <circle cx="150" cy="50" r="5" fill="green"/>
              <text x="155" y="35" fill="green">M</text>
              <text x="80" y="80" fill="black">AM = MB</text>
            </svg>
            <p><strong>M منتصف [AB] ⇔ AM = MB و M ∈ [AB]</strong></p>
          </div>
        </div>
        <div style="border-right: 8px solid #4CAF50; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h4>🔷 <span style="color: #4CAF50;">إنشاء منتصف قطعة مستقيم بالمدور</span></h4>
          <div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
            <div style="text-align: center; width: 200px;">
              <p><strong>الخطوة 1</strong></p>
              <svg width="150" height="100" viewBox="0 0 150 100">
                <line x1="30" y1="50" x2="120" y2="50" stroke="black" stroke-width="3"/>
                <circle cx="30" cy="50" r="4" fill="blue"/>
                <text x="25" y="40" fill="blue">A</text>
                <circle cx="120" cy="50" r="4" fill="red"/>
                <text x="125" y="40" fill="red">B</text>
              </svg>
              <p>نفتح المدور بفتحة أكبر من نصف طول [AB]</p>
            </div>
            <div style="text-align: center; width: 200px;">
              <p><strong>الخطوة 2</strong></p>
              <svg width="150" height="100" viewBox="0 0 150 100">
                <line x1="30" y1="50" x2="120" y2="50" stroke="black" stroke-width="3"/>
                <circle cx="30" cy="50" r="4" fill="blue"/>
                <circle cx="120" cy="50" r="4" fill="red"/>
                <path d="M53 50 A45 45 0 0 1 75 10" stroke="blue" fill="none" stroke-dasharray="5"/>
                <path d="M53 50 A45 45 0 0 0 75 90" stroke="blue" fill="none" stroke-dasharray="5"/>
                <path d="M97 50 A45 45 0 0 0 75 10" stroke="red" fill="none" stroke-dasharray="5"/>
                <path d="M97 50 A45 45 0 0 1 75 90" stroke="red" fill="none" stroke-dasharray="5"/>
              </svg>
              <p>نرسم قوسين من A (أعلى وأسفل) وبنفس الفتحة قوسين من B</p>
            </div>
            <div style="text-align: center; width: 200px;">
              <p><strong>الخطوة 3</strong></p>
              <svg width="150" height="100" viewBox="0 0 150 100">
                <line x1="30" y1="50" x2="120" y2="50" stroke="black" stroke-width="3"/>
                <circle cx="30" cy="50" r="4" fill="blue"/>
                <circle cx="120" cy="50" r="4" fill="red"/>
                <circle cx="75" cy="10" r="4" fill="green"/>
                <circle cx="75" cy="90" r="4" fill="green"/>
              </svg>
              <p>نعين نقطتي تقاطع القوسين</p>
            </div>
            <div style="text-align: center; width: 200px;">
              <p><strong>الخطوة 4</strong></p>
              <svg width="150" height="100" viewBox="0 0 150 100">
                <line x1="30" y1="50" x2="120" y2="50" stroke="black" stroke-width="3"/>
                <circle cx="30" cy="50" r="4" fill="blue"/>
                <circle cx="120" cy="50" r="4" fill="red"/>
                <line x1="75" y1="10" x2="75" y2="90" stroke="purple" stroke-width="2" stroke-dasharray="5"/>
                <circle cx="75" cy="50" r="4" fill="green"/>
                <text x="75" y="45" fill="green">M</text>
              </svg>
              <p>نصل النقطتين، نقطة التقاطع مع القطعة هي M</p>
            </div>
          </div>
        </div>
        <div style="border-right: 8px solid #FF9800; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h4>🔷 <span style="color: #FF9800;">الرموز والمصطلحات</span></h4>
          <table style="width:100%; border-collapse: collapse;">
            <tr><th>الرمز</th><th>القراءة</th><th>المعنى</th></tr>
            <tr><td>[AB]</td><td>القطعة AB</td><td>قطعة مستقيم طرفاها A و B</td></tr>
            <tr><td>AB</td><td>طول AB</td><td>المسافة بين A و B</td></tr>
            <tr><td>M ∈ [AB]</td><td>M تنتمي إلى [AB]</td><td>النقطة M تقع على القطعة AB</td></tr>
            <tr><td>AM = MB</td><td>AM تساوي MB</td><td>M منتصف [AB]</td></tr>
            <tr><td>AB = CD</td><td>AB تساوي CD</td><td>طول القطعة AB يساوي طول القطعة CD</td></tr>
          </table>
        </div>
      </div>

      <!-- 4️⃣ تمثيل متعدد للمفهوم -->
      <div style="background: linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
        <h3>🎭 أربع تمثيلات لنقل الطول وتعيين المنتصف</h3>
      </div>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;">
        <div style="background: linear-gradient(145deg, #ffffff, #e3f2fd); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <h4 style="color: #1976D2; text-align: center; font-size: 1.5em;">🔢 تمثيل عددي</h4>
          <div style="text-align: center;">
            <p>AB = 6 cm</p>
            <p>AM = MB = 3 cm</p>
            <p>CD = AB = 6 cm</p>
          </div>
        </div>
        <div style="background: linear-gradient(145deg, #ffffff, #ffebee); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <h4 style="color: #c2185b; text-align: center; font-size: 1.5em;">📝 تمثيل لفظي</h4>
          <ul style="font-size: 1.2em; list-style-type: none; padding: 0;">
            <li style="margin: 15px 0;">✓ "M منتصف [AB]"</li>
            <li style="margin: 15px 0;">✓ "ننقل الطول AB"</li>
            <li style="margin: 15px 0;">✓ "AM = MB"</li>
          </ul>
        </div>
        <div style="background: linear-gradient(145deg, #ffffff, #e8f5e9); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <h4 style="color: #4CAF50; text-align: center; font-size: 1.5em;">📊 تمثيل هندسي</h4>
          <div style="text-align: center;">
            <svg width="200" height="60" viewBox="0 0 200 60">
              <line x1="20" y1="30" x2="180" y2="30" stroke="black" stroke-width="3"/>
              <circle cx="20" cy="30" r="4" fill="blue"/>
              <text x="15" y="20" fill="blue">A</text>
              <circle cx="100" cy="30" r="4" fill="green"/>
              <text x="105" y="20" fill="green">M</text>
              <circle cx="180" cy="30" r="4" fill="red"/>
              <text x="185" y="20" fill="red">B</text>
              <text x="100" y="50" fill="black">AM = MB</text>
            </svg>
          </div>
        </div>
        <div style="background: linear-gradient(145deg, #ffffff, #fff3e0); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <h4 style="color: #FF9800; text-align: center; font-size: 1.5em;">🔣 تمثيل رمزي</h4>
          <div style="text-align: center; font-size: 1.2em;">
            <p> [AB] منتصف  M</p>  
            <p>AM = MB = AB/2</p>
            <p>CD = AB</p>
          </div>
        </div>
      </div>

      <!-- 5️⃣ أمثلة محلولة تدريجيًا -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 15px; margin: 20px 0;">
        <div style="background-color: white; padding: 20px; border-radius: 10px;">
          <h4>📌 مثال 1: بسيط جدًا - إيجاد منتصف قطعة مستقيم</h4>
          <p style="font-size: 1.3em;"><strong style="color: #1976D2;">المطلوب:</strong> أوجد منتصف القطعة [AB] حيث AB = 8 cm</p>
          <div style="display: flex; gap: 30px; align-items: center; flex-wrap: wrap;">
            <div style="flex: 1; text-align: center;">
              <svg width="250" height="80" viewBox="0 0 250 80">
                <line x1="30" y1="40" x2="220" y2="40" stroke="black" stroke-width="3"/>
                <circle cx="30" cy="40" r="4" fill="blue"/>
                <text x="25" y="30" fill="blue">A</text>
                <circle cx="220" cy="40" r="4" fill="red"/>
                <text x="225" y="30" fill="red">B</text>
              </svg>
            </div>
            <div style="flex: 1;">
              <p><strong style="color: #1976D2;">🔍 التفكير:</strong> منتصف القطعة يبعد نفس المسافة عن A و B</p>
              <p><strong style="color: #1976D2;">الخطوة 1:</strong> AB = 8 cm ⇒ AM = MB = 4 cm</p>
              <p><strong style="color: #1976D2;">الخطوة 2:</strong> نضع M على بعد 4 cm من A</p>
              <p><strong style="color: #c2185b;">النتيجة:</strong> M منتصف [AB]</p>
            </div>
          </div>
          <div style="text-align: center; margin-top: 20px;">
            <svg width="250" height="80" viewBox="0 0 250 80">
              <line x1="30" y1="40" x2="220" y2="40" stroke="black" stroke-width="3"/>
              <circle cx="30" cy="40" r="4" fill="blue"/>
              <text x="25" y="30" fill="blue">A</text>
              <circle cx="125" cy="40" r="4" fill="green"/>
              <text x="130" y="30" fill="green">M</text>
              <circle cx="220" cy="40" r="4" fill="red"/>
              <text x="225" y="30" fill="red">B</text>
            </svg>
          </div>
        </div>
      </div>

      <div style="background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%); padding: 20px; border-radius: 15px; margin: 20px 0;">
        <div style="background-color: white; padding: 20px; border-radius: 10px;">
          <h4>📌 مثال 2: متوسط - نقل طول قطعة مستقيم</h4>
          <p style="font-size: 1.3em;"><strong style="color: #FF9800;">المطلوب:</strong> انقل طول القطعة [AB] إلى النقطة C على المستقيم (d)</p>
          <div style="display: flex; gap: 30px; align-items: center; flex-wrap: wrap;">
            <div style="flex: 1; text-align: center;">
              <svg width="200" height="100" viewBox="0 0 200 100">
                <line x1="20" y1="30" x2="120" y2="30" stroke="blue" stroke-width="3"/>
                <circle cx="20" cy="30" r="4" fill="blue"/>
                <text x="15" y="20" fill="blue">A</text>
                <circle cx="120" cy="30" r="4" fill="blue"/>
                <text x="125" y="20" fill="blue">B</text>
                <line x1="20" y1="70" x2="180" y2="70" stroke="gray" stroke-dasharray="5"/>
                <circle cx="20" cy="70" r="4" fill="red"/>
                <text x="15" y="60" fill="red">C</text>
              </svg>
            </div>
            <div style="flex: 1;">
              <p><strong style="color: #FF9800;">🔍 التفكير:</strong> نستعمل المدور لنقل الطول</p>
              <p><strong style="color: #FF9800;">الخطوة 1:</strong> نضع إبرة المدور في A ونفتحه حتى B</p>
              <p><strong style="color: #FF9800;">الخطوة 2:</strong> ننقل المدور إلى C ونرسم قوساً</p>
              <p><strong style="color: #FF9800;">الخطوة 3:</strong> نقطة التقاطع D تحقق CD = AB</p>
            </div>
          </div>
          <div style="text-align: center; margin-top: 20px;">
            <svg width="200" height="100" viewBox="0 0 200 100">
              <line x1="20" y1="70" x2="120" y2="70" stroke="red" stroke-width="3"/>
              <circle cx="20" cy="70" r="4" fill="red"/>
              <text x="15" y="60" fill="red">C</text>
              <circle cx="120" cy="70" r="4" fill="red"/>
              <text x="125" y="60" fill="red">D</text>
            </svg>
          </div>
        </div>
      </div>

      <div style="background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%); padding: 20px; border-radius: 15px; margin: 20px 0;">
        <div style="background-color: white; padding: 20px; border-radius: 10px;">
          <h4>📌 مثال 3: يتطلب تحليل - إنشاء منتصف قطعة باستخدام المدور</h4>
          <p style="font-size: 1.3em;"><strong style="color: #4CAF50;">المطلوب:</strong> أنشئ منتصف القطعة [AB] باستخدام المدور</p>
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="display: flex; justify-content: space-around;">
              <div style="text-align: center;">
                <svg width="150" height="100" viewBox="0 0 150 100">
                  <line x1="30" y1="50" x2="120" y2="50" stroke="black" stroke-width="3"/>
                  <circle cx="30" cy="50" r="4" fill="blue"/>
                  <text x="25" y="40" fill="blue">A</text>
                  <circle cx="120" cy="50" r="4" fill="red"/>
                  <text x="125" y="40" fill="red">B</text>
                </svg>
                <p>① نرسم القطعة [AB]</p>
              </div>
              <div style="text-align: center;">
                <svg width="150" height="100" viewBox="0 0 150 100">
                  <line x1="30" y1="50" x2="120" y2="50" stroke="black" stroke-width="3"/>
                  <circle cx="30" cy="50" r="4" fill="blue"/>
                  <circle cx="120" cy="50" r="4" fill="red"/>
                  <path d="M30 50 A40 40 0 0 1 75 15" stroke="blue" fill="none" stroke-dasharray="5"/>
                  <path d="M120 50 A40 40 0 0 0 75 15" stroke="red" fill="none" stroke-dasharray="5"/>
                </svg>
                <p>② نرسم قوسين من A و B</p>
              </div>
            </div>
            <div style="display: flex; justify-content: space-around;">
              <div style="text-align: center;">
                <svg width="150" height="100" viewBox="0 0 150 100">
                  <line x1="30" y1="50" x2="120" y2="50" stroke="black" stroke-width="3"/>
                  <circle cx="30" cy="50" r="4" fill="blue"/>
                  <circle cx="120" cy="50" r="4" fill="red"/>
                  <circle cx="75" cy="30" r="4" fill="green"/>
                  <circle cx="75" cy="70" r="4" fill="green"/>
                </svg>
                <p>③ نتحصل على نقطتي تقاطع</p>
              </div>
              <div style="text-align: center;">
                <svg width="150" height="100" viewBox="0 0 150 100">
                  <line x1="30" y1="50" x2="120" y2="50" stroke="black" stroke-width="3"/>
                  <circle cx="30" cy="50" r="4" fill="blue"/>
                  <circle cx="120" cy="50" r="4" fill="red"/>
                  <line x1="75" y1="30" x2="75" y2="70" stroke="purple" stroke-width="3" stroke-dasharray="5"/>
                  <circle cx="75" cy="50" r="4" fill="green"/>
                  <text x="80" y="45" fill="green">M</text>
                </svg>
                <p>④ نصل النقطتين فنحصل على M</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style="background: linear-gradient(135deg, #9C27B0 0%, #6A1B9A 100%); padding: 20px; border-radius: 15px; margin: 20px 0;">
        <div style="background-color: white; padding: 20px; border-radius: 10px;">
          <h4>📌 مثال 4: تطبيقي من الحياة اليومية</h4>
          <p style="font-size: 1.3em;"><strong style="color: #9C27B0;">الوضعية:</strong> يريد النجار وضع قائم في منتصف لوح خشبي طوله 240 cm. ساعده في إيجاد منتصف اللوح.</p>
          <div style="text-align: center;">
            <svg width="300" height="80" viewBox="0 0 300 80">
              <rect x="20" y="20" width="260" height="20" fill="#8B4513" rx="5"/>
              <circle cx="20" cy="30" r="4" fill="blue"/>
              <text x="15" y="20" fill="blue">A</text>
              <circle cx="280" cy="30" r="4" fill="red"/>
              <text x="285" y="20" fill="red">B</text>
            </svg>
          </div>
          <div style="margin-top: 20px;">
            <p><strong style="color: #9C27B0;">🔍 التفكير:</strong> طول اللوح 240 cm</p>
            <p><strong style="color: #9C27B0;">الخطوة 1:</strong> نصف الطول = 240 ÷ 2 = 120 cm</p>
            <p><strong style="color: #9C27B0;">الخطوة 2:</strong> نضع القائم على بعد 120 cm من A</p>
          </div>
          <div style="text-align: center; margin-top: 20px;">
            <svg width="300" height="80" viewBox="0 0 300 80">
              <rect x="20" y="20" width="260" height="20" fill="#8B4513" rx="5"/>
              <circle cx="20" cy="30" r="4" fill="blue"/>
              <text x="15" y="20" fill="blue">A</text>
              <circle cx="280" cy="30" r="4" fill="red"/>
              <text x="285" y="20" fill="red">B</text>
              <circle cx="150" cy="30" r="4" fill="green"/>
              <text x="155" y="20" fill="green">M</text>
            </svg>
          </div>
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
              <td style="padding: 15px;">نسيان فتحة المدور &gt; نصف القطعة</td>
              <td style="padding: 15px;">عدم دقة في الإنشاء</td>
              <td style="padding: 15px;">نتأكد أن فتحة المدور &gt; نصف AB</td>
            </tr>
            <tr style="background-color: #ef9a9a;">
              <td style="padding: 15px; font-weight: bold;">الخطأ 2</td>
              <td style="padding: 15px;">الاعتقاد أن M منتصف [AB] إذا كان AM = MB</td>
              <td style="padding: 15px;">نسيان أن M يجب أن تنتمي إلى [AB]</td>
              <td style="padding: 15px;">نتحقق من M ∈ [AB]</td>
            </tr>
            <tr style="background-color: #e57373;">
              <td style="padding: 15px; font-weight: bold;">الخطأ 3</td>
              <td style="padding: 15px;">عدم تساوي الأطوال عند النقل</td>
              <td style="padding: 15px;">عدم ضبط فتحة المدور بدقة</td>
              <td style="padding: 15px;">نحافظ على نفس الفتحة عند النقل</td>
            </tr>
            <tr style="background-color: #ef5350;">
              <td style="padding: 15px; font-weight: bold;">الخطأ 4</td>
              <td style="padding: 15px;">الخلط بين [AB] و AB</td>
              <td style="padding: 15px;">عدم التمييز بين القطعة وطولها</td>
              <td style="padding: 15px;">[AB] قطعة، AB طول</td>
            </tr>
          </table>
        </div>
        <div style="background-color: #c8e6c9; padding: 20px; border-radius: 10px; margin-top: 20px;">
          <h4>✅ كيف نتحقق من صحة الحل؟</h4>
          <ul style="font-size: 1.1em;">
            <li>✓ نقيس AM و MB: يجب أن يكونا متساويين</li>
            <li>✓ نتحقق أن M تقع بين A و B</li>
            <li>✓ نتحقق من تساوي الأطوال المنقولة</li>
          </ul>
        </div>
      </div>

      <!-- 8️⃣ فقرة "نفكر معًا" -->
      <div style="background: linear-gradient(135deg, #FF6B6B 0%, #C2185B 100%); padding: 30px; border-radius: 15px; margin: 20px 0;">
        <div style="background-color: white; padding: 25px; border-radius: 10px; text-align: center;">
          <h3>💭 سؤال مفتوح للتفكير</h3>
          <p style="font-size: 1.5em; color: #c2185b; font-weight: bold;">هل يمكن أن يكون لقطعة مستقيم أكثر من منتصف؟ لماذا؟</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-top: 20px;">
            <p>🔰 لا، لأن المسافة بين A و B ثابتة، والمسافة من A إلى منتصف فريدة.</p>
          </div>
        </div>
      </div>

      <!-- 9️⃣ تقويم تكويني قصير -->
      <div style="background: linear-gradient(135deg, #4ECDC4 0%, #2C3E50 100%); padding: 25px; border-radius: 15px; margin: 20px 0;">
        <div style="background-color: white; padding: 25px; border-radius: 10px;">
          <h3>📝 5 أسئلة سريعة</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
            <div style="background-color: #e3f2fd; padding: 15px; border-radius: 10px;">
              <p><strong>1. منتصف [AB] يرمز له بـ M بحيث؟</strong></p>
              <p style="background-color: #1976D2; color: white; padding: 10px; border-radius: 5px;">AM = MB</p>
            </div>
            <div style="background-color: #fff3e0; padding: 15px; border-radius: 10px;">
              <p><strong>2. أداة نقل الطول هي؟</strong></p>
              <p style="background-color: #FF9800; color: white; padding: 10px; border-radius: 5px;">المدور</p>
            </div>
            <div style="background-color: #e8f5e9; padding: 15px; border-radius: 10px;">
              <p><strong>3. إذا كان AM = 3 cm، فما طول AB؟</strong></p>
              <p style="background-color: #4CAF50; color: white; padding: 10px; border-radius: 5px;">6 cm</p>
            </div>
            <div style="background-color: #f3e5f5; padding: 15px; border-radius: 10px;">
              <p><strong>4. CD = AB يعني؟</strong></p>
              <p style="background-color: #9C27B0; color: white; padding: 10px; border-radius: 5px;">نقل طول</p>
            </div>
            <div style="grid-column: span 2; background-color: #ffebee; padding: 15px; border-radius: 10px;">
              <p><strong>5. M ∈ [AB] و AM = MB يعني؟</strong></p>
              <p style="background-color: #c2185b; color: white; padding: 10px; border-radius: 5px;">M منتصف [AB]</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ✨ خلاصة الدرس -->
      <div style="background: linear-gradient(135deg, #43C6AC 0%, #191654 100%); padding: 30px; border-radius: 15px; margin: 30px 0; text-align: center; color: white;">
        <h3>📌 ملخص نقل طول وتعيين منتصف قطعة مستقيم</h3>
        <div style="display: flex; justify-content: space-around; margin: 30px 0; flex-wrap: wrap;">
          <div style="background-color: rgba(255,255,255,0.9); padding: 25px; border-radius: 15px; width: 40%; margin: 10px;">
            <h3 style="color: #1976D2;">📏 نقل طول</h3>
            <p style="color: #100000;">AB = CD</p>
            <p style="color: #100000;">نستعمل المدور</p>
          </div>
          <div style="background-color: rgba(255,255,255,0.9); padding: 25px; border-radius: 15px; width: 40%; margin: 10px;">
            <h3 style="color: #c2185b;">⬤ منتصف</h3>
            <p style="color: #100000;">AM = MB</p>
            <p style="color: #100000;">M ∈ [AB]</p>
          </div>
        </div>
        <p style="background-color: rgba(255,255,255,0.95); padding: 20px; border-radius: 50px; font-size: 1.5em; color: #333; margin-top: 20px;">
          <strong>✨ منتصف قطعة: نقطة تقسمها إلى جزأين متساويين ✨</strong>
        </p>
      </div>
    </div>
  `;

  // 5. Create Lesson
  const lesson = await prisma.lesson.create({
    data: {
      title: 'نقل طول وتعيين منتصف قطعة مستقيم',
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
            question: 'التمرين 01: أكمل الفراغات:\n1) منتصف قطعة مستقيم [AB] هو نقطة M تحقق ... و ...\n2) إذا كان AB = 10 cm فإن AM = ...\n3) لنقل طول [AB] نستعمل ...\n4) إذا نقلنا طول [AB] إلى [CD] فإن ...',
            expectedResults: JSON.stringify([
              { question: "1", result: "AM = MB", tolerance: 0 },
              { question: "2", result: "M ∈ [AB]", tolerance: 0 },
              { question: "3", result: "5 cm", tolerance: 0 },
              { question: "4", result: "المدور", tolerance: 0 },
              { question: "5", result: "AB = CD", tolerance: 0 }
            ]),
            displayOrder: 1,
            maxScore: 5,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'support_with_results',
            question: 'التمرين 02: أكمل الجدول (AM = MB):\n1) AB = 8 cm\n2) AB = 12 cm\n3) AB = 15 cm\n4) AB = 20 cm\n5) AB = 24 cm',
            expectedResults: JSON.stringify([
              { question: "1", result: "4", tolerance: 0 },
              { question: "2", result: "6", tolerance: 0 },
              { question: "3", result: "7,5", tolerance: 0 },
              { question: "4", result: "10", tolerance: 0 },
              { question: "5", result: "12", tolerance: 0 }
            ]),
            displayOrder: 2,
            maxScore: 5,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'support_with_results',
            question: 'التمرين 03: اختر الإجابة الصحيحة:\n1) M منتصف [AB] يعني ...\n2) طول [AB] هو ...\n3) لنقل طول [AB] نستعمل ...\n4) إذا كان AM = 4 cm فإن AB = ...',
            expectedResults: JSON.stringify([
              { question: "1", result: "AM = MB", tolerance: 0 },
              { question: "2", result: "AB", tolerance: 0 },
              { question: "3", result: "المدور", tolerance: 0 },
              { question: "4", result: "8 cm", tolerance: 0 }
            ]),
            displayOrder: 3,
            maxScore: 4,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'support_with_results',
            question: 'التمرين 04: لاحظ الشكل ثم أجب:\n1) M هي ...\n2) AM = ...\n3) إذا كان AM = 3 cm فإن AB = ...',
            expectedResults: JSON.stringify([
              { question: "1", result: "منتصف [AB]", tolerance: 0 },
              { question: "2", result: "MB", tolerance: 0 },
              { question: "3", result: "6 cm", tolerance: 0 }
            ]),
            displayOrder: 4,
            maxScore: 3,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'support_with_results',
            question: 'التمرين 05: ارسم قطعة [AB] طولها 7 cm، ثم أنشئ منتصفها باستعمال المدور.\nالنتيجة: AM = MB = ...',
            expectedResults: JSON.stringify([
              { question: "1", result: "3,5 cm", tolerance: 0 }
            ]),
            displayOrder: 5,
            maxScore: 2,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'support_with_results',
            question: 'التمرين 06: لديك قطعة [AB] طولها 5 cm. انقل هذا الطول إلى نقطة C.\nنحصل على CD = ...',
            expectedResults: JSON.stringify([
              { question: "1", result: "5 cm", tolerance: 0 }
            ]),
            displayOrder: 6,
            maxScore: 2,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'support_with_results',
            question: 'التمرين 07: أكمل الجدول:\n1) AB = 10 cm, AM = ?, MB = ?\n2) AB = ?, AM = 7 cm, MB = 7 cm\n3) AB = 18 cm, AM = ?, MB = ?\n4) AB = ?, AM = 11 cm, MB = 11 cm',
            expectedResults: JSON.stringify([
              { question: "1", result: "5", tolerance: 0 },
              { question: "2", result: "5", tolerance: 0 },
              { question: "3", result: "14", tolerance: 0 },
              { question: "4", result: "9", tolerance: 0 },
              { question: "5", result: "9", tolerance: 0 },
              { question: "6", result: "22", tolerance: 0 }
            ]),
            displayOrder: 7,
            maxScore: 6,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          // 🔴 التمارين الرئيسية (30%)
          {
            type: 'main',
            question: 'التمرين 08: قطعة أرض مستطيلة طولها 50 m، يريد الفلاح وضع علامة في منتصفها.\nالمطلوب: أحسب بعد العلامة عن طرفي القطعة.',
            modelAnswer: 'بعد العلامة عن كل طرف = 50 ÷ 2 = 25 m',
            displayOrder: 8,
            maxScore: 5,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'main',
            question: 'التمرين 09: ارسم قطعة [AB] طولها 8 cm. عين منتصفها M. انقل طول [AM] إلى قطعة أخرى [CD].\nالمطلوب: ما طول [CD]؟',
            modelAnswer: 'AM = 4 cm\nCD = AM = 4 cm',
            displayOrder: 9,
            maxScore: 5,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'main',
            question: 'التمرين 10: في مثلث ABC، النقطة M منتصف [AB]، النقطة N منتصف [AC]. أنشئ MN.\nالمطلوب: قارن MN و BC.',
            modelAnswer: 'MN = ½ BC (خاصية)',
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