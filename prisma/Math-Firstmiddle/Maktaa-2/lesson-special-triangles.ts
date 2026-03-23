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
  <!-- 1️⃣ وضعية انطلاق  -->
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
🏗️ مشكلة: بناء سقف منزل
يريد نجار بناء سقف لمنزل على شكل مثلث. لديه ثلاثة أنواع من المثلثات:

مثلث متقايس الأضلاع

مثلث ضلعان منه متساويان

مثلث قائم الزاوية

</div>
<div style="display: flex; justify-content: center; gap: 30px; margin: 30px 0; flex-wrap: wrap;">
  <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
    <svg width="120" height="120" viewBox="0 0 120 120">
      <polygon points="60,21 100,90 20,90" fill="#e3f2fd" stroke="#1976D2" stroke-width="3"/>
      <line x1="78" y1="58" x2="82" y2="53" stroke="#c2185b" stroke-width="2"/>
      <line x1="58" y1="87" x2="58" y2="93" stroke="#c2185b" stroke-width="2"/>
      <line x1="38" y1="53" x2="42" y2="58" stroke="#c2185b" stroke-width="2"/>
    </svg>
    <p><strong>مثلث متقايس الأضلاع</strong></p>
  </div>
  <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
    <svg width="120" height="120" viewBox="0 0 120 120">
      <polygon points="60,20 100,80 20,80" fill="#ffebee" stroke="#c2185b" stroke-width="3"/>
      <path d="M78 48 L82 43 M77 53 L81 57" stroke="#1976D2" stroke-width="2" fill="none"/>
      <path d="M42 48 L38 43 M43 53 L39 57" stroke="#1976D2" stroke-width="2" fill="none"/>
    </svg>
    <p><strong>مثلث متساوي الساقين</strong></p>
  </div>
  <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
    <svg width="120" height="120" viewBox="0 0 120 120">
      <polygon points="20,80 20,20 100,80" fill="#e8f5e9" stroke="#4CAF50" stroke-width="3"/>
      <polyline points="20,70 30,70 30,80" fill="none" stroke="#4CAF50" stroke-width="2"/>
    </svg>
    <p><strong>مثلث قائم الزاوية</strong></p>
  </div>
</div>
🔍 كيف يمكن للنجار إنشاء هذه المثلثات بدقة؟

❓ التساؤلات:

كيف ننشئ مثلثاً متقايس الأضلاع؟

كيف ننشئ مثلثاً متساوي الساقين؟

كيف ننشئ مثلثاً قائم الزاوية؟

2️⃣ مرحلة البحث والاكتشاف
<div style="background-color: #fff9e6; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
🧪 نشاط استكشافي: هيا نكتشف إنشاء المثلثات!
📌 النشاط 1: إنشاء مثلث متقايس الأضلاع
لدينا ضلع [AB] طوله 5 cm. كيف ننشئ المثلث ABC متقايس الأضلاع؟

<div style="display:flex; justify-content:center; margin:20px 0;">
<svg width="200" height="120" viewBox="0 0 200 120">

<!-- القطعة AB -->
<line x1="30" y1="80" x2="130" y2="80" stroke="black" stroke-width="3"/>

<!-- النقطة A -->
<circle cx="30" cy="80" r="3" fill="black"/>
<text x="25" y="100" font-size="12">A</text>

<!-- النقطة B -->
<circle cx="130" cy="80" r="3" fill="black"/>
<text x="125" y="100" font-size="12">B</text>

<!-- القوس من A -->
<path d="M30 80 A100 100 0 0 1 80 10"
stroke="blue"
fill="none"
stroke-dasharray="5"/>

<!-- القوس من B -->
<path d="M130 80 A100 100 0 0 0 80 10"
stroke="red"
fill="none"
stroke-dasharray="5"/>

<!-- نقطة التقاطع C -->
<circle cx="80" cy="10" r="3" fill="#4CAF50"/>
<text x="70" y="15" font-size="12">C</text>

</svg>
</div>
❓ أسئلة موجهة:

كم يجب أن يكون طول AC؟ <span style="background-color: #1976D2; color: white; padding: 3px 8px; border-radius: 15px;">5 cm</span>

كم يجب أن يكون طول BC؟ <span style="background-color: #FF9800; color: white; padding: 3px 8px; border-radius: 15px;">5 cm</span>

أين نجد النقطة C؟ <span style="background-color: #4CAF50; color: white; padding: 3px 8px; border-radius: 15px;">تقاطع قوسين</span>

📌 النشاط 2: إنشاء مثلث متساوي الساقين
لدينا قاعدة [BC] طولها 6 cm وساقان AB = AC = 4 cm.

<div style="display:flex; justify-content:center; margin:20px 0;">
<svg width="220" height="150" viewBox="0 0 220 150">

<!-- القاعدة AB -->
<line x1="70" y1="110" x2="150" y2="110" stroke="black" stroke-width="3"/>

<!-- النقطة A -->
<circle cx="70" cy="110" r="3" fill="black"/>
<text x="65" y="130" font-size="12">A</text>

<!-- النقطة B -->
<circle cx="150" cy="110" r="3" fill="black"/>
<text x="145" y="130" font-size="12">B</text>

<!-- القوس من A نصف قطره 6 -->
<path d="M70 110 A120 120 0 0 1 110 40"
stroke="blue"
fill="none"
stroke-dasharray="5"/>

<!-- القوس من B نصف قطره 6 -->
<path d="M150 110 A120 120 0 0 0 110 40"
stroke="red"
fill="none"
stroke-dasharray="5"/>

<!-- نقطة التقاطع C -->
<circle cx="110" cy="40" r="3" fill="#4CAF50"/>
<text x="105" y="35" font-size="12">C</text>

<!-- أضلاع المثلث -->
<line x1="70" y1="110" x2="110" y2="40" stroke="black" stroke-width="2"/>
<line x1="150" y1="110" x2="110" y2="40" stroke="black" stroke-width="2"/>

</svg>
</div>❓ أسئلة موجهة:

من أين نرسم القوس الأول؟ <span style="background-color: #c2185b; color: white; padding: 3px 8px; border-radius: 15px;">من B بفتحة 4 cm</span>

من أين نرسم القوس الثاني؟ <span style="background-color: #9C27B0; color: white; padding: 3px 8px; border-radius: 15px;">من C بفتحة 4 cm</span>

أين نقطة التقاطع؟ <span style="background-color: #4CAF50; color: white; padding: 3px 8px; border-radius: 15px;">هي الرأس A</span>

📌 النشاط 3: إنشاء مثلث قائم الزاوية
لدينا ضلعا القائمة AB = 4 cm، AC = 3 cm.

<div style="display: flex; justify-content: center; margin: 20px 0;">
  <svg width="200" height="120" viewBox="0 0 200 120">
    <line x1="30" y1="80" x2="130" y2="80" stroke="black" stroke-width="3"/>
    <line x1="30" y1="80" x2="30" y2="10" stroke="black" stroke-width="3"/>
    <path d="M30 80 L30 70 L40 70 L40 80 Z" fill="green"/>
  </svg>
</div>
</div>
3️⃣ بناء المفهوم (Institutionnalisation)
<div style="background: linear-gradient(135deg, #43C6AC 0%, #191654 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
📚 إنشاء المثلثات الخاصة
</div>
<div style="background-color: #e3f2fd; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
  <div style="border-right: 8px solid #1976D2; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
🔷 <span style="color: #1976D2;">المثلث المتقايس الأضلاع</span>
تعريف: مثلث له ثلاثة أضلاع متساوية وثلاث زوايا متقايسة (60° لكل منها).

<div style="text-align: center; margin: 20px 0;">
  <svg width="150" height="130" viewBox="0 0 150 130">
    <polygon points="75,5 130,100 20,100" fill="#e3f2fd" stroke="#1976D2" stroke-width="3"/>
    <line x1="100" y1="55" x2="104" y2="48" stroke="#1976D2" stroke-width="2"/>
    <line x1="73" y1="97" x2="73" y2="103" stroke="#1976D2" stroke-width="2"/>
    <line x1="46" y1="48" x2="50" y2="55" stroke="#1976D2" stroke-width="2"/>
  </svg>
</div>
خطوات الإنشاء (طول الضلع = 5 cm):

أرسم قطعة <span class="math">[AB]</span> طولها 5 cm

أضع سن المدور في <span class="math">A</span> بفتحة 5 cm وأرسم قوساً

أضع سن المدور في <span class="math">B</span> بفتحة 5 cm وأرسم قوساً يقطع الأول

نقطة التقاطع هي <span class="math">C</span>

أصل <span class="math">A</span> مع <span class="math">C</span> و <span class="math">B</span> مع <span class="math">C</span>

</div>
<div style="border-right: 8px solid #c2185b; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
🔷 <span style="color: #c2185b;">المثلث المتساوي الساقين</span>
تعريف: مثلث له ضلعان متساويان يسميان الساقين، والضلع الثالث يسمى القاعدة.

<div style="text-align:center; margin:20px 0;">
<svg width="200" height="150" viewBox="0 0 200 150">

