
'use client';

import { Button } from "@/components/ui/button";
import { School, ArrowLeft, Bot, BarChart, Users, Star, BookCopy, FileQuestion } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { USERS, LESSONS, EXERCISES, LEVELS, getUserById } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [stats, setStats] = useState({
    studentCount: 0,
    teacherCount: 0,
    lessonCount: 0,
    exerciseCount: 0,
  });

  const [topStudents, setTopStudents] = useState<Array<{
    id: string;
    firstName: string;
    lastName: string;
    levelName: string;
    averageScore: number;
  }>>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/statistics/public');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
          if (data.topStudents) {
            setTopStudents(data.topStudents);
          }
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const studentCount = stats.studentCount;
  const teacherCount = stats.teacherCount;
  const lessonCount = stats.lessonCount;
  const exerciseCount = stats.exerciseCount;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <Link href="/" className="flex items-center gap-2">
          <School className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Smartedu</h1>
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/login" passHref>
            <Button variant="ghost">تسجيل الدخول</Button>
          </Link>
          <Link href="/signup" passHref>
            <Button>
              <span>إنشاء حساب</span>
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col items-center">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-right">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                أطلق العنان لإمكانياتك مع <span className="text-primary">SmartEdu</span>، منصة التعليم الذكية
              </h2>
              <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                نحن نقدم تجربة تعليمية فريدة وشخصية، مدعومة بالذكاء الاصطناعي لمساعدة الطلاب على التفوق، وتمكين المعلمين من الإبداع، وطمأنة أولياء الأمور.
              </p>
              <div className="mt-8 flex justify-center lg:justify-start gap-4">
                  <Link href="/signup" passHref>
                      <Button size="lg">ابدأ رحلتك الآن</Button>
                  </Link>
                  <Link href="#features" passHref>
                      <Button size="lg" variant="outline">
                      اكتشف الميزات
                      </Button>
                  </Link>
              </div>
            </div>
            <div className="lg:w-1/2">
              <Image
                //src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjB0ZWNobm9sb2d5fGVufDB8fHx8MTc2NTA2MTI4MHww&ixlib.rb-4.1.0&q=80&w=1080"
                //src="/images/landing/kenny-eliason.jpg"
                src="/images/landing/kenny-eliason.jpg"
                alt="طلاب سعداء يستخدمون التكنولوجيا في التعليم أو متعلم يستخدم الذكاء الصناعي أو طلاب داخل الفصل"
                width={600}
                height={400}
                className="rounded-xl shadow-2xl"
                data-ai-hint="education technology"
              />
            </div>
          </div>
          
          <div className="w-full mt-20 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="flex flex-col items-center p-4 rounded-lg">
                    <Users className="h-10 w-10 text-primary mb-3" />
                    <p className="text-3xl font-bold">{studentCount}</p>
                    <p className="text-muted-foreground mt-1">طالب مسجل</p>
                </div>
                 <div className="flex flex-col items-center p-4 rounded-lg">
                    <Users className="h-10 w-10 text-primary mb-3" />
                    <p className="text-3xl font-bold">{teacherCount}</p>
                    <p className="text-muted-foreground mt-1">معلم ومشرف</p>
                </div>
                 <div className="flex flex-col items-center p-4 rounded-lg">
                    <BookCopy className="h-10 w-10 text-primary mb-3" />
                    <p className="text-3xl font-bold">{lessonCount}</p>
                    <p className="text-muted-foreground mt-1">درس متاح</p>
                </div>
                 <div className="flex flex-col items-center p-4 rounded-lg">
                    <FileQuestion className="h-10 w-10 text-primary mb-3" />
                    <p className="text-3xl font-bold">{exerciseCount}</p>
                    <p className="text-muted-foreground mt-1">تمرين متاح</p>
                </div>
            </div>
          </div>

        </section>

        <section id="features" className="py-20 bg-muted/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h3 className="text-3xl font-bold">لماذا تختار SmartEdu؟</h3>
                    <p className="text-muted-foreground mt-2">منصة متكاملة تلبي احتياجات الجميع في العملية التعليمية.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Card className="text-center">
                        <CardHeader>
                            <div className="mx-auto bg-primary/10 text-primary w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                <Bot className="w-8 h-8" />
                            </div>
                            <CardTitle>تقييم ذكي فوري</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">يحصل الطلاب على تقييم فوري لإجاباتهم مدعوم بالذكاء الاصطناعي، مما يساعدهم على التعلم بشكل أسرع وأكثر فعالية.</p>
                        </CardContent>
                    </Card>
                     <Card className="text-center">
                        <CardHeader>
                            <div className="mx-auto bg-primary/10 text-primary w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                <BarChart className="w-8 h-8" />
                            </div>
                            <CardTitle>متابعة التقدم</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">لوحات تحكم مخصصة للمعلمين وأولياء الأمور لمتابعة أداء الطلاب وتقديم الدعم اللازم في الوقت المناسب.</p>
                        </CardContent>
                    </Card>
                     <Card className="text-center">
                        <CardHeader>
                            <div className="mx-auto bg-primary/10 text-primary w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                <Users className="w-8 h-8" />
                            </div>
                            <CardTitle>أدوار متعددة</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">تجربة استخدام مخصصة لكل دور (طالب، معلم، ولي أمر، مدير) لتلبية احتياجاتهم الفريدة.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
        
        <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h3 className="text-3xl font-bold">أبطال SmartEdu</h3>
                    <p className="text-muted-foreground mt-2">نحتفي بالطلاب المتفوقين في كل مستوى دراسي.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {topStudents.length > 0 ? (
                        topStudents.map((student) => (
                            <Card key={student.id} className="overflow-hidden">
                                <CardHeader className="bg-primary/5 p-4">
                                    <CardTitle className="text-center text-primary">{student.levelName}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 flex flex-col items-center text-center">
                                    <div className="relative mb-4">
                                        <Avatar className="h-24 w-24 border-4 border-primary">
                                            <AvatarFallback>{student.firstName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <Badge className="absolute -bottom-2 -right-2 text-lg p-2" variant="destructive">
                                            <Star className="ml-1 h-5 w-5 fill-current" />
                                            <span>#1</span>
                                        </Badge>
                                    </div>
                                    <h4 className="text-xl font-semibold">{student.firstName} {student.lastName}</h4>
                                    <p className="text-muted-foreground">متوسط الدرجات: <span className="font-bold text-primary">{student.averageScore.toFixed(1)}%</span></p>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-muted-foreground">
                            <p>لا توجد بيانات للطلاب المتفوقين حاليًا</p>
                        </div>
                    )}
                </div>
            </div>
        </section>

        <section className="py-20 bg-muted/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h3 className="text-3xl font-bold">آراء مستخدمينا</h3>
                    <p className="text-muted-foreground mt-2">ماذا يقولون عن تجربتهم مع SmartEdu.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center mb-4">
                                <Avatar className="h-12 w-12 ml-4">
                                    <AvatarImage src="https://images.unsplash.com/photo-1708426238272-994fcddabca4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHBlcnNvbnxlbnwwfHx8fDE3NjQ4ODQ5ODV8MA&ixlib=rb-4.1.0&q=80&w=1080" />
                                    <AvatarFallback>ف</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">فاطمة الغامدي</p>
                                    <p className="text-sm text-muted-foreground">طالبة</p>
                                </div>
                            </div>
                            <p className="text-muted-foreground">"أحب الحصول على feedback فوري، هذا يساعدني على فهم أخطائي بسرعة والتحسن في دراستي."</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                             <div className="flex items-center mb-4">
                                <Avatar className="h-12 w-12 ml-4">
                                    <AvatarImage src="https://images.unsplash.com/photo-1580893472468-01373fe4c97e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxwb3J0cmFpdCUyMHBlcnNvbnxlbnwwfHx8fDE3NjQ4ODQ5ODV8MA&ixlib.rb-4.1.0&q=80&w=1080" />
                                    <AvatarFallback>أ</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">أحمد محمود</p>
                                    <p className="text-sm text-muted-foreground">معلم</p>
                                </div>
                            </div>
                            <p className="text-muted-foreground">"المنصة وفرت عليّ الكثير من الوقت في تصحيح الواجبات، وأعطتني رؤى دقيقة عن مستوى كل طالب."</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center mb-4">
                                <Avatar className="h-12 w-12 ml-4">
                                    <AvatarImage src="https://images.unsplash.com/photo-1576765974026-6a4a1f6a1a3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG1hbnxlbnwwfHx8fDE3NjUxNzU4MjZ8MA&ixlib.rb-4.1.0&q=80&w=1080" />
                                    <AvatarFallback>خ</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">خالد الغامدي</p>
                                    <p className="text-sm text-muted-foreground">ولي أمر</p>
                                </div>
                            </div>
                            <p className="text-muted-foreground">"أشعر براحة أكبر وأنا أتابع تقدم ابنتي الدراسي بسهولة عبر التقارير المفصلة التي تقدمها المنصة."</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

        <section className="bg-primary text-primary-foreground py-20">
             <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h3 className="text-3xl font-bold">هل أنت مستعد لتغيير مستقبل التعليم؟</h3>
                <p className="text-lg mt-4 max-w-2xl mx-auto">
                    انضم إلى آلاف الطلاب والمعلمين وأولياء الأمور الذين يثقون في SmartEdu.
                </p>
                <div className="mt-8">
                     <Link href="/signup" passHref>
                        <Button size="lg" variant="secondary">
                            أنشئ حسابك المجاني الآن
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
      </main>

       <footer className="py-6 border-t bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} SmartEdu. جميع الحقوق محفوظة.</p>
          </div>
      </footer>
    </div>
  );
}
