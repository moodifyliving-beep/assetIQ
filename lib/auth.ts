// lib/auth.ts
import { betterAuth } from "better-auth"
import { prisma } from "./prisma"
import { prismaAdapter } from "better-auth/adapters/prisma"

// Create the Prisma adapter for Better Auth
// The Prisma middleware in lib/prisma.ts will handle sanitizing invalid MongoDB ObjectIDs
const adapter = prismaAdapter(prisma, {})

export const auth = betterAuth({
  database: adapter,
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  basePath: "/api/auth",
  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET || "change-this-secret-in-production",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
  },
  magicLink: {
    enabled: true,
    requireEmailVerification: false,
  },
  passkey: {
    enabled: true,
    rpName: "Assets IQ",
    rpID: process.env.NEXT_PUBLIC_APP_URL?.replace(/https?:\/\//, "").split(":")[0] || "localhost",
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  // Note: walletAddress is a custom field in our User model
  // Better Auth will create users without walletAddress, which is fine
  // We handle wallet authentication separately via SIWE API routes
})

export async function requireAdmin(walletAddress?: string) {
  if (!walletAddress) {
    throw new Error('Unauthorized: Wallet address required')
  }

  // Normalize wallet address to lowercase for consistency
  const normalizedAddress = walletAddress.toLowerCase()

  // Try normalized address first
  let user = await prisma.user.findUnique({
    where: { walletAddress: normalizedAddress }
  })

  // If not found with normalized address, try original (for backward compatibility)
  if (!user) {
    user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress }
    })
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    throw new Error('Unauthorized: Admin access required')
  }

  return user
}

// Helper to get or create user by wallet address
export async function getOrCreateUserByWallet(walletAddress: string) {
  const normalizedAddress = walletAddress.toLowerCase()
  
  let user = await prisma.user.findUnique({
    where: { walletAddress: normalizedAddress }
  })

  if (!user) {
    // Generate a unique placeholder email for wallet-only users
    // This ensures the unique email constraint is satisfied
    const placeholderEmail = `wallet-${normalizedAddress}@assetsiq.local`
    
    // Check if this placeholder email already exists (shouldn't happen, but be safe)
    const existingUser = await prisma.user.findUnique({
      where: { email: placeholderEmail }
    })
    
    if (existingUser) {
      // If somehow it exists, use the existing user
      user = existingUser
    } else {
      user = await prisma.user.create({
        data: { 
          walletAddress: normalizedAddress,
          email: placeholderEmail, // Unique placeholder email for wallet users
        }
      })
    }
  }

  return user
}

// Helper to link wallet to existing user account
export async function linkWalletToUser(userId: string, walletAddress: string) {
  const normalizedAddress = walletAddress.toLowerCase()
  
  return await prisma.user.update({
    where: { id: userId },
    data: { walletAddress: normalizedAddress }
  })
}
