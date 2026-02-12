import { toast } from '@/hooks/use-toast';

interface UploadResult {
  fileId: string;
  fileName: string;
  fileUrl: string;
}

/**
 * Uploads a file to the backend /api/upload endpoint.
 * @param file The file to upload.
 * @param hierarchy The folder structure for Google Drive
 * @returns A Promise that resolves to UploadResult on success, or rejects on failure.
 */
export async function uploadFileToDrive(
  file: File,
  hierarchy: {
    stage?: string;
    subject?: string;
    teacher?: string;
    lesson?: string;
  }
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('file', file);

  if (hierarchy.stage) formData.append('stage', hierarchy.stage);
  if (hierarchy.subject) formData.append('subject', hierarchy.subject);
  if (hierarchy.teacher) formData.append('teacher', hierarchy.teacher);
  if (hierarchy.lesson) formData.append('lesson', hierarchy.lesson);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'فشل في رفع الملف');
    }

    return result.data as UploadResult;
  } catch (error: any) {
    console.error('File upload error:', error);
    toast({
      title: 'خطأ في الرفع',
      description: error.message || 'حدث خطأ أثناء رفع الملف',
      variant: 'destructive',
    });
    throw error;
  }
}
