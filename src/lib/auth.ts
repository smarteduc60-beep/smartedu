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
                level: {
                  include: {
                    stage: true,
                  },
                },
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

        // Get stage_id from level if available, otherwise from userDetails
        const stageId = user.userDetails?.level?.stageId || user.userDetails?.stageId;

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          image: user.image,
          role: user.role.name,
          roleId: user.roleId,
          stage_id: stageId,
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
        // نقل البيانات المخصصة من user إلى token إذا توفرت
        if ('role' in user) token.role = user.role;
        if ('roleId' in user) token.roleId = user.roleId;
        if ('stage_id' in user) token.stage_id = user.stage_id;
      }

      // حفظ refresh_token في JWT لاستخدامه لاحقاً (مثلاً مع Google Drive)
      if (account?.refresh_token) {
        token.refreshToken = account.refresh_token;
      }

      // إذا كان التسجيل عبر Google أو إذا كانت البيانات ناقصة في الـ token (مثل role)
      // نقوم بجلب بيانات المستخدم من قاعدة البيانات لضمان تكامل الجلسة
      if (account?.provider === 'google' || (!token.role && token.sub)) {
        const userId = token.sub;
        if (userId) {
          try {
            const existingUser = await prisma.user.findUnique({
              where: { id: userId },
              include: { 
                role: true, 
                userDetails: {
                  include: {
                    level: { include: { stage: true } },
                  },
                },
              },
            });

            if (existingUser) {
              token.id = existingUser.id;
              token.role = existingUser.role.name;
              token.roleId = existingUser.roleId;
              token.stage_id = existingUser.userDetails?.level?.stageId || existingUser.userDetails?.stageId;
              
              if (!existingUser.userDetails) {
                token.needsProfileCompletion = true;
              }
            }
          } catch (error) {
            console.error('Error fetching user details in JWT callback:', error);
          }
        }
      }

      // شبكة أمان: ضمان وجود id في الـ token للاستخدامات اللاحقة
      if (!token.id && token.sub) {
        token.id = token.sub;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || (token.sub as string);
        session.user.role = token.role as string;
        session.user.roleId = token.roleId as number;
        session.user.stage_id = token.stage_id as number | undefined;
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

        // مستخدم جديد عبر Google: ننشئه يدوياً مع دور الطالب الافتراضي
        try {
          const studentRole = await prisma.role.findFirst({
            where: { name: 'student' },
          });

          if (!studentRole) {
            console.error("Default 'student' role not found in database. Please seed the roles table.");
            return '/login?error=ConfigurationError'; // Redirect to login with a generic error
          }

          // The adapter will link this user to the account automatically
          await prisma.user.create({
            data: {
              email: profile.email,
              firstName: profile.given_name || profile.name?.split(' ')[0] || 'مستخدم',
              lastName: profile.family_name || profile.name?.split(' ').slice(1).join(' ') || 'جديد',
              image: profile.picture,
              roleId: studentRole.id,
              emailVerified: new Date(), // Mark email as verified for Google users
            },
          });
          
          return true;
        } catch (error) {
          console.error('Error creating new user during Google sign-in:', error);
          return false;
        }
      }

      return true;
    },

    async redirect({ url, baseUrl }) {
      // السماح بإعادة التوجيه للروابط النسبية
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // السماح بإعادة التوجيه لنفس النطاق
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
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
