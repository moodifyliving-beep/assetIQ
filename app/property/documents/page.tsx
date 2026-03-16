"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileStack } from "lucide-react"

export default function DocumentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Documents
          </h1>
          <p className="text-muted-foreground">
            Property deeds, leases, insurance, and compliance files
          </p>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="py-16 text-center">
            <FileStack className="size-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Document vault coming soon
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Store and manage property documents, deeds, leases, and compliance files in one place.
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
