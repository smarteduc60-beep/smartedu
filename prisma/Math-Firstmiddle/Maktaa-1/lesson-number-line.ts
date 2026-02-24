import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding Lesson: Number Line ...');

  // 1. Fetch the Teacher
  const teacherEmail = 'ladj14013@gmail.com';
  const teacher = await prisma.user.findUnique({
    where: { email: teacherEmail },
    include: { userDetails: true }
  });

  if (!teacher) {
    console.error(`❌ Teacher ${teacherEmail} not found. Please run 'prisma/seed-math-1cem.ts' first.`);
    process.exit(1);
  }

  if (!teacher.userDetails?.subjectId) {
    console.error(`❌ Teacher ${teacherEmail} has no subject assigned.`);
    process.exit(1);
  }

  // 2. Fetch Level (1CEM)
  const level = await prisma.level.findFirst({
    where: { name: 'أولى متوسط' }
  });

  if (!level) {
    console.error('❌ Level "أولى متوسط" not found. Please run the base seed.');
    process.exit(1);
  }

  // 3. Prepare Content
  const lessonContent = `
    <h3 style="color: #2563eb;">🔍 ما هو نصف المستقيم المدرّج؟</h3>
    <p>نصف المستقيم المدرّج هو خط نبدأ فيه من نقطة تسمى "المبدأ" (عادة 0) ثم نضع عليها تدريجات متساوية تمثل الأعداد.</p>

    <h4 style="color: #d97706;">🖍️ مثال من الحياة:</h4>
    <p>المسطرة التي تستعملها في القياس هي نصف مستقيم مدرّج!</p>

    <div style="background-color: #f0f9ff; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
      <svg width="100%" viewBox="0 0 500 60" xmlns="http://www.w3.org/2000/svg" style="font-family: sans-serif;">
        <line x1="20" y1="30" x2="480" y2="30" stroke="#333" stroke-width="2" />
        <polygon points="480,30 470,25 470,35" fill="#333" />
        <circle cx="20" cy="30" r="3" fill="#333" />
        <g stroke="#333" stroke-width="2">
          <line x1="20" y1="25" x2="20" y2="35" /> <text x="20" y="50" text-anchor="middle" font-size="12">0</text>
          <line x1="60" y1="25" x2="60" y2="35" /> <text x="60" y="50" text-anchor="middle" font-size="12">1</text>
          <line x1="100" y1="25" x2="100" y2="35" /> <text x="100" y="50" text-anchor="middle" font-size="12">2</text>
          <line x1="140" y1="25" x2="140" y2="35" /> <text x="140" y="50" text-anchor="middle" font-size="12">3</text>
          <line x1="180" y1="25" x2="180" y2="35" /> <text x="180" y="50" text-anchor="middle" font-size="12">4</text>
          <line x1="220" y1="25" x2="220" y2="35" /> <text x="220" y="50" text-anchor="middle" font-size="12">5</text>
          <line x1="260" y1="25" x2="260" y2="35" /> <text x="260" y="50" text-anchor="middle" font-size="12">6</text>
          <line x1="300" y1="25" x2="300" y2="35" /> <text x="300" y="50" text-anchor="middle" font-size="12">7</text>
          <line x1="340" y1="25" x2="340" y2="35" /> <text x="340" y="50" text-anchor="middle" font-size="12">8</text>
          <line x1="380" y1="25" x2="380" y2="35" /> <text x="380" y="50" text-anchor="middle" font-size="12">9</text>
          <line x1="420" y1="25" x2="420" y2="35" /> <text x="420" y="50" text-anchor="middle" font-size="12">10</text>
        </g>
      </svg>
    </div>

    <h3 style="color: #2563eb;">🧩 مكونات نصف المستقيم المدرّج</h3>
    <div style="display: flex; justify-content: space-around; margin: 20px 0; gap: 10px; flex-wrap: wrap;">
      <div style="background-color: #e8f5e8; padding: 15px; border-radius: 10px; text-align: center; flex: 1; min-width: 150px;">
        <div style="font-size: 2em; color: #4CAF50;">●</div>
        <div style="font-weight: bold;">المبدأ</div>
        <div>نقطة البداية (عادة 0)</div>
      </div>
      <div style="background-color: #fff3e0; padding: 15px; border-radius: 10px; text-align: center; flex: 1; min-width: 150px;">
        <div style="font-size: 2em; color: #FF9800;">|</div>
        <div style="font-weight: bold;">التدريجات</div>
        <div>علامات متساوية المسافة</div>
      </div>
      <div style="background-color: #ffebee; padding: 15px; border-radius: 10px; text-align: center; flex: 1; min-width: 150px;">
        <div style="font-size: 2em; color: #f44336;">→</div>
        <div style="font-weight: bold;">الاتجاه</div>
        <div>تتزايد الأعداد نحو اليمين</div>
      </div>
    </div>

    <h3 style="color: #9333ea;">📐 المقياس (الوحدة)</h3>
    <p>المقياس هو المسافة بين تدريج وآخر.</p>

    <div style="background-color: #e6f7ff; padding: 20px; border-radius: 10px; margin: 15px 0;">
      <p>مثال: إذا كان المقياس 1cm، فالمسافة بين 0 و 1 هي 1cm، وبين 1 و 2 هي 1cm، وهكذا.</p>
      <svg width="100%" viewBox="0 0 400 60" xmlns="http://www.w3.org/2000/svg" style="font-family: sans-serif;">
        <line x1="20" y1="30" x2="380" y2="30" stroke="#333" stroke-width="2" />
        <polygon points="380,30 370,25 370,35" fill="#333" />
        <circle cx="20" cy="30" r="3" fill="#333" />
        <g stroke="#333" stroke-width="2">
          <line x1="20" y1="25" x2="20" y2="35" /> <text x="20" y="50" text-anchor="middle" font-size="14">0</text>
          <line x1="120" y1="25" x2="120" y2="35" /> <text x="120" y="50" text-anchor="middle" font-size="14">1</text>
          <line x1="220" y1="25" x2="220" y2="35" /> <text x="220" y="50" text-anchor="middle" font-size="14">2</text>
          <line x1="320" y1="25" x2="320" y2="35" /> <text x="320" y="50" text-anchor="middle" font-size="14">3</text>
        </g>
        <text x="70" y="20" text-anchor="middle" font-size="12" fill="#666">1cm</text>
      </svg>
    </div>

    <h3 style="color: #16a34a;">✏️ كيف نمثل الأعداد على نصف مستقيم مدرّج؟</h3>
    <ol>
      <li>الخطوة 1: نحدد المبدأ (0)</li>
      <li>الخطوة 2: نحدد المقياس (مثلاً 1cm)</li>
      <li>الخطوة 3: نضع التدريجات على مسافات متساوية</li>
      <li>الخطوة 4: نكتب الأعداد تحت كل تدريج</li>
    </ol>

    <h3 style="color: #d97706;">✅ أمثلة محلولة خطوة بخطوة</h3>
    
    <div style="background-color: #f6f6f6; padding: 20px; border-radius: 10px; margin-bottom: 15px;">
      <p><strong>📌 المثال 1:</strong> مثل العدد 4 على نصف مستقيم مدرّج (المقياس 1cm)</p>
      <p>الخطوة 1: أرسم نصف مستقيم وأضع النقطة 0</p>
      <p>الخطوة 2: أقيس مسافة 1cm من 0 وأضع النقطة 1</p>
      <p>الخطوة 3: أكمل بنفس الطريقة حتى أصل إلى 4</p>
      <p>النتيجة:</p>
      <div style="background-color: white; padding: 15px; text-align: center; border: 1px solid #ddd; border-radius: 8px;">
        <svg width="100%" viewBox="0 0 400 60" xmlns="http://www.w3.org/2000/svg" style="font-family: sans-serif;">
          <line x1="20" y1="30" x2="380" y2="30" stroke="#333" stroke-width="2" />
          <polygon points="380,30 370,25 370,35" fill="#333" />
          <circle cx="20" cy="30" r="3" fill="#333" />
          <g stroke="#333" stroke-width="2">
            <line x1="20" y1="25" x2="20" y2="35" /> <text x="20" y="50" text-anchor="middle" font-size="14">0</text>
            <line x1="80" y1="25" x2="80" y2="35" /> <text x="80" y="50" text-anchor="middle" font-size="14">1</text>
            <line x1="140" y1="25" x2="140" y2="35" /> <text x="140" y="50" text-anchor="middle" font-size="14">2</text>
            <line x1="200" y1="25" x2="200" y2="35" /> <text x="200" y="50" text-anchor="middle" font-size="14">3</text>
            <line x1="260" y1="25" x2="260" y2="35" /> <text x="260" y="50" text-anchor="middle" font-size="14" font-weight="bold" fill="#d97706">4</text>
          </g>
        </svg>
      </div>
    </div>

    <div style="background-color: #f6f6f6; padding: 20px; border-radius: 10px; margin-bottom: 15px;">
      <p><strong>📌 المثال 2:</strong> مثل العدد 2,5 على نصف مستقيم مدرّج (المقياس 2cm)</p>
      <p>الخطوة 1: المقياس 2cm يعني أن المسافة بين 0 و 1 هي 2cm</p>
      <p>الخطوة 2: المسافة بين 0 و 2 هي 4cm (2cm × 2)</p>
      <p>الخطوة 3: العدد 2,5 يقع في منتصف المسافة بين 2 و 3</p>
      <div style="background-color: #e8f5e9; padding: 15px; text-align: center; margin: 10px 0; border: 1px solid #c8e6c9; border-radius: 8px;">
        <svg width="100%" viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg" style="font-family: sans-serif;">
          <line x1="20" y1="30" x2="380" y2="30" stroke="#333" stroke-width="2" />
          <polygon points="380,30 370,25 370,35" fill="#333" />
          <circle cx="20" cy="30" r="3" fill="#333" />
          <g stroke="#333" stroke-width="2">
            <line x1="20" y1="25" x2="20" y2="35" /> <text x="20" y="50" text-anchor="middle" font-size="14">0</text>
            <line x1="120" y1="25" x2="120" y2="35" /> <text x="120" y="50" text-anchor="middle" font-size="14">1</text>
            <line x1="220" y1="25" x2="220" y2="35" /> <text x="220" y="50" text-anchor="middle" font-size="14">2</text>
            <line x1="320" y1="25" x2="320" y2="35" /> <text x="320" y="50" text-anchor="middle" font-size="14">3</text>
          </g>
          <!-- 2.5 -->
          <line x1="270" y1="25" x2="270" y2="35" stroke="#d97706" stroke-width="2" />
          <text x="270" y="65" text-anchor="middle" font-size="14" font-weight="bold" fill="#d97706">2,5</text>
          <path d="M270,52 L265,58 L275,58 Z" fill="#d97706" />
        </svg>
      </div>
    </div>

    <div style="background-color: #f6f6f6; padding: 20px; border-radius: 10px; margin-bottom: 15px;">
      <p><strong>📌 المثال 3:</strong> مثل الأعداد 0,2 - 0,5 - 0,8 على نصف مستقيم (المقياس 5cm)</p>
      <p>الخطوة 1: المقياس 5cm يعني أن المسافة بين 0 و 1 هي 5cm</p>
      <p>الخطوة 2: نقسم المسافة بين 0 و 1 إلى 10 أجزاء متساوية (كل جزء = 0,5cm)</p>
      <p>الخطوة 3: نضع الأعداد في أماكنها:</p>
      <ul>
        <li>0,2 = بعد جزأين من 0</li>
        <li>0,5 = بعد 5 أجزاء (في المنتصف)</li>
        <li>0,8 = بعد 8 أجزاء</li>
      </ul>
      <div style="background-color: white; padding: 15px; text-align: center; border: 1px solid #ddd; border-radius: 8px;">
        <svg width="100%" viewBox="0 0 500 80" xmlns="http://www.w3.org/2000/svg" style="font-family: sans-serif;">
          <line x1="20" y1="30" x2="480" y2="30" stroke="#333" stroke-width="2" />
          <polygon points="480,30 470,25 470,35" fill="#333" />
          <circle cx="20" cy="30" r="3" fill="#333" />
          
          <!-- Main Ticks -->
          <line x1="20" y1="20" x2="20" y2="40" stroke="#333" stroke-width="2" /> <text x="20" y="55" text-anchor="middle" font-size="14">0</text>
          <line x1="420" y1="20" x2="420" y2="40" stroke="#333" stroke-width="2" /> <text x="420" y="55" text-anchor="middle" font-size="14">1</text>

          <!-- Sub Ticks -->
          <g stroke="#999" stroke-width="1">
            <line x1="60" y1="25" x2="60" y2="35" /> <line x1="100" y1="25" x2="100" y2="35" /> <line x1="140" y1="25" x2="140" y2="35" />
            <line x1="180" y1="25" x2="180" y2="35" /> <line x1="220" y1="25" x2="220" y2="35" /> <line x1="260" y1="25" x2="260" y2="35" />
            <line x1="300" y1="25" x2="300" y2="35" /> <line x1="340" y1="25" x2="340" y2="35" /> <line x1="380" y1="25" x2="380" y2="35" />
          </g>

          <!-- Points -->
          <text x="100" y="75" text-anchor="middle" font-size="12" fill="#d97706" font-weight="bold">0,2</text> <line x1="100" y1="30" x2="100" y2="60" stroke="#d97706" stroke-width="1" stroke-dasharray="2,2" />
          <text x="220" y="75" text-anchor="middle" font-size="12" fill="#d97706" font-weight="bold">0,5</text> <line x1="220" y1="30" x2="220" y2="60" stroke="#d97706" stroke-width="1" stroke-dasharray="2,2" />
          <text x="340" y="75" text-anchor="middle" font-size="12" fill="#d97706" font-weight="bold">0,8</text> <line x1="340" y1="30" x2="340" y2="60" stroke="#d97706" stroke-width="1" stroke-dasharray="2,2" />
        </svg>
      </div>
    </div>

    <div style="background-color: #f6f6f6; padding: 20px; border-radius: 10px; margin-bottom: 15px;">
      <p><strong>📌 المثال 4:</strong> أوجد العدد الذي تمثله النقطة A</p>
      <p>المعطيات: نصف مستقيم مدرّج، المقياس 1cm، النقطة A تبعد 3cm عن 0</p>
      <div style="background-color: white; padding: 15px; text-align: center; border: 1px solid #ddd; border-radius: 8px;">
        <svg width="100%" viewBox="0 0 400 60" xmlns="http://www.w3.org/2000/svg" style="font-family: sans-serif;">
          <line x1="20" y1="30" x2="380" y2="30" stroke="#333" stroke-width="2" />
          <polygon points="380,30 370,25 370,35" fill="#333" />
          <circle cx="20" cy="30" r="3" fill="#333" />
          <line x1="20" y1="25" x2="20" y2="35" stroke="#333" stroke-width="2" /> <text x="20" y="50" text-anchor="middle" font-size="14">0</text>
          <line x1="80" y1="28" x2="80" y2="32" stroke="#999" stroke-width="1" />
          <line x1="140" y1="28" x2="140" y2="32" stroke="#999" stroke-width="1" />
          <line x1="200" y1="25" x2="200" y2="35" stroke="#d97706" stroke-width="2" /> 
          <text x="200" y="50" text-anchor="middle" font-size="14" font-weight="bold" fill="#d97706">A</text>
          <line x1="20" y1="15" x2="200" y2="15" stroke="#666" stroke-width="1" />
          <line x1="20" y1="12" x2="20" y2="18" stroke="#666" stroke-width="1" />
          <line x1="200" y1="12" x2="200" y2="18" stroke="#666" stroke-width="1" />
          <text x="110" y="12" text-anchor="middle" font-size="10" fill="#666">3cm</text>
        </svg>
      </div>
      <p>الحل:</p>
      <p>المقياس 1cm يعني: كل 1cm = 1</p>
      <p>المسافة 3cm = 3 وحدات</p>
      <p>إذن <strong>A = 3</strong></p>
    </div>

    <div style="background-color: #f6f6f6; padding: 20px; border-radius: 10px; margin-bottom: 15px;">
      <p><strong>📌 المثال 5:</strong> أوجد العدد الذي تمثله النقطة B (مقياس مختلف)</p>
      <p>المعطيات: المقياس 2cm، النقطة B تبعد 5cm عن 0</p>
      <div style="background-color: white; padding: 15px; text-align: center; border: 1px solid #ddd; border-radius: 8px;">
        <svg width="100%" viewBox="0 0 400 60" xmlns="http://www.w3.org/2000/svg" style="font-family: sans-serif;">
          <line x1="20" y1="40" x2="380" y2="40" stroke="#333" stroke-width="2" />
          <polygon points="380,40 370,35 370,45" fill="#333" />
          <circle cx="20" cy="40" r="3" fill="#333" />
          <line x1="20" y1="35" x2="20" y2="45" stroke="#333" stroke-width="2" /> <text x="20" y="58" text-anchor="middle" font-size="14">0</text>
          <line x1="100" y1="35" x2="100" y2="45" stroke="#999" stroke-width="1" /> <text x="100" y="58" text-anchor="middle" font-size="12" fill="#999">?</text>
          <line x1="220" y1="35" x2="220" y2="45" stroke="#d97706" stroke-width="2" /> <text x="220" y="58" text-anchor="middle" font-size="14" font-weight="bold" fill="#d97706">B</text>
          <line x1="20" y1="20" x2="100" y2="20" stroke="#666" stroke-width="1" /> <text x="60" y="15" text-anchor="middle" font-size="10" fill="#666">2cm</text>
          <line x1="20" y1="5" x2="220" y2="5" stroke="#666" stroke-width="1" /> <text x="120" y="15" text-anchor="middle" font-size="10" fill="#666">5cm</text>
        </svg>
      </div>
      <p>الحل:</p>
      <p>المقياس 2cm يعني: كل 2cm = 1</p>
      <p>نحسب عدد التدريجات: 5cm ÷ 2cm = 2,5</p>
      <p>إذن <strong>B = 2,5</strong></p>
    </div>

    <h3 style="color: #059669;">🎯 جدول خلاصة: كيفية تمثيل عدد</h3>
    <table border="1" cellpadding="10" style="border-collapse: collapse; width: 100%; border: 2px solid #e5e7eb;">
      <thead>
        <tr style="background-color: #ecfdf5;">
          <th>الخطوة</th>
          <th>الشرح</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>1</td><td>أحدد المبدأ (0)</td></tr>
        <tr><td>2</td><td>أحدد المقياس (المسافة بين تدريجين)</td></tr>
        <tr><td>3</td><td>أضع التدريجات على مسافات متساوية</td></tr>
        <tr><td>4</td><td>أكتب الأعداد تحت كل تدريج</td></tr>
        <tr><td>5</td><td>للعدد العشري، أقسم المسافة بين تدريجين إلى أجزاء متساوية</td></tr>
      </tbody>
    </table>

    <hr style="border-top: 2px dashed #d1d5db; margin: 20px 0;">
    <div style="background-color: #d4edda; padding: 20px; border-radius: 10px; text-align: center; font-size: 1.2em; border: 2px solid #28a745;">
      <p><strong>تذكر دائماً:</strong></p>
      <p>نصف المستقيم المدرّج هو خط الأعداد</p>
      <p>المبدأ هو 0</p>
      <p>المقياس هو المسافة بين تدريجين</p>
      <p>الأعداد تتزايد من اليسار إلى اليمين</p>
    </div>
  `;

  // 4. Create Lesson
  const lesson = await prisma.lesson.create({
    data: {
      title: 'التعليم على نصف مستقيم مدرّج',
      content: lessonContent,
      subjectId: teacher.userDetails!.subjectId!,
      levelId: level.id,
      authorId: teacher.id,
      status: 'published',
      type: 'public',
      exercises: {
        create: [
          // 🟢 تمارين الدعم (70%)
          {
            type: 'support_with_results',
            question: 'التمرين 01: أكمل كتابة الأعداد الناقصة في السلسلة التالية:\n0, 1, 2, [?], 4, [?], 6, [?], 8',
            expectedResults: [
              { question: "1", result: "3", tolerance: 0 },
              { question: "2", result: "5", tolerance: 0 },
              { question: "3", result: "7", tolerance: 0 }
            ],
            displayOrder: 1,
            maxScore: 3
          },
          {
            type: 'support_with_results',
            question: 'التمرين 02: حدد الأعداد المناسبة في الفراغات (المقياس 1cm):\n[?] , [?] , 2 , 3 , [?] , 5 , [?] , [?] , 8',
            expectedResults: [
              { question: "1", result: "0", tolerance: 0 },
              { question: "2", result: "1", tolerance: 0 },
              { question: "3", result: "4", tolerance: 0 },
              { question: "4", result: "6", tolerance: 0 },
              { question: "5", result: "7", tolerance: 0 }
            ],
            displayOrder: 2,
            maxScore: 5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 03: على نصف مستقيم مدرج (المقياس 1cm)، ما هي القيمة العددية للنقاط التالية؟\n1) النقطة A عند التدريجة الثانية بعد الصفر\n2) النقطة B عند التدريجة الخامسة\n3) النقطة C عند التدريجة السابعة',
            expectedResults: [
              { question: "1", result: "2", tolerance: 0 },
              { question: "2", result: "5", tolerance: 0 },
              { question: "3", result: "7", tolerance: 0 }
            ],
            displayOrder: 3,
            maxScore: 3
          },
          {
            type: 'support_with_results',
            question: 'التمرين 04: أوجد العدد الذي تمثله كل نقطة (المقياس 1cm):\n1) النقطة M تبعد 4cm عن 0\n2) النقطة N تبعد 7cm عن 0\n3) النقطة P تبعد 2,5cm عن 0',
            expectedResults: [
              { question: "1", result: "4", tolerance: 0 },
              { question: "2", result: "7", tolerance: 0 },
              { question: "3", result: "2.5", tolerance: 0 }
            ],
            displayOrder: 4,
            maxScore: 3
          },
          {
            type: 'support_only',
            question: 'التمرين 05: (للرسم على الورقة) ارسم نصف مستقيم مدرج (المقياس 4cm) ومثل عليه الأعداد التالية:\n- 0,25 (ربع المسافة)\n- 0,5 (نصف المسافة)\n- 0,75 (ثلاثة أرباع المسافة)',
            displayOrder: 5,
            maxScore: 0
          },
          {
            type: 'support_with_results',
            question: 'التمرين 06: قارن بين الأعداد التالية (اكتب الرمز > أو <):\n1) 3 ... 5\n2) 2,5 ... 2,7\n3) 0,8 ... 0,3\n4) 4,2 ... 4,1',
            expectedResults: [
              { question: "1", result: "<", tolerance: 0 },
              { question: "2", result: "<", tolerance: 0 },
              { question: "3", result: ">", tolerance: 0 },
              { question: "4", result: ">", tolerance: 0 }
            ],
            displayOrder: 6,
            maxScore: 4
          },
          {
            type: 'support_with_results',
            question: 'التمرين 07: على نصف مستقيم، المسافة بين 0 و 3 هي 6cm.\n1) ما هي المسافة بين 0 و 1 (بالـ cm)؟\n2) ما هو المقياس المستعمل (بالـ cm)؟',
            expectedResults: [
              { question: "1", result: "2", tolerance: 0 },
              { question: "2", result: "2", tolerance: 0 }
            ],
            displayOrder: 7,
            maxScore: 2
          },
          // 🔴 التمارين الرئيسية (30%)
          {
            type: 'main',
            question: 'التمرين 08: مسألة شارع المنازل\nشارع طويل عليه منازل مرقمة من 0 إلى 10. المسافة بين منزل وآخر 10 أمتار.\n1) إذا اعتبرنا الشارع نصف مستقيم مدرج (المقياس 1cm = 10m)، كم يبعد المنزل رقم 3 عن البداية (بالأمتار)؟\n2) كم يبعد المنزل رقم 7 عن البداية؟\n3) كم المسافة بين المنزل 7 والمنزل 3؟',
            modelAnswer: '1) المنزل 3 يبعد 3 وحدات. 3 × 10 = 30 متر.\n2) المنزل 7 يبعد 7 وحدات. 7 × 10 = 70 متر.\n3) المسافة بينهما = 70 - 30 = 40 متر (أو 7 - 3 = 4 وحدات، 4 × 10 = 40 متر).',
            displayOrder: 8,
            maxScore: 5
          },
          {
            type: 'main',
            question: 'التمرين 09: مسألة درجات الحرارة\nفي مدينة، سجلت درجات الحرارة التالية: الاثنين 15°، الثلاثاء 18°، الأربعاء 12°، الخميس 20°.\nإذا مثلنا هذه الدرجات على نصف مستقيم مدرج بمقياس (1cm = 2°):\n1) كم تبعد نقطة يوم الاثنين عن الصفر (بالـ cm)؟\n2) كم تبعد نقطة يوم الخميس عن الصفر (بالـ cm)؟\n3) ما هو الفرق في المسافة بين يومي الخميس والأربعاء؟',
            modelAnswer: '1) الاثنين 15°: المسافة = 15 ÷ 2 = 7,5 cm.\n2) الخميس 20°: المسافة = 20 ÷ 2 = 10 cm.\n3) الأربعاء 12° (6cm). الفرق بين الخميس والأربعاء = 10 - 6 = 4 cm (وهو يمثل 8 درجات).',
            displayOrder: 9,
            maxScore: 5
          },
          {
            type: 'main',
            question: 'التمرين 10: لغز نصف المستقيم\nعلى نصف مستقيم مدرّج، النقاط A, B, C, D تحقق:\n- A تمثل العدد 2\n- B تمثل العدد 5\n- C تقع في منتصف المسافة بين A و B\n- D تبعد عن C مسافة 1,5 وحدة باتجاه الأعداد الكبيرة\n\nالمطلوب:\n1) ما هو العدد الذي تمثله النقطة C؟\n2) ما هو العدد الذي تمثله النقطة D؟',
            modelAnswer: '1) C في المنتصف بين 2 و 5. المسافة بينهما 3 وحدات. نصفها 1,5. إذن C = 2 + 1,5 = 3,5.\n2) D تبعد 1,5 عن C (3,5) باتجاه اليمين. إذن D = 3,5 + 1,5 = 5. (ملاحظة: D تنطبق على B).',
            displayOrder: 10,
            maxScore: 5
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