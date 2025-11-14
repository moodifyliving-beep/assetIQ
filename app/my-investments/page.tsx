"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Loader2, ExternalLink } from "lucide-react"
import { useAccount } from "wagmi"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Investment {
  id: string
  shares: number
  investmentAmount: number
  paymentStatus: string
  paymentMethod: string
  transactionHash?: string
  createdAt: string
  property: {
    id: string
    title: string
    location: string
    assetValue: number
    totalShares: number
    pricePerShare: number
    images: string[]
    status: string
  }
}

export default function MyInvestments() {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalInvested: 0,
    currentValue: 0,
    averageROI: 0,
    totalGain: 0
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
      // Fetch all investments (not just completed) to show pending ones too
      const response = await fetch(`/api/investments/user?walletAddress=${encodeURIComponent(address)}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch investments')
      }
      
      const data = await response.json()
      const investmentsList = Array.isArray(data) ? data : (data ? [data] : [])
      
      setInvestments(investmentsList)
      
      // Calculate stats only for completed investments
      const completedInvestments = investmentsList.filter((inv: Investment) => {
        // Ensure we have valid investment data
        return inv && inv.paymentStatus === 'COMPLETED' && inv.investmentAmount
      })
      calculateStats(completedInvestments)
    } catch (error) {
      console.error('Error fetching investments:', error)
      setInvestments([])
      // Reset stats on error
      setStats({
        totalInvested: 0,
        currentValue: 0,
        averageROI: 0,
        totalGain: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (investmentsList: Investment[]) => {
    if (!investmentsList || investmentsList.length === 0) {
      setStats({
        totalInvested: 0,
        currentValue: 0,
        averageROI: 0,
        totalGain: 0
      })
      return
    }
    
    const totalInvested = investmentsList.reduce((sum, inv) => {
      // Ensure investmentAmount is a valid number
      const amount = typeof inv.investmentAmount === 'number' ? inv.investmentAmount : parseFloat(inv.investmentAmount) || 0
      return sum + amount
    }, 0)
    
    // Calculate current value based on property value and share ownership
    const currentValue = investmentsList.reduce((sum, inv) => {
      // Check if property data exists
      if (!inv.property) {
        // If no property data, use investment amount as fallback
        return sum + (inv.investmentAmount || 0)
      }
      
      // Ensure we have valid property values
      const assetValue = typeof inv.property.assetValue === 'number' 
        ? inv.property.assetValue 
        : parseFloat(inv.property.assetValue) || 0
      const totalShares = typeof inv.property.totalShares === 'number'
        ? inv.property.totalShares
        : parseInt(inv.property.totalShares) || 1
      const userShares = typeof inv.shares === 'number' ? inv.shares : parseInt(inv.shares) || 0
      
      if (assetValue > 0 && totalShares > 0 && userShares > 0) {
        const shareValue = (assetValue / totalShares) * userShares
        return sum + shareValue
      }
      
      // Fallback to investment amount if calculation fails
      return sum + (inv.investmentAmount || 0)
    }, 0)

    const totalGain = currentValue - totalInvested
    const averageROI = totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested) * 100 : 0

    setStats({
      totalInvested,
      currentValue,
      averageROI,
      totalGain
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500">Pending</Badge>
      case 'PROCESSING':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500">Processing</Badge>
      case 'FAILED':
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const calculateROI = (investment: Investment) => {
    if (!investment.property || !investment.property.assetValue || !investment.property.totalShares || investment.property.totalShares === 0) {
      return 0
    }
    const propertyValue = investment.property.assetValue
    const totalShares = investment.property.totalShares
    const userShares = investment.shares
    const currentValue = (propertyValue / totalShares) * userShares
    const roi = investment.investmentAmount > 0 
      ? ((currentValue - investment.investmentAmount) / investment.investmentAmount) * 100 
      : 0
    return roi
  }

  const getCurrentValue = (investment: Investment) => {
    if (!investment.property || !investment.property.assetValue || !investment.property.totalShares || investment.property.totalShares === 0) {
      return investment.investmentAmount
    }
    const propertyValue = investment.property.assetValue
    const totalShares = investment.property.totalShares
    const userShares = investment.shares
    return (propertyValue / totalShares) * userShares
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
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Investments</h1>
            <p className="text-muted-foreground">Track your investment portfolio and performance.</p>
          </div>
          <Button 
            variant="outline" 
            onClick={fetchInvestments}
            disabled={loading}
            className="gap-2"
          >
            <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Invested</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalInvested)}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {investments.filter(inv => inv.paymentStatus === 'COMPLETED').length} completed
                {investments.filter(inv => inv.paymentStatus !== 'COMPLETED').length > 0 && (
                  <span className="text-yellow-600 ml-1">
                    • {investments.filter(inv => inv.paymentStatus !== 'COMPLETED').length} pending
                  </span>
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Current Value</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.currentValue)}</p>
              <p className={`text-xs mt-2 flex items-center gap-1 ${stats.totalGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                <TrendingUp size={14} />
                {stats.totalGain >= 0 ? '+' : ''}{formatCurrency(stats.totalGain)} gain
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Average ROI</p>
              <p className={`text-2xl font-bold ${stats.averageROI >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stats.averageROI >= 0 ? '+' : ''}{stats.averageROI.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground mt-2">Across all investments</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Properties</p>
              <p className="text-2xl font-bold text-foreground">{new Set(investments.map(inv => inv.property.id)).size}</p>
              <p className="text-xs text-muted-foreground mt-2">Unique properties</p>
            </CardContent>
          </Card>
        </div>

        {/* Investments Table */}
        {investments.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">You haven't made any investments yet</p>
              <Link href="/marketplace">
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
                              <p className="font-medium">{investment.property.title}</p>
                              <p className="text-sm text-muted-foreground">{investment.property.location}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-foreground">{investment.shares}</TableCell>
                          <TableCell className="text-foreground">{formatCurrency(investment.investmentAmount)}</TableCell>
                          <TableCell className="text-foreground">{formatCurrency(currentValue)}</TableCell>
                          <TableCell className={roi >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {roi >= 0 ? '+' : ''}{roi.toFixed(1)}%
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(investment.paymentStatus)}
                          </TableCell>
                          <TableCell className="text-foreground">
                            {new Date(investment.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Link href={`/asset/${investment.property.id}`}>
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
