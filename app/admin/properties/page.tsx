// app/admin/properties/page.tsx
'use client'

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAccount } from "wagmi"
import { useEffect, useState } from "react"
import { Loader2, CheckCircle, XCircle, Eye, FileText } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminProperties() {
  const { address } = useAccount()
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [processing, setProcessing] = useState(false)
  const [filter, setFilter] = useState('PENDING')
  const [statusCounts, setStatusCounts] = useState({
    PENDING: 0,
    UNDER_REVIEW: 0,
    APPROVED: 0,
    REJECTED: 0
  })

  useEffect(() => {
    fetchProperties()
    fetchStatusCounts()
  }, [filter, address])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/properties?status=${filter}`, {
        headers: {
          'x-wallet-address': address || ''
        }
      })

      if (!response.ok) throw new Error('Failed to fetch properties')

      const data = await response.json()
      // Handle both array and object responses
      if (Array.isArray(data)) {
      setProperties(data)
      } else if (data.properties && Array.isArray(data.properties)) {
        setProperties(data.properties)
      } else {
        setProperties([])
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to load properties')
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  const fetchStatusCounts = async () => {
    try {
      const statuses = ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED']
      const counts: any = {}
      
      await Promise.all(
        statuses.map(async (status) => {
          const response = await fetch(`/api/admin/properties?status=${status}&limit=1`, {
            headers: {
              'x-wallet-address': address || ''
            }
          })
          if (response.ok) {
            const data = await response.json()
            counts[status] = data.pagination?.total || (Array.isArray(data) ? data.length : (data.properties?.length || 0))
          } else {
            counts[status] = 0
          }
        })
      )
      
      setStatusCounts(counts)
    } catch (error) {
      console.error('Error fetching status counts:', error)
    }
  }

  const handleApprove = async (propertyId: string) => {
    setProcessing(true)
    try {
      const response = await fetch(`/api/admin/properties/${propertyId}/approve`, {
        method: 'POST',
        headers: {
          'x-wallet-address': address || ''
        }
      })

      if (!response.ok) throw new Error('Failed to approve property')

      toast.success('Property approved successfully')
      fetchProperties()
      fetchStatusCounts()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to approve property')
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }

    setProcessing(true)
    try {
      const response = await fetch(`/api/admin/properties/${selectedProperty.id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': address || ''
        },
        body: JSON.stringify({ reason: rejectionReason })
      })

      if (!response.ok) throw new Error('Failed to reject property')

      toast.success('Property rejected')
      setShowRejectDialog(false)
      setRejectionReason('')
      setSelectedProperty(null)
      fetchProperties()
      fetchStatusCounts()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to reject property')
    } finally {
      setProcessing(false)
    }
  }

  const handleMarkUnderReview = async (propertyId: string) => {
    setProcessing(true)
    try {
      const response = await fetch(`/api/admin/properties/${propertyId}/review`, {
        method: 'POST',
        headers: {
          'x-wallet-address': address || ''
        }
      })

      if (!response.ok) throw new Error('Failed to update status')

      toast.success('Property marked as under review')
      fetchProperties()
      fetchStatusCounts()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to update property')
    } finally {
      setProcessing(false)
    }
  }

  const handleVerifyDocument = async (documentId: string) => {
    try {
      const response = await fetch(`/api/admin/documents/${documentId}/verify`, {
        method: 'POST',
        headers: {
          'x-wallet-address': address || ''
        }
      })

      if (!response.ok) throw new Error('Failed to verify document')

      toast.success('Document verified')
      fetchProperties()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to verify document')
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Property Review</h1>
          <p className="text-muted-foreground">
            Review and manage property listings
          </p>
        </div>

        {/* Filters */}
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="PENDING">Pending ({statusCounts.PENDING})</TabsTrigger>
            <TabsTrigger value="UNDER_REVIEW">Under Review ({statusCounts.UNDER_REVIEW})</TabsTrigger>
            <TabsTrigger value="APPROVED">Approved ({statusCounts.APPROVED})</TabsTrigger>
            <TabsTrigger value="REJECTED">Rejected ({statusCounts.REJECTED})</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Properties List */}
        {properties.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No properties found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {properties.map((property) => (
              <Card key={property.id}>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-4 gap-6">
                    {/* Image */}
                    <div className="relative h-48 rounded-lg overflow-hidden">
                      {property.images.length > 0 ? (
                        <Image
                          src={property.images[0]}
                          alt={property.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="md:col-span-2 space-y-3">
                      <div>
                        <h3 className="text-xl font-bold">{property.title}</h3>
                        <p className="text-sm text-muted-foreground">{property.location}</p>
</div>
<div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Asset Value:</span>
                      <p className="font-medium">${property.assetValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Shares:</span>
                      <p className="font-medium">{property.totalShares}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Price/Share:</span>
                      <p className="font-medium">${property.pricePerShare.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Submitted:</span>
                      <p className="font-medium">
                        {new Date(property.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">Owner:</span>
                    <p className="font-mono text-xs">{property.owner.walletAddress}</p>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">Description:</span>
                    <p className="text-sm mt-1">{property.description || 'No description'}</p>
                  </div>

                  {/* Documents */}
                  <div>
                    <span className="text-sm font-medium">Documents ({property.documents.length}):</span>
                    <div className="mt-2 space-y-2">
                      {property.documents.map((doc: any) => (
                        <div key={doc.id} className="flex items-center justify-between text-sm p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span>{doc.name}</span>
                            {doc.verified && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <div className="flex gap-2">
                            <a href={doc.url} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="ghost">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </a>
                            {!doc.verified && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleVerifyDocument(doc.id)}
                              >
                                Verify
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    {property.status === 'PENDING' && (
                      <>
                        <Button
                          onClick={() => handleMarkUnderReview(property.id)}
                          disabled={processing}
                          variant="outline"
                          className="w-full"
                        >
                          Mark Under Review
                        </Button>
                        <Button
                          onClick={() => handleApprove(property.id)}
                          disabled={processing}
                          className="w-full bg-green-500 hover:bg-green-600"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedProperty(property)
                            setShowRejectDialog(true)
                          }}
                          disabled={processing}
                          variant="destructive"
                          className="w-full"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}

                    {property.status === 'UNDER_REVIEW' && (
                      <>
                        <Button
                          onClick={() => handleApprove(property.id)}
                          disabled={processing}
                          className="w-full bg-green-500 hover:bg-green-600"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedProperty(property)
                            setShowRejectDialog(true)
                          }}
                          disabled={processing}
                          variant="destructive"
                          className="w-full"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}

                    {property.status === 'APPROVED' && (
                      <div className="p-4 bg-green-50 rounded-lg text-center">
                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <p className="text-sm font-medium text-green-800">Approved</p>
                      </div>
                    )}

                    {property.status === 'REJECTED' && (
                      <div className="p-4 bg-red-50 rounded-lg">
                        <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                        <p className="text-sm font-medium text-red-800 mb-2">Rejected</p>
                        {property.rejectionReason && (
                          <p className="text-xs text-red-600">{property.rejectionReason}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Activity Log Preview */}
                  {property.activityLogs && property.activityLogs.length > 0 && (
                    <div className="pt-4 border-t">
                      <p className="text-xs font-medium mb-2">Recent Activity</p>
                      <div className="space-y-1">
                        {property.activityLogs.slice(0, 3).map((log: any) => (
                          <div key={log.id} className="text-xs text-muted-foreground">
                            {log.action}: {log.description}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )}

    {/* Reject Dialog */}
    <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Property</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this property. This will be visible to the property owner.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Enter rejection reason..."
          rows={4}
        />
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setShowRejectDialog(false)
              setRejectionReason('')
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={processing || !rejectionReason.trim()}
          >
            {processing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Rejecting...
              </>
            ) : (
              'Reject Property'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</DashboardLayout>
  )}