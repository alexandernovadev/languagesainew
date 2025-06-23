import ClientLayout from "./ClientLayout"

export default function RootLayout({
  children,
}: {
  children: any
}) {
  return <ClientLayout>{children}</ClientLayout>
}

import './globals.css'