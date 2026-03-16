// app/api/admin/properties/[id]/archive/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 401 }
      )
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true },
    })

    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 401 }
      )
    }

    const { id } = await params

    const property = await prisma.property.update({
      where: { id },
      data: {
        status: 'CLOSED',
        reviewedAt: new Date(),
        reviewedById: adminUser.id,
      },
      include: {
        owner: true,
        documents: true,
      },
    })

    await prisma.propertyActivityLog.create({
      data: {
        propertyId: id,
        action: 'ARCHIVED',
        description: 'Property archived by admin',
        performedBy: session.user.id,
        metadata: {
          archivedBy: adminUser.id,
          archivedAt: new Date().toISOString(),
        },
      },
    })

    return NextResponse.json(property)
  } catch (error: any) {
    console.error('Error archiving property:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to archive property' },
      { status: 500 }
    )
  }
}

