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
  useSidebar,
} from "@/shared/components/ui/sidebar";
import {
  menuItems,
  guiaItems,
  generatorItems,
  gamesItems,
  configSettingsItems,
} from "../sidebar-menus";
import { useAuth } from "@/shared/hooks/useAuth";
import { useEnvironment } from "@/shared/hooks/useEnvironment";
import { languages as languagesInfo } from "@/utils/common/language";
import { LoginButton } from "../LoginButton";
import { User, LogOut } from "lucide-react";
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

function SidebarFooterNav() {
  const { logout } = useAuth();
  const { isMobile, setOpenMobile } = useSidebar();

  const closeMobile = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <div className="flex flex-col gap-2 px-2 py-2">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Perfil">
            <Link to="/profile" onClick={closeMobile}>
              <User />
              <span>Perfil</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Cerrar sesión"
            onClick={() => {
              closeMobile();
              logout();
            }}
          >
            <LogOut />
            <span>Cerrar sesión</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, user } = useAuth();
  const { isDevelopment } = useEnvironment();
  const location = useLocation();
  const isChatDetail = /^\/chats\/[^/]+$/.test(location.pathname);

  const userDisplayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.username ?? "";

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="relative flex h-8 w-8 items-center justify-center shrink-0">
              <img 
                src={isDevelopment ? "/logodev.png" : "/loogo.png"} 
                alt="LanguagesAI Logo" 
                className="h-8 w-8 object-cover rounded"
              />
              {isAuthenticated && user?.language && languagesInfo[user.language] && (
                <span 
                  className="absolute -bottom-0.5 -right-0.5 text-sm leading-none bg-background rounded-full p-0.5 shadow-sm ring-1 ring-sidebar-border"
                  title={languagesInfo[user.language].name}
                >
                  {languagesInfo[user.language].flag}
                </span>
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
              <span className="truncate text-sm font-semibold">
                {isAuthenticated && userDisplayName
                  ? userDisplayName
                  : "LanguagesAI"}
              </span>
              <span className="text-xs text-muted-foreground">
                v{packageJson.version}
              </span>
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
            <SidebarGroupLabel>Guía</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <MenuItems items={guiaItems} />
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
            <SidebarFooterNav />
          ) : (
            <div className="px-2 py-2">
              <LoginButton />
            </div>
          )}
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
      <SidebarInset className="min-w-0 overflow-hidden">
        <div
          className={
            isChatDetail
              ? "flex flex-1 flex-col min-h-0 min-w-0"
              : "flex flex-1 flex-col gap-4 p-4 pb-0 min-w-0 overflow-hidden"
          }
        >
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
