import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  بدء حذف البيانات من الجداول...');

  try {
    // حذف البيانات بالترتيب الصحيح (من الأسفل للأعلى في العلاقات)
    
    console.log('حذف الإجابات...');
    await prisma.submission.deleteMany({});
    
    console.log('حذف التمارين...');
    await prisma.exercise.deleteMany({});
    
    console.log('حذف الدروس...');
    await prisma.lesson.deleteMany({});
    
    console.log('حذف الرسائل...');
    await prisma.message.deleteMany({});
    
    console.log('حذف العلاقات بين المعلمين والطلاب...');
    await prisma.teacherStudentLink.deleteMany({});
    
    console.log('حذف العلاقات بين الأولياء والأبناء...');
    await prisma.parentChildLink.deleteMany({});
    
    console.log('حذف المواد...');
    await prisma.subject.deleteMany({});
    
    console.log('حذف المستويات...');
    await prisma.level.deleteMany({});
    
    console.log('حذف المراحل...');
    await prisma.stage.deleteMany({});
    
    console.log('حذف تفاصيل المستخدمين...');
    await prisma.userDetails.deleteMany({});
    
    console.log('✅ تم حذف جميع البيانات بنجاح (تم الاحتفاظ بجدول Users فقط)');
  } catch (error) {
    console.error('❌ خطأ في حذف البيانات:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
