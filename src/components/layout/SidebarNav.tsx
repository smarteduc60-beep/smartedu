
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  UserCircle,
  School,
  BookCopy,
  Users,
  ClipboardCheck,
  Code2,
  FileQuestion,
  Library,
  TrendingUp,
  Award,
  LogOut,
  Shield,
  FileText,
  Bell,
  Contact,
  CheckCircle,
  XCircle,
  Clock,
  BarChart,
  Settings,
  Book,
  Repeat,
  Database,
  GraduationCap,
  HardDrive,
  ScrollText,
  Trash2,
} from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarFooter,
  SidebarSeparator
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const studentNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "لوحة التحكم" },
  { href: "/subjects", icon: Library, label: "المواد الدراسية" },
  { href: "/dashboard/student/progress", icon: TrendingUp, label: "تقدمي" },
  { href: "/dashboard/student/results", icon: Award, label: "نتائجي" },
  { href: "/profile", icon: Settings, label: "الملف الشخصي" },
];

const teacherNavItems = [
  { href: "/dashboard/teacher", icon: LayoutDashboard, label: "لوحة التحكم" },
  { href: "/dashboard/teacher/lessons", icon: BookCopy, label: "إدارة الدروس" },
  { href: "/dashboard/teacher/exercises", icon: FileQuestion, label: "إدارة التمارين" },
  { href: "/dashboard/teacher/students", icon: Users, label: "تلاميذي" },
  { href: "/dashboard/teacher/submissions", icon: ClipboardCheck, label: "تصحيح التمارين" },
  { href: "/messages", icon: MessageSquare, label: "الرسائل" },
  { href: "/profile", icon: Settings, label: "الإعدادات" },
]

const parentNavItems = [
  { href: "/dashboard/parent", icon: LayoutDashboard, label: "لوحة التحكم" },
  { href: "/dashboard/parent/children", icon: Users, label: "أبنائي" },
  { href: "/dashboard/parent/reports", icon: FileText, label: "التقارير" },
  { href: "/messages", icon: MessageSquare, label: "الرسائل" },
  { href: "/dashboard/parent/notifications", icon: Bell, label: "الإشعارات" },
  { href: "/profile", icon: Settings, label: "الملف الشخصي" },
];

const supervisorNavItems = [
  { href: "/dashboard/subject-supervisor", icon: LayoutDashboard, label: "لوحة التحكم" },
  { href: "/dashboard/subject-supervisor/lessons", icon: Book, label: "إدارة الدروس"},
  { href: "/dashboard/subject-supervisor/exercises", icon: FileQuestion, label: "إدارة التمارين"},
  { href: "/dashboard/subject-supervisor/statistics", icon: BarChart, label: "الإحصائيات" },
  { href: "/messages", icon: MessageSquare, label: "الرسائل" },
  { href: "/profile", icon: Settings, label: "الإعدادات" },
];

const directeurNavItems = [
    { href: "/dashboard/directeur", icon: LayoutDashboard, label: "لوحة التحكم" },
    { href: "/dashboard/directeur/users", icon: Users, label: "إدارة المستخدمين" },
    { href: "/dashboard/directeur/content", icon: BookCopy, label: "إدارة المحتوى" },
    { href: "/dashboard/directeur/promotions", icon: GraduationCap, label: "الترقيات السنوية" },
    { href: "/dashboard/directeur/backup", icon: HardDrive, label: "النسخ الاحتياطي" },
    { href: "/dashboard/directeur/logs", icon: ScrollText, label: "سجلات النظام" },
    { href: "/dashboard/directeur/drive-cleanup", icon: Trash2, label: "تنظيف Drive" },
    { href: "/messages", icon: MessageSquare, label: "الرسائل" },
    { href: "/dashboard/directeur/database", icon: Database, label: "قاعدة البيانات" },
    { href: "/dashboard/directeur/settings", icon: Settings, label: "الإعدادات" },
];


const getNavItems = (role?: string, pathname?: string) => {
  if (pathname?.startsWith('/dashboard/teacher')) {
      return teacherNavItems;
  }
  switch (role) {
    case 'directeur':
        return directeurNavItems;
    case 'teacher':
      return teacherNavItems;
    case 'student':
      return studentNavItems;
    case 'parent':
      return parentNavItems;
    case 'supervisor_specific':
      return supervisorNavItems;
    default:
      return studentNavItems; // Default to student
  }
}

