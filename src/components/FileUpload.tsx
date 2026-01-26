'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { UploadCloud, X, File as FileIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  label: string;
  accept: string;
  maxSizeMB: number;
  value?: string; // Will now hold the file name
  onChange: (fileInfo: { fileId: string; fileName: string; fileUrl: string } | null) => void;
  onUploadStatusChange?: (isUploading: boolean) => void;
  parentFolderId?: string; // The Google Drive folder ID to upload to
  description?: string;
  stage?: string;
  subject?: string;
  teacher?: string;
  lesson?: string;
}

export function FileUpload({
  label,
  accept,
  maxSizeMB,
  value,
  onChange,
  onUploadStatusChange,
  parentFolderId,
  description,
  stage,
  subject,
  teacher,
  lesson,
}: FileUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      toast({
        title: 'حجم الملف كبير جداً',
        description: `يجب أن يكون حجم الملف أقل من ${maxSizeMB} ميجابايت. حجم الملف الحالي: ${fileSizeMB.toFixed(2)} ميجابايت`,
        variant: 'destructive',
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // التحقق من وجود البيانات الهرمية المطلوبة قبل الرفع
    if (!stage || !subject || !teacher || !lesson) {
      toast({
        title: 'بيانات ناقصة',
        description: 'يرجى تعبئة جميع الحقول (المرحلة، المادة، الأستاذ، الدرس) قبل رفع الملف.',
        variant: 'destructive',
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setIsLoading(true);
    onUploadStatusChange?.(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (parentFolderId) formData.append('parentFolderId', parentFolderId);
      formData.append('stage', stage);
      formData.append('subject', subject);
      formData.append('teacher', teacher);
      formData.append('lesson', lesson);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || 'فشل في رفع الملف');
      }
      
      const { fileId, fileName, fileUrl } = result.data;

      onChange({ fileId, fileName, fileUrl });
      
      toast({
        title: 'تم الرفع بنجاح',
        description: `تم رفع الملف: ${fileName}`,
      });

    } catch (error: any) {
      console.error('File upload error:', error);
      
      let errorMessage = 'فشل في رفع الملف. يرجى المحاولة مرة أخرى.';
      if (error.message) {
        errorMessage = error.message;
      }

      if (errorMessage.includes('invalid_grant')) {
         errorMessage = 'خطأ في إعدادات Google Drive (invalid_grant). يرجى التواصل مع الإدارة.';
      }

      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      onUploadStatusChange?.(false);
      // Clear the file input for re-uploading the same file if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {!value && (
        <div className="flex items-center justify-center w-full">
          <Label
            htmlFor={`file-upload-${label}`}
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-colors"
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Loader2 className="w-8 h-8 mb-4 text-muted-foreground animate-spin" />
                <p className="text-sm text-muted-foreground">جارٍ الرفع...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">انقر للرفع</span> أو اسحب وأفلت الملف
                </p>
                <p className="text-xs text-muted-foreground">
                  {`الملفات المسموح بها: ${accept} (حتى ${maxSizeMB} ميجابايت)`}
                </p>
              </div>
            )}
            <Input
              ref={fileInputRef}
              id={`file-upload-${label}`}
              type="file"
              className="hidden"
              accept={accept}
              onChange={handleFileChange}
              disabled={isLoading}
            />
          </Label>
        </div>
      )}

      {value && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted">
              <FileIcon className="h-8 w-8 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">{value}</p>
                <p className="text-xs text-muted-foreground">تم الرفع بنجاح</p>
              </div>
            </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              className="flex-1"
            >
              <X className="ml-2 h-4 w-4" />
              إزالة الملف
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
