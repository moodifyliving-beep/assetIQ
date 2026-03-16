"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import {
  LayoutDashboard,
  ShoppingCart,
  Home,
  Plus,
  TrendingUp,
  Coins,
  Menu,
  X,
  MessageCircle,
  Shield,
  Users,
  FileText,
  Wallet,
  Wrench,
  FileStack,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSession } from "@/lib/auth-client"
import { DashboardModeSwitcher } from "./dashboard-mode-switcher"

const propertyMenuItems = [
  { label: "Dashboard", href: "/property/dashboard", icon: LayoutDashboard },
  { label: "My Properties", href: "/property/my-properties", icon: Home },
  { label: "Add Property", href: "/property/add-property", icon: Plus },
  { label: "Rent & Tenants", href: "/property/rent", icon: Wallet },
  { label: "Maintenance", href: "/property/maintenance", icon: Wrench },
  { label: "Documents", href: "/property/documents", icon: FileStack },
  { label: "Reports", href: "/property/reports", icon: BarChart3 },
]

const investMenuItems = [
  { label: "Dashboard", href: "/invest/dashboard", icon: LayoutDashboard },
  { label: "Marketplace", href: "/invest/marketplace", icon: ShoppingCart },
  { label: "My Investments", href: "/invest/my-investments", icon: TrendingUp },
  { label: "Royalties", href: "/invest/royalties", icon: Coins },
]

const sharedMenuItems = [
  { label: "AI Assistant", href: "/chat", icon: MessageCircle },
]

const adminMenuItems = [
  { label: "Admin Dashboard", href: "/admin", icon: Shield },
  { label: "Admin Properties", href: "/admin/properties", icon: FileText },
  { label: "Admin Users", href: "/admin/users", icon: Users },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()
  const [isAdmin, setIsAdmin] = useState(false)

  const isPropertyMode =
    pathname.startsWith("/property") ||
    pathname.startsWith("/my-properties") ||
    pathname.startsWith("/add-property") ||
    pathname.startsWith("/properties/")

  const menuItems = isPropertyMode ? propertyMenuItems : investMenuItems

  const checkAdminStatus = async () => {
    try {
      const response = await fetch("/api/admin/check")

      if (response.ok) {
        const data = await response.json()
        setIsAdmin(data.isAdmin || false)
      } else {
        setIsAdmin(false)
      }
    } catch {
      setIsAdmin(false)
    }
  }

  useEffect(() => {
    if (session?.user) {
      checkAdminStatus()
    } else {
      setIsAdmin(false)
    }
  }, [session])

  const isActive = (href: string) => {
    if (href === "/property/dashboard" || href === "/invest/dashboard") {
      return pathname === href
    }
    return pathname.startsWith(href) || pathname === href
  }

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-card border border-border"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 z-40",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-2xl font-bold text-sidebar-foreground">Moodify</h1>
          <p className="text-xs text-sidebar-accent-foreground opacity-60">
            Tokenized property investing
          </p>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
          <DashboardModeSwitcher />

          <div className="px-3 mb-1">
            <p className="text-[10px] font-semibold text-sidebar-accent-foreground uppercase tracking-wider opacity-60">
              {isPropertyMode ? "Property Management" : "Investing"}
            </p>
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}

          <div className="pt-4 mt-4 border-t border-sidebar-border">
            {sharedMenuItems.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>

          {isAdmin && (
            <>
              <div className="pt-4 mt-4 border-t border-sidebar-border">
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-sidebar-accent-foreground uppercase tracking-wider opacity-60">
                    Admin
                  </p>
                </div>
                {adminMenuItems.map((item) => {
                  const Icon = item.icon
                  const active = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                        active
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent"
                      )}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </>
          )}
        </nav>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
