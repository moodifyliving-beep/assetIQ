"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatsCard } from "@/components/cards/stats-card"
import { PropertyCard } from "@/components/cards/property-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { DollarSign, Home, TrendingUp, Coins, ArrowRight, Sparkles } from "lucide-react"
import { MarketInsightsWidget } from "@/components/chat/market-insights-widget"
import { InvestmentRecommendations } from "@/components/chat/investment-recommendations"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { useAccount } from "wagmi"

export default function Dashboard() {
  const { address, isConnected } = useAccount()
  const [featuredAssets, setFeaturedAssets] = useState<any[]>([])
  const [loadingAssets, setLoadingAssets] = useState(true)
  const [dashboardStats, setDashboardStats] = useState({
    portfolioValue: '$0',
    propertiesOwned: '0',
    totalROI: '0%',
    royaltyEarnings: '$0'
  })
  const [portfolioGrowthData, setPortfolioGrowthData] = useState<{ month: string; value: number }[]>([])
  const [royaltyIncomeData, setRoyaltyIncomeData] = useState<{ month: string; amount: number }[]>([])
  const [loadingStats, setLoadingStats] = useState(true)

  const fetchApprovedProperties = async () => {
    try {
      const response = await fetch('/api/properties?status=APPROVED')
      if (!response.ok) throw new Error('Failed to fetch properties')
      
      const properties = await response.json()
      // Transform properties to match PropertyCard format and take first 3
      const transformed = properties
        .slice(0, 3)
        .map((property: any) => ({
          id: property.id,
          title: property.title,
          location: property.location,
          image: property.images?.[0] || '/placeholder.svg',
          price: `$${property.assetValue.toLocaleString()}`,
          shares: property.availableShares || property.totalShares,
          investors: property._count?.investments || 0,
        }))
      
      setFeaturedAssets(transformed)
    } catch (error) {
      console.error('Error fetching approved properties:', error)
    } finally {
      setLoadingAssets(false)
    }
  }

  const fetchDashboardStats = async () => {
    if (!isConnected || !address) {
      setLoadingStats(false)
      return
    }

    try {
      console.log('[Dashboard] Fetching stats for wallet:', address)
      const [statsRes, growthRes, royaltiesRes] = await Promise.all([
        fetch(`/api/portfolio/stats?walletAddress=${address}`),
        fetch(`/api/portfolio/growth?walletAddress=${address}`),
        fetch(`/api/portfolio/royalties?walletAddress=${address}`)
      ])

      if (statsRes.ok) {
        const stats = await statsRes.json()
        console.log('[Dashboard] Stats response:', stats)
        setDashboardStats({
          portfolioValue: stats.portfolioValue || '$0',
          propertiesOwned: stats.propertiesOwned || '0',
          totalROI: stats.totalROI || '0%',
          royaltyEarnings: stats.royaltyEarnings || '$0'
        })
      } else {
        const errorData = await statsRes.json().catch(() => ({}))
        console.error('[Dashboard] Stats API error:', statsRes.status, errorData)
      }

      if (growthRes.ok) {
        const growth = await growthRes.json()
        console.log('[Dashboard] Growth data:', growth)
        setPortfolioGrowthData(growth || [])
      } else {
        console.error('[Dashboard] Growth API error:', growthRes.status)
      }

      if (royaltiesRes.ok) {
        const royalties = await royaltiesRes.json()
        console.log('[Dashboard] Royalties data:', royalties)
        setRoyaltyIncomeData(royalties || [])
      } else {
        console.error('[Dashboard] Royalties API error:', royaltiesRes.status)
      }
    } catch (error) {
      console.error('[Dashboard] Error fetching dashboard stats:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  useEffect(() => {
    fetchApprovedProperties()
    fetchDashboardStats()
    // Refetch every 30 seconds to get newly approved properties and updated stats
    const interval = setInterval(() => {
      fetchApprovedProperties()
      fetchDashboardStats()
    }, 30000)
    
    // Refresh stats when page becomes visible (user returns to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isConnected && address) {
        fetchDashboardStats()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address])
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your portfolio overview.</p>
          </div>
          <Link href="/chat">
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI Assistant</span>
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        {loadingStats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center h-24">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Portfolio Value"
            value={dashboardStats.portfolioValue}
            icon={DollarSign}
              change={dashboardStats.totalROI}
              changeType={parseFloat(dashboardStats.totalROI) >= 0 ? "positive" : "negative"}
          />
          <StatsCard
            label="Properties Owned"
            value={dashboardStats.propertiesOwned}
            icon={Home}
              change=""
            changeType="positive"
          />
          <StatsCard
            label="Total ROI"
            value={dashboardStats.totalROI}
            icon={TrendingUp}
              change=""
              changeType={parseFloat(dashboardStats.totalROI) >= 0 ? "positive" : "negative"}
          />
          <StatsCard
            label="Royalty Earnings"
            value={dashboardStats.royaltyEarnings}
            icon={Coins}
              change=""
            changeType="positive"
          />
        </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Portfolio Growth</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <div className="flex items-center justify-center h-[300px]">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : portfolioGrowthData.length === 0 ? (
                <div className="flex items-center justify-center h-[300px]">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={portfolioGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={{ fill: "var(--primary)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Royalty Income</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <div className="flex items-center justify-center h-[300px]">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : royaltyIncomeData.length === 0 ? (
                <div className="flex items-center justify-center h-[300px]">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={royaltyIncomeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                    }}
                  />
                  <Bar dataKey="amount" fill="var(--accent)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MarketInsightsWidget />
          <InvestmentRecommendations />
        </div>

        {/* Featured Assets */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Featured Assets</h2>
            <Link href="/marketplace">
              <Button variant="ghost" className="gap-2 text-primary hover:text-primary/80">
                View All <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
          {loadingAssets ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : featuredAssets.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No approved properties available yet</p>
              </CardContent>
            </Card>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAssets.map((asset) => (
              <Link key={asset.id} href={`/asset/${asset.id}`}>
                <PropertyCard
                  id={asset.id}
                  title={asset.title}
                  location={asset.location}
                  image={asset.image}
                  price={asset.price}
                    shares={asset.shares}
                  investors={asset.investors}
                  actionLabel="Invest Now"
                />
              </Link>
            ))}
          </div>
          )}
        </div>

        {/* Quick Actions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/marketplace">
                <Button className="bg-primary hover:bg-primary/90 h-12 w-full">Browse Marketplace</Button>
              </Link>
              <Button variant="outline" className="h-12 bg-transparent">
                List New Asset
              </Button>
              <Button variant="outline" className="h-12 bg-transparent">
                Claim Royalties
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
