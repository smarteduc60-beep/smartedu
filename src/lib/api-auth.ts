import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error('يجب تسجيل الدخول أولاً');
  }
  return session;
}

export async function requireRole(allowedRoles: string[]) {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.user.role)) {
    throw new Error('ليس لديك صلاحية للوصول');
  }
  return session;
}
