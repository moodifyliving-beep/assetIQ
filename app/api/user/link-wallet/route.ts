// app/api/user/link-wallet/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { linkWalletToUser } from '@/lib/auth'
import { SiweMessage } from 'siwe'

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
    const { walletAddress, message, signature } = body

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    // Verify SIWE signature if provided
    if (message && signature) {
      try {
        const siweMessage = new SiweMessage(message)
        const { data } = await siweMessage.verify({ signature, nonce: siweMessage.nonce })

        if (data.address.toLowerCase() !== walletAddress.toLowerCase()) {
          return NextResponse.json(
            { error: 'Signature verification failed: Address mismatch' },
            { status: 400 }
          )
        }
      } catch (error: any) {
        return NextResponse.json(
          { error: 'Invalid signature: ' + error.message },
          { status: 400 }
        )
      }
    }

    // Check if wallet is already linked to another user
    const { prisma } = await import('@/lib/prisma')
    const existingUserWithWallet = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() }
    })

    if (existingUserWithWallet && existingUserWithWallet.id !== session.user.id) {
      return NextResponse.json(
        { error: 'Wallet already linked to another account' },
        { status: 409 }
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

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { prisma } = await import('@/lib/prisma')
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { walletAddress: null },
      select: {
        id: true,
        name: true,
        email: true,
        walletAddress: true,
        role: true,
        emailVerified: true,
        image: true,
      },
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error: any) {
    console.error('Error unlinking wallet:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to unlink wallet' },
      { status: 500 }
    )
  }
}

