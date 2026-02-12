'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Loader2, Search, Trash2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface OrphanedFolder {
  id: string;
  name: string;
  webViewLink: string;
  createdTime: string;
}

interface ScanStats {
  driveFolderCount: number;
  dbFolderCount: number;
  orphanedCount: number;
}

export default function DriveCleanupPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [scanResults, setScanResults] = useState<OrphanedFolder[] | null>(null);
  const [stats, setStats] = useState<ScanStats | null>(null);
  const [selectedFolders, setSelectedFolders] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();

  const handleScan = async () => {
    setIsScanning(true);
    setScanResults(null);
    setStats(null);
    setSelectedFolders(new Set());
    toast({ title: 'بدء الفحص', description: 'جاري فحص مجلدات Google Drive... قد تستغرق هذه العملية بعض الوقت.' });

    try {
      const response = await fetch('/api/drive/cleanup');
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'فشل الفحص');
      }

      setScanResults(result.data.orphanedFolders);
      setStats(result.data.stats);
      toast({ title: 'اكتمل الفحص', description: `تم العثور على ${result.data.orphanedFolders.length} مجلد يتيم.` });
    } catch (error: any) {
      toast({ title: 'خطأ في الفحص', description: error.message, variant: 'destructive' });
    } finally {
      setIsScanning(false);
    }
  };

  const handleDelete = async () => {
    setShowDeleteConfirm(false);
    setIsDeleting(true);
    toast({ title: 'جاري الحذف...', description: `سيتم حذف ${selectedFolders.size} مجلد.` });

    try {
      const response = await fetch('/api/drive/cleanup', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderIds: Array.from(selectedFolders) }),
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'فشل الحذف');
      }

      toast({
        title: 'اكتمل الحذف',
        description: `تم حذف ${result.data.deletedCount} مجلد بنجاح. فشل حذف ${result.data.errors.length} مجلد.`,
      });

      // Refresh the list by removing deleted folders
      setScanResults(prev => prev?.filter(folder => !selectedFolders.has(folder.id)) || null);
      setSelectedFolders(new Set());

    } catch (error: any) {
      toast({ title: 'خطأ في الحذف', description: error.message, variant: 'destructive' });
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      const allIds = new Set(scanResults?.map(f => f.id));
      setSelectedFolders(allIds);
    } else {
      setSelectedFolders(new Set());
    }
  };

  const toggleFolderSelection = (folderId: string) => {
    const newSelection = new Set(selectedFolders);
    if (newSelection.has(folderId)) {
      newSelection.delete(folderId);
    } else {
      newSelection.add(folderId);
    }
    setSelectedFolders(newSelection);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trash2 className="h-8 w-8" />
            تنظيف Google Drive
          </h1>
          <p className="text-muted-foreground mt-2">
            البحث عن المجلدات اليتيمة (غير المرتبطة بقاعدة البيانات) وحذفها.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>فحص المجلدات</CardTitle>
          <CardDescription>
            ابدأ عملية الفحص للعثور على المجلدات التي لم تعد مستخدمة في النظام.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleScan} disabled={isScanning}>
            {isScanning ? (
              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 ml-2" />
            )}
            {isScanning ? 'جاري الفحص...' : 'فحص المجلدات اليتيمة'}
          </Button>
          {isScanning && <p className="text-sm text-muted-foreground mt-2">قد تستغرق هذه العملية عدة دقائق حسب عدد المجلدات...</p>}
        </CardContent>
      </Card>

      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>نتائج الفحص</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{stats.driveFolderCount}</p>
              <p className="text-sm text-muted-foreground">إجمالي المجلدات في Drive</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{stats.dbFolderCount}</p>
              <p className="text-sm text-muted-foreground">المجلدات المرتبطة بالبيانات</p>
            </div>
            <div className="p-4 bg-destructive/10 rounded-lg">
              <p className="text-2xl font-bold text-destructive">{stats.orphanedCount}</p>
              <p className="text-sm text-destructive/80">المجلدات اليتيمة</p>
            </div>
          </CardContent>
        </Card>
      )}

      {scanResults && scanResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>المجلدات اليتيمة</CardTitle>
            <CardDescription>
              هذه المجلدات موجودة في Google Drive ولكنها غير مرتبطة بأي سجل في قاعدة البيانات.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={scanResults.length > 0 && selectedFolders.size === scanResults.length ? true : selectedFolders.size > 0 ? 'indeterminate' : false}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>اسم المجلد</TableHead>
                    <TableHead>تاريخ الإنشاء</TableHead>
                    <TableHead className="text-center">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scanResults.map(folder => (
                    <TableRow key={folder.id} data-state={selectedFolders.has(folder.id) && "selected"}>
                      <TableCell>
                        <Checkbox
                          checked={selectedFolders.has(folder.id)}
                          onCheckedChange={() => toggleFolderSelection(folder.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{folder.name}</TableCell>
                      <TableCell>
                        {format(new Date(folder.createdTime), 'd MMMM yyyy', { locale: ar })}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="icon" asChild>
                          <a href={folder.webViewLink} target="_blank" rel="noopener noreferrer" title="فتح في Drive">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                variant="destructive"
                disabled={selectedFolders.size === 0 || isDeleting}
                onClick={() => setShowDeleteConfirm(true)}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 ml-2" />
                )}
                حذف المحدد ({selectedFolders.size})
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {scanResults && scanResults.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <p>🎉 رائع! لم يتم العثور على أي مجلدات يتيمة.</p>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف {selectedFolders.size} مجلد بشكل نهائي من Google Drive؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">نعم، قم بالحذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}