// app/admin/page.tsx
'use client'

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Loader2, Users, Building2, CheckCircle, XCircle, Clock, DollarSign, LogIn } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth-client"

export default function AdminDashboard() {
  const { data: session, isPending: sessionLoading } = useSession()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!sessionLoading) {
      checkAdminAndFetchStats()
    }
  }, [sessionLoading])

  const checkAdminAndFetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')

      if (response.status === 401) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }

      const data = await response.json()
      setStats(data)
      setIsAdmin(true)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to load admin dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (sessionLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  if (!session?.user) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <LogIn className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4">Sign in to access admin</h2>
          <p className="text-muted-foreground mb-6">Sign in with an admin account to manage the platform.</p>
          <Link href="/login">
            <Button>Sign in</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to access this page</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage properties, users, and platform operations
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Properties
              </CardTitle>
              <Building2 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalProperties || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Review
              </CardTitle>
              <Clock className="w-4 h-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats?.pendingProperties || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Approved
              </CardTitle>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats?.approvedProperties || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Value
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(stats?.totalValue || 0).toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Investments
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalInvestments || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rejected
              </CardTitle>
              <XCircle className="w-4 h-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats?.rejectedProperties || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/admin/properties">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>Review Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Approve or reject property listings
                </p>
                <Button className="mt-4 w-full">Manage Properties</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/users">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>Manage Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View and manage user roles
                </p>
                <Button className="mt-4 w-full">View Users</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/activity">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>Activity Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View platform activity and logs
                </p>
                <Button className="mt-4 w-full">View Logs</Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}