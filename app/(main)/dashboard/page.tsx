import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const role = session.user.role;

  if (role === 'teacher') {
    redirect('/dashboard/teacher');
  } else if (role === 'student') {
    redirect('/dashboard/student');
  } else if (role === 'parent') {
    redirect('/dashboard/parent');
  } else if (role === 'supervisor_specific' || role === 'supervisor_general') {
    redirect('/dashboard/subject-supervisor');
  } else if (role === 'directeur') {
    redirect('/dashboard/directeur');
  } else {
    redirect('/login');
  }

  return <div>Loading...</div>;
}
