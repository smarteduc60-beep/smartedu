import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { errorResponse, successResponse } from '@/lib/api-response';
import { uploadFileToHierarchy } from '@/lib/google-drive';

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    // دعم الأسماء القديمة والجديدة للحقول لضمان التوافق
    const stage = ((formData.get('stage') || formData.get('stageName')) as string)?.trim();
    const subject = ((formData.get('subject') || formData.get('subjectName')) as string)?.trim();
    const teacher = ((formData.get('teacher') || formData.get('teacherName')) as string)?.trim();
    const lesson = ((formData.get('lesson') || formData.get('lessonName')) as string)?.trim();
    const subfolder = (formData.get('subfolder') as string)?.trim();

    console.log(`[API] 📥 Received Upload Request: Stage=${stage}, Subject=${subject}, Teacher=${teacher}, Lesson=${lesson}`);

    if (!file) {
      return errorResponse('الملف مطلوب', 400);
    }

    if (!stage || !subject || !teacher || !lesson) {
      return errorResponse('جميع الحقول مطلوبة (المرحلة، المادة، الأستاذ، الدرس)', 400);
    }
    
    // تحويل الملف إلى Buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // بناء الهرمية
    const hierarchy = [stage, subject, teacher, lesson];
    if (subfolder) {
      hierarchy.push(subfolder);
    }
    console.log(`[API] 🗺️ Hierarchy to resolve: ${JSON.stringify(hierarchy)}`);

    // رفع الملف باستخدام الدالة الجديدة
    const driveResult = await uploadFileToHierarchy(
      fileBuffer,
      file.name,
      file.type,
      hierarchy
    );

    // تم إيقاف الحفظ التلقائي للدرس هنا لتجنب التكرار
    // سيتم حفظ الدرس بالكامل عند ضغط زر "حفظ" في واجهة المعلم

    return successResponse(
      { 
        fileId: driveResult.fileId, 
        fileName: file.name, 
        fileUrl: driveResult.webViewLink
      },
      'تم رفع الملف بنجاح',
      201
    );
  } catch (error: any) {
    console.error('Upload API Error:', error);

    // معالجة خطأ invalid_grant (سواء Service Account أو OAuth)
    if (error.message?.includes('invalid_grant')) {
      console.error('❌ Google Drive Auth Error: Invalid Credentials. Please check GOOGLE_CLIENT_EMAIL/KEY or REFRESH_TOKEN in .env');
      return errorResponse('خطأ في إعدادات Google Drive: بيانات الاعتماد غير صالحة (invalid_grant). يرجى مراجعة مدير النظام.', 500);
    }

    if (error.message.includes('Authentication required')) {
      return errorResponse('غير مصرح لك بالقيام بهذا الإجراء', 401);
    }
    return errorResponse(error.message || 'حدث خطأ غير متوقع', 500);
  }
}
