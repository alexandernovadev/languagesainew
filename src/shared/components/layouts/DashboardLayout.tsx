import React from "react";
import { useLocation } from "react-router-dom";
import { AppSidebar } from "@/shared/components/app-sidebar";
import { Toaster } from "@/shared/components/ui/sonner";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/shared/components/ui/sidebar";
import { Separator } from "@/shared/components/ui/separator";
import { DynamicBreadcrumb } from "@/shared/components/layouts/dynamic-breadcrumb";
import { UserDropdownMenu } from "@/shared/components/ui/UserDropdownMenu";
import { Button } from "@/shared/components/ui/button";
import { LogIn } from "lucide-react";
import { useUserStore } from "@/pages/users/store/user-store";
import { useLoginModal } from "@/pages/users/hooks/useLoginModal";
import { useEnvironment } from "@/shared/hooks/useEnvironment";
import { LoginModal } from "@/pages/auth/components/LoginModal";

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
  const { isDevelopment } = useEnvironment();

  return (
    <SidebarProvider>
      <Toaster />
      {showSidebar && <AppSidebar />}
      <SidebarInset className="h-dvh overflow-auto bg-background font-sans antialiased">
        <header
          className={`sticky top-0 z-30 flex h-16 shrink-0 items-center 
          gap-2 border-b bg-background/95 backdrop-blur 
          supports-[backdrop-filter]:bg-background/60 px-4`}
        >
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <DynamicBreadcrumb />
          <div className="flex-1" />
          {isAuthenticated() ? (
            <UserDropdownMenu
              avatarSize="h-11 w-11"
              avatarSrc={isDevelopment ? "/logodev.png" : "/loogo.png"}
            />
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
        <main className="flex flex-1 flex-col gap-4 p-4 overflow-hidden">
          <div className="container mx-auto overflow-y-auto h-full">
            {children}
          </div>
        </main>
      </SidebarInset>
      <LoginModal open={isOpen} setOpen={closeLoginModal} />
    </SidebarProvider>
  );
}
