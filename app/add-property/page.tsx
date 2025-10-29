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

export default function AddProperty() {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    description: "",
    shares: "",
  })

  const [images, setImages] = useState<File[]>([])
  const [documents, setDocuments] = useState<any[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Asset submitted:", {
      ...formData,
      images: images.length,
      documents: documents.length,
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Add Asset</h1>
          <p className="text-muted-foreground">Tokenize and list a new asset for investment with full documentation.</p>
        </div>

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
                    <label className="block text-sm font-medium text-foreground mb-2">Asset Title</label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Downtown Luxury Apartments"
                      className="bg-input border-border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g., New York, NY"
                      className="bg-input border-border"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Asset Value</label>
                      <Input
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="$0.00"
                        className="bg-input border-border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Total Shares</label>
                      <Input
                        name="shares"
                        value={formData.shares}
                        onChange={handleChange}
                        placeholder="1000"
                        className="bg-input border-border"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Description</label>
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

          {/* Images Tab */}
          <TabsContent value="images">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Asset Images</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload onImagesChange={setImages} maxFiles={10} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Document Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <DocumentVerification onDocumentsChange={setDocuments} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
            List Asset
          </Button>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
