"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { PropertyCard } from "@/components/cards/property-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { useState } from "react"
import { assets } from "@/lib/mock-data"
import Link from "next/link"

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAssets = assets.filter(
    (asset) =>
      asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Marketplace</h1>
          <p className="text-muted-foreground">Discover and invest in tokenized assets with fractional NFTs.</p>
        </div>

        {/* Search and Filter */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
                <Input
                  placeholder="Search assets by name, location, or category..."
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

        {/* Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => (
            <Link key={asset.id} href={`/asset/${asset.id}`}>
              <PropertyCard
                id={asset.id}
                title={asset.title}
                location={asset.location}
                image={asset.image}
                price={asset.price}
                shares={asset.totalShares}
                roi={asset.roi}
                investors={asset.investors}
                actionLabel="View Asset & Mint NFTs"
              />
            </Link>
          ))}
        </div>

        {filteredAssets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No assets found matching your search.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
