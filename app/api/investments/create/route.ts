// app/api/investments/create/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { 
      propertyId, 
      shares, 
      walletAddress, 
      paymentMethod 
    } = body

    // Validate required fields
    if (!propertyId || !shares || !walletAddress || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate shares is a positive number
    if (shares <= 0 || !Number.isInteger(shares)) {
      return NextResponse.json(
        { error: 'Invalid number of shares' },
        { status: 400 }
      )
    }

    // Validate payment method
    const validPaymentMethods = ['CRYPTO_ETH', 'CRYPTO_USDC', 'CRYPTO_USDT', 'STRIPE_CARD', 'STRIPE_BANK']
    if (!validPaymentMethods.includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      )
    }

    // Normalize wallet address
    const normalizedWalletAddress = walletAddress.toLowerCase()

    // Validate property and shares availability
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: { owner: true }
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    if (property.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Property is not available for investment' },
        { status: 400 }
      )
    }

    if (property.availableShares < shares) {
      return NextResponse.json(
        { error: 'Not enough shares available' },
        { status: 400 }
      )
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { walletAddress: normalizedWalletAddress }
    })

    if (!user) {
      user = await prisma.user.create({
        data: { walletAddress: normalizedWalletAddress }
      })
    }

    const investmentAmount = shares * property.pricePerShare

    // Check if Stripe payment method
    const isStripePayment = paymentMethod === 'STRIPE_CARD' || paymentMethod === 'STRIPE_BANK'

    // Create investment record with proper enum typing
    const investment = await prisma.investment.create({
      data: {
        shares,
        investmentAmount,
        paymentMethod: paymentMethod as 'CRYPTO_ETH' | 'CRYPTO_USDC' | 'CRYPTO_USDT' | 'STRIPE_CARD' | 'STRIPE_BANK',
        paymentStatus: 'PENDING',
        userId: user.id,
        propertyId: property.id,
      }
    })

    // If Stripe payment, create payment intent
    if (isStripePayment) {
      try {
        // Check if Stripe is configured
        if (!process.env.STRIPE_SECRET_KEY) {
          // Delete investment if Stripe is not configured
          await prisma.investment.delete({
            where: { id: investment.id }
          })
          return NextResponse.json(
            { error: 'Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.' },
            { status: 500 }
          )
        }

        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(investmentAmount * 100), // Convert to cents
          currency: 'usd',
          metadata: {
            investmentId: investment.id,
            propertyId: property.id,
            shares: shares.toString(),
            walletAddress: normalizedWalletAddress,
          },
        })

        await prisma.investment.update({
          where: { id: investment.id },
          data: { stripePaymentId: paymentIntent.id }
        })

        return NextResponse.json({
          investmentId: investment.id,
          clientSecret: paymentIntent.client_secret,
          amount: investmentAmount,
          paymentMethod: 'stripe',
          shares
        })
      } catch (stripeError: any) {
        console.error('Stripe error:', stripeError)
        // Delete investment if Stripe fails
        await prisma.investment.delete({
          where: { id: investment.id }
        })
        return NextResponse.json(
          { error: 'Failed to create payment intent: ' + (stripeError.message || 'Unknown error') },
          { status: 500 }
        )
      }
    }

    // For crypto payments, return investment details
    // Note: availableShares will be updated when payment is confirmed
    return NextResponse.json({
      investmentId: investment.id,
      amount: investmentAmount,
      propertyOwner: property.owner.walletAddress,
      paymentMethod: 'crypto',
      shares
    })

  } catch (error: any) {
    console.error('Error creating investment:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create investment' },
      { status: 500 }
    )
  }
}

