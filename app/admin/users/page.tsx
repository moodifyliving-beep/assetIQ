'use client'

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAccount } from "wagmi"
import { useEffect, useState } from "react"
import { Loader2, Shield, User } from "lucide-react"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AdminUsers() {
  const { address } = useAccount()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (address) {
    fetchUsers()
    }
  }, [address])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'x-wallet-address': address || ''
        }
      })

      if (!response.ok) throw new Error('Failed to fetch users')

      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (walletAddress: string, newRole: string) => {
    try {
      // URL encode the wallet address to handle special characters
      const encodedAddress = encodeURIComponent(walletAddress)
      const response = await fetch(`/api/admin/users/${encodedAddress}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': address || ''
        },
        body: JSON.stringify({ role: newRole })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || 'Failed to update role')
      }

      toast.success('User role updated successfully')
      fetchUsers()
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.message || 'Failed to update user role')
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-purple-100 text-purple-800'
      case 'ADMIN': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
          <p className="text-muted-foreground">
            Manage user roles and permissions
          </p>
        </div>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>All Users ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? (
                        <Shield className="w-5 h-5 text-blue-600" />
                      ) : (
                        <User className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-mono text-sm">{user.walletAddress}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {user.properties || 0} properties
                        </span>
                      </div>
                    </div>
                  </div>

                  <Select
                    value={user.role}
                    onValueChange={(value) => handleRoleChange(user.walletAddress, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

