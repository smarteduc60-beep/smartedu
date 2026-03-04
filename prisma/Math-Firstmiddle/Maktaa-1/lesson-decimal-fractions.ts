import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding Lesson: Decimal Fractions ...');

  // 1. Fetch the Teacher
  const teacherEmail = 'ladj14013@gmail.com';
  const teacher = await prisma.user.findUnique({
    where: { email: teacherEmail },
    include: { userDetails: true }
  });

  if (!teacher) {
    console.error(`❌ Teacher ${teacherEmail} not found. Please run 'prisma/seed-math-1cem.ts' first.`);
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
  // We use the teacher's assigned subject to ensure consistency
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

  // Helper for LaTeX fraction
  const frac = (n: string, d: string) => `\\(\\frac{${n}}{${d}}\\)`;

  // 4. Prepare Content (HTML formatted)
  const lessonContent = `
    <div dir="rtl">
      <!-- 1️⃣ وضعية انطلاق -->
      <div style="background-color: #f0f9ff; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <h3>🍫 مشكلة: تقسيم الشوكولاتة في العيد</h3>
        <p>في عيد الفطر المبارك، قامت جدة أحمد بتوزيع الشوكولاتة على أحفادها. لاحظ أحمد أن الجدة قسمت الشوكولاتة بطرق مختلفة:</p>

        <div style="display: flex; justify-content: center; gap: 30px; margin: 30px 0; flex-wrap: wrap;">
          
          <!-- 2/10 -->
          <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
            <div style="background-color: #f8d7da; padding: 10px; border-radius: 10px;">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <rect x="10" y="10" width="100" height="100" fill="white" stroke="#8B4513" stroke-width="2"/>
                <!-- 10 vertical strips -->
                <line x1="20" y1="10" x2="20" y2="110" stroke="#8B4513" stroke-width="1"/>
                <line x1="30" y1="10" x2="30" y2="110" stroke="#8B4513" stroke-width="1"/>
                <line x1="40" y1="10" x2="40" y2="110" stroke="#8B4513" stroke-width="1"/>
                <line x1="50" y1="10" x2="50" y2="110" stroke="#8B4513" stroke-width="1"/>
                <line x1="60" y1="10" x2="60" y2="110" stroke="#8B4513" stroke-width="1"/>
                <line x1="70" y1="10" x2="70" y2="110" stroke="#8B4513" stroke-width="1"/>
                <line x1="80" y1="10" x2="80" y2="110" stroke="#8B4513" stroke-width="1"/>
                <line x1="90" y1="10" x2="90" y2="110" stroke="#8B4513" stroke-width="1"/>
                <line x1="100" y1="10" x2="100" y2="110" stroke="#8B4513" stroke-width="1"/>
                <!-- Color 2 strips -->
                <rect x="10" y="10" width="20" height="100" fill="#f4d03f" opacity="0.8"/>
              </svg>
            </div>
            <p style="margin-top: 10px; font-size: 1.2em;"><strong>${frac('2', '10')}</strong></p>
            <p><span style="background-color: #f4d03f; padding: 5px 10px; border-radius: 20px;">2 أجزاء من 10</span></p>
          </div>

          <!-- 25/100 -->
          <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
            <div style="background-color: #d4edda; padding: 10px; border-radius: 10px;">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <rect x="10" y="10" width="100" height="100" fill="white" stroke="#8B4513" stroke-width="2"/>
                <!-- 10x10 grid pattern -->
                <defs>
                  <pattern id="grid100" width="10" height="10" patternUnits="userSpaceOnUse">
                    <rect width="10" height="10" fill="white" stroke="#8B4513" stroke-width="0.5"/>
                  </pattern>
                </defs>
                <rect x="10" y="10" width="100" height="100" fill="url(#grid100)"/>
                <!-- Color 25 squares (2.5 columns) -->
                <rect x="10" y="10" width="20" height="100" fill="#e67e22" opacity="0.8"/>
                <rect x="30" y="10" width="10" height="50" fill="#e67e22" opacity="0.8"/>
              </svg>
            </div>
            <p style="margin-top: 10px; font-size: 1.2em;"><strong>${frac('25', '100')}</strong></p>
            <p><span style="background-color: #e67e22; padding: 5px 10px; border-radius: 20px; color: white;">25 جزء من 100</span></p>
          </div>

          <!-- 375/1000 -->
          <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
            <div style="background-color: #cce5ff; padding: 10px; border-radius: 10px;">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <rect x="10" y="10" width="100" height="100" fill="white" stroke="#8B4513" stroke-width="2"/>
                <!-- Symbolic representation for 1000 -->
                <text x="60" y="65" text-anchor="middle" font-size="12" fill="#aaa">1000 جزء</text>
                <!-- Color approx 37.5% -->
                <rect x="10" y="10" width="37.5" height="100" fill="#2ecc71" opacity="0.6"/>
                <line x1="10" y1="10" x2="10" y2="110" stroke="#8B4513" stroke-width="2"/>
                <line x1="110" y1="10" x2="110" y2="110" stroke="#8B4513" stroke-width="2"/>
              </svg>
            </div>
            <p style="margin-top: 10px; font-size: 1.2em;"><strong>${frac('375', '1000')}</strong></p>
            <p><span style="background-color: #2ecc71; padding: 5px 10px; border-radius: 20px; color: white;">375 جزء من 1000</span></p>
          </div>

        </div>
        <p>🔍 لاحظ أحمد أن الجدة تكتب أحيانًا: 0,2 - 0,25 - 0,375</p>
        <p><strong>❓ التساؤلات:</strong></p>
        <ul>
          <li>كيف نكتب ${frac('2', '10')} و ${frac('25', '100')} و ${frac('375', '1000')} على شكل أعداد عشرية؟</li>
          <li>ما العلاقة بين عدد الأصفار في المقام والأرقام بعد الفاصلة؟</li>
          <li>كيف ننتقل من الكسر إلى العدد العشري وبالعكس؟</li>
        </ul>
      </div>

      <!-- 2️⃣ مرحلة البحث والاكتشاف -->
      <div style="background-color: #fff9e6; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <h3>🧪 نشاط استكشافي: هيا نكتشف الكسور العشرية!</h3>
        <h4>📌 النشاط 1: من الرسم إلى الكسر</h4>
        <p>لاحظ الأشكال التالية واكتب الكسر الذي يمثل الجزء الملون:</p>

        <div style="display: flex; justify-content: space-around; margin: 30px 0; flex-wrap: wrap;">
          
          <!-- 3/10 -->
          <div style="text-align: center; background: linear-gradient(145deg, #ffffff, #f0f0f0); padding: 20px; border-radius: 15px;">
            <div style="background-color: #e3f2fd; padding: 10px; border-radius: 10px;">
              <svg width="150" height="150" viewBox="0 0 150 150">
                <rect x="25" y="25" width="100" height="100" fill="white" stroke="#1976D2" stroke-width="2"/>
                <!-- 10 vertical strips -->
                <line x1="35" y1="25" x2="35" y2="125" stroke="#1976D2" stroke-width="1"/>
                <line x1="45" y1="25" x2="45" y2="125" stroke="#1976D2" stroke-width="1"/>
                <line x1="55" y1="25" x2="55" y2="125" stroke="#1976D2" stroke-width="1"/>
                <line x1="65" y1="25" x2="65" y2="125" stroke="#1976D2" stroke-width="1"/>
                <line x1="75" y1="25" x2="75" y2="125" stroke="#1976D2" stroke-width="1"/>
                <line x1="85" y1="25" x2="85" y2="125" stroke="#1976D2" stroke-width="1"/>
                <line x1="95" y1="25" x2="95" y2="125" stroke="#1976D2" stroke-width="1"/>
                <line x1="105" y1="25" x2="105" y2="125" stroke="#1976D2" stroke-width="1"/>
                <line x1="115" y1="25" x2="115" y2="125" stroke="#1976D2" stroke-width="1"/>
                <!-- Color 3 strips -->
                <rect x="25" y="25" width="30" height="100" fill="#2196F3" opacity="0.7"/>
                <text x="75" y="145" fill="#1976D2" font-weight="bold" text-anchor="middle">3 أجزاء من 10</text>
              </svg>
            </div>
            <p style="font-size: 1.5em; color: #1976D2; font-weight: bold;">${frac('3', '10')}</p>
          </div>

          <!-- 25/100 -->
          <div style="text-align: center; background: linear-gradient(145deg, #ffffff, #f0f0f0); padding: 20px; border-radius: 15px;">
            <div style="background-color: #fff3e0; padding: 10px; border-radius: 10px;">
              <svg width="150" height="150" viewBox="0 0 150 150">
                <rect x="25" y="25" width="100" height="100" fill="white" stroke="#FF9800" stroke-width="2"/>
                <defs>
                  <pattern id="grid100_2" width="10" height="10" patternUnits="userSpaceOnUse">
                    <rect width="10" height="10" fill="white" stroke="#FF9800" stroke-width="0.5"/>
                  </pattern>
                </defs>
                <rect x="25" y="25" width="100" height="100" fill="url(#grid100_2)"/>
                <!-- Color 25 squares -->
                <rect x="25" y="25" width="20" height="100" fill="#FF9800" opacity="0.7"/>
                <rect x="45" y="25" width="10" height="50" fill="#FF9800" opacity="0.7"/>
                <text x="75" y="145" fill="#FF9800" font-weight="bold" text-anchor="middle">25 جزء من 100</text>
              </svg>
            </div>
            <p style="font-size: 1.5em; color: #FF9800; font-weight: bold;">${frac('25', '100')}</p>
          </div>

          <!-- 375/1000 -->
          <div style="text-align: center; background: linear-gradient(145deg, #ffffff, #f0f0f0); padding: 20px; border-radius: 15px;">
            <div style="background-color: #e8f5e9; padding: 10px; border-radius: 10px;">
              <svg width="150" height="150" viewBox="0 0 150 150">
                <rect x="25" y="25" width="100" height="100" fill="white" stroke="#4CAF50" stroke-width="2"/>
                <text x="75" y="75" text-anchor="middle" font-size="12" fill="#aaa">1000 جزء</text>
                <!-- Color 37.5% -->
                <rect x="25" y="25" width="37.5" height="100" fill="#4CAF50" opacity="0.6"/>
                <text x="75" y="145" fill="#4CAF50" font-weight="bold" text-anchor="middle">375 جزء من 1000</text>
              </svg>
            </div>
            <p style="font-size: 1.5em; color: #4CAF50; font-weight: bold;">${frac('375', '1000')}</p>
          </div>

        </div>

        <h4>📌 النشاط 2: اكتشاف العلاقة مع الأعداد العشرية</h4>
        <div style="background-color: white; padding: 20px; border-radius: 15px; margin: 20px 0;">
          <table style="width: 100%; text-align: center; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #eee;">
              <th style="padding: 10px;">الكسر</th>
              <th style="padding: 10px;">معناه</th>
              <th style="padding: 10px;">الكتابة العشرية</th>
              <th style="padding: 10px;">عدد الأرقام بعد الفاصلة</th>
            </tr>
            <tr>
              <td style="padding: 10px; color: #1976D2; font-size: 1.2em;">${frac('3', '10')}</td>
              <td>3 أجزاء من 10</td>
              <td style="color: #1976D2; font-size: 1.2em;">0,3</td>
              <td><span style="background-color: #1976D2; color: white; padding: 5px 10px; border-radius: 20px;">1 رقم</span></td>
            </tr>
            <tr>
              <td style="padding: 10px; color: #FF9800; font-size: 1.2em;">${frac('25', '100')}</td>
              <td>25 جزء من 100</td>
              <td style="color: #FF9800; font-size: 1.2em;">0,25</td>
              <td><span style="background-color: #FF9800; color: white; padding: 5px 10px; border-radius: 20px;">2 رقمان</span></td>
            </tr>
            <tr>
              <td style="padding: 10px; color: #4CAF50; font-size: 1.2em;">${frac('375', '1000')}</td>
              <td>375 جزء من 1000</td>
              <td style="color: #4CAF50; font-size: 1.2em;">0,375</td>
              <td><span style="background-color: #4CAF50; color: white; padding: 5px 10px; border-radius: 20px;">3 أرقام</span></td>
            </tr>
          </table>
        </div>
        <p><strong>❓ أسئلة موجهة:</strong></p>
        <ul>
          <li>كم رقمًا بعد الفاصلة في العدد 0,3؟ <span style="background-color: #1976D2; color: white; padding: 3px 8px; border-radius: 15px;">رقم واحد</span></li>
          <li>كم صفرًا في المقام 10؟ <span style="background-color: #1976D2; color: white; padding: 3px 8px; border-radius: 15px;">صفر واحد</span></li>
          <li>ماذا تلاحظ؟ <span style="background-color: #4CAF50; color: white; padding: 3px 8px; border-radius: 15px;">عدد الأرقام بعد الفاصلة = عدد الأصفار في المقام</span></li>
        </ul>
      </div>

      <!-- 3️⃣ بناء المفهوم -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
        <h3>📚 الكسور العشرية - التعريف والقواعد</h3>
      </div>
      <div style="background-color: #e3f2fd; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        
        <div style="border-right: 8px solid #1976D2; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h4>🔷 <span style="color: #1976D2;">تعريف الكسر العشري</span></h4>
          <p>الكسر العشري هو كسر مقامه 10 أو 100 أو 1000 أو 10000، ...</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 10px; margin-top: 15px; display: flex; justify-content: center; gap: 20px; align-items: center;">
             ${frac('3', '10')} • ${frac('25', '100')} • ${frac('375', '1000')} • ${frac('7', '10000')}
          </div>
        </div>

        <div style="border-right: 8px solid #c2185b; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h4>🔷 <span style="color: #c2185b;">العلاقة بين الكسر العشري والعدد العشري</span></h4>
          <div style="overflow-x: auto;">
            <table style="width:100%; border-collapse: collapse; text-align: center; font-size: 1.1em;">
              <tr style="background-color: #c2185b; color: white;">
                <th style="padding: 15px;">الكسر العشري</th>
                <th style="padding: 15px;">الكتابة العشرية</th>
                <th style="padding: 15px;">عدد الأرقام بعد الفاصلة</th>
              </tr>
              <tr style="background-color: #f8bbd0;">
                <td style="padding: 12px; font-weight: bold;">${frac('7', '10')}</td>
                <td style="padding: 12px; font-weight: bold;">0,7</td>
                <td style="padding: 12px;">رقم واحد</td>
              </tr>
              <tr style="background-color: #f48fb1;">
                <td style="padding: 12px; font-weight: bold;">${frac('23', '100')}</td>
                <td style="padding: 12px; font-weight: bold;">0,23</td>
                <td style="padding: 12px;">رقمان</td>
              </tr>
              <tr style="background-color: #f06292;">
                <td style="padding: 12px; font-weight: bold;">${frac('459', '1000')}</td>
                <td style="padding: 12px; font-weight: bold;">0,459</td>
                <td style="padding: 12px;">ثلاثة أرقام</td>
              </tr>
              <tr style="background-color: #ec407a;">
                <td style="padding: 12px; font-weight: bold;">${frac('5', '1000')}</td>
                <td style="padding: 12px; font-weight: bold;">0,005</td>
                <td style="padding: 12px;">ثلاثة أرقام</td>
              </tr>
            </table>
          </div>
          <p style="margin-top: 20px; background-color: #fff3cd; padding: 15px; border-radius: 10px; font-size: 1.1em;">
            <strong>✨ القاعدة الذهبية:</strong> عدد الأرقام بعد الفاصلة في العدد العشري يساوي عدد الأصفار في مقام الكسر العشري.
          </p>
        </div>

        <div style="border-right: 8px solid #4CAF50; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h4>🔷 <span style="color: #4CAF50;">تحويل كسر عشري إلى عدد عشري</span></h4>
          <p>الطريقة: نكتب البسط ثم نضع الفاصلة بحيث يكون عدد الأرقام بعدها = عدد أصفار المقام.</p>
          <div style="background: linear-gradient(90deg, #4CAF50 0%, #81C784 100%); padding: 2px; border-radius: 10px;">
            <div style="background-color: white; padding: 15px; border-radius: 8px; display: flex; flex-direction: column; gap: 10px; align-items: center;">
              <p style="font-size: 1.3em;">${frac('3', '10')} = <span style="color: #4CAF50; font-weight: bold;">0,3</span> (رقم واحد بعد الفاصلة)</p>
              <p style="font-size: 1.3em;">${frac('27', '100')} = <span style="color: #4CAF50; font-weight: bold;">0,27</span> (رقمان بعد الفاصلة)</p>
              <p style="font-size: 1.3em;">${frac('5', '100')} = <span style="color: #4CAF50; font-weight: bold;">0,05</span> (نضيف صفرًا)</p>
              <p style="font-size: 1.3em;">${frac('125', '1000')} = <span style="color: #4CAF50; font-weight: bold;">0,125</span> (ثلاثة أرقام)</p>
            </div>
          </div>
        </div>

        <div style="border-right: 8px solid #FF9800; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h4>🔷 <span style="color: #FF9800;">تحويل عدد عشري إلى كسر عشري</span></h4>
          <p>الطريقة: نكتب العدد بدون فاصلة في البسط، ونضع في المقام 1 وبجانبه أصفار بعدد الأرقام العشرية.</p>
          <div style="background: linear-gradient(90deg, #FF9800 0%, #FFB74D 100%); padding: 2px; border-radius: 10px;">
            <div style="background-color: white; padding: 15px; border-radius: 8px; display: flex; flex-direction: column; gap: 10px; align-items: center;">
              <p style="font-size: 1.3em;">0,3 = <span style="color: #FF9800; font-weight: bold;">${frac('3', '10')}</span></p>
              <p style="font-size: 1.3em;">0,27 = <span style="color: #FF9800; font-weight: bold;">${frac('27', '100')}</span></p>
              <p style="font-size: 1.3em;">0,05 = <span style="color: #FF9800; font-weight: bold;">${frac('5', '100')}</span></p>
              <p style="font-size: 1.3em;">0,125 = <span style="color: #FF9800; font-weight: bold;">${frac('125', '1000')}</span></p>
            </div>
          </div>
        </div>
      </div>

      <!-- 4️⃣ تمثيل متعدد للمفهوم -->
      <div style="background: linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
        <h3>🎭 أربع تمثيلات للكسور العشرية</h3>
      </div>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;">
        
        <div style="background: linear-gradient(145deg, #ffffff, #e3f2fd); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <h4 style="color: #1976D2; text-align: center; font-size: 1.5em;">🔢 تمثيل عددي</h4>
          <div style="text-align: center; display: flex; flex-direction: column; gap: 10px; align-items: center;">
            <p style="font-size: 1.3em;">${frac('3', '10')} = 0,3</p>
            <p style="font-size: 1.3em;">${frac('25', '100')} = 0,25</p>
            <p style="font-size: 1.3em;">${frac('375', '1000')} = 0,375</p>
          </div>
        </div>

        <div style="background: linear-gradient(145deg, #ffffff, #ffebee); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <h4 style="color: #c2185b; text-align: center; font-size: 1.5em;">📝 تمثيل لفظي</h4>
          <ul style="font-size: 1.2em; list-style-type: none; padding: 0;">
            <li style="margin: 15px 0;">✓ <strong style="color: #1976D2;">${frac('3', '10')}</strong> : "ثلاثة أعشار"</li>
            <li style="margin: 15px 0;">✓ <strong style="color: #FF9800;">${frac('25', '100')}</strong> : "خمسة وعشرون جزءًا من مئة"</li>
            <li style="margin: 15px 0;">✓ <strong style="color: #4CAF50;">0,375</strong> : "ثلاثمائة وخمسة وسبعون جزءًا من ألف"</li>
          </ul>
        </div>

        <div style="background: linear-gradient(145deg, #ffffff, #e8f5e9); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <h4 style="color: #4CAF50; text-align: center; font-size: 1.5em;">📊 تمثيل هندسي</h4>
          <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
            <div style="text-align: center;">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <rect x="10" y="10" width="60" height="60" fill="white" stroke="#1976D2" stroke-width="2"/>
                <!-- 10 strips -->
                <line x1="16" y1="10" x2="16" y2="70" stroke="#1976D2" stroke-width="0.5"/>
                <line x1="22" y1="10" x2="22" y2="70" stroke="#1976D2" stroke-width="0.5"/>
                <line x1="28" y1="10" x2="28" y2="70" stroke="#1976D2" stroke-width="0.5"/>
                <line x1="34" y1="10" x2="34" y2="70" stroke="#1976D2" stroke-width="0.5"/>
                <line x1="40" y1="10" x2="40" y2="70" stroke="#1976D2" stroke-width="0.5"/>
                <line x1="46" y1="10" x2="46" y2="70" stroke="#1976D2" stroke-width="0.5"/>
                <line x1="52" y1="10" x2="52" y2="70" stroke="#1976D2" stroke-width="0.5"/>
                <line x1="58" y1="10" x2="58" y2="70" stroke="#1976D2" stroke-width="0.5"/>
                <line x1="64" y1="10" x2="64" y2="70" stroke="#1976D2" stroke-width="0.5"/>
                <!-- Color 4 strips -->
                <rect x="10" y="10" width="24" height="60" fill="#1976D2" opacity="0.5"/>
              </svg>
              <p style="color: #1976D2;">${frac('4', '10')}</p>
            </div>
            <div style="text-align: center;">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <rect x="10" y="10" width="60" height="60" fill="white" stroke="#FF9800" stroke-width="2"/>
                <!-- Grid -->
                <defs>
                  <pattern id="grid_small" width="6" height="6" patternUnits="userSpaceOnUse">
                    <rect width="6" height="6" fill="white" stroke="#FF9800" stroke-width="0.5"/>
                  </pattern>
                </defs>
                <rect x="10" y="10" width="60" height="60" fill="url(#grid_small)"/>
                <!-- Color 9 squares (3x3 area) -->
                <rect x="10" y="10" width="18" height="18" fill="#FF9800" opacity="0.5"/>
              </svg>
              <p style="color: #FF9800;">${frac('9', '100')}</p>
            </div>
          </div>
        </div>

        <div style="background: linear-gradient(145deg, #ffffff, #fff3e0); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <h4 style="color: #FF9800; text-align: center; font-size: 1.5em;">📊 تمثيل جدولي</h4>
          <table style="width:100%; border-collapse: collapse; text-align: center;">
            <tr style="background-color: #FF9800; color: white;">
              <th style="padding: 10px;">كسر عشري</th>
              <th style="padding: 10px;">عدد عشري</th>
              <th style="padding: 10px;">قراءة</th>
            </tr>
            <tr style="background-color: #fff3e0;">
              <td style="padding: 8px;">${frac('3', '10')}</td>
              <td style="padding: 8px;">0,3</td>
              <td style="padding: 8px;">ثلاثة أعشار</td>
            </tr>
            <tr style="background-color: #ffe0b2;">
              <td style="padding: 8px;">${frac('27', '100')}</td>
              <td style="padding: 8px;">0,27</td>
              <td style="padding: 8px;">سبعة وعشرون جزءًا من مئة</td>
            </tr>
            <tr style="background-color: #ffcc80;">
              <td style="padding: 8px;">${frac('459', '1000')}</td>
              <td style="padding: 8px;">0,459</td>
              <td style="padding: 8px;">أربعمائة وتسعة وخمسون جزءًا من ألف</td>
            </tr>
          </table>
        </div>

      </div>

      <!-- 5️⃣ أمثلة محلولة تدريجيًا -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 15px; margin: 20px 0;">
        <div style="background-color: white; padding: 20px; border-radius: 10px;">
          <p style="font-size: 1.3em;"><strong style="color: #1976D2;">المطلوب:</strong> اكتب الكسر <span style="background-color: #1976D2; color: white; padding: 5px 10px; border-radius: 20px;">${frac('7', '10')}</span> على شكل عدد عشري</p>
          <div style="display: flex; gap: 30px; align-items: center; flex-wrap: wrap;">
            <div style="flex: 1; text-align: center;">
              <svg width="200" height="80" viewBox="0 0 200 80">
                <rect x="20" y="15" width="160" height="50" fill="white" stroke="black" stroke-width="2"/>
                <!-- 10 strips -->
                <line x1="36" y1="15" x2="36" y2="65" stroke="black" stroke-width="1"/>
                <line x1="52" y1="15" x2="52" y2="65" stroke="black" stroke-width="1"/>
                <line x1="68" y1="15" x2="68" y2="65" stroke="black" stroke-width="1"/>
                <line x1="84" y1="15" x2="84" y2="65" stroke="black" stroke-width="1"/>
                <line x1="100" y1="15" x2="100" y2="65" stroke="black" stroke-width="1"/>
                <line x1="116" y1="15" x2="116" y2="65" stroke="black" stroke-width="1"/>
                <line x1="132" y1="15" x2="132" y2="65" stroke="black" stroke-width="1"/>
                <line x1="148" y1="15" x2="148" y2="65" stroke="black" stroke-width="1"/>
                <line x1="164" y1="15" x2="164" y2="65" stroke="black" stroke-width="1"/>
                <!-- Color 7 strips -->
                <rect x="20" y="15" width="112" height="50" fill="#3498db" opacity="0.6"/>
              </svg>
            </div>
            <div style="flex: 1;">
              <p><strong>الخطوة 1:</strong> نكتب البسط = 7</p>
              <p><strong>الخطوة 2:</strong> نضع الفاصلة بعد رقم واحد (لأن المقام 10)</p>
              <p><strong>النتيجة:</strong> ${frac('7', '10')} = 0,7</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 6️⃣ أخطاء شائعة وتحليلها -->
      <div style="background-color: #ffebee; padding: 25px; border-radius: 15px; margin: 20px 0;">
        <h3>⚠️ لماذا نقع في الخطأ؟ وكيف نتفاداه؟</h3>
        <table border="1" cellpadding="10" style="border-collapse: collapse; width: 100%; text-align: center; background-color: white;">
          <tr><th>الخطأ</th><th>مثاله</th><th>لماذا يحدث؟</th><th>كيف نتفاداه؟</th></tr>
          <tr><td>الخطأ 1</td><td>${frac('5', '100')} = 0,5</td><td>نسيان عدد الأصفار</td><td>نتذكر: عدد الأرقام بعد الفاصلة = عدد أصفار المقام</td></tr>
          <tr><td>الخطأ 2</td><td>0,25 = ${frac('25', '10')}</td><td>عدم حساب عدد الأرقام بشكل صحيح</td><td>نعد الأرقام بعد الفاصلة (2 رقم → مقام 100)</td></tr>
          <tr><td>الخطأ 3</td><td>${frac('7', '1000')} = 0,7</td><td>الخلط بين 100 و 1000</td><td>1000 يتطلب 3 أرقام بعد الفاصلة</td></tr>
          <tr><td>الخطأ 4</td><td>0,03 = ${frac('3', '10')}</td><td>نسيان الصفر في الكتابة</td><td>0,03 = ${frac('3', '100')} (رقمان بعد الفاصلة)</td></tr>
        </table>
        <p><strong>✅ كيف نتحقق من صحة الحل؟</strong></p>
        <ul>
          <li>نقرأ الكسر بالكلمات: 0,05 = "خمسة أجزاء من مئة" وليس "خمسة أعشار"</li>
          <li>نعد الأصفار في المقام = عدد الأرقام بعد الفاصلة</li>
        </ul>
      </div>

      <!-- ✨ خلاصة الدرس -->
      <div style="background-color: #d4edda; padding: 20px; border-radius: 15px; text-align: center; font-size: 1.2em; border: 2px solid #28a745; margin: 30px 0;">
        <h3>📌 ملخص الكسور العشرية</h3>
        <div style="display: flex; justify-content: space-around; margin: 20px 0;">
          <div style="background-color: #e3f2fd; padding: 20px; border-radius: 10px; width: 40%;">
            <h4 style="color: #1976D2;">➡️ كسر ← عدد عشري</h4>
            <p>${frac('7', '10')} = 0,7</p>
            <p>${frac('23', '100')} = 0,23</p>
            <p>${frac('5', '1000')} = 0,005</p>
          </div>
          <div style="background-color: #ffebee; padding: 20px; border-radius: 10px; width: 40%;">
            <h4 style="color: #c2185b;">⬅️ عدد عشري ← كسر</h4>
            <p>0,4 = ${frac('4', '10')}</p>
            <p>0,37 = ${frac('37', '100')}</p>
            <p>0,259 = ${frac('259', '1000')}</p>
          </div>
        </div>
        <p><strong>قاعدة ذهبية:</strong> عدد الأرقام بعد الفاصلة = عدد الأصفار في المقام</p>
      </div>
    </div>
  `;

  // 5. Create Lesson
  const lesson = await prisma.lesson.create({
    data: {
      title: 'الكسور العشرية (الأجزاء من 10، 100، 1000، ...)',
      content: lessonContent,
      subjectId: teacher.userDetails!.subjectId!,
      levelId: level.id,
      authorId: teacher.id,
      status: 'approved',
      published: true, // Ensure the lesson is published
      type: 'public',
      exercises: {
        create: [
          // 🟢 تمارين الدعم (70%)
          {
            type: 'support_with_results',
            question: 'التمرين 01: أكمل الفراغات:\n1) الكسر العشري هو كسر مقامه ...... أو ...... أو ...... أو ......\n2) 3/10 = 0,.....\n3) 47/100 = 0,.....\n4) 5/1000 = 0,.....\n5) 0,39 = ...../100',
            expectedResults: [
              { question: "1", result: "10, 100, 1000, 10000", tolerance: 0 },
              { question: "2", result: "3", tolerance: 0 },
              { question: "3", result: "47", tolerance: 0 },
              { question: "4", result: "005", tolerance: 0 },
              { question: "5", result: "39", tolerance: 0 }
            ],
            displayOrder: 1,
            maxScore: 5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 02: حول الكسور إلى أعداد عشرية:\n1) 7/10\n2) 23/100\n3) 9/100\n4) 51/1000\n5) 3/1000',
            expectedResults: [
              { question: "1", result: "0.7", tolerance: 0 },
              { question: "2", result: "0.23", tolerance: 0 },
              { question: "3", result: "0.09", tolerance: 0 },
              { question: "4", result: "0.051", tolerance: 0 },
              { question: "5", result: "0.003", tolerance: 0 }
            ],
            displayOrder: 2,
            maxScore: 5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 03: حول الأعداد العشرية إلى كسور عشرية (اكتب الكسر على شكل a/b):\n1) 0,4\n2) 0,37\n3) 0,09\n4) 0,125\n5) 0,007',
            expectedResults: [
              { question: "1", result: "4/10", tolerance: 0 },
              { question: "2", result: "37/100", tolerance: 0 },
              { question: "3", result: "9/100", tolerance: 0 },
              { question: "4", result: "125/1000", tolerance: 0 },
              { question: "5", result: "7/1000", tolerance: 0 }
            ],
            displayOrder: 3,
            maxScore: 5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 04: اختر الإجابة الصحيحة (اكتب الرقم فقط):\n1) 5/100 = ... (0.5 / 0.05 / 0.005)\n2) 0,19 = ... (19/10 / 19/100 / 19/1000)\n3) 7/1000 = ... (0.7 / 0.07 / 0.007)\n4) 0,038 = ... (38/100 / 38/1000 / 38/10)\n5) 25/10 = ... (2.5 / 0.25 / 0.025)',
            expectedResults: [
              { question: "1", result: "0.05", tolerance: 0 },
              { question: "2", result: "19/100", tolerance: 0 },
              { question: "3", result: "0.007", tolerance: 0 },
              { question: "4", result: "38/1000", tolerance: 0 },
              { question: "5", result: "2.5", tolerance: 0 }
            ],
            displayOrder: 4,
            maxScore: 5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 05: رتب الكسور العشرية تصاعدياً (استخدم الرمز < ):\n0,3 - 0,25 - 0,375 - 0,5 - 0,125',
            expectedResults: [
              { question: "1", result: "0.125 < 0.25 < 0.3 < 0.375 < 0.5", tolerance: 0 }
            ],
            displayOrder: 5,
            maxScore: 5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 06: أكمل التحويلات في الجدول:\n1) 29/100 = ...\n2) 0,063 = .../1000\n3) 5/1000 = ...\n4) 0,205 = .../1000',
            expectedResults: [
              { question: "1", result: "0.29", tolerance: 0 },
              { question: "2", result: "63", tolerance: 0 },
              { question: "3", result: "0.005", tolerance: 0 },
              { question: "4", result: "205", tolerance: 0 }
            ],
            displayOrder: 6,
            maxScore: 4
          },
          {
            type: 'support_with_results',
            question: 'التمرين 07: ارسم مستطيلًا مقسمًا إلى 10 أجزاء متساوية، ثم لون الأجزاء التي تمثل الكسر 4/10.\nكم جزءاً يجب تلوينه؟',
            expectedResults: [
              { question: "1", result: "4", tolerance: 0 }
            ],
            displayOrder: 7,
            maxScore: 2
          },
          // 🔴 التمارين الرئيسية (30%)
          {
            type: 'main',
            question: 'التمرين 08: مشكلة توزيع الشوكولاتة\nاشترت الأم 3 قطع متطابقة من الشوكولاتة. أكلت الابنة الكبرى 0,4 من قطعة، وأكل الابن الأوسط 3/10 من قطعة، وأكل الصغير 40/100 من قطعة.\n\nالمطلوب:\n1) اكتب ما أكله كل ابن على شكل كسر عشري.\n2) اكتب ما أكله كل ابن على شكل عدد عشري.\n3) قارن بين الكميات التي أكلها الأبناء. من أكل أكثر؟',
            modelAnswer: '1) الابنة الكبرى: 4/10، الابن الأوسط: 3/10، الصغير: 40/100.\n2) الابنة الكبرى: 0,4، الابن الأوسط: 0,3، الصغير: 0,40 = 0,4.\n3) الابنة الكبرى والصغير أكلا نفس الكمية (0,4)، والابن الأوسط أكل أقل (0,3).',
            displayOrder: 8,
            maxScore: 5
          },
          {
            type: 'main',
            question: 'التمرين 09: مسألة قياس الأطوال\nقام التلاميذ بقياس أطوال أقلامهم:\n- قلم أحمد: 0,15 m\n- قلم سارة: 15/100 m\n- قلم كريم: 150/1000 m\n\nالمطلوب:\n1) هل الأقلام متساوية في الطول؟ برر إجابتك.\n2) رتب الأقلام من الأطول إلى الأقصر.',
            modelAnswer: '1) نعم، الأقلام متساوية في الطول. التبرير: 0,15 = 15/100 = 150/1000.\n2) جميعها متساوية.',
            displayOrder: 9,
            maxScore: 5
          },
          {
            type: 'main',
            question: 'التمرين 10: التحدي الكبير - الكسر المفقود\nفي كل حالة، العدد الناقص يمثل كسرًا عشريًا. أكمل الجدول:\n1) 7/10 = 0,7\n2) 25/⬜ = 0,25\n3) ⬜/100 = 0,37\n4) 8/1000 = ⬜\n5) ⬜/1000 = 0,045',
            modelAnswer: '2) 100\n3) 37\n4) 0,008\n5) 45',
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