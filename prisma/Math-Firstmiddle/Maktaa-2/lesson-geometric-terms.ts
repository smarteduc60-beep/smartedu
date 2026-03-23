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
      <!-- 1️⃣ وضعية انطلاق (Situation-problème) -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
        <h3>🏗️ مشكلة: قراءة مخطط بناء</h3>
        <p>في موقع بناء منزل بمدينة قسنطينة، وجد العمال مخططاً للبناء يحتوي على رموز وعلامات كثيرة. لم يفهموا معنى الرموز مثل: <span class="math">A ∈ (d)</span>، <span class="math">(d) // (l)</span>، <span class="math">(AB) ⊥ (CD)</span>، وغيرها.</p>
      </div>

      <div style="display: flex; justify-content: center; gap: 30px; margin: 30px 0; flex-wrap: wrap;">
        <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <svg width="200" height="150" viewBox="0 0 200 150">
            <line x1="30" y1="80" x2="170" y2="80" stroke="blue" stroke-width="3"/>
            <text x="30" y="75" fill="blue">(d)</text>
            <circle cx="100" cy="80" r="4" fill="red"/>
            <text x="105" y="75" fill="red">A</text>
          </svg>
          <p><span class="math">A ∈ (d)</span></p>
        </div>
        <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <svg width="200" height="150" viewBox="0 0 200 150">
            <line x1="30" y1="40" x2="170" y2="40" stroke="blue" stroke-width="3"/>
            <text x="30" y="35" fill="blue">(d)</text>
            <line x1="30" y1="100" x2="170" y2="100" stroke="red" stroke-width="3"/>
            <text x="30" y="95" fill="red">(l)</text>
          </svg>
          <p><span class="math">(d) // (l)</span></p>
        </div>
        <div style="text-align: center; background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <svg width="200" height="150" viewBox="0 0 200 150">
            <line x1="30" y1="80" x2="170" y2="80" stroke="blue" stroke-width="3"/>
            <text x="30" y="75" fill="blue">(d)</text>
            <line x1="100" y1="30" x2="100" y2="120" stroke="red" stroke-width="3"/>
            <text x="95" y="40" fill="red">(l)</text>
            <path d="M90 80 L90 70 L100 70 L100 80 Z" fill="green"/>
          </svg>
          <p><span class="math">(d) ⊥ (l)</span></p>
        </div>
      </div>
      <p>🔍 يحتاج العمال إلى فهم هذه الرموز لقراءة المخطط بشكل صحيح.</p>
      <p><strong>❓ التساؤلات:</strong></p>
      <ul>
        <li>ماذا تعني الرموز: <span class="math">∈</span>، <span class="math">∉</span>، <span class="math">//</span>، <span class="math">⊥</span>، <span class="math">∩</span> ؟</li>
        <li>كيف نمثل أن نقطة تنتمي أو لا تنتمي إلى مستقيم؟</li>
        <li>كيف نشفر تساوي قطعتين أو زاويتين؟</li>
      </ul>

      <!-- 2️⃣ مرحلة البحث والاكتشاف -->
      <div style="background-color: #fff9e6; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <h3>🧪 نشاط استكشافي: هيا نكتشف الرموز الهندسية!</h3>
        <h4>📌 النشاط 1: الانتماء وعدمه</h4>
        <p>لاحظ الشكل التالي:</p>
        <div style="display: flex; justify-content: center; margin: 30px 0;">
          <svg width="300" height="150" viewBox="0 0 300 150">
            <line x1="30" y1="80" x2="270" y2="80" stroke="black" stroke-width="4"/>
            <text x="30" y="75" fill="black">(d)</text>
            <circle cx="100" cy="80" r="4" fill="red"/>
            <text x="105" y="75" fill="red">A</text>
            <circle cx="200" cy="40" r="4" fill="blue"/>
            <text x="205" y="35" fill="blue">B</text>
          </svg>
        </div>
        <p><strong>❓ أسئلة موجهة:</strong></p>
        <ul>
          <li>هل النقطة A تقع على المستقيم (d)؟ <span style="background-color: #1976D2; color: white; padding: 3px 8px; border-radius: 15px;">نعم</span></li>
          <li>كيف نكتب ذلك؟ <span style="background-color: #FF9800; color: white; padding: 3px 8px; border-radius: 15px;"><span class="math">A ∈ (d)</span></span></li>
          <li>هل النقطة B تقع على المستقيم (d)؟ <span style="background-color: #4CAF50; color: white; padding: 3px 8px; border-radius: 15px;">لا</span></li>
          <li>كيف نكتب ذلك؟ <span style="background-color: #c2185b; color: white; padding: 3px 8px; border-radius: 15px;"><span class="math">B ∉ (d)</span></span></li>
        </ul>

        <h4>📌 النشاط 2: التوازي والتعامد</h4>
        <div style="display: flex; justify-content: space-around; margin: 30px 0;">
          <div style="text-align: center;">
            <svg width="150" height="100" viewBox="0 0 150 100">
              <line x1="20" y1="30" x2="130" y2="30" stroke="blue" stroke-width="3"/>
              <line x1="20" y1="60" x2="130" y2="60" stroke="red" stroke-width="3"/>
            </svg>
            <p><span class="math">(d) // (l)</span></p>
          </div>
          <div style="text-align: center;">
            <svg width="150" height="100" viewBox="0 0 150 100">
              <line x1="20" y1="50" x2="130" y2="50" stroke="blue" stroke-width="3"/>
              <line x1="75" y1="20" x2="75" y2="80" stroke="red" stroke-width="3"/>
              <path d="M65 50 L65 40 L75 40 L75 50 Z" fill="green"/>
            </svg>
            <p><span class="math">(d) ⊥ (l)</span></p>
          </div>
        </div>

        <h4>📌 النشاط 3: التقاطع</h4>
        <div style="display: flex; justify-content: center; margin: 30px 0;">
          <svg width="200" height="150" viewBox="0 0 200 150">
            <line x1="30" y1="30" x2="170" y2="120" stroke="blue" stroke-width="3"/>
            <line x1="30" y1="120" x2="170" y2="30" stroke="red" stroke-width="3"/>
            <circle cx="100" cy="75" r="4" fill="black"/>
            <text x="105" y="70" fill="black">O</text>
          </svg>
          <p style="margin-right: 20px;"><span class="math">(d) ∩ (l) = {O}</span></p>
        </div>

        <h4>📌 النشاط 4: تشفير تساوي الأطوال والزوايا</h4>
        <div style="display: flex; justify-content: space-around; margin: 30px 0;">
          <div style="text-align: center;">
            <svg width="150" height="80" viewBox="0 0 150 80">
              <line x1="20" y1="40" x2="70" y2="40" stroke="black" stroke-width="3"/>
              <text x="20" y="30" fill="blue">A</text>
              <line x1="20" y1="35" x2="20" y2="45" stroke="black" stroke-width="2"/>
              <text x="70" y="30" fill="blue">B</text>
              <line x1="70" y1="35" x2="70" y2="45" stroke="black" stroke-width="2"/>

              <line x1="45" y1="35" x2="45" y2="45" stroke="black" stroke-width="2"/>
              
              <line x1="80" y1="40" x2="130" y2="40" stroke="black" stroke-width="3"/>
              <text x="90" y="30" fill="blue">C</text>
              <line x1="80" y1="35" x2="80" y2="45" stroke="black" stroke-width="2"/>
              <text x="130" y="30" fill="blue">D</text>
              <line x1="130" y1="35" x2="130" y2="45" stroke="black" stroke-width="2"/>

              <line x1="105" y1="35" x2="105" y2="45" stroke="black" stroke-width="2"/>
              
              <text x="60" y="55" fill="red"><span class="math">AB = CD</span></text>
            </svg>
          </div>
          <div style="text-align: center;">
            <svg width="150" height="100" viewBox="0 0 150 100">
              <line x1="30" y1="70" x2="30" y2="30" stroke="black" stroke-width="3"/>
              <line x1="30" y1="70" x2="70" y2="70" stroke="black" stroke-width="3"/>
              <line x1="30" y1="70" x2="70" y2="30" stroke="red" stroke-width="3"/>
              <path d="M30 50 A10 10 0 0 1 40 60"
