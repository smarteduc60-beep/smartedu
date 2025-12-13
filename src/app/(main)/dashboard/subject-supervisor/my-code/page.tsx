'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTeacher, getUserById } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCw } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast";

// Mock current user ID. This would come from auth.
const MOCK_TEACHER_ID = 2;

export default function MyCodePage() {
    const { toast } = useToast();
    // This could be a teacher (2) or a supervisor acting as a teacher (7)
    const teacher = getUserById(MOCK_TEACHER_ID); 
    if (!teacher || !teacher.teacher_code) return <div>لم يتم العثور على حساب المعلم.</div>;

    const handleCopy = () => {
        if(teacher.teacher_code) {
            navigator.clipboard.writeText(teacher.teacher_code);
            toast({
                title: "تم النسخ!",
                description: "تم نسخ كود الربط إلى الحافظة.",
            });
        }
    };

    return (
        <div className="flex flex-col gap-8 max-w-2xl mx-auto">
            <div className="grid gap-1">
                <h1 className="text-3xl font-bold tracking-tight">كودي الخاص</h1>
                <p className="text-muted-foreground">
                    إدارة كود الربط الخاص بك لمشاركة المحتوى مع طلابك.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>كود الربط الحالي</CardTitle>
                    <CardDescription>
                        شارك هذا الكود مع طلابك ليتمكنوا من الارتباط بحسابك والوصول إلى دروسك الخاصة.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Input readOnly defaultValue={teacher.teacher_code} className="text-2xl font-mono tracking-widest text-center" />
                        <Button variant="outline" size="icon" onClick={handleCopy} aria-label="نسخ الكود">
                            <Copy className="h-5 w-5" />
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        يمكن للطلاب استخدام هذا الكود في صفحة ملفهم الشخصي للارتباط بك.
                    </p>
                </CardContent>
            </Card>
            
            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle>إنشاء كود جديد</CardTitle>
                    <CardDescription>
                        سيؤدي إنشاء كود جديد إلى جعل الكود الحالي غير صالح، وسيتم فصل جميع الطلاب المرتبطين حاليًا.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <RefreshCw className="ml-2 h-4 w-4" />
                                <span>إنشاء كود جديد</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>هل أنت متأكد تماماً؟</AlertDialogTitle>
                            <AlertDialogDescription>
                                هذا الإجراء لا يمكن التراجع عنه. سيتم إنشاء كود ربط جديد وسيتم فصل جميع طلابك الحاليين. سيحتاجون إلى استخدام الكود الجديد للارتباط بك مرة أخرى.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction>نعم، قم بإنشاء كود جديد</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        </div>
    );
}
