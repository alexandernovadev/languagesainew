import type * as React from "react";
import {
  Home,
  Settings,
  User,
  FileText,
  BookOpen,
  Gamepad2,
  RotateCcw,
  BarChart3,
  User as UserIcon,
  Lock,
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useUserStore } from "@/lib/store/user-store";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AvatarFallbackClient } from "@/components/ui/avatar-fallback-client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
import { cn } from "@/lib/utils";
import { gamesItems, generatorItems, menuItems } from "./sidebar-menus";
import { LoginModal } from "./auth/LoginModal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { pathname } = useLocation();
  const { user, token, logout, isAuthenticated } = useUserStore();
  const [open, setOpen] = useState(false);

  return (
    <Sidebar
      {...props}
      title="Menú"
      description="Navegación principal para la aplicación."
    >
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

      <SidebarContent>
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
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {isAuthenticated() ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" className="w-full justify-start gap-2">
                    <Avatar className="size-7">
                      <AvatarImage src={user?.image || ""} alt={user?.firstName || user?.username || "Usuario"} />
                      <AvatarFallbackClient user={user} />
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      {user?.firstName || user?.username || "Usuario"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-8">
                        <AvatarImage src={user?.image || ""} alt={user?.firstName || user?.username || "Usuario"} />
                        <AvatarFallbackClient user={user} />
                      </Avatar>
                      <div>
                        <div className="font-semibold text-sm">
                          {user?.firstName || ""} {user?.lastName || ""}
                        </div>
                        <div className="text-xs text-muted-foreground">{user?.username}</div>
                      </div>
                    </div>
                    {user?.email && (
                      <div className="text-xs text-muted-foreground mt-1">{user.email}</div>
                    )}
                    {user?.role && (
                      <div className="text-xs text-muted-foreground mt-0.5 capitalize">{user.role}</div>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { /* TODO: go to profile */ }}>
                    Mi perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
