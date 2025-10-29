"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Zap, Coins, TrendingUp } from "lucide-react"

interface NFTMintingPanelProps {
  nftSymbol: string
  nftPrice: string
  royaltyPercentage: number
  floorPrice: string
  totalNFTs: number
  holders: number
}

export function NFTMintingPanel({
  nftSymbol,
  nftPrice,
  royaltyPercentage,
  floorPrice,
  totalNFTs,
  holders,
}: NFTMintingPanelProps) {
  const [quantity, setQuantity] = useState(1)
  const priceNum = Number.parseFloat(nftPrice.replace("$", "").replace(",", ""))
  const totalCost = (priceNum * quantity).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  })

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="text-primary" size={24} />
          Mint Fractional NFTs
        </CardTitle>
        <CardDescription>Own a piece of this asset through fractional NFTs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* NFT Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">NFT Symbol</p>
            <p className="text-xl font-bold text-primary">{nftSymbol}</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Floor Price</p>
            <p className="text-xl font-bold text-accent">{floorPrice}</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Total NFTs</p>
            <p className="text-xl font-bold">{totalNFTs.toLocaleString()}</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Holders</p>
            <p className="text-xl font-bold">{holders.toLocaleString()}</p>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="space-y-4">
          <div>
            <Label className="text-foreground mb-2 block">Quantity to Mint</Label>
            <div className="flex gap-4 items-center">
              <Slider
                value={[quantity]}
                onValueChange={(val) => setQuantity(val[0])}
                min={1}
                max={100}
                step={1}
                className="flex-1"
              />
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                className="w-20 bg-input border-border"
              />
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-secondary/30 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price per NFT:</span>
              <span className="text-foreground font-medium">{nftPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Quantity:</span>
              <span className="text-foreground font-medium">{quantity}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between">
              <span className="text-foreground font-bold">Total Cost:</span>
              <span className="text-primary font-bold text-lg">{totalCost}</span>
            </div>
          </div>

          {/* Royalty Info */}
          <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 flex gap-3">
            <TrendingUp className="text-accent flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-foreground">Earn Royalties</p>
              <p className="text-xs text-muted-foreground">
                Receive {royaltyPercentage}% annual royalties on your NFT holdings
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button className="flex-1 bg-primary hover:bg-primary/90 gap-2">
            <Zap size={18} />
            Mint NFTs
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            Learn More
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
