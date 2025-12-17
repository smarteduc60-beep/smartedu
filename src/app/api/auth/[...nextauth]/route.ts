import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions as any);

export { handler as GET, handler as POST };

export { handler as GET, handler as POST };*/
