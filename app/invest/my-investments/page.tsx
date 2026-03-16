"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Loader2, ExternalLink } from "lucide-react"
import { useAccount } from "wagmi"
import { useEffect, useState } from "react"
import Link from "next/link"

interface Investment {
  id: string
  shares: number
  investmentAmount: number
  paymentStatus: string
  property: {
    id: string
    title: string
    location: string
    assetValue: number
    totalShares: number
    images: string[]
  }
  createdAt: string
}

export default function InvestMyInvestments() {
  const { address, isConnected } = useAccount()
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalInvested: 0,
    currentValue: 0,
    averageROI: 0,
    totalGain: 0,
  })

  useEffect(() => {
    if (isConnected && address) {
      fetchInvestments()
    } else {
      setInvestments([])
      setLoading(false)
    }
  }, [isConnected, address])

  const fetchInvestments = async () => {
    if (!address) return
    try {
      setLoading(true)
      const response = await fetch(`/api/investments/user?walletAddress=${encodeURIComponent(address)}`)
      if (!response.ok) throw new Error("Failed to fetch investments")
      const data = await response.json()
      const investmentsList = Array.isArray(data) ? data : data ? [data] : []
      setInvestments(investmentsList)
      const completed = investmentsList.filter(
        (inv: Investment) => inv && inv.paymentStatus === "COMPLETED" && inv.investmentAmount
      )
      if (completed.length === 0) {
        setStats({ totalInvested: 0, currentValue: 0, averageROI: 0, totalGain: 0 })
        return
      }
      const totalInvested = completed.reduce(
        (sum: number, inv: Investment) => sum + (typeof inv.investmentAmount === "number" ? inv.investmentAmount : parseFloat(inv.investmentAmount) || 0),
        0
      )
      const currentValue = completed.reduce((sum: number, inv: Investment) => {
        if (!inv.property) return sum + (inv.investmentAmount || 0)
        const assetValue = typeof inv.property.assetValue === "number" ? inv.property.assetValue : parseFloat(inv.property.assetValue) || 0
        const totalShares = typeof inv.property.totalShares === "number" ? inv.property.totalShares : parseInt(inv.property.totalShares) || 1
        const userShares = typeof inv.shares === "number" ? inv.shares : parseInt(inv.shares) || 0
        if (assetValue > 0 && totalShares > 0 && userShares > 0) {
          return sum + (assetValue / totalShares) * userShares
        }
        return sum + (inv.investmentAmount || 0)
      }, 0)
      const totalGain = currentValue - totalInvested
      const averageROI = totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested) * 100 : 0
      setStats({ totalInvested, currentValue, averageROI, totalGain })
    } catch {
      setInvestments([])
      setStats({ totalInvested: 0, currentValue: 0, averageROI: 0, totalGain: 0 })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
      case "PENDING":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500">Pending</Badge>
      case "PROCESSING":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500">Processing</Badge>
      case "FAILED":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)

  const calculateROI = (investment: Investment) => {
    if (!investment.property || !investment.property.assetValue || !investment.property.totalShares || investment.property.totalShares === 0)
      return 0
    const currentValue = (investment.property.assetValue / investment.property.totalShares) * investment.shares
    return investment.investmentAmount > 0 ? ((currentValue - investment.investmentAmount) / investment.investmentAmount) * 100 : 0
  }

  const getCurrentValue = (investment: Investment) => {
    if (!investment.property || !investment.property.assetValue || !investment.property.totalShares || investment.property.totalShares === 0)
      return investment.investmentAmount
    return (investment.property.assetValue / investment.property.totalShares) * investment.shares
  }

  if (!isConnected) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Connect Your Wallet</h2>
          <p className="text-muted-foreground">Please connect your wallet to view your investments</p>
        </div>
      </DashboardLayout>
    )
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Investments</h1>
            <p className="text-muted-foreground">Track your investment portfolio and performance.</p>
          </div>
          <Button variant="outline" onClick={fetchInvestments} disabled={loading} className="gap-2">
            <Loader2 className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Invested</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalInvested)}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {investments.filter((i) => i.paymentStatus === "COMPLETED").length} completed
                {investments.filter((i) => i.paymentStatus !== "COMPLETED").length > 0 && (
                  <span className="text-yellow-600 ml-1">
                    • {investments.filter((i) => i.paymentStatus !== "COMPLETED").length} pending
                  </span>
                )}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Current Value</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.currentValue)}</p>
              <p className={`text-xs mt-2 flex items-center gap-1 ${stats.totalGain >= 0 ? "text-green-400" : "text-red-400"}`}>
                <TrendingUp size={14} />
                {stats.totalGain >= 0 ? "+" : ""}
                {formatCurrency(stats.totalGain)} gain
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Average ROI</p>
              <p className={`text-2xl font-bold ${stats.averageROI >= 0 ? "text-green-400" : "text-red-400"}`}>
                {stats.averageROI >= 0 ? "+" : ""}
                {stats.averageROI.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground mt-2">Across all investments</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Properties</p>
              <p className="text-2xl font-bold text-foreground">
                {new Set(investments.map((i) => i.property?.id)).size}
              </p>
              <p className="text-xs text-muted-foreground mt-2">Unique properties</p>
            </CardContent>
          </Card>
        </div>
        {investments.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">You haven&apos;t made any investments yet</p>
              <Link href="/invest/marketplace">
                <Button>Browse Marketplace</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Investment Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-foreground">Property</TableHead>
                      <TableHead className="text-foreground">Shares</TableHead>
                      <TableHead className="text-foreground">Invested</TableHead>
                      <TableHead className="text-foreground">Current Value</TableHead>
                      <TableHead className="text-foreground">ROI</TableHead>
                      <TableHead className="text-foreground">Status</TableHead>
                      <TableHead className="text-foreground">Date</TableHead>
                      <TableHead className="text-foreground">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {investments.map((investment) => {
                      const roi = calculateROI(investment)
                      const currentValue = getCurrentValue(investment)
                      return (
                        <TableRow key={investment.id} className="border-border">
                          <TableCell className="text-foreground">
                            <div>
                              <p className="font-medium">{investment.property?.title}</p>
                              <p className="text-sm text-muted-foreground">{investment.property?.location}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-foreground">{investment.shares}</TableCell>
                          <TableCell className="text-foreground">{formatCurrency(investment.investmentAmount)}</TableCell>
                          <TableCell className="text-foreground">{formatCurrency(currentValue)}</TableCell>
                          <TableCell className={roi >= 0 ? "text-green-400" : "text-red-400"}>
                            {roi >= 0 ? "+" : ""}
                            {roi.toFixed(1)}%
                          </TableCell>
                          <TableCell>{getStatusBadge(investment.paymentStatus)}</TableCell>
                          <TableCell className="text-foreground">
                            {new Date(investment.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Link href={`/asset/${investment.property?.id}`}>
                              <Button variant="ghost" size="sm" className="gap-2">
                                View <ExternalLink className="w-3 h-3" />
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
