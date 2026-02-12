import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { 
  prisma: PrismaClient;
  prismaCleanupSet?: boolean;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// تنظيف الاتصالات عند إيقاف التطبيق
// استخدام once بدلاً من on لتجنب memory leak
if (typeof window === 'undefined') {
  if (!globalForPrisma.prismaCleanupSet) {
    process.once('beforeExit', async () => {
      await prisma.$disconnect();
    });
    globalForPrisma.prismaCleanupSet = true;
  }
}
