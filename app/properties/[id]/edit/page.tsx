// app/properties/[id]/edit/page.tsx
"use client"

import type React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageUpload } from "@/components/forms/image-upload"
import { DocumentVerification } from "@/components/forms/document-verification"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAccount } from "wagmi"
import { useAppKit } from "@reown/appkit/react"
import { toast } from "sonner"
import { Loader2, ArrowLeft } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"

export default function EditProperty() {
  const router = useRouter()
  const params = useParams()
  const { address, isConnected } = useAccount()
  const { open } = useAppKit()
  
  const [loading, setLoading] = useState(true)
  const [property, setProperty] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    description: "",
    shares: "",
  })

  const [images, setImages] = useState<string[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProperty()
    }
  }, [params.id])

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${params.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch property')
      }
      
      const data = await response.json()
      setProperty(data)
      
      // Pre-populate form
      setFormData({
        title: data.title || "",
        location: data.location || "",
        price: data.assetValue?.toString() || "",
        description: data.description || "",
        shares: data.totalShares?.toString() || "",
      })
      setImages(data.images || [])
      setDocuments(data.documents?.map((doc: any) => ({
        type: doc.type,
        name: doc.name,
        url: doc.url
      })) || [])
    } catch (error) {
      console.error('Error fetching property:', error)
      toast.error('Failed to load property')
      router.push('/my-properties')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check wallet connection
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first")
      open()
      return
    }

    // Verify ownership
    if (property && property.owner.walletAddress.toLowerCase() !== address.toLowerCase()) {
      toast.error("You don't have permission to edit this property")
      router.push('/my-properties')
      return
    }

    // Validation
    if (!formData.title || !formData.location || !formData.price || !formData.shares) {
      toast.error("Please fill in all required fields")
      return
    }

    if (images.length === 0) {
      toast.error("Please upload at least one image")
      return
    }

    if (documents.length === 0) {
      toast.error("Please upload at least one document")
      return
    }

    // Check if property has investments - if so, restrict certain edits
    const hasInvestments = property?._count?.investments > 0 || property?.investments?.length > 0
    const isApproved = property?.status === 'APPROVED' || property?.status === 'TOKENIZED' || property?.status === 'FUNDED'
    
    if (hasInvestments && isApproved) {
      // Can't change shares or asset value if property is approved and has investments
      if (parseFloat(formData.price) !== property.assetValue || parseInt(formData.shares) !== property.totalShares) {
        toast.error("Cannot change asset value or total shares for properties with active investments")
        return
      }
    }

    setSubmitting(true)

    try {
      const response = await fetch(`/api/properties/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          assetValue: parseFloat(formData.price),
          totalShares: parseInt(formData.shares),
          images,
          documents: documents.map(doc => ({
            type: doc.type,
            name: doc.name,
            url: doc.url
          })),
          walletAddress: address, // For ownership verification
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update property')
      }

      const updatedProperty = await response.json()
      
      toast.success("Property updated successfully!")
      
      // Redirect to property detail page
      router.push(`/asset/${params.id}`)
      
    } catch (error: any) {
      console.error('Error updating property:', error)
      toast.error(error.message || "Failed to update property. Please try again.")
    } finally {
      setSubmitting(false)
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
          <h2 className="text-2xl font-bold mb-2 text-foreground">Property Not Found</h2>
          <p className="text-muted-foreground mb-4">The property you're looking for doesn't exist</p>
          <Link href="/my-properties">
            <Button>Back to My Properties</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const hasInvestments = property?._count?.investments > 0 || property?.investments?.length > 0
  const isApproved = property?.status === 'APPROVED' || property?.status === 'TOKENIZED' || property?.status === 'FUNDED'
  const canEditShares = !hasInvestments || !isApproved

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/my-properties">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Edit Property</h1>
            <p className="text-muted-foreground">
              Update your property listing information
            </p>
          </div>
        </div>

        {/* Status Warning */}
        {isApproved && hasInvestments && (
          <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
            <CardContent className="pt-6">
              <p className="text-yellow-800 dark:text-yellow-300 text-sm">
                ⚠️ This property is approved and has active investments. Some fields (Asset Value, Total Shares) cannot be modified to protect investor interests.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Form */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-background border border-border">
            <TabsTrigger value="details">Asset Details</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          {/* Asset Details Tab */}
          <TabsContent value="details">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Asset Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Asset Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Downtown Luxury Apartments"
                      className="bg-input border-border"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g., New York, NY"
                      className="bg-input border-border"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Asset Value <span className="text-red-500">*</span>
                        {!canEditShares && (
                          <span className="text-xs text-muted-foreground ml-2">(Locked)</span>
                        )}
                      </label>
                      <Input
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="1000000"
                        className="bg-input border-border"
                        required
                        disabled={!canEditShares}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Total Shares <span className="text-red-500">*</span>
                        {!canEditShares && (
                          <span className="text-xs text-muted-foreground ml-2">(Locked)</span>
                        )}
                      </label>
                      <Input
                        name="shares"
                        type="number"
                        value={formData.shares}
                        onChange={handleChange}
                        placeholder="1000"
                        className="bg-input border-border"
                        required
                        disabled={!canEditShares}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Description
                    </label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your asset..."
                      rows={4}
                      className="bg-input border-border"
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Asset Images <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload 
                  onImagesChange={setImages} 
                  maxFiles={10}
                  initialImages={images}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Document Verification <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DocumentVerification 
                  onDocumentsChange={setDocuments}
                  initialDocuments={documents}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button 
            onClick={handleSubmit} 
            disabled={!isConnected || submitting}
            className="bg-primary hover:bg-primary/90"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating Property...
              </>
            ) : (
              'Update Property'
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => router.push('/my-properties')}
          >
            Cancel
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}

