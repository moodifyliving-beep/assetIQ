// components/forms/document-verification.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useUploadThing } from '@/lib/uploadthing'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, FileText, Loader2, Upload } from 'lucide-react'

interface Document {
  type: string
  name: string
  url: string
}

interface DocumentVerificationProps {
  onDocumentsChange: (documents: Document[]) => void
  initialDocuments?: Document[]
}

const DOCUMENT_TYPES = [
  { value: 'TITLE_DEED', label: 'Title Deed' },
  { value: 'OWNERSHIP_PROOF', label: 'Ownership Proof' },
  { value: 'VALUATION_REPORT', label: 'Valuation Report' },
  { value: 'LEGAL_DOCUMENT', label: 'Legal Document' },
  { value: 'INSURANCE', label: 'Insurance' },
  { value: 'OTHER', label: 'Other' },
]

export function DocumentVerification({ onDocumentsChange, initialDocuments = [] }: DocumentVerificationProps) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments)
  const [selectedType, setSelectedType] = useState<string>('TITLE_DEED')
  const [uploading, setUploading] = useState(false)
  const onDocumentsChangeRef = useRef(onDocumentsChange)
  const prevInitialDocumentsRef = useRef<Document[]>(initialDocuments)

  // Keep callback ref up to date
  useEffect(() => {
    onDocumentsChangeRef.current = onDocumentsChange
  }, [onDocumentsChange])

  // Sync with parent state when initialDocuments change (e.g., when switching tabs)
  useEffect(() => {
    // Only update if initialDocuments actually changed from parent
    const prevStr = JSON.stringify(prevInitialDocumentsRef.current)
    const currentStr = JSON.stringify(initialDocuments)
    
    if (prevStr !== currentStr) {
      prevInitialDocumentsRef.current = initialDocuments
      setDocuments(initialDocuments)
    }
  }, [initialDocuments])

  const { startUpload, isUploading } = useUploadThing('propertyDocuments', {
    onClientUploadComplete: (res) => {
      const newDocs = res?.map(file => ({
        type: selectedType,
        name: file.name,
        url: file.url
      })) || []
      
      setDocuments((prevDocs) => {
        const updatedDocs = [...prevDocs, ...newDocs]
        // Notify parent after state update completes (deferred to avoid render warning)
        queueMicrotask(() => {
          onDocumentsChangeRef.current(updatedDocs)
        })
        return updatedDocs
      })
      setUploading(false)
    },
    onUploadError: (error) => {
      console.error('Upload error:', error)
      setUploading(false)
      alert('Failed to upload document')
    },
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploading(true)
    await startUpload(files)
  }

  const removeDocument = (index: number) => {
    const newDocs = documents.filter((_, i) => i !== index)
    setDocuments(newDocs)
    // Notify parent after state update completes (deferred to avoid render warning)
    queueMicrotask(() => {
      onDocumentsChangeRef.current(newDocs)
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {documents.map((doc, index) => (
          <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg bg-secondary/50">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-sm">{doc.name}</p>
                <p className="text-xs text-muted-foreground">
                  {DOCUMENT_TYPES.find(t => t.value === doc.type)?.label}
                </p>
              </div>
            </div>
            <button
              onClick={() => removeDocument(index)}
              className="p-1 hover:bg-secondary rounded"
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DOCUMENT_TYPES.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1">
          <input
            type="file"
            id="document-upload"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            disabled={uploading || isUploading}
            className="hidden"
          />
          <label htmlFor="document-upload" className="block">
            <Button
              type="button"
              variant="outline"
              disabled={uploading || isUploading}
              className="w-full cursor-pointer"
              asChild
            >
              <div>
                {uploading || isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </>
                )}
              </div>
            </Button>
          </label>
        </div>
      </div>
    </div>
  )
}