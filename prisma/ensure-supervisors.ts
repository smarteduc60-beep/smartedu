import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 فحص المشرفين على المواد (Subject Supervisors)...');

  // 1. البحث عن دور المشرف
  const supervisorRole = await prisma.role.findUnique({
    where: { name: 'supervisor_specific' },
  });

  if (!supervisorRole) {
    console.error('❌ الدور "supervisor_specific" غير موجود في قاعدة البيانات!');
    return;
  }

  // 2. البحث عن المستخدمين الذين لديهم هذا الدور
  const supervisors = await prisma.user.findMany({
    where: { roleId: supervisorRole.id },
    include: { 
      userDetails: { 
        include: { subject: true, level: true } 
      } 
    }
  });

  if (supervisors.length > 0) {
    console.log(`✅ تم العثور على ${supervisors.length} مشرف مادة:`);
    supervisors.forEach(s => {
      console.log(`   👤 ${s.firstName} ${s.lastName} (${s.email})`);
      console.log(`      المادة: ${s.userDetails?.subject?.name || 'غير محدد'}`);
      console.log(`      المستوى: ${s.userDetails?.level?.name || 'غير محدد'}`);
    });
  } else {
    console.log('⚠️ لا يوجد مشرفين حالياً.');
    
    // 3. محاولة ترقية معلم موجود إذا لم يوجد مشرفين
    console.log('🔄 جاري البحث عن معلم لترقيته...');
    
    const teacherRole = await prisma.role.findUnique({ where: { name: 'teacher' } });
    if (!teacherRole) return;

    const teacher = await prisma.user.findFirst({
      where: { roleId: teacherRole.id },
    });

    if (teacher) {
      await prisma.user.update({
        where: { id: teacher.id },
        data: { roleId: supervisorRole.id },
      });
      console.log(`✅ تم ترقية المعلم ${teacher.firstName} ${teacher.lastName} (${teacher.email}) إلى مشرف مادة.`);
    } else {
      console.log('❌ لم يتم العثور على أي معلم لترقيته.');
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });