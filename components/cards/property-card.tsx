"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Users, TrendingUp } from "lucide-react"
import Image from "next/image"

interface PropertyCardProps {
  id: string
  title: string
  location: string
  image: string
  price: string
  shares?: number
  roi?: string
  investors?: number
  onAction?: () => void
  actionLabel?: string
}

export function PropertyCard({
  id,
  title,
  location,
  image,
  price,
  shares,
  roi,
  investors,
  onAction,
  actionLabel = "View Details",
}: PropertyCardProps) {
  return (
    <Card className="bg-card border-border overflow-hidden hover:border-primary/50 transition-colors">
      <div className="relative h-48 w-full bg-muted">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>

      <CardContent className="p-4">
        <h3 className="font-bold text-lg text-foreground mb-1">{title}</h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
          <MapPin size={16} />
          {location}
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-2xl font-bold text-primary">{price}</p>
          {roi && (
            <div className="flex items-center gap-2 text-sm text-green-400">
              <TrendingUp size={16} />
              {roi} ROI
            </div>
          )}
          {investors && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users size={16} />
              {investors} investors
            </div>
          )}
          {shares && <p className="text-sm text-muted-foreground">{shares} shares available</p>}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button onClick={onAction} className="w-full bg-primary hover:bg-primary/90">
          {actionLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}
