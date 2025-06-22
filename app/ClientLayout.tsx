"use client"
import { Inter } from "next/font/google"
import "./globals.css"
import { usePathname } from "next/navigation"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ThemeEnforcer } from "@/components/theme-enforcer"
import React from "react"

const inter = Inter({ subsets: ["latin"] })

// Mapeo de rutas a nombres legibles
const routeNames: { [key: string]: string } = {
  "/": "Dashboard",
  "/settings": "Configuración",
  "/generator": "Generator",
  "/generator/exam": "Exam Generator",
  "/generator/lecture": "Lecture Generator",
  "/games": "Games",
  "/games/anki": "Anki Game",
  "/games/verbs": "Verbs Participios",
  "/lectures": "Lectures",
  "/mywords": "My Words",
  "/statistics": "Estadísticas",
}

function DynamicBreadcrumb() {
  const pathname = usePathname()

  // Generar breadcrumbs basados en la ruta actual
  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split("/").filter((segment) => segment !== "")
    const breadcrumbs = []

    // Siempre incluir "Mi Aplicación" como raíz
    breadcrumbs.push({
      label: "Mi Aplicación",
      href: "/",
      isCurrentPage: pathname === "/",
    })

    // Si no estamos en la página principal, agregar segmentos
    if (pathname !== "/") {
      let currentPath = ""

      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`
        const isLast = index === pathSegments.length - 1

        breadcrumbs.push({
          label: routeNames[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1),
          href: currentPath,
          isCurrentPage: isLast,
        })
      })
    }

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.href}>
            <BreadcrumbItem>
              {crumb.isCurrentPage ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default function ClientLayout({
  children,
}: {
  children: any
}) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} dark bg-background text-foreground`}>
        <ThemeEnforcer />
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="h-screen overflow-auto">
            <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <DynamicBreadcrumb />
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  )
}
