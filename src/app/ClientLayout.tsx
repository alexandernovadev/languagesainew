import React from "react"
import { useLocation } from "react-router-dom"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { DynamicBreadcrumb } from "@/components/layouts/dynamic-breadcrumb"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const noSidebarRoutes = ["/login", "/register"]
  const showSidebar = !noSidebarRoutes.includes(location.pathname)

  return (
    <SidebarProvider>
      <div className={cn("bg-background font-sans antialiased", "dark")}>
        <Toaster />
        <div className="relative flex min-h-screen">
          {showSidebar && <AppSidebar />}
          <SidebarInset>
            <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <DynamicBreadcrumb />
            </header>
            <main className="flex-1 p-6">
              <div className="container mx-auto">{children}</div>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}
