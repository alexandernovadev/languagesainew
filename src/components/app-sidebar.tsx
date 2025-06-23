import type * as React from "react";
import { User, User as UserIcon } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useUserStore } from "@/lib/store/user-store";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "@/components/ui/sidebar";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
import { gamesItems, generatorItems, menuItems } from "./sidebar-menus";
import { LoginModal } from "./auth/LoginModal";

import { UserDropdownMenu } from "@/components/ui/UserDropdownMenu";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { pathname } = useLocation();
  const { isAuthenticated } = useUserStore();
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
    <Sidebar
      {...props}
      title="Menú"
      description="Navegación principal para la aplicación."
    >
      {isMobile ? (
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <div className="flex items-center gap-2">
                  <VisuallyHidden>
                    <span>Menú</span>
                    <span>Navegación principal para la aplicación.</span>
                  </VisuallyHidden>
                  <img
                    src="/loogo.png"
                    alt="Logo"
                    className="size-8 rounded-lg bg-sidebar-accent object-cover"
                  />
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">LanguagesAI</span>
                    <span className="text-xs">v1.0.0</span>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
      ) : (
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <div className="flex items-center gap-2">
                  <img
                    src="/loogo.png"
                    alt="Logo"
                    className="size-8 rounded-lg bg-sidebar-accent object-cover"
                  />
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">LanguagesAI</span>
                    <span className="text-xs">v1.0.0</span>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
      )}

      <SidebarContent>
        <div className="overflow-y-auto h-full">
          <SidebarGroup>
            <SidebarGroupLabel>Navegación</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
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
            <SidebarGroupLabel>Generator</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {generatorItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
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
            <SidebarGroupLabel>Games</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {gamesItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
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

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {isAuthenticated() ? (
              <UserDropdownMenu
                showName={true}
                avatarSize="size-7"
                buttonClassName="w-full justify-start"
              />
            ) : (
              <SidebarMenuButton
                className="transition-all duration-300 w-full"
                onClick={() => setOpen(true)}
              >
                <User />
                <span>Iniciar sesión</span>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />

      <LoginModal open={open} setOpen={setOpen} />
    </Sidebar>
  );
}
