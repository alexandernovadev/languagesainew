import React from "react";
import { useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { DynamicBreadcrumb } from "@/components/layouts/dynamic-breadcrumb";
import { UserDropdownMenu } from "@/components/ui/UserDropdownMenu";
import { useUserStore } from "@/lib/store/user-store";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useState } from "react";
import { LoginModal } from "@/components/auth/LoginModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const noSidebarRoutes = ["/login", "/register"];
  const showSidebar = !noSidebarRoutes.includes(location.pathname);
  const { isAuthenticated } = useUserStore();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <SidebarProvider>
      <Toaster />
      {showSidebar && <AppSidebar />}
      <SidebarInset className="h-screen overflow-auto bg-background font-sans antialiased">
        <header
          className={`sticky top-0 z-50 flex h-16 shrink-0 items-center 
          gap-2 border-b bg-background/95 backdrop-blur 
          supports-[backdrop-filter]:bg-background/60 px-4`}
        >
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <DynamicBreadcrumb />
          <div className="flex-1" />
          {isAuthenticated() ? (
            <UserDropdownMenu avatarSize="h-11 w-11" avatarSrc="/loogo.png" />
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLoginModalOpen(true)}
              className="flex items-center gap-2"
            >
              <LogIn className="h-4 w-4" />
            </Button>
          )}
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          <div className="container mx-auto">{children}</div>
        </main>
      </SidebarInset>
      <LoginModal open={loginModalOpen} setOpen={setLoginModalOpen} />
    </SidebarProvider>
  );
}
