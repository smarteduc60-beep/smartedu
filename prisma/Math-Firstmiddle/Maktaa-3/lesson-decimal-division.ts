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

  const lessonTitle = "القسمة العشرية";

  const content = `
<div dir="rtl">
  🔍 <strong>تمهيد: ماذا نعني بالقسمة العشرية؟</strong>
  <div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0; text-align: center;">
    القسمة العشرية هي عملية تقسيم عدد (عشري أو طبيعي) على عدد آخر (طبيعي) لنحصل على خارج قسمة يمكن أن يكون عدداً عشرياً (أي يحوي فاصلة).

    <div style="display: flex; justify-content: center; gap: 30px; margin: 30px 0;">
      <div style="background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <p style="font-size: 1.8em; color: #1976D2;">34 ÷ 5 = <span style="font-weight: bold;">6,8</span></p>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <p style="font-size: 1.8em; color: #c2185b;">47 ÷ 4 = <span style="font-weight: bold;">11,75</span></p>
      </div>
    </div>
    <p style="background-color: #fff3cd; padding: 10px; border-radius: 5px;"><strong>ملاحظة مهمة:</strong> في القسمة العشرية، نواصل القسمة بعد الفاصلة بإضافة أصفار إلى الباقي.</p>
  </div>

  📝 <strong>المصطلحات الأساسية</strong>
  <div style="background-color: #fff3cd; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <table style="width: 100%; text-align: center;" border="1" cellpadding="10">
      <tr><th>المصطلح</th><th>التعريف</th><th>مثال (34 ÷ 5 = 6,8)</th></tr>
      <tr><td>المقسوم</td><td>العدد الذي نريد قسمته</td><td>34</td></tr>
      <tr><td>المقسوم عليه</td><td>العدد الذي نقسم عليه</td><td>5</td></tr>
      <tr><td>حاصل القسمة</td><td>ناتج القسمة (قد يكون عشرياً)</td><td>6,8</td></tr>
      <tr><td>الباقي</td><td>في القسمة العشرية، الباقي = 0</td><td>0</td></tr>
    </table>
  </div>

  📐 <strong>كيفية إجراء القسمة العشرية</strong>
  <div style="background-color: #e3f2fd; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 10px;">
      <div style="width: 45%; min-width: 250px;"> <h4 style="color: #1976D2;">الخطوة ①</h4> <p>نبدأ القسمة كالمعتاد (قسمة إقليدية) حتى نحصل على باقٍ</p> </div>
      <div style="width: 45%; min-width: 250px;"> <h4 style="color: #1976D2;">الخطوة ②</h4> <p>نضع فاصلة في حاصل القسمة ونضيف صفراً إلى الباقي</p> </div>
    </div>
    <div style="display: flex; justify-content: space-around; margin-top: 20px; flex-wrap: wrap; gap: 10px;">
      <div style="width: 45%; min-width: 250px;"> <h4 style="color: #1976D2;">الخطوة ③</h4> <p>نواصل القسمة مع الأصفار المضافة حتى يصبح الباقي صفراً</p> </div>
      <div style="width: 45%; min-width: 250px;"> <h4 style="color: #1976D2;">الخطوة ④</h4> <p>نتحقق من النتيجة: المقسوم = المقسوم عليه × حاصل القسمة</p> </div>
    </div>
  </div>

  ✅ <strong>أمثلة محلولة خطوة بخطوة</strong>
  
  📌 <strong>المثال 1: قسمة عدد طبيعي على عدد طبيعي (نتيجة عشرية)</strong>
  <div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <p style="font-size: 1.3em; font-weight: bold;">37 ÷ 5 = ؟</p>
    <div style="display: flex; gap: 30px; flex-wrap: wrap; align-items: flex-start;">
      <div style="background-color: white; padding: 20px; border-radius: 10px;">
        <svg width="200" height="180" viewBox="0 0 200 180" style="font-family: monospace; font-size: 20px; direction: ltr;">
          <text x="30" y="30">37</text>
          <line x1="70" y1="10" x2="70" y2="170" stroke="black" stroke-width="2" />
          <text x="80" y="30">5</text>
          <line x1="70" y1="40" x2="150" y2="40" stroke="black" stroke-width="2" />
          
          <text x="80" y="70" fill="#1976D2" font-weight="bold">7,</text>
          <text x="105" y="70" fill="#1976D2" font-weight="bold">4</text>
          
          <text x="15" y="60" fill="red">-35</text>
          <line x1="15" y1="65" x2="60" y2="65" stroke="black" stroke-width="1" />
          
          <text x="30" y="90">02</text>
          <text x="55" y="90" fill="blue" font-weight="bold">0</text>
          
          <text x="15" y="120" fill="red">-20</text>
          <line x1="15" y1="125" x2="70" y2="125" stroke="black" stroke-width="1" />
          
          <text x="30" y="150" fill="green" font-weight="bold">00</text>
        </svg>
      </div>
      <div>
        <p><strong style="color: #1976D2;">الخطوة 1:</strong> 5 × 7 = 35، الباقي 2</p>
        <p><strong style="color: #1976D2;">الخطوة 2:</strong> نضع فاصلة في حاصل القسمة (7,)</p>
        <p><strong style="color: #1976D2;">الخطوة 3:</strong> نضيف صفراً إلى الباقي (20)</p>
        <p><strong style="color: #1976D2;">الخطوة 4:</strong> 5 × 4 = 20، الباقي 0</p>
        <p><strong style="color: #c2185b;">النتيجة:</strong> 37 ÷ 5 = <strong>7,4</strong></p>
        <p><strong>التحقق:</strong> 5 × 7,4 = 37 ✓</p>
      </div>
    </div>
  </div>

  📌 <strong>المثال 2: قسمة عدد طبيعي على عدد طبيعي (رقمان بعد الفاصلة)</strong>
  <div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <p style="font-size: 1.3em; font-weight: bold;">43 ÷ 4 = ؟</p>
    <div style="display: flex; gap: 30px; flex-wrap: wrap; align-items: flex-start;">
      <div style="background-color: white; padding: 20px; border-radius: 10px;">
        <svg width="200" height="240" viewBox="0 0 200 240" style="font-family: monospace; font-size: 20px; direction: ltr;">
          <text x="30" y="30">43</text>
          <line x1="70" y1="10" x2="70" y2="230" stroke="black" stroke-width="2" />
          <text x="80" y="30">4</text>
          <line x1="70" y1="40" x2="160" y2="40" stroke="black" stroke-width="2" />
          
          <text x="80" y="70" fill="#1976D2" font-weight="bold">10,</text>
          <text x="115" y="70" fill="#1976D2" font-weight="bold">7</text>
          <text x="127" y="70" fill="#1976D2" font-weight="bold">5</text>

          <text x="15" y="60" fill="red">-40</text>
          <line x1="15" y1="65" x2="60" y2="65" stroke="black" stroke-width="1" />
          
          <text x="30" y="90">03</text>
          <text x="55" y="90" fill="blue" font-weight="bold">0</text>

          <text x="15" y="120" fill="red">-28</text>
          <line x1="15" y1="125" x2="70" y2="125" stroke="black" stroke-width="1" />
          
          <text x="30" y="150">02</text>
          <text x="55" y="150" fill="blue" font-weight="bold">0</text>
          
          <text x="15" y="180" fill="red">-20</text>
          <line x1="15" y1="185" x2="70" y2="185" stroke="black" stroke-width="1" />
          
          <text x="30" y="210" fill="green" font-weight="bold">00</text>
        </svg>
      </div>
      <div>
        <p><strong style="color: #1976D2;">الخطوة 1:</strong> 4 × 10 = 40، الباقي 3</p>
        <p><strong style="color: #1976D2;">الخطوة 2:</strong> نضع فاصلة (10,) ونضيف صفراً (30)</p>
        <p><strong style="color: #1976D2;">الخطوة 3:</strong> 4 × 7 = 28، الباقي 2</p>
        <p><strong style="color: #1976D2;">الخطوة 4:</strong> نضيف صفراً (20)، 4 × 5 = 20، الباقي 0</p>
        <p><strong style="color: #c2185b;">النتيجة:</strong> 43 ÷ 4 = <strong>10,75</strong></p>
        <p><strong>التحقق:</strong> 4 × 10,75 = 43 ✓</p>
      </div>
    </div>
  </div>

  📌 <strong>المثال 3: قسمة عدد عشري على عدد طبيعي</strong>
  <div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <p style="font-size: 1.3em; font-weight: bold;">27,6 ÷ 3 = ؟</p>
    <div style="display: flex; gap: 30px; flex-wrap: wrap; align-items: flex-start;">
      <div style="background-color: white; padding: 20px; border-radius: 10px;">
        <svg width="200" height="180" viewBox="0 0 200 180" style="font-family: monospace; font-size: 20px; direction: ltr;">
          <text x="20" y="30">27,6</text>
          <line x1="80" y1="10" x2="80" y2="170" stroke="black" stroke-width="2" />
          <text x="90" y="30">3</text>
          <line x1="80" y1="40" x2="150" y2="40" stroke="black" stroke-width="2" />
          
          <text x="90" y="70" fill="#1976D2" font-weight="bold">9,</text>
          <text x="115" y="70" fill="#1976D2" font-weight="bold">2</text>
          
          <text x="10" y="60" fill="red">-27</text>
          <line x1="10" y1="65" x2="70" y2="65" stroke="black" stroke-width="1" />
          
          <text x="30" y="90">00</text>
          <text x="55" y="90" fill="blue" font-weight="bold">,6</text>
          
          <text x="20" y="120" fill="red">- 6</text>
          <line x1="20" y1="125" x2="70" y2="125" stroke="black" stroke-width="1" />
          
          <text x="40" y="150" fill="green" font-weight="bold">0</text>
        </svg>
      </div>
      <div>
        <p><strong style="color: #1976D2;">الخطوة 1:</strong> نقسم الجزء الصحيح: 27 ÷ 3 = 9، الباقي 0</p>
        <p><strong style="color: #1976D2;">الخطوة 2:</strong> نضع فاصلة في حاصل القسمة (9,)</p>
        <p><strong style="color: #1976D2;">الخطوة 3:</strong> ننزل الرقم 6 (0,6)</p>
        <p><strong style="color: #1976D2;">الخطوة 4:</strong> 6 ÷ 3 = 2</p>
        <p><strong style="color: #c2185b;">النتيجة:</strong> 27,6 ÷ 3 = <strong>9,2</strong></p>
        <p><strong>التحقق:</strong> 3 × 9,2 = 27,6 ✓</p>
      </div>
    </div>
  </div>

  📌 <strong>المثال 4: قسمة عدد عشري على عدد طبيعي (مع باقي)</strong>
  <div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <p style="font-size: 1.3em; font-weight: bold;">18,5 ÷ 4 = ؟</p>
    <div style="display: flex; gap: 30px; flex-wrap: wrap; align-items: flex-start;">
      <div style="background-color: white; padding: 20px; border-radius: 10px;">
        <svg width="200" height="280" viewBox="0 0 200 280" style="font-family: monospace; font-size: 20px; direction: ltr;">
          <text x="20" y="30">18,5</text>
          <line x1="80" y1="10" x2="80" y2="270" stroke="black" stroke-width="2" />
          <text x="90" y="30">4</text>
          <line x1="80" y1="40" x2="160" y2="40" stroke="black" stroke-width="2" />
          
          <text x="90" y="70" fill="#1976D2" font-weight="bold">4,</text>
          <text x="115" y="70" fill="#1976D2" font-weight="bold">6</text>
          <text x="127" y="70" fill="#1976D2" font-weight="bold">2</text>
          <text x="139" y="70" fill="#1976D2" font-weight="bold">5</text>

          <text x="10" y="60" fill="red">-16</text>
          <line x1="10" y1="65" x2="70" y2="65" stroke="black" stroke-width="1" />
          
          <text x="30" y="90">02</text>
          <text x="55" y="90" fill="blue" font-weight="bold">,5</text>
          
          <text x="10" y="120" fill="red">-24</text>
          <line x1="10" y1="125" x2="70" y2="125" stroke="black" stroke-width="1" />
          
          <text x="30" y="150">01</text>
          <text x="55" y="150" fill="blue" font-weight="bold">0</text>
          
          <text x="20" y="180" fill="red">- 8</text>
          <line x1="20" y1="185" x2="70" y2="185" stroke="black" stroke-width="1" />
          
          <text x="30" y="210">02</text>
          <text x="55" y="210" fill="blue" font-weight="bold">0</text>
          
          <text x="10" y="240" fill="red">-20</text>
          <line x1="10" y1="245" x2="70" y2="245" stroke="black" stroke-width="1" />
          <text x="30" y="270" fill="green" font-weight="bold">00</text>
        </svg>
      </div>
      <div>
        <p><strong style="color: #1976D2;">الخطوة 1:</strong> 4 × 4 = 16، الباقي 2</p>
        <p><strong style="color: #1976D2;">الخطوة 2:</strong> نضع فاصلة (4,)، ننزل 5 (2,5)</p>
        <p><strong style="color: #1976D2;">الخطوة 3:</strong> نضيف صفراً (2,50)، 4 × 6 = 24، الباقي 1</p>
        <p><strong style="color: #1976D2;">الخطوة 4:</strong> نضيف صفراً (10)، 4 × 2 = 8، الباقي 2</p>
        <p><strong style="color: #c2185b;">النتيجة:</strong> 18,5 ÷ 4 = <strong>4,62</strong> (تقريباً)</p>
      </div>
    </div>
    <p style="background-color: #fff3cd; padding: 10px; border-radius: 5px; margin-top: 15px;"><strong>ملاحظة:</strong> يمكن أن تستمر القسمة ولا تنتهي أحياناً، فنقرب النتيجة إلى درجة معينة.</p>
  </div>

  📌 <strong>المثال 5: قسمة عددين عشريين (بتحويل المقسوم عليه)</strong>
  <div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0;">
    <p style="font-size: 1.3em; font-weight: bold;">12,6 ÷ 0,2 = ؟</p>
    <div style="display: flex; gap: 30px; flex-wrap: wrap; align-items: flex-start;">
      <div style="background-color: white; padding: 20px; border-radius: 10px;">
        <svg width="200" height="180" viewBox="0 0 200 180" style="font-family: monospace; font-size: 20px; direction: ltr;">
          <text x="30" y="30">126</text>
          <line x1="80" y1="10" x2="80" y2="170" stroke="black" stroke-width="2" />
          <text x="90" y="30">2</text>
          <line x1="80" y1="40" x2="150" y2="40" stroke="black" stroke-width="2" />
          
          <text x="90" y="70" fill="#1976D2" font-weight="bold">63</text>
          
          <text x="15" y="60" fill="red">-12</text>
          <line x1="15" y1="65" x2="70" y2="65" stroke="black" stroke-width="1" />
          
          <text x="30" y="90">00</text>
          <text x="55" y="90" fill="blue" font-weight="bold">6</text>
          
          <text x="30" y="120" fill="red">- 6</text>
          <line x1="30" y1="125" x2="70" y2="125" stroke="black" stroke-width="1" />
          
          <text x="40" y="150" fill="green" font-weight="bold">0</text>
        </svg>
      </div>
      <div style="width: 60%;">
        <p><strong style="color: #1976D2;">الطريقة:</strong> نضرب المقسوم والمقسوم عليه في 10 حتى يصبح المقسوم عليه عدداً طبيعياً</p>
        <p style="margin-top: 15px;">12,6 × 10 = <span style="color: #c2185b;">126</span></p>
        <p>0,2 × 10 = <span style="color: #c2185b;">2</span></p>
        <p style="margin-top: 15px;">نقسم: 126 ÷ 2 = <span style="font-size: 1.5em; font-weight: bold;">63</span></p>
      </div>
    </div>
    <div style="background-color: #e8f5e9; padding: 20px; border-radius: 10px; margin-top: 10px;">
        <p><strong>التحقق:</strong> 0,2 × 63 = 12,6 ✓</p>
    </div>
  </div>

  📊 <strong>جدول ملخص</strong>
  <div style="background-color: #fff3cd; padding: 20px; border-radius: 15px; margin: 30px 0;">
    <table style="width: 100%; text-align: center;" border="1" cellpadding="10">
      <tr><th>نوع القسمة</th><th>الطريقة</th><th>مثال</th></tr>
      <tr><td>طبيعي ÷ طبيعي</td><td>نقسم عادياً، ثم نضيف أصفاراً للباقي</td><td>37 ÷ 5 = 7,4</td></tr>
      <tr><td>عشري ÷ طبيعي</td><td>نقسم الجزء الصحيح ثم العشري</td><td>27,6 ÷ 3 = 9,2</td></tr>
      <tr><td>عشري ÷ عشري</td><td>نضرب في 10، 100... حتى يصبح المقسوم عليه طبيعياً</td><td>12,6 ÷ 0,2 = 126 ÷ 2 = 63</td></tr>
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
      question: 'أكمل الفراغات:\n1. في القسمة العشرية، نضيف ...... إلى الباقي لمواصلة القسمة\n2. عندما نضيف صفراً إلى الباقي، نضع ...... في حاصل القسمة\n3. 24 ÷ 5 = ......\n4. 37 ÷ 2 = ......\n5. 15,5 ÷ 5 = ......', 
      expectedResults: [
        { question: "1", result: "أصفاراً" },
        { question: "2", result: "فاصلة" },
        { question: "3", result: "4,8" },
        { question: "4", result: "18,5" },
        { question: "5", result: "3,1" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'أتمم القسمة التالية:\n23 ÷ 4\n1. الباقي الأول (23-20) = ...\n2. نضيف صفراً للباقي فيصبح ...\n3. الرقم الأول بعد الفاصلة هو ...\n4. 4 × 7 = ...', 
      expectedResults: [
        { question: "1", result: "3" },
        { question: "2", result: "30" },
        { question: "3", result: "7" },
        { question: "4", result: "28" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'احسب حاصل القسمة:\n1. 18 ÷ 5 = ...\n2. 27 ÷ 4 = ...\n3. 35 ÷ 2 = ...\n4. 42 ÷ 8 = ...\n5. 53 ÷ 5 = ...', 
      expectedResults: [
        { question: "1", result: "3,6" },
        { question: "2", result: "6,75" },
        { question: "3", result: "17,5" },
        { question: "4", result: "5,25" },
        { question: "5", result: "10,6" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'احسب حاصل القسمة (أعداد عشرية):\n1. 12,5 ÷ 5 = ...\n2. 24,6 ÷ 3 = ...\n3. 31,2 ÷ 4 = ...\n4. 45,5 ÷ 7 = ...\n5. 56,4 ÷ 6 = ...', 
      expectedResults: [
        { question: "1", result: "2,5" },
        { question: "2", result: "8,2" },
        { question: "3", result: "7,8" },
        { question: "4", result: "6,5" },
        { question: "5", result: "9,4" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'قسمة عددين عشريين (النتيجة):\n1. 6,4 ÷ 0,2 = ...\n2. 8,5 ÷ 0,5 = ...\n3. 9,6 ÷ 0,3 = ...\n4. 12,6 ÷ 0,6 = ...\n5. 15,5 ÷ 0,5 = ...', 
      expectedResults: [
        { question: "1", result: "32" },
        { question: "2", result: "17" },
        { question: "3", result: "32" },
        { question: "4", result: "21" },
        { question: "5", result: "31" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'أكمل الجدول (حاصل القسمة):\n1. 29 ÷ 4 = ...\n2. 46 ÷ 5 = ...\n3. 33,6 ÷ 6 = ...\n4. 48,3 ÷ 7 = ...\n5. 52,8 ÷ 8 = ...', 
      expectedResults: [
        { question: "1", result: "7,25" },
        { question: "2", result: "9,2" },
        { question: "3", result: "5,6" },
        { question: "4", result: "6,9" },
        { question: "5", result: "6,6" }
      ]
    },
    { 
      type: 'support_with_results', 
      question: 'اختر الإجابة الصحيحة:\n1. 23 ÷ 2 = ... (11,5 / 11 / 12,5)\n2. 37 ÷ 5 = ... (7,2 / 7,4 / 7,5)\n3. 42,5 ÷ 5 = ... (8,5 / 7,5 / 9,5)\n4. 6,4 ÷ 0,4 = ... (16 / 1,6 / 160)\n5. 15,6 ÷ 3 = ... (5,2 / 5,4 / 5,6)', 
      expectedResults: [
        { question: "1", result: "11,5" },
        { question: "2", result: "7,4" },
        { question: "3", result: "8,5" },
        { question: "4", result: "16" },
        { question: "5", result: "5,2" }
      ]
    },
    // تمارين رئيسية (30%)
    { 
      type: 'main', 
      question: 'مسألة: شراء أقلام:\nاشترى أحمد 5 أقلام بمبلغ 47,5 ديناراً.\n\nالمطلوب:\n1. احسب ثمن القلم الواحد.\n2. إذا أراد شراء 3 أقلام من النوع نفسه، كم سيدفع؟\n3. إذا كان معه 100 دينار، كم قلماً يمكنه شراء؟', 
      modelAnswer: '1. ثمن القلم = 47,5 ÷ 5 = 9,5 ديناراً\n2. ثمن 3 أقلام = 9,5 × 3 = 28,5 ديناراً\n3. عدد الأقلام = 100 ÷ 9,5 = 10 أقلام (والباقي 5 دنانير)' 
    },
    { 
      type: 'main', 
      question: 'مسألة: مسافة الرحلة:\nقطع سعيد مسافة 156,4 km بسيارته في 4 ساعات.\n\nالمطلوب:\n1. احسب المسافة التي يقطعها في ساعة واحدة (السرعة المتوسطة).\n2. كم ساعة يحتاج لقطع مسافة 234,6 km بنفس السرعة؟\n3. كم كيلومتراً يقطع في 3 ساعات ونصف؟', 
      modelAnswer: '1. السرعة = 156,4 ÷ 4 = 39,1 km/h\n2. الزمن = 234,6 ÷ 39,1 = 6 ساعات\n3. المسافة = 39,1 × 3,5 = 136,85 km' 
    },
    { 
      type: 'main', 
      question: 'التحدي الكبير - تنظيم رحلة:\nتنظم مدرسة رحلة لـ 48 تلميذاً. تكلفة الحافلة الواحدة 3500 ديناراً وتتسع لـ 15 تلميذاً.\n\nالمطلوب:\n1. كم حافلة نحتاج؟\n2. كم تلميذاً في الحافلة الأخيرة؟\n3. إذا كانت تكلفة الاشتراك للتلميذ الواحد 125,5 ديناراً، فكم يكون مجموع الاشتراكات؟\n4. ما هي التكلفة الإجمالية للحافلات؟\n5. هل تكفي الاشتراكات لدفع تكلفة الحافلات؟', 
      modelAnswer: '1. عدد الحافلات = 48 ÷ 15 = 3,2 → 4 حافلات\n2. تلاميذ الحافلة الأخيرة = 48 - (15×3) = 3 تلاميذ\n3. مجموع الاشتراكات = 48 × 125,5 = 6024 ديناراً\n4. تكلفة الحافلات = 4 × 3500 = 14000 ديناراً\n5. الاشتراكات لا تكفي (6024 < 14000) وتحتاج 7976 ديناراً إضافياً' 
    },
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