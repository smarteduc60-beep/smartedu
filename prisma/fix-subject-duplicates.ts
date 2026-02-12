import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 بدء عملية إصلاح تكرار المواد (Subject Duplication Fix)...');

  // 1. جلب جميع المواد مع المستويات المرتبطة بها
  const subjects = await prisma.subject.findMany({
    orderBy: { id: 'asc' },
    include: {
      levels: true // ضروري جداً لمعرفة المستويات التي تدرس هذه المادة
    }
  });

  console.log(`📊 إجمالي المواد الموجودة: ${subjects.length}`);

  // 2. تجميع المواد حسب الاسم والمرحلة
  const groups = new Map<string, typeof subjects>();
  
  for (const subject of subjects) {
    // توحيد الاسم لإزالة المسافات الزائدة
    const key = `${subject.stageId}-${subject.name.trim()}`;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)?.push(subject);
  }

  let fixedCount = 0;

  // 3. معالجة المجموعات المكررة
  for (const [key, group] of groups.entries()) {
    if (group.length > 1) {
      console.log(`\n📦 معالجة تكرار المادة: "${group[0].name}" (المرحلة: ${group[0].stageId})`);
      
      // تحديد المادة الرئيسية (الأكثر ارتباطاً بالبيانات)
      const subjectsWithCounts = await Promise.all(group.map(async (s) => {
        const lessonCount = await prisma.lesson.count({ where: { subjectId: s.id } });
        const userCount = await prisma.userDetails.count({ where: { subjectId: s.id } });
        // نفضل المادة التي لها مستويات مرتبطة بالفعل
        const levelCount = s.levels.length; 
        return { ...s, score: lessonCount + userCount + levelCount };
      }));

      // الترتيب تنازلياً حسب الـ Score (الأكثر بيانات أولاً)
      subjectsWithCounts.sort((a, b) => b.score - a.score || a.id - b.id);

      const master = subjectsWithCounts[0];
      const duplicates = subjectsWithCounts.slice(1);

      console.log(`   ✅ المادة الرئيسية: ID ${master.id} (Score: ${master.score})`);
      console.log(`   ❌ المواد للدمج: IDs ${duplicates.map(d => d.id).join(', ')}`);

      for (const duplicate of duplicates) {
        // أ. نقل الدروس
        const lessons = await prisma.lesson.updateMany({
          where: { subjectId: duplicate.id },
          data: { subjectId: master.id }
        });
        if (lessons.count > 0) console.log(`      🔄 تم نقل ${lessons.count} درس.`);

        // ب. نقل المستخدمين
        const users = await prisma.userDetails.updateMany({
          where: { subjectId: duplicate.id },
          data: { subjectId: master.id }
        });
        if (users.count > 0) console.log(`      🔄 تم نقل ${users.count} مستخدم.`);

        // ج. نقل ارتباطات المستويات (الخطوة الحاسمة)
        // لكل مستوى كان مرتبطاً بالمادة المكررة، نربطه بالمادة الرئيسية
        for (const level of duplicate.levels) {
          // التحقق مما إذا كانت المادة الرئيسية مرتبطة بالفعل بهذا المستوى
          const isAlreadyLinked = master.levels.some(l => l.id === level.id);
          
          if (!isAlreadyLinked) {
            console.log(`      🔗 ربط المستوى "${level.name}" بالمادة الرئيسية...`);
            await prisma.subject.update({
              where: { id: master.id },
              data: {
                levels: {
                  connect: { id: level.id }
                }
              }
            });
            // تحديث القائمة المحلية للمادة الرئيسية لتجنب التكرار في الدورة الحالية
            master.levels.push(level);
          }
        }

        // د. حذف المادة المكررة
        await prisma.subject.delete({
          where: { id: duplicate.id }
        });
        console.log(`      🗑️ تم حذف المادة المكررة ${duplicate.id}`);
      }
      fixedCount++;
    }
  }

  console.log(`\n🎉 تمت العملية بنجاح! تم دمج وإصلاح ${fixedCount} مجموعة مواد.`);
}

main()
  .catch((e) => {
    console.error('❌ حدث خطأ:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });