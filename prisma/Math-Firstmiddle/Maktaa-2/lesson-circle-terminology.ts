import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding Lesson: Geometric Terms and Notations ...');

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

1️⃣ وضعية انطلاق 
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
🎯 مشكلة: رسم شعار دائري لمدرسة
<p>يريد تلاميذ متوسطة "الإخوة مزيان" رسم شعار دائري للمدرسة. لديهم نقطة مركزية O ويريدون رسم دائرة نصف قطرها 5 cm.</p>

</div>
<div style="display: flex; justify-content: center; gap: 30px; margin: 30px 0; flex-wrap: wrap;">
  <!-- SVG 1: دائرة ونصف قطرها (تم تصحيح طول نصف القطر) -->
  <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
    <svg width="150" height="150" viewBox="0 0 150 150">
      <circle cx="75" cy="75" r="50" fill="none" stroke="#1976D2" stroke-width="3"></circle>
      <circle cx="75" cy="75" r="4" fill="red"></circle>
      <text x="70" y="90" fill="red" font-weight="bold">O</text>
      <line x1="75" y1="75" x2="125" y2="75" stroke="#FF9800" stroke-width="2" stroke-dasharray="5"></line>
      <text x="110" y="70" fill="#FF9800">r = 5 cm</text>
    </svg>
    <p><strong>دائرة مركزها O ونصف قطرها 5 cm</strong></p>
  </div>
  <!-- SVG 2: نقطة على الدائرة (تم تصحيح موقع النقطة A) -->
  <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
    <svg width="150" height="150" viewBox="0 0 150 150">
      <circle cx="75" cy="75" r="40" fill="none" stroke="#c2185b" stroke-width="3"></circle>
      <circle cx="75" cy="75" r="4" fill="red"></circle>
      <text x="80" y="70" fill="red" font-weight="bold">O</text>
      <circle cx="115" cy="75" r="3" fill="blue"></circle>
      <text x="130" y="75" fill="blue" font-weight="bold">A</text>
      <text x="60" y="35" fill="green">A ∈ (C)</text>
    </svg>
    <p><strong>النقطة A تقع على الدائرة</strong></p>
  </div>
</div>
<p>🔍 كيف يمكن رسم دائرة بدقة باستخدام المدور؟</p>

<p><strong>❓ التساؤلات:</strong></p>
<ul>
<li>ما هي العناصر الأساسية للدائرة؟</li>
<li>كيف نرسم دائرة بمعلومية مركزها ونصف قطرها؟</li>
<li>كيف نحدد ما إذا كانت نقطة تنتمي إلى الدائرة؟</li>
</ul>

2️⃣ مرحلة البحث والاكتشاف
<div style="background-color: #fff9e6; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
<h3>🧪 نشاط استكشافي: هيا نكتشف إنشاء الدائرة!</h3>
<h4>📌 النشاط 1: التعرف على الدائرة</h4>
<p>لاحظ الشكل التالي:</p>

<!-- SVG 3: التعرف على الدائرة (تم تصحيح مواقع النقاط A و B لتكون على الدائرة) -->
<div style="display: flex; justify-content: center; margin: 20px 0;">
  <svg width="200" height="200" viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="60" fill="none" stroke="blue" stroke-width="3"></circle>
    <circle cx="100" cy="100" r="4" fill="red"></circle>
    <text x="95" y="95" fill="red" font-weight="bold">O</text>
    <circle cx="160" cy="100" r="4" fill="green"></circle>
    <text x="175" y="95" fill="green" font-weight="bold">A</text>
    <circle cx="100" cy="40" r="4" fill="purple"></circle>
    <text x="105" y="30" fill="purple" font-weight="bold">B</text>
    <line x1="100" y1="100" x2="160" y2="100" stroke="orange" stroke-width="2"></line>
    <line x1="100" y1="100" x2="100" y2="40" stroke="orange" stroke-width="2"></line>
    <text x="130" y="95" fill="orange">r</text>
    <text x="95" y="70" fill="orange">r</text>
  </svg>
</div>
<p><strong>❓ أسئلة موجهة:</strong></p>
<ul>
<li>ما اسم النقطة O? <span style="background-color: #1976D2; color: white; padding: 3px 8px; border-radius: 15px;">مركز الدائرة</span></li>
<li>ما العلاقة بين OA و OB? <span style="background-color: #FF9800; color: white; padding: 3px 8px; border-radius: 15px;">متساويان</span></li>
<li>ماذا نسمي المسافة OA? <span style="background-color: #4CAF50; color: white; padding: 3px 8px; border-radius: 15px;">نصف القطر</span></li>
</ul>

