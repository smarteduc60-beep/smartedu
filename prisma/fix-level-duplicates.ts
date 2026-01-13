import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 بدء عملية فحص وإصلاح تكرار المستويات...');

  // 1. جلب جميع المستويات
  const levels = await prisma.level.findMany({
    orderBy: { id: 'asc' }
  });

  console.log(`📊 إجمالي المستويات الموجودة: ${levels.length}`);

  // 2. تجميع المستويات حسب الاسم والمرحلة
  const groups = new Map<string, typeof levels>();

  for (const level of levels) {
    // مفتاح التجميع: معرف المرحلة + اسم المستوى (مع إزالة المسافات الزائدة وتوحيد الحالة)
    const key = `${level.stageId}-${level.name.trim().toLowerCase()}`;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)?.push(level);
  }

  let duplicatesFound = 0;
  let fixedCount = 0;

  // 3. معالجة المجموعات المكررة
  for (const [key, group] of groups.entries()) {
    if (group.length > 1) {
      duplicatesFound++;
      const master = group[0]; // نعتمد المستوى الأول (الأقدم) كـ "أصلي"
      const duplicates = group.slice(1); // الباقي مكررات للحذف

      console.log(`\n⚠️ تم العثور على تكرار للمستوى: "${master.name}" (المرحلة: ${master.stageId})`);
      console.log(`   ✅ المستوى الأصلي (ID): ${master.id}`);
      console.log(`   ❌ المستويات المكررة (IDs): ${duplicates.map(d => d.id).join(', ')}`);

      for (const duplicate of duplicates) {
        console.log(`      🔄 جاري دمج بيانات المستوى المكرر ${duplicate.id} إلى ${master.id}...`);

        // أ. نقل المستخدمين (UserDetails)
        const users = await prisma.userDetails.updateMany({
          where: { levelId: duplicate.id },
          data: { levelId: master.id }
        });
        if (users.count > 0) console.log(`         - تم نقل ${users.count} مستخدم.`);

        // ب. نقل الدروس (Lesson)
        const lessons = await prisma.lesson.updateMany({
          where: { levelId: duplicate.id },
          data: { levelId: master.id }
        });
        if (lessons.count > 0) console.log(`         - تم نقل ${lessons.count} درس.`);

        // ج. نقل الترقيات (StudentPromotion - From)
        const promoFrom = await prisma.studentPromotion.updateMany({
          where: { fromLevelId: duplicate.id },
          data: { fromLevelId: master.id }
        });
        if (promoFrom.count > 0) console.log(`         - تم تصحيح ${promoFrom.count} ترقية (من).`);

        // د. نقل الترقيات (StudentPromotion - To)
        const promoTo = await prisma.studentPromotion.updateMany({
          where: { toLevelId: duplicate.id },
          data: { toLevelId: master.id }
        });
        if (promoTo.count > 0) console.log(`         - تم تصحيح ${promoTo.count} ترقية (إلى).`);

        // هـ. معالجة المواد (Subjects) - علاقة Many-to-Many ضمنية
        // نحتاج للبحث عن المواد المرتبطة بالمستوى المكرر وربطها بالأصلي
        const subjects = await prisma.subject.findMany({
          where: { levels: { some: { id: duplicate.id } } }
        });

        for (const subject of subjects) {
          // ربط المادة بالمستوى الأصلي (Prisma يتجاهل الربط إذا كان موجوداً بالفعل)
          await prisma.subject.update({
            where: { id: subject.id },
            data: {
              levels: {
                connect: { id: master.id }
              }
            }
          });
        }
        if (subjects.length > 0) console.log(`         - تم دمج ${subjects.length} مادة.`);

        // و. حذف المستوى المكرر
        await prisma.level.delete({
          where: { id: duplicate.id }
        });
        console.log(`         🗑️ تم حذف المستوى المكرر ${duplicate.id}`);
      }
      fixedCount++;
    }
  }

  if (duplicatesFound === 0) {
    console.log('\n✅ قاعدة البيانات نظيفة. لم يتم العثور على مستويات مكررة.');
  } else {
    console.log(`\n🎉 تمت العملية بنجاح! تم إصلاح ${fixedCount} مجموعة مكررة.`);
  }
}

main()
  .catch((e) => {
    console.error('❌ حدث خطأ غير متوقع:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });