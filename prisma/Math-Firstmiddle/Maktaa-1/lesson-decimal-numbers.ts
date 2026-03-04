import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding Lesson: Decimal Numbers ...');

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
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
        <h3>🏪 مشكلة: شراء الفواكه من السوق</h3>
        <p>ذهب أحمد مع والدته إلى السوق لشراء الفواكه. طلبت منه الأم أن يشتري:</p>
        <ul>
          <li><span style="background-color: rgba(255,255,255,0.2); padding: 5px 10px; border-radius: 20px;">2 كيلوغرام ونصف</span> من التفاح</li>
          <li><span style="background-color: rgba(255,255,255,0.2); padding: 5px 10px; border-radius: 20px;">ربع كيلوغرام</span> من الفراولة</li>
          <li><span style="background-color: rgba(255,255,255,0.2); padding: 5px 10px; border-radius: 20px;">ثلاثة أرباع كيلوغرام</span> من الموز</li>
        </ul>
      </div>

      <div style="display: flex; justify-content: center; gap: 30px; margin: 30px 0; flex-wrap: wrap;">
        <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <div style="background-color: #ffcdd2; padding: 15px; border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
            <span style="font-size: 2.5em;">🍎</span>
          </div>
          <p style="font-weight: bold;">تفاح</p>
          <p style="background-color: #1976D2; color: white; padding: 5px 15px; border-radius: 20px;">2 كغ ونصف</p>
        </div>
        <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <div style="background-color: #ffebee; padding: 15px; border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
            <span style="font-size: 2.5em;">🍓</span>
          </div>
          <p style="font-weight: bold;">فراولة</p>
          <p style="background-color: #c2185b; color: white; padding: 5px 15px; border-radius: 20px;">ربع كغ</p>
        </div>
        <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <div style="background-color: #fff3e0; padding: 15px; border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
            <span style="font-size: 2.5em;">🍌</span>
          </div>
          <p style="font-weight: bold;">موز</p>
          <p style="background-color: #FF9800; color: white; padding: 5px 15px; border-radius: 20px;">ثلاثة أرباع كغ</p>
        </div>
      </div>

      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; margin: 20px 0;">
        <p>🔍 لاحظ أحمد أن البقال يكتب هذه الكميات بطريقة مختلفة على الفواتير:</p>
        <div style="display: flex; justify-content: center; gap: 20px; margin-top: 10px;">
          <span style="background-color: #1976D2; color: white; padding: 5px 15px; border-radius: 20px;">2,5 kg</span>
          <span style="background-color: #c2185b; color: white; padding: 5px 15px; border-radius: 20px;">0,25 kg</span>
          <span style="background-color: #FF9800; color: white; padding: 5px 15px; border-radius: 20px;">0,75 kg</span>
        </div>
        <p><strong>❓ التساؤلات:</strong></p>
        <ul>
          <li>ما هذه الأعداد التي تحتوي على فاصلة؟</li>
          <li>كيف نقرأها؟ وماذا تعني؟</li>
          <li>كيف نكتب "نصف" و"ربع" و"ثلاثة أرباع" بهذه الطريقة؟</li>
        </ul>
      </div>

      <!-- 2️⃣ مرحلة البحث والاكتشاف -->
      <div style="background-color: #fff9e6; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <h3>🧪 نشاط استكشافي: هيا نكتشف الأعداد العشرية!</h3>
        <h4>📌 النشاط 1: من الرسم إلى العدد</h4>
        <p>لاحظ الأشرطة الملونة التالية:</p>

        <div style="display: flex; flex-direction: column; gap: 30px; margin: 30px 0;">
          <div style="display: flex; align-items: center; gap: 30px; flex-wrap: wrap;">
            <div style="flex: 1; text-align: center;">
              <svg width="250" height="60" viewBox="0 0 250 60">
                <rect x="20" y="15" width="200" height="30" fill="none" stroke="#1976D2" stroke-width="3" rx="5"/>
                <line x1="40" y1="15" x2="40" y2="45" stroke="#1976D2" stroke-width="2"/>
                <line x1="60" y1="15" x2="60" y2="45" stroke="#1976D2" stroke-width="2"/>
                <line x1="80" y1="15" x2="80" y2="45" stroke="#1976D2" stroke-width="2"/>
                <line x1="100" y1="15" x2="100" y2="45" stroke="#1976D2" stroke-width="2"/>
                <line x1="120" y1="15" x2="120" y2="45" stroke="#1976D2" stroke-width="2"/>
                <line x1="140" y1="15" x2="140" y2="45" stroke="#1976D2" stroke-width="2"/>
                <line x1="160" y1="15" x2="160" y2="45" stroke="#1976D2" stroke-width="2"/>
                <line x1="180" y1="15" x2="180" y2="45" stroke="#1976D2" stroke-width="2"/>
                <line x1="200" y1="15" x2="200" y2="45" stroke="#1976D2" stroke-width="2"/>
                <rect x="20" y="15" width="100" height="30" fill="#1976D2" opacity="0.5"/>
              </svg>
            </div>
            <div style="flex: 1; background-color: white; padding: 15px; border-radius: 10px;">
              <p><strong>الشريط مقسم إلى 10 أجزاء متساوية</strong></p>
              <p>الجزء الملون: <span style="background-color: #1976D2; color: white; padding: 5px 10px; border-radius: 20px;">5 أجزاء</span></p>
              <p>نكتب: <span style="font-size: 1.5em; color: #1976D2;">${frac('5', '10')}</span></p>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 30px; flex-wrap: wrap;">
            <div style="flex: 1; text-align: center;">
              <svg width="250" height="60" viewBox="0 0 250 60">
                <rect x="20" y="15" width="200" height="30" fill="none" stroke="#FF9800" stroke-width="3" rx="5"/>
                <line x1="40" y1="15" x2="40" y2="45" stroke="#FF9800" stroke-width="2"/>
                <line x1="60" y1="15" x2="60" y2="45" stroke="#FF9800" stroke-width="2"/>
                <line x1="80" y1="15" x2="80" y2="45" stroke="#FF9800" stroke-width="2"/>
                <line x1="100" y1="15" x2="100" y2="45" stroke="#FF9800" stroke-width="2"/>
                <line x1="120" y1="15" x2="120" y2="45" stroke="#FF9800" stroke-width="2"/>
                <line x1="140" y1="15" x2="140" y2="45" stroke="#FF9800" stroke-width="2"/>
                <line x1="160" y1="15" x2="160" y2="45" stroke="#FF9800" stroke-width="2"/>
                <line x1="180" y1="15" x2="180" y2="45" stroke="#FF9800" stroke-width="2"/>
                <line x1="200" y1="15" x2="200" y2="45" stroke="#FF9800" stroke-width="2"/>
                <rect x="20" y="15" width="50" height="30" fill="#FF9800" opacity="0.5"/>
              </svg>
            </div>
            <div style="flex: 1; background-color: white; padding: 15px; border-radius: 10px;">
              <p><strong>الشريط مقسم إلى 10 أجزاء متساوية</strong></p>
              <p>الجزء الملون: <span style="background-color: #FF9800; color: white; padding: 5px 10px; border-radius: 20px;">2.5 أجزاء</span></p>
              <p>نكتب: <span style="font-size: 1.5em; color: #FF9800;">2,5</span></p>
            </div>
          </div>
        </div>

        <h4>📌 النشاط 2: اكتشاف الفاصلة</h4>
        <div style="background-color: white; padding: 20px; border-radius: 15px; margin: 20px 0;">
          <table style="width: 100%; text-align: center; border-collapse: collapse;">
            <tr><th>العدد</th><th>الجزء الصحيح</th><th>الفاصلة</th><th>الجزء العشري</th><th>نقرأ</th></tr>
            <tr><td style="color: #1976D2; font-size: 1.3em;">2,5</td><td>2</td><td>,</td><td>5</td><td>اثنان فاصل خمسة</td></tr>
            <tr><td style="color: #c2185b; font-size: 1.3em;">0,25</td><td>0</td><td>,</td><td>25</td><td>صفر فاصل خمسة وعشرون</td></tr>
            <tr><td style="color: #4CAF50; font-size: 1.3em;">3,75</td><td>3</td><td>,</td><td>75</td><td>ثلاثة فاصل خمسة وسبعون</td></tr>
          </table>
        </div>
        <p><strong>❓ أسئلة موجهة:</strong></p>
        <ul>
          <li>ماذا تفصل الفاصلة؟ <span style="background-color: #1976D2; color: white; padding: 3px 8px; border-radius: 15px;">تفصل بين الجزء الصحيح والجزء العشري</span></li>
          <li>ماذا يعني الجزء العشري؟ <span style="background-color: #FF9800; color: white; padding: 3px 8px; border-radius: 15px;">أجزاء أصغر من الواحد</span></li>
          <li>كيف نقرأ الأعداد العشرية؟ <span style="background-color: #4CAF50; color: white; padding: 3px 8px; border-radius: 15px;">نقرأ الجزء الصحيح ثم "فاصل" ثم الجزء العشري</span></li>
        </ul>
      </div>

      <!-- 3️⃣ بناء المفهوم -->
      <div style="background: linear-gradient(135deg, #43C6AC 0%, #191654 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
        <h3>📚 العدد العشري والكتابة العشرية</h3>
      </div>
      <div style="background-color: #e3f2fd; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="border-right: 8px solid #1976D2; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h4>🔷 <span style="color: #1976D2;">تعريف العدد العشري</span></h4>
          <p>العدد العشري هو عدد يتكون من جزأين يفصل بينهما فاصلة:</p>
          <ul>
            <li>الجزء الصحيح: على يسار الفاصلة (يمكن أن يكون 0)</li>
            <li>الجزء العشري: على يمين الفاصلة (يمثل أجزاء من الوحدة)</li>
          </ul>
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 15px; margin-top: 20px; text-align: center;">
            <span style="background-color: #1976D2; color: white; font-size: 2.5em; padding: 15px 30px; border-radius: 50px;">2<span style="background-color: white; color: #1976D2; padding: 0 10px;">,</span>5</span>
            <div style="display: flex; justify-content: center; gap: 50px; margin-top: 20px;">
              <span style="background-color: #1976D2; color: white; padding: 10px 20px; border-radius: 30px;">الجزء الصحيح: 2</span>
              <span style="background-color: #FF9800; color: white; padding: 10px 20px; border-radius: 30px;">الجزء العشري: 5</span>
            </div>
          </div>
        </div>

        <div style="border-right: 8px solid #c2185b; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h4>🔷 <span style="color: #c2185b;">جدول المنازل العشرية</span></h4>
          <div style="overflow-x: auto;">
            <table style="width:100%; border-collapse: collapse; text-align: center; font-size: 1.1em;">
              <tr style="background-color: #c2185b; color: white;">
              <th style="padding: 15px;">}أجزاء من ألف</th>
              <th style="padding: 15px;">}أجزاء من مئة</th>
              <th style="padding: 15px;">}أعشار</th>
              <th style="padding: 15px; background-color: #1976D2;">,</th>
              <th style="padding: 15px;">آحاد</th>
              <th style="padding: 15px;">عشرات</th>
              <th style="padding: 15px;">مئات</th>
              <th style="padding: 15px;">...</th>
              </tr>
              <tr style="background-color: #f8bbd0;">
                <td></td>
                <td></td>                
                <td>5</td>
                <td style="background-color: #bbdefb;">,</td>
                <td>2</td>
                <td>1</td>
                <td></td>
                <td></td>
              </tr>
              <tr style="background-color: #f48fb1;">
                <td></td>
                <td>2</td>
                <td>5</td>
                <td style="background-color: #bbdefb;">,</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr style="background-color: #f06292;">
                <td>7</td>
                <td>5</td>
                <td>2</td>
                <td style="background-color: #bbdefb;">,</td>
                <td>1</td>
                <td>0</td>
                <td>3</td>
                <td></td>
              </tr>
            </table>
          </div>
        </div>

        <div style="border-right: 8px solid #4CAF50; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h4>🔷 <span style="color: #4CAF50;">قراءة الأعداد العشرية</span></h4>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
            <div style="background-color: #e8f5e9; padding: 15px; border-radius: 10px;">
              <p style="font-size: 1.3em; text-align: center;"><strong>12,5</strong></p>
              <p>✓ <span style="color: #1976D2;">الجزء الصحيح: 12</span></p>
              <p>✓ <span style="color: #FF9800;">الجزء العشري: 5</span></p>
              <p>📖 نقرأ: <strong>"اثنا عشر فاصل خمسة"</strong></p>
            </div>
            <div style="background-color: #e8f5e9; padding: 15px; border-radius: 10px;">
              <p style="font-size: 1.3em; text-align: center;"><strong>0,04</strong></p>
              <p>✓ <span style="color: #1976D2;">الجزء الصحيح: 0</span></p>
              <p>✓ <span style="color: #FF9800;">الجزء العشري: 04</span></p>
              <p>📖 نقرأ: <strong>"صفر فاصل صفر أربعة"</strong></p>
            </div>
            <div style="grid-column: span 2; background-color: #e8f5e9; padding: 15px; border-radius: 10px;">
              <p style="font-size: 1.3em; text-align: center;"><strong>103,752</strong></p>
              <p>✓ <span style="color: #1976D2;">الجزء الصحيح: 103</span></p>
              <p>✓ <span style="color: #FF9800;">الجزء العشري: 752</span></p>
              <p>📖 نقرأ: <strong>"مئة وثلاثة فاصل سبعمائة واثنان وخمسون"</strong></p>
            </div>
          </div>
        </div>

        <div style="border-right: 8px solid #FF9800; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h4>🔷 <span style="color: #FF9800;">العلاقة مع الكسور العشرية</span></h4>
          <p>كل عدد عشري يمكن كتابته على شكل كسر عشري (مقامه 10، 100، 1000، ...)</p>
          <div style="background: linear-gradient(90deg, #FF9800 0%, #FFB74D 100%); padding: 2px; border-radius: 10px;">
            <div style="background-color: white; padding: 20px; border-radius: 8px;">
              <div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
                <div><span style="background-color: #1976D2; color: white; padding: 8px 15px; border-radius: 30px;">3,7</span> = <span style="background-color: #1976D2; color: white; padding: 8px 15px; border-radius: 30px;">${frac('37', '10')}</span></div>
                <div><span style="background-color: #c2185b; color: white; padding: 8px 15px; border-radius: 30px;">0,15</span> = <span style="background-color: #c2185b; color: white; padding: 8px 15px; border-radius: 30px;">${frac('15', '100')}</span></div>
                <div><span style="background-color: #4CAF50; color: white; padding: 8px 15px; border-radius: 30px;">2,05</span> = <span style="background-color: #4CAF50; color: white; padding: 8px 15px; border-radius: 30px;">${frac('205', '100')}</span></div>
                <div><span style="background-color: #FF9800; color: white; padding: 8px 15px; border-radius: 30px;">0,008</span> = <span style="background-color: #FF9800; color: white; padding: 8px 15px; border-radius: 30px;">${frac('8', '1000')}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4️⃣ تمثيل متعدد للمفهوم -->
      <div style="background: linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
        <h3>🎭 أربع تمثيلات للأعداد العشرية</h3>
      </div>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;">
        <div style="background: linear-gradient(145deg, #ffffff, #e3f2fd); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <h4 style="color: #1976D2; text-align: center; font-size: 1.5em;">🔢 تمثيل عددي</h4>
          <div style="text-align: center;">
            <p style="font-size: 1.5em;"><span style="background-color: #1976D2; color: white; padding: 8px 15px; border-radius: 30px;">12,5</span></p>
            <p style="font-size: 1.5em;"><span style="background-color: #FF9800; color: white; padding: 8px 15px; border-radius: 30px;">0,75</span></p>
            <p style="font-size: 1.5em;"><span style="background-color: #4CAF50; color: white; padding: 8px 15px; border-radius: 30px;">3,14</span></p>
          </div>
        </div>
        <div style="background: linear-gradient(145deg, #ffffff, #ffebee); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <h4 style="color: #c2185b; text-align: center; font-size: 1.5em;">📝 تمثيل لفظي</h4>
          <ul style="font-size: 1.2em; list-style-type: none; padding: 0;">
            <li style="margin: 15px 0;">✓ <strong style="color: #1976D2;">12,5</strong> : "اثنا عشر فاصل خمسة"</li>
            <li style="margin: 15px 0;">✓ <strong style="color: #FF9800;">0,75</strong> : "صفر فاصل خمسة وسبعون"</li>
            <li style="margin: 15px 0;">✓ <strong style="color: #4CAF50;">3,14</strong> : "ثلاثة فاصل أربعة عشر"</li>
          </ul>
        </div>
        <div style="background: linear-gradient(145deg, #ffffff, #e8f5e9); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <h4 style="color: #4CAF50; text-align: center; font-size: 1.5em;">📊 تمثيل هندسي</h4>
          <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
            <div style="text-align: center;">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <rect x="10" y="10" width="60" height="60" fill="white" stroke="#1976D2" stroke-width="3"/>
                <line x1="10" y1="40" x2="70" y2="40" stroke="#1976D2" stroke-width="2"/>
                <rect x="10" y="10" width="30" height="60" fill="#1976D2" opacity="0.5"/>
              </svg>
              <p style="color: #1976D2;">0,5</p>
            </div>
            <div style="text-align: center;">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <rect x="10" y="10" width="60" height="60" fill="white" stroke="#FF9800" stroke-width="3"/>
                <line x1="10" y1="25" x2="70" y2="25" stroke="#FF9800"/>
                <line x1="10" y1="40" x2="70" y2="40" stroke="#FF9800"/>
                <line x1="10" y1="55" x2="70" y2="55" stroke="#FF9800"/>
                <rect x="10" y="10" width="15" height="60" fill="#FF9800" opacity="0.5"/>
              </svg>
              <p style="color: #FF9800;">0,25</p>
            </div>
          </div>
        </div>
        <div style="background: linear-gradient(145deg, #ffffff, #fff3e0); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <h4 style="color: #FF9800; text-align: center; font-size: 1.5em;">📊 تمثيل جدولي</h4>
          <table style="width:100%; border-collapse: collapse; text-align: center;">
            <tr style="background-color: #FF9800; color: white;">
              <th style="padding: 10px;">عدد عشري</th>
              <th style="padding: 10px;">كسر عشري</th>
            </tr>
            <tr style="background-color: #fff3e0;">
              <td>0,5</td><td>${frac('5', '10')}</td>
            </tr>
            <tr style="background-color: #ffe0b2;">
              <td>0,25</td><td>${frac('25', '100')}</td>
            </tr>
            <tr style="background-color: #ffcc80;">
              <td>0,375</td><td>${frac('375', '1000')}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- 5️⃣ أمثلة محلولة تدريجيًا -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 15px; margin: 20px 0;">
        <div style="background-color: white; padding: 20px; border-radius: 10px;">
          <p style="font-size: 1.3em;"><strong style="color: #1976D2;">المطلوب:</strong> حدد الجزء الصحيح والجزء العشري للعدد <span style="background-color: #1976D2; color: white; padding: 5px 10px; border-radius: 20px;">25,7</span></p>
          <div style="display: flex; gap: 30px; align-items: center; flex-wrap: wrap;">
            <div style="flex: 1; text-align: center;">
              <svg width="200" height="100" viewBox="0 0 200 100">
                <rect x="30" y="30" width="60" height="40" fill="#1976D2" rx="5"/>
                <text x="50" y="55" fill="white" font-size="20">25</text>
                <rect x="100" y="30" width="60" height="40" fill="#FF9800" rx="5"/>
                <text x="125" y="55" fill="white" font-size="20">7</text>
                <text x="85" y="55" fill="black" font-size="25">,</text>
              </svg>
            </div>
            <div style="flex: 1;">
              <p><strong style="color: #1976D2;">🔍 التفكير:</strong> الفاصلة تفصل بين الجزأين</p>
              <p><strong style="color: #1976D2;">الخطوة 1:</strong> ما على يسار الفاصلة؟ <span style="background-color: #1976D2; color: white; padding: 5px 10px; border-radius: 20px;">25</span></p>
              <p><strong style="color: #1976D2;">الخطوة 2:</strong> ما على يمين الفاصلة؟ <span style="background-color: #FF9800; color: white; padding: 5px 10px; border-radius: 20px;">7</span></p>
              <p style="font-size: 1.3em; text-align: center;">
                <span style="background-color: #1976D2; color: white; padding: 8px 15px; border-radius: 30px;">الجزء الصحيح = 25</span>
                <span style="background-color: #FF9800; color: white; padding: 8px 15px; border-radius: 30px;">الجزء العشري = 7</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style="background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%); padding: 20px; border-radius: 15px; margin: 20px 0;">
        <div style="background-color: white; padding: 20px; border-radius: 10px;">
          <p style="font-size: 1.3em;"><strong style="color: #FF9800;">المطلوب:</strong> اكتب العدد <span style="background-color: #FF9800; color: white; padding: 5px 10px; border-radius: 20px;">${frac('23', '10')}</span> على شكل عدد عشري</p>
          <div style="display: flex; gap: 30px; align-items: center; flex-wrap: wrap;">
            <div style="flex: 1; text-align: center;">
              <svg width="200" height="100" viewBox="0 0 200 100">
                <rect x="20" y="20" width="150" height="50" fill="none" stroke="#FF9800" stroke-width="3"/>
                <line x1="20" y1="45" x2="170" y2="45" stroke="#FF9800" stroke-width="2"/>
                <text x="85" y="15" fill="#FF9800">10 أجزاء</text>
              </svg>
            </div>
            <div style="flex: 1;">
              <p><strong style="color: #FF9800;">🔍 التفكير:</strong> الكسر ${frac('23', '10')} يعني 23 جزءًا من 10</p>
              <p><strong style="color: #FF9800;">الخطوة 1:</strong> 10 أجزاء تكون وحدة كاملة</p>
              <p><strong style="color: #FF9800;">الخطوة 2:</strong> ${frac('20', '10')} = 2 وحدات كاملة، وبقي ${frac('3', '10')}</p>
              <p><strong style="color: #FF9800;">النتيجة:</strong> ${frac('23', '10')} = 2 + 0,3 = <span style="background-color: #FF9800; color: white; padding: 8px 15px; border-radius: 30px; font-size: 1.5em;">2,3</span></p>
            </div>
          </div>
        </div>
      </div>

      <div style="background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%); padding: 20px; border-radius: 15px; margin: 20px 0;">
        <div style="background-color: white; padding: 20px; border-radius: 10px;">
          <p style="font-size: 1.3em;"><strong style="color: #4CAF50;">المطلوب:</strong> اكتب العدد <span style="background-color: #4CAF50; color: white; padding: 5px 10px; border-radius: 20px;">0,05</span> على شكل كسر عشري</p>
          <div style="display: flex; gap: 30px; align-items: center; flex-wrap: wrap;">
            <div style="flex: 1; text-align: center;">
              <svg width="200" height="100" viewBox="0 0 200 100">
                <rect x="20" y="20" width="150" height="50" fill="none" stroke="#4CAF50" stroke-width="3"/>
                <rect x="20" y="20" width="7.5" height="50" fill="#4CAF50" opacity="0.5"/>
                <text x="85" y="85" fill="#4CAF50">5 أجزاء من 100</text>
              </svg>
            </div>
            <div style="flex: 1;">
              <p><strong style="color: #4CAF50;">🔍 تحليل:</strong> العدد 0,05 به رقمان بعد الفاصلة</p>
              <p><strong style="color: #4CAF50;">الخطوة 1:</strong> نكتب العدد بدون فاصلة: <span style="background-color: #4CAF50; color: white; padding: 5px 10px; border-radius: 20px;">005</span></p>
              <p><strong style="color: #4CAF50;">الخطوة 2:</strong> عدد الأرقام بعد الفاصلة = 2، إذن المقام = 100</p>
              <p><strong style="color: #4CAF50;">النتيجة:</strong> 0,05 = <span style="background-color: #4CAF50; color: white; padding: 8px 15px; border-radius: 30px; font-size: 1.5em;">${frac('5', '100')}</span></p>
            </div>
          </div>
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 10px; margin-top: 20px;">
            <strong>⚠️ مهم جدًا:</strong> 0,05 ≠ 0,5 !
            <div style="display: flex; justify-content: center; gap: 30px; margin-top: 10px;">
              <span style="background-color: #4CAF50; color: white; padding: 5px 10px; border-radius: 20px;">0,05 = ${frac('5', '100')}</span>
              <span style="background-color: #1976D2; color: white; padding: 5px 10px; border-radius: 20px;">0,5 = ${frac('5', '10')}</span>
            </div>
          </div>
        </div>
      </div>

      <div style="background: linear-gradient(135deg, #9C27B0 0%, #6A1B9A 100%); padding: 20px; border-radius: 15px; margin: 20px 0;">
        <div style="background-color: white; padding: 20px; border-radius: 10px;">
          <p style="font-size: 1.3em;"><strong style="color: #9C27B0;">الوضعية:</strong> اشترت سارة <span style="background-color: #9C27B0; color: white; padding: 5px 10px; border-radius: 20px;">1,5 kg</span> من التفاح و <span style="background-color: #9C27B0; color: white; padding: 5px 10px; border-radius: 20px;">0,750 kg</span> من الموز.</p>
          <div style="display: flex; gap: 30px; align-items: center; flex-wrap: wrap;">
            <div style="flex: 1; text-align: center;">
              <svg width="200" height="100" viewBox="0 0 200 100">
                <rect x="20" y="20" width="75" height="40" fill="#9C27B0" rx="5"/>
                <text x="50" y="45" fill="white">1,5 kg</text>
                <rect x="105" y="20" width="40" height="40" fill="#9C27B0" rx="5"/>
                <text x="115" y="45" fill="white">0,75</text>
              </svg>
            </div>
            <div style="flex: 1;">
              <p><strong style="color: #9C27B0;">🔍 التفكير:</strong> 1,5 يعني 1 وحدة كاملة ونصف</p>
              <p><strong style="color: #9C27B0;">الخطوة 1:</strong> 1,5 = 1 + 0,5 = 1 + ${frac('5', '10')}</p>
              <p><strong style="color: #9C27B0;">الخطوة 2:</strong> 0,750 = ${frac('750', '1000')} = ${frac('75', '100')} = ${frac('3', '4')}</p>
              <p><strong style="color: #9C27B0;">النتيجة:</strong> اشتريت 1 كغ ونصف تفاح، وثلاثة أرباع كيلو موز</p>
            </div>
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
              <td style="padding: 15px;">قراءة 0,25 كـ "خمسة وعشرون"</td>
              <td style="padding: 15px;">نسيان أن الجزء العشري أجزاء من الوحدة</td>
              <td style="padding: 15px;">نتذكر: 0,25 = ${frac('25', '100')} (خمسة وعشرون جزءًا من مئة)</td>
            </tr>
            <tr style="background-color: #ef9a9a;">
              <td style="padding: 15px; font-weight: bold;">الخطأ 2</td>
              <td style="padding: 15px;">كتابة ${frac('5', '100')} = 0,5</td>
              <td style="padding: 15px;">الخلط بين عدد الأصفار في المقام</td>
              <td style="padding: 15px;">نتذكر: عدد الأرقام بعد الفاصلة = عدد أصفار المقام</td>
            </tr>
            <tr style="background-color: #e57373;">
              <td style="padding: 15px; font-weight: bold;">الخطأ 3</td>
              <td style="padding: 15px;">0,04 يقرأ "صفر فاصل أربعة"</td>
              <td style="padding: 15px;">إهمال الصفر في الجزء العشري</td>
              <td style="padding: 15px;">نقرأ كل الأرقام: "صفر فاصل صفر أربعة"</td>
            </tr>
            <tr style="background-color: #ef5350;">
              <td style="padding: 15px; font-weight: bold;">الخطأ 4</td>
              <td style="padding: 15px;">2,5 = ${frac('25', '10')}</td>
              <td style="padding: 15px;">نسيان أن 2,5 = 2 + 0,5</td>
              <td style="padding: 15px;">2,5 = ${frac('25', '10')} = ${frac('5', '2')} (صحيح) لكن 2,5 ≠ ${frac('25', '100')}</td>
            </tr>
          </table>
        </div>
        <div style="background-color: #c8e6c9; padding: 20px; border-radius: 10px; margin-top: 20px;">
          <p>✅ كيف نتحقق من صحة الحل؟</p>
          <ul style="font-size: 1.1em;">
            <li>✓ نستخدم جدول المنازل لكتابة الأعداد بشكل صحيح</li>
            <li>✓ نقرأ العدد بصوت عالٍ ونتأكد من فهم المعنى</li>
            <li>✓ نكتب العدد على شكل كسر عشري ونتحقق من المقام</li>
            <li>✓ نستخدم خط الأعداد لتحديد موقع العدد</li>
          </ul>
        </div>
      </div>

      <!-- ✨ خلاصة الدرس -->
      <div style="background: linear-gradient(135deg, #43C6AC 0%, #191654 100%); padding: 30px; border-radius: 15px; margin: 30px 0; text-align: center; color: white;">
        <h3>📌 ملخص العدد العشري والكتابة العشرية</h3>
        <div style="display: flex; justify-content: space-around; margin: 30px 0; flex-wrap: wrap;">
          <div style="background-color: rgba(255,255,255,0.9); padding: 25px; border-radius: 15px; width: 40%; margin: 10px;">
            <h3 style="color: #1976D2;">🔢 بنية العدد العشري</h3>
            <p style="font-size: 2em; color: black;">12<span style="color: #c2185b;">,</span>75</p>
            <div style="display: flex; justify-content: space-around;">
              <span style="background-color: #1976D2; color: white; padding: 8px 15px; border-radius: 30px;">جزء صحيح</span>
              <span style="background-color: #FF9800; color: white; padding: 8px 15px; border-radius: 30px;">جزء عشري</span>
            </div>
          </div>
          <div style="background-color: rgba(255,255,255,0.9); padding: 25px; border-radius: 15px; width: 40%; margin: 10px;">
            <h3 style="color: #c2185b;">📝 الكتابة العشرية</h3>
            <p style="font-size: 1.3em; color: black;">0,5 = ${frac('5', '10')}</p>
            <p style="font-size: 1.3em; color: black;">0,25 = ${frac('25', '100')}</p>
            <p style="font-size: 1.3em; color: black;">0,375 = ${frac('375', '1000')}</p>
          </div>
        </div>
        <p style="background-color: rgba(255,255,255,0.95); padding: 20px; border-radius: 50px; font-size: 1.5em; color: #333; margin-top: 20px;">
          <strong>✨ القاعدة الذهبية: الجزء العشري يمثل أجزاء من الوحدة ✨</strong>
        </p>
      </div>
    </div>
  `;

  // 5. Create Lesson
  const lesson = await prisma.lesson.create({
    data: {
      title: 'العدد العشري والكتابة العشرية',
      content: lessonContent,
      subjectId: subject.id,
      levelId: level.id,
      authorId: teacher.id,
      status: 'approved',
      published: true,
      type: 'public',
      exercises: {
        create: [
          // 🟢 تمارين الدعم (70%)
          {
            type: 'support_with_results',
            question: 'التمرين 01: أكمل الفراغات:\n1) العدد العشري يتكون من جزأين هما: ...... و ......\n2) في العدد 12,5، الجزء الصحيح = ...... والجزء العشري = ......\n3) 3,7 = ....../10\n4) 0,25 = ....../100\n5) 0,005 = ....../1000',
            expectedResults: [
              { question: "1", result: "الجزء الصحيح, الجزء العشري", tolerance: 0 },
              { question: "2", result: "12, 5", tolerance: 0 },
              { question: "3", result: "37", tolerance: 0 },
              { question: "4", result: "25", tolerance: 0 },
              { question: "5", result: "5", tolerance: 0 }
            ],
            displayOrder: 1,
            maxScore: 5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 02: حدد الجزء الصحيح والجزء العشري:\n1) 7,3\n2) 12,45\n3) 0,8\n4) 5,07\n5) 23,019',
            expectedResults: [
              { question: "1", result: "7, 3", tolerance: 0 },
              { question: "2", result: "12, 45", tolerance: 0 },
              { question: "3", result: "0, 8", tolerance: 0 },
              { question: "4", result: "5, 07", tolerance: 0 },
              { question: "5", result: "23, 019", tolerance: 0 }
            ],
            displayOrder: 2,
            maxScore: 5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 03: حول الأعداد العشرية إلى كسور عشرية (اكتب الكسر على شكل a/b):\n1) 0,3\n2) 0,47\n3) 0,09\n4) 0,315\n5) 0,007',
            expectedResults: [
              { question: "1", result: "3/10", tolerance: 0 },
              { question: "2", result: "47/100", tolerance: 0 },
              { question: "3", result: "9/100", tolerance: 0 },
              { question: "4", result: "315/1000", tolerance: 0 },
              { question: "5", result: "7/1000", tolerance: 0 }
            ],
            displayOrder: 3,
            maxScore: 5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 04: اختر الإجابة الصحيحة (اكتب الرقم فقط):\n1) 0,5 = ... (5/10 / 5/100 / 5/1000)\n2) 0,05 = ... (5/10 / 5/100 / 5/1000)\n3) 2,35 = ... (235/10 / 235/100 / 235/1000)\n4) 0,009 = ... (9/10 / 9/100 / 9/1000)\n5) 7,8 = ... (78/10 / 78/100 / 78/1000)',
            expectedResults: [
              { question: "1", result: "5/10", tolerance: 0 },
              { question: "2", result: "5/100", tolerance: 0 },
              { question: "3", result: "235/100", tolerance: 0 },
              { question: "4", result: "9/1000", tolerance: 0 },
              { question: "5", result: "78/10", tolerance: 0 }
            ],
            displayOrder: 4,
            maxScore: 5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 05: رتب الأعداد التالية تصاعديًا (استخدم الرمز < ):\n2,5 - 0,75 - 1,2 - 0,3 - 1,05',
            expectedResults: [
              { question: "1", result: "0,3 < 0,75 < 1,05 < 1,2 < 2,5", tolerance: 0 }
            ],
            displayOrder: 5,
            maxScore: 5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 06: أكمل الجدول:\n1) 5,3 = .../10\n2) 0,47 = .../100\n3) 12,09 = .../100\n4) 3,007 = .../1000',
            expectedResults: [
              { question: "1", result: "53", tolerance: 0 },
              { question: "2", result: "47", tolerance: 0 },
              { question: "3", result: "1209", tolerance: 0 },
              { question: "4", result: "3007", tolerance: 0 }
            ],
            displayOrder: 6,
            maxScore: 4
          },
          {
            type: 'support_with_results',
            question: 'التمرين 07: ضع النقاط التالية على خط الأعداد (اكتب الترتيب من اليسار لليمين):\n0,5 - 1,2 - 2,7',
            expectedResults: [
              { question: "1", result: "0,5 - 1,2 - 2,7", tolerance: 0 }
            ],
            displayOrder: 7,
            maxScore: 3
          },
          // 🔴 التمارين الرئيسية (30%)
          {
            type: 'main',
            question: 'التمرين 08: مشكلة شراء الفواكه\nذهبت سارة إلى السوق لشراء فواكه:\n- تفاح: 1,5 kg\n- برتقال: 2,25 kg\n- موز: 0,75 kg\n\nالمطلوب:\n1) اكتب كل كمية على شكل كسر عشري.\n2) احسب المجموع الكلي للفواكه.\n3) رتب الفواكه حسب الكمية (من الأكبر إلى الأصغر).',
            modelAnswer: '1) تفاح: 15/10، برتقال: 225/100، موز: 75/100.\n2) المجموع = 1,5 + 2,25 + 0,75 = 4,5 kg.\n3) الترتيب: برتقال (2,25) > تفاح (1,5) > موز (0,75).',
            displayOrder: 8,
            maxScore: 5
          },
          {
            type: 'main',
            question: 'التمرين 09: مسألة قياس الأطوال\nقام تلاميذ السنة الأولى متوسط بقياس أطوال أقلامهم:\n- قلم ياسين: 12,5 cm\n- قلم ليلى: 12,25 cm\n- قلم سعيد: 12,75 cm\n\nالمطلوب:\n1) رتب الأقلام من الأطول إلى الأقصر.\n2) ما الفرق بين أطول قلم وأقصر قلم؟\n3) اكتب الأطوال على شكل كسور عشرية.',
            modelAnswer: '1) الترتيب: سعيد (12,75) > ياسين (12,5) > ليلى (12,25).\n2) الفرق = 12,75 - 12,25 = 0,5 cm.\n3) ياسين: 125/10، ليلى: 1225/100، سعيد: 1275/100.',
            displayOrder: 9,
            maxScore: 5
          },
          {
            type: 'main',
            question: 'التمرين 10: التحدي الكبير - العدد الغامض\nفي كل حالة، العدد الناقص يمثل عددًا عشريًا. أكمل الجدول:\n1) 5,3 (الجزء الصحيح: 5، الجزء العشري: 3)\n2) ... (الجزء الصحيح: 12، الجزء العشري: 7)\n3) 0,25 (الجزء الصحيح: 0، الجزء العشري: 25)\n4) 3,05 (الجزء الصحيح: 3، الجزء العشري: 05)\n5) ... (الجزء الصحيح: 7، الجزء العشري: 009)',
            modelAnswer: '2) 12,7\n5) 7,009',
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
