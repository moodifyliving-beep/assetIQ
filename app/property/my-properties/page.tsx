"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth-client"
import { useEffect, useState } from "react"
import { Loader2, LogIn } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function MyProperties() {
  const { data: session, isPending: sessionLoading } = useSession()
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      setProperties([])
      setLoading(true)
      fetchProperties()
    } else if (!sessionLoading) {
      setProperties([])
      setLoading(false)
    }
  }, [session, sessionLoading])

  const fetchProperties = async () => {
    try {
      const response = await fetch(`/api/properties?mine=true`)
      if (!response.ok) throw new Error("Failed to fetch properties")
      const data = await response.json()
      setProperties(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching properties:", error)
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "APPROVED":
        return "bg-green-100 text-green-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      case "TOKENIZED":
        return "bg-blue-100 text-blue-800"
      case "FUNDED":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (sessionLoading) {
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
          <h2 className="text-2xl font-bold mb-4">Sign in to view your properties</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Sign in with your email to view and manage your properties. No wallet required.
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              My Properties
            </h1>
            <p className="text-muted-foreground">
              Manage your listed assets and track their performance
            </p>
          </div>
          <Link href="/property/add-property">
            <Button>Add New Property</Button>
          </Link>
        </div>

        {properties.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                You haven&apos;t listed any properties yet
              </p>
              <Link href="/property/add-property">
                <Button>List Your First Property</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card key={property.id} className="overflow-hidden">
                <div className="relative h-48">
                  {property.images?.length > 0 ? (
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">No Image</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}
                    >
                      {property.status}
                    </span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{property.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {property.location}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Asset Value</span>
                      <span className="font-medium">
                        ${property.assetValue?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Shares</span>
                      <span className="font-medium">{property.totalShares}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Available</span>
                      <span className="font-medium">
                        {property.availableShares}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Investors</span>
                      <span className="font-medium">
                        {property._count?.investments || 0}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link href={`/asset/${property.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    {property.owner?.id === session?.user?.id && (
                      <Link href={`/properties/${property.id}/edit`}>
                        <Button variant="ghost">Edit</Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
