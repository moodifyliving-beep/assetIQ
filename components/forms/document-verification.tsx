"use client"

import type React from "react"
import { useState } from "react"
import { Upload, X, FileText, CheckCircle2, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Document {
  id: string
  name: string
  type: "title_deed" | "tax_certificate" | "inspection_report" | "appraisal" | "insurance" | "other"
  file?: File
  status: "pending" | "verified" | "rejected"
  uploadedAt?: Date
}

interface DocumentVerificationProps {
  onDocumentsChange: (documents: Document[]) => void
}

const DOCUMENT_TYPES = [
  { value: "title_deed", label: "Title Deed" },
  { value: "tax_certificate", label: "Tax Certificate" },
  { value: "inspection_report", label: "Inspection Report" },
  { value: "appraisal", label: "Property Appraisal" },
  { value: "insurance", label: "Insurance Policy" },
  { value: "other", label: "Other Documents" },
]

export function DocumentVerification({ onDocumentsChange }: DocumentVerificationProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedType, setSelectedType] = useState<Document["type"]>("title_deed")

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach((file) => {
      const newDoc: Document = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: selectedType,
        file,
        status: "pending",
        uploadedAt: new Date(),
      }
      const updatedDocs = [...documents, newDoc]
      setDocuments(updatedDocs)
      onDocumentsChange(updatedDocs)
    })
  }

  const removeDocument = (id: string) => {
    const updatedDocs = documents.filter((doc) => doc.id !== id)
    setDocuments(updatedDocs)
    onDocumentsChange(updatedDocs)
  }

  const getStatusIcon = (status: Document["status"]) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case "rejected":
        return <AlertCircle className="w-4 h-4 text-destructive" />
      default:
        return <FileText className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: Document["status"]) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-500/20 text-green-700">Verified</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">Pending Review</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-foreground">Document Verification</label>

      {/* Document Type Selector and Upload */}
      <Card className="bg-card border-border p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Document Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as Document["type"])}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {DOCUMENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Upload Document</label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
                id="doc-upload"
              />
              <label htmlFor="doc-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </Card>

      {/* Documents List */}
      {documents.length > 0 && (
        <Card className="bg-card border-border">
          <div className="divide-y divide-border">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 flex items-center justify-between hover:bg-background/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  {getStatusIcon(doc.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {DOCUMENT_TYPES.find((t) => t.value === doc.type)?.label}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(doc.status)}
                  <button
                    onClick={() => removeDocument(doc.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <p className="text-xs text-muted-foreground">
        Documents will be verified by our team. This typically takes 24-48 hours.
      </p>
    </div>
  )
}
