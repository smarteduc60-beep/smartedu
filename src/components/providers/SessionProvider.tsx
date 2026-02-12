'use client';

import { SessionProvider } from 'next-auth/react';

// Provider for NextAuth session
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}