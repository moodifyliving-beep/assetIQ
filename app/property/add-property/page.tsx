"use client"

import type React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageUpload } from "@/components/forms/image-upload"
import { DocumentVerification } from "@/components/forms/document-verification"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "@/lib/auth-client"
import { toast } from "sonner"
import { Loader2, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AddProperty() {
  const router = useRouter()
  const { data: session, isPending: sessionLoading } = useSession()

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user) {
      toast.error("Please sign in to add a property")
      return
    }
    if (
      !formData.title ||
      !formData.location ||
      !formData.price ||
      !formData.shares
    ) {
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
    setSubmitting(true)
    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          assetValue: parseFloat(formData.price),
          totalShares: parseInt(formData.shares),
          images,
          documents,
          // No walletAddress - API uses session (email auth)
        }),
      })
      if (!response.ok) throw new Error("Failed to create property")
      await response.json()
      toast.success("Property listed successfully! Pending approval.")
      setFormData({ title: "", location: "", price: "", description: "", shares: "" })
      setImages([])
      setDocuments([])
      router.push("/property/my-properties")
    } catch (error) {
      console.error("Error submitting property:", error)
      toast.error("Failed to list property. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (sessionLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  if (!session?.user) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <LogIn className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4">Sign in to add a property</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Sign in with your email to list properties. No wallet required.
          </p>
          <Link href="/login">
            <Button>Sign in</Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
          </p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Add Asset</h1>
          <p className="text-muted-foreground">
            Tokenize and list a new asset for investment with full documentation.
          </p>
        </div>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-background border border-border">
            <TabsTrigger value="details">Asset Details</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Asset Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
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
                    <label className="block text-sm font-medium mb-2">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g., Accra, Ghana"
                      className="bg-input border-border"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Asset Value <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="1000000"
                        className="bg-input border-border"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Total Shares <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="shares"
                        type="number"
                        value={formData.shares}
                        onChange={handleChange}
                        placeholder="1000"
                        className="bg-input border-border"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your asset..."
                      rows={4}
                      className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="images">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Asset Images <span className="text-red-500">*</span></CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload onImagesChange={setImages} maxFiles={10} initialImages={images} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="documents">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Document Verification <span className="text-red-500">*</span></CardTitle>
              </CardHeader>
              <CardContent>
                <DocumentVerification onDocumentsChange={setDocuments} initialDocuments={documents} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="flex gap-4">
          <Button
            onClick={handleSubmit}
            disabled={!session?.user || submitting}
            className="bg-primary hover:bg-primary/90"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Listing Asset...
              </>
            ) : (
              "List Asset"
            )}
          </Button>
          <Button variant="outline" onClick={() => router.push("/property/dashboard")}>
            Cancel
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
