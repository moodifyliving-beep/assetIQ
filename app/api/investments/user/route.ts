import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const propertyId = searchParams.get('propertyId')
    const walletAddress = searchParams.get('walletAddress')
    const paymentStatus = searchParams.get('paymentStatus') // Optional filter

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() }
    })

    if (!user) {
      return NextResponse.json([]) // Return empty array if user doesn't exist
    }

    // Build where clause
    const where: any = {
      userId: user.id
    }

    if (propertyId) {
      where.propertyId = propertyId
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus
    } else if (propertyId) {
      // If propertyId is provided, only return completed investments (for backward compatibility)
      where.paymentStatus = 'COMPLETED'
    }

    // If propertyId is provided, get first investment (backward compatibility)
    if (propertyId) {
      const investment = await prisma.investment.findFirst({
        where,
        include: {
          property: {
            include: {
              owner: true,
              documents: true
            }
          },
          user: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return NextResponse.json(investment)
    }

    // Otherwise, get all investments for the user
    const investments = await prisma.investment.findMany({
      where,
      include: {
        property: {
          include: {
            owner: true,
            documents: true
          }
        },
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(investments)
  } catch (error) {
    console.error('Error fetching user investments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch investments' },
      { status: 500 }
    )
  }
}