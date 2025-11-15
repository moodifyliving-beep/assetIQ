// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Helper to check if a string is a valid MongoDB ObjectID
function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id)
}

// Helper to sanitize data by removing invalid IDs
function sanitizeData(data: any): any {
  if (!data || typeof data !== 'object') return data
  
  const sanitized = { ...data }
  // Remove invalid ID if present - let Prisma/MongoDB auto-generate valid ObjectID
  if (sanitized.id && !isValidObjectId(sanitized.id)) {
    delete sanitized.id
  }
  // Also check for _id (MongoDB's native field name)
  if (sanitized._id && !isValidObjectId(sanitized._id)) {
    delete sanitized._id
  }
  return sanitized
}

const prismaClientBase = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

// Create Prisma client with extension to sanitize invalid IDs
const prismaClient = prismaClientBase.$extends({
  query: {
    $allModels: {
      async create({ args, query }) {
        if (args.data) {
          args.data = sanitizeData(args.data)
        }
        return query(args)
      },
      async createMany({ args, query }) {
        if (args.data) {
          if (Array.isArray(args.data)) {
            args.data = args.data.map(sanitizeData)
          } else {
            args.data = sanitizeData(args.data)
          }
        }
        return query(args)
      },
      async update({ args, query }) {
        if (args.data) {
          args.data = sanitizeData(args.data)
        }
        return query(args)
      },
      async updateMany({ args, query }) {
        if (args.data) {
          args.data = sanitizeData(args.data)
        }
        return query(args)
      },
    },
  },
})

export const prisma =
  globalForPrisma.prisma ?? (prismaClient as unknown as PrismaClient)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma