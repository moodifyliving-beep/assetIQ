"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Loader2 } from "lucide-react"
import { useState } from "react"

interface PortfolioAnalyzerProps {
  portfolioValue: number
  propertiesCount: number
  totalROI: number
}

export function PortfolioAnalyzer({ portfolioValue, propertiesCount, totalROI }: PortfolioAnalyzerProps) {
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAnalyze = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/portfolio-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          portfolioValue,
          propertiesCount,
          totalROI,
        }),
      })

      const data = await response.json()
      setAnalysis(data.analysis)
    } catch (error) {
      console.error("[v0] Error analyzing portfolio:", error)
      setAnalysis("Unable to analyze portfolio at this time.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Portfolio Analysis</h3>
          </div>
          <Button onClick={handleAnalyze} disabled={isLoading} size="sm" variant="outline">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze"
            )}
          </Button>
        </div>

        {analysis && (
          <div className="p-4 bg-muted rounded-lg border border-border">
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{analysis}</p>
          </div>
        )}
      </div>
    </Card>
  )
}