fill="none"
stroke="black"
stroke-width="2"/>

<path d="M40 60 A10 10 0 0 1 50 70"
fill="none"
stroke="black"
stroke-width="2"/>
                <text x="60" y="30" fill="red"><span class="math">xOy = 60°</span></text>
            </svg>
          </div>
        </div>
      </div>

      <!-- 3️⃣ بناء المفهوم -->
      <div style="background: linear-gradient(135deg, #43C6AC 0%, #191654 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
        <h3>📚 الرموز والمصطلحات الهندسية</h3>
      </div>
      <div style="background-color: #e3f2fd; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="border-right: 8px solid #1976D2; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h4>🔷 <span style="color: #1976D2;">الانتماء وعدم الانتماء</span></h4>
          <table style="width:100%; border-collapse: collapse;">
            <tr><th>الرمز</th><th>القراءة</th><th>المعنى</th></tr>
            <tr><td><span class="math">A ∈ (d)</span></td><td>A تنتمي إلى (d)</td><td>النقطة A تقع على المستقيم (d)</td></tr>
            <tr><td><span class="math">A ∉ (d)</span></td><td>A لا تنتمي إلى (d)</td><td>النقطة A لا تقع على المستقيم (d)</td></tr>
            <tr><td><span class="math">A ∈ [AB]</span></td><td>A تنتمي إلى القطعة [AB]</td><td>A طرف للقطعة [AB]</td></tr>
            <tr><td><span class="math">M ∈ [AB]</span></td><td>M تنتمي إلى [AB]</td><td>M نقطة داخلية في القطعة</td></tr>
          </table>
        </div>
        <div style="border-right: 8px solid #c2185b; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h4>🔷 <span style="color: #c2185b;">التوازي والتعامد</span></h4>
          <table style="width:100%; border-collapse: collapse;">
            <tr><th>الرمز</th><th>القراءة</th><th>المعنى</th></tr>
            <tr><td><span class="math">(d) // (l)</span></td><td>(d) يوازي (l)</td><td>المستقيمان متوازيان</td></tr>
            <tr><td><span class="math">(d) ⊥ (l)</span></td><td>(d) يعامد (l)</td><td>المستقيمان متعامدان</td></tr>
            <tr><td><span class="math">∟</span></td><td>زاوية قائمة</td><td>زاوية قياسها 90°</td></tr>
          </table>
        </div>
        <div style="border-right: 8px solid #4CAF50; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h4>🔷 <span style="color: #4CAF50;">التقاطع</span></h4>
          <table style="width:100%; border-collapse: collapse;">
            <tr><th>الرمز</th><th>القراءة</th><th>المعنى</th></tr>
            <tr><td><span class="math">(d) ∩ (l) = {A}</span></td><td>تقاطع (d) و (l) هو A</td><td>المستقيمان يتقاطعان في A</td></tr>
            <tr><td><span class="math">(d) ∩ (l) = ∅</span></td><td>تقاطع (d) و (l) خال</td><td>المستقيمان لا يتقاطعان (متوازيان)</td></tr>
          </table>
        </div>
        <div style="border-right: 8px solid #FF9800; background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h4>🔷 <span style="color: #FF9800;">تشفير تساوي الأطوال والزوايا</span></h4>
          <table style="width:100%; border-collapse: collapse;">
            <tr><th>الرمز</th><th>المعنى</th></tr>
            <tr><td><span class="math">AB = CD</span></td><td>طول القطعة AB يساوي طول القطعة CD</td></tr>
            <tr><td><span class="math">xOy = 60°</span></td><td>قياس الزاوية xOy يساوي 60 درجة</td></tr>
            <tr><td><span class="math">∠ABC = ∠DEF</span></td><td>الزاوية ABC تساوي الزاوية DEF</td></tr>
            <tr><td>علامات التشفير</td><td>شرطات صغيرة للدلالة على التساوي</td></tr>
          </table>
        </div>
      </div>

      <!-- 4️⃣ تمثيل متعدد للمفهوم -->
      <div style="background: linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
        <h3>🎭 أربع تمثيلات للرموز الهندسية</h3>
      </div>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;">
        <div style="background: linear-gradient(145deg, #ffffff, #e3f2fd); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <h4 style="color: #1976D2; text-align: center; font-size: 1.5em;">🔢 تمثيل عددي</h4>
          <div style="text-align: center;">
            <p><span class="math">AB = 5 cm, CD = 5 cm</span></p>
            <p><span class="math">⇒ AB = CD</span></p>
            <p><span class="math">xOy = 60°, uOv = 60°</span></p>
            <p><span class="math">⇒ xOy = uOv</span></p>
          </div>
        </div>
        <div style="background: linear-gradient(145deg, #ffffff, #ffebee); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <h4 style="color: #c2185b; text-align: center; font-size: 1.5em;">📝 تمثيل لفظي</h4>
          <ul style="font-size: 1.2em; list-style-type: none; padding: 0;">
            <li style="margin: 15px 0;">✓ "A على المستقيم d"</li>
            <li style="margin: 15px 0;">✓ "d يوازي l"</li>
            <li style="margin: 15px 0;">✓ "d يعامد l"</li>
            <li style="margin: 15px 0;">✓ "d و l يتقاطعان في O"</li>
          </ul>
        </div>
        <div style="background: linear-gradient(145deg, #ffffff, #e8f5e9); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <h4 style="color: #4CAF50; text-align: center; font-size: 1.5em;">📊 تمثيل هندسي</h4>
          <div style="text-align: center;">
            <svg width="150" height="120" viewBox="0 0 150 120">
              <line x1="20" y1="40" x2="130" y2="40" stroke="blue" stroke-width="3"/>
              <text x="20" y="35" fill="blue">(d)</text>
              <circle cx="75" cy="40" r="4" fill="red"/>
              <text x="80" y="35" fill="red">A</text>
              <line x1="20" y1="80" x2="130" y2="80" stroke="red" stroke-width="3"/>
              <text x="20" y="75" fill="red">(l)</text>
              <text x="60" y="100" fill="green"><span class="math">A ∈ (d), (d) // (l)</span></text>
            </svg>
          </div>
        </div>
        <div style="background: linear-gradient(145deg, #ffffff, #fff3e0); padding: 20px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
          <h4 style="color: #FF9800; text-align: center; font-size: 1.5em;">🔣 تمثيل جدولي</h4>
          <table style="width:100%; border-collapse: collapse; text-align: center;">
            <tr style="background-color: #FF9800; color: white;">
              <th style="padding: 5px;">المصطلح</th>
              <th style="padding: 5px;">الرسم</th>
              <th style="padding: 5px;">الرمز</th>
            </tr>
            <tr style="background-color: #fff3e0;">
              <td>انتماء</td>
              <td><span class="math">●</span></td>
              <td><span class="math">A ∈ (d)</span></td>
            </tr>
            <tr style="background-color: #ffe0b2;">
              <td>توازي</td>
              <td><span class="math">∥</span></td>
              <td><span class="math">(d) // (l)</span></td>
            </tr>
            <tr style="background-color: #ffcc80;">
              <td>تعامد</td>
              <td><span class="math">⊥</span></td>
              <td><span class="math">(d) ⊥ (l)</span></td>
            </tr>
          </table>
        </div>
      </div>

      <!-- ✨ خلاصة الدرس -->
      <div style="background: linear-gradient(135deg, #43C6AC 0%, #191654 100%); padding: 30px; border-radius: 15px; margin: 30px 0; text-align: center; color: white;">
        <h3>📌 ملخص الرموز الهندسية</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 30px 0;">
          <div style="background-color: rgba(255,255,255,0.9); padding: 20px; border-radius: 15px;">
            <h3 style="color: #1976D2;">🔷 الانتماء</h3>
            <p style="color: #100000"><span class="math">A ∈ (d)</span></p>
            <p style="color: #100000"><span class="math">A ∉ (d)</span></p>
          </div>
          <div style="background-color: rgba(255,255,255,0.9); padding: 20px; border-radius: 15px;">
            <h3 style="color: #c2185b;">🔶 التوازي</h3>
            <p style="color: #100000"><span class="math">(d) // (l)</span></p>
          </div>
          <div style="background-color: rgba(255,255,255,0.9); padding: 20px; border-radius: 15px;">
            <h3 style="color: #4CAF50;">🔷 التعامد</h3>
            <p style="color: #100000"><span class="math">(d) ⊥ (l)</span></p>
            <p style="color: #100000"><span class="math">∟</span></p>
          </div>
          <div style="background-color: rgba(255,255,255,0.9); padding: 20px; border-radius: 15px;">
            <h3 style="color: #FF9800;">🔶 التقاطع</h3>
            <p style="color: #100000"><span class="math">(d) ∩ (l) = {O}</span></p>
          </div>
        </div>
        <p style="background-color: rgba(255,255,255,0.95); padding: 20px; border-radius: 50px; font-size: 1.5em; color: #333; margin-top: 20px;">
          <strong>✨ اللغة الهندسية لغة عالمية ✨</strong>
        </p>
      </div>
    </div>
  `;

  // 5. Create Lesson
  const lesson = await prisma.lesson.create({
    data: {
      title: 'مصطلحات وترميزات هندسية',
      content: lessonContent,
      subjectId: subject.id,
      levelId: level.id,
      authorId: teacher.id,
      status: 'approved',
      type: 'public',
      lessonFileIds: JSON.stringify([]),
      exercises: {
        create: [
          // 🟢 تمارين الدعم (70%)
          {
            type: 'support_with_results',
            question: 'التمرين 01: أكمل الفراغات بالرمز المناسب:\n1) A تنتمي إلى المستقيم (d) نكتب: A ... (d)\n2) B لا تنتمي إلى المستقيم (l) نكتب: B ... (l)\n3) (d) يوازي (l) نكتب: (d) ... (l)\n4) (d) يعامد (l) نكتب: (d) ... (l)\n5) (d) و (l) يتقاطعان في O نكتب: (d) ... (l) = {O}',
            expectedResults: JSON.stringify([
              { question: "1", result: "∈", tolerance: 0 },
              { question: "2", result: "∉", tolerance: 0 },
              { question: "3", result: "//", tolerance: 0 },
              { question: "4", result: "⊥", tolerance: 0 },
              { question: "5", result: "∩", tolerance: 0 }
            ]),
            displayOrder: 1,
            maxScore: 5,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'support_with_results',
            question: 'التمرين 02: أكمل الجدول بالرموز المناسبة:\n1) A على المستقيم (d)\n2) B خارج المستقيم (l)\n3) المستقيمان متوازيان\n4) المستقيمان متعامدان\n5) تقاطع في O',
            expectedResults: JSON.stringify([
              { question: "1", result: "A ∈ (d)", tolerance: 0 },
              { question: "2", result: "B ∉ (l)", tolerance: 0 },
              { question: "3", result: "(d) // (l)", tolerance: 0 },
              { question: "4", result: "(d) ⊥ (l)", tolerance: 0 },
              { question: "5", result: "(d) ∩ (l) = {O}", tolerance: 0 }
            ]),
            displayOrder: 2,
            maxScore: 5,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'support_with_results',
            question: 'التمرين 03: اختر الإجابة الصحيحة:\n1) رمز الانتماء هو ...\n2) رمز التوازي هو ...\n3) رمز التعامد هو ...\n4) رمز التقاطع هو ...\n5) ∅ تعني ...',
            expectedResults: JSON.stringify([
              { question: "1", result: "∈", tolerance: 0 },
              { question: "2", result: "//", tolerance: 0 },
              { question: "3", result: "⊥", tolerance: 0 },
              { question: "4", result: "∩", tolerance: 0 },
              { question: "5", result: "مجموعة خالية", tolerance: 0 }
            ]),
            displayOrder: 3,
            maxScore: 5,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'support_with_results',
            question: 'التمرين 04: لاحظ الشكل ثم أجب (A على المستقيم، B خارج المستقيم):\n1) A ... (d)\n2) B ... (d)',
            expectedResults: JSON.stringify([
              { question: "1", result: "∈", tolerance: 0 },
              { question: "2", result: "∉", tolerance: 0 }
            ]),
            displayOrder: 4,
            maxScore: 2,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'support_with_results',
            question: 'التمرين 05: اكتب العلاقات من الشكل (مستقيمان متوازيان، A على d، B على l):\n1) (d) ... (l)\n2) A ... (d)\n3) B ... (l)',
            expectedResults: JSON.stringify([
              { question: "1", result: "//", tolerance: 0 },
              { question: "2", result: "∈", tolerance: 0 },
              { question: "3", result: "∈", tolerance: 0 }
            ]),
            displayOrder: 5,
            maxScore: 3,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'support_with_results',
            question: 'التمرين 06: أكمل بالرموز:\n1) A على المستقيم (d)\n2) (d) و (l) متوازيان\n3) (d) و (l) متعامدان\n4) B ليس على (d)\n5) C نقطة تقاطع (d) و (l)',
            expectedResults: JSON.stringify([
              { question: "1", result: "∈", tolerance: 0 },
              { question: "2", result: "//", tolerance: 0 },
              { question: "3", result: "⊥", tolerance: 0 },
              { question: "4", result: "∉", tolerance: 0 },
              { question: "5", result: "C", tolerance: 0 }
            ]),
            displayOrder: 6,
            maxScore: 5,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'support_with_results',
            question: 'التمرين 07: حلل الشكل (مستقيمان متوازيان وقاطع عمودي):\n1) (d) ... (l)\n2) (m) ... (d)\n3) (m) ... (l)',
            expectedResults: JSON.stringify([
              { question: "1", result: "//", tolerance: 0 },
              { question: "2", result: "⊥", tolerance: 0 },
              { question: "3", result: "⊥", tolerance: 0 }
            ]),
            displayOrder: 7,
            maxScore: 3,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          // 🔴 التمارين الرئيسية (30%)
          {
            type: 'main',
            question: 'التمرين 08: في مخطط بناء، نقرأ الرموز التالية: A ∈ (d)، (d) ⊥ (l)، (d) ∩ (l) = {O}.\nالمطلوب: ارسم شكلاً يحقق هذه الشروط.',
            modelAnswer: 'نرسم مستقيمين متعامدين يتقاطعان في O. نضع A على (d).',
            displayOrder: 8,
            maxScore: 5,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'main',
            question: 'التمرين 09: في مثلث ABC، لدينا: A ∈ (BC)، (AB) ⊥ (AC).\nالمطلوب: ارسم الشكل وفسر الرموز.',
            modelAnswer: 'A ∈ (BC) تعني A على المستقيم BC (أي B, A, C على استقامة).\n(AB) ⊥ (AC) تعني AB عمودي على AC (المثلث قائم في A).',
            displayOrder: 9,
            maxScore: 5,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
          },
          {
            type: 'main',
            question: 'التمرين 10: صف بالرموز الشكل التالي: مستقيمان (d) و (l) متوازيان، نقطة A على (d)، نقطة B على (l)، مستقيم (m) يعامد (d) ويقطعه في C.\nالمطلوب: اكتب جميع العلاقات بالرموز.',
            modelAnswer: '(d) // (l)\nA ∈ (d)\nB ∈ (l)\n(m) ⊥ (d)\n(m) ∩ (d) = {C}',
            displayOrder: 10,
            maxScore: 5,
            exerciseFileIds: JSON.stringify([]),
            questionFileIds: JSON.stringify([]),
            modelAnswerFileIds: JSON.stringify([]),
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