// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object
    const investmentId = paymentIntent.metadata.investmentId

    if (investmentId) {
      const investment = await prisma.investment.findUnique({
        where: { id: investmentId },
        include: { property: true }
      })

      if (investment) {
        await prisma.investment.update({
          where: { id: investmentId },
          data: {
            paymentStatus: 'COMPLETED',
            transactionHash: paymentIntent.id,
          }
        })

        await prisma.property.update({
          where: { id: investment.propertyId },
          data: {
            availableShares: {
              decrement: investment.shares
            }
          }
        })
      }
    }
  }

  return NextResponse.json({ received: true })
}