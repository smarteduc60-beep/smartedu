import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 بدء ملء قاعدة البيانات...');

  // 1. إنشاء الأدوار
  console.log('📝 إنشاء الأدوار...');
  const roles = await Promise.all([
    prisma.role.upsert({
      where: { name: 'directeur' },
      update: {},
      create: { name: 'directeur' },
    }),
    prisma.role.upsert({
      where: { name: 'supervisor_general' },
      update: {},
      create: { name: 'supervisor_general' },
    }),
    prisma.role.upsert({
      where: { name: 'supervisor_specific' },
      update: {},
      create: { name: 'supervisor_specific' },
    }),
    prisma.role.upsert({
      where: { name: 'teacher' },
      update: {},
      create: { name: 'teacher' },
    }),
    prisma.role.upsert({
      where: { name: 'student' },
      update: {},
      create: { name: 'student' },
    }),
    prisma.role.upsert({
      where: { name: 'parent' },
      update: {},
      create: { name: 'parent' },
    }),
  ]);

  const roleMap = {
    directeur: roles[0].id,
    supervisor_general: roles[1].id,
    supervisor_specific: roles[2].id,
    teacher: roles[3].id,
    student: roles[4].id,
    parent: roles[5].id,
  };

  console.log('✅ تم إنشاء الأدوار بنجاح');

  // 2. إنشاء المراحل الدراسية
  console.log('📚 إنشاء المراحل الدراسية...');
  const stage1 = await prisma.stage.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'مرحلة التعليم الإبتدائي',
      displayOrder: 1,
    },
  });

  const stage2 = await prisma.stage.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'مرحلة التعليم المتوسط',
      displayOrder: 2,
    },
  });

  const stage3 = await prisma.stage.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: 'مرحلة التعليم الثانوي',
      displayOrder: 3,
    },
  });

  console.log('✅ تم إنشاء المراحل الدراسية بنجاح');

  // 3. إنشاء المستويات
  console.log('📊 إنشاء المستويات...');
  await prisma.level.createMany({
    data: [
      { id: 1, name: 'الصف الأول الابتدائي', stageId: stage1.id, displayOrder: 1 },
      { id: 2, name: 'الصف الثاني الابتدائي', stageId: stage1.id, displayOrder: 2 },
      { id: 3, name: 'أولى متوسط', stageId: stage2.id, displayOrder: 1 },
      { id: 4, name: 'ثانية متوسط', stageId: stage2.id, displayOrder: 2 },
      { id: 5, name: 'ثالثة متوسط', stageId: stage2.id, displayOrder: 3 },
      { id: 6, name: 'رابعة متوسط', stageId: stage2.id, displayOrder: 4 },
    ],
    skipDuplicates: true,
  });

  console.log('✅ تم إنشاء المستويات بنجاح');

  // 4. إنشاء المواد
  console.log('📖 إنشاء المواد...');
  await prisma.subject.createMany({
    data: [
      { id: 1, name: 'الرياضيات', description: 'مادة الرياضيات للمرحلة الابتدائية', levelId: 1, stageId: stage1.id },
      { id: 2, name: 'اللغة العربية', description: 'مادة اللغة العربية للمرحلة الابتدائية', levelId: 1, stageId: stage1.id },
      { id: 3, name: 'العلوم', description: 'مادة العلوم للمرحلة الابتدائية', levelId: 1, stageId: stage1.id },
      { id: 4, name: 'الرياضيات', description: 'مادة الرياضيات للمرحلة المتوسطة', stageId: stage2.id },
      { id: 5, name: 'اللغة العربية', description: 'مادة اللغة العربية للمرحلة المتوسطة', stageId: stage2.id },
      { id: 6, name: 'العلوم الطبيعية', description: 'مادة العلوم الطبيعية للمرحلة المتوسطة', stageId: stage2.id },
      { id: 7, name: 'اللغة الفرنسية', description: 'مادة اللغة الفرنسية للمرحلة المتوسطة', stageId: stage2.id },
    ],
    skipDuplicates: true,
  });

  console.log('✅ تم إنشاء المواد بنجاح');

  // 5. إنشاء المستخدمين
  console.log('👥 إنشاء المستخدمين...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  // المدير
  const director = await prisma.user.upsert({
    where: { email: 'aisha.director@example.com' },
    update: {},
    create: {
      firstName: 'Aisha',
      lastName: 'Khan',
      email: 'aisha.director@example.com',
      password: hashedPassword,
      image: 'https://placehold.co/200x200/3F51B5/FFFFFF?text=AK',
      roleId: roleMap.directeur,
    },
  });

  // مشرف المادة
  const supervisor = await prisma.user.upsert({
    where: { email: 'youssef.supervisor@example.com' },
    update: {},
    create: {
      firstName: 'Youssef',
      lastName: 'Al-Farsi',
      email: 'youssef.supervisor@example.com',
      password: hashedPassword,
      image: 'https://placehold.co/200x200/7E57C2/FFFFFF?text=YF',
      roleId: roleMap.supervisor_specific,
      userDetails: {
        create: {
          subjectId: 1,
          teacherCode: 'T-SUPER-01',
        },
      },
    },
  });

  // معلم
  const teacher = await prisma.user.upsert({
    where: { email: 'ahmed.teacher@example.com' },
    update: {},
    create: {
      firstName: 'Ahmed',
      lastName: 'Mahmoud',
      email: 'ahmed.teacher@example.com',
      password: hashedPassword,
      image: 'https://placehold.co/200x200/2196F3/FFFFFF?text=AM',
      roleId: roleMap.teacher,
      userDetails: {
        create: {
          subjectId: 1,
          teacherCode: 'T9876',
        },
      },
    },
  });

  // ولي أمر
  const parent = await prisma.user.upsert({
    where: { email: 'khalid.parent@example.com' },
    update: {},
    create: {
      firstName: 'Khalid',
      lastName: 'Al-Ghamdi',
      email: 'khalid.parent@example.com',
      password: hashedPassword,
      image: 'https://placehold.co/200x200/FF9800/FFFFFF?text=KG',
      roleId: roleMap.parent,
      userDetails: {
        create: {
          parentCode: 'P54321',
        },
      },
    },
  });

  // طالب 1
  const student1 = await prisma.user.upsert({
    where: { email: 'fatima.student@example.com' },
    update: {},
    create: {
      firstName: 'Fatima',
      lastName: 'Al-Ghamdi',
      email: 'fatima.student@example.com',
      password: hashedPassword,
      image: 'https://placehold.co/200x200/4CAF50/FFFFFF?text=FG',
      roleId: roleMap.student,
      userDetails: {
        create: {
          levelId: 1,
          aiEvalMode: 'auto',
        },
      },
    },
  });

  // طالب 2
  const student2 = await prisma.user.upsert({
    where: { email: 'omar.student@example.com' },
    update: {},
    create: {
      firstName: 'Omar',
      lastName: 'Al-Ghamdi',
      email: 'omar.student@example.com',
      password: hashedPassword,
      image: 'https://placehold.co/200x200/F44336/FFFFFF?text=OG',
      roleId: roleMap.student,
      userDetails: {
        create: {
          levelId: 3,
          aiEvalMode: 'auto',
        },
      },
    },
  });

  console.log('✅ تم إنشاء المستخدمين بنجاح');

  // 6. إنشاء الروابط
  console.log('🔗 إنشاء الروابط...');

  // ربط المعلم بالطلاب
  await prisma.teacherStudentLink.createMany({
    data: [
      { teacherId: teacher.id, studentId: student1.id },
      { teacherId: supervisor.id, studentId: student2.id },
    ],
    skipDuplicates: true,
  });

  // ربط ولي الأمر بالطلاب
  await prisma.parentChildLink.createMany({
    data: [
      { parentId: parent.id, childId: student1.id },
      { parentId: parent.id, childId: student2.id },
    ],
    skipDuplicates: true,
  });

  console.log('✅ تم إنشاء الروابط بنجاح');

  console.log('\n✨ تم ملء قاعدة البيانات بنجاح!');
  console.log('\n📋 بيانات الدخول التجريبية:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('المدير:');
  console.log('  البريد: aisha.director@example.com');
  console.log('  كلمة المرور: password123');
  console.log('\nالمعلم:');
  console.log('  البريد: ahmed.teacher@example.com');
  console.log('  كلمة المرور: password123');
  console.log('\nالطالب:');
  console.log('  البريد: fatima.student@example.com');
  console.log('  كلمة المرور: password123');
  console.log('\nولي الأمر:');
  console.log('  البريد: khalid.parent@example.com');
  console.log('  كلمة المرور: password123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ خطأ في ملء قاعدة البيانات:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
