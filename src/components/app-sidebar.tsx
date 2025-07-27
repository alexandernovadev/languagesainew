import type * as React from "react";
import { useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "@/components/ui/sidebar";
import packageJson from "../../package.json";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/utils/common/classnames";
import {
  gamesItems,
  generatorItems,
  menuItems,
  configSettingsItems,
} from "./sidebar-menus";
import { LoginModal } from "./auth/LoginModal";

export function AppSidebar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();

  // Handler para cerrar sidebar en móvil
  const handleMenuClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-2">
                <img
                  src="/loogo.png"
                  alt="Logo"
                  className="size-8 rounded-lg bg-sidebar-accent object-contain"
                />
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">LanguagesAI</span>
                  <span className="text-xs">v{packageJson.version}</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <div className="overflow-y-auto overflow-x-hidden h-full">
          <SidebarGroup>
            <SidebarGroupLabel>Navegación</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={cn(
                        "transition-all duration-300",
                        pathname === item.url && "sidebar-neon-active"
                      )}
                      onClick={handleMenuClick}
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Generadores</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {generatorItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={cn(
                        "transition-all duration-300",
                        pathname === item.url && "sidebar-neon-active"
                      )}
                      onClick={handleMenuClick}
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Juegos</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {gamesItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={cn(
                        "transition-all duration-300",
                        pathname === item.url && "sidebar-neon-active"
                      )}
                      onClick={handleMenuClick}
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {configSettingsItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={cn(
                        "transition-all duration-300",
                        pathname === item.url && "sidebar-neon-active"
                      )}
                      onClick={handleMenuClick}
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>

      <SidebarRail />

      <LoginModal open={open} setOpen={setOpen} />
    </Sidebar>
  );
}
