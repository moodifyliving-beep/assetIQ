// app/api/properties/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    const body = await req.json()
    const { 
      title, 
      description, 
      location, 
      assetValue, 
      totalShares,
      images,
      documents,
      walletAddress 
    } = body

    // Validate required fields (owner identified by session OR walletAddress)
    if (!title || !location || !assetValue || !totalShares) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let user = null

    // Prefer session (email/password auth) for property management - no wallet required
    if (session?.user?.id) {
      user = await prisma.user.findUnique({
        where: { id: session.user.id }
      })
    }

    // Fallback: wallet address (for wallet-connected users)
    if (!user && walletAddress) {
      const normalizedWalletAddress = walletAddress.toLowerCase()
      user = await prisma.user.findUnique({
        where: { walletAddress: normalizedWalletAddress }
      })
      if (!user) {
        const placeholderEmail = `wallet-${normalizedWalletAddress}@assetsiq.local`
        const existingUser = await prisma.user.findUnique({
          where: { email: placeholderEmail }
        })
        user = existingUser || await prisma.user.create({
          data: { 
            walletAddress: normalizedWalletAddress,
            email: placeholderEmail,
          }
        })
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Sign in or connect your wallet to add properties' },
        { status: 401 }
      )
    }

    // Calculate price per share
    const pricePerShare = assetValue / totalShares

    // Create property
    const property = await prisma.property.create({
      data: {
        title,
        description: description || '',
        location,
        assetValue: parseFloat(assetValue),
        totalShares: parseInt(totalShares),
        availableShares: parseInt(totalShares),
        pricePerShare,
        images: images || [],
        ownerId: user.id,
        status: 'PENDING',
        documents: {
          create: documents?.map((doc: any) => ({
            type: doc.type,
            name: doc.name,
            url: doc.url,
            verified: false
          })) || []
        }
      },
      include: {
        documents: true,
        owner: true
      }
    })

    return NextResponse.json(property, { status: 201 })
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    const { searchParams } = new URL(req.url)
    const walletAddress = searchParams.get('walletAddress')
    const mine = searchParams.get('mine') === 'true'
    const status = searchParams.get('status')

    const where: any = {}
    
    // "My properties" - prefer session (email auth), fallback to wallet
    if (mine) {
      if (session?.user?.id) {
        where.ownerId = session.user.id
      } else if (walletAddress) {
        const normalizedWalletAddress = walletAddress.toLowerCase()
        const user = await prisma.user.findUnique({
          where: { walletAddress: normalizedWalletAddress }
        })
        if (user) where.ownerId = user.id
        else return NextResponse.json([])
      } else {
        return NextResponse.json([])
      }
    } else if (walletAddress) {
      const normalizedWalletAddress = walletAddress.toLowerCase()
      const user = await prisma.user.findUnique({
        where: { walletAddress: normalizedWalletAddress }
      })
      if (user) where.ownerId = user.id
      else return NextResponse.json([])
    }

    if (status) {
      // Support multiple statuses (comma-separated) for marketplace queries
      const statuses = status.split(',').map(s => s.trim())
      if (statuses.length === 1) {
        where.status = statuses[0]
      } else {
        where.status = { in: statuses }
      }
    }

    const properties = await prisma.property.findMany({
      where,
      include: {
        documents: true,
        owner: true,
        _count: {
          select: { investments: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(properties)
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}