<!-- القاعدة BC -->
<line x1="40" y1="110" x2="160" y2="110" stroke="black" stroke-width="3"/>

<!-- النقطة B -->
<circle cx="40" cy="110" r="3" fill="black"/>
<text x="35" y="130" font-size="12">B</text>

<!-- النقطة C -->
<circle cx="160" cy="110" r="3" fill="black"/>
<text x="155" y="130" font-size="12">C</text>

<!-- قوس من B نصف قطره 5 -->
<path d="M40 110 A100 100 0 0 1 100 35"
stroke="#1976D2"
fill="none"
stroke-dasharray="5"/>

<!-- قوس من C نصف قطره 5 -->
<path d="M160 110 A100 100 0 0 0 100 35"
stroke="#1976D2"
fill="none"
stroke-dasharray="5"/>

<!-- نقطة التقاطع A -->
<circle cx="100" cy="35" r="3" fill="#c2185b"/>
<text x="95" y="25" font-size="12">A</text>

<!-- أضلاع المثلث -->
<line x1="100" y1="35" x2="40" y2="110" stroke="#c2185b" stroke-width="3"/>
<line x1="100" y1="35" x2="160" y2="110" stroke="#c2185b" stroke-width="3"/>

</svg>
</div>
خطوات الإنشاء (القاعدة 6 cm، الساقان 5 cm):

أرسم القاعدة <span class="math">[BC]</span> طولها 6 cm

أضع سن المدور في <span class="math">B</span> بفتحة 5 cm وأرسم قوساً

أضع سن المدور في <span class="math">C</span> بفتحة 5 cm وأرسم قوساً يقطع الأول

نقطة التقاطع هي الرأس <span class="math">A</span>

أصل <span class="math">A</span> مع <span class="math">B</span> و <span class="math">A</span> مع <span class="math">C</span>

</div><div style="border-right: 8px solid #4CAF50; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
🔷 <span style="color: #4CAF50;">المثلث القائم الزاوية</span>
تعريف: مثلث له زاوية قائمة (90°). الضلعان اللذان يحصران الزاوية القائمة يسميان ضلعا القائمة، والضلع الثالث يسمى الوتر.

<div style="text-align: center; margin: 20px 0;">
  <svg width="150" height="120" viewBox="0 0 150 120">
    <polygon points="20,100 20,30 110,100" fill="#e8f5e9" stroke="#4CAF50" stroke-width="3"/>
    <polyline points="20,90 30,90 30,100" fill="none" stroke="#4CAF50" stroke-width="2"/>
  </svg>
</div>
خطوات الإنشاء (AB = 4 cm، AC = 3 cm):

أرسم مستقيمين متعامدين في <span class="math">A</span>

على المستقيم الأفقي، عين <span class="math">B</span> حيث <span class="math">AB = 4 cm</span>

على المستقيم العمودي، عين <span class="math">C</span> حيث <span class="math">AC = 3 cm</span>

أصل <span class="math">B</span> مع <span class="math">C</span>

