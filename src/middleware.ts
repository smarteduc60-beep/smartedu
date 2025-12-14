// src/middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // الصفحات العامة - لا تحتاج تسجيل دخول
    const publicPaths = ['/', '/login', '/about', '/contact'];
    if (publicPaths.includes(path)) {
      return NextResponse.next();
    }

    // إذا كان المستخدم يحتاج لإكمال ملفه الشخصي
    if (token?.needsProfileCompletion && path !== '/complete-profile') {
      return NextResponse.redirect(new URL('/complete-profile', req.url));
    }

    // التحقق من الأذونات حسب الدور
    const role = token?.role;

    // حماية صفحات المدير
    if (path.startsWith('/dashboard/directeur') && role !== 'directeur') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // حماية صفحات المشرف
    if (
      path.startsWith('/dashboard/subject-supervisor') &&
      role !== 'supervisor_specific' &&
      role !== 'supervisor_general'
    ) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // حماية صفحات المعلم
    if (path.startsWith('/dashboard/teacher') && role !== 'teacher') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // حماية صفحات الطالب
    if (path.startsWith('/dashboard/student') && role !== 'student') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // حماية صفحات ولي الأمر
    if (path.startsWith('/dashboard/parent') && role !== 'parent') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // الوصول مسموح
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
);

// تحديد المسارات المحمية فقط
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/lessons/:path*',
    '/messages/:path*',
    '/profile/:path*',
    '/subjects/:path*',
  ],
};





































































































/*
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // إذا كان المستخدم يحتاج لإكمال ملفه الشخصي
    if (token?.needsProfileCompletion && path !== '/complete-profile') {
      return NextResponse.redirect(new URL('/complete-profile', req.url));
    }

    // التحقق من الأذونات حسب الدور
    const role = token?.role;

    // حماية صفحات المدير
    if (path.startsWith('/dashboard/directeur') && role !== 'directeur') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // حماية صفحات المشرف
    if (
      path.startsWith('/dashboard/subject-supervisor') &&
      role !== 'supervisor_specific' &&
      role !== 'supervisor_general'
    ) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // حماية صفحات المعلم
    if (path.startsWith('/dashboard/teacher') && role !== 'teacher') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // حماية صفحات الطالب
    if (path.startsWith('/dashboard/student') && role !== 'student') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // حماية صفحات ولي الأمر
    if (path.startsWith('/dashboard/parent') && role !== 'parent') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
);

// تحديد المسارات المحمية
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/lessons/:path*',
    '/messages/:path*',
    '/profile/:path*',
    '/subjects/:path*',
  ],
};*/