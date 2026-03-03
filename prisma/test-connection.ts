import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔌 Testing database connection...');
    // طباعة الرابط مع إخفاء كلمة المرور للتأكد من قراءته بشكل صحيح
    console.log(`URL: ${process.env.DATABASE_URL?.replace(/:[^:]*@/, ':****@')}`); 
    await prisma.$connect();
    console.log('✅ Connection successful!');
    const count = await prisma.user.count();
    console.log(`📊 User count: ${count}`);
  } catch (e) {
    console.error('❌ Connection failed:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();