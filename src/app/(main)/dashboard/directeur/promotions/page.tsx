'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { 
  GraduationCap, 
  Send, 
  CheckCircle2, 
  XCircle, 
  Clock,
  TrendingUp,
  Users,
  Calendar,
  Plus,
  RefreshCwngle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/use-window-size';

interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  status: string;
  _count: {
    promotions: number;
  };
}

interface PromotionStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  completed: number;
  responseRate: number;
}

interface Promotion {
  id: string;
  status: string;
  parentResponse: string | null;
  notifiedAt: string | null;
  respondedAt: string | null;
  promotedAt: string | null;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  parent: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  fromLevel: {
    id: number;
    name: string;
  };
  toLevel: {
    id: number;
    name: string;
  } | null;
}

interface SkippedStudent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  levelName: string;
  hasParent: boolean;
}

export default function PromotionsPage() {
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [stats, setStats] = useState<PromotionStats | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [skippedStudents, setSkippedStudents] = useState<SkippedStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showInitiateDialog, setShowInitiateDialog] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const [newYear, setNewYear] = useState({
    name: '',
    startDate: '',
    endDate: ''
  });

  const { toast } = useToast();
  const { width, height } = useWindowSize();

  useEffect(() => {
    fetchYears();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetchStats();
    }
  }, [selectedYear]);

  const fetchYears = async () => {
    try {
      const response = await fetch('/api/academic-years');
      if (response.ok) {
        const data = await response.json();
        setYears(data.years);
        
        // Auto-select current year
        const current = data.years.find((y: AcademicYear) => y.isCurrent);
        if (current) {
          setSelectedYear(current.id);
        } else if (data.years.length > 0) {
          setSelectedYear(data.years[0].id);
        }
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في جلب السنوات الدراسية',
        variant: 'destructive'
      });
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/academic-years/promotions/stats?academicYearId=${selectedYear}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setPromotions(data.promotions);
        setSkippedStudents(data.skippedStudents || []);
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في جلب الإحصائيات',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createYear = async () => {
    try {
      setCreating(true);
      const response = await fetch('/api/academic-years', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newYear,
          isCurrent: true
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'تم بنجاح',
          description: data.message
        });
        setShowCreateDialog(false);
        setNewYear({ name: '', startDate: '', endDate: '' });
        fetchYears();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message || 'فشل في إنشاء السنة الدراسية',
        variant: 'destructive'
      });
    } finally {
      setCreating(false);
    }
  };

  const initiatePromotions = async () => {
    try {
      setLoading(true);
      toast({
        title: 'جاري الإرسال...',
        description: 'جاري إرسال الرسائل لأولياء الأمور...',
      });

      const response = await fetch('/api/academic-years/promotions/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ academicYearId: selectedYear })
      });

      const data = await response.json();

      if (response.ok) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);

        toast({
          title: '🎉 تم بنجاح!',
          description: data.message,
        });
        setShowInitiateDialog(false);
        fetchStats();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message || 'فشل في بدء عملية الترقية',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string, parentResponse: string | null) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />في الانتظار</Badge>;
      case 'approved':
        return <Badge variant="default" className="gap-1 bg-green-500"><CheckCircle2 className="h-3 w-3" />نجح</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />لم ينجح</Badge>;
      case 'completed':
        return <Badge variant="default" className="gap-1 bg-blue-500"><GraduationCap className="h-3 w-3" />مكتمل</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const selectedYearData = years.find(y => y.id === selectedYear);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <GraduationCap className="h-8 w-8" />
            إدارة الترقيات والسنوات الدراسية
          </h1>
          <p className="text-muted-foreground mt-2">
            إدارة انتقال الطلاب بين المستويات الدراسية
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchStats} disabled={loading || !selectedYear}>
            <RefreshCw className={`h-4 w-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 ml-2" />
            سنة دراسية جديدة
          </Button>
        </div>
      </div>

      {/* Academic Year Selector */}
      <Card>
        <CardHeader>
          <CardTitle>اختر السنة الدراسية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {years.map(year => (
              <Card 
                key={year.id}
                className={`cursor-pointer transition-all ${
                  selectedYear === year.id 
                    ? 'border-primary border-2 bg-primary/5' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedYear(year.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{year.name}</CardTitle>
                    {year.isCurrent && (
                      <Badge variant="default">الحالية</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(year.startDate).toLocaleDateString('ar')} - 
                        {new Date(year.endDate).toLocaleDateString('ar')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{year._count.promotions} ترقية</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedYear && stats && (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">إجمالي الطلاب</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">في الانتظار</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">نجح</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">لم ينجح</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">معدل الاستجابة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.responseRate}%</div>
              </CardContent>
            </Card>
          </div>

          {/* Skipped Students Warning */}
          {skippedStudents.length > 0 && (
            <Card className="border-yellow-500 bg-yellow-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-yellow-700 text-lg">
                  <AlertTriangle className="h-5 w-5" />
                  طلاب غير مؤهلين للترقية (ينقصهم ولي أمر) ({skippedStudents.length})
                </CardTitle>
                <CardDescription className="text-yellow-600">
                  هؤلاء الطلاب لم يتم إنشاء طلب ترقية لهم لأنهم غير مرتبطين بولي أمر. تم إرسال تنبيه لهم.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الطالب</TableHead>
                      <TableHead>المستوى الحالي</TableHead>
                      <TableHead>السبب</TableHead>
                      <TableHead>الإجراء</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {skippedStudents.map(student => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="font-medium">{student.firstName} {student.lastName}</div>
                          <div className="text-sm text-muted-foreground">{student.email}</div>
                        </TableCell>
                        <TableCell>{student.levelName}</TableCell>
                        <TableCell>
                          {!student.hasParent ? (
                            <Badge variant="destructive">لا يوجد ولي أمر</Badge>
                          ) : (
                            <Badge variant="outline">سبب آخر</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="link" size="sm" asChild className="px-0">
                            <a href={`/dashboard/directeur/users?search=${student.email}`}>ربط بولي أمر</a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Action Button */}
          {stats.total === 0 && (
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <Send className="h-12 w-12 mx-auto text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">ابدأ عملية الترقية</h3>
                    <p className="text-muted-foreground mt-2">
                      سيتم إرسال رسائل لجميع أولياء الأمور للاستفسار عن نتائج أبنائهم
                    </p>
                  </div>
                  <Button size="lg" onClick={() => setShowInitiateDialog(true)}>
                    <Send className="h-4 w-4 ml-2" />
                    إرسال رسائل الاستفسار
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Promotions Table */}
          {stats.total > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>قائمة الترقيات</CardTitle>
                <CardDescription>
                  جميع طلبات الترقية للسنة الدراسية {selectedYearData?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الطالب</TableHead>
                      <TableHead>ولي الأمر</TableHead>
                      <TableHead>المستوى الحالي</TableHead>
                      <TableHead>المستوى التالي</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>تاريخ الإرسال</TableHead>
                      <TableHead>تاريخ الرد</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {promotions.map(promotion => (
                      <TableRow key={promotion.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {promotion.student.firstName} {promotion.student.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {promotion.student.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {promotion.parent.firstName} {promotion.parent.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {promotion.parent.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{promotion.fromLevel.name}</TableCell>
                        <TableCell>
                          {promotion.toLevel?.name || (
                            <Badge variant="secondary">نهاية المرحلة</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(promotion.status, promotion.parentResponse)}
                        </TableCell>
                        <TableCell>
                          {promotion.notifiedAt 
                            ? formatDistanceToNow(new Date(promotion.notifiedAt), {
                                addSuffix: true,
                                locale: ar
                              })
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {promotion.respondedAt 
                            ? formatDistanceToNow(new Date(promotion.respondedAt), {
                                addSuffix: true,
                                locale: ar
                              })
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Create Year Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إنشاء سنة دراسية جديدة</DialogTitle>
            <DialogDescription>
              أدخل بيانات السنة الدراسية الجديدة
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>اسم السنة الدراسية</Label>
              <Input
                placeholder="مثال: 2024-2025"
                value={newYear.name}
                onChange={(e) => setNewYear({ ...newYear, name: e.target.value })}
              />
            </div>
            <div>
              <Label>تاريخ البداية (1 سبتمبر)</Label>
              <Input
                type="date"
                value={newYear.startDate}
                onChange={(e) => setNewYear({ ...newYear, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label>تاريخ النهاية (30 جوان)</Label>
              <Input
                type="date"
                value={newYear.endDate}
                onChange={(e) => setNewYear({ ...newYear, endDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={createYear} disabled={creating || !newYear.name || !newYear.startDate || !newYear.endDate}>
              {creating ? 'جاري الإنشاء...' : 'إنشاء'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Initiate Promotions Dialog */}
      <AlertDialog open={showInitiateDialog} onOpenChange={setShowInitiateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              تأكيد إرسال رسائل الاستفسار
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-2 text-right">
                <p>سيتم إرسال رسائل لجميع أولياء أمور الطلاب تطلب منهم الإجابة عن:</p>
                <div className="bg-muted p-4 rounded-lg my-4">
                  <p className="font-semibold text-foreground">
                    "هل نجح ابنك/ابنتك في الانتقال إلى المستوى الأعلى؟"
                  </p>
                </div>
                <p>بعد رد ولي الأمر، سيتم:</p>
                <ul className="list-disc list-inside space-y-1 text-foreground">
                  <li>ترقية الطالب تلقائياً إذا كان ناجحاً</li>
                  <li>إرسال رسالة تهنئة للطالب الناجح 🎉</li>
                  <li>إرسال رسالة تشجيع للطالب الذي لم ينجح 💪</li>
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={initiatePromotions}>
              نعم، إرسال الرسائل
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
