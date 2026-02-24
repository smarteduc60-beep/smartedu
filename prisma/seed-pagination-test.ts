import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 بدء إنشاء 50 درس لاختبار التصفح (Pagination)...');

  try {
    // 1. العثور على المعلم المحدد
    const targetEmail = 'Math.Teacher.Cem@smartedu.com';
    let teacher = await prisma.user.findUnique({
      where: { email: targetEmail },
      include: { userDetails: true }
    });

    if (!teacher) {
      console.log(`⚠️ لم يتم العثور على المعلم ${targetEmail}، جاري البحث عن أي معلم آخر...`);
      teacher = await prisma.user.findFirst({
        where: { role: { name: 'teacher' } }
      });
    }

    if (!teacher) {
      console.error('❌ لم يتم العثور على أي معلم في قاعدة البيانات.');
      console.log('💡 يرجى تشغيل `npm run db:seed` أولاً لإنشاء المستخدمين الأساسيين.');
      return;
    }

    console.log(`👨‍🏫 المعلم المحدد: ${teacher.firstName} ${teacher.lastName} (${teacher.email})`);

    // 2. تحديد المادة والمستوى (من بيانات المعلم إن وجدت)
    let subjectId: number;
    let levelId: number;

    if (teacher.userDetails?.subjectId && teacher.userDetails?.levelId) {
      subjectId = teacher.userDetails.subjectId;
      levelId = teacher.userDetails.levelId;
      console.log(`✅ استخدام بيانات المعلم: Subject ID ${subjectId}, Level ID ${levelId}`);
    } else {
      const subject = await prisma.subject.findFirst();
      const level = await prisma.level.findFirst();
      if (!subject || !level) {
        console.error('❌ لم يتم العثور على مواد أو مستويات.');
        return;
      }
      subjectId = subject.id;
      levelId = level.id;
    }

    // 3. إعداد بيانات الدروس
    const lessonsToCreate = [];
    for (let i = 1; i <= 50; i++) {
      lessonsToCreate.push({
        title: `درس تجريبي ${i} - اختبار التصفح`,
        content: `
# محتوى الدرس التجريبي رقم ${i}

هذا محتوى مولد تلقائياً لاختبار نظام تقسيم الصفحات (Pagination).

## أهداف الدرس:
- اختبار سرعة التحميل.
- التأكد من عمل أزرار التنقل.
- التحقق من الفرز والترتيب.

يمكنك تعديل هذا المحتوى أو حذفه من لوحة التحكم.
        `.trim(),
        subjectId: subjectId,
        levelId: levelId,
        authorId: teacher.id,
        type: 'public', // تغيير إلى عام لزيادة احتمالية الظهور
        status: 'approved', // العودة إلى الحالة القياسية approved
        isLocked: false,
        // إضافة تواريخ مختلفة قليلاً لضمان ترتيب زمني متنوع (كل درس قبل ساعة من الذي قبله)
        createdAt: new Date(Date.now() - (50 - i) * 1000 * 60 * 60), 
      });
    }

    console.log(`🚀 جاري إدراج ${lessonsToCreate.length} درس في قاعدة البيانات...`);

    // 4. إدراج الدروس دفعة واحدة
    const result = await prisma.lesson.createMany({
      data: lessonsToCreate,
    });

    console.log(`✅ تم بنجاح! تمت إضافة ${result.count} درس.`);
    console.log(`🔗 يمكنك الآن التحقق من صفحة الدروس في لوحة تحكم المعلم.`);

  } catch (error) {
    console.error('❌ حدث خطأ أثناء العملية:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });