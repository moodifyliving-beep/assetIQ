"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { PropertyCard } from "@/components/cards/property-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, RefreshCw, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

interface Property {
  id: string
  title: string
  location: string
  images: string[]
  assetValue: number
  totalShares: number
  availableShares: number
  pricePerShare: number
  status: string
  _count?: { investments: number }
}

export default function InvestMarketplace() {
  const [searchTerm, setSearchTerm] = useState("")
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProperties = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/properties?status=APPROVED,TOKENIZED,FUNDED")
      if (!response.ok) throw new Error("Failed to fetch properties")
      const fetchedProperties = await response.json()
      const propertiesArray = Array.isArray(fetchedProperties) ? fetchedProperties : []
      const availableProperties = propertiesArray.filter((p: Property) => p.availableShares > 0)
      setProperties(availableProperties)
    } catch (err) {
      console.error("Error fetching properties:", err)
      setError("Failed to load properties. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
    const interval = setInterval(fetchProperties, 30000)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") fetchProperties()
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      clearInterval(interval)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  const filteredProperties = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)

  const calculateROI = (property: Property) => {
    const baseROI = 8
    const investmentMultiplier = property._count?.investments ? Math.min(property._count.investments / 10, 5) : 0
    return `${(baseROI + investmentMultiplier).toFixed(1)}%`
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Marketplace</h1>
            <p className="text-muted-foreground">Discover and invest in tokenized assets with fractional NFTs.</p>
          </div>
          <Button variant="outline" onClick={fetchProperties} disabled={loading} className="gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Refresh
          </Button>
        </div>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
                <Input
                  placeholder="Search properties by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input border-border"
                />
              </div>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter size={20} />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>
        {error && (
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="p-4">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}
        {loading && properties.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Link key={property.id} href={`/asset/${property.id}`}>
                <PropertyCard
                  id={property.id}
                  title={property.title}
                  location={property.location}
                  image={property.images?.[0] || "/placeholder.svg"}
                  price={formatPrice(property.assetValue)}
                  shares={property.availableShares}
                  roi={calculateROI(property)}
                  investors={property._count?.investments || 0}
                  actionLabel="View Asset & Invest"
                />
              </Link>
            ))}
          </div>
        )}
        {!loading && filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm ? "No properties found matching your search." : "No properties available in the marketplace yet. Check back soon!"}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
