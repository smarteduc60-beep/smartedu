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


  // 3. Lesson Content
  const lessonTitle = 'قواعد قابلية القسمة على 2 و 3 و 4 و 5 و 9';
  const lessonContent = `
<div dir="rtl">
  🔍 <strong>تمهيد: ماذا نعني بقابلية القسمة؟</strong>
  <div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0; text-align: center;">
    قابلية القسمة هي إمكانية قسمة عدد على عدد آخر دون باق (باقي القسمة يساوي صفر).
    <div style="display: flex; justify-content: center; gap: 30px; margin: 30px 0;">
      <div style="background-color: white; padding: 15px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <p style="font-size: 1.5em;">24 ÷ 4 = 6</p>
        <p style="color: #4CAF50;">✓ قابل للقسمة</p>
        <p>(الباقي = 0)</p>
      </div>
      <div style="background-color: white; padding: 15px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <p style="font-size: 1.5em;">25 ÷ 4 = 6</p>
        <p style="color: #c2185b;">✗ غير قابل للقسمة</p>
        <p>(الباقي = 1)</p>
      </div>
    </div>
  </div>

  📐 <strong>أولاً: قابلية القسمة على 2</strong>
  <div style="background-color: #e3f2fd; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <div style="display: flex; align-items: center; gap: 30px;">
      <div style="font-size: 4em; color: #1976D2;">2</div>
      <div>
        <p style="font-size: 1.3em;"><strong>العدد يقبل القسمة على 2 إذا كان رقم آحاده زوجياً</strong></p>
        <p>(0، 2، 4، 6، 8)</p>
      </div>
    </div>
  </div>
  
  ✅ <strong>أمثلة محلولة</strong>
  <div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <table style="width: 100%; text-align: center;" border="1" cellpadding="10">
      <tr><th>العدد</th><th>رقم الآحاد</th><th>هل يقبل القسمة على 2؟</th><th>التعليل</th></tr>
      <tr><td>48</td><td>8</td><td>✓ نعم</td><td>8 عدد زوجي</td></tr>
      <tr><td>75</td><td>5</td><td>✗ لا</td><td>5 عدد فردي</td></tr>
      <tr><td>120</td><td>0</td><td>✓ نعم</td><td>0 عدد زوجي</td></tr>
      <tr><td>333</td><td>3</td><td>✗ لا</td><td>3 عدد فردي</td></tr>
      <tr><td>1024</td><td>4</td><td>✓ نعم</td><td>4 عدد زوجي</td></tr>
    </table>
  </div>

  📐 <strong>ثانياً: قابلية القسمة على 3</strong>
  <div style="background-color: #fff3e0; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <div style="display: flex; align-items: center; gap: 30px;">
      <div style="font-size: 4em; color: #FF9800;">3</div>
      <div>
        <p style="font-size: 1.3em;"><strong>العدد يقبل القسمة على 3 إذا كان مجموع أرقامه يقبل القسمة على 3</strong></p>
      </div>
    </div>
  </div>

  ✅ <strong>أمثلة محلولة</strong>
  <div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <table style="width: 100%; text-align: center;" border="1" cellpadding="10">
      <tr><th>العدد</th><th>مجموع الأرقام</th><th>هل يقبل القسمة على 3؟</th><th>التعليل</th></tr>
      <tr><td>123</td><td>1+2+3 = 6</td><td>✓ نعم</td><td>6 يقبل القسمة على 3</td></tr>
      <tr><td>245</td><td>2+4+5 = 11</td><td>✗ لا</td><td>11 لا يقبل القسمة على 3</td></tr>
      <tr><td>351</td><td>3+5+1 = 9</td><td>✓ نعم</td><td>9 يقبل القسمة على 3</td></tr>
      <tr><td>472</td><td>4+7+2 = 13</td><td>✗ لا</td><td>13 لا يقبل القسمة على 3</td></tr>
      <tr><td>1002</td><td>1+0+0+2 = 3</td><td>✓ نعم</td><td>3 يقبل القسمة على 3</td></tr>
    </table>
  </div>

  📐 <strong>ثالثاً: قابلية القسمة على 4</strong>
  <div style="background-color: #e8f5e9; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <div style="display: flex; align-items: center; gap: 30px;">
      <div style="font-size: 4em; color: #4CAF50;">4</div>
      <div>
        <p style="font-size: 1.3em;"><strong>العدد يقبل القسمة على 4 إذا كان العدد المكون من رقميه الأخيرين (آحاد وعشرات) يقبل القسمة على 4</strong></p>
      </div>
    </div>
  </div>

  ✅ <strong>أمثلة محلولة</strong>
  <div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <table style="width: 100%; text-align: center;" border="1" cellpadding="10">
      <tr><th>العدد</th><th>آخر رقمين</th><th>هل يقبل القسمة على 4؟</th><th>التعليل</th></tr>
      <tr><td>124</td><td>24</td><td>✓ نعم</td><td>24 ÷ 4 = 6</td></tr>
      <tr><td>235</td><td>35</td><td>✗ لا</td><td>35 لا يقبل القسمة على 4</td></tr>
      <tr><td>348</td><td>48</td><td>✓ نعم</td><td>48 ÷ 4 = 12</td></tr>
      <tr><td>500</td><td>00</td><td>✓ نعم</td><td>00 ÷ 4 = 0</td></tr>
      <tr><td>1018</td><td>18</td><td>✗ لا</td><td>18 لا يقبل القسمة على 4</td></tr>
    </table>
  </div>

  📐 <strong>رابعاً: قابلية القسمة على 5</strong>
  <div style="background-color: #f3e5f5; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <div style="display: flex; align-items: center; gap: 30px;">
      <div style="font-size: 4em; color: #9C27B0;">5</div>
      <div>
        <p style="font-size: 1.3em;"><strong>العدد يقبل القسمة على 5 إذا كان رقم آحاده 0 أو 5</strong></p>
      </div>
    </div>
  </div>

  ✅ <strong>أمثلة محلولة</strong>
  <div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <table style="width: 100%; text-align: center;" border="1" cellpadding="10">
      <tr><th>العدد</th><th>رقم الآحاد</th><th>هل يقبل القسمة على 5؟</th><th>التعليل</th></tr>
      <tr><td>75</td><td>5</td><td>✓ نعم</td><td>الآحاد 5</td></tr>
      <tr><td>120</td><td>0</td><td>✓ نعم</td><td>الآحاد 0</td></tr>
      <tr><td>233</td><td>3</td><td>✗ لا</td><td>الآحاد 3</td></tr>
      <tr><td>1000</td><td>0</td><td>✓ نعم</td><td>الآحاد 0</td></tr>
      <tr><td>555</td><td>5</td><td>✓ نعم</td><td>الآحاد 5</td></tr>
    </table>
  </div>

  📐 <strong>خامساً: قابلية القسمة على 9</strong>
  <div style="background-color: #ffebee; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <div style="display: flex; align-items: center; gap: 30px;">
      <div style="font-size: 4em; color: #c2185b;">9</div>
      <div>
        <p style="font-size: 1.3em;"><strong>العدد يقبل القسمة على 9 إذا كان مجموع أرقامه يقبل القسمة على 9</strong></p>
      </div>
    </div>
  </div>

  ✅ <strong>أمثلة محلولة</strong>
  <div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <table style="width: 100%; text-align: center;" border="1" cellpadding="10">
      <tr><th>العدد</th><th>مجموع الأرقام</th><th>هل يقبل القسمة على 9؟</th><th>التعليل</th></tr>
      <tr><td>81</td><td>8+1 = 9</td><td>✓ نعم</td><td>9 يقبل القسمة على 9</td></tr>
      <tr><td>126</td><td>1+2+6 = 9</td><td>✓ نعم</td><td>9 يقبل القسمة على 9</td></tr>
      <tr><td>235</td><td>2+3+5 = 10</td><td>✗ لا</td><td>10 لا يقبل القسمة على 9</td></tr>
      <tr><td>333</td><td>3+3+3 = 9</td><td>✓ نعم</td><td>9 يقبل القسمة على 9</td></tr>
      <tr><td>1008</td><td>1+0+0+8 = 9</td><td>✓ نعم</td><td>9 يقبل القسمة على 9</td></tr>
    </table>
  </div>

  📊 <strong>جدول ملخص قواعد قابلية القسمة</strong>
  <div style="background-color: #fff3cd; padding: 20px; border-radius: 15px; margin: 30px 0;">
    <table style="width: 100%; text-align: center;" border="1" cellpadding="10">
      <tr><th>القسمة على</th><th>القاعدة</th><th>مثال</th></tr>
      <tr><td>2</td><td>رقم الآحاد زوجي (0، 2، 4، 6، 8)</td><td>48 ✓، 75 ✗</td></tr>
      <tr><td>3</td><td>مجموع الأرقام يقبل القسمة على 3</td><td>123 ✓، 245 ✗</td></tr>
      <tr><td>4</td><td>آخر رقمين يقبلان القسمة على 4</td><td>124 ✓، 235 ✗</td></tr>
      <tr><td>5</td><td>رقم الآحاد 0 أو 5</td><td>75 ✓، 233 ✗</td></tr>
      <tr><td>9</td><td>مجموع الأرقام يقبل القسمة على 9</td><td>81 ✓، 235 ✗</td></tr>
    </table>
  </div>
</div>
`;

  const lesson = await prisma.lesson.upsert({
    where: {
      title_authorId: {
        title: lessonTitle,
        authorId: teacher.id,
      },
    },
    update: {
      content: lessonContent,
      published: true,
      status: 'approved',
    },
    create: {
      title: lessonTitle,
      content: lessonContent,
      subjectId: subject.id,
      levelId: level.id,
      authorId: teacher.id,
      type: 'public',
      status: 'approved',
      published: true,
    },
  });

  // Delete old exercises to avoid duplicates
  await prisma.exercise.deleteMany({ where: { lessonId: lesson.id } });

  console.log(`✅ Lesson processed: ${lesson.title} (ID: ${lesson.id})`);

  // Create Exercises
  const exercisesData = [
    {
      type: 'support_with_results',
      question: 'أكمل الفراغات',
      questionRichContent: `<div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0;"><p>العدد يقبل القسمة على 2 إذا كان رقم آحاده ...... أو ...... أو ...... أو ...... أو ......</p><p>العدد يقبل القسمة على 3 إذا كان ...... أرقامه يقبل القسمة على 3</p><p>العدد يقبل القسمة على 4 إذا كان العدد المكون من ...... الرقمين الأخيرين يقبل القسمة على 4</p><p>العدد يقبل القسمة على 5 إذا كان رقم آحاده ...... أو ......</p><p>العدد يقبل القسمة على 9 إذا كان ...... أرقامه يقبل القسمة على 9</p></div>`,
      expectedResults: [{ question: 'آحاد 2 (1)', result: '0' }, { question: 'آحاد 2 (2)', result: '2' }, { question: 'آحاد 2 (3)', result: '4' }, { question: 'آحاد 2 (4)', result: '6' }, { question: 'آحاد 2 (5)', result: '8' }, { question: 'شرط 3', result: 'مجموع' }, { question: 'شرط 4', result: 'آخر' }, { question: 'آحاد 5 (1)', result: '0' }, { question: 'آحاد 5 (2)', result: '5' }, { question: 'شرط 9', result: 'مجموع' }],
      displayOrder: 1
    },
    {
      type: 'support_with_results',
      question: 'حدد الأعداد القابلة للقسمة على 2',
      questionRichContent: `<div style="background-color: #fff3e0; padding: 20px; border-radius: 15px; margin: 20px 0;"><p>حدد الأعداد القابلة للقسمة على 2 من القوائم التالية:</p><ul><li>24، 35، 48، 51، 60</li><li>72، 85، 90، 103، 114</li><li>126، 137، 148، 159، 160</li><li>200، 215، 222، 237، 248</li></ul></div>`,
      expectedResults: [{ question: 'القائمة 1', result: '24، 48، 60' }, { question: 'القائمة 2', result: '72، 90، 114' }, { question: 'القائمة 3', result: '126، 148، 160' }, { question: 'القائمة 4', result: '200، 222، 248' }],
      displayOrder: 2
    },
    {
      type: 'support_with_results',
      question: 'حدد الأعداد القابلة للقسمة على 3',
      questionRichContent: `<div style="background-color: #e8f5e9; padding: 20px; border-radius: 15px; margin: 20px 0;"><p>حدد الأعداد القابلة للقسمة على 3 من القوائم التالية:</p><ul><li>15، 22، 33، 41، 54</li><li>63، 74، 81، 92، 105</li><li>111، 124، 132، 145، 153</li><li>201، 214، 222، 235، 243</li></ul></div>`,
      expectedResults: [{ question: 'القائمة 1', result: '15، 33، 54' }, { question: 'القائمة 2', result: '63، 81، 105' }, { question: 'القائمة 3', result: '111، 132، 153' }, { question: 'القائمة 4', result: '201، 222، 243' }],
      displayOrder: 3
    },
    {
      type: 'support_with_results',
      question: 'حدد الأعداد القابلة للقسمة على 4',
      questionRichContent: `<div style="background-color: #e3f2fd; padding: 20px; border-radius: 15px; margin: 20px 0;"><p>حدد الأعداد القابلة للقسمة على 4 من القوائم التالية:</p><ul><li>24، 35، 44، 51، 68</li><li>72، 85، 96، 107، 112</li><li>124، 135، 144، 157، 168</li><li>200، 215، 224، 237، 248</li></ul></div>`,
      expectedResults: [{ question: 'القائمة 1', result: '24، 44، 68' }, { question: 'القائمة 2', result: '72، 96، 112' }, { question: 'القائمة 3', result: '124، 144، 168' }, { question: 'القائمة 4', result: '200، 224، 248' }],
      displayOrder: 4
    },
    {
      type: 'support_with_results',
      question: 'حدد الأعداد القابلة للقسمة على 5',
      questionRichContent: `<div style="background-color: #f9e6ff; padding: 20px; border-radius: 15px; margin: 20px 0;"><p>حدد الأعداد القابلة للقسمة على 5 من القوائم التالية:</p><ul><li>15، 22، 35، 41، 50</li><li>65، 74، 85، 92، 100</li><li>105، 114، 125، 136، 145</li><li>200، 215، 222، 235، 247</li></ul></div>`,
      expectedResults: [{ question: 'القائمة 1', result: '15، 35، 50' }, { question: 'القائمة 2', result: '65، 85، 100' }, { question: 'القائمة 3', result: '105، 125، 145' }, { question: 'القائمة 4', result: '200، 215، 235' }],
      displayOrder: 5
    },
    {
      type: 'support_with_results',
      question: 'حدد الأعداد القابلة للقسمة على 9',
      questionRichContent: `<div style="background-color: #fff9c4; padding: 20px; border-radius: 15px; margin: 20px 0;"><p>حدد الأعداد القابلة للقسمة على 9 من القوائم التالية:</p><ul><li>18، 27، 35، 45، 52</li><li>63، 74، 81، 92، 108</li><li>117، 126، 135، 144، 153</li><li>162، 171، 180، 195، 207</li></ul></div>`,
      expectedResults: [{ question: 'القائمة 1', result: '18، 27، 45' }, { question: 'القائمة 2', result: '63، 81، 108' }, { question: 'القائمة 3', result: '117، 126، 135، 144، 153' }, { question: 'القائمة 4', result: '162، 171، 180، 207' }],
      displayOrder: 6
    },
    {
      type: 'support_with_results',
      question: 'اختر الإجابة الصحيحة',
      questionRichContent: `<div style="background-color: #ffebee; padding: 20px; border-radius: 15px; margin: 20px 0;"><table style="width:100%; text-align:center;"><tr><th>العدد</th><th>يقبل القسمة على</th></tr><tr><td>48</td><td>2 / 3 / 4 / 5 / 9</td></tr><tr><td>75</td><td>2 / 3 / 5 / 4 / 9</td></tr><tr><td>120</td><td>2 / 3 / 4 / 5 / 9</td></tr><tr><td>81</td><td>2 / 3 / 4 / 5 / 9</td></tr><tr><td>124</td><td>2 / 3 / 4 / 5 / 9</td></tr></table></div>`,
      expectedResults: [{ question: '48', result: '2، 3، 4' }, { question: '75', result: '3، 5' }, { question: '120', result: '2، 3، 4، 5' }, { question: '81', result: '3، 9' }, { question: '124', result: '2، 4' }],
      displayOrder: 7
    },
    {
      type: 'main',
      question: 'مسألة: توزيع الكتب',
      questionRichContent: `<div style="background-color: #ffebee; padding: 20px; border-radius: 15px; margin: 20px 0;"><div style="background-color: #fff0f0; padding: 15px; border-radius: 10px; margin-bottom: 15px;"> **الوضعية:** لدى مكتبة 150 كتاباً تريد توزيعها على مجموعة من الطلاب. </div><p>المطلوب:</p><ol><li>هل يمكن توزيع الكتب على 2 طلاب بالتساوي؟ لماذا؟</li><li>هل يمكن توزيع الكتب على 3 طلاب بالتساوي؟ لماذا؟</li><li>هل يمكن توزيع الكتب على 4 طلاب بالتساوي؟ لماذا؟</li><li>هل يمكن توزيع الكتب على 5 طلاب بالتساوي؟ لماذا؟</li><li>هل يمكن توزيع الكتب على 9 طلاب بالتساوي؟ لماذا؟</li></ol></div>`,
      modelAnswer: `<p><strong>على 2:</strong> نعم، لأن 150 رقم آحاده 0 (زوجي)</p><p><strong>على 3:</strong> نعم، لأن 1+5+0 = 6 يقبل القسمة على 3</p><p><strong>على 4:</strong> لا، لأن آخر رقمين 50 لا يقبل القسمة على 4</p><p><strong>على 5:</strong> نعم، لأن رقم الآحاد 0</p><p><strong>على 9:</strong> لا، لأن 1+5+0 = 6 لا يقبل القسمة على 9</p>`,
      displayOrder: 8
    },
    {
      type: 'main',
      question: 'مسألة: أعداد سرية',
      questionRichContent: `<div style="background-color: #e0f7fa; padding: 20px; border-radius: 15px; margin: 20px 0;"><div style="background-color: #e0f0ff; padding: 15px; border-radius: 10px; margin-bottom: 15px;"> **الوضعية:** أوجد الأعداد المناسبة في كل حالة: </div><ol><li>عدد بين 20 و 30 يقبل القسمة على 2 و 3 معاً</li><li>عدد بين 40 و 50 يقبل القسمة على 5 و 9 معاً</li><li>عدد بين 100 و 110 يقبل القسمة على 4 و 5 معاً</li><li>عدد بين 70 و 80 يقبل القسمة على 2 و 3 و 4 معاً</li><li>عدد بين 130 و 140 يقبل القسمة على 3 و 5 و 9 معاً</li></ol></div>`,
      modelAnswer: `<p>1. العدد 24 (يقبل القسمة على 2 و 3)</p><p>2. العدد 45 (يقبل القسمة على 5 و 9)</p><p>3. العدد 100 (يقبل القسمة على 4 و 5)</p><p>4. العدد 72 (يقبل القسمة على 2 و 3 و 4)</p><p>5. العدد 135 (يقبل القسمة على 3 و 5 و 9)</p>`,
      displayOrder: 9
    },
    {
      type: 'main',
      question: 'التحدي الكبير - الأرقام المفقودة',
      questionRichContent: `<div style="background-color: #f3e5f5; padding: 20px; border-radius: 15px; margin: 20px 0;"><div style="background-color: #f5f0ff; padding: 15px; border-radius: 10px; margin-bottom: 15px;"> **الوضعية:** في كل عدد من الأعداد التالية، هناك رقم ناقص (□). أوجد الرقم المناسب لتحقيق الشرط المطلوب. </div><table style="width:100%; text-align:center;" border="1" cellpadding="5"><tr><th>العدد</th><th>الشرط</th></tr><tr><td>24□</td><td>يقبل القسمة على 2</td></tr><tr><td>3□2</td><td>يقبل القسمة على 3</td></tr><tr><td>1□4</td><td>يقبل القسمة على 4</td></tr><tr><td>7□5</td><td>يقبل القسمة على 5</td></tr><tr><td>8□1</td><td>يقبل القسمة على 9</td></tr></table></div>`,
      modelAnswer: `<p><strong>24□ يقبل القسمة على 2:</strong> يمكن أن يكون 0، 2، 4، 6، 8 (أي رقم زوجي)</p><p><strong>3□2 يقبل القسمة على 3:</strong> 3+□+2 = 5+□ يقبل القسمة على 3، إذن □ يمكن أن يكون 1، 4، 7</p><p><strong>1□4 يقبل القسمة على 4:</strong> آخر رقمين □4 يجب أن يقبل القسمة على 4، إذن □ يمكن أن يكون 0، 2، 4، 6، 8</p><p><strong>7□5 يقبل القسمة على 5:</strong> العدد ينتهي بـ 5، إذن يقبل القسمة على 5 مهما كان □ (جميع الأرقام من 0 إلى 9)</p><p><strong>8□1 يقبل القسمة على 9:</strong> 8+□+1 = 9+□ يقبل القسمة على 9، إذن □ يمكن أن يكون 0 أو 9</p>`,
      displayOrder: 10
    }
  ];

  for (const ex of exercisesData) {
      await prisma.exercise.create({
          data: {
              lessonId: lesson.id,
              type: ex.type,
              question: ex.question,
              questionRichContent: ex.questionRichContent,
              expectedResults: ex.expectedResults,
              modelAnswer: ex.modelAnswer,
              displayOrder: ex.displayOrder
          }
      });
  }
  console.log(`✅ Created ${exercisesData.length} exercises.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });