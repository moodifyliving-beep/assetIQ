"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building2, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

export type DashboardMode = "property" | "invest"

const MODES = [
  {
    id: "property" as const,
    href: "/property/dashboard",
    icon: Building2,
    label: "Property",
    subtitle: "Manage assets",
  },
  {
    id: "invest" as const,
    href: "/invest/dashboard",
    icon: TrendingUp,
    label: "Invest",
    subtitle: "Trade & earn",
  },
]

export function DashboardModeSwitcher() {
  const pathname = usePathname()

  const isPropertyMode =
    pathname.startsWith("/property") ||
    pathname.startsWith("/my-properties") ||
    pathname.startsWith("/add-property") ||
    pathname.startsWith("/properties/")

  return (
    <div className="mb-5 px-1">
      <p className="text-[10px] font-semibold text-sidebar-accent-foreground uppercase tracking-[0.2em] mb-3 opacity-70">
        Switch mode
      </p>
      <div className="relative flex rounded-xl bg-sidebar-accent/60 p-1.5 border border-sidebar-border/50">
        {/* Sliding indicator */}
        <div
          className={cn(
            "absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-lg bg-sidebar-primary shadow-md transition-all duration-200 ease-out",
            isPropertyMode ? "left-1.5" : "left-[calc(50%+3px)]"
          )}
        />
        {MODES.map((mode) => {
          const Icon = mode.icon
          const isActive =
            mode.id === "property" ? isPropertyMode : !isPropertyMode
          return (
            <Link
              key={mode.id}
              href={mode.href}
              className={cn(
                "relative z-10 flex flex-1 flex-col items-center gap-0.5 rounded-lg px-4 py-2.5 transition-colors duration-200",
                isActive
                  ? "text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80 hover:text-sidebar-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <Icon
                  className={cn(
                    "size-4 shrink-0 transition-transform",
                    isActive && "scale-110"
                  )}
                />
                <span className="text-sm font-semibold">{mode.label}</span>
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium",
                  isActive
                    ? "text-sidebar-primary-foreground/90"
                    : "text-sidebar-foreground/60"
                )}
              >
                {mode.subtitle}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
