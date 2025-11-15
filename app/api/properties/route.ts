// app/api/properties/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
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

    // Validate required fields
    if (!title || !location || !assetValue || !totalShares || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Normalize wallet address to lowercase for consistency
    const normalizedWalletAddress = walletAddress.toLowerCase()
    
    // Find or create user with unique email
    let user = await prisma.user.findUnique({
      where: { walletAddress: normalizedWalletAddress }
    })

    if (!user) {
      // Generate unique placeholder email for wallet-only users
      const placeholderEmail = `wallet-${normalizedWalletAddress}@assetsiq.local`
      
      // Check if email exists (shouldn't happen, but be safe)
      const existingUser = await prisma.user.findUnique({
        where: { email: placeholderEmail }
      })
      
      if (existingUser) {
        user = existingUser
      } else {
        user = await prisma.user.create({
          data: { 
            walletAddress: normalizedWalletAddress,
            email: placeholderEmail, // Unique email required for Better Auth
          }
        })
      }
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
    const { searchParams } = new URL(req.url)
    const walletAddress = searchParams.get('walletAddress')
    const status = searchParams.get('status')

    const where: any = {}
    
    if (walletAddress) {
      // Normalize wallet address to lowercase for consistency
      const normalizedWalletAddress = walletAddress.toLowerCase()
      const user = await prisma.user.findUnique({
        where: { walletAddress: normalizedWalletAddress }
      })
      if (user) {
        where.ownerId = user.id
      } else {
        // If user doesn't exist, return empty array (no properties for this wallet)
        return NextResponse.json([])
      }
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