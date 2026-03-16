// app/api/admin/check/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering to prevent build-time database connection attempts
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })

    if (!session?.user?.id) {
      return NextResponse.json({ isAdmin: false })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    const isAdmin =
      user !== null && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')

    return NextResponse.json({ isAdmin })
  } catch (error: any) {
    console.error('Error checking admin status:', error)
    return NextResponse.json({ isAdmin: false })
  }
}

 