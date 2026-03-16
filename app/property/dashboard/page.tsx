"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Wallet, Wrench, ArrowRight, Plus, LogIn } from "lucide-react"
import Link from "next/link"
import { useSession } from "@/lib/auth-client"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

export default function PropertyDashboard() {
  const { data: session, isPending: sessionLoading } = useSession()
  const [stats, setStats] = useState({
    totalProperties: 0,
    pendingRent: 0,
    openMaintenance: 0,
    occupancyRate: "0%",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      fetchStats()
    } else if (!sessionLoading) {
      setLoading(false)
    }
  }, [session, sessionLoading])

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/properties?mine=true`)
      if (res.ok) {
        const data = await res.json()
        const props = Array.isArray(data) ? data : []
        setStats({
          totalProperties: props.length,
          pendingRent: 0,
          openMaintenance: 0,
          occupancyRate: props.length > 0 ? "—" : "0%",
        })
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  if (sessionLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    )
  }

  if (!session?.user) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <LogIn className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4">Sign in to manage properties</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Sign in with your email to add and manage properties. No wallet required.
          </p>
          <Link href="/login">
            <Button>Sign in</Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
          </p>
        </div>
      </DashboardLayout>
    )
  }

  const quickStats = [
    {
      label: "Total Properties",
      value: loading ? "—" : stats.totalProperties.toString(),
      icon: Building2,
      href: "/property/my-properties",
    },
    {
      label: "Pending Rent",
      value: loading ? "—" : `$${stats.pendingRent.toLocaleString()}`,
      icon: Wallet,
      href: "/property/rent",
    },
    {
      label: "Open Maintenance",
      value: loading ? "—" : stats.openMaintenance.toString(),
      icon: Wrench,
      href: "/property/maintenance",
    },
    {
      label: "Occupancy Rate",
      value: stats.occupancyRate,
      icon: Building2,
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Property Management
            </h1>
            <p className="text-muted-foreground">
              Overview of your properties, rent, and maintenance
            </p>
          </div>
          <Link href="/property/add-property">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Property
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.label} href={item.href || "#"}>
                <Card className="bg-card border-border hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {item.label}
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                          {item.value}
                        </p>
                      </div>
                      <Icon className="size-8 text-muted-foreground/60" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/property/add-property">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Plus className="w-4 h-4" />
                  List New Property
                </Button>
              </Link>
              <Link href="/property/rent">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Wallet className="w-4 h-4" />
                  Record Rent Payment
                </Button>
              </Link>
              <Link href="/property/maintenance">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Wrench className="w-4 h-4" />
                  Log Maintenance Request
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage rent collection, tenants, maintenance, and documents from the sidebar. View reports for financial summaries and tax exports.
              </p>
              <Link href="/chat">
                <Button variant="outline" className="gap-2">
                  Ask AI Assistant
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
