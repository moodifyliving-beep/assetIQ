"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Loader2 } from "lucide-react"
import { useState } from "react"

export function MarketInsightsWidget() {
  const [insights, setInsights] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchInsights = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/market-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marketType: "residential" }),
      })

      const data = await response.json()
      setInsights(data.insights)
    } catch (error) {
      console.error("[v0] Error fetching insights:", error)
      setInsights("Unable to fetch market insights at this time.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Market Insights</h3>
          </div>
          <Button onClick={fetchInsights} disabled={isLoading} size="sm" variant="outline">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Get Insights"
            )}
          </Button>
        </div>

        {insights && (
          <div className="p-4 bg-muted rounded-lg border border-border">
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{insights}</p>
          </div>
        )}
      </div>
    </Card>
  )
}
