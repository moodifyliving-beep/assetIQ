// app/api/portfolio/royalties/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const walletAddress = searchParams.get('walletAddress')

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() }
    })

    if (!user) {
      // Return empty data for last 6 months
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
      return NextResponse.json(
        months.map(month => ({ month, amount: 0 }))
      )
    }

    // Get royalty payments grouped by month for the last 6 months
    const now = new Date()
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const data: { month: string; amount: number }[] = []

    // Get royalties from properties owned by user
    const royalties = await prisma.royaltyPayment.findMany({
      where: {
        property: {
          ownerId: user.id
        },
        createdAt: {
          gte: new Date(now.getFullYear(), now.getMonth() - 5, 1)
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    }).catch(() => [])

    // Group by month
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = monthNames[monthDate.getMonth()]
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
      
      const monthRoyalties = royalties.filter(
        royalty => {
          const royaltyDate = new Date(royalty.createdAt)
          return royaltyDate >= monthDate && royaltyDate < nextMonth
        }
      )

      const monthAmount = monthRoyalties.reduce((sum, royalty) => sum + royalty.amount, 0)
      
      data.push({
        month: monthName,
        amount: Math.round(monthAmount)
      })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching royalty income:', error)
    // If RoyaltyPayment model doesn't exist, return empty data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    return NextResponse.json(
      months.map(month => ({ month, amount: 0 }))
    )
  }
}

