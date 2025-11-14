// components/forms/image-upload.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useUploadThing } from '@/lib/uploadthing'
import { Button } from '@/components/ui/button'
import { X, Upload, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  onImagesChange: (images: string[]) => void
  maxFiles?: number
  initialImages?: string[]
}

export function ImageUpload({ onImagesChange, maxFiles = 10, initialImages = [] }: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(initialImages)
  const [uploading, setUploading] = useState(false)
  const onImagesChangeRef = useRef(onImagesChange)
  const prevInitialImagesRef = useRef<string[]>(initialImages)

  // Keep callback ref up to date
  useEffect(() => {
    onImagesChangeRef.current = onImagesChange
  }, [onImagesChange])

  // Sync with parent state when initialImages change (e.g., when switching tabs)
  useEffect(() => {
    // Only update if initialImages actually changed from parent
    const prevStr = JSON.stringify(prevInitialImagesRef.current)
    const currentStr = JSON.stringify(initialImages)
    
    if (prevStr !== currentStr) {
      prevInitialImagesRef.current = initialImages
      setImages(initialImages)
    }
  }, [initialImages])

  const { startUpload, isUploading } = useUploadThing('propertyImages', {
    onClientUploadComplete: (res) => {
      const urls = res?.map(file => file.url) || []
      setImages((prevImages) => {
        const newImages = [...prevImages, ...urls]
        // Notify parent after state update completes (deferred to avoid render warning)
        queueMicrotask(() => {
          onImagesChangeRef.current(newImages)
        })
        return newImages
      })
      setUploading(false)
    },
    onUploadError: (error) => {
      console.error('Upload error:', error)
      setUploading(false)
      alert('Failed to upload images')
    },
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (files.length + images.length > maxFiles) {
      alert(`Maximum ${maxFiles} images allowed`)
      return
    }

    setUploading(true)
    await startUpload(files)
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    // Notify parent after state update completes (deferred to avoid render warning)
    queueMicrotask(() => {
      onImagesChangeRef.current(newImages)
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {images.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
            <Image
              src={url}
              alt={`Property ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {images.length < maxFiles && (
        <div>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={uploading || isUploading}
            className="hidden"
          />
          <label htmlFor="image-upload">
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
                    Upload Images ({images.length}/{maxFiles})
                  </>
                )}
              </div>
            </Button>
          </label>
        </div>
      )}
    </div>
  )
}