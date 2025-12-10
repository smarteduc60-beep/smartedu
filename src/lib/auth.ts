import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'البريد الإلكتروني', type: 'email' },
        password: { label: 'كلمة المرور', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('البريد الإلكتروني وكلمة المرور مطلوبان');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            role: true,
            userDetails: {
              include: {
                stage: true,
                level: true,
                subject: true,
              },
            },
          },
        });

        if (!user || !user.password) {
          throw new Error('بيانات الدخول غير صحيحة');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('بيانات الدخول غير صحيحة');
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          image: user.image,
          role: user.role.name,
          roleId: user.roleId,
        };
      },
    }),

    // تسجيل الدخول عبر Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, profile }) {
      // عند تسجيل الدخول لأول مرة
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.roleId = user.roleId;
      }

      // إذا كان التسجيل عبر Google ولأول مرة
      if (account?.provider === 'google' && profile) {
        const existingUser = await prisma.user.findUnique({
          where: { id: token.sub },
          include: { role: true, userDetails: true },
        });

        if (existingUser) {
          token.role = existingUser.role.name;
          token.roleId = existingUser.roleId;
          
          // إذا لم يكمل المستخدم ملفه الشخصي، نوجهه لصفحة الإكمال
          if (!existingUser.userDetails) {
            token.needsProfileCompletion = true;
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.roleId = token.roleId as number;
        session.user.needsProfileCompletion = token.needsProfileCompletion as boolean;
      }
      return session;
    },

    async signIn({ user, account, profile }) {
      // السماح بتسجيل الدخول عبر Credentials دائماً
      if (account?.provider === 'credentials') {
        return true;
      }

      // للتسجيل عبر Google
      if (account?.provider === 'google' && profile?.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email },
          include: { userDetails: true },
        });

        // إذا كان المستخدم موجود، نسمح بالدخول
        if (existingUser) {
          return true;
        }

        // إذا كان مستخدم جديد عبر Google، ننشئ حساب أساسي
        // سيكون عليه إكمال ملفه الشخصي لاحقاً
        try {
          // نحصل على دور الطالب كافتراضي (يمكن تغييره)
          const studentRole = await prisma.role.findFirst({
            where: { name: 'student' },
          });

          if (!studentRole) {
            throw new Error('لم يتم العثور على دور الطالب');
          }

          // سيتم إنشاء المستخدم تلقائياً بواسطة PrismaAdapter
          // لكن نحتاج التأكد من وجود firstName و lastName
          return true;
        } catch (error) {
          console.error('خطأ في إنشاء المستخدم:', error);
          return false;
        }
      }

      return true;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
    newUser: '/complete-profile', // المستخدمون الجدد عبر Google
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 يوم
  },

  secret: process.env.NEXTAUTH_SECRET,
};