</div><div style="border-right: 8px solid #FF9800; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
🔷 <span style="color: #FF9800;">جدول ملخص</span>
نوع المثلث	الخصائص	طريقة الإنشاء
متقايس الأضلاع	3 أضلاع متساوية، 3 زوايا 60°	قوسان من طرفي القاعدة
متساوي الساقين	ضلعان متساويان، زاويتا القاعدة متساويتان	قوسان من طرفي القاعدة
قائم الزاوية	زاوية قائمة 90°	مستقيمان متعامدان + أطوال معلومة
</div>
</div>
4️⃣ تمثيل متعدد للمفهوم
<div style="background: linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
🎭 أربع تمثيلات للمثلثات الخاصة
</div><div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;"><div style="background: linear-gradient(145deg, #ffffff, #e3f2fd); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);"> <h4 style="color: #1976D2; text-align: center;">🔢 تمثيل عددي</h4> <div style="text-align: center;"> <p><span style="color: #1976D2;">متقايس الأضلاع:</span> 5 cm - 5 cm - 5 cm</p> <p><span style="color: #c2185b;">متساوي الساقين:</span> 5 cm - 5 cm - 6 cm</p> <p><span style="color: #4CAF50;">قائم الزاوية:</span> 3 cm - 4 cm - 5 cm</p> </div> </div><div style="background: linear-gradient(145deg, #ffffff, #ffebee); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);"> <h4 style="color: #c2185b; text-align: center;">📝 تمثيل لفظي</h4> <ul style="font-size: 1.1em; list-style-type: none; padding: 0;"> <li style="margin: 10px 0;">✓ "مثلث أضلاعه كلها متساوية"</li> <li style="margin: 10px 0;">✓ "مثلث له ضلعان متساويان"</li> <li style="margin: 10px 0;">✓ "مثلث فيه زاوية قائمة"</li> </ul> </div><div style="background: linear-gradient(145deg, #ffffff, #e8f5e9); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);"> <h4 style="color: #4CAF50; text-align: center;">📊 تمثيل هندسي</h4> <div style="text-align: center;"> <svg width="150" height="100" viewBox="0 0 150 100"> <polygon points="75,20 130,80 20,80" fill="#e3f2fd" stroke="#1976D2" stroke-width="2"/><line x1="73" y1="83" x2="77" y2="83" stroke="#1976D2" stroke-width="2"/></svg> </div> </div><div style="background: linear-gradient(145deg, #ffffff, #fff3e0); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);"> <h4 style="color: #FF9800; text-align: center;">📊 تمثيل جدولي</h4> <table style="width:100%; border-collapse: collapse; text-align: center;"> <tr style="background-color: #FF9800; color: white;"> <th>النوع</th> <th>الأضلاع</th> <th>الزوايا</th> </tr> <tr style="background-color: #fff3e0;"> <td>متقايس الأضلاع</td> <td>3 متساوية</td> <td>3 × 60°</td> </tr> <tr style="background-color: #ffe0b2;"> <td>متساوي الساقين</td> <td>2 متساويان</td> <td>زاويتا قاعدة متساويتان</td> </tr> <tr style="background-color: #ffcc80;"> <td>قائم الزاوية</td> <td>-</td> <td>زاوية قائمة 90°</td> </tr> </table> </div></div>
5️⃣ أمثلة محلولة تدريجيًا
📌 مثال 1: بسيط جدًا - إنشاء مثلث متقايس الأضلاع
<div style="background: linear-gradient(135deg,#667eea 0%,#764ba2 100%); padding:20px; border-radius:15px; margin:20px 0;">
<div style="background:white; padding:20px; border-radius:10px;">

<p style="font-size:1.3em;">
<strong style="color:#1976D2;">المطلوب:</strong>
أنشئ مثلثاً متقايس الأضلاع طول ضلعه 4 cm
</p>

<div style="display:flex; gap:30px; align-items:center; flex-wrap:wrap;">

<div style="flex:1; text-align:center;">

<svg width="170" height="150" viewBox="0 0 170 150">

<!-- القاعدة AB -->
<line x1="35" y1="105" x2="135" y2="105" stroke="black" stroke-width="3"/>

<!-- النقطة A -->
<circle cx="35" cy="105" r="3" fill="black"/>
<text x="30" y="125" font-size="12">A</text>

<!-- النقطة B -->
<circle cx="135" cy="105" r="3" fill="black"/>
<text x="130" y="125" font-size="12">B</text>

<!-- قوس من A -->
<path d="M35 105 A100 100 0 0 1 85 35"
stroke="blue"
fill="none"
stroke-dasharray="5"/>

<!-- قوس من B -->
<path d="M135 105 A100 100 0 0 0 85 35"
stroke="red"
fill="none"
stroke-dasharray="5"/>

<!-- نقطة التقاطع C -->
<circle cx="85" cy="35" r="3" fill="#c2185b"/>
<text x="80" y="25" font-size="12">C</text>

<!-- أضلاع المثلث -->
<line x1="35" y1="105" x2="85" y2="35" stroke="#c2185b" stroke-width="2"/>
<line x1="135" y1="105" x2="85" y2="35" stroke="#c2185b" stroke-width="2"/>

</svg>

</div>

<div style="flex:1;">

<p><strong style="color:#1976D2;">🔍 التفكير:</strong> نرسم AB = 4 cm ثم نرسم قوسين من A و B</p>

<p><strong style="color:#1976D2;">الخطوة 1:</strong> أرسم <span class="math">[AB]</span> = 4 cm</p>

<p><strong style="color:#1976D2;">الخطوة 2:</strong> قوس من <span class="math">A</span> بفتحة 4 cm</p>

<p><strong style="color:#1976D2;">الخطوة 3:</strong> قوس من <span class="math">B</span> بفتحة 4 cm</p>

<p><strong style="color:#c2185b;">النتيجة:</strong>
<span class="math">ABC</span> متقايس الأضلاع
</p>

</div>

</div>
</div>
</div>
</div>
📌 مثال 2: متوسط - إنشاء مثلث متساوي الساقين
<div style="background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%); padding: 20px; border-radius: 15px; margin: 20px 0;"><div style="background-color: white; padding: 20px; border-radius: 10px;"><p style="font-size: 1.3em;"><strong style="color: #FF9800;">المطلوب:</strong> أنشئ مثلثاً متساوي الساقين رأسه A وقاعدته [BC] طولها 5 cm وساقاه 6 cm</p><div style="display: flex; gap: 30px; align-items: center; flex-wrap: wrap;"><div style="flex: 1; text-align: center;"> <svg width="150" height="150" viewBox="0 0 150 150"> <line x1="25" y1="100" x2="125" y2="100" stroke="black" stroke-width="3"/><path d="M25 100 A60 60 0 0 1 75 40" stroke="blue" fill="none" stroke-dasharray="5"/> <path d="M125 100 A60 60 0 0 0 75 40" stroke="red" fill="none" stroke-dasharray="5"/> </svg> </div><div style="flex: 1;"> <p><strong style="color: #FF9800;">🔍 التفكير:</strong> نرسم القاعدة أولاً ثم نرسم قوسين</p> <p><strong style="color: #FF9800;">الخطوة 1:</strong> أرسم <span class="math">[BC]</span> = 5 cm</p> <p><strong style="color: #FF9800;">الخطوة 2:</strong> قوس من <span class="math">B</span> بفتحة 6 cm</p> <p><strong style="color: #FF9800;">الخطوة 3:</strong> قوس من <span class="math">C</span> بفتحة 6 cm</p> <p><strong style="color: #c2185b;">النتيجة:</strong> <span class="math">ABC</span> متساوي الساقين</p> </div></div></div></div>
📌 مثال 3: يتطلب تحليل - إنشاء مثلث قائم الزاوية
<div style="background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%); padding: 20px; border-radius: 15px; margin: 20px 0;">
  <div style="background-color: white; padding: 20px; border-radius: 10px;">
  <p style="font-size: 1.3em;">
  <strong style="color: #4CAF50;">المطلوب:</strong> أنشئ مثلثاً قائم الزاوية في A حيث AB = 3 cm، AC = 4 cm</p>
  <div style="display: flex; gap: 30px; align-items: center; flex-wrap: wrap;">
  <div style="flex: 1; text-align: center;"> 
    <svg width="150" height="150" viewBox="0 0 150 150"> 
      <line x1="30" y1="100" x2="130" y2="100" stroke="black" stroke-width="3"/> 
      <line x1="30" y1="100" x2="30" y2="30" stroke="black" stroke-width="3"/>
      <path d="M30 100 L30 90 L40 90 L40 100 Z" fill="green"/> 
    </svg>
  </div>
  <div style="flex: 1;">
  <p><strong style="color: #4CAF50;">🔍 تحليل:</strong> نرسم مستقيمين متعامدين في A</p> <p><strong style="color: #4CAF50;">الخطوة 1:</strong> أرسم مستقيمين متعامدين في <span class="math">A</span></p> <p><strong style="color: #4CAF50;">الخطوة 2:</strong> على الأفقي، عين <span class="math">B</span> حيث <span class="math">AB = 3 cm</span></p> <p><strong style="color: #4CAF50;">الخطوة 3:</strong> على العمودي، عين <span class="math">C</span> حيث <span class="math">AC = 4 cm</span></p> <p><strong style="color: #c2185b;">النتيجة:</strong> <span class="math">ABC</span> قائم في <span class="math">A</span></p> </div></div></div></div>
📌 مثال 4: تطبيقي من الحياة اليومية
<div style="background: linear-gradient(135deg, #9C27B0 0%, #6A1B9A 100%); padding: 20px; border-radius: 15px; margin: 20px 0;"><div style="background-color: white; padding: 20px; border-radius: 10px;"><p style="font-size: 1.3em;"><strong style="color: #9C27B0;">الوضعية:</strong> يريد نجار بناء سقف على شكل مثلث متساوي الساقين، قاعدته 4 m وساقاه 3 m. ساعده في الإنشاء بمقياس 1 cm = 1 m.</p><p><strong style="color: #9C27B0;">🔍 التفكير:</strong> نطبق نفس خطوات إنشاء المثلث المتساوي الساقين</p> <p><strong style="color: #9C27B0;">النتيجة:</strong> نرسم قاعدة 4 cm وقوسين من طرفيها بفتحة 3 cm</p></div></div></div>
6️⃣ أخطاء شائعة وتحليلها
<div style="background-color: #ffebee; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
⚠️ لماذا نقع في الخطأ؟ وكيف نتفاداه؟
<div style="overflow-x: auto;"> <table style="width:100%; border-collapse: collapse; text-align: center;"> <tr style="background-color: #c62828; color: white;"> <th style="padding: 15px;">الخطأ</th> <th style="padding: 15px;">مثاله</th> <th style="padding: 15px;">لماذا يحدث؟</th> <th style="padding: 15px;">كيف نتفاداه؟</th> </tr> <tr style="background-color: #ffcdd2;"> <td style="padding: 15px; font-weight: bold;">الخطأ 1</td> <td style="padding: 15px;">نسيان فتحة المدور</td> <td style="padding: 15px;">عدم ضبط الفتحة بدقة</td> <td style="padding: 15px;">نتأكد من فتحة المدور قبل الرسم</td> </tr> <tr style="background-color: #ef9a9a;"> <td style="padding: 15px; font-weight: bold;">الخطأ 2</td> <td style="padding: 15px;">عدم تقاطع الأقواس</td> <td style="padding: 15px;">الفتحة صغيرة جداً</td> <td style="padding: 15px;">نتأكد أن مجموع الساقين > القاعدة</td> </tr> <tr style="background-color: #e57373;"> <td style="padding: 15px; font-weight: bold;">الخطأ 3</td> <td style="padding: 15px;">زاوية غير قائمة في المثلث القائم</td> <td style="padding: 15px;">عدم رسم المتعامدين بدقة</td> <td style="padding: 15px;">نستعمل المثلث القائم أو المنقلة</td> </tr> <tr style="background-color: #ef5350;"> <td style="padding: 15px; font-weight: bold;">الخطأ 4</td> <td style="padding: 15px;">الخلط بين أنواع المثلثات</td> <td style="padding: 15px;">عدم التمييز بين الخصائص</td> <td style="padding: 15px;">نقرأ المعطيات جيداً قبل الإنشاء</td> </tr> </table> </div><div style="background-color: #c8e6c9; padding: 20px; border-radius: 10px; margin-top: 20px;">
✅ كيف نتحقق من صحة الحل؟

<ul style="font-size: 1.1em;"> <li>✓ نقيس الأضلاع: هل هي كما هو مطلوب؟</li> <li>✓ في المثلث القائم، نتحقق من الزاوية القائمة بالمنقلة</li> <li>✓ في المثلث المتساوي الساقين، نتأكد من تساوي الساقين</li> </ul></div></div>
8️⃣ فقرة "نفكر معًا"
<div style="background: linear-gradient(135deg, #FF6B6B 0%, #C2185B 100%); padding: 30px; border-radius: 15px; margin: 20px 0;"><div style="background-color: white; padding: 25px; border-radius: 10px; text-align: center;">
💭 سؤال مفتوح للتفكير
<p style="font-size: 1.5em; color: #c2185b; font-weight: bold;">هل يمكن أن يكون المثلث متساوي الساقين قائم الزاوية؟ أعط مثالاً.</p><div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-top: 20px;"> <p>🔰 نعم، مثلث زواياه 45°، 45°، 90° وساقاه متساويان.</p> <p>مثال: مثلث قائم ومتساوي الساقين طول كل ساق 5 cm.</p> </div></div></div>
9️⃣ تقويم تكويني قصير
<div style="background: linear-gradient(135deg, #4ECDC4 0%, #2C3E50 100%); padding: 25px; border-radius: 15px; margin: 20px 0;"><div style="background-color: white; padding: 25px; border-radius: 10px;">
📝 5 أسئلة سريعة
<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;"><div style="background-color: #e3f2fd; padding: 15px; border-radius: 10px;"> <p><strong>1. ما هي أنواع المثلثات الخاصة؟</strong></p> <p style="background-color: #1976D2; color: white; padding: 10px; border-radius: 5px;">متقايس الأضلاع، متساوي الساقين، قائم</p> </div><div style="background-color: #fff3e0; padding: 15px; border-radius: 10px;"> <p><strong>2. كم قياس زوايا المثلث المتقايس الأضلاع؟</strong></p> <p style="background-color: #FF9800; color: white; padding: 10px; border-radius: 5px;">60° لكل زاوية</p> </div><div style="background-color: #e8f5e9; padding: 15px; border-radius: 10px;"> <p><strong>3. أداة إنشاء المثلثات هي؟</strong></p> <p style="background-color: #4CAF50; color: white; padding: 10px; border-radius: 5px;">المدور</p> </div><div style="background-color: #f3e5f5; padding: 15px; border-radius: 10px;"> <p><strong>4. كم ضلعاً متساوياً في المثلث المتساوي الساقين؟</strong></p> <p style="background-color: #9C27B0; color: white; padding: 10px; border-radius: 5px;">2</p> </div><div style="grid-column: span 2; background-color: #ffebee; padding: 15px; border-radius: 10px;"> <p><strong>5. ما هي شروط إنشاء مثلث؟</strong></p> <p style="background-color: #c2185b; color: white; padding: 10px; border-radius: 5px;">مجموع طولي أي ضلعين > طول الضلع الثالث</p> </div></div></div></div>
✨ خلاصة الدرس
<div style="background: linear-gradient(135deg, #43C6AC 0%, #191654 100%); padding: 30px; border-radius: 15px; margin: 30px 0; text-align: center; color: white;">
📌 ملخص إنشاء المثلثات الخاصة
<div style="display: flex; justify-content: space-around; margin: 30px 0; flex-wrap: wrap;">
  <div style="background-color: rgba(255,255,255,0.9); padding: 25px; border-radius: 15px; width: 30%; margin: 10px;">
   <h3 style="color: #1976D2;">🔷 متقايس الأضلاع</h3>
    <p style="color: #100000;">AB = BC = AC</p>
    <p style="color: #100000;">قوسان من A و B</p>
  </div>
    <div style="background-color: rgba(255,255,255,0.9); padding: 25px; border-radius: 15px; width: 30%; margin: 10px;">
          <h3 style="color: #c2185b;">🔶 متساوي الساقين</h3>
            <p style="color: #100000;">AB = AC</p>
            <p style="color: #100000;">قوسان من B و C</p>
    </div>
    <div style="background-color: rgba(255,255,255,0.9); padding: 25px; border-radius: 15px; width: 30%; margin: 10px;">
    <h3 style="color: #4CAF50;">🔷 قائم الزاوية</h3>
      <p style="color: #100000;">∠A = 90°</p>
      <p style="color: #100000;">مستقيمان متعامدان</p>
    </div>
  </div>
<p style="background-color: rgba(255,255,255,0.95); padding: 20px; border-radius: 50px; font-size: 1.5em; color: #333; margin-top: 20px;">
 <strong>✨ المدور أداة إنشاء المثلثات ✨</strong> </p>
</div>
</div>
  `;

  const lesson = await prisma.lesson.create({
    data: {
      title: 'إنشاء المثلثات الخاصة',
      content: lessonContent,
      authorId: teacher.id,
      subjectId: subject.id,
      levelId: level.id,
      type: 'private',
      status: 'approved',
      published: true,
      contentType: 'ARTICLE',
      lessonFileIds: '[]',
      exercises: {
        create: [
          {
            type: 'support_with_results', // 1
            question: 'أكمل الفراغات:\n1) المثلث المتساوي الأضلاع له ... أضلاع متساوية\n2) المثلث المتساوي الساقين له ... ضلعان متساويان\n3) المثلث القائم الزاوية له زاوية قياسها ...\n4) لإنشاء مثلث متساوي الأضلاع نستعمل ...',
            expectedResults: JSON.stringify([
              { question: "1", result: "3" },
              { question: "2", result: "2" },
              { question: "3", result: "90°" },
              { question: "4", result: "المدور" }
            ]),
            displayOrder: 1,
            maxScore: 4,
            exerciseFileIds: '[]',
            questionFileIds: '[]',
            modelAnswerFileIds: '[]',
          },
          {
            type: 'support_with_results', // 2
            question: 'أكمل الجدول:\n| نوع المثلث | عدد الأضلاع المتساوية | عدد الزوايا المتساوية |\n|---|---|---|\n| متساوي الأضلاع | ؟ | ؟ |\n| متساوي الساقين | ؟ | ؟ |\n| قائم الزاوية | ؟ | ؟ |',
            expectedResults: JSON.stringify([
              { question: "متساوي الأضلاع - أضلاع", result: "3" },
              { question: "متساوي الأضلاع - زوايا", result: "3" },
              { question: "متساوي الساقين - أضلاع", result: "2" },
              { question: "متساوي الساقين - زوايا", result: "2" },
              { question: "قائم الزاوية - أضلاع", result: "0" },
              { question: "قائم الزاوية - زوايا", result: "0" }
            ]),
            displayOrder: 2,
            maxScore: 6,
            exerciseFileIds: '[]',
            questionFileIds: '[]',
            modelAnswerFileIds: '[]',
          },
          {
            type: 'support_with_results', // 3
            question: 'اختر الإجابة الصحيحة:\n1) مثلث أضلاعه 5 cm، 5 cm، 5 cm هو ...\n2) مثلث أضلاعه 4 cm، 4 cm، 6 cm هو ...\n3) مثلث أضلاعه 3 cm، 4 cm، 5 cm هو ...\n4) أداة إنشاء المثلثات هي ...',
            expectedResults: JSON.stringify([
              { question: "1", result: "متساوي الأضلاع" },
              { question: "2", result: "متساوي الساقين" },
              { question: "3", result: "قائم الزاوية" },
              { question: "4", result: "المدور" }
            ]),
            displayOrder: 3,
            maxScore: 4,
            exerciseFileIds: '[]',
            questionFileIds: '[]',
            modelAnswerFileIds: '[]',
          },
          {
            type: 'support_with_results', // 4
            question: 'أنشئ مثلثاً متساوي الأضلاع طول ضلعه 6 cm. ما هو طول كل ضلع؟',
            expectedResults: JSON.stringify([
              { question: "1", result: "6 cm" }
            ]),
            displayOrder: 4,
            maxScore: 1,
            exerciseFileIds: '[]',
            questionFileIds: '[]',
            modelAnswerFileIds: '[]',
          },
          {
            type: 'support_with_results', // 5
            question: 'أنشئ مثلثاً متساوي الساقين قاعدته 5 cm وساقاه 7 cm. ما هو طول الساقين؟',
            expectedResults: JSON.stringify([
              { question: "1", result: "7 cm" }
            ]),
            displayOrder: 5,
            maxScore: 1,
            exerciseFileIds: '[]',
            questionFileIds: '[]',
            modelAnswerFileIds: '[]',
          },
          {
            type: 'support_with_results', // 6
            question: 'أنشئ مثلثاً قائم الزاوية في A حيث AB = 4 cm، AC = 6 cm. ما هو قياس الزاوية A؟',
            expectedResults: JSON.stringify([
              { question: "1", result: "90°" }
            ]),
            displayOrder: 6,
            maxScore: 1,
            exerciseFileIds: '[]',
            questionFileIds: '[]',
            modelAnswerFileIds: '[]',
          },
          {
            type: 'support_with_results', // 7
            question: 'لدينا AB = 5 cm. نريد إنشاء مثلث متساوي الأضلاع ABC.\n1) ما هي فتحة المدور من A؟\n2) ما هي فتحة المدور من B؟',
            expectedResults: JSON.stringify([
              { question: "1", result: "5 cm" },
              { question: "2", result: "5 cm" }
            ]),
            displayOrder: 7,
            maxScore: 2,
            exerciseFileIds: '[]',
            questionFileIds: '[]',
            modelAnswerFileIds: '[]',
          },
          {
            type: 'main', // 8
            question: 'مشكلة: بناء خيمة\nالوضعية: يريد بناء خيمة على شكل مثلث متساوي الساقين، قاعدته 3 m وساقاه 4 m.\nالمطلوب: أنشئ المثلث بمقياس 1 cm = 1 m. ما هي أطوال الأضلاع على الرسم؟',
            modelAnswer: 'القاعدة على الرسم طولها 3 cm، وطول كل ساق 4 cm.',
            displayOrder: 8,
            maxScore: 5,
            exerciseFileIds: '[]',
            questionFileIds: '[]',
            modelAnswerFileIds: '[]',
          },
          {
            type: 'main', // 9
            question: 'مسألة: حديقة مثلثة\nالوضعية: حديقة على شكل مثلث قائم الزاوية، ضلعا القائمة 30 m و 40 m.\nالمطلوب: أنشئ الحديقة بمقياس 1 cm = 10 m. ما هي أطوال أضلاع المثلث على الرسم؟',
            modelAnswer: 'طول ضلعي القائمة على الرسم هما 3 cm و 4 cm. طول الوتر على الرسم هو 5 cm.',
            displayOrder: 9,
            maxScore: 5,
            exerciseFileIds: '[]',
            questionFileIds: '[]',
            modelAnswerFileIds: '[]',
          },
          {
            type: 'main', // 10
            question: 'التحدي الكبير - إنشاء متكامل\nالوضعية: أنشئ مثلثاً متساوي الساقين قاعدته 6 cm وساقاه 5 cm، ثم أنشئ مثلثاً قائماً ضلعا قائمته 4 cm و 3 cm.\nالمطلوب: قارن بين طول وتر المثلث القائم وطول ساق المثلث متساوي الساقين.',
            modelAnswer: 'طول وتر المثلث القائم هو 5 cm. طول ساق المثلث متساوي الساقين هو 5 cm. إذن، هما متساويان.',
            displayOrder: 10,
            maxScore: 5,
            exerciseFileIds: '[]',
            questionFileIds: '[]',
            modelAnswerFileIds: '[]',
          }
        ]
      }
    },
  });

  console.log(`✅ تم إنشاء درس "${lesson.title}" بنجاح (ID: ${lesson.id})`);
}

main()
  .catch((e) => {
    console.error('❌ خطأ في إنشاء الدرس:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });