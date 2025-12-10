import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 إنشاء حساب مدير جديد...');

  // استبدل هذه البيانات بمعلوماتك الحقيقية
  const email = 'your-email@example.com'; // ضع بريدك الإلكتروني هنا
  const password = 'YourSecurePassword123'; // ضع كلمة المرور هنا
  const firstName = 'Your First Name'; // اسمك الأول
  const lastName = 'Your Last Name'; // اسمك الأخير

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Get director role
  const directeurRole = await prisma.role.findUnique({ where: { name: 'directeur' } });

  if (!directeurRole) {
    throw new Error('دور المدير غير موجود في قاعدة البيانات!');
  }

  // Create Director
  const director = await prisma.user.upsert({
    where: { email: email },
    update: {
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    },
    create: {
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: hashedPassword,
      roleId: directeurRole.id,
    },
  });

  console.log('✅ تم إنشاء حساب المدير بنجاح!');
  console.log('📧 البريد الإلكتروني:', director.email);
  console.log('👤 الاسم:', firstName, lastName);
  console.log('\n🔐 يمكنك الآن تسجيل الدخول على: http://localhost:9002/login');
}

main()
  .catch((e) => {
    console.error('❌ خطأ:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
