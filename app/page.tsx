"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatsCard } from "@/components/cards/stats-card"
import { PropertyCard } from "@/components/cards/property-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { DollarSign, Home, TrendingUp, Coins, ArrowRight, Sparkles } from "lucide-react"
import { assets, portfolioGrowthData, royaltyIncomeData, dashboardStats } from "@/lib/mock-data"
import { MarketInsightsWidget } from "@/components/chat/market-insights-widget"
import { InvestmentRecommendations } from "@/components/chat/investment-recommendations"
import Link from "next/link"


const featuredAssets = assets.slice(0, 3)

export default function Dashboard() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Portfolio Value"
            value={dashboardStats.portfolioValue}
            icon={DollarSign}
            change="12.5%"
            changeType="positive"
          />
          <StatsCard
            label="Properties Owned"
            value={dashboardStats.propertiesOwned}
            icon={Home}
            change="2"
            changeType="positive"
          />
          <StatsCard
            label="Total ROI"
            value={dashboardStats.totalROI}
            icon={TrendingUp}
            change="2.3%"
            changeType="positive"
          />
          <StatsCard
            label="Royalty Earnings"
            value={dashboardStats.royaltyEarnings}
            icon={Coins}
            change="28%"
            changeType="positive"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Portfolio Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={portfolioGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis stroke="var(--muted-foreground)" />
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
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Royalty Income</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={royaltyIncomeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis stroke="var(--muted-foreground)" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAssets.map((asset) => (
              <Link key={asset.id} href={`/asset/${asset.id}`}>
                <PropertyCard
                  id={asset.id}
                  title={asset.title}
                  location={asset.location}
                  image={asset.image}
                  price={asset.price}
                  shares={asset.totalShares}
                  roi={asset.roi}
                  investors={asset.investors}
                  actionLabel="Invest Now"
                />
              </Link>
            ))}
          </div>
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
