// app/api/admin/stats/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 401 }
      )
    }

    const [
      totalProperties,
      pendingProperties,
      approvedProperties,
      rejectedProperties,
      totalUsers,
      totalInvestments,
      totalValue
    ] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({ where: { status: 'PENDING' } }),
      prisma.property.count({ where: { status: 'APPROVED' } }),
      prisma.property.count({ where: { status: 'REJECTED' } }),
      prisma.user.count(),
      prisma.investment.count(),
      prisma.property.aggregate({
        _sum: { assetValue: true }
      })
    ])

    return NextResponse.json({
      totalProperties,
      pendingProperties,
      approvedProperties,
      rejectedProperties,
      totalUsers,
      totalInvestments,
      totalValue: totalValue._sum.assetValue || 0
    })
  } catch (error: any) {
    console.error('Error fetching stats:', error)
    // Return proper HTTP status codes
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { error: error.message || 'Unauthorized' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}