// app/asset/[id]/page.tsx
'use client'

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { NFTCard } from "@/components/3d/nft-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Users, TrendingUp, Building2, Calendar, FileText, Loader2, ShoppingCart, ArrowLeft, CheckCircle2,BadgeDollarSign, Activity } from "lucide-react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { InvestmentDialog } from "@/components/property/investment-dialog"
import { useAccount } from "wagmi"
import Link from "next/link"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from "recharts"

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showInvestDialog, setShowInvestDialog] = useState(false)
  const [userInvestment, setUserInvestment] = useState<any>(null)
  const [tradingData, setTradingData] = useState<any[]>([])

  useEffect(() => {
    if (params.id) {
      fetchProperty()
    }
  }, [params.id])

  useEffect(() => {
    if (isConnected && address && property) {
      fetchUserInvestment()
    }
  }, [isConnected, address, property])

  // Generate real-time trading data
  useEffect(() => {
    if (!property) return

    // Initialize trading data from investments
    const generateInitialData = () => {
      const data: any[] = []
      const basePrice = property.pricePerShare
      let currentPrice = basePrice
      const now = new Date()
      
      // Generate last 30 data points (simulating last 30 hours)
      for (let i = 29; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000)
        // Simulate price fluctuations
        const change = (Math.random() - 0.5) * 0.1 * basePrice
        currentPrice = Math.max(basePrice * 0.8, Math.min(basePrice * 1.2, currentPrice + change))
        
        // Calculate volume based on available shares
        const volume = Math.floor(Math.random() * 100) + 10
        
        data.push({
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          timestamp: time.getTime(),
          price: Number(currentPrice.toFixed(2)),
          volume: volume,
          high: currentPrice * (1 + Math.random() * 0.05),
          low: currentPrice * (1 - Math.random() * 0.05),
        })
      }
      
      return data
    }

    setTradingData(generateInitialData())

    // Update trading data every 5 seconds (simulating real-time updates)
    const interval = setInterval(() => {
      setTradingData((prevData) => {
        const basePrice = property.pricePerShare
        const lastPrice = prevData[prevData.length - 1]?.price || basePrice
        const now = new Date()
        
        // Add new data point
        const change = (Math.random() - 0.5) * 0.1 * basePrice
        const newPrice = Math.max(basePrice * 0.8, Math.min(basePrice * 1.2, lastPrice + change))
        const volume = Math.floor(Math.random() * 100) + 10
        
        const newDataPoint = {
          time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          timestamp: now.getTime(),
          price: Number(newPrice.toFixed(2)),
          volume: volume,
          high: newPrice * (1 + Math.random() * 0.05),
          low: newPrice * (1 - Math.random() * 0.05),
        }
        
        // Keep only last 30 data points
        const updated = [...prevData.slice(1), newDataPoint]
        return updated
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [property])

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${params.id}`)
      if (!response.ok) throw new Error('Property not found')
      
      const data = await response.json()
      setProperty(data)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to load property')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserInvestment = async () => {
    try {
      const response = await fetch(`/api/investments/user?propertyId=${property.id}&walletAddress=${address}`)
      if (response.ok) {
        const data = await response.json()
        setUserInvestment(data)
      }
    } catch (error) {
      console.error('Error fetching user investment:', error)
    }
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

  if (!property) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2 text-foreground">Property Not Found</h2>
          <p className="text-muted-foreground mb-4">The property you're looking for doesn't exist</p>
          <Link href="/marketplace">
            <Button>Browse Marketplace</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const isOwner = address?.toLowerCase() === property.owner.walletAddress.toLowerCase()
  const fundedPercentage = ((property.totalShares - property.availableShares) / property.totalShares) * 100
  const totalInvestors = property.investments?.length || 0

  const getStatusBadge = (status: string) => {
    const styles = {
      'APPROVED': 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-400',
      'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400',
      'REJECTED': 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-400',
      'TOKENIZED': 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400',
      'FUNDED': 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/20 dark:text-purple-400',
    }
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800 border-gray-300'
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Link href="/marketplace">
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </Button>
        </Link>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold text-foreground">{property.title}</h1>
              <Badge variant="outline" className={getStatusBadge(property.status)}>
                {property.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin size={18} />
              <span>{property.location}</span>
            </div>
          </div>
          {property.status === 'APPROVED' && !isOwner && (
            <Button 
              size="lg" 
              onClick={() => setShowInvestDialog(true)}
              disabled={property.availableShares === 0}
              className="bg-primary hover:bg-primary/90"
            >
              <BadgeDollarSign className="w-4 h-4 mr-2" />
              Invest Now
            </Button>
          )}
        </div>

        {/* User Investment Banner */}
        {userInvestment && (
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-4 text-foreground">Your Investment</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Shares Owned</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">{userInvestment.shares}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Investment</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ${userInvestment.investmentAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">NFT Certificate</p>
                      <div className="mt-1">
                        {userInvestment.nftMinted ? (
                          <Badge className="bg-green-500 hover:bg-green-600">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Minted
                          </Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {userInvestment.nftMinted && (
                  <Button variant="outline" className="w-full md:w-auto">View NFT</Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Asset Image and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Asset Images */}
            <Card className="bg-card border-border overflow-hidden">
              <div className="grid grid-cols-2 gap-2 p-2">
                <div className="col-span-2 relative h-96 w-full bg-muted rounded-lg overflow-hidden">
                  {property.images && property.images.length > 0 ? (
                    <Image 
                      src={property.images[0]} 
                      alt={property.title} 
                      fill 
                      className="object-cover" 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-muted">
                      <Building2 className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
                {property.images?.slice(1, 5).map((img: string, i: number) => (
                  <div key={i} className="relative h-44 bg-muted rounded-lg overflow-hidden">
                    <Image 
                      src={img} 
                      alt={`${property.title} ${i + 2}`} 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* 3D NFT Card */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">NFT Ownership Certificate</CardTitle>
                <CardDescription>3D representation of your ownership NFT badge</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 rounded-lg overflow-hidden bg-muted">
                  <NFTCard />
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="bg-card border-border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="text-foreground">About This Property</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description || 'No description available'}
                </p>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card className="bg-card border-border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="text-foreground">Property Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Asset Value</p>
                    <p className="text-lg font-bold text-foreground">
                      ${property.assetValue.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Total Shares</p>
                    <p className="text-lg font-bold text-foreground">{property.totalShares}</p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Price/Share</p>
                    <p className="text-lg font-bold text-foreground">
                      ${property.pricePerShare.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Available Shares</p>
                    <p className="text-lg font-bold text-foreground">{property.availableShares}</p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Listed Date</p>
                    <p className="text-lg font-bold text-foreground">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <p className="text-lg font-bold text-foreground capitalize">
                      {property.status.toLowerCase()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card className="bg-card border-border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <FileText className="w-5 h-5" />
                  Legal Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {property.documents && property.documents.length > 0 ? (
                    property.documents.map((doc: any) => (
                      <div 
                        key={doc.id} 
                        className="flex items-center justify-between p-3 border border-border rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium text-sm text-foreground">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{doc.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.verified && (
                            <Badge className="bg-green-500 hover:bg-green-600 text-xs">
                              Verified
                            </Badge>
                          )}
                          <a href={doc.url} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline">View</Button>
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No documents available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Investment Panel */}
          <div className="space-y-6">
            {/* Key Metrics */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Investment Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Value</p>
                  <p className="text-3xl font-bold ">
                    ${property.assetValue.toLocaleString()}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-1">Expected Annual ROI</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-green-500 dark:text-green-400">8.5%</p>
                    <TrendingUp className="text-green-500 dark:text-green-400" size={20} />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-1">Total Investors</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-foreground">{totalInvestors}</p>
                    <Users size={20} className="text-muted-foreground" />
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Funding Progress</span>
                    <span className="text-sm font-medium text-foreground">{fundedPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all"
                      style={{ width: `${fundedPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {property.availableShares} of {property.totalShares} shares available
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Investment CTA */}
            {property.status === 'APPROVED' && !isOwner && (
              <Card className="bg-card border-border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="text-foreground">Start Investing</CardTitle>
                  <CardDescription>Purchase shares and get NFT ownership certificate</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Instant NFT Certificate
                    </p>
                    <p className="text-sm text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Fractional Ownership
                    </p>
                    <p className="text-sm text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Transparent Blockchain Records
                    </p>
                    <p className="text-sm text-green-800 dark:text-green-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Secure & Verified
                    </p>
                  </div>

                  <Button 
                    className="w-full bg-primary hover:bg-primary/90" 
                    size="lg"
                    onClick={() => setShowInvestDialog(true)}
                    disabled={property.availableShares === 0}
                  >
                    {property.availableShares === 0 ? 'Fully Funded' : 'Invest Now'}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Minimum investment: ${property.pricePerShare.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Owner Info */}
            <Card className="bg-card border-border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="text-foreground">Property Owner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Wallet Address</p>
                    <p className="font-mono text-xs break-all bg-secondary/50 p-2 rounded border border-border">
                      {property.owner.walletAddress}
                    </p>
                  </div>
                  {isOwner && (
                    <Badge className="bg-primary w-full justify-center py-2">
                      You own this property
                    </Badge>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Listed Date</p>
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(property.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Blockchain Info */}
            {property.tokenAddress && (
              <Card className="bg-card border-border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="text-foreground">Blockchain Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Token Contract</p>
                    <p className="font-mono text-xs break-all bg-secondary/50 p-2 rounded border border-border">
                      {property.tokenAddress}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Network</p>
                    <p className="text-sm font-medium text-foreground">
                      {property.chainId === 1 ? 'Ethereum' : 
                       property.chainId === 137 ? 'Polygon' : 
                       property.chainId === 42161 ? 'Arbitrum' : 'Unknown'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="investors" className="w-full">
          <TabsList className="bg-secondary/50 border-border">
            <TabsTrigger value="investors">Investors ({totalInvestors})</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
            <TabsTrigger value="charts">
              <Activity className="w-4 h-4 mr-2" />
              Trading Charts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="investors" className="space-y-4 mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Current Investors</CardTitle>
              </CardHeader>
              <CardContent>
                {property.investments && property.investments.length > 0 ? (
                  <div className="space-y-3">
                    {property.investments.map((investment: any) => (
                      <div 
                        key={investment.id} 
                        className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg border border-border hover:bg-secondary/70 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-foreground">
                            {investment.user.walletAddress === address ? 'You' : 'Investor'}
                          </p>
                          <p className="text-sm text-muted-foreground font-mono">
                            {investment.user.walletAddress.slice(0, 6)}...{investment.user.walletAddress.slice(-4)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">{investment.shares} Shares</p>
                          <p className="text-sm text-muted-foreground">
                            ${investment.investmentAmount.toLocaleString()}
                          </p>
                          {investment.nftMinted && (
                            <Badge className="bg-green-500 hover:bg-green-600 text-xs mt-1">
                              NFT Minted
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No investors yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4 mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {property.investments && property.investments.length > 0 ? (
                  <div className="space-y-3">
                    {property.investments.map((investment: any) => (
                      <div 
                        key={investment.id} 
                        className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg border border-border hover:bg-secondary/70 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-foreground">Investment</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(investment.createdAt).toLocaleDateString()} at{' '}
                            {new Date(investment.createdAt).toLocaleTimeString()}
                          </p>
                          {investment.transactionHash && (
                            <p className="text-xs text-muted-foreground font-mono mt-1">
                              TX: {investment.transactionHash.slice(0, 10)}...
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">{investment.shares} Shares</p>
                          <p className="text-sm text-green-500 dark:text-green-400">
                            ${investment.investmentAmount.toLocaleString()}
                          </p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {investment.paymentStatus}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No transactions yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4 mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Activity Log</CardTitle>
              </CardHeader>
              <CardContent>
                {property.activityLogs && property.activityLogs.length > 0 ? (
                  <div className="space-y-3">
                    {property.activityLogs.map((log: any) => (
                      <div 
                        key={log.id} 
                        className="flex gap-3 p-3 bg-secondary/50 rounded-lg border border-border hover:bg-secondary/70 transition-colors"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{log.action}</p>
                          <p className="text-sm text-muted-foreground">{log.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(log.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No activity logs yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="charts" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Price Chart */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-foreground">Real-Time Price Chart</CardTitle>
                      <CardDescription>
                        Live trading price per share - Updates every 5 seconds
                      </CardDescription>
                    </div>
                    {tradingData.length > 0 && (
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Current Price</p>
                        <p className="text-2xl font-bold text-green-500 dark:text-green-400">
                          ${tradingData[tradingData.length - 1]?.price.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Base: ${property.pricePerShare.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {tradingData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={tradingData}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="time" 
                          stroke="hsl(var(--muted-foreground))"
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))"
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                          domain={['auto', 'auto']}
                          label={{ value: 'Price ($)', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                          formatter={(value: any) => [`$${value.toFixed(2)}`, 'Price']}
                        />
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke="hsl(var(--primary))"
                          fillOpacity={1}
                          fill="url(#colorPrice)"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="high"
                          stroke="#22c55e"
                          strokeWidth={1}
                          strokeDasharray="5 5"
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="low"
                          stroke="#ef4444"
                          strokeWidth={1}
                          strokeDasharray="5 5"
                          dot={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[400px]">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Volume Chart */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Trading Volume</CardTitle>
                  <CardDescription>Share trading volume over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {tradingData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={tradingData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="time" 
                          stroke="hsl(var(--muted-foreground))"
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))"
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                          label={{ value: 'Volume', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                          formatter={(value: any) => [value, 'Volume']}
                        />
                        <Bar 
                          dataKey="volume" 
                          fill="hsl(var(--primary))"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[300px]">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Combined Chart */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Price & Volume Overview</CardTitle>
                  <CardDescription>Combined view of price movement and trading volume</CardDescription>
                </CardHeader>
                <CardContent>
                  {tradingData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                      <ComposedChart data={tradingData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="time" 
                          stroke="hsl(var(--muted-foreground))"
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <YAxis 
                          yAxisId="left"
                          stroke="hsl(var(--muted-foreground))"
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                          label={{ value: 'Price ($)', angle: -90, position: 'insideLeft' }}
                        />
                        <YAxis 
                          yAxisId="right"
                          orientation="right"
                          stroke="hsl(var(--muted-foreground))"
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                          label={{ value: 'Volume', angle: 90, position: 'insideRight' }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Area
                          yAxisId="left"
                          type="monotone"
                          dataKey="price"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.3}
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                        />
                        <Bar 
                          yAxisId="right"
                          dataKey="volume" 
                          fill="hsl(var(--muted-foreground))"
                          fillOpacity={0.5}
                          radius={[4, 4, 0, 0]}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[400px]">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Trading Stats */}
              {tradingData.length > 0 && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Trading Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                        <p className="text-sm text-muted-foreground mb-1">24h High</p>
                        <p className="text-lg font-bold text-foreground">
                          ${Math.max(...tradingData.map(d => d.high)).toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                        <p className="text-sm text-muted-foreground mb-1">24h Low</p>
                        <p className="text-lg font-bold text-foreground">
                          ${Math.min(...tradingData.map(d => d.low)).toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                        <p className="text-sm text-muted-foreground mb-1">24h Volume</p>
                        <p className="text-lg font-bold text-foreground">
                          {tradingData.reduce((sum, d) => sum + d.volume, 0)}
                        </p>
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                        <p className="text-sm text-muted-foreground mb-1">Price Change</p>
                        <p className={`text-lg font-bold ${
                          tradingData[tradingData.length - 1]?.price >= property.pricePerShare
                            ? 'text-green-500 dark:text-green-400'
                            : 'text-red-500 dark:text-red-400'
                        }`}>
                          {tradingData.length > 1 
                            ? ((tradingData[tradingData.length - 1]?.price - tradingData[0]?.price) / tradingData[0]?.price * 100).toFixed(2)
                            : '0.00'
                          }%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Investment Dialog */}
      <InvestmentDialog
        property={property}
        open={showInvestDialog}
        onOpenChange={setShowInvestDialog}
        onSuccess={fetchProperty}
      />
    </DashboardLayout>
  )
}
