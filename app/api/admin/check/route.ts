// app/api/admin/check/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const walletAddress = req.headers.get('x-wallet-address')

    if (!walletAddress) {
      return NextResponse.json({ isAdmin: false })
    }

    // Normalize wallet address
    const normalizedAddress = walletAddress.toLowerCase()

    // Find user
    const user = await prisma.user.findUnique({
      where: { walletAddress: normalizedAddress },
      select: {
        role: true
      }
    })

    // Check if user exists and is admin
    const isAdmin = user !== null && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')

    return NextResponse.json({ isAdmin })
  } catch (error: any) {
    console.error('Error checking admin status:', error)
    // Return false on error instead of throwing
    return NextResponse.json({ isAdmin: false })
  }
}

