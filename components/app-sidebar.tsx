"use client"

import type * as React from "react"
import { Home, Settings, User, FileText, BookOpen, Gamepad2, RotateCcw, BarChart3, User as UserIcon, Lock } from "lucide-react"
import { usePathname } from "next/navigation"
import { useUserStore } from "@/lib/store/user-store"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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

// Datos del menú
const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Configuración",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Lectures",
    url: "/lectures",
    icon: BookOpen,
  },
  {
    title: "My Words",
    url: "/mywords",
    icon: BookOpen,
  },
  {
    title: "Estadísticas",
    url: "/statistics",
    icon: BarChart3,
  },
]

const generatorItems = [
  {
    title: "Exam Generator",
    url: "/generator/exam",
    icon: FileText,
  },
  {
    title: "Lecture Generator",
    url: "/generator/lecture",
    icon: BookOpen,
  },
]

const gamesItems = [
  {
    title: "Anki Game",
    url: "/games/anki",
    icon: RotateCcw,
  },
  {
    title: "Verbs Participios",
    url: "/games/verbs",
    icon: Gamepad2,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user, logout, login, loading, error } = useUserStore()
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [touched, setTouched] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    await login(username, password)
    // Si login fue exitoso, cerrar modal
    if (useUserStore.getState().user) {
      setOpen(false)
      setUsername("")
      setPassword("")
      setTouched(false)
    }
  }

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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm mx-auto rounded-xl p-6">
          <DialogHeader className="items-center text-center">
            <div className="flex flex-col items-center gap-2 mb-2">
              <div className="bg-sidebar-accent p-3 rounded-full mb-1 flex items-center justify-center">
                <img src="/loogo.png" alt="Logo" className="size-10 rounded-full object-cover" />
              </div>
              <DialogTitle className="text-2xl font-bold">Bienvenido de nuevo</DialogTitle>
              <p className="text-muted-foreground text-sm max-w-xs">Inicia sesión para acceder a tu espacio personal y continuar aprendiendo con LanguagesAI.</p>
            </div>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 mt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2" htmlFor="login-username">
                <UserIcon className="size-4 text-muted-foreground" /> Usuario o email
              </label>
              <Input
                id="login-username"
                placeholder="Usuario o email"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2" htmlFor="login-password">
                <Lock className="size-4 text-muted-foreground" /> Contraseña
              </label>
              <Input
                id="login-password"
                placeholder="Contraseña"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            {error && touched && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <Button type="submit" className="w-full btn-green-neon mt-2" size="lg" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
            <div className="text-xs text-center mt-2">
              ¿Olvidaste tu contraseña? <a href="#" className="text-primary underline hover:text-primary/80 transition-colors">Recupérala aquí</a>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Sidebar>
  )
}