<h4>📌 النشاط 2: اكتشاف طريقة الإنشاء</h4>
<p>لدينا نقطة O وطول r = 4 cm. كيف نرسم الدائرة؟</p>

<!-- SVG 4: طريقة الإنشاء (تم تحسين الرسم ليعبر عن دورة كاملة بالمدور) -->
<div style="display: flex; justify-content: center; margin: 20px 0;">
  <svg width="200" height="180" viewBox="0 0 200 180">
    <circle cx="100" cy="80" r="4" fill="red"></circle>
    <text x="105" y="100" fill="red" font-weight="bold">O</text>
    <line x1="100" y1="80" x2="140" y2="80" stroke="blue" stroke-width="2"></line>
    <text x="120" y="75" fill="blue">r</text>
    <text x="100" y="20" fill="blue"> r = 4 cm</text>
    <circle cx="100" cy="80" r="40" stroke="green" stroke-width="3" stroke-dasharray="5" fill="none"/>
    <text x="150" y="140" fill="green">نضع إبرة المدور في O </text>
    <text x="150" y="160" fill="green">ونفتحه 4 cm</text>
    <text x="150" y="180" fill="green">ثم ندير دورة كاملة</text>
  </svg>
</div>
<p><strong>❓ أسئلة موجهة:</strong></p>
<ul>
<li>أين نضع إبرة المدور? <span style="background-color: #c2185b; color: white; padding: 3px 8px; border-radius: 15px;">في المركز O</span></li>
<li>كم نفتح المدور? <span style="background-color: #9C27B0; color: white; padding: 3px 8px; border-radius: 15px;">بمقدار نصف القطر</span></li>
<li>كيف ندير المدور? <span style="background-color: #4CAF50; color: white; padding: 3px 8px; border-radius: 15px;">دورة كاملة</span></li>
</ul>

</div>
3️⃣ بناء المفهوم (Institutionnalisation)
<div style="background: linear-gradient(135deg, #43C6AC 0%, #191654 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
<h3>📚 تعريف ومصطلحات الدائرة</h3>
</div><div style="background-color: #e3f2fd; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);"><div style="border-right: 8px solid #1976D2; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
<h4>🔷 <span style="color: #1976D2;">تعريف الدائرة</span></h4>
<p>الدائرة هي مجموعة جميع النقاط التي تبعد نفس المسافة عن نقطة ثابتة تسمى مركز الدائرة.</p>

<!-- SVG 5: تعريف الدائرة (تم تصحيح مواقع النقاط A, B, C لتكون على الدائرة) -->
<div style="text-align: center; margin: 20px 0;">
  <svg width="200" height="200" viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="60" fill="none" stroke="#1976D2" stroke-width="3"></circle>
    <circle cx="100" cy="100" r="4" fill="red"></circle>
    <text x="105" y="95" fill="red" font-weight="bold">O</text>
    <circle cx="160" cy="100" r="4" fill="blue"></circle>
    <text x="175" y="95" fill="blue" font-weight="bold">A</text>
    <circle cx="70" cy="149.6" r="4" fill="green"></circle>
    <text x="60" y="155" fill="green" font-weight="bold">B</text>
    <circle cx="48" cy="70" r="4" fill="purple"></circle>
    <text x="38" y="65" fill="purple" font-weight="bold">C</text>
    <line x1="100" y1="100" x2="160" y2="100" stroke="orange" stroke-width="2"></line>
    <line x1="100" y1="100" x2="70" y2="149.6" stroke="orange" stroke-width="2"></line>
    <line x1="100" y1="100" x2="48" y2="70" stroke="orange" stroke-width="2"></line>
  </svg>
  <p><span class="math">OA = OB = OC = r</span></p>
