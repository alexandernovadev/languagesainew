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
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { UserDropdownMenu } from "@/components/ui/UserDropdownMenu";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const noSidebarRoutes = ["/login", "/register"];
  const showSidebar = !noSidebarRoutes.includes(location.pathname);

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
          <UserDropdownMenu avatarSize="h-11 w-11" avatarSrc="/loogo.png" />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          <div className="container mx-auto">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
