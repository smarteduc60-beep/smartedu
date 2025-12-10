import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 بدء إضافة المستخدمين...');

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Get role IDs
  const directeurRole = await prisma.role.findUnique({ where: { name: 'directeur' } });
  const teacherRole = await prisma.role.findUnique({ where: { name: 'teacher' } });
  const studentRole = await prisma.role.findUnique({ where: { name: 'student' } });
  const parentRole = await prisma.role.findUnique({ where: { name: 'parent' } });

  if (!directeurRole || !teacherRole || !studentRole || !parentRole) {
    throw new Error('الأدوار غير موجودة في قاعدة البيانات!');
  }

  // Create Director
  const director = await prisma.user.upsert({
    where: { email: 'Lakhdar.director@sep.com' },
    update: {},
    create: {
      email: 'Lakhdar.director@sep.com',
      firstName: 'Lakhdar',
      lastName: 'Ben Director',
      password: hashedPassword,
      roleId: directeurRole.id,
    },
  });
  console.log('✅ تم إنشاء حساب المدير:', director.email);

  // Create Teacher
  const teacher = await prisma.user.upsert({
    where: { email: 'ahmed.teacher@example.com' },
    update: {},
    create: {
      email: 'ahmed.teacher@example.com',
      firstName: 'Ahmed',
      lastName: 'Mahmoud',
      password: hashedPassword,
      roleId: teacherRole.id,
    },
  });
  console.log('✅ تم إنشاء حساب المعلم:', teacher.email);

  // Create Student
  const student = await prisma.user.upsert({
    where: { email: 'fatima.student@example.com' },
    update: {},
    create: {
      email: 'fatima.student@example.com',
      firstName: 'Fatima',
      lastName: 'Al-Ghamdi',
      password: hashedPassword,
      roleId: studentRole.id,
    },
  });
  console.log('✅ تم إنشاء حساب الطالب:', student.email);

  // Create Parent
  const parent = await prisma.user.upsert({
    where: { email: 'khalid.parent@example.com' },
    update: {},
    create: {
      email: 'khalid.parent@example.com',
      firstName: 'Khalid',
      lastName: 'Al-Ghamdi',
      password: hashedPassword,
      roleId: parentRole.id,
    },
  });
  console.log('✅ تم إنشاء حساب ولي الأمر:', parent.email);

  console.log('✅ تم إنشاء جميع المستخدمين بنجاح!');
  console.log('\n📋 الحسابات المتاحة:');
  console.log('المدير: Lakhdar.director@sep.com / password123');
  console.log('المعلم: ahmed.teacher@example.com / password123');
  console.log('الطالب: fatima.student@example.com / password123');
  console.log('ولي الأمر: khalid.parent@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ خطأ:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
