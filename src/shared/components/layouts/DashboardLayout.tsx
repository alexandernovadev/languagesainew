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
  useSidebar,
} from "@/shared/components/ui/sidebar";
import {
  menuItems,
  generatorItems,
  gamesItems,
  configSettingsItems,
} from "../sidebar-menus";
import { useAuth } from "@/shared/hooks/useAuth";
import { useEnvironment } from "@/shared/hooks/useEnvironment";
import { UserMenu } from "../UserMenu";
import { LoginButton } from "../LoginButton";
import packageJson from "../../../../package.json";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function MenuItems({ items }: { items: typeof menuItems }) {
  const location = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();

  const isActive = (url: string) => {
    if (url === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(url);
  };

  const handleClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <>
      {items.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.url);
        return (
          <SidebarMenuItem key={item.url}>
            <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
              <Link to={item.url} onClick={handleClick}>
                <Icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, user } = useAuth();
  const { isDevelopment } = useEnvironment();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center">
              <img 
                src={isDevelopment ? "/logodev.png" : "/loogo.png"} 
                alt="LanguagesAI Logo" 
                className="h-8 w-8 object-cover"
              />
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-semibold">LanguagesAI</span>
              <span className="text-xs text-muted-foreground">v{packageJson.version}</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navegación</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <MenuItems items={menuItems} />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Generadores</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <MenuItems items={generatorItems} />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Juegos</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <MenuItems items={gamesItems} />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Configuración</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <MenuItems items={configSettingsItems} />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          {isAuthenticated && user ? (
            <div className="flex flex-col gap-2 px-2 py-2">
              {/* User Info with Name */}
              <div className="flex items-center gap-2">
                <UserMenu />
                <div className="flex-1 group-data-[collapsible=icon]:hidden">
                  <p className="text-sm font-medium">
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.username}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              
              {/* Collapse Button */}
              <div className="flex items-center">
                <SidebarTrigger className="h-8 w-8 border-none" />
                <span className="text-sm group-data-[collapsible=icon]:hidden">
                  Cerrar
                </span>
              </div>
            </div>
          ) : (
            <div className="px-2 py-2">
              <LoginButton />
            </div>
          )}
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
