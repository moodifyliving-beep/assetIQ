// app/api/admin/properties/[id]/review/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const walletAddress = req.headers.get('x-wallet-address')
    const admin = await requireAdmin(walletAddress || undefined)

    const property = await prisma.property.update({
      where: { id },
      data: {
        status: 'UNDER_REVIEW',
        reviewedAt: new Date(),
        reviewedById: admin.id
      },
      include: {
        owner: true,
        documents: true,
        activityLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    // Log activity
    await prisma.propertyActivityLog.create({
      data: {
        propertyId: id,
        action: 'UNDER_REVIEW',
        description: 'Property moved to review status',
        performedBy: walletAddress || 'SYSTEM',
        metadata: {
          reviewedBy: admin.id,
          reviewedAt: new Date().toISOString()
        }
      }
    })

    return NextResponse.json(property)
  } catch (error: any) {
    console.error('Error reviewing property:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to review property' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    )
  }
}

