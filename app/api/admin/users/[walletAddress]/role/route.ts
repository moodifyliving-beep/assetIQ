// app/api/admin/users/[walletAddress]/role/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ walletAddress: string }> }
) {
  try {
    const { walletAddress: encodedWalletAddress } = await params
    // Decode the URL-encoded wallet address and normalize to lowercase
    // Next.js may already decode it, but decodeURIComponent is safe to call on decoded strings
    let targetWalletAddress = decodeURIComponent(encodedWalletAddress)
    // Normalize to lowercase for Ethereum addresses (case-insensitive)
    targetWalletAddress = targetWalletAddress.toLowerCase()
    
    const walletAddress = req.headers.get('x-wallet-address')
    await requireAdmin(walletAddress || undefined)

    const body = await req.json()
    const { role } = body

    if (!role || !['USER', 'ADMIN', 'SUPER_ADMIN'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be USER, ADMIN, or SUPER_ADMIN' },
        { status: 400 }
      )
    }

    // First check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { walletAddress: targetWalletAddress }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const user = await prisma.user.update({
      where: { walletAddress: targetWalletAddress },
      data: { role },
      select: {
        id: true,
        walletAddress: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json(user)
  } catch (error: any) {
    console.error('Error updating user role:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: error.message || 'Failed to update user role' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    )
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ walletAddress: string }> }
) {
  try {
    const { walletAddress: encodedWalletAddress } = await params
    // Decode the URL-encoded wallet address and normalize to lowercase
    let targetWalletAddress = decodeURIComponent(encodedWalletAddress)
    targetWalletAddress = targetWalletAddress.toLowerCase()
    
    const walletAddress = req.headers.get('x-wallet-address')
    await requireAdmin(walletAddress || undefined)

    const user = await prisma.user.findUnique({
      where: { walletAddress: targetWalletAddress },
      select: {
        id: true,
        walletAddress: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            properties: true,
            investments: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error: any) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    )
  }
}

