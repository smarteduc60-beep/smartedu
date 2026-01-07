import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
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

export const dynamic = 'force-dynamic';

export default async function MyStudentsPage() {
  const session = await requireAuth();
  
  // تسجيل للتحقق من هوية المعلم في السجلات (Server Logs)
  console.log(`[StudentsPage] Fetching for Teacher ID: ${session.user.id}`);

  // جلب البيانات مباشرة من قاعدة البيانات (Server-Side)
  const students = await prisma.user.findMany({
    where: {
      studentLinks: {
        some: {
          teacherId: session.user.id,
        },
      },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      image: true,
      userDetails: {
        select: {
          level: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  console.log(`[StudentsPage] Found ${students.length} students`);

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
                                <TableHead>المستوى</TableHead>
                                <TableHead>البريد الإلكتروني</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {students.length > 0 ? (
                            students.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={student.image || undefined} alt={`${student.firstName} ${student.lastName}`} />
                                                <AvatarFallback>{student.firstName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{student.firstName} {student.lastName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {student.userDetails?.level?.name || '-'}
                                    </TableCell>
                                    <TableCell>{student.email}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                             <TableRow>
                                <TableCell colSpan={3} className="text-center h-24">
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
