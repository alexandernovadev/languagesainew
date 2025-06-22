"use client"

import type * as React from "react"
import { Home, Settings, User, FileText, BookOpen, Gamepad2, RotateCcw, BarChart3, User as UserIcon, Lock } from "lucide-react"
import { usePathname } from "next/navigation"
import { useUserStore } from "@/lib/store/user-store"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { LoginModal } from "@/components/auth/LoginModal"
import { menuItems, generatorItems, gamesItems } from "@/components/sidebar-menus"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user, logout } = useUserStore()
  const [open, setOpen] = useState(false)

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-2">
                <img src="/loogo.png" alt="Logo" className="size-8 rounded-lg bg-sidebar-accent object-cover" />
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
                    className={cn("transition-all duration-300", pathname === item.url && "sidebar-neon-active")}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
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
                    className={cn("transition-all duration-300", pathname === item.url && "sidebar-neon-active")}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
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
                    className={cn("transition-all duration-300", pathname === item.url && "sidebar-neon-active")}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
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
            {user ? (
              <div className="flex items-center gap-2 w-full justify-between">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={user.image || "/placeholder-user.jpg"} alt={user.firstName || user.username} />
                    <AvatarFallback>{(user.firstName || user.username || "U").charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span>{user.firstName || user.username}</span>
                </div>
                <Button size="sm" variant="ghost" onClick={logout}>Salir</Button>
              </div>
            ) : (
              <SidebarMenuButton className="transition-all duration-300 w-full" onClick={() => setOpen(true)}>
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
  )
}