</div></div><div style="border-right: 8px solid #c2185b; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
<h4>🔷 <span style="color: #c2185b;">المصطلحات الأساسية</span></h4>
<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;"><div style="background-color: #ffebee; padding: 15px; border-radius: 10px;"> <p style="font-weight: bold; color: #c2185b;">المركز</p> <p>النقطة الثابتة O</p> <svg width="60" height="60" viewBox="0 0 60 60"> <circle cx="30" cy="30" r="3" fill="red"></circle> <text x="35" y="25" fill="red">O</text> </svg> </div><div style="background-color: #fff3e0; padding: 15px; border-radius: 10px;"> <p style="font-weight: bold; color: #FF9800;">نصف القطر</p> <p>المسافة من المركز للدائرة</p> <svg width="60" height="60" viewBox="0 0 60 60"> <circle cx="30" cy="30" r="20" fill="none" stroke="black"></circle> <line x1="30" y1="30" x2="50" y2="30" stroke="red"></line> <text x="40" y="25" fill="red">r</text> </svg> </div><div style="background-color: #e8f5e9; padding: 15px; border-radius: 10px;"> <p style="font-weight: bold; color: #4CAF50;">القُطر</p> <p>قطعة تمر بالمركز وطرفاها على الدائرة</p> <svg width="60" height="60" viewBox="0 0 60 60"> <circle cx="30" cy="30" r="20" fill="none" stroke="black"></circle> <line x1="10" y1="30" x2="50" y2="30" stroke="blue"></line> <text x="25" y="20" fill="blue">d</text> </svg> </div><div style="background-color: #f3e5f5; padding: 15px; border-radius: 10px;"> <p style="font-weight: bold; color: #9C27B0;">الوتر</p> <p>قطعة طرفاها على الدائرة</p> <svg width="60" height="60" viewBox="0 0 60 60"> <circle cx="30" cy="30" r="20" fill="none" stroke="black"></circle> <line x1="14" y1="19" x2="41" y2="46" stroke="purple"></line> </svg> </div></div></div><div style="border-right: 8px solid #4CAF50; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
<h4>🔷 <span style="color: #4CAF50;">إنشاء دائرة بمعرفة المركز ونصف القطر</span></h4>
<div style="display: flex; align-items: center; gap: 30px; flex-wrap: wrap;"><div style="flex: 1;"> <p><strong>الخطوات:</strong></p> <ol><li>نحدد المركز <span class="math">O</span> على الورقة</li><li>نفتح المدور بفتحة تساوي نصف القطر <span class="math">r</span></li><li>نضع إبرة المدور في <span class="math">O</span></li><li>ندير المدور دورة كاملة</li><li>نحصل على الدائرة المطلوبة</li></ol> </div>
<div style="flex: 1; text-align: center;">
  <svg width="150" height="200" viewBox="0 0 150 150">
    <circle cx="75" cy="75" r="50" fill="none" stroke="#4CAF50" stroke-width="3"></circle>
    <circle cx="75" cy="75" r="4" fill="red"></circle>
    <text x="75" y="70" fill="red">O</text>
    <line x1="75" y1="75" x2="123" y2="75" stroke="#FF9800" stroke-width="2"></line>
    <text x="105" y="70" fill="#FF9800">r</text>
    <text x="120" y="140" fill="black">(C) دائرة مركزها O</text>
    <text x="120" y="155" fill="black">ونصف قطرها r</text>
  </svg>
  </div></div></div><div style="border-right: 8px solid #FF9800; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
<h4>🔷 <span style="color: #FF9800;">الانتماء إلى الدائرة</span></h4>
<table style="width:100%; border-collapse: collapse; text-align: center;">
<tr><th>الرمز</th><th>القراءة</th><th>المعنى</th></tr>
<tr><td><span class="math">A ∈ (C)</span></td><td>A تنتمي إلى الدائرة (C)</td><td>A تقع على محيط الدائرة (OA = r)</td></tr>
<tr><td><span class="math">B ∉ (C)</span></td><td>B لا تنتمي إلى الدائرة (C)</td><td>B داخل الدائرة (OB &lt; r)</td></tr>
<tr><td><span class="math">C ∉ (C)</span></td><td>C لا تنتمي إلى الدائرة (C)</td><td>C خارج الدائرة (OC &gt; r)</td></tr>
</table>
<!-- SVG 6: الانتماء للدائرة (تم تصحيح مواقع النقاط A, B, C لتكون دقيقة) -->
<div style="text-align: center; margin: 20px 0;">
  <svg width="200" height="120" viewBox="0 0 200 120">
    <circle cx="100" cy="60" r="40" fill="none" stroke="black" stroke-width="2"></circle>
    <circle cx="100" cy="60" r="3" fill="red"></circle>
    <text x="105" y="55" fill="red" font-weight="bold">O</text>
    <!-- Point A on the circle -->
    <circle cx="140" cy="60" r="3" fill="blue"></circle>
    <text x="155" y="55" fill="blue" font-weight="bold">A</text>
    <!-- Point B inside the circle -->
    <circle cx="80" cy="50" r="3" fill="green"></circle>
    <text x="60" y="45" fill="green" font-weight="bold">B</text>
    <!-- Point C outside the circle -->
    <circle cx="150" cy="100" r="3" fill="purple"></circle>
    <text x="155" y="95" fill="purple" font-weight="bold">C</text>
  </svg>
</div></div></div>
4️⃣ تمثيل متعدد للمفهوم
<div style="background: linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
<h3>🎭 أربع تمثيلات للدائرة</h3>
</div><div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;"><div style="background: linear-gradient(145deg, #ffffff, #e3f2fd); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);"> <h4 style="color: #1976D2; text-align: center;">🔢 تمثيل عددي</h4> <div style="text-align: center;"> <p>مركز <span class="math">O</span></p> <p>نصف القطر <span class="math">r = 5 cm</span></p> <p>القطر <span class="math">d = 10 cm</span></p> </div> </div><div style="background: linear-gradient(145deg, #ffffff, #ffebee); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);"> <h4 style="color: #c2185b; text-align: center;">📝 تمثيل لفظي</h4> <ul style="font-size: 1.1em; list-style-type: none; padding: 0;"> <li style="margin: 10px 0;">✓ "دائرة مركزها O"</li> <li style="margin: 10px 0;">✓ "نصف قطرها 5 إبرةتيمتر"</li> <li style="margin: 10px 0;">✓ "جميع النقاط على بعد 5 cm من O"</li> </ul> </div><div style="background: linear-gradient(145deg, #ffffff, #e8f5e9); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);"> <h4 style="color: #4CAF50; text-align: center;">📊 تمثيل هندسي</h4> <div style="text-align: center;"> <svg width="120" height="120" viewBox="0 0 120 120"> <circle cx="60" cy="60" r="40" fill="none" stroke="#4CAF50" stroke-width="3"></circle> <circle cx="60" cy="60" r="3" fill="red"></circle> <text x="65" y="55" fill="red">O</text> </svg> </div> </div><div style="background: linear-gradient(145deg, #ffffff, #fff3e0); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);"> <h4 style="color: #FF9800; text-align: center;">🔣 تمثيل جدولي</h4> <table style="width:100%; border-collapse: collapse; text-align: center;"> <tr style="background-color: #FF9800; color: white;"> <th>الرمز</th> <th>المعنى</th> </tr> <tr style="background-color: #fff3e0;"> <td><span class="math">(C)</span></td> <td>الدائرة</td> </tr> <tr style="background-color: #ffe0b2;"> <td><span class="math">O</span></td> <td>مركز الدائرة</td> </tr> <tr style="background-color: #ffcc80;"> <td><span class="math">r</span></td> <td>نصف القطر</td> </tr> <tr style="background-color: #ffb74d;"> <td><span class="math">A من (C)</span></td> <td>A على الدائرة</td> </tr> </table> </div></div>
5️⃣ أمثلة محلولة تدريجيًا
<h4>📌 مثال 1: بسيط جدًا - إنشاء دائرة</h4>
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 15px; margin: 20px 0;">
  <div style="background-color: white; padding: 20px; border-radius: 10px;">
    <p style="font-size: 1.3em;"><strong style="color: #1976D2;">المطلوب:</strong> أنشئ دائرة مركزها <span class="math">O</span> ونصف قطرها <span class="math">r = 4 cm</span></p>
    <div style="display: flex; gap: 30px; align-items: center; flex-wrap: wrap;">
    <div style="flex: 1; text-align: center;">
    <svg width="150" height="150" viewBox="0 0 150 150">
    <circle cx="75" cy="75" r="40" fill="none" stroke="#1976D2" stroke-width="3"></circle>
    <circle cx="75" cy="75" r="4" fill="red"></circle>
    <text x="80" y="95" fill="red">O</text>
    <line x1="75" y1="75" x2="115" y2="75" stroke="#FF9800" stroke-width="2"></line>
    <text x="105" y="65" fill="#FF9800">4 cm</text>
  </svg>
  </div><div style="flex: 1;"> <p><strong style="color: #1976D2;">🔍 التفكير:</strong> نستعمل المدور لرسم الدائرة</p> <ol><li>نحدد النقطة <span class="math">O</span></li><li>نفتح المدور 4 cm</li><li>نضع إبرة المدور في <span class="math">O</span> ونديره</li></ol> <p><strong style="color: #c2185b;">النتيجة:</strong> دائرة مركزها O ونصف قطرها 4 cm</p> </div></div></div></div>
<h4>📌 مثال 2: متوسط - تحديد موقع نقطة بالنسبة للدائرة</h4>
<div style="background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%); padding: 20px; border-radius: 15px; margin: 20px 0;"><div style="background-color: white; padding: 20px; border-radius: 10px;"><p style="font-size: 1.3em;"><strong style="color: #FF9800;">المعطيات:</strong> دائرة مركزها <span class="math">O</span> ونصف قطرها <span class="math">r = 5 cm</span></p> <p>نقاط: <span class="math">OA = 3 cm</span>، <span class="math">OB = 5 cm</span>، <span class="math">OC = 7 cm</span></p><div style="display: flex; gap: 30px; align-items: center; flex-wrap: wrap;"><div style="flex: 1; text-align: center;"> <svg width="150" height="150" viewBox="0 0 150 150"> <circle cx="75" cy="75" r="50" fill="none" stroke="#FF9800" stroke-width="3"></circle> <circle cx="75" cy="75" r="3" fill="red"></circle> <text x="80" y="70" fill="red">O</text> <circle cx="50" cy="60" r="3" fill="blue"></circle> <text x="50" y="55" fill="blue">A</text> <circle cx="130" cy="100" r="3" fill="purple"></circle> <text x="130" y="120" fill="purple">C</text> <circle cx="110" cy="40" r="3" fill="green"></circle> <text x="115" y="35" fill="green">B</text> </svg> </div><div style="flex: 1;"> <p><strong style="color: #FF9800;">🔍 التفكير:</strong> نقارن المسافات مع نصف القطر</p> <p><span class="math">OA = 3 cm &lt; r</span> ⇒ <span style="color: #1976D2;">A داخل الدائرة</span></p> <p><span class="math">OB = 5 cm = r</span> ⇒ <span style="color: #4CAF50;">B على الدائرة</span></p> <p><span class="math">OC = 7 cm &gt; r</span> ⇒ <span style="color: #c2185b;">C خارج الدائرة</span></p> </div></div></div></div>
<h4>📌 مثال 3: يتطلب تحليل - إنشاء دائرة بمعلومية قطر</h4>
<div style="background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%); padding: 20px; border-radius: 15px; margin: 20px 0;"><div style="background-color: white; padding: 20px; border-radius: 10px;"><p style="font-size: 1.3em;"><strong style="color: #4CAF50;">المطلوب:</strong> أنشئ دائرة قطرها <span class="math">[AB]</span> حيث <span class="math">AB = 8 cm</span></p><div style="display: flex; gap: 30px; align-items: center; flex-wrap: wrap;"><div style="flex: 1; text-align: center;"> <svg width="200" height="100" viewBox="0 0 200 100"> <line x1="30" y1="50" x2="170" y2="50" stroke="black" stroke-width="3"></line> <circle cx="30" cy="50" r="4" fill="red"></circle> <text x="20" y="40" fill="red">A</text> <circle cx="170" cy="50" r="4" fill="blue"></circle> <text x="175" y="40" fill="blue">B</text> <circle cx="100" cy="50" r="4" fill="green"></circle> <text x="105" y="40" fill="green">O</text> <text x="80" y="70" fill="black">AB = 8 cm</text> </svg> </div><div style="flex: 1;"> <p><strong style="color: #4CAF50;">🔍 تحليل:</strong> مركز الدائرة هو منتصف القطر</p> <ol><li>نعين منتصف <span class="math">[AB]</span> وهو <span class="math">O</span></li><li>نصف القطر = 4 cm</li><li>نرسم دائرة مركزها <span class="math">O</span> ونصف قطرها 4 cm</li></ol> </div></div></div></div>
<h4>📌 مثال 4: تطبيقي من الحياة اليومية</h4>
<div style="background: linear-gradient(135deg, #9C27B0 0%, #6A1B9A 100%); padding: 20px; border-radius: 15px; margin: 20px 0;"><div style="background-color: white; padding: 20px; border-radius: 10px;"><p style="font-size: 1.3em;"><strong style="color: #9C27B0;">الوضعية:</strong> يريد رسام رسم شعار دائري لشركة، قطره 12 cm. ساعده في الرسم.</p><p><strong style="color: #9C27B0;">🔍 التفكير:</strong> القطر = 12 cm، إذن نصف القطر = 6 cm</p> <ol><li>نحدد مركز الدائرة O</li><li>نفتح المدور 6 cm ونرسم الدائرة</li></ol> <p><strong style="color: #c2185b;">النتيجة:</strong> دائرة قطرها 12 cm</p></div></div>
6️⃣ أخطاء شائعة وتحليلها
<div style="background-color: #ffebee; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
<h4>⚠️ لماذا نقع في الخطأ؟ وكيف نتفاداه؟</h4>
<div style="overflow-x: auto;"> <table style="width:100%; border-collapse: collapse; text-align: center;"> <tr style="background-color: #c62828; color: white;"> <th style="padding: 15px;">الخطأ</th> <th style="padding: 15px;">مثاله</th> <th style="padding: 15px;">لماذا يحدث؟</th> <th style="padding: 15px;">كيف نتفاداه؟</th> </tr> <tr style="background-color: #ffcdd2;"> <td style="padding: 15px; font-weight: bold;">الخطأ 1</td> <td style="padding: 15px;">الخلط بين القطر ونصف القطر</td> <td style="padding: 15px;">عدم التمييز بين المصطلحات</td> <td style="padding: 15px;">نتذكر: القطر = 2 × نصف القطر</td> </tr> <tr style="background-color: #ef9a9a;"> <td style="padding: 15px; font-weight: bold;">الخطأ 2</td> <td style="padding: 15px;">الدائرة غير منتظمة</td> <td style="padding: 15px;">عدم تثبيت إبرة المدور جيداً</td> <td style="padding: 15px;">نثبت الإبرة جيداً في المركز</td> </tr> <tr style="background-color: #e57373;"> <td style="padding: 15px; font-weight: bold;">الخطأ 3</td> <td style="padding: 15px;">الاعتقاد أن كل نقطة داخل الدائرة تنتمي إليها</td> <td style="padding: 15px;">عدم فهم تعريف الدائرة</td> <td style="padding: 15px;">الدائرة = المحيط فقط</td> </tr> <tr style="background-color: #ef5350;"> <td style="padding: 15px; font-weight: bold;">الخطأ 4</td> <td style="padding: 15px;">نسيان كتابة المركز</td> <td style="padding: 15px;">عدم الدقة في الترميز</td> <td style="padding: 15px;">نكتب دائماً O مركز الدائرة</td> </tr> </table> </div><div style="background-color: #c8e6c9; padding: 20px; border-radius: 10px; margin-top: 20px;">
<h4>✅ كيف نتحقق من صحة الحل؟</h4>
<ul style="font-size: 1.1em;"> <li>✓ نقيس المسافة من المركز إلى أي نقطة على المحيط: يجب أن تساوي نصف القطر</li> <li>✓ نتحقق من أن جميع النقاط على المحيط تبعد نفس المسافة عن المركز</li> <li>✓ نتأكد من أن إبرة المدور كان ثابتاً أثناء الرسم</li> </ul></div></div>
8️⃣ فقرة "نفكر معًا"
<div style="background: linear-gradient(135deg, #FF6B6B 0%, #C2185B 100%); padding: 30px; border-radius: 15px; margin: 20px 0;"><div style="background-color: white; padding: 25px; border-radius: 10px; text-align: center;">
<h3>💭 سؤال مفتوح للتفكير</h3>
<p style="font-size: 1.5em; color: #c2185b; font-weight: bold;">هل يمكن رسم دائرة بدون مدور؟ كيف؟</p><div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-top: 20px;"> <p>🔰 نعم، باستخدام خيط ومسمار:</p> <p>نثبت المسمار (مركز) ونربط به خيطاً طوله r،</p> <p>ونربط قلماً في الطرف الآخر، ثم ندير القلم.</p> </div></div></div>
9️⃣ تقويم تكويني قصير
<div style="background: linear-gradient(135deg, #4ECDC4 0%, #2C3E50 100%); padding: 25px; border-radius: 15px; margin: 20px 0;"><div style="background-color: white; padding: 25px; border-radius: 10px;">
<h4>📝 5 أسئلة سريعة</h4>
<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;"><div style="background-color: #e3f2fd; padding: 15px; border-radius: 10px;"> <p><strong>1. ما هو مركز الدائرة؟</strong></p> <p style="background-color: #1976D2; color: white; padding: 10px; border-radius: 5px;">النقطة الثابتة O</p> </div><div style="background-color: #fff3e0; padding: 15px; border-radius: 10px;"> <p><strong>2. ما هو نصف القطر؟</strong></p> <p style="background-color: #FF9800; color: white; padding: 10px; border-radius: 5px;">المسافة من المركز إلى الدائرة</p> </div><div style="background-color: #e8f5e9; padding: 15px; border-radius: 10px;"> <p><strong>3. إذا كان القطر 10 cm، فما نصف القطر؟</strong></p> <p style="background-color: #4CAF50; color: white; padding: 10px; border-radius: 5px;">5 cm</p> </div><div style="background-color: #f3e5f5; padding: 15px; border-radius: 10px;"> <p><strong>4. أداة رسم الدائرة هي؟</strong></p> <p style="background-color: #9C27B0; color: white; padding: 10px; border-radius: 5px;">المدور</p> </div><div style="grid-column: span 2; background-color: #ffebee; padding: 15px; border-radius: 10px;"> <p><strong>5. ماذا يعني <span class="math">A \in (C)</span>؟</strong></p> <p style="background-color: #c2185b; color: white; padding: 10px; border-radius: 5px;">A تقع على الدائرة</p> </div></div></div></div>
✨ خلاصة الدرس
<div style="background: linear-gradient(135deg, #43C6AC 0%, #191654 100%); padding: 30px; border-radius: 15px; margin: 30px 0; text-align: center; color: white;">
<h3>📌 ملخص إنشاء الدائرة</h3>
<div style="display: flex; justify-content: space-around; margin: 30px 0; flex-wrap: wrap;"><div style="background-color: rgba(255,255,255,0.9); padding: 20px; border-radius: 15px; width: 30%; margin: 5px;"> <h4 style="color: #1976D2;">⭕ تعريف</h4> <p style="color:black;">مجموعة نقاط</p> <p style="color:black;">تبعد نفس المسافة</p> <p style="color:black;">عن المركز O</p> </div><div style="background-color: rgba(255,255,255,0.9); padding: 20px; border-radius: 15px; width: 30%; margin: 5px;"> <h4 style="color: #c2185b;">📏 عناصر</h4> <p style="color:black;">مركز O</p> <p style="color:black;">نصف قطر r</p> <p style="color:black;">قطر D = 2r</p> </div><div style="background-color: rgba(255,255,255,0.9); padding: 20px; border-radius: 15px; width: 30%; margin: 5px;"> <h4 style="color: #4CAF50;">🛠️ إنشاء</h4> <p style="color:black;">نثبت إبرة المدور</p> <p style="color:black;">في المركز O</p> <p style="color:black;">بفتحة = r</p> </div></div><p style="background-color: rgba(255,255,255,0.95); padding: 20px; border-radius: 50px; font-size: 1.3em; color: #333; margin-top: 20px;"> <strong>✨ جميع نقاط الدائرة على بعد r من المركز ✨</strong> </p></div>

</div>
  `;

  const lesson = await prisma.lesson.create({
    data: {
      title: 'إنشاء دائرة',
      content: lessonContent,
      authorId: teacher.id,
      subjectId: subject.id,
      levelId: level.id,
      type: 'private',
      status: 'approved',
      published: true,
      contentType: 'ArTICLE',
      lessonFileIds: '[]',
      exercises: {
        create: [
          {
            type: 'support_with_results',
            question: 'أكمل الفراغات:\n1) الدائرة هي مجموعة جميع النقاط التي تبعد نفس المسافة عن نقطة ثابتة تسمى ...\n2) المسافة من المركز إلى أي نقطة على الدائرة تسمى ...\n3) القطر يساوي ...\n4) لرسم دائرة نستعمل ...',
            expectedResults: JSON.stringify([
              { question: "1", result: "المركز" },
              { question: "2", result: "نصف القطر" },
              { question: "3", result: "2 × نصف القطر" },
              { question: "4", result: "المدور" }
            ]),
            displayOrder: 1, maxScore: 4, exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'support_with_results',
            question: 'أكمل الجدول:\n| نصف القطر (r) | القطر (D) |\n|---|---|\n| 3 cm | ؟ |\n| 5 cm | ؟ |\n| ؟ | 8 cm |\n| ؟ | 13 cm |',
            expectedResults: JSON.stringify([
              { question: "1", result: "6 cm" },
              { question: "2", result: "10 cm" },
              { question: "3", result: "4 cm" },
              { question: "4", result: "6,5 cm" }
            ]),
            displayOrder: 2, maxScore: 4, exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'support_with_results',
            question: 'اختر الإجابة الصحيحة:\n1) المسافة من المركز إلى الدائرة تسمى ...\n2) القطر هو ...\n3) أداة رسم الدائرة هي ...\n4) إذا كانت OA = 5 cm و r = 5 cm فإن A ...',
            expectedResults: JSON.stringify([
              { question: "1", result: "نصف القطر" },
              { question: "2", result: "2 × نصف القطر" },
              { question: "3", result: "المدور" },
              { question: "4", result: "على الدائرة" }
            ]),
            displayOrder: 3, maxScore: 4, exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'support_with_results',
            question: 'أنشئ دائرة مركزها O ونصف قطرها 4 cm.',
            expectedResults: JSON.stringify([{ question: "1", result: "دائرة (C) مركزها O و r = 4 cm" }]),
            displayOrder: 4, maxScore: 2, exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'support_with_results',
            question: 'دائرة مركزها O ونصف قطرها 4 cm. النقاط A, B, C حيث:\nOA = 3 cm، OB = 4 cm، OC = 5 cm',
            expectedResults: JSON.stringify([
              { question: "A", result: "داخل" },
              { question: "B", result: "على" },
              { question: "C", result: "خارج" }
            ]),
            displayOrder: 5, maxScore: 3, exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'support_with_results',
            question: 'أنشئ دائرة قطرها 10 cm.',
            expectedResults: JSON.stringify([{ question: "1", result: "نصف القطر = 5 cm" }]),
            displayOrder: 6, maxScore: 2, exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'support_with_results',
            question: 'دائرة مركزها O، نصف قطرها r. أكمل:\nA على الدائرة ⇒ A ... (C)\nB خارج الدائرة ⇒ B ... (C)\nC داخل الدائرة ⇒ OC ... r',
            expectedResults: JSON.stringify([
              { question: "1", result: "∈" },
              { question: "2", result: "∉" },
              { question: "3", result: "<" }
            ]),
            displayOrder: 7, maxScore: 3, exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'support_with_results',
            question: 'التمرين 08: ✍️ لاحظ الشكل ثم أكمل الفراغات:\n<div style="display: flex; justify-content: center; margin: 20px 0;"><svg width="200" height="120" viewBox="0 0 200 120"><circle cx="100" cy="60" r="50" fill="none" stroke="black" stroke-width="2"/><circle cx="100" cy="60" r="3" fill="red"/><text x="105" y="55" fill="red">O</text><line x1="50" y1="60" x2="150" y2="60" stroke="blue" stroke-width="2"/><text x="40" y="55">A</text><text x="155" y="55">B</text><line x1="100" y1="60" x2="135.4" y2="25" stroke="green" stroke-width="2"/><text x="140" y="20">E</text><line x1="65" y1="95.4" x2="135" y2="95.4" stroke="purple" stroke-width="2"/><text x="55" y="100">C</text><text x="140" y="100">D</text></svg></div>\n1) النقطة O هي ...\n2) القطعة [AB] هي ...\n3) القطعة [OE] هي ...\n4) القطعة [CD] هي ...',
            expectedResults: JSON.stringify([
              { question: "1", result: "المركز" },
              { question: "2", result: "قطر" },
              { question: "3", result: "نصف قطر" },
              { question: "4", result: "وتر" }
            ]),
            displayOrder: 8, maxScore: 4, exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'main',
            question: 'مشكلة: رسم شعار\nالوضعية: يريد تلميذ رسم شعار دائري لمدرسته. يريد دائرة قطرها 12 cm ونقطة A على محيطها تبعد 5 cm عن نقطة B داخل الدائرة.\nالمطلوب: أنشئ الدائرة ثم حدد موقع A و B.',
            modelAnswer: 'نصف القطر = 6 cm. A على المحيط، B داخل الدائرة.',
            displayOrder: 9, maxScore: 5, exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'main',
            question: 'مسألة: حديقة دائرية\nالوضعية: حديقة دائرية نصف قطرها 20 m. يراد وضع نافورة في مركزها O، ومقعد على بعد 15 m من المركز، ومقعد آخر على بعد 20 m من المركز.\nالمطلوب: أنشئ الحديقة بمقياس 1 cm = 5 m.',
            modelAnswer: 'دائرة نصف قطرها 4 cm. مقعد داخل (3 cm من O). مقعد على المحيط (4 cm من O).',
            displayOrder: 10, maxScore: 5, exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'main',
            question: 'التحدي الكبير - نقطة تقاطع\nالوضعية: دائرتان متحدتا المركز (نفس المركز O)، الأولى نصف قطرها 4 cm، والثانية نصف قطرها 6 cm.\nالمطلوب: ارسم الدائرتين. ما المسافة بين محيطيهما؟',
            modelAnswer: 'المسافة بين المحيطين هي الفرق بين نصفي القطرين: 6 cm - 4 cm = 2 cm.',
            displayOrder: 11, maxScore: 5, exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
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