// app/api/admin/documents/[id]/verify/route.ts
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
    await requireAdmin(walletAddress || undefined)

    const body = await req.json()
    const { verified } = body

    const document = await prisma.document.update({
      where: { id },
      data: {
        verified: verified ?? true,
        verifiedAt: verified ? new Date() : null,
        verifiedBy: walletAddress || undefined
      },
      include: {
        property: true
      }
    })

    // Log activity
    await prisma.propertyActivityLog.create({
      data: {
        propertyId: document.propertyId,
        action: verified ? 'DOCUMENT_VERIFIED' : 'DOCUMENT_UNVERIFIED',
        description: `Document "${document.name}" ${verified ? 'verified' : 'unverified'}`,
        performedBy: walletAddress || 'SYSTEM'
      }
    })

    return NextResponse.json(document)
  } catch (error: any) {
    console.error('Error verifying document:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to verify document' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    )
  }
}

