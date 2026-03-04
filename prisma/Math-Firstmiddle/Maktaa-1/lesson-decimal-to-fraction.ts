import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding Lesson: Decimal to Fraction ...');

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
        <h3>🏪 مشكلة: فاتورة الشراء من السوبرماركت</h3>
        <p>ذهبت فاطمة مع والدتها إلى السوبرماركت لشراء مستلزمات العائلة. عندما وصلت إلى المنزل، وجدت الفاتورة التالية:</p>
      </div>

      <div style="display: flex; justify-content: center; gap: 30px; margin: 30px 0; flex-wrap: wrap;">
        <div style="background-color: white; padding: 25px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1); width: 300px;">
          <h3 style="color: #1976D2; text-align: center;">🧾 الفاتورة</h3>
          <hr>
          <div style="display: flex; justify-content: space-between; margin: 15px 0;">
            <span>🥛 حليب</span>
            <span style="background-color: #1976D2; color: white; padding: 5px 15px; border-radius: 20px;">0,5 لتر</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 15px 0;">
            <span>🧀 جبن</span>
            <span style="background-color: #FF9800; color: white; padding: 5px 15px; border-radius: 20px;">0,250 كغ</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 15px 0;">
            <span>🍚 أرز</span>
            <span style="background-color: #4CAF50; color: white; padding: 5px 15px; border-radius: 20px;">1,75 كغ</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 15px 0;">
            <span>🍬 شوكولاتة</span>
            <span style="background-color: #9C27B0; color: white; padding: 5px 15px; border-radius: 20px;">0,125 كغ</span>
          </div>
        </div>
        <div style="background-color: white; padding: 25px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1); width: 300px;">
          <h3 style="color: #c2185b; text-align: center;">❓ أسئلة فاطمة</h3>
          <hr>
          <p>• ماذا تعني هذه الأعداد؟</p>
          <p>• كيف يمكن كتابة <span style="background-color: #1976D2; color: white; padding: 3px 8px; border-radius: 15px;">0,5</span> على شكل كسر؟</p>
          <p>• <span style="background-color: #FF9800; color: white; padding: 3px 8px; border-radius: 15px;">0,250</span> يساوي كم جزءًا من 1000؟</p>
          <p>• كيف نكتب <span style="background-color: #4CAF50; color: white; padding: 3px 8px; border-radius: 15px;">1,75</span> على شكل كسر؟</p>
        </div>
      </div>
      <p style="text-align: center; font-size: 1.2em; font-weight: bold;">🔍 التساؤل الكبير: كيف نحول هذه الأعداد العشرية إلى كسور؟</p>

      <!-- 2️⃣ مرحلة البحث والاكتشاف -->
      <div style="background-color: #fff9e6; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <h3>🧪 نشاط استكشافي: هيا نكتشف العلاقة!</h3>
        <h4>📌 النشاط 1: من الرسم إلى الكسر</h4>
        <p>لاحظ الأشرطة الملونة التالية:</p>

        <div style="display: flex; flex-direction: column; gap: 30px; margin: 30px 0;">
          <div style="display: flex; align-items: center; gap: 30px; flex-wrap: wrap; background-color: white; padding: 20px; border-radius: 10px;">
            <div style="flex: 1; text-align: center;">
              <svg width="200" height="60" viewBox="0 0 200 60">
                <rect x="20" y="15" width="150" height="30" fill="none" stroke="#1976D2" stroke-width="3" rx="5"/>
                <line x1="35" y1="15" x2="35" y2="45" stroke="#1976D2" stroke-width="2"/>
                <line x1="50" y1="15" x2="50" y2="45" stroke="#1976D2" stroke-width="2"/>
                <line x1="65" y1="15" x2="65" y2="45" stroke="#1976D2" stroke-width="2"/>
                <line x1="80" y1="15" x2="80" y2="45" stroke="#1976D2" stroke-width="2"/>
                <line x1="95" y1="15" x2="95" y2="45" stroke="#1976D2" stroke-width="2"/>
                <line x1="110" y1="15" x2="110" y2="45" stroke="#1976D2" stroke-width="2"/>
                <line x1="125" y1="15" x2="125" y2="45" stroke="#1976D2" stroke-width="2"/>
                <line x1="140" y1="15" x2="140" y2="45" stroke="#1976D2" stroke-width="2"/>
                <line x1="155" y1="15" x2="155" y2="45" stroke="#1976D2" stroke-width="2"/>
                <rect x="20" y="15" width="75" height="30" fill="#1976D2" opacity="0.5"/>
              </svg>
              <p style="color: #1976D2; font-weight: bold;">0,5 = 5 أجزاء من 10</p>
            </div>
            <div style="flex: 1; background-color: #e3f2fd; padding: 15px; border-radius: 10px;">
              <p><strong>نكتب:</strong> 0,5 = <span style="background-color: #1976D2; color: white; padding: 8px 15px; border-radius: 30px; font-size: 1.3em;">${frac('5', '10')}</span></p>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 30px; flex-wrap: wrap; background-color: white; padding: 20px; border-radius: 10px;">
            <div style="flex: 1; text-align: center;">
              <svg width="200" height="60" viewBox="0 0 200 60">
                <rect x="20" y="15" width="150" height="30" fill="none" stroke="#FF9800" stroke-width="3" rx="5"/>
                <!-- Simplified grid for 100 parts visual -->
                <line x1="35" y1="15" x2="35" y2="45" stroke="#FF9800" stroke-width="1"/>
                <line x1="50" y1="15" x2="50" y2="45" stroke="#FF9800" stroke-width="1"/>
                <line x1="65" y1="15" x2="65" y2="45" stroke="#FF9800" stroke-width="1"/>
                <line x1="80" y1="15" x2="80" y2="45" stroke="#FF9800" stroke-width="1"/>
                <line x1="95" y1="15" x2="95" y2="45" stroke="#FF9800" stroke-width="1"/>
                <line x1="110" y1="15" x2="110" y2="45" stroke="#FF9800" stroke-width="1"/>
                <line x1="125" y1="15" x2="125" y2="45" stroke="#FF9800" stroke-width="1"/>
                <line x1="140" y1="15" x2="140" y2="45" stroke="#FF9800" stroke-width="1"/>
                <line x1="155" y1="15" x2="155" y2="45" stroke="#FF9800" stroke-width="1"/>
                <rect x="20" y="15" width="45" height="30" fill="#FF9800" opacity="0.5"/>
              </svg>
              <p style="color: #FF9800; font-weight: bold;">0,25 = 25 جزء من 100</p>
            </div>
            <div style="flex: 1; background-color: #fff3e0; padding: 15px; border-radius: 10px;">
              <p><strong>نكتب:</strong> 0,25 = <span style="background-color: #FF9800; color: white; padding: 8px 15px; border-radius: 30px; font-size: 1.3em;">${frac('25', '100')}</span></p>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 30px; flex-wrap: wrap; background-color: white; padding: 20px; border-radius: 10px;">
            <div style="flex: 1; text-align: center;">
              <svg width="200" height="60" viewBox="0 0 200 60">
                <rect x="20" y="15" width="150" height="30" fill="none" stroke="#4CAF50" stroke-width="3" rx="5"/>
                <rect x="20" y="15" width="112.5" height="30" fill="#4CAF50" opacity="0.5"/>
              </svg>
              <p style="color: #4CAF50; font-weight: bold;">0,75 = 75 جزء من 100</p>
            </div>
            <div style="flex: 1; background-color: #e8f5e9; padding: 15px; border-radius: 10px;">
              <p><strong>نكتب:</strong> 0,75 = <span style="background-color: #4CAF50; color: white; padding: 8px 15px; border-radius: 30px; font-size: 1.3em;">${frac('75', '100')}</span></p>
            </div>
          </div>
        </div>

        <h4>📌 النشاط 2: اكتشاف القاعدة</h4>
        <div style="background-color: white; padding: 20px; border-radius: 15px; margin: 20px 0;">
          <table style="width: 100%; text-align: center; border-collapse: collapse;">
            <tr><th>العدد العشري</th><th>عدد الأرقام بعد الفاصلة</th><th>الكسر العشري</th></tr>
            <tr><td style="color: #1976D2; font-size: 1.2em;">0,5</td><td><span style="background-color: #1976D2; color: white; padding: 5px 10px; border-radius: 20px;">1 رقم</span></td><td><span style="background-color: #1976D2; color: white; padding: 5px 10px; border-radius: 20px;">${frac('5', '10')}</span></td></tr>
            <tr><td style="color: #FF9800; font-size: 1.2em;">0,25</td><td><span style="background-color: #FF9800; color: white; padding: 5px 10px; border-radius: 20px;">2 رقمان</span></td><td><span style="background-color: #FF9800; color: white; padding: 5px 10px; border-radius: 20px;">${frac('25', '100')}</span></td></tr>
            <tr><td style="color: #4CAF50; font-size: 1.2em;">0,375</td><td><span style="background-color: #4CAF50; color: white; padding: 5px 10px; border-radius: 20px;">3 أرقام</span></td><td><span style="background-color: #4CAF50; color: white; padding: 5px 10px; border-radius: 20px;">${frac('375', '1000')}</span></td></tr>
          </table>
        </div>
        <p><strong>❓ أسئلة موجهة:</strong></p>
        <ul>
          <li>ماذا تلاحظ؟ <span style="background-color: #4CAF50; color: white; padding: 3px 8px; border-radius: 15px;">عدد الأرقام بعد الفاصلة يحدد المقام</span></li>
          <li>إذا كان رقم واحد بعد الفاصلة، ما هو المقام؟ <span style="background-color: #1976D2; color: white; padding: 3px 8px; border-radius: 15px;">10</span></li>
          <li>إذا كان رقمان بعد الفاصلة، ما هو المقام؟ <span style="background-color: #FF9800; color: white; padding: 3px 8px; border-radius: 15px;">100</span></li>
          <li>إذا كان ثلاثة أرقام بعد الفاصلة، ما هو المقام؟ <span style="background-color: #4CAF50; color: white; padding: 3px 8px; border-radius: 15px;">1000</span></li>
        </ul>
      </div>

      <!-- 3️⃣ بناء المفهوم -->
      <div style="background: linear-gradient(135deg, #43C6AC 0%, #191654 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
        <h3>📚 الانتقال من كتابة عشرية إلى كتابة كسرية</h3>
      </div>
      <div style="background-color: #e3f2fd; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="border-right: 8px solid #1976D2; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h4>🔷 <span style="color: #1976D2;">قاعدة التحويل</span></h4>
          <p>لتحويل عدد عشري إلى كسر عشري:</p>
          <ol>
            <li>نكتب العدد بدون فاصلة في البسط</li>
            <li>نضع في المقام 1 وبجانبه أصفار بعدد الأرقام العشرية</li>
          </ol>
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 15px; margin-top: 20px; text-align: center;">
            <div style="display: flex; justify-content: center; align-items: center; gap: 30px; flex-wrap: wrap;">
              <div><span style="background-color: #1976D2; color: white; font-size: 2em; padding: 15px 25px; border-radius: 50px;">0,5</span></div>
              <div style="font-size: 2.5em;">→</div>
              <div><span style="background-color: #FF9800; color: white; font-size: 2em; padding: 15px 25px; border-radius: 50px;">${frac('5', '10')}</span></div>
            </div>
            <p style="margin-top: 20px;">✏️ 0,5 : رقم واحد بعد الفاصلة ← مقام 10</p>
          </div>
        </div>

        <div style="border-right: 8px solid #c2185b; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h4>🔷 <span style="color: #c2185b;">الحالات المختلفة</span></h4>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
            <div style="background-color: #ffebee; padding: 20px; border-radius: 10px;">
              <h4 style="color: #1976D2;">📌 حالة رقم واحد بعد الفاصلة</h4>
              <p style="font-size: 1.3em; text-align: center;">0,3 = <span style="background-color: #1976D2; color: white; padding: 8px 15px; border-radius: 30px;">${frac('3', '10')}</span></p>
              <p style="font-size: 1.3em; text-align: center;">0,7 = <span style="background-color: #1976D2; color: white; padding: 8px 15px; border-radius: 30px;">${frac('7', '10')}</span></p>
            </div>
            <div style="background-color: #fff3e0; padding: 20px; border-radius: 10px;">
              <h4 style="color: #FF9800;">📌 حالة رقمان بعد الفاصلة</h4>
              <p style="font-size: 1.3em; text-align: center;">0,25 = <span style="background-color: #FF9800; color: white; padding: 8px 15px; border-radius: 30px;">${frac('25', '100')}</span></p>
              <p style="font-size: 1.3em; text-align: center;">0,37 = <span style="background-color: #FF9800; color: white; padding: 8px 15px; border-radius: 30px;">${frac('37', '100')}</span></p>
            </div>
            <div style="background-color: #e8f5e9; padding: 20px; border-radius: 10px;">
              <h4 style="color: #4CAF50;">📌 حالة ثلاثة أرقام بعد الفاصلة</h4>
              <p style="font-size: 1.3em; text-align: center;">0,125 = <span style="background-color: #4CAF50; color: white; padding: 8px 15px; border-radius: 30px;">${frac('125', '1000')}</span></p>
              <p style="font-size: 1.3em; text-align: center;">0,375 = <span style="background-color: #4CAF50; color: white; padding: 8px 15px; border-radius: 30px;">${frac('375', '1000')}</span></p>
            </div>
            <div style="background-color: #f3e5f5; padding: 20px; border-radius: 10px;">
              <h4 style="color: #9C27B0;">📌 حالة وجود جزء صحيح</h4>
              <p style="font-size: 1.3em; text-align: center;">1,5 = <span style="background-color: #9C27B0; color: white; padding: 8px 15px; border-radius: 30px;">${frac('15', '10')}</span></p>
              <p style="font-size: 1.3em; text-align: center;">2,75 = <span style="background-color: #9C27B0; color: white; padding: 8px 15px; border-radius: 30px;">${frac('275', '100')}</span></p>
            </div>
          </div>
        </div>

        <div style="border-right: 8px solid #4CAF50; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h4>🔷 <span style="color: #4CAF50;">حالات خاصة: وجود أصفار في الجزء العشري</span></h4>
          <div style="background: linear-gradient(90deg, #4CAF50 0%, #81C784 100%); padding: 2px; border-radius: 10px;">
            <div style="background-color: white; padding: 20px; border-radius: 8px;">
              <table style="width: 100%; text-align: center;">
                <tr><th>العدد العشري</th><th>عدد الأرقام بعد الفاصلة</th><th>الكسر العشري</th></tr>
                <tr><td>0,05</td><td>2</td><td><span style="background-color: #4CAF50; color: white; padding: 5px 10px; border-radius: 20px;">${frac('5', '100')}</span></td></tr>
                <tr><td>0,007</td><td>3</td><td><span style="background-color: #4CAF50; color: white; padding: 5px 10px; border-radius: 20px;">${frac('7', '1000')}</span></td></tr>
                <tr><td>0,025</td><td>3</td><td><span style="background-color: #4CAF50; color: white; padding: 5px 10px; border-radius: 20px;">${frac('25', '1000')}</span></td></tr>
              </table>
              <p class="important-note" style="background-color: #fff3cd; padding: 15px; border-radius: 10px; margin-top: 20px;">
                <strong>⚠️ مهم جدًا:</strong> نحتفظ بجميع الأرقام حتى الأصفار في العد لتحديد المقام!
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 4️⃣ تمثيل متعدد للمفهوم -->
      <div style="background: linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
        <h3>🎭 أربع تمثيلات للانتقال من الكتابة العشرية إلى الكسرية</h3>
      </div>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;">
        <div style="background: linear-gradient(145deg, #ffffff, #e3f2fd); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <h4 style="color: #1976D2; text-align: center; font-size: 1.5em;">🔢 تمثيل عددي</h4>
          <div style="text-align: center;">
            <p><span style="background-color: #1976D2; color: white; padding: 8px 15px; border-radius: 30px;">0,5</span> → <span style="background-color: #1976D2; color: white; padding: 8px 15px; border-radius: 30px;">${frac('5', '10')}</span></p>
            <p><span style="background-color: #FF9800; color: white; padding: 8px 15px; border-radius: 30px;">0,25</span> → <span style="background-color: #FF9800; color: white; padding: 8px 15px; border-radius: 30px;">${frac('25', '100')}</span></p>
            <p><span style="background-color: #4CAF50; color: white; padding: 8px 15px; border-radius: 30px;">0,375</span> → <span style="background-color: #4CAF50; color: white; padding: 8px 15px; border-radius: 30px;">${frac('375', '1000')}</span></p>
          </div>
        </div>
        <div style="background: linear-gradient(145deg, #ffffff, #ffebee); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <h4 style="color: #c2185b; text-align: center; font-size: 1.5em;">📝 تمثيل لفظي</h4>
          <ul style="font-size: 1.2em; list-style-type: none; padding: 0;">
            <li style="margin: 15px 0;">✓ "خمسة أعشار" = <strong>0,5 = ${frac('5', '10')}</strong></li>
            <li style="margin: 15px 0;">✓ "خمسة وعشرون جزءًا من مئة" = <strong>0,25 = ${frac('25', '100')}</strong></li>
            <li style="margin: 15px 0;">✓ "ثلاثمائة وخمسة وسبعون جزءًا من ألف" = <strong>0,375 = ${frac('375', '1000')}</strong></li>
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
              <p style="color: #1976D2;">0,5 = ${frac('5', '10')}</p>
            </div>
            <div style="text-align: center;">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <rect x="10" y="10" width="60" height="60" fill="white" stroke="#FF9800" stroke-width="3"/>
                <line x1="10" y1="25" x2="70" y2="25" stroke="#FF9800"/>
                <line x1="10" y1="40" x2="70" y2="40" stroke="#FF9800"/>
                <line x1="10" y1="55" x2="70" y2="55" stroke="#FF9800"/>
                <rect x="10" y="10" width="15" height="60" fill="#FF9800" opacity="0.5"/>
              </svg>
              <p style="color: #FF9800;">0,25 = ${frac('25', '100')}</p>
            </div>
          </div>
        </div>
        <div style="background: linear-gradient(145deg, #ffffff, #fff3e0); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <h4 style="color: #FF9800; text-align: center; font-size: 1.5em;">📊 تمثيل جدولي</h4>
          <table style="width:100%; border-collapse: collapse; text-align: center;">
            <tr style="background-color: #FF9800; color: white;">
              <th style="padding: 10px;">عدد عشري</th>
              <th style="padding: 10px;">أرقام بعد الفاصلة</th>
              <th style="padding: 10px;">كسر عشري</th>
            </tr>
            <tr style="background-color: #fff3e0;">
              <td>0,3</td><td>1</td><td>${frac('3', '10')}</td>
            </tr>
            <tr style="background-color: #ffe0b2;">
              <td>0,47</td><td>2</td><td>${frac('47', '100')}</td>
            </tr>
            <tr style="background-color: #ffcc80;">
              <td>0,259</td><td>3</td><td>${frac('259', '1000')}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- 5️⃣ أمثلة محلولة تدريجيًا -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 15px; margin: 20px 0;">
        <div style="background-color: white; padding: 20px; border-radius: 10px;">
          <p style="font-size: 1.3em;"><strong style="color: #1976D2;">المطلوب:</strong> حول العدد <span style="background-color: #1976D2; color: white; padding: 5px 10px; border-radius: 20px;">0,7</span> إلى كسر عشري</p>
          <div style="display: flex; gap: 30px; align-items: center; flex-wrap: wrap;">
            <div style="flex: 1; text-align: center;">
              <svg width="200" height="60" viewBox="0 0 200 60">
                <rect x="20" y="15" width="150" height="30" fill="none" stroke="#1976D2" stroke-width="3" rx="5"/>
                <line x1="35" y1="15" x2="35" y2="45" stroke="#1976D2"/>
                <line x1="50" y1="15" x2="50" y2="45" stroke="#1976D2"/>
                <line x1="65" y1="15" x2="65" y2="45" stroke="#1976D2"/>
                <line x1="80" y1="15" x2="80" y2="45" stroke="#1976D2"/>
                <line x1="95" y1="15" x2="95" y2="45" stroke="#1976D2"/>
                <line x1="110" y1="15" x2="110" y2="45" stroke="#1976D2"/>
                <line x1="125" y1="15" x2="125" y2="45" stroke="#1976D2"/>
                <line x1="140" y1="15" x2="140" y2="45" stroke="#1976D2"/>
                <line x1="155" y1="15" x2="155" y2="45" stroke="#1976D2"/>
                <rect x="20" y="15" width="105" height="30" fill="#1976D2" opacity="0.5"/>
              </svg>
            </div>
            <div style="flex: 1;">
              <p><strong style="color: #1976D2;">🔍 التفكير:</strong> 0,7 يعني 7 أجزاء من 10</p>
              <p><strong style="color: #1976D2;">الخطوة 1:</strong> نكتب العدد بدون فاصلة: <span style="background-color: #1976D2; color: white; padding: 5px 10px; border-radius: 20px;">7</span></p>
              <p><strong style="color: #1976D2;">الخطوة 2:</strong> عدد الأرقام بعد الفاصلة = <span style="background-color: #1976D2; color: white; padding: 5px 10px; border-radius: 20px;">1</span> → مقام 10</p>
              <p style="font-size: 2em; text-align: center; color: #1976D2; font-weight: bold;">0,7 = ${frac('7', '10')}</p>
            </div>
          </div>
        </div>
      </div>

      <div style="background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%); padding: 20px; border-radius: 15px; margin: 20px 0;">
        <div style="background-color: white; padding: 20px; border-radius: 10px;">
          <p style="font-size: 1.3em;"><strong style="color: #FF9800;">المطلوب:</strong> حول العدد <span style="background-color: #FF9800; color: white; padding: 5px 10px; border-radius: 20px;">0,37</span> إلى كسر عشري</p>
          <div style="display: flex; gap: 30px; align-items: center; flex-wrap: wrap;">
            <div style="flex: 1; text-align: center;">
              <svg width="200" height="100" viewBox="0 0 200 100">
                <rect x="20" y="20" width="150" height="50" fill="none" stroke="#FF9800" stroke-width="3"/>
                <rect x="20" y="20" width="55.5" height="50" fill="#FF9800" opacity="0.5"/>
              </svg>
            </div>
            <div style="flex: 1;">
              <p><strong style="color: #FF9800;">🔍 التفكير:</strong> 0,37 يعني 37 جزءًا من 100</p>
              <p><strong style="color: #FF9800;">الخطوة 1:</strong> نكتب العدد بدون فاصلة: <span style="background-color: #FF9800; color: white; padding: 5px 10px; border-radius: 20px;">37</span></p>
              <p><strong style="color: #FF9800;">الخطوة 2:</strong> عدد الأرقام بعد الفاصلة = <span style="background-color: #FF9800; color: white; padding: 5px 10px; border-radius: 20px;">2</span> → مقام 100</p>
              <p style="font-size: 2em; text-align: center; color: #FF9800; font-weight: bold;">0,37 = ${frac('37', '100')}</p>
            </div>
          </div>
        </div>
      </div>

      <div style="background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%); padding: 20px; border-radius: 15px; margin: 20px 0;">
        <div style="background-color: white; padding: 20px; border-radius: 10px;">
          <p style="font-size: 1.3em;"><strong style="color: #4CAF50;">المطلوب:</strong> حول العدد <span style="background-color: #4CAF50; color: white; padding: 5px 10px; border-radius: 20px;">0,05</span> إلى كسر عشري</p>
          <div style="display: flex; gap: 30px; align-items: center; flex-wrap: wrap;">
            <div style="flex: 1; text-align: center;">
              <svg width="200" height="80" viewBox="0 0 200 80">
                <rect x="20" y="15" width="150" height="40" fill="none" stroke="#4CAF50" stroke-width="3"/>
                <rect x="20" y="15" width="7.5" height="40" fill="#4CAF50" opacity="0.5"/>
              </svg>
            </div>
            <div style="flex: 1;">
              <p><strong style="color: #4CAF50;">🔍 تحليل:</strong> 0,05 به رقمان بعد الفاصلة</p>
              <p><strong style="color: #4CAF50;">الخطوة 1:</strong> نكتب العدد بدون فاصلة: <span style="background-color: #4CAF50; color: white; padding: 5px 10px; border-radius: 20px;">005</span></p>
              <p><strong style="color: #4CAF50;">الخطوة 2:</strong> نأخذ العدد <span style="background-color: #4CAF50; color: white; padding: 5px 10px; border-radius: 20px;">5</span> في البسط (نتجاهل الأصفار في البداية)</p>
              <p><strong style="color: #4CAF50;">الخطوة 3:</strong> عدد الأرقام بعد الفاصلة = 2 → مقام 100</p>
              <p style="font-size: 2em; text-align: center; color: #4CAF50; font-weight: bold;">0,05 = ${frac('5', '100')}</p>
            </div>
          </div>
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 10px; margin-top: 20px;">
            <strong>⚠️ مهم جدًا:</strong> لا تنسَ الأصفار في المقام!
            <div style="display: flex; justify-content: center; gap: 30px; margin-top: 10px;">
              <span style="background-color: #4CAF50; color: white; padding: 5px 10px; border-radius: 20px;">0,05 = ${frac('5', '100')}</span>
              <span style="background-color: #1976D2; color: white; padding: 5px 10px; border-radius: 20px;">0,5 = ${frac('5', '10')}</span>
            </div>
          </div>
        </div>
      </div>

      <div style="background: linear-gradient(135deg, #9C27B0 0%, #6A1B9A 100%); padding: 20px; border-radius: 15px; margin: 20px 0;">
        <div style="background-color: white; padding: 20px; border-radius: 10px;">
          <p style="font-size: 1.3em;"><strong style="color: #9C27B0;">الوضعية:</strong> اشترى أحمد <span style="background-color: #9C27B0; color: white; padding: 5px 10px; border-radius: 20px;">1,75 kg</span> من البرتقال. اكتب هذه الكمية على شكل كسر عشري.</p>
          <div style="display: flex; gap: 30px; align-items: center; flex-wrap: wrap;">
            <div style="flex: 1; text-align: center;">
              <svg width="200" height="80" viewBox="0 0 200 80">
                <rect x="20" y="15" width="40" height="40" fill="#1976D2" rx="5"/>
                <text x="32" y="40" fill="white">1</text>
                <rect x="70" y="15" width="105" height="40" fill="#9C27B0" rx="5"/>
                <text x="115" y="40" fill="white">0,75</text>
              </svg>
            </div>
            <div style="flex: 1;">
              <p><strong style="color: #9C27B0;">🔍 التفكير:</strong> 1,75 = 1 + 0,75</p>
              <p><strong style="color: #9C27B0;">الخطوة 1:</strong> نكتب العدد بدون فاصلة: <span style="background-color: #9C27B0; color: white; padding: 5px 10px; border-radius: 20px;">175</span></p>
              <p><strong style="color: #9C27B0;">الخطوة 2:</strong> عدد الأرقام بعد الفاصلة = <span style="background-color: #9C27B0; color: white; padding: 5px 10px; border-radius: 20px;">2</span> → مقام 100</p>
              <p style="font-size: 2em; text-align: center; color: #9C27B0; font-weight: bold;">1,75 = ${frac('175', '100')}</p>
            </div>
          </div>
          <div style="background-color: #f3e5f5; padding: 15px; border-radius: 10px; margin-top: 20px;">
            <strong>🔍 تحقق:</strong> ${frac('175', '100')} = 1,75 ✓
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
              <td style="padding: 15px;">0,5 = ${frac('5', '100')}</td>
              <td style="padding: 15px;">الخلط في عدد الأصفار</td>
              <td style="padding: 15px;">نعد الأرقام بعد الفاصلة: 0,5 → رقم واحد → مقام 10</td>
            </tr>
            <tr style="background-color: #ef9a9a;">
              <td style="padding: 15px; font-weight: bold;">الخطأ 2</td>
              <td style="padding: 15px;">0,05 = ${frac('5', '10')}</td>
              <td style="padding: 15px;">إهمال الصفر في العد</td>
              <td style="padding: 15px;">0,05 به رقمان بعد الفاصلة → مقام 100</td>
            </tr>
            <tr style="background-color: #e57373;">
              <td style="padding: 15px; font-weight: bold;">الخطأ 3</td>
              <td style="padding: 15px;">1,5 = ${frac('15', '100')}</td>
              <td style="padding: 15px;">نسيان أن 1,5 = ${frac('15', '10')} وليس ${frac('15', '100')}</td>
              <td style="padding: 15px;">1,5 به رقم واحد بعد الفاصلة → مقام 10</td>
            </tr>
            <tr style="background-color: #ef5350;">
              <td style="padding: 15px; font-weight: bold;">الخطأ 4</td>
              <td style="padding: 15px;">0,25 = ${frac('25', '10')}</td>
              <td style="padding: 15px;">عدم الانتباه لعدد الأرقام</td>
              <td style="padding: 15px;">0,25 به رقمان → مقام 100</td>
            </tr>
          </table>
        </div>
        <div style="background-color: #c8e6c9; padding: 20px; border-radius: 10px; margin-top: 20px;">
          <p>✅ كيف نتحقق من صحة الحل؟</p>
          <ul style="font-size: 1.1em;">
            <li>✓ نعد الأرقام بعد الفاصلة بدقة</li>
            <li>✓ نتأكد أن المقام = 10^(عدد الأرقام بعد الفاصلة)</li>
            <li>✓ نتحقق بالقسمة: البسط ÷ المقام = العدد الأصلي</li>
            <li>✓ نستخدم خط الأعداد للتحقق من المعنى</li>
          </ul>
        </div>
      </div>

      <!-- ✨ خلاصة الدرس -->
      <div style="background: linear-gradient(135deg, #43C6AC 0%, #191654 100%); padding: 30px; border-radius: 15px; margin: 30px 0; text-align: center; color: white;">
        <h3>📌 ملخص الانتقال من كتابة عشرية إلى كتابة كسرية</h3>
        <div style="display: flex; justify-content: space-around; margin: 30px 0; flex-wrap: wrap;">
          <div style="background-color: rgba(255,255,255,0.9); padding: 25px; border-radius: 15px; width: 45%; margin: 10px;">
            <h3 style="color: #1976D2;">🔢 القاعدة الأساسية</h3>
            <p style="font-size: 1.3em; color: black;">عدد عشري → كسر عشري</p>
            <p style="font-size: 1.5em; color: black;">0,<span style="color: #c2185b;">abc</span> = ${frac('abc', '10^n')}</p>
            <p style="color: black;">حيث n = عدد الأرقام بعد الفاصلة</p>
          </div>
          <div style="background-color: rgba(255,255,255,0.9); padding: 25px; border-radius: 15px; width: 45%; margin: 10px;">
            <h3 style="color: #4CAF50;">📝 أمثلة</h3>
            <p style="font-size: 1.2em; color: black;">0,5 = ${frac('5', '10')}</p>
            <p style="font-size: 1.2em; color: black;">0,25 = ${frac('25', '100')}</p>
            <p style="font-size: 1.2em; color: black;">0,125 = ${frac('125', '1000')}</p>
          </div>
        </div>
        <p style="background-color: rgba(255,255,255,0.95); padding: 20px; border-radius: 50px; font-size: 1.5em; color: #333; margin-top: 20px;">
          <strong>✨ القاعدة الذهبية: عدد الأرقام بعد الفاصلة = عدد الأصفار في المقام ✨</strong>
        </p>
      </div>
    </div>
  `;

  // 5. Create Lesson
  const lesson = await prisma.lesson.create({
    data: {
      title: 'الانتقال من كتابة عشرية إلى كتابة كسرية',
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
            question: 'التمرين 01: أكمل الفراغات:\n1) 0,3 = .../10\n2) 0,47 = .../100\n3) 0,125 = .../1000\n4) 2,5 = .../10\n5) 0,05 = .../100',
            expectedResults: [
              { question: "1", result: "3", tolerance: 0 },
              { question: "2", result: "47", tolerance: 0 },
              { question: "3", result: "125", tolerance: 0 },
              { question: "4", result: "25", tolerance: 0 },
              { question: "5", result: "5", tolerance: 0 }
            ],
            displayOrder: 1,
            maxScore: 5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 02: حول الأعداد العشرية إلى كسور عشرية:\n1) 0,7\n2) 0,23\n3) 0,09\n4) 0,315\n5) 0,007',
            expectedResults: [
              { question: "1", result: "7/10", tolerance: 0 },
              { question: "2", result: "23/100", tolerance: 0 },
              { question: "3", result: "9/100", tolerance: 0 },
              { question: "4", result: "315/1000", tolerance: 0 },
              { question: "5", result: "7/1000", tolerance: 0 }
            ],
            displayOrder: 2,
            maxScore: 5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 03: كم رقمًا بعد الفاصلة وما هو المقام؟\n1) 0,4\n2) 0,37\n3) 0,259\n4) 0,05\n5) 0,007',
            expectedResults: [
              { question: "1", result: "1, 10", tolerance: 0 },
              { question: "2", result: "2, 100", tolerance: 0 },
              { question: "3", result: "3, 1000", tolerance: 0 },
              { question: "4", result: "2, 100", tolerance: 0 },
              { question: "5", result: "3, 1000", tolerance: 0 }
            ],
            displayOrder: 3,
            maxScore: 5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 04: اختر الإجابة الصحيحة (اكتب الكسر):\n1) 0,5 = ... (5/10 / 5/100 / 5/1000)\n2) 0,05 = ... (5/10 / 5/100 / 5/1000)\n3) 2,3 = ... (23/10 / 23/100 / 23/1000)\n4) 0,009 = ... (9/10 / 9/100 / 9/1000)\n5) 1,25 = ... (125/10 / 125/100 / 125/1000)',
            expectedResults: [
              { question: "1", result: "5/10", tolerance: 0 },
              { question: "2", result: "5/100", tolerance: 0 },
              { question: "3", result: "23/10", tolerance: 0 },
              { question: "4", result: "9/1000", tolerance: 0 },
              { question: "5", result: "125/100", tolerance: 0 }
            ],
            displayOrder: 4,
            maxScore: 5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 05: أكمل الجدول (اكتب الكسر العشري):\n1) 0,7\n2) 0,43\n3) 0,125\n4) 2,5\n5) 0,037',
            expectedResults: [
              { question: "1", result: "7/10", tolerance: 0 },
              { question: "2", result: "43/100", tolerance: 0 },
              { question: "3", result: "125/1000", tolerance: 0 },
              { question: "4", result: "25/10", tolerance: 0 },
              { question: "5", result: "37/1000", tolerance: 0 }
            ],
            displayOrder: 5,
            maxScore: 5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 06: حول الأعداد التالية إلى كسور ثم رتبها تصاعديًا (اكتب الترتيب فقط مفصولاً بـ < ):\n0,5 - 0,25 - 0,75 - 0,125 - 0,3',
            expectedResults: [
              { question: "1", result: "0,125 < 0,25 < 0,3 < 0,5 < 0,75", tolerance: 0 }
            ],
            displayOrder: 6,
            maxScore: 5
          },
          {
            type: 'support_with_results',
            question: 'التمرين 07: مثل الكسر 37/100 على شبكة من 100 مربع، ثم اكتبه كعدد عشري.',
            expectedResults: [
              { question: "1", result: "0,37", tolerance: 0 }
            ],
            displayOrder: 7,
            maxScore: 2
          },
          // 🔴 التمارين الرئيسية (30%)
          {
            type: 'main',
            question: 'التمرين 08: مشكلة وصفة طبخ\nوصفة لتحضير كعكة تتطلب:\n- دقيق: 0,5 kg\n- سكر: 0,250 kg\n- زبدة: 0,125 kg\n- حليب: 0,75 kg\n\nالمطلوب:\n1) اكتب كل كمية على شكل كسر عشري.\n2) احسب المجموع الكلي للمقادير.\n3) رتب المقادير من الأكبر إلى الأصغر.',
            modelAnswer: '1) دقيق: 5/10، سكر: 250/1000، زبدة: 125/1000، حليب: 75/100.\n2) المجموع = 1,625 kg.\n3) الترتيب: حليب (0,75) > دقيق (0,5) > سكر (0,25) > زبدة (0,125).',
            displayOrder: 8,
            maxScore: 5
          },
          {
            type: 'main',
            question: 'التمرين 09: مسألة قياس الأطوال\nأطوال ثلاثة أشرطة:\n- الشريط A: 1,25 m\n- الشريط B: 2,5 m\n- الشريط C: 0,75 m\n\nالمطلوب:\n1) اكتب كل طول على شكل كسر عشري.\n2) ما طول الشريط B بالكسر؟ كم مرة يساوي الشريط C؟\n3) إذا جمعنا الأشرطة A و C، فكم يساويان؟',
            modelAnswer: '1) A: 125/100، B: 25/10، C: 75/100.\n2) B = 250/100. يساوي 3,33 مرة C تقريبًا.\n3) A + C = 2 m.',
            displayOrder: 9,
            maxScore: 5
          },
          {
            type: 'main',
            question: 'التمرين 10: التحدي الكبير - الكسر الغامض\nفي كل حالة، جد الكسر العشري الموافق للعدد العشري:\n1) 0,3\n2) 0,27\n3) 0,135\n4) 0,05\n5) 0,009',
            modelAnswer: '1) 3/10\n2) 27/100\n3) 135/1000\n4) 5/100\n5) 9/1000',
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