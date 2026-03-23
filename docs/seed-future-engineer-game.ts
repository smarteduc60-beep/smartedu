import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🏗️  بدء إضافة درس لعبة مهندسو المستقبل...');

  const teacher = await prisma.user.findUnique({
    where: { email: 'ladj14013@gmail.com' },
    include: { userDetails: true },
  });

  if (!teacher || !teacher.userDetails?.subjectId || !teacher.userDetails?.levelId) {
    console.error('❌ لم يتم العثور على المعلم أو تفاصيله (المادة/المستوى).');
    return;
  }

  const lessonTitle = '🏗️ مهندسو المستقبل - مغامرة الهندسة';
  const subjectId = teacher.userDetails.subjectId;
  const levelId = teacher.userDetails.levelId;

  // Game configuration extracted from the provided HTML
  const gameConfig = {
    type: 'FUTURE_ENGINEER',
    chapters: [
        {
            id: 0,
            title: "📏 توازي مستقيمين",
            icon: "📏",
            desc: "تعلم كيف تحدد إذا كان مستقيمان متوازيين",
            difficulty: "beginner",
            questions: [
                {
                    text: "أي من المستقيمين التاليين متوازيان؟",
                    hint: "المستقيمان المتوازيان لا يلتقيان أبداً ولهما نفس الاتجاه",
                    type: "drawing",
                    answer: "parallel",
                    options: ["المستقيمان أ و ب", "المستقيمان ج و د", "المستقيمان هـ و و", "لا شيء"],
                    elements: [
                        {type: "line", id: "A", x1: 100, y1: 100, x2: 300, y2: 100, name: "أ"},
                        {type: "line", id: "B", x1: 100, y1: 200, x2: 300, y2: 200, name: "ب"},
                        {type: "line", id: "C", x1: 400, y1: 50, x2: 600, y2: 200, name: "ج"},
                        {type: "line", id: "D", x1: 450, y1: 50, x2: 650, y2: 200, name: "د"},
                        {type: "line", id: "E", x1: 100, y1: 300, x2: 300, y2: 400, name: "هـ"},
                        {type: "line", id: "F", x1: 150, y1: 300, x2: 350, y2: 400, name: "و"}
                    ]
                },
                {
                    text: "ارسم مستقيماً موازياً للمستقيم الأحمر",
                    hint: "استخدم أداة 'رسم مستقيم' ثم اضغط مع السحب لرسم مستقيم بنفس الاتجاه",
                    type: "interactive",
                    answer: "parallel_drawn",
                    elements: [
                        {type: "line", id: "ref", x1: 200, y1: 150, x2: 500, y2: 150, color: "red", name: "المستقيم المرجعي"}
                    ]
                },
                {
                    text: "إذا كان المستقيم L1 يمر بالنقطتين (0,0) و (2,2)، والمستقيم L2 يمر بالنقطتين (1,1) و (3,3). ماذا يمكنك القول عن L1 و L2؟",
                    hint: "قارن ميل كل مستقيم (التغير في y ÷ التغير في x)",
                    type: "mcq",
                    answer: "متوازيان",
                    options: ["متوازيان", "متقاطعان", "متعامدان", "لا يمكن تحديد"]
                }
            ]
        },
        {
            id: 1,
            title: "✝️ تقاطع وتعامد مستقيمين",
            icon: "✝️",
            desc: "اكتشف متى تتقاطع المستقيمات ومتى تتعامد",
            difficulty: "intermediate",
            questions: [
                {
                    text: "أي من المستقيمين التاليين متعامدان؟",
                    hint: "المستقيمان المتعامدان يلتقيان بزاوية قائمة (90 درجة)",
                    type: "drawing",
                    answer: "perpendicular",
                    options: ["المستقيمان أ و ب", "المستقيمان ج و د", "المستقيمان هـ و و", "المستقيمان ز و ح"],
                    elements: [
                        {type: "line", id: "A", x1: 100, y1: 100, x2: 200, y2: 100, name: "أ"},
                        {type: "line", id: "B", x1: 150, y1: 50, x2: 150, y2: 150, name: "ب"},
                        {type: "line", id: "C", x1: 300, y1: 50, x2: 500, y2: 150, name: "ج"},
                        {type: "line", id: "D", x1: 400, y1: 100, x2: 600, y2: 200, name: "د"},
                        {type: "line", id: "E", x1: 100, y1: 250, x2: 250, y2: 250, name: "هـ"},
                        {type: "line", id: "F", x1: 175, y1: 200, x2: 175, y2: 300, name: "و"},
                        {type: "line", id: "G", x1: 350, y1: 250, x2: 450, y2: 250, name: "ز"},
                        {type: "line", id: "H", x1: 400, y1: 200, x2: 400, y2: 300, name: "ح"}
                    ]
                },
                {
                    text: "حدد نقطة تقاطع المستقيمين الأحمر والأزرق",
                    hint: "انقر على نقطة التقاطع في الرسم",
                    type: "interactive",
                    answer: {x: 300, y: 200},
                    elements: [
                        {type: "line", id: "L1", x1: 100, y1: 200, x2: 500, y2: 200, color: "red", name: "أحمر"},
                        {type: "line", id: "L2", x1: 300, y1: 100, x2: 300, y2: 300, color: "blue", name: "أزرق"}
                    ]
                },
                {
                    text: "إذا كان مستقيمان متعامدين، فإن الزاوية بينهما تساوي:",
                    hint: "الزاوية القائمة هي 90 درجة",
                    type: "mcq",
                    answer: "90°",
                    options: ["45°", "60°", "90°", "180°"]
                }
            ]
        },
        {
            id: 2,
            title: "📐 نقل طول وتعيين منتصف قطعة مستقيم",
            icon: "📐",
            desc: "تعلم كيف تنقل الأطوال وتجد المنتصف",
            difficulty: "advanced",
            questions: [
                {
                    text: "أي نقطة تمثل منتصف القطعة AB؟",
                    hint: "المنتصف يقسم القطعة إلى جزأين متساويين",
                    type: "drawing",
                    answer: "M",
                    options: ["النقطة C", "النقطة M", "النقطة N", "النقطة P"],
                    elements: [
                        {type: "line", id: "AB", x1: 200, y1: 150, x2: 500, y2: 150, color: "black", name: "AB"},
                        {type: "point", id: "A", x: 200, y: 150, name: "A"},
                        {type: "point", id: "B", x: 500, y: 150, name: "B"},
                        {type: "point", id: "M", x: 350, y: 150, name: "M"},
                        {type: "point", id: "C", x: 275, y: 150, name: "C"},
                        {type: "point", id: "N", x: 425, y: 150, name: "N"}
                    ]
                },
                {
                    text: "انقل طول القطعة CD إلى النقطة E",
                    hint: "استخدم أداة 'نقل طول' ثم انقر على C ثم D ثم E",
                    type: "interactive",
                    answer: "transferred",
                    elements: [
                        {type: "line", id: "CD", x1: 150, y1: 250, x2: 250, y2: 250, color: "blue", name: "CD"},
                        {type: "point", id: "C", x: 150, y: 250, name: "C"},
                        {type: "point", id: "D", x: 250, y: 250, name: "D"},
                        {type: "point", id: "E", x: 400, y: 250, name: "E"}
                    ]
                },
                {
                    text: "طول القطعة MN هو 6 سم. إذا كانت M هي نقطة المنتصف للقطعة PQ، فما طول PQ؟",
                    hint: "منتصف القطعة يعني PQ = 2 × MN",
                    type: "mcq",
                    answer: "12 سم",
                    options: ["3 سم", "6 سم", "12 سم", "18 سم"]
                }
            ]
        }
    ]
  };

  // حذف الدرس القديم لتجنب التكرار
  await prisma.lesson.deleteMany({
    where: {
      title: lessonTitle,
      authorId: teacher.id,
    },
  });

  // إنشاء الدرس
  const gameLesson = await prisma.lesson.create({
    data: {
      title: lessonTitle,
      content: 'لعبة تفاعلية لتعلم أساسيات الهندسة: التوازي، التعامد، والقياسات.',
      authorId: teacher.id,
      subjectId: subjectId,
      levelId: levelId,
      type: 'private', // خاصة بطلاب هذا المعلم
      status: 'approved',
      published: true,
      contentType: 'GAME',
      gameConfig: gameConfig as any, // Cast to any to avoid type issues with JSON
      lessonFileIds: '[]',
    },
  });

  console.log(`✅ تم إنشاء درس اللعبة بنجاح!`);
  console.log(`   - عنوان الدرس: ${gameLesson.title}`);
  console.log(`   - ID الدرس: ${gameLesson.id}`);
}

main()
  .catch((e) => {
    console.error('❌ خطأ في إضافة درس اللعبة:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });