import { use } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, BookOpen, FileQuestion, TrendingUp, ArrowLeft, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import ChildSubjectsClient from './client'; // We will create this client component
import { getChildSubjects } from '@/lib/data/parents';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

type Subject = {
  id: number;
  name: string;
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
    allowMessaging: boolean;
  } | null;
  stats: {
    totalLessons: number;
    totalExercises: number;
    totalSubmissions: number;
    gradedSubmissions: number;
    averageScore: number;
  };
};

export default async function ChildSubjectsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    // Or redirect, or show an error component
    return <div>Unauthorized</div>;
  }
  
  const parentId = session.user.id;
  const childId = params.id;
  
  let data;
  try {
    data = await getChildSubjects(parentId, childId);
  } catch (error) {
    console.error(error);
    // You can render an error component here
    return <div>Failed to load data.</div>;
  }

  const { child, subjects } = data;
  
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="grid gap-1">
          <h1 className="text-3xl font-bold tracking-tight">
            مواد {child?.firstName} {child?.lastName}
          </h1>
          <p className="text-muted-foreground">
            عرض تفاصيل أداء {child?.firstName} في كل مادة والتواصل مع المعلمين
          </p>
        </div>
        <Link href={`/dashboard/parent/children/${childId}`}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" />
            <span className="mr-2">الرجوع</span>
          </Button>
        </Link>
      </div>

     <ChildSubjectsClient initialSubjects={subjects} initialChild={child} />
    </div>
  );
}

// We need to create a new file `src/app/(main)/dashboard/parent/children/[id]/subjects/client.tsx`
// with the content of the original client component.
