import type { Metadata } from "next"
import ClientLayout from "./ClientLayout"

export const metadata: Metadata = {
  title: "LanguagesAI",
  description: "Aplicación de aprendizaje de idiomas con IA",
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