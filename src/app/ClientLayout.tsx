"use client"

import React from "react"
import { useLocation } from "react-router-dom"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const noSidebarRoutes = ["/login", "/register"]
  const showSidebar = !noSidebarRoutes.includes(location.pathname)

  return (
    <div className={cn("bg-background font-sans antialiased", "dark")}>
      <Toaster />
      <div className="relative flex min-h-screen">
        {showSidebar && <AppSidebar />}
        <main className="flex-1 p-6">
          <div className="container mx-auto">
            {/* Breadcrumb podría ir aquí más tarde */}
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
