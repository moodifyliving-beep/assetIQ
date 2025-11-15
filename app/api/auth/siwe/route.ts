// app/api/auth/siwe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { SiweMessage } from 'siwe'
import { prisma } from '@/lib/prisma'
import { getOrCreateUserByWallet } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Generate SIWE message
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const address = searchParams.get('address')
    
    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    const domain = process.env.NEXT_PUBLIC_APP_URL?.replace(/https?:\/\//, "").split(":")[0] || "localhost"
    const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    
    const message = new SiweMessage({
      domain,
      address,
      statement: 'Sign in to Assets IQ',
      uri: origin,
      version: '1',
      chainId: 1, // Mainnet - you can make this dynamic
      nonce: Math.random().toString(36).substring(2, 15),
    })

    const messageToSign = message.prepareMessage()

    return NextResponse.json({ 
      message: messageToSign,
      nonce: message.nonce 
    })
  } catch (error: any) {
    console.error('Error generating SIWE message:', error)
    return NextResponse.json(
      { error: 'Failed to generate message' },
      { status: 500 }
    )
  }
}

// Verify SIWE signature and create session
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message, signature, address } = body

    if (!message || !signature || !address) {
      return NextResponse.json(
        { error: 'Message, signature, and address are required' },
        { status: 400 }
      )
    }

    // Verify the SIWE message
    const siweMessage = new SiweMessage(message)
    const fields = await siweMessage.validate(signature)

    if (fields.address.toLowerCase() !== address.toLowerCase()) {
      return NextResponse.json(
        { error: 'Address mismatch' },
        { status: 400 }
      )
    }

    // Get or create user by wallet address
    let user = await getOrCreateUserByWallet(address)

    // Create a session token manually since Better Auth doesn't natively support wallet auth
    // We'll create a session in the database
    const sessionToken = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

    // Create session in database
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token: sessionToken,
        expiresAt,
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
        userAgent: req.headers.get('user-agent') || undefined,
      },
      include: {
        user: true,
      },
    })

    // Set session cookie
    const response = NextResponse.json({ 
      success: true,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        email: user.email,
        name: user.name,
      }
    })

    // Set the session cookie (Better Auth uses 'better-auth.session_token' as the cookie name)
    response.cookies.set('better-auth.session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    })

    return response
  } catch (error: any) {
    console.error('Error verifying SIWE:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to verify signature' },
      { status: 500 }
    )
  }
}

