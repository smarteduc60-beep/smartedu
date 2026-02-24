import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    // إزالة المسافات من كلمة المرور تلقائياً لتجنب أخطاء النسخ واللصق
    pass: process.env.SMTP_PASSWORD?.replace(/\s+/g, ''),
  },
  tls: {
    rejectUnauthorized: false,
  },
  family: 4, // إجبار استخدام IPv4 لتجنب مشاكل الاتصال (ETIMEDOUT)
  connectionTimeout: 30000, // زيادة المهلة إلى 30 ثانية
});

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>إعادة تعيين كلمة المرور</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5;">
      <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); direction: rtl; text-align: right;">
        
        <!-- Header with Logo/Brand -->
        <div style="background-color: #2563eb; padding: 30px; text-align: center;">
          <div style="display: inline-block; background-color: #ffffff; border-radius: 50%; padding: 12px; margin-bottom: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <img src="https://placehold.co/64x64/2563eb/ffffff?text=🏛️" alt="SmartEdu Logo" style="width: 64px; height: 64px; display: block; border-radius: 50%;">
          </div>
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 1px;">SmartEdu</h1>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #111827; margin-top: 0; font-size: 22px; margin-bottom: 20px;">إعادة تعيين كلمة المرور</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 15px;">مرحباً،</p>
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px;">لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك في منصة <strong>SmartEdu</strong>.</p>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetLink}" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);">
              تغيير كلمة المرور
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin-bottom: 10px;">هذا الرابط صالح لمدة ساعة واحدة فقط.</p>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">إذا لم تطلب هذا التغيير، يمكنك تجاهل هذا البريد الإلكتروني بأمان، ولن يتم إجراء أي تغييرات على حسابك.</p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            &copy; ${new Date().getFullYear()} SmartEdu Platform. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'SmartEdu - إعادة تعيين كلمة المرور',
      html,
    });
    console.log(`[Mail] Email sent: ${info.messageId}`);
  } catch (error) {
    console.error('[Mail] Error sending email:', error);
    throw new Error('فشل في إرسال البريد الإلكتروني');
  }
}