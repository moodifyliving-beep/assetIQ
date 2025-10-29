"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { useState } from "react"

interface PropertyAnalyzerProps {
  propertyId: string
  propertyName: string
  price: number
  location: string
}

export function PropertyAnalyzer({ propertyId, propertyName, price, location }: PropertyAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<string | null>(null)

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/analyze-property", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyName,
          price,
          location,
        }),
      })

      const data = await response.json()
      setAnalysis(data.analysis)
    } catch (error) {
      console.error("[v0] Error analyzing property:", error)
      setAnalysis("Unable to analyze property at this time.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Card className="p-4 bg-card border-border">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-foreground">{propertyName}</h3>
            <p className="text-sm text-muted-foreground">{location}</p>
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            size="sm"
            className="gap-2 bg-transparent"
            variant="outline"
          >
            <Sparkles className="w-4 h-4" />
            {isAnalyzing ? "Analyzing..." : "Analyze"}
          </Button>
        </div>

        {analysis && (
          <div className="p-3 bg-muted rounded-lg border border-border">
            <p className="text-sm text-foreground whitespace-pre-wrap">{analysis}</p>
          </div>
        )}
      </div>
    </Card>
  )
}
