import type { Metadata } from "next"
import ClientLayout from "./ClientLayout"

export const metadata: Metadata = {
  title: "Mi Aplicación",
  description: "Una aplicación con sidebar y TypeScript",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: any
}) {
  return <ClientLayout>{children}</ClientLayout>
}


import './globals.css'