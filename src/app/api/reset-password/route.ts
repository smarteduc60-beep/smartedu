import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    const { token, password } = body;

    console.log(`[Reset Password API] Request received. Token present: ${!!token}`);

    if (!token || !password) {
      return NextResponse.json({ success: false, error: 'البيانات غير مكتملة' }, { status: 400 });
    }

    // البحث عن الرمز
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      console.log('[Reset Password API] Token not found');
      return NextResponse.json({ success: false, error: 'الرابط غير صالح أو قد تم استخدامه مسبقاً' }, { status: 400 });
    }

    // التحقق من الصلاحية الزمنية
    if (new Date() > resetToken.expires) {
      console.log('[Reset Password API] Token expired');
      await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
      return NextResponse.json({ success: false, error: 'الرابط منتهي الصلاحية' }, { status: 400 });
    }

    // تشفير كلمة المرور الجديدة
    const hashedPassword = await bcrypt.hash(password, 10);

    // تحديث كلمة المرور للمستخدم
    await prisma.user.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword },
    });

    // حذف الرمز المستخدم
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });

    console.log('[Reset Password API] Password updated successfully');
    return NextResponse.json({ success: true, message: 'تم تغيير كلمة المرور بنجاح' });

  } catch (error: any) {
    console.error('[Reset Password API] Error:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء إعادة تعيين كلمة المرور' }, { status: 500 });
  }
}