"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Calendar } from "lucide-react"

export default function RentPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Rent & Tenants
          </h1>
          <p className="text-muted-foreground">
            Track rent payments, tenants, and lease terms
          </p>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="py-16 text-center">
            <Wallet className="size-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Rent collection coming soon
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Rent collection, tenant management, and lease tracking will be available here. For now, manage your properties from My Properties.
            </p>
            <Button variant="outline" className="mt-6" asChild>
              <a href="/property/my-properties">View My Properties</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
