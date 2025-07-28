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
import { LoginModal } from "@/components/auth/LoginModal";
import { useLoginModal } from "@/hooks/useLoginModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const noSidebarRoutes = ["/login", "/register"];
  const showSidebar = !noSidebarRoutes.includes(location.pathname);
  const { isAuthenticated } = useUserStore();
  const { isOpen, openLoginModal, closeLoginModal } = useLoginModal();

  return (
    <SidebarProvider>
      <Toaster />
      {showSidebar && <AppSidebar />}
      <SidebarInset className="h-dvh overflow-auto bg-background font-sans antialiased">
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
              onClick={openLoginModal}
              className="flex items-center gap-2"
            >
              <LogIn className="h-4 w-4" />
            </Button>
          )}
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 overflow-x-hidden">
          <div className="container mx-auto overflow-x-hidden">{children}</div>
        </main>
      </SidebarInset>
      <LoginModal open={isOpen} setOpen={closeLoginModal} />
    </SidebarProvider>
  );
}
