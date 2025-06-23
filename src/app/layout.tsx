import DashboardLayout from "./DashboardLayout"

export default function RootLayout({
  children,
}: {
  children: any
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}

import './globals.css'