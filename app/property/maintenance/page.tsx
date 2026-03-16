"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wrench } from "lucide-react"

export default function MaintenancePage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Maintenance
          </h1>
          <p className="text-muted-foreground">
            Track maintenance requests and schedule repairs
          </p>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="py-16 text-center">
            <Wrench className="size-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Maintenance tracking coming soon
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Maintenance requests, scheduling, and vendor assignment will be available here.
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
