"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Send, TrendingUp } from "lucide-react"

interface NFTHoldingsProps {
  nftSymbol: string
  userHoldings: number
  nftPrice: string
  royaltyPercentage: number
  totalValue: string
  monthlyRoyalties: string
}

export function NFTHoldings({
  nftSymbol,
  userHoldings,
  nftPrice,
  royaltyPercentage,
  totalValue,
  monthlyRoyalties,
}: NFTHoldingsProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="text-primary" size={24} />
          Your NFT Holdings
        </CardTitle>
        <CardDescription>Manage your fractional NFT portfolio</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Holdings Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">NFTs Held</p>
            <p className="text-2xl font-bold text-primary">{userHoldings}</p>
            <p className="text-xs text-muted-foreground mt-1">{nftSymbol}</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Value</p>
            <p className="text-2xl font-bold text-accent">{totalValue}</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Price per NFT</p>
            <p className="text-xl font-bold">{nftPrice}</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Monthly Royalties</p>
            <p className="text-xl font-bold text-green-400">{monthlyRoyalties}</p>
          </div>
        </div>

        {/* Royalty Info */}
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 flex gap-3">
          <TrendingUp className="text-primary flex-shrink-0" size={20} />
          <div>
            <p className="text-sm font-medium text-foreground">Royalty Rate</p>
            <p className="text-xs text-muted-foreground">You earn {royaltyPercentage}% annually on your holdings</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button className="flex-1 bg-primary hover:bg-primary/90 gap-2">
            <Send size={18} />
            Sell NFTs
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent gap-2">
            <TrendingUp size={18} />
            View History
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
