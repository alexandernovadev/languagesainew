import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar";
import {
  menuItems,
  generatorItems,
  gamesItems,
  configSettingsItems,
} from "../sidebar-menus";
import { useAuth } from "@/shared/hooks/useAuth";
import { UserMenu } from "../UserMenu";
import { LoginButton } from "../LoginButton";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isActive = (url: string) => {
    if (url === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(url);
  };

  const renderMenuItems = (items: typeof menuItems) => {
    return items.map((item) => {
      const Icon = item.icon;
      const active = isActive(item.url);
      return (
        <SidebarMenuItem key={item.url}>
          <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
            <Link to={item.url}>
              <Icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-bold">LA</span>
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-semibold">LanguagesAI</span>
              <span className="text-xs text-muted-foreground">v1.0.0</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navegación</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderMenuItems(menuItems)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Generadores</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderMenuItems(generatorItems)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Juegos</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderMenuItems(gamesItems)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Configuración</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderMenuItems(configSettingsItems)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-1 items-center justify-end gap-4">
            {isAuthenticated ? <UserMenu /> : <LoginButton />}
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 overflow-auto">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
