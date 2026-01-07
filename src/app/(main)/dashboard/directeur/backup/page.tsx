'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Loader2, ShieldCheck, AlertTriangle, CloudUpload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function BackupPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [isUploadingDrive, setIsUploadingDrive] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      const response = await fetch('/api/backup/export', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('فشل الاتصال بالخادم');
      }

      // معالجة تحميل الملف
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // استخراج اسم الملف من الهيدر إذا وجد، أو توليد اسم افتراضي
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `smartedu_backup_${new Date().toISOString().slice(0, 10)}.json`;
      if (contentDisposition && contentDisposition.includes('filename=')) {
        filename = contentDisposition.split('filename=')[1].replace(/"/g, '');
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "تم بنجاح",
        description: "تم تحميل النسخة الاحتياطية إلى جهازك.",
        variant: "default",
      });

    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء النسخة الاحتياطية.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDriveUpload = async () => {
    try {
      setIsUploadingDrive(true);
      
      const response = await fetch('/api/backup/export?uploadToDrive=true', {
        method: 'GET',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.details || 'فشل الاتصال بالخادم');
      }

      toast({
        title: "تم الرفع بنجاح",
        description: "تم حفظ النسخة الاحتياطية في مجلد System Backups على Google Drive.",
        variant: "default",
      });

    } catch (error: any) {
      console.error('Drive upload error:', error);
      toast({
        title: "خطأ في الرفع",
        description: error.message || "حدث خطأ أثناء الرفع إلى Google Drive.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingDrive(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">النسخ الاحتياطي</h1>
          <p className="text-muted-foreground">
            إدارة النسخ الاحتياطية لقاعدة البيانات وتصدير البيانات.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* بطاقة التصدير */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              نسخة احتياطية جديدة
            </CardTitle>
            <CardDescription>
              قم بإنشاء نسخة كاملة من قاعدة البيانات بصيغة JSON وتحميلها فوراً.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                  </div>
                  <div className="mr-3">
                    <h3 className="text-sm font-medium text-yellow-800">تنبيه هام</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        نظراً لطبيعة الاستضافة السحابية، يرجى الاحتفاظ بالملف المحمل في مكان آمن على جهازك الشخصي أو Google Drive. الملفات المحفوظة على السيرفر قد تُحذف عند التحديث.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleExport} 
                  disabled={isExporting || isUploadingDrive}
                  className="flex-1"
                  size="lg"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جاري التحميل...
                    </>
                  ) : (
                    <>
                      <Download className="ml-2 h-4 w-4" />
                      تحميل لجهازي
                    </>
                  )}
                </Button>

                <Button 
                  onClick={handleDriveUpload} 
                  disabled={isExporting || isUploadingDrive}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  {isUploadingDrive ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جاري الرفع...
                    </>
                  ) : (
                    <>
                      <CloudUpload className="ml-2 h-4 w-4" />
                      رفع إلى Google Drive
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* بطاقة المعلومات */}
        <Card>
          <CardHeader>
            <CardTitle>معلومات النظام</CardTitle>
            <CardDescription>تفاصيل حول البيانات التي سيتم نسخها.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-sm font-medium">نوع النسخة</span>
              <span className="text-sm text-muted-foreground">Full JSON Dump</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-sm font-medium">الجداول المشمولة</span>
              <span className="text-sm text-muted-foreground">المستخدمين، الدروس، التمارين، النتائج</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-sm font-medium">التشفير</span>
              <span className="text-sm text-muted-foreground">لا (احفظ الملف في مكان آمن)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">تاريخ اليوم</span>
              <span className="text-sm text-muted-foreground">
                {format(new Date(), 'PPP', { locale: ar })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}