import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: string;
      roleId: number;
      needsProfileCompletion?: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    role?: string;
    roleId?: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    roleId: number;
    needsProfileCompletion?: boolean;
  }
}
