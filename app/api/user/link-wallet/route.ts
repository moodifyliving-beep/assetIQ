// app/api/user/link-wallet/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { linkWalletToUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { walletAddress } = body

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    const updatedUser = await linkWalletToUser(session.user.id, walletAddress)

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error: any) {
    console.error('Error linking wallet:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to link wallet' },
      { status: 500 }
    )
  }
}

