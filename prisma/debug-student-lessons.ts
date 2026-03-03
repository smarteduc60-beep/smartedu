import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // استبدل هذا بالبريد الإلكتروني للطالب الذي تواجه مشكلة معه
  // أو سأبحث عن أول طالب في النظام
  const studentEmail = 'snaa@smartedu.dz'; 
  const targetSubjectId = 4; // الرياضيات للمتوسط

  console.log(`🔍 تشخيص عدم ظهور الدروس للطالب: ${studentEmail} في المادة ${targetSubjectId}`);

  // 1. التحقق من بيانات الطالب
  const student = await prisma.user.findUnique({
    where: { email: studentEmail },
    include: {
      userDetails: true,
      role: true
    }
  });

  if (!student) {
    console.error('❌ الطالب غير موجود!');
    return;
  }

  console.log(`👤 الطالب: ${student.firstName} ${student.lastName} (ID: ${student.id})`);
  console.log(`   الدور: ${student.role.name}`);
  
  if (!student.userDetails?.levelId) {
    console.error('❌ الطالب ليس لديه مستوى (Level ID) محدد في ملفه الشخصي!');
    return;
  }
  console.log(`   المستوى المسجل: ${student.userDetails.levelId}`);

  // 2. التحقق من المعلمين المرتبطين
  const teacherLinks = await prisma.teacherStudentLink.findMany({
    where: { studentId: student.id },
    include: { teacher: true }
  });
  
  const teacherIds = teacherLinks.map(l => l.teacherId);
  console.log(`   المعلمون المرتبطون (${teacherIds.length}): ${teacherLinks.map(l => l.teacher.email).join(', ')}`);

  // 3. محاكاة استعلام الدروس (نفس المنطق المستخدم في API)
  console.log('\n📚 محاكاة البحث عن الدروس...');
  
  const whereCondition = {
    status: 'approved',
    OR: [
      // 1. الدروس العامة من مستوى التلميذ
      {
        type: { in: ['public', 'isPublic'] },
        levelId: student.userDetails.levelId,
        subjectId: targetSubjectId,
      },
      // 2. جميع دروس أساتذة التلميذ
      ...(teacherIds.length > 0 ? [{
        authorId: { in: teacherIds },
        status: 'approved',
        levelId: student.userDetails.levelId,
        subjectId: targetSubjectId,
      }] : []),
    ],
  };

  const lessons = await prisma.lesson.findMany({
    where: whereCondition,
    select: { id: true, title: true, type: true, status: true, levelId: true, subjectId: true, authorId: true }
  });

  console.log(`✅ تم العثور على ${lessons.length} درس مطابق للشروط.`);
  if (lessons.length > 0) {
    console.table(lessons.slice(0, 5)); // عرض أول 5 فقط
  } else {
    console.log('⚠️ لا توجد دروس! دعنا نتحقق من الأسباب المحتملة:');
  }

  // 4. التحقق من وجود أي دروس للمادة والمستوى بغض النظر عن الحالة
  const potentialLessons = await prisma.lesson.findMany({
    where: {
      subjectId: targetSubjectId,
      levelId: student.userDetails.levelId
    },
    select: { id: true, title: true, type: true, status: true, authorId: true }
  });

  console.log(`\n🔎 فحص شامل للدروس في المادة ${targetSubjectId} والمستوى ${student.userDetails.levelId}:`);
  console.log(`   إجمالي الدروس الموجودة: ${potentialLessons.length}`);
  
  const visibleIds = new Set(lessons.map(l => l.id));
  
  potentialLessons.forEach(l => {
    if (visibleIds.has(l.id)) return; // Skip visible lessons

    let reason = '';
    if (l.status !== 'approved') reason += `[الحالة ليست approved: ${l.status}] `;
    if (l.type !== 'public' && (!l.authorId || !teacherIds.includes(l.authorId))) reason += `[ليس عاماً وليس من معلمي الطالب] `;
    
    if (reason) {
      console.log(`   - الدرس "${l.title}" (ID: ${l.id}) مخفي بسبب: ${reason}`);
    } else {
      console.log(`   - الدرس "${l.title}" (ID: ${l.id}) مخفي لسبب غير معروف! (تحقق من شروط OR في الكود)`);
    }
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());