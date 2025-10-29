"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { PropertyCard } from "@/components/cards/property-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { userProperties, dashboardStats } from "@/lib/mock-data"

const myProperties = userProperties

export default function MyProperties() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Properties</h1>
            <p className="text-muted-foreground">Properties you've listed for investment.</p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            Add Property <ArrowRight size={18} />
          </Button>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProperties.map((property) => (
            <PropertyCard key={property.id} {...property} actionLabel="Manage" />
          ))}
        </div>

        {/* Performance Summary */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Total Listed Value</p>
                <p className="text-2xl font-bold text-foreground">{dashboardStats.totalListedValue}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Active Investors</p>
                <p className="text-2xl font-bold text-foreground">{dashboardStats.activeInvestors}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Average ROI</p>
                <p className="text-2xl font-bold text-green-400">{dashboardStats.propertyAverageROI}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
