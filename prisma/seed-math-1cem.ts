import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runScript(scriptPath: string) {
  console.log(`🚀 Running: ${scriptPath}...`);
  try {
    const { stdout, stderr } = await execAsync(`npx tsx ${scriptPath}`);
    console.log(stdout);
    if (stderr) console.error(stderr);
    console.log(`✅ Finished: ${scriptPath}\n`);
  } catch (error) {
    console.error(`❌ Error running ${scriptPath}:`, error);
    process.exit(1); // Stop execution on error
  }
}

async function main() {
  console.log('📚 Starting Math 1CEM Lessons Seeding...\n');

  const scripts = [
    // --- Maktaa 1: Numbers & Calculations ---
     'prisma/Math-Firstmiddle/Maktaa-1/lesson-decimal-numbers.ts', // العدد العشري والكتابة العشرية
     'prisma/Math-Firstmiddle/Maktaa-1/lesson-decimal-fractions.ts', // الكسور العشرية (الأجزاء من 10، 100، 1000)
     'prisma/Math-Firstmiddle/Maktaa-1/lesson-decimal-to-fraction.ts', // الانتقال من كتابة عشرية إلى كتابة كسرية
     'prisma/Math-Firstmiddle/Maktaa-1/lesson-multiplication-decimals.ts', // الضرب في 0,1 أو 0,01 أو 0,001
     'prisma/Math-Firstmiddle/Maktaa-1/lesson-division-by-10-100-1000.ts', // القسمة على 10 أو 100 أو 1000
     'prisma/Math-Firstmiddle/Maktaa-1/lesson-number-line.ts', // التعليم على نصف مستقيم مدرّج
     'prisma/Math-Firstmiddle/Maktaa-1/lesson-compare-decimals.ts', // مقارنة وترتيب الأعداد العشرية
     'prisma/Math-Firstmiddle/Maktaa-1/lesson-operations-decimals.ts', // جمع وطرح وضرب أعداد عشرية

    // --- Maktaa 2: Geometry Basics ---
    'prisma/Math-Firstmiddle/Maktaa-2/lesson-parallel-perpendicular.ts', // التوازي والتعامد
    'prisma/Math-Firstmiddle/Maktaa-2/lesson-construction-parallel-perpendicular.ts', // الإنشاءات الهندسية (توازي/تعامد)
    'prisma/Math-Firstmiddle/Maktaa-2/lesson-perpendicular-relations.ts', // المستقيمان العموديان وعلاقات التوازي والتعامد
    'prisma/Math-Firstmiddle/Maktaa-2/lesson-angles-terminology.ts', // الزاوية (مصطلحات وترميزات)
    'prisma/Math-Firstmiddle/Maktaa-2/lesson-circle-terminology.ts', // الدائرة (تسميات وتعاريف)
    'prisma/Math-Firstmiddle/Maktaa-2/lesson-special-triangles.ts', // المثلثات الخاصة
    'prisma/Math-Firstmiddle/Maktaa-2/lesson-special-quadrilaterals.ts', // الرباعيات الخاصة
    'prisma/Math-Firstmiddle/Maktaa-2/lesson-measurement-units.ts', // وحدات القياس
    'prisma/Math-Firstmiddle/Maktaa-2/lesson-area-perimeter.ts', // مفهوم المساحة والمحيط
    'prisma/Math-Firstmiddle/Maktaa-2/lesson-perimeter-area-square-rectangle.ts', // محيط ومساحة المربع والمستطيل
    'prisma/Math-Firstmiddle/Maktaa-2/lesson-perimeter-area-right-triangle.ts', // محيط ومساحة المثلث القائم

    // --- Maktaa 3: Division & Divisibility ---
    'prisma/Math-Firstmiddle/Maktaa-3/lesson-euclidean-division.ts', // القسمة الإقليدية
    'prisma/Math-Firstmiddle/Maktaa-3/lesson-divisibility-rules.ts', // قواعد قابلية القسمة
    'prisma/Math-Firstmiddle/Maktaa-3/lesson-decimal-division.ts', // القسمة العشرية
    'prisma/Math-Firstmiddle/Maktaa-3/lesson-rounding-values.ts', // القيم المقربة
    'prisma/Math-Firstmiddle/Maktaa-3/lesson-rounding-to-unit.ts', // القيمة المقربة إلى الوحدة

    // --- Maktaa 4: Symmetry ---
    'prisma/Math-Firstmiddle/Maktaa-4/lesson-symmetrical-shapes.ts', // الأشكال المتناظرة
    'prisma/Math-Firstmiddle/Maktaa-4/lesson-axial-symmetry-properties.ts', // خواص التناظر المحوري
    'prisma/Math-Firstmiddle/Maktaa-4/lesson-axial-symmetry-construction.ts', // إنشاء نظير شكل
    'prisma/Math-Firstmiddle/Maktaa-4/lesson-axial-symmetry-shape-construction.ts', // استعمال التناظر لإنشاء أشكال
    'prisma/Math-Firstmiddle/Maktaa-4/lesson-segment-axis-angle-bisector.ts', // محور قطعة ومنصف زاوية
  ];

  for (const script of scripts) {
    await runScript(script);
  }

  console.log('🎉 All lessons seeded successfully!');
}

main();