'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  FileText, 
  RefreshCw, 
  Search, 
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Bug
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Log {
  id: string;
  level: string;
  category: string;
  action: string;
  userId: string | null;
  targetId: string | null;
  details: string | null;
  timestamp: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

const LOG_LEVELS = ['INFO', 'SUCCESS', 'WARNING', 'ERROR', 'DEBUG'];
const LOG_CATEGORIES = [
  'AUTH', 'USER', 'LESSON', 'EXERCISE', 'SUBMISSION',
  'MESSAGE', 'NOTIFICATION', 'BACKUP', 'SYSTEM', 'AI'
];

const levelConfig = {
  SUCCESS: { color: 'default', icon: CheckCircle2, label: 'نجاح' },
  INFO: { color: 'secondary', icon: Info, label: 'معلومات' },
  WARNING: { color: 'warning', icon: AlertTriangle, label: 'تحذير' },
  ERROR: { color: 'destructive', icon: XCircle, label: 'خطأ' },
  DEBUG: { color: 'outline', icon: Bug, label: 'تصحيح' },
};

const categoryLabels: Record<string, string> = {
  AUTH: 'المصادقة',
  USER: 'المستخدمين',
  LESSON: 'الدروس',
  EXERCISE: 'التمارين',
  SUBMISSION: 'التسليمات',
  MESSAGE: 'الرسائل',
  NOTIFICATION: 'الإشعارات',
  BACKUP: 'النسخ الاحتياطي',
  SYSTEM: 'النظام',
  AI: 'الذكاء الاصطناعي'
};

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    level: '',
    category: '',
    search: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchLogs();
  }, [page, filters]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: '50',
        offset: ((page - 1) * 50).toString(),
      });

      if (filters.level) params.append('level', filters.level);
      if (filters.category) params.append('category', filters.category);

      const response = await fetch(`/api/logs?${params}`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs);
        setTotal(data.total);
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في جلب السجلات',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getLevelIcon = (level: string) => {
    const config = levelConfig[level as keyof typeof levelConfig];
    const Icon = config?.icon || Info;
    return <Icon className="h-4 w-4" />;
  };

  const getLevelBadge = (level: string) => {
    const config = levelConfig[level as keyof typeof levelConfig];
    return (
      <Badge variant={config?.color as any || 'default'} className="gap-1">
        {getLevelIcon(level)}
        {config?.label || level}
      </Badge>
    );
  };

  const parseDetails = (details: string | null) => {
    if (!details) return null;
    try {
      return JSON.parse(details);
    } catch {
      return details;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            سجلات النظام
          </h1>
          <p className="text-muted-foreground mt-2">
            مراقبة جميع الأنشطة والأحداث في المنصة
          </p>
        </div>
        <Button variant="outline" onClick={fetchLogs} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
          تحديث
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            الفلاتر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">المستوى</label>
              <Select 
                value={filters.level} 
                onValueChange={(value) => {
                  setFilters({ ...filters, level: value });
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="جميع المستويات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع المستويات</SelectItem>
                  {LOG_LEVELS.map(level => (
                    <SelectItem key={level} value={level}>
                      {levelConfig[level as keyof typeof levelConfig]?.label || level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">الفئة</label>
              <Select 
                value={filters.category} 
                onValueChange={(value) => {
                  setFilters({ ...filters, category: value });
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="جميع الفئات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع الفئات</SelectItem>
                  {LOG_CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {categoryLabels[category] || category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">بحث</label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في الإجراءات..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pr-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>السجلات</CardTitle>
              <CardDescription>
                إجمالي {total} سجل - الصفحة {page} من {Math.ceil(total / 50)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              جاري التحميل...
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>لا توجد سجلات</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[140px]">الوقت</TableHead>
                      <TableHead className="w-[120px]">المستوى</TableHead>
                      <TableHead className="w-[140px]">الفئة</TableHead>
                      <TableHead>الإجراء</TableHead>
                      <TableHead>المستخدم</TableHead>
                      <TableHead className="w-[100px]">التفاصيل</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs
                      .filter(log => 
                        !filters.search || 
                        log.action.toLowerCase().includes(filters.search.toLowerCase())
                      )
                      .map((log) => {
                        const details = parseDetails(log.details);
                        
                        return (
                          <TableRow key={log.id}>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(log.timestamp), {
                                addSuffix: true,
                                locale: ar
                              })}
                            </TableCell>
                            <TableCell>
                              {getLevelBadge(log.level)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {categoryLabels[log.category] || log.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                              {log.action}
                            </TableCell>
                            <TableCell>
                              {log.user ? (
                                <div className="text-sm">
                                  <div className="font-medium">
                                    {log.user.firstName} {log.user.lastName}
                                  </div>
                                  <div className="text-muted-foreground">
                                    {log.user.email}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">النظام</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {details && (
                                <details className="text-xs">
                                  <summary className="cursor-pointer text-primary">
                                    عرض
                                  </summary>
                                  <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                                    {JSON.stringify(details, null, 2)}
                                  </pre>
                                </details>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                >
                  السابق
                </Button>
                <span className="text-sm text-muted-foreground">
                  الصفحة {page} من {Math.ceil(total / 50)}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= Math.ceil(total / 50) || loading}
                >
                  التالي
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
