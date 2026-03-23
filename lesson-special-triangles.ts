import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🏗️  بدء إضافة درس "إنشاء المثلثات الخاصة"...');

  const teacher = await prisma.user.findUnique({
    where: { email: 'ladj14013@gmail.com' },
    include: { userDetails: true },
  });

  if (!teacher) {
    console.error('❌ لم يتم العثور على المعلم ladj14013@gmail.com');
    return;
  }

  const subject = await prisma.subject.findFirst({
    where: { name: 'الرياضيات', stageId: 2 }, // Assuming stageId 2 is "المرحلة المتوسطة"
  });

  const level = await prisma.level.findFirst({
    where: { name: { contains: 'أولى متوسط' } },
  });

  if (!subject || !level) {
    console.error('❌ لم يتم العثور على المادة أو المستوى المطلوب.');
    return;
  }

  const lessonContent = `
<div dir="rtl" align="center"> <img src="https://img.icons8.com/color/96/000000/triangle.png"/> </div>

### 1️⃣ وضعية انطلاق
<img src="https://img.icons8.com/color/48/000000/construction-worker.png"/> **مشكلة واقعية:**

يريد خالد أن يصنع لوحة إعلانية على شكل مثلث لدكان عمه. لديه ثلاث أعمدة خشبية بأطوال مختلفة. لاحظ أن بعض المثلثات يمكن رسمها بسهولة، بينما أخرى لا تنجح. ساعده في معرفة كيف يمكنه رسم مثلث متساوي الساقين وآخر قائم الزاوية باستعمال أطوال محددة.

### 2️⃣ مرحلة البحث والاكتشاف
**✏️ نشاط 1: اكتشاف المثلث متساوي الساقين**
<img src="https://img.icons8.com/color/48/000000/ruler.png"/>
1.  ارسم قطعة مستقيم <span class="math">[AB]</span> طولها <span class="math">5 cm</span>.
2.  افتح المدور (البركار) بفتحة <span class="math">4 cm</span> وضع رأسه في A وارسم قوساً.
3.  بنفس الفتحة <span class="math">4 cm</span> ضع رأسه في B وارسم قوساً يقطع الأول في C.
4.  ماذا تلاحظ على طولي <span class="math">AC</span> و <span class="math">BC</span>؟

**✏️ نشاط 2: اكتشاف المثلث القائم**
1.  ارسم قطعة مستقيم <span class="math">[AB]</span> طولها <span class="math">6 cm</span>.
2.  ارسم مستقيم <span class="math">(d)</span> عمودي على <span class="math">(AB)</span> في النقطة A.
3.  عين نقطة C على المستقيم <span class="math">(d)</span> حيث <span class="math">AC = 4 cm</span>.
4.  صل C مع B. ماذا تلاحظ على الزاوية <span class="math">\\widehat{CAB}</span>؟

### 3️⃣ بناء المفهوم
<div style="background-color: #e8f4f8; padding: 20px; border-radius: 15px;">
  <h4>🔴 المثلث متساوي الساقين</h4>
  <p><span class="math">ABC</span> مثلث متساوي الساقين إذا كان له ضلعان متساويان في الطول.</p>
  <ul>
    <li>الرأس <span class="math">A</span> يسمى رأس المثلث.</li>
    <li>القاعدة هي <span class="math">[BC]</span>.</li>
    <li>الضلعان <span class="math">[AB]</span> و <span class="math">[AC]</span> هما الساقان.</li>
  </ul>
  <h4>🔵 المثلث القائم الزاوية</h4>
  <p><span class="math">ABC</span> مثلث قائم الزاوية إذا كانت إحدى زواياه قائمة <span class="math">(90^\\circ)</span>.</p>
  <ul>
    <li>الضلع المقابل للزاوية القائمة يسمى الوتر.</li>
    <li>الزاوية القائمة تكتب: <span class="math">\\widehat{BAC} = 90^\\circ</span></li>
  </ul>
</div>

### 4️⃣ تمثيل متعدد للمفهوم
**📊 تمثيل عددي**
<table class="table-auto w-full text-center">
  <thead>
    <tr><th class="px-4 py-2">نوع المثلث</th><th class="px-4 py-2">أطوال الأضلاع</th></tr>
  </thead>
  <tbody>
    <tr><td class="border px-4 py-2">متساوي الساقين</td><td class="border px-4 py-2"><span class="math">AB = AC = 4 cm</span>، <span class="math">BC = 3 cm</span></td></tr>
    <tr><td class="border px-4 py-2">قائم الزاوية</td><td class="border px-4 py-2"><span class="math">AB = 3 cm</span>، <span class="math">AC = 4 cm</span>، <span class="math">BC = 5 cm</span></td></tr>
  </tbody>
</table>

**🗣️ تمثيل لفظي**
<ul>
  <li>متساوي الساقين: "مثلث فيه ضلعان لهما نفس الطول"</li>
  <li>قائم الزاوية: "مثلث فيه زاوية قائمة كزاوية المربع"</li>
</ul>

**📐 تمثيل هندسي**
<div align="center" style="background-color: white; padding: 20px; display: flex; justify-content: space-around;">
  <pre>
    مثلث متساوي الساقين
          A
         /\\
        /  \\
       /    \\
      /______\\
     B        C
  </pre>
  <pre>
    مثلث قائم الزاوية
    A
    |\\
    | \\
    |  \\
    |___\\
    B   C
  </pre>
</div>

### 5️⃣ أمثلة محلولة تدريجياً
<div style="background-color: #fff9e6; padding: 20px; border-radius: 10px; margin-bottom: 1rem;">
  <h4>📘 مثال 1: إنشاء مثلث متساوي الساقين</h4>
  <p><strong>المعطيات:</strong> أنشئ مثلث <span class="math">ABC</span> متساوي الساقين في A حيث: <span class="math">AB = AC = 5 cm</span> و <span class="math">BC = 3 cm</span></p>
  <p><strong>الشرح خطوة بخطوة:</strong></p>
  <ol>
    <li><img src="https://img.icons8.com/color/24/000000/1-c.png"/> أرسم قطعة <span class="math">[BC]</span> طولها <span class="math">3 cm</span> باللون <span style="color:blue">الأزرق</span>.</li>
    <li><img src="https://img.icons8.com/color/24/000000/2-c.png"/> بفتحة المدور <span class="math">5 cm</span>، أرسم قوساً مركزه B باللون <span style="color:red">الأحمر</span>.</li>
    <li><img src="https://img.icons8.com/color/24/000000/3-c.png"/> بنفس الفتحة، أرسم قوساً مركزه C يقطع الأول في نقطة A باللون <span style="color:green">الأخضر</span>.</li>
    <li><img src="https://img.icons8.com/color/24/000000/4-c.png"/> صل A مع B ومع C تحصل على المثلث المطلوب.</li>
  </ol>
</div>

<div style="background-color: #e6f3ff; padding: 20px; border-radius: 10px; margin-bottom: 1rem;">
  <h4>📗 مثال 2: إنشاء مثلث قائم الزاوية</h4>
  <p><strong>المعطيات:</strong> أنشئ مثلث <span class="math">EFG</span> قائم الزاوية في E حيث: <span class="math">EF = 4 cm</span> و <span class="math">EG = 3 cm</span></p>
  <p><strong>الشرح خطوة بخطوة:</strong></p>
  <ol>
    <li><img src="https://img.icons8.com/color/24/000000/1-c.png"/> أرسم قطعة <span class="math">[EF]</span> طولها <span class="math">4 cm</span> باللون <span style="color:blue">الأزرق</span>.</li>
    <li><img src="https://img.icons8.com/color/24/000000/2-c.png"/> أرسم مستقيم <span class="math">(d)</span> عمودي على <span class="math">(EF)</span> في النقطة E.</li>
    <li><img src="https://img.icons8.com/color/24/000000/3-c.png"/> على المستقيم <span class="math">(d)</span>، عين النقطة G حيث <span class="math">EG = 3 cm</span> باللون <span style="color:red">الأحمر</span>.</li>
    <li><img src="https://img.icons8.com/color/24/000000/4-c.png"/> صل G مع F تحصل على المثلث القائم.</li>
  </ol>
</div>

### 6️⃣ أخطاء شائعة وتحليلها
<div style="background-color: #ffebee; padding: 20px; border-radius: 15px;">
  <p><strong>❌ الخطأ 1: عدم تقاطع القوسين</strong><br/>السبب: فتحة المدور أقل من نصف طول القاعدة.<br/>الحل: تأكد أن <span class="math">AB + AC > BC</span></p>
  <p><strong>❌ الخطأ 2: الزاوية ليست قائمة</strong><br/>السبب: عدم استعمال المثلث القائم أو المنقلة بدقة.<br/>الحل: استعمل المثلث القائم للتحقق.</p>
</div>

### 7️⃣ تمارين الدرس
<p><strong>🔰 مستوى أساسي (دعم + نتائج)</strong></p>
<ol>
  <li>أنشئ مثلث <span class="math">ABC</span> متساوي الساقين في A حيث: <span class="math">AB = AC = 5 cm</span> و <span class="math">BC = 4 cm</span></li>
  <li>أنشئ مثلث <span class="math">DEF</span> قائم الزاوية في D حيث: <span class="math">DE = 4 cm</span> و <span class="math">DF = 3 cm</span></li>
  <li>أنشئ مثلث <span class="math">GHI</span> متساوي الساقين في G حيث: <span class="math">GH = GI = 4.5 cm</span> و <span class="math">HI = 3 cm</span></li>
  <li>أنشئ مثلث <span class="math">JKL</span> قائم الزاوية في J حيث: <span class="math">JK = 5 cm</span> و <span class="math">JL = 12 cm</span></li>
  <li>أنشئ مثلث <span class="math">MNO</span> متساوي الساقين في M حيث محيطه <span class="math">16 cm</span> وقاعدته <span class="math">6 cm</span></li>
</ol>
<p><strong>⭐ مستوى متوسط (رئيسي)</strong></p>
<ol start="6">
  <li>أنشئ مثلث <span class="math">VWX</span> قائم الزاوية في W حيث: <span class="math">VW = 4.2 cm</span> و <span class="math">WX = 5.6 cm</span>. احسب طول <span class="math">VX</span> باستعمال المسطرة.</li>
  <li>أنشئ مثلث <span class="math">YZA</span> متساوي الساقين في Y حيث: <span class="math">YZ = YA = 5 cm</span> و <span class="math">ZA = 6 cm</span>. أنشئ منتصف القاعدة <span class="math">[ZA]</span> وسمه M. قس الزاوية <span class="math">\\widehat{YMA}</span>.</li>
</ol>
<p><strong>💎 مستوى إدماجي (رئيسي)</strong></p>
<ol start="8">
  <li>حديقة مثلثة الشكل <span class="math">ABC</span> قائمة الزاوية في B. طول <span class="math">AB = 30 m</span> و <span class="math">BC = 40 m</span>. ارسم الحديقة بمقياس <span class="math">1 cm \\rightarrow 10 m</span>. احسب طول السياج اللازم لإحاطتها.</li>
</ol>

### 8️⃣ نفكر معًا
<div style="background-color: #f1c40f; color: #2c3e50; padding: 25px; border-radius: 20px; font-size: 1.3em;">
  <p><strong>❓ سؤال مفتوح:</strong> هل يمكن رسم مثلث قائم الزاوية ومتساوي الساقين في نفس الوقت؟ كيف؟ جرب أن ترسم واحداً بأبعاد من اختيارك.</p>
</div>

### 9️⃣ تقويم تكويني قصير
<div style="background-color: #ecf0f1; padding: 25px; border-radius: 20px;">
  <p><strong>📝 أجب بصحيح أو خطأ مع التصحيح:</strong></p>
  <ul>
    <li>في المثلث متساوي الساقين، جميع الأضلاع متساوية. (<span style="color:red">خطأ</span>)</li>
    <li>الزاوية القائمة تساوي <span class="math">90^\\circ</span>. (<span style="color:green">صحيح</span>)</li>
    <li>الوتر هو الضلع المقابل للزاوية القائمة. (<span style="color:green">صحيح</span>)</li>
  </ul>
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