"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { NFTCard } from "@/components/3d/nft-card"
import { NFTMintingPanel } from "@/components/fractional-nft/nft-minting-panel"
import { NFTHoldings } from "@/components/fractional-nft/nft-holdings"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { assets } from "@/lib/mock-data"
import { MapPin, Users, TrendingUp } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"

interface AssetPageProps {
  params: Promise<{ id: string }>
}

export default function AssetPage() {
  const params = useParams()
  const id = params.id as string
  const asset = assets.find((a) => a.id === id)

  if (!asset) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Asset not found</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">{asset.title}</h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
              {asset.category}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin size={18} />
            {asset.location}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Asset Image and 3D NFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* Asset Image */}
            <Card className="bg-card border-border overflow-hidden">
              <div className="relative h-96 w-full bg-muted">
                <Image src={asset.image || "/placeholder.svg"} alt={asset.title} fill className="object-cover" />
              </div>
            </Card>

            {/* 3D NFT Card */}
            <Card className="bg-card border-border overflow-hidden">
              <CardHeader>
                <CardTitle>Fractional NFT Representation</CardTitle>
                <CardDescription>Interactive 3D visualization of your asset NFT</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 rounded-lg overflow-hidden">
                  <NFTCard />
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>About This Asset</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{asset.description}</p>
              </CardContent>
            </Card>

            {/* Asset Details */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Asset Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(asset.details).map(([key, value]) => (
                    <div key={key} className="bg-secondary/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground capitalize mb-1">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      <p className="text-lg font-bold text-foreground">{value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - NFT Minting and Holdings */}
          <div className="space-y-6">
            {/* Key Metrics */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Asset Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Value</p>
                  <p className="text-2xl font-bold text-primary">{asset.price}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Annual ROI</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-green-400">{asset.roi}</p>
                    <TrendingUp className="text-green-400" size={20} />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Investors</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{asset.investors}</p>
                    <Users size={20} className="text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* NFT Minting Panel */}
            <NFTMintingPanel
              nftSymbol={asset.nftData.nftSymbol}
              nftPrice={asset.nftData.nftPrice}
              royaltyPercentage={asset.nftData.royaltyPercentage}
              floorPrice={asset.nftData.floorPrice}
              totalNFTs={asset.nftData.totalNFTs}
              holders={asset.nftData.holders}
            />

            {/* NFT Holdings */}
            <NFTHoldings
              nftSymbol={asset.nftData.nftSymbol}
              userHoldings={Math.floor(Math.random() * 100) + 10}
              nftPrice={asset.nftData.nftPrice}
              royaltyPercentage={asset.nftData.royaltyPercentage}
              totalValue={`$${(Math.floor(Math.random() * 50) + 10) * 1000}`}
              monthlyRoyalties={`$${Math.floor(Math.random() * 500) + 100}`}
            />
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-secondary/50 border-border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="nft-holders">NFT Holders</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Market Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Floor Price</p>
                    <p className="text-xl font-bold">{asset.nftData.floorPrice}</p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">24h Volume</p>
                    <p className="text-xl font-bold">$125,400</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nft-holders" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Top NFT Holders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Holder #{i}</p>
                        <p className="text-sm text-muted-foreground">0x{Math.random().toString(16).slice(2, 10)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">{Math.floor(Math.random() * 500) + 50} NFTs</p>
                        <p className="text-sm text-muted-foreground">{(Math.random() * 50 + 1).toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{i % 2 === 0 ? "Mint" : "Transfer"}</p>
                        <p className="text-sm text-muted-foreground">{Math.floor(Math.random() * 24)} hours ago</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">{Math.floor(Math.random() * 100) + 10} NFTs</p>
                        <p className="text-sm text-green-400">${(Math.random() * 50000 + 10000).toFixed(0)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
