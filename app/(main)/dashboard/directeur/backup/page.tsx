'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Database, Download, Trash2, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Backup {
  id: string;
  filename: string;
  filepath: string;
  size: number;
  sizeInMB: string;
  type: string;
  status: string;
  createdAt: string;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function BackupPage() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [restoreId, setRestoreId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/backup/export');
      if (response.ok) {
        const data = await response.json();
        setBackups(data.backups);
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في جلب قائمة النسخ الاحتياطية',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async () => {
    try {
      setCreating(true);
      toast({
        title: 'جاري الإنشاء...',
        description: 'جاري إنشاء نسخة احتياطية جديدة، قد يستغرق هذا بضع دقائق...',
      });

      const response = await fetch('/api/backup/export', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'تم بنجاح',
          description: `تم إنشاء النسخة الاحتياطية: ${data.backup.filename}`,
        });
        fetchBackups();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message || 'فشل في إنشاء النسخة الاحتياطية',
        variant: 'destructive'
      });
    } finally {
      setCreating(false);
    }
  };

  const deleteBackup = async (id: string) => {
    try {
      const response = await fetch(`/api/backup/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'تم الحذف',
          description: 'تم حذف النسخة الاحتياطية بنجاح',
        });
        fetchBackups();
      } else {
        throw new Error('فشل الحذف');
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في حذف النسخة الاحتياطية',
        variant: 'destructive'
      });
    } finally {
      setDeleteId(null);
    }
  };

  const restoreBackup = async (id: string) => {
    try {
      toast({
        title: 'جاري الاستعادة...',
        description: 'جاري استعادة قاعدة البيانات، قد يستغرق هذا بضع دقائق...',
      });

      const response = await fetch('/api/backup/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backupId: id }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'تم بنجاح',
          description: 'تم استعادة قاعدة البيانات بنجاح',
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message || 'فشل في استعادة النسخة الاحتياطية',
        variant: 'destructive'
      });
    } finally {
      setRestoreId(null);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Database className="h-8 w-8" />
            النسخ الاحتياطي
          </h1>
          <p className="text-muted-foreground mt-2">
            إدارة النسخ الاحتياطية لقاعدة البيانات
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchBackups} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
          <Button onClick={createBackup} disabled={creating}>
            <Download className="h-4 w-4 ml-2" />
            {creating ? 'جاري الإنشاء...' : 'إنشاء نسخة احتياطية'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة النسخ الاحتياطية</CardTitle>
          <CardDescription>
            جميع النسخ الاحتياطية المحفوظة لقاعدة البيانات
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              جاري التحميل...
            </div>
          ) : backups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>لا توجد نسخ احتياطية</p>
              <p className="text-sm mt-2">قم بإنشاء نسخة احتياطية جديدة للبدء</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم الملف</TableHead>
                  <TableHead>الحجم</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تم الإنشاء</TableHead>
                  <TableHead>بواسطة</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backups.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell className="font-medium">
                      {backup.filename}
                    </TableCell>
                    <TableCell>{backup.sizeInMB} MB</TableCell>
                    <TableCell>
                      <Badge variant="outline">{backup.type}</Badge>
                    </TableCell>
                    <TableCell>
                      {backup.status === 'COMPLETED' ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          مكتمل
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {backup.status}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(backup.createdAt), {
                        addSuffix: true,
                        locale: ar
                      })}
                    </TableCell>
                    <TableCell>
                      {backup.createdBy.firstName} {backup.createdBy.lastName}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setRestoreId(backup.id)}
                          disabled={backup.status !== 'COMPLETED'}
                        >
                          <RefreshCw className="h-4 w-4 ml-1" />
                          استعادة
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteId(backup.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف هذه النسخة الاحتياطية؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && deleteBackup(deleteId)}>
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={!!restoreId} onOpenChange={() => setRestoreId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              تحذير: استعادة قاعدة البيانات
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-2">
                <p className="font-semibold">
                  سيتم استبدال قاعدة البيانات الحالية بالكامل بهذه النسخة الاحتياطية!
                </p>
                <p>
                  جميع البيانات الحالية (المستخدمين، الدروس، التمارين، الرسائل، إلخ) 
                  سيتم حذفها واستبدالها ببيانات النسخة الاحتياطية.
                </p>
                <p className="text-destructive font-semibold">
                  هل أنت متأكد من المتابعة؟
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => restoreId && restoreBackup(restoreId)}
              className="bg-destructive hover:bg-destructive/90"
            >
              نعم، استعادة النسخة الاحتياطية
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
