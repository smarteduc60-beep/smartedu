import { Sidebar, SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { Header } from "@/components/layout/Header";
import PromotionGuard from "@/components/PromotionGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar side="right" collapsible="icon">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex h-screen flex-col">
          <Header />
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            <PromotionGuard>{children}</PromotionGuard>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
