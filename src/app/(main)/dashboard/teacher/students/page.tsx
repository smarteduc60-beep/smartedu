import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { USERS, getUserById } from "@/lib/mock-data";

// Mock current user ID. This would come from auth.
const MOCK_TEACHER_ID = 2;

export default function MyStudentsPage() {
    const teacher = getUserById(MOCK_TEACHER_ID);
    if (!teacher || !teacher.teacher_code) {
        return <div>لم يتم العثور على المعلم.</div>
    }

    const students = USERS.filter(u => u.role === 'student' && u.connected_teacher_code === teacher.teacher_code);

    return (
        <div className="flex flex-col gap-8">
            <div className="grid gap-1">
                <h1 className="text-3xl font-bold tracking-tight">تلاميذي</h1>
                <p className="text-muted-foreground">
                    عرض قائمة الطلاب المرتبطين بك ومتابعة تقدمهم.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>قائمة الطلاب</CardTitle>
                    <CardDescription>
                        إجمالي عدد الطلاب المرتبطين: {students.length}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>الطالب</TableHead>
                                <TableHead>البريد الإلكتروني</TableHead>
                                <TableHead className="text-center">الدروس المكتملة</TableHead>
                                <TableHead className="text-center">متوسط الدرجات</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {students.length > 0 ? (
                            students.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={student.avatar} alt={student.name} />
                                                <AvatarFallback>{student.prenom.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{student.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{student.email}</TableCell>
                                    <TableCell className="font-medium text-center">5</TableCell>
                                    <TableCell className="font-medium text-center">85%</TableCell>
                                </TableRow>
                            ))
                        ) : (
                             <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">
                                    لا يوجد طلاب مرتبطون بحسابك بعد.
                                </TableCell>
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
