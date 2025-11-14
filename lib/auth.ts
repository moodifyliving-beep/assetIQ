// lib/auth.ts
import { prisma } from './prisma'

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

