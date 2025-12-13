'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { UploadCloud, X, FileImage, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  label: string;
  accept: string;
  maxSizeMB: number;
  value?: string;
  onChange: (base64: string | null) => void;
  preview?: boolean;
  description?: string;
}

export function FileUpload({
  label,
  accept,
  maxSizeMB,
  value,
  onChange,
  preview = true,
  description,
}: FileUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string>('');

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

    setIsLoading(true);
    setFileName(file.name);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const base64String = event.target?.result as string;
          
          // Check if base64 is too large (roughly 1.37x original size)
          const base64SizeMB = (base64String.length * 3) / (4 * 1024 * 1024);
          
          if (base64SizeMB > maxSizeMB * 1.5) {
            toast({
              title: 'الملف كبير جداً بعد التحويل',
              description: 'يرجى اختيار ملف أصغر حجماً',
              variant: 'destructive',
            });
            setIsLoading(false);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
            setFileName('');
            return;
          }
          
          onChange(base64String);
          setIsLoading(false);
          toast({
            title: 'تم الرفع بنجاح',
            description: `تم رفع الملف: ${file.name}`,
          });
        } catch (err) {
          console.error('Error processing file:', err);
          setIsLoading(false);
          toast({
            title: 'خطأ في المعالجة',
            description: 'فشل في معالجة الملف',
            variant: 'destructive',
          });
        }
      };
      reader.onerror = () => {
        setIsLoading(false);
        toast({
          title: 'خطأ في القراءة',
          description: 'فشل في قراءة الملف',
          variant: 'destructive',
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setFileName('');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File upload error:', error);
      setIsLoading(false);
      toast({
        title: 'خطأ',
        description: 'فشل في رفع الملف',
        variant: 'destructive',
      });
    }
  };

  const handleRemove = () => {
    onChange(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isImage = accept.includes('image');
  const isPdf = accept.includes('pdf');

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
                  {isImage && 'صورة (JPG, PNG, GIF)'}
                  {isPdf && 'ملف PDF'}
                  {' '}
                  - حتى {maxSizeMB} ميجابايت
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
          {preview && isImage && (
            <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-muted">
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {isPdf && (
            <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted">
              <FileText className="h-8 w-8 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">{fileName || 'ملف PDF'}</p>
                <p className="text-xs text-muted-foreground">تم الرفع بنجاح</p>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemove}
              className="flex-1"
            >
              <X className="ml-2 h-4 w-4" />
              إزالة الملف
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              <UploadCloud className="ml-2 h-4 w-4" />
              تغيير الملف
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
