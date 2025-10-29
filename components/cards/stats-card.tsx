import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  change?: string
  changeType?: "positive" | "negative"
}

export function StatsCard({ label, value, icon: Icon, change, changeType = "positive" }: StatsCardProps) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-2">{label}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {change && (
              <p className={`text-xs mt-2 ${changeType === "positive" ? "text-green-400" : "text-red-400"}`}>
                {changeType === "positive" ? "+" : "-"}
                {change}
              </p>
            )}
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">
            <Icon size={24} className="text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
