import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 بدء فحص العلاقات والمعرفات (IDs Inspection)...\n');

  // 1. المراحل والمستويات
  console.log('--- 🏫 المراحل والمستويات (Stages & Levels) ---');
  const stages = await prisma.stage.findMany({
    include: { levels: true }
  });
  for (const stage of stages) {
    console.log(`Stage: [ID: ${stage.id}] ${stage.name}`);
    for (const level of stage.levels) {
      console.log(`  └─ Level: [ID: ${level.id}] ${level.name} (StageId: ${level.stageId})`);
    }
  }
  console.log('');

  // 2. المواد
  console.log('--- 📚 المواد (Subjects) ---');
  const subjects = await prisma.subject.findMany({
    include: { stage: true }
  });
  for (const subject of subjects) {
    console.log(`Subject: [ID: ${subject.id}] ${subject.name} (Stage: [ID: ${subject.stageId}] ${subject.stage?.name})`);
  }
  console.log('');

  // 3. المعلمون والمشرفون
  console.log('--- 👨‍🏫 المعلمون والمشرفون (Teachers & Supervisors) ---');
  const teachers = await prisma.user.findMany({
    where: {
      role: {
        name: { in: ['teacher', 'supervisor_specific'] }
      }
    },
    include: {
      userDetails: {
        include: {
          subject: true,
          level: true,
          stage: true
        }
      },
      role: true
    }
  });

  for (const t of teachers) {
    const d = t.userDetails;
    console.log(`User: [ID: ${t.id}] ${t.firstName} ${t.lastName} (${t.role.name})`);
    if (d) {
      console.log(`  ├─ المادة المرتبطة: [ID: ${d.subjectId}] ${d.subject?.name} (مرحلة المادة: ${d.subject?.stageId})`);
      console.log(`  ├─ المستوى المرتبط: [ID: ${d.levelId}] ${d.level?.name} (مرحلة المستوى: ${d.level?.stageId})`);
      console.log(`  └─ المرحلة المرتبطة: [ID: ${d.stageId}] ${d.stage?.name}`);
    } else {
      console.log(`  └─ ⚠️ لا توجد تفاصيل (UserDetails) لهذا المستخدم!`);
    }
  }
  console.log('');

  // 4. الطلاب
  console.log('--- 👨‍🎓 الطلاب (Students) ---');
  const students = await prisma.user.findMany({
    where: {
      role: { name: 'student' }
    },
    include: {
      userDetails: {
        include: {
          level: { include: { stage: true } }
        }
      }
    }
  });

  for (const s of students) {
    const d = s.userDetails;
    console.log(`Student: [ID: ${s.id}] ${s.firstName} ${s.lastName}`);
    if (d && d.level) {
      console.log(`  └─ مسجل في المستوى: [ID: ${d.levelId}] ${d.level.name} (المرحلة: [ID: ${d.level.stageId}] ${d.level.stage.name})`);
    } else {
      console.log(`  └─ ⚠️ غير مسجل في أي مستوى!`);
    }
  }
  console.log('');

  // 5. الدروس (جوهر المشكلة)
  console.log('--- 📖 الدروس (Lessons) ---');
  const lessons = await prisma.lesson.findMany({
    include: {
      subject: true,
      level: true,
      author: true
    }
  });

  for (const l of lessons) {
    console.log(`Lesson: [ID: ${l.id}] "${l.title}" (Type: ${l.type})`);
    console.log(`  ├─ المؤلف:  [ID: ${l.authorId}] ${l.author?.firstName} ${l.author?.lastName}`);
    console.log(`  ├─ المادة: [ID: ${l.subjectId}] ${l.subject?.name} (مرحلة المادة: ${l.subject?.stageId})`);
    console.log(`  └─ المستوى: [ID: ${l.levelId}] ${l.level?.name} (مرحلة المستوى: ${l.level?.stageId})`);
    
    // التحقق من عدم التطابق
    if (l.subject?.stageId !== l.level?.stageId) {
      console.log(`  ⚠️ تنبيه: عدم تطابق في المرحلة! (مرحلة المادة ${l.subject?.stageId} != مرحلة المستوى ${l.level?.stageId})`);
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