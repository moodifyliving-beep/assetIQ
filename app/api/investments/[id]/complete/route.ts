// app/api/investments/[id]/complete/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { transactionHash } = body

    const investment = await prisma.investment.findUnique({
      where: { id },
      include: { property: true, user: true }
    })

    if (!investment) {
      return NextResponse.json(
        { error: 'Investment not found' },
        { status: 404 }
      )
    }

    // If already completed, return success (idempotent)
    if (investment.paymentStatus === 'COMPLETED') {
      return NextResponse.json({ success: true, investment, message: 'Already completed' })
    }

    // Update investment status
    await prisma.investment.update({
      where: { id },
      data: {
        paymentStatus: 'COMPLETED',
        transactionHash: transactionHash || investment.transactionHash,
      }
    })

    // Update property available shares
    // Only decrement if investment was previously pending (prevents double-decrement if webhook already ran)
    if (investment.paymentStatus === 'PENDING' || investment.paymentStatus === 'PROCESSING') {
      await prisma.property.update({
        where: { id: investment.propertyId },
        data: {
          availableShares: {
            decrement: investment.shares
          }
        }
      })
    }

    // Create activity log
    await prisma.propertyActivityLog.create({
      data: {
        propertyId: investment.propertyId,
        action: 'INVESTMENT',
        description: `Investment of ${investment.shares} shares completed`,
        performedBy: investment.user.walletAddress,
        metadata: {
          investmentId: investment.id,
          shares: investment.shares,
          amount: investment.investmentAmount
        }
      }
    })

    return NextResponse.json({ success: true, investment })
  } catch (error) {
    console.error('Error completing investment:', error)
    return NextResponse.json(
      { error: 'Failed to complete investment' },
      { status: 500 }
    )
  }
}