export function SidebarNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    }
  }, [session]);

  useEffect(() => {
    // Fetch unread messages count
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/messages/unread-count');
        const result = await response.json();
        if (result.success) {
          setUnreadCount(result.data.unreadCount);
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    if (user) {
      fetchUnreadCount();
      // Poll every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);
  
  useEffect(() => {
    // This is a hack for the prototype to persist the "context"
    // of which dashboard the user is in.
    // Only run on client-side after mount
    if (typeof window === 'undefined') return;
    
    try {
        if (pathname.startsWith('/dashboard/directeur')) {
            sessionStorage.setItem('currentRolePath', '/dashboard/directeur');
        } else if (pathname.startsWith('/dashboard/subject-supervisor')) {
            sessionStorage.setItem('currentRolePath', '/dashboard/subject-supervisor');
        } else if (pathname.startsWith('/dashboard/teacher')) {
            // Don't overwrite if the origin is supervisor
            const currentRole = sessionStorage.getItem('currentRolePath');
            if (!currentRole || !currentRole.startsWith('/dashboard/subject-supervisor')) {
                sessionStorage.setItem('currentRolePath', '/dashboard/teacher');
            }
        } else if (pathname.startsWith('/dashboard/parent')) {
            sessionStorage.setItem('currentRolePath', '/dashboard/parent');
        } else if (pathname.startsWith('/dashboard/student') || pathname === '/dashboard') {
             sessionStorage.setItem('currentRolePath', '/dashboard/student');
        }
    } catch (error) {
        // Silently fail if sessionStorage is not available
        console.error('sessionStorage not available:', error);
    }
  }, [pathname]);

  const navItems = getNavItems(user?.role, pathname);

  const getIsActive = (href: string) => {
    // Special handling for dashboards
    if (href.endsWith('dashboard')) {
        const dashboardPaths = ['/dashboard', '/dashboard/student', '/dashboard/teacher', '/dashboard/parent', '/dashboard/subject-supervisor', '/dashboard/directeur'];
        const isDashboard = dashboardPaths.some(p => pathname.startsWith(p) && p.length >= pathname.length)
        if (isDashboard) return true;
    }
    
    // For nested routes, check if the pathname starts with the href
    if (href !== '/' && href.length > 1) {
      return pathname.startsWith(href);
    }
    
    return pathname === href;
  }

  if (!user) {
    return null;
  }
  
  const roleName = (user: any) => {
    if (!user?.role) return 'مستخدم';
    if (user.role === 'supervisor_specific' && pathname.startsWith('/dashboard/teacher')) {
        return 'معلم (مشرف)';
    }
    return {
        directeur: 'مدير',
        teacher: 'معلم',
        student: 'طالب',
        parent: 'ولي أمر',
        supervisor_specific: 'مشرف مادة'
    }[user.role] || 'مستخدم';
  }


  return (
    <>
      <div className="flex-1 overflow-y-auto p-2">
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <School className="h-8 w-8 text-sidebar-primary-foreground" />
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-sidebar-primary-foreground">
                  SmartEdu
                </h2>
                <Badge variant="secondary" className="w-fit">{roleName(user)}</Badge>
              </div>
            </div>
          </SidebarHeader>

          <SidebarMenu>
              <SidebarGroupLabel>القائمة الرئيسية</SidebarGroupLabel>
              {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                  <Link href={item.href} passHref>
                    <SidebarMenuButton
                        asChild
                        isActive={getIsActive(item.href)}
                        className="justify-start"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <item.icon className="ml-2 h-5 w-5" />
                          <span>{item.label}</span>
                        </div>
                        {item.href === '/messages' && unreadCount > 0 && (
                          <Badge variant="destructive" className="h-5 min-w-5 flex items-center justify-center px-1.5 text-xs">
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </Badge>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </Link>
              </SidebarMenuItem>
              ))}

              {user.role === 'supervisor_specific' && (
                <>
                    <SidebarSeparator />
                     <SidebarMenuItem>
                        {pathname.startsWith('/dashboard/teacher') ? (
                             <Link href="/dashboard/subject-supervisor" passHref>
                                <SidebarMenuButton className="justify-start">
                                    <div>
                                        <Repeat className="ml-2 h-5 w-5" />
                                        <span>العودة لواجهة المشرف</span>
                                    </div>
                                </SidebarMenuButton>
                            </Link>
                        ) : (
                             <Link href="/dashboard/teacher" passHref>
                                <SidebarMenuButton className="justify-start">
                                    <div>
                                        <Repeat className="ml-2 h-5 w-5" />
                                        <span>التبديل لواجهة المعلم</span>
                                    </div>
                                </SidebarMenuButton>
                            </Link>
                        )}
                    </SidebarMenuItem>
                </>
              )}
          </SidebarMenu>
      </div>
      
      <SidebarFooter className="border-t border-sidebar-border p-2 space-y-2">
          <div className="p-2 flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col truncate">
                  <span className="font-semibold text-sidebar-primary-foreground text-sm">{user?.name}</span>
                  <span className="text-xs text-sidebar-foreground/70 truncate">{user?.email}</span>
              </div>
          </div>
          <SidebarMenuItem>
              <Link href="/login" passHref>
                <SidebarMenuButton className="justify-start">
                    <div>
                        <LogOut className="ml-2 h-5 w-5" />
                        <span>تسجيل الخروج</span>
                    </div>
                </SidebarMenuButton>
              </Link>
          </SidebarMenuItem>
      </SidebarFooter>
    </>
  );
}
