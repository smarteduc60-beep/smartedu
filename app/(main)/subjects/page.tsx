'use client';

import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function SubjectsPage() {
  const { data: session } = useSession();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!session?.user) return;

      try {
        setIsLoading(true);
        
        // جلب تفاصيل الطالب للحصول على levelId
        const userRes = await fetch(`/api/users/${session.user.id}`);
        const userData = await userRes.json();
        
        if (!userData.success || !userData.data?.userDetails?.levelId) {
          setError('لم يتم العثور على مستواك الدراسي');
          return;
        }

        const levelId = userData.data.userDetails.levelId;
        
        // جلب المواد الخاصة بهذا المستوى
        const subjectsRes = await fetch(`/api/subjects?levelId=${levelId}`);
        const subjectsData = await subjectsRes.json();
        
        if (subjectsData.success) {
          const subjectsList = subjectsData.data?.subjects || subjectsData.data || [];
          setSubjects(Array.isArray(subjectsList) ? subjectsList : []);
        }
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setError('حدث خطأ أثناء تحميل المواد');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, [session]);

  const getSubjectImage = (subjectName: string) => {
    const imageName = `subject-${subjectName.toLowerCase()}`;
    if (subjectName === 'الرياضيات') return PlaceHolderImages.find((img) => img.id === 'subject-math');
    if (subjectName === 'اللغة العربية') return PlaceHolderImages.find((img) => img.id === 'subject-arabic');
    if (subjectName === 'العلوم') return PlaceHolderImages.find((img) => img.id === 'subject-science');
    return null;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-destructive">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">المواد الدراسية</h1>
        <p className="text-muted-foreground">
          تصفح المواد المتاحة لك وابدأ في استكشاف الدروس.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => {
          const subjectImage = getSubjectImage(subject.name);
          return (
            <Card key={subject.id} className="flex flex-col overflow-hidden">
              {subjectImage && (
                <div className="relative aspect-video w-full">
                  <Image
                    src={subjectImage.imageUrl}
                    alt={subject.name}
                    fill
                    className="object-cover"
                    data-ai-hint={subjectImage.imageHint}
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{subject.name}</CardTitle>
                <CardDescription>{subject.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center text-sm text-muted-foreground">
                  <BookOpen className="ml-2 h-4 w-4" />
                  <span>عرض الدروس المتاحة</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/lessons?subject=${subject.id}`} className="w-full" passHref>
                  <Button className="w-full">
                    <span>عرض الدروس</span>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
        {subjects.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center">
            لا توجد مواد متاحة حاليًا.
          </p>
        )}
      </div>
    </div>
  );
}
