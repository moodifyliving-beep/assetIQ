// app/api/admin/properties/[id]/reject/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const walletAddress = req.headers.get('x-wallet-address')
    const admin = await requireAdmin(walletAddress || undefined)

    const body = await req.json()
    const { reason } = body

    if (!reason) {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
        { status: 400 }
      )
    }

    const property = await prisma.property.update({
      where: { id },
      data: {
        status: 'REJECTED',
        reviewedAt: new Date(),
        reviewedById: admin.id,
        rejectionReason: reason
      },
      include: {
        owner: true,
        documents: true
      }
    })

    // Log activity
    await prisma.propertyActivityLog.create({
      data: {
        propertyId: id,
        action: 'REJECTED',
        description: `Property rejected: ${reason}`,
        performedBy: walletAddress || 'SYSTEM',
        metadata: {
          reviewedBy: admin.id,
          reviewedAt: new Date().toISOString(),
          reason
        }
      }
    })

    return NextResponse.json(property)
  } catch (error: any) {
    console.error('Error rejecting property:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to reject property' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    )
  }
}

