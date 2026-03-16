// app/api/admin/properties/route.ts
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

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where: any = {}
    if (status) {
      where.status = status
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          owner: true,
          documents: true,
          _count: {
            select: { investments: true }
          }
        },
        orderBy: {
          submittedAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.property.count({ where })
    ])

    return NextResponse.json({
      properties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error: any) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch properties' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    )
  }
}

