import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/mail';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, error: 'البريد الإلكتروني مطلوب' }, { status: 400 });
    }

    console.log(`[Forgot Password] Request for email: ${email}`);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // لأسباب أمنية، لا نخبر المستخدم إذا كان البريد غير موجود، لكننا نوقف العملية هنا
    if (!user) {
      console.log(`[Forgot Password] User not found for email: ${email}. Returning fake success.`);
      return NextResponse.json({ success: true, message: 'إذا كان البريد الإلكتروني مسجلاً، سيتم إرسال رابط إعادة التعيين.' });
    }

    // حذف أي رموز سابقة لهذا البريد لمنع التضارب
    await prisma.passwordResetToken.deleteMany({
      where: { email },
    });

    // توليد رمز عشوائي آمن
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600 * 1000); // صالح لمدة ساعة واحدة

    // حفظ الرمز في قاعدة البيانات
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    // إرسال البريد الإلكتروني
    console.log(`[Forgot Password] Sending email to: ${email}`);
    await sendPasswordResetEmail(email, token);
    console.log(`[Forgot Password] Email sent successfully.`);

    return NextResponse.json({ success: true, message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.' });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء معالجة الطلب' }, { status: 500 });
  }
}