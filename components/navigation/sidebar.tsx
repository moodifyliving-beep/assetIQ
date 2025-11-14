"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { LayoutDashboard, ShoppingCart, Home, Plus, TrendingUp, Coins, Menu, X, MessageCircle, Shield, Users, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingCart },
  { label: "My Properties", href: "/my-properties", icon: Home },
  { label: "Add Property", href: "/add-property", icon: Plus },
  { label: "My Investments", href: "/my-investments", icon: TrendingUp },
  { label: "Royalties", href: "/royalties", icon: Coins },
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
  const { address, isConnected } = useAccount()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (isConnected && address) {
      checkAdminStatus()
    } else {
      setIsAdmin(false)
    }
  }, [isConnected, address])

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/admin/check', {
        headers: {
          'x-wallet-address': address || ''
        }
      })
      
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
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-2xl font-bold text-sidebar-foreground">AssetsIQ</h1>
          <p className="text-xs text-sidebar-accent-foreground opacity-60">Tokenized property Investing</p>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent",
                )}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}

          {/* Admin Section */}
          {isAdmin && (
            <>
              <div className="pt-4 mt-4 border-t border-sidebar-border">
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-sidebar-accent-foreground uppercase tracking-wider opacity-60">
                    Admin
                  </p>
                </div>
              </div>
              {adminMenuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent",
                    )}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </>
          )}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
