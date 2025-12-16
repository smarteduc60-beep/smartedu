
'use client';

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Users,
  Search,
  PlusCircle,
  FilePenLine,
  Trash2,
  Loader2,
  Ban,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useUsers, useSubjects, useLevels, useStages } from "@/hooks";
import { useToast } from "@/hooks/use-toast";

const roleTranslation: Record<string, string> = {
  directeur: 'مدير',
  supervisor_general: 'مشرف عام',
  supervisor_specific: 'مشرف مادة',
  teacher: 'معلم',
  student: 'طالب',
  parent: 'ولي أمر',
};

const roleVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  directeur: 'destructive',
  supervisor_general: 'secondary',
  supervisor_specific: 'secondary',
  teacher: 'outline',
  student: 'default',
  parent: 'default',
};

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  stageId?: number;
  subjectId?: number;
  levelId?: number;
}

export default function UserManagement() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'student',
  });

  const { users, isLoading, createUser, updateUser, deleteUser, refetch } = useUsers({
    role: roleFilter === 'all' ? undefined : roleFilter,
    search: search || undefined,
  });
  
  const { subjects } = useSubjects();
  const { levels } = useLevels();
  const { stages } = useStages();

  const students = Array.isArray(users) ? users.filter((u) => u.role === "student").length : 0;
  const teachers = Array.isArray(users) ? users.filter((u) => u.role === "teacher" || u.role === 'supervisor_specific').length : 0;
  const parents = Array.isArray(users) ? users.filter((u) => u.role === "parent").length : 0;

  const handleCreateUser = async () => {
    const result = await createUser({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      roleName: formData.role,
      stageId: formData.stageId,
      subjectId: formData.subjectId,
      levelId: formData.levelId,
    });

    if (result.success) {
      toast({
        title: 'تم إنشاء المستخدم',
        description: 'تم إضافة المستخدم بنجاح',
      });
      setIsCreateDialogOpen(false);
      setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'student' });
    } else {
      toast({
        title: 'خطأ',
        description: result.error || 'فشل في إنشاء المستخدم',
        variant: 'destructive',
      });
    }
  };

  const handleEditUser = async () => {
    if (!selectedUserId) return;

    const updateData: any = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: formData.role,
      subjectId: formData.subjectId,
      levelId: formData.levelId,
    };

    // Only include password if it's been changed
    if (formData.password && formData.password.trim()) {
      updateData.password = formData.password;
    }

    const result = await updateUser(selectedUserId, updateData);

    if (result.success) {
      toast({
        title: 'تم التحديث',
        description: 'تم تحديث بيانات المستخدم بنجاح',
      });
      setIsEditDialogOpen(false);
      setSelectedUserId(null);
      setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'student' });
    } else {
      toast({
        title: 'خطأ',
        description: result.error || 'فشل في تحديث المستخدم',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;

    const result = await deleteUser(id);
    if (result.success) {
      toast({
        title: 'تم الحذف',
        description: 'تم حذف المستخدم بنجاح',
      });
    } else {
      toast({
        title: 'خطأ',
        description: result.error || 'فشل في حذف المستخدم',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (user: any) => {
    // Split name into firstName and lastName
    const nameParts = user.name ? user.name.trim().split(' ') : ['', ''];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    setSelectedUserId(user.id);
    setFormData({
      firstName,
      lastName,
      email: user.email,
      password: '',
      role: user.role,
      stageId: user.details?.stageId || undefined,
      subjectId: user.details?.subjectId || undefined,
      levelId: user.details?.levelId || undefined,
    });
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="grid gap-1">
          <h1 className="text-3xl font-bold tracking-tight">إدارة المستخدمين</h1>
          <p className="text-muted-foreground">
            عرض وتعديل والبحث عن المستخدمين في المنصة.
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="ml-2 h-4 w-4" />
          <span>إضافة مستخدم جديد</span>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">جميع الأدوار</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الطلاب</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students}</div>
            <p className="text-xs text-muted-foreground">إجمالي الطلاب المسجلين</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الطاقم التعليمي</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachers}</div>
            <p className="text-xs text-muted-foreground">معلمون ومشرفون</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">أولياء الأمور</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parents}</div>
            <p className="text-xs text-muted-foreground">إجمالي أولياء الأمور</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة المستخدمين</CardTitle>
          <CardDescription>
            تم العثور على {users.length} مستخدم.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="ابحث بالاسم أو البريد..." 
                className="pl-10" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="فلترة حسب الدور" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأدوار</SelectItem>
                <SelectItem value="student">طالب</SelectItem>
                <SelectItem value="teacher">معلم</SelectItem>
                <SelectItem value="parent">ولي أمر</SelectItem>
                <SelectItem value="supervisor_specific">مشرف مادة</SelectItem>
                <SelectItem value="supervisor_general">مشرف عام</SelectItem>
                <SelectItem value="directeur">مدير</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المستخدم</TableHead>
                <TableHead>الدور</TableHead>
                <TableHead>التفاصيل</TableHead>
                <TableHead>الإحصائيات</TableHead>
                <TableHead>البريد الإلكتروني</TableHead>
                <TableHead className="text-center">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(users) && users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.image || undefined} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">{user.name}</span>
                          {user.isBanned && (
                            <Badge variant="destructive" className="text-xs w-fit">
                              محظور
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={roleVariant[user.role] || 'default'}>
                        {roleTranslation[user.role] || user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        {user.details?.subject && (
                          <span className="text-muted-foreground">
                            {user.details.subject.name}
                          </span>
                        )}
                        {user.details?.level && (
                          <span className="text-muted-foreground">
                            {user.details.level.name}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {(user.role === 'teacher' || user.role === 'supervisor_specific') && (
                        <div className="flex flex-col gap-1 text-sm">
                          <span className="text-muted-foreground">
                            📚 {user.lessonsCount || 0} درس
                          </span>
                          <span className="text-muted-foreground">
                            ✏️ {user.exercisesCount || 0} تمرين
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="تعديل"
                          onClick={() => openEditDialog(user)}
                        >
                          <FilePenLine className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="حذف" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    لم يتم العثور على مستخدمين.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>إضافة مستخدم جديد</DialogTitle>
            <DialogDescription>
              قم بإدخال بيانات المستخدم الجديد
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">الاسم الأول</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="مثال: أحمد"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">الاسم الأخير</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="مثال: المحمود"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">الدور</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => setFormData({ ...formData, role: value, stageId: undefined, subjectId: undefined, levelId: undefined })}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="اختر الدور" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">طالب</SelectItem>
                  <SelectItem value="teacher">معلم</SelectItem>
                  <SelectItem value="parent">ولي أمر</SelectItem>
                  <SelectItem value="supervisor_specific">مشرف مادة</SelectItem>
                  <SelectItem value="supervisor_general">مشرف عام</SelectItem>
                  <SelectItem value="directeur">مدير</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.role === 'teacher' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="teacher-stage">المرحلة</Label>
                  <Select 
                    value={formData.stageId?.toString()} 
                    onValueChange={(value) => setFormData({ ...formData, stageId: parseInt(value), subjectId: undefined })}
                  >
                    <SelectTrigger id="teacher-stage">
                      <SelectValue placeholder="اختر المرحلة" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(stages) && stages.map(stage => (
                        <SelectItem key={stage.id} value={stage.id.toString()}>
                          {stage.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subjectId">المادة</Label>
                  <Select 
                    value={formData.subjectId?.toString()} 
                    onValueChange={(value) => setFormData({ ...formData, subjectId: parseInt(value) })}
                    disabled={!formData.stageId}
                  >
                    <SelectTrigger id="subjectId">
                      <SelectValue placeholder={!formData.stageId ? "اختر المرحلة أولاً" : "اختر المادة"} />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(subjects) && subjects
                        .filter(subject => {
                          const subjectStageId = (subject as any).stageId || (subject as any).stage_id;
                          return String(subjectStageId) === String(formData.stageId);
                        })
                        .map(subject => (
                          <SelectItem key={subject.id} value={subject.id.toString()}>
                            {subject.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {formData.role === 'student' && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="student-stage">المرحلة الدراسية</Label>
                  <Select 
                    value={formData.stageId?.toString()} 
                    onValueChange={(value) => setFormData({ ...formData, stageId: parseInt(value), levelId: undefined })}
                  >
                    <SelectTrigger id="student-stage">
                      <SelectValue placeholder="اختر المرحلة" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(stages) && stages.map(stage => (
                        <SelectItem key={stage.id} value={stage.id.toString()}>
                          {stage.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="levelId">السنة الدراسية</Label>
                  <Select 
                    value={formData.levelId?.toString()} 
                    onValueChange={(value) => setFormData({ ...formData, levelId: parseInt(value) })}
                    disabled={!formData.stageId}
                  >
                    <SelectTrigger id="levelId">
                      <SelectValue placeholder={!formData.stageId ? "اختر المرحلة أولاً" : "اختر السنة الدراسية"} />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(levels) && levels
                        .filter(level => {
                          const levelStageId = (level as any).stageId || (level as any).stage_id;
                          return String(levelStageId) === String(formData.stageId);
                        })
                        .map(level => (
                          <SelectItem key={level.id} value={level.id.toString()}>
                            {level.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {formData.role === 'supervisor_specific' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="supervisor-stage">المرحلة</Label>
                    <Select 
                      value={formData.stageId?.toString()} 
                      onValueChange={(value) => setFormData({ ...formData, stageId: parseInt(value), subjectId: undefined, levelId: undefined })}
                    >
                      <SelectTrigger id="supervisor-stage">
                        <SelectValue placeholder="اختر المرحلة" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(stages) && stages.map(stage => (
                          <SelectItem key={stage.id} value={stage.id.toString()}>
                            {stage.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="supervisor-subject">المادة</Label>
                    <Select 
                      value={formData.subjectId?.toString()} 
                      onValueChange={(value) => setFormData({ ...formData, subjectId: parseInt(value) })}
                      disabled={!formData.stageId}
                    >
                      <SelectTrigger id="supervisor-subject">
                        <SelectValue placeholder={!formData.stageId ? "اختر المرحلة أولاً" : "اختر المادة"} />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(subjects) && subjects
                          .filter(subject => {
                            const subjectStageId = (subject as any).stageId || (subject as any).stage_id;
                            return String(subjectStageId) === String(formData.stageId);
                          })
                          .map(subject => (
                            <SelectItem key={subject.id} value={subject.id.toString()}>
                              {subject.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="supervisor-level">المستوى الدراسي</Label>
                  <Select 
                    value={formData.levelId?.toString()} 
                    onValueChange={(value) => setFormData({ ...formData, levelId: parseInt(value) })}
                    disabled={!formData.stageId}
                  >
                    <SelectTrigger id="supervisor-level">
                      <SelectValue placeholder={!formData.stageId ? "اختر المرحلة أولاً" : "اختر المستوى الدراسي"} />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(levels) && levels
                        .filter(level => {
                          const levelStageId = (level as any).stageId || (level as any).stage_id;
                          return String(levelStageId) === String(formData.stageId);
                        })
                        .map(level => (
                          <SelectItem key={level.id} value={level.id.toString()}>
                            {level.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="********"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleCreateUser}>إنشاء المستخدم</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>تعديل بيانات المستخدم</DialogTitle>
            <DialogDescription>
              قم بتعديل البيانات المطلوبة
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-firstName">الاسم الأول</Label>
                <Input
                  id="edit-firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="مثال: أحمد"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-lastName">الاسم الأخير</Label>
                <Input
                  id="edit-lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="مثال: المحمود"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">البريد الإلكتروني</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                disabled
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-role">الدور</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => setFormData({ ...formData, role: value, stageId: undefined, subjectId: undefined, levelId: undefined })}
              >
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="اختر الدور" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">طالب</SelectItem>
                  <SelectItem value="teacher">معلم</SelectItem>
                  <SelectItem value="parent">ولي أمر</SelectItem>
                  <SelectItem value="supervisor_specific">مشرف مادة</SelectItem>
                  <SelectItem value="supervisor_general">مشرف عام</SelectItem>
                  <SelectItem value="directeur">مدير</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.role === 'teacher' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-teacher-stage">المرحلة</Label>
                  <Select 
                    value={formData.stageId?.toString()} 
                    onValueChange={(value) => setFormData({ ...formData, stageId: parseInt(value), subjectId: undefined })}
                  >
                    <SelectTrigger id="edit-teacher-stage">
                      <SelectValue placeholder="اختر المرحلة" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(stages) && stages.map(stage => (
                        <SelectItem key={stage.id} value={stage.id.toString()}>
                          {stage.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-subjectId">المادة</Label>
                  <Select 
                    value={formData.subjectId?.toString()} 
                    onValueChange={(value) => setFormData({ ...formData, subjectId: parseInt(value) })}
                    disabled={!formData.stageId}
                  >
                  <SelectTrigger id="edit-subjectId">
                    <SelectValue placeholder={!formData.stageId ? "اختر المرحلة أولاً" : "اختر المادة"} />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(subjects) && subjects
                      .filter(subject => {
                        const subjectStageId = (subject as any).stageId || (subject as any).stage_id;
                        return String(subjectStageId) === String(formData.stageId);
                      })
                      .map(subject => (
                        <SelectItem key={subject.id} value={subject.id.toString()}>
                          {subject.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              </div>
            )}

            {formData.role === 'student' && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-student-stage">المرحلة الدراسية</Label>
                  <Select 
                    value={formData.stageId?.toString()} 
                    onValueChange={(value) => setFormData({ ...formData, stageId: parseInt(value), levelId: undefined })}
                  >
                    <SelectTrigger id="edit-student-stage">
                      <SelectValue placeholder="اختر المرحلة" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(stages) && stages.map(stage => (
                        <SelectItem key={stage.id} value={stage.id.toString()}>
                          {stage.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-levelId">السنة الدراسية</Label>
                  <Select 
                    value={formData.levelId?.toString()} 
                    onValueChange={(value) => setFormData({ ...formData, levelId: parseInt(value) })}
                    disabled={!formData.stageId}
                  >
                    <SelectTrigger id="edit-levelId">
                      <SelectValue placeholder={!formData.stageId ? "اختر المرحلة أولاً" : "اختر السنة الدراسية"} />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(levels) && levels
                        .filter(level => {
                          const levelStageId = (level as any).stageId || (level as any).stage_id;
                          return String(levelStageId) === String(formData.stageId);
                        })
                        .map(level => (
                          <SelectItem key={level.id} value={level.id.toString()}>
                            {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              </div>
            )}

            {formData.role === 'supervisor_specific' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-supervisor-stage">المرحلة</Label>
                    <Select 
                      value={formData.stageId?.toString()} 
                      onValueChange={(value) => setFormData({ ...formData, stageId: parseInt(value), subjectId: undefined, levelId: undefined })}
                    >
                      <SelectTrigger id="edit-supervisor-stage">
                        <SelectValue placeholder="اختر المرحلة" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(stages) && stages.map(stage => (
                          <SelectItem key={stage.id} value={stage.id.toString()}>
                            {stage.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-supervisor-subject">المادة</Label>
                    <Select 
                      value={formData.subjectId?.toString()} 
                      onValueChange={(value) => setFormData({ ...formData, subjectId: parseInt(value) })}
                      disabled={!formData.stageId}
                    >
                      <SelectTrigger id="edit-supervisor-subject">
                        <SelectValue placeholder={!formData.stageId ? "اختر المرحلة أولاً" : "اختر المادة"} />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(subjects) && subjects
                          .filter(subject => {
                            const subjectStageId = (subject as any).stageId || (subject as any).stage_id;
                            return String(subjectStageId) === String(formData.stageId);
                          })
                          .map(subject => (
                            <SelectItem key={subject.id} value={subject.id.toString()}>
                              {subject.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-supervisor-level">المستوى الدراسي</Label>
                  <Select 
                    value={formData.levelId?.toString()} 
                    onValueChange={(value) => setFormData({ ...formData, levelId: parseInt(value) })}
                    disabled={!formData.stageId}
                  >
                    <SelectTrigger id="edit-supervisor-level">
                      <SelectValue placeholder={!formData.stageId ? "اختر المرحلة أولاً" : "اختر المستوى الدراسي"} />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(levels) && levels
                        .filter(level => {
                          const levelStageId = (level as any).stageId || (level as any).stage_id;
                          return String(levelStageId) === String(formData.stageId);
                        })
                        .map(level => (
                          <SelectItem key={level.id} value={level.id.toString()}>
                            {level.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="edit-password">كلمة المرور الجديدة (اتركه فارغاً إذا لم ترد التغيير)</Label>
              <Input
                id="edit-password"
                type="password"
                placeholder="********"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleEditUser}>حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
