"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb, Loader2 } from "lucide-react"
import { useState } from "react"

export function InvestmentRecommendations() {
  const [recommendations, setRecommendations] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchRecommendations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/investment-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          portfolioValue: 250000,
          riskTolerance: "moderate",
        }),
      })

      const data = await response.json()
      setRecommendations(data.recommendations)
    } catch (error) {
      console.error("[v0] Error fetching recommendations:", error)
      setRecommendations("Unable to fetch recommendations at this time.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-foreground">AI Recommendations</h3>
          </div>
          <Button onClick={fetchRecommendations} disabled={isLoading} size="sm" variant="outline">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Get Recommendations"
            )}
          </Button>
        </div>

        {recommendations && (
          <div className="p-4 bg-muted rounded-lg border border-border">
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{recommendations}</p>
          </div>
        )}
      </div>
    </Card>
  )
}
