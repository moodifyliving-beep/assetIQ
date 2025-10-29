import type React from "react"
import { Sidebar } from "@/components/navigation/sidebar"
import { Navbar } from "@/components/navigation/navbar"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Navbar />
      <main className="md:ml-64 mt-16 p-4 md:p-6">{children}</main>
    </div>
  )
}
