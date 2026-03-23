import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🏗️  بدء إضافة درس "إنشاء المستطيل، المربع، المعين"...');

  const teacher = await prisma.user.findUnique({
    where: { email: 'ladj14013@gmail.com' },
    include: { userDetails: true },
  });

  if (!teacher) {
    console.error('❌ لم يتم العثور على المعلم ladj14013@gmail.com');
    return;
  }

  if (!teacher.userDetails?.subjectId) {
    console.error('❌ لم يتم تعيين مادة لهذا المعلم في ملفه الشخصي.');
    return;
  }

  const subject = await prisma.subject.findUnique({
    where: { id: teacher.userDetails.subjectId },
  });

  const level = await prisma.level.findFirst({
    where: { name: { contains: 'أولى متوسط' } },
  });

  if (!subject || !level) {
    console.error('❌ لم يتم العثور على المادة أو المستوى المطلوب.');
    return;
  }

  const lessonContent = `
<div dir="rtl">
1️⃣ وضعية انطلاق 
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
🏠 مشكلة: تصميم حديقة منزلية
<p>يريد المهندس المعماري كريم تصميم حديقة منزلية تحتوي على:</p>
<ul>
<li>منطقة عشب مستطيلة الشكل</li>
<li>نافورة مربعة الشكل</li>
<li>ممرات معينية الشكل للزينة</li>
</ul>
</div>
<div style="display: flex; justify-content: center; gap: 30px; margin: 30px 0; flex-wrap: wrap;">
<div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
    <svg width="120" height="100" viewBox="0 0 120 100">
        <rect x="20" y="20" width="80" height="50" fill="#c8e6c9" stroke="#2E7D32" stroke-width="3"/>
        <text x="80" y="60" fill="black">عشب</text>
    </svg> <p><strong>مستطيل</strong></p>
</div>
<div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
    <svg width="100" height="100" viewBox="0 0 100 100">
        <rect x="20" y="20" width="60" height="60" fill="#bbdefb" stroke="#1976D2" stroke-width="3"/>
        <circle cx="50" cy="50" r="10" fill="#03A9F4"/>
        <text x="60" y="95" fill="black">نافورة</text>
    </svg>
    <p><strong>مربع</strong></p>
 </div>
 <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
    <svg width="120" height="100" viewBox="0 0 120 100">
        <polygon points="60,20 100,50 60,80 20,50" fill="#ffe0b2" stroke="#E65100" stroke-width="3"/>
        <text x="60" y="55" fill="black">ممر</text>
    </svg>
    <p><strong>معين</strong></p>
</div>
</div>
<p>🔍 كيف يمكن للمهندس كريم إنشاء هذه الأشكال بدقة باستخدام المسطرة والمدور؟</p>

<p><strong>❓ التساؤلات:</strong></p>
<ul>
<li>كيف ننشئ مستطيلاً بمعلومية طوله وعرضه؟</li>
<li>كيف ننشئ مربعاً بمعلومية طول ضلعه؟</li>
<li>كيف ننشئ معيناً بمعلومية أقطاره أو أضلاعه؟</li>
</ul>

2️⃣ مرحلة البحث والاكتشاف
<div style="background-color: #fff9e6; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
<h3>🧪 نشاط استكشافي: هيا نكتشف إنشاء الرباعيات الخاصة!</h3>
<h4>📌 النشاط 1: إنشاء مستطيل</h4>
<p>لدينا طول L = 7 cm وعرض l = 4 cm. كيف ننشئ المستطيل ABCD؟</p>

<div style="display: flex; justify-content: center; margin: 20px 0;">
    <svg width="250" height="120" viewBox="0 0 250 120">
        <line x1="30" y1="50" x2="160" y2="50" stroke="blue" stroke-width="3"/>
        <line x1="30" y1="50" x2="30" y2="90" stroke="red" stroke-width="3"/>
        <circle cx="30" cy="50" r="5" fill="red"/>
        <text x="20" y="40" fill="red" font-weight="bold">A</text>
        <text x="170" y="40" fill="blue">نرسم AB = 7 cm</text>
        <text x="80" y="110" fill="red">نرسم AD = 4 cm عمودياً</text>
    </svg>
</div>
<p><strong>❓ أسئلة موجهة:</strong></p>
<ul>
<li>كيف ننشئ الزاوية القائمة في A？ <span style="background-color: #1976D2; color: white; padding: 3px 8px; border-radius: 15px;">نرسم مستقيمين متعامدين</span></li>
<li>أين نضع B؟ <span style="background-color: #FF9800; color: white; padding: 3px 8px; border-radius: 15px;">على الأفقي بـ 7 cm من A</span></li>
<li>أين نضع D؟ <span style="background-color: #4CAF50; color: white; padding: 3px 8px; border-radius: 15px;">على العمودي بـ 4 cm من A</span></li>
<li>كيف نكمل المستطيل؟ <span style="background-color: #c2185b; color: white; padding: 3px 8px; border-radius: 15px;">نرسم من B عمودياً 4 cm، ثم نصل</span></li>
</ul>

<h4>📌 النشاط 2: إنشاء مربع</h4>
<p>لدينا ضلع c = 5 cm. كيف ننشئ المربع PQRS؟</p>

<div style="display: flex; justify-content: center; margin: 20px 0;">
    <svg width="200" height="200" viewBox="0 0 200 120">
        <line x1="30" y1="50" x2="120" y2="50" stroke="blue" stroke-width="3"/>
        <line x1="30" y1="50" x2="30" y2="140" stroke="red" stroke-width="3"/>
        <text x="30" y="150" fill="red">S</text>
        <circle cx="30" cy="50" r="5" fill="red"/>
        <text x="20" y="50" fill="red">P</text>
        <text x="120" y="45" fill="blue">PQ = 5 cm</text>
        <text x="50" y="95" fill="red">PS = 5 cm</text>
    </svg>
</div>
<p><strong>❓ أسئلة موجهة:</strong></p>
<ul>
<li>ما الفرق بين المربع والمستطيل؟ <span style="background-color: #c2185b; color: white; padding: 3px 8px; border-radius: 15px;">الأضلاع كلها متساوية</span></li>
<li>كم طول PQ؟ <span style="background-color: #9C27B0; color: white; padding: 3px 8px; border-radius: 15px;">5 cm</span></li>
<li>كم طول PS؟ <span style="background-color: #4CAF50; color: white; padding: 3px 8px; border-radius: 15px;">5 cm أيضاً</span></li>
</ul>

<h4>📌 النشاط 3: إنشاء معين</h4>
<p>لدينا قطران متعامدان AC = 8 cm، BD = 6 cm. كيف ننشئ المعين ABCD؟</p>

<div style="display: flex; justify-content: center; margin: 20px 0;">
    <svg width="200" height="120" viewBox="0 0 200 120">
        <line x1="50" y1="60" x2="150" y2="60" stroke="black" stroke-width="2" stroke-dasharray="5"/>
        <text x="40" y="60" fill="black">A</text>
        <text x="160" y="60" fill="black">C</text>
        <line x1="100" y1="20" x2="100" y2="100" stroke="black" stroke-width="2" stroke-dasharray="5"/>
        <text x="90" y="20" fill="black">B</text>
        <text x="100" y="105" fill="black">D</text>
        
        <circle cx="100" cy="60" r="4" fill="red"/>
        <text x="115" y="55" fill="red">O</text>
        <text x="90" y="80" fill="blue">AC = 8 cm</text>
        <text x="190" y="10" fill="green">BD = 6 cm</text>
    </svg>
</div>
<p><strong>❓ أسئلة موجهة:</strong></p>
<ul>
<li>أين يلتقي القطران؟ <span style="background-color: #1976D2; color: white; padding: 3px 8px; border-radius: 15px;">في المنتصف O</span></li>
<li>ما طول OA و OC؟ <span style="background-color: #FF9800; color: white; padding: 3px 8px; border-radius: 15px;">4 cm لكل منهما</span></li>
<li>ما طول OB و OD؟ <span style="background-color: #4CAF50; color: white; padding: 3px 8px; border-radius: 15px;">3 cm لكل منهما</span></li>
</ul>
</div>

3️⃣ بناء المفهوم 
<div style="background: linear-gradient(135deg, #43C6AC 0%, #191654 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
<h3>📚 تعريفات وخصائص الرباعيات الخاصة</h3>
</div><div style="background-color: #e3f2fd; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);"><div style="border-right: 8px solid #1976D2; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
<h4>🔷 <span style="color: #1976D2;">المستطيل</span></h4>
<p>تعريف: المستطيل هو رباعي أضلاع له أربع زوايا قائمة وكل ضلعين متقابلين متوازيان ومتساويان.</p>

<div style="display: flex; align-items: center; gap: 30px;">
  <div> 
    <svg width="150" height="100" viewBox="0 0 150 100">
     <rect x="20" y="20" width="110" height="60" fill="none" stroke="#1976D2" stroke-width="3"/>
     <polyline points="20,30 30,30 30,20" fill="none" stroke="#1976D2" stroke-width="2"/>
     <line x1="70" y1="15" x2="70" y2="25" stroke="#1976D2" stroke-width="2"/>
     <line x1="75" y1="15" x2="75" y2="25" stroke="#1976D2" stroke-width="2"/>
     <line x1="70" y1="75" x2="70" y2="85" stroke="#1976D2" stroke-width="2"/>
     <line x1="75" y1="75" x2="75" y2="85" stroke="#1976D2" stroke-width="2"/>
     <line x1="15" y1="50" x2="25" y2="50" stroke="#1976D2" stroke-width="2"/>
     <line x1="125" y1="50" x2="135" y2="50" stroke="#1976D2" stroke-width="2"/>
    </svg>
  </div>
  <div> <p><strong>الخصائص:</strong></p> <p>✓ <span class="math">AB = CD</span> و <span class="math">AD = BC</span></p> <p>✓ <span class="math">(AB) // (CD)</span> و <span class="math">(AD) // (BC)</span></p> <p>✓ <span class="math">Â = B = Ĉ = D = 90°</span></p> </div> </div>
<p>خطوات الإنشاء (L = 7 cm, l = 4 cm):</p>
<ol>
<li>أرسم قطعة <span class="math">[AB]</span> طولها 7 cm (الطول)</li>
<li>أرسم مستقيمين عموديين على <span class="math">[AB]</span> في <span class="math">A</span> و <span class="math">B</span></li>
<li>على العمودي في <span class="math">A</span>، عين <span class="math">D</span> حيث <span class="math">AD = 4 cm</span></li>
<li>على العمودي في <span class="math">B</span>، عين <span class="math">C</span> حيث <span class="math">BC = 4 cm</span></li>
<li>أصل <span class="math">D</span> مع <span class="math">C</span></li>
</ol>
</div><div style="border-right: 8px solid #c2185b; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
<h4>🔷 <span style="color: #c2185b;">المربع</span></h4>
<p>تعريف: المربع هو مستطيل أضلاعه الأربعة متساوية.</p>

<div style="display: flex; align-items: center; gap: 30px;">
  <div>
    <svg width="120" height="120" viewBox="0 0 120 120">
      <rect x="20" y="20" width="80" height="80" fill="none" stroke="#c2185b" stroke-width="3"/>
      <polyline points="20 30 30 30 30 20" fill="none" stroke="#c2185b" stroke-width="2"/>
      <line x1="60" y1="15" x2="60" y2="25" stroke="#c2185b" stroke-width="2"/>
      <line x1="15" y1="60" x2="25" y2="60" stroke="#c2185b" stroke-width="2"/>
      <line x1="60" y1="95" x2="60" x2="65" y2="105" stroke="#c2185b" stroke-width="2"/>
      <line x1="95" y1="60" x2="105" y2="60" stroke="#c2185b" stroke-width="2"/>
    </svg>
  </div>
  <div> <p><strong>الخصائص:</strong></p> <p>✓ <span class="math">PQ = QR = RS = SP</span></p> <p>✓ جميع الزوايا قائمة</p> <p>✓ القطران متساويان ومتعامدان</p> </div> </div>
<p>خطوات الإنشاء (c = 5 cm):</p>
<ol>
<li>أرسم قطعة <span class="math">[PQ]</span> طولها 5 cm</li>
<li>أرسم مستقيمين عموديين على <span class="math">[PQ]</span> في <span class="math">P</span> و <span class="math">Q</span></li>
<li>على العمودي في <span class="math">P</span>، عين <span class="math">S</span> حيث <span class="math">PS = 5 cm</span></li>
<li>على العمودي في <span class="math">Q</span>، عين <span class="math">R</span> حيث <span class="math">QR = 5 cm</span></li>
<li>أصل <span class="math">S</span> مع <span class="math">R</span></li>
</ol>
</div><div style="border-right: 8px solid #4CAF50; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
<h4>🔷 <span style="color: #4CAF50;">المعين</span></h4>
<p>تعريف: المعين هو رباعي أضلاع له أربع أضلاع متساوية وقطراه متعامدان.</p>

<div style="display: flex; align-items: center; gap: 30px;">
<div>
  <svg width="150" height="120" viewBox="0 0 150 120">
    <polygon points="75,20 130,60 75,100 20,60" fill="none" stroke="#4CAF50" stroke-width="3"/>
    <line x1="75" y1="20" x2="75" y2="100" stroke="#4CAF50" stroke-dasharray="4" stroke-width="2"/>
    <line x1="20" y1="60" x2="130" y2="60" stroke="#4CAF50" stroke-dasharray="4" stroke-width="2"/>
    <polyline points="70 60 70 55 75 55" fill="none" stroke="#4CAF50" stroke-width="2"/>
    <line x1="100" y1="37" x2="104" y2="43" stroke="#4CAF50" stroke-width="2"/>
  </svg>
</div>
<div> <p><strong>الخصائص:</strong></p> <p>✓ <span class="math">EF = FG = GH = HE</span></p> <p>✓ <span class="math">(EG) ⊥ (FH)</span></p> <p>✓ الزوايا المتقابلة متساوية</p> </div> </div>
<p>خطوات الإنشاء (القطرين: <span class="math">EG = 8 cm</span>، <span class="math">FH = 6 cm</span>):</p>
<ol>
<li>أرسم القطر <span class="math">[EG]</span> طوله 8 cm، وعين <span class="math">O</span> منتصفه</li>
<li>أرسم محور <span class="math">[EG]</span> (مستقيم عمودي يمر بـ <span class="math">O</span>)</li>
<li>على المحور، عين <span class="math">F</span> و <span class="math">H</span> حيث <span class="math">OF = OH = 3 cm</span> (نصف القطر الثاني)</li>
<li>أصل النقاط <span class="math">E</span>، <span class="math">F</span>، <span class="math">G</span>، <span class="math">H</span> بالترتيب</li>
</ol>
</div></div>
  `;

  const lesson = await prisma.lesson.create({
    data: {
      title: 'إنشاء المستطيل، المربع، المعين',
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
            type: 'support_with_results',
            question: 'أكمل الفراغات:\n1) المستطيل له ... زوايا قائمة\n2) المربع له ... أضلاع متساوية\n3) المعين له قطران ...\n4) لإنشاء مستطيل نستعمل ...',
            expectedResults: JSON.stringify([
              { question: "1", result: "4" },
              { question: "2", result: "4" },
              { question: "3", result: "متعامدان" },
              { question: "4", result: "المدور والمسطرة" }
            ]),
            displayOrder: 1,
            maxScore: 4,
            exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'support_with_results',
            question: 'أكمل الجدول:\n| الشكل | عدد الأضلاع المتساوية | عدد الزوايا القائمة |\n|---|---|---|\n| مستطيل | ؟ | ؟ |\n| مربع | ؟ | ؟ |\n| معين | ؟ | ؟ |',
            expectedResults: JSON.stringify([
              { question: "مستطيل - أضلاع", result: "2 (متقابلة)" },
              { question: "مستطيل - زوايا", result: "4" },
              { question: "مربع - أضلاع", result: "4" },
              { question: "مربع - زوايا", result: "4" },
              { question: "معين - أضلاع", result: "4" },
              { question: "معين - زوايا", result: "0" }
            ]),
            displayOrder: 2,
            maxScore: 6,
            exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'support_with_results',
            question: 'اختر الإجابة الصحيحة:\n1) شكل أضلاعه 4، 4، 4، 4 وزواياه قائمة هو ...\n2) شكل أضلاعه 5، 5، 5، 5 وزواياه غير قائمة هو ...\n3) شكل طوله 8، عرضه 5 هو ...\n4) الشكل الذي قطراه متعامدان هو ...',
            expectedResults: JSON.stringify([
              { question: "1", result: "مربع" },
              { question: "2", result: "معين" },
              { question: "3", result: "مستطيل" },
              { question: "4", result: "المربع والمعين" }
            ]),
            displayOrder: 3,
            maxScore: 4,
            exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'support_with_results',
            question: 'أنشئ مستطيلاً طوله 8 cm وعرضه 5 cm. ما هو طول قطره (بالتقريب)؟',
            expectedResults: JSON.stringify([{ question: "1", result: "9.4 cm" }]),
            displayOrder: 4,
            maxScore: 2,
            exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'support_with_results',
            question: 'أنشئ مربعاً طول ضلعه 6 cm. ما هو طول قطره (بالتقريب)؟',
            expectedResults: JSON.stringify([{ question: "1", result: "8.5 cm" }]),
            displayOrder: 5,
            maxScore: 2,
            exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'support_with_results',
            question: 'أنشئ معيناً قطراه 10 cm و 6 cm. ما هو طول ضلعه (بالتقريب)؟',
            expectedResults: JSON.stringify([{ question: "1", result: "5.8 cm" }]),
            displayOrder: 6,
            maxScore: 2,
            exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'support_with_results',
            question: 'لدينا [AB] = 4 cm. نريد إنشاء مربع ABCD. ما طول [BC] و [AD]؟',
            expectedResults: JSON.stringify([
              { question: "BC", result: "4 cm" },
              { question: "AD", result: "4 cm" }
            ]),
            displayOrder: 7,
            maxScore: 2,
            exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'main',
            question: 'مشكلة: حديقة مستطيلة طولها 12 m وعرضها 8 m، فيها نافورة مربعة ضلعها 4 m. أنشئ الحديقة بمقياس 1 cm = 2 m. ما هي أبعاد الأشكال على الرسم؟',
            modelAnswer: 'المستطيل على الرسم: طوله 6 cm وعرضه 4 cm. المربع على الرسم: ضلعه 2 cm.',
            displayOrder: 8,
            maxScore: 5,
            exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'main',
            question: 'مسألة: قطعة أرض على شكل معين، قطراه 20 m و 12 m. أنشئ القطعة بمقياس 1 cm = 4 m. ما هي أطوال القطرين على الرسم؟',
            modelAnswer: 'طول القطر الأول على الرسم: 5 cm. طول القطر الثاني على الرسم: 3 cm.',
            displayOrder: 9,
            maxScore: 5,
            exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
          },
          {
            type: 'main',
            question: 'التحدي الكبير: أنشئ مربعاً ضلعه 5 cm، ثم أنشئ معيناً داخل المربع بحيث تكون رؤوسه في منتصفات أضلاع المربع. ما نوع المعين الناتج؟',
            modelAnswer: 'المعين الناتج هو مربع أيضاً لأن أقطاره متساوية (تساوي ضلع المربع الأصلي) ومتعامدة.',
            displayOrder: 10,
            maxScore: 5,
            exerciseFileIds: '[]', questionFileIds: '[]', modelAnswerFileIds: '[]'
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