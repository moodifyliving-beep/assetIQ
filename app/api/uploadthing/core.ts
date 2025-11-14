// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
  propertyImages: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete:", file.url)
      return { url: file.url }
    }),
    
  propertyDocuments: f({ pdf: { maxFileSize: "8MB", maxFileCount: 5 } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Document uploaded:", file.url)
      return { url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter