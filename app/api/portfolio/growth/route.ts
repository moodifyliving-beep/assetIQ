// app/api/portfolio/growth/route.ts
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
      where: { walletAddress: walletAddress.toLowerCase() },
      include: {
        investments: {
          include: {
            property: true
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    if (!user || user.investments.length === 0) {
      // Return empty data for last 6 months
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
      return NextResponse.json(
        months.map(month => ({ month, value: 0 }))
      )
    }

    // Get investments grouped by month for the last 6 months
    const now = new Date()
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const data: { month: string; value: number }[] = []

    // Calculate cumulative portfolio value for each of the last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = monthNames[monthDate.getMonth()]
      
      // Calculate portfolio value up to this month
      const investmentsUpToMonth = user.investments.filter(
        inv => new Date(inv.createdAt) <= new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0)
      )

      const monthValue = investmentsUpToMonth.reduce((sum, inv) => {
        const propertyValue = inv.property.assetValue
        const totalShares = inv.property.totalShares
        const userShares = inv.shares
        const shareValue = (propertyValue / totalShares) * userShares
        return sum + shareValue
      }, 0)

      data.push({
        month: monthName,
        value: Math.round(monthValue)
      })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching portfolio growth:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch portfolio growth' },
      { status: 500 }
    )
  }
}

