"use client"

import type React from "react"
import { useState } from "react"
import { Upload, X } from "lucide-react"

interface ImageUploadProps {
  onImagesChange: (files: File[]) => void
  maxFiles?: number
}

export function ImageUpload({ onImagesChange, maxFiles = 10 }: ImageUploadProps) {
  const [images, setImages] = useState<{ file: File; preview: string }[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
    addImages(files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    addImages(files)
  }

  const addImages = (files: File[]) => {
    const newImages = files.slice(0, maxFiles - images.length).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    const updatedImages = [...images, ...newImages]
    setImages(updatedImages)
    onImagesChange(updatedImages.map((img) => img.file))
  }

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index)
    setImages(updatedImages)
    onImagesChange(updatedImages.map((img) => img.file))
    URL.revokeObjectURL(images[index].preview)
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-foreground">Property Images</label>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-border bg-background"
        }`}
      >
        <input type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" id="image-upload" />
        <label htmlFor="image-upload" className="cursor-pointer">
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Drag and drop images here</p>
              <p className="text-xs text-muted-foreground">or click to select files</p>
            </div>
            <p className="text-xs text-muted-foreground">
              {images.length}/{maxFiles} images uploaded
            </p>
          </div>
        </label>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.preview || "/placeholder.svg"}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-border"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-destructive/90 hover:bg-destructive text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              {index === 0 && (
                <div className="absolute top-1 left-1 bg-primary text-white text-xs px-2 py-1 rounded">Cover</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
