// app/properties/[id]/page.tsx
'use client'

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2, MapPin, DollarSign, Share2, FileText, Calendar } from "lucide-react"
import Image from "next/image"
import { useAccount } from "wagmi"

export default function PropertyDetails() {
  const params = useParams()
  const { address } = useAccount()
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchProperty()
    }
  }, [params.id])

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${params.id}`)
      const data = await response.json()
      setProperty(data)
    } catch (error) {
      console.error('Error fetching property:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  if (!property) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
        </div>
      </DashboardLayout>
    )
  }

  const isOwner = address?.toLowerCase() === property.owner.walletAddress.toLowerCase()
  const fundedPercentage = ((property.totalShares - property.availableShares) / property.totalShares) * 100

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Image Gallery */}
        <div className="grid md:grid-cols-2 gap-4">
          {property.images.length > 0 ? (
            <>
              <div className="relative h-96 rounded-lg overflow-hidden">
                <Image
                  src={property.images[0]}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {property.images.slice(1, 5).map((img: string, i: number) => (
                  <div key={i} className="relative h-44 rounded-lg overflow-hidden">
                    <Image
                      src={img}
                      alt={`${property.title} ${i + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="col-span-2 h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No Images</span>
            </div>
          )}
        </div>

        {/* Property Info */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">{property.title}</CardTitle>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{property.location}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    property.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                    property.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {property.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{property.description || 'No description provided'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Asset Value</p>
                      <p className="text-xl font-bold">${property.assetValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Price per Share</p>
                      <p className="text-xl font-bold">${property.pricePerShare.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Shares</p>
                      <p className="text-xl font-bold">{property.totalShares}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Available Shares</p>
                      <p className="text-xl font-bold">{property.availableShares}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Funding Progress</span>
                      <span className="text-sm font-medium">{fundedPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${fundedPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {property.documents.map((doc: any) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.verified && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Verified
                          </span>
                        )}
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="ghost">View</Button>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Investment Card */}
            {!isOwner && property.status === 'APPROVED' && (
              <Card>
                <CardHeader>
                  <CardTitle>Invest in this Property</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Number of Shares</label>
                    <input
                      type="number"
                      min="1"
                      max={property.availableShares}
                      placeholder="Enter shares"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <Button className="w-full">Invest Now</Button>
                </CardContent>
              </Card>
            )}

            {/* Owner Info */}
            <Card>
              <CardHeader>
                <CardTitle>Property Owner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Wallet Address</p>
                  <p className="font-mono text-xs break-all">{property.owner.walletAddress}</p>
                  {isOwner && (
                    <p className="text-sm text-green-600 font-medium mt-2">You own this property</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Investors</span>
                  <span className="font-medium">{property.investments.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Listed Date</span>
                  <span className="font-medium">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {property.tokenAddress && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Token Address</span>
                    <span className="font-mono text-xs">{property.tokenAddress.slice(0, 6)}...</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}