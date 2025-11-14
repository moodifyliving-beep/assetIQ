// app/api/portfolio/stats/route.ts
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

    // Normalize wallet address
    const normalizedAddress = walletAddress.toLowerCase()
    
    // Find user - try both normalized and original address in case of data inconsistency
    let user = await prisma.user.findUnique({
      where: { walletAddress: normalizedAddress },
      include: {
        investments: {
          include: {
            property: true
          }
        },
        properties: true // Get all properties, not just approved ones
      }
    })

    // If not found with normalized address, try original (for backward compatibility)
    if (!user) {
      user = await prisma.user.findUnique({
        where: { walletAddress: walletAddress },
        include: {
          investments: {
            include: {
              property: true
            }
          },
          properties: true
        }
      })
    }

    if (!user) {
      console.log(`[Portfolio Stats] User not found for wallet: ${walletAddress} (normalized: ${normalizedAddress})`)
      return NextResponse.json({
        portfolioValue: '$0',
        propertiesOwned: '0',
        totalROI: '0%',
        royaltyEarnings: '$0',
        totalInvested: 0,
        currentValue: 0,
        totalEarned: 0
      })
    }

    console.log(`[Portfolio Stats] Found user: ${user.id}, Properties: ${user.properties.length}, Investments: ${user.investments.length}`)

    // Filter to only completed investments for calculations
    const completedInvestments = (user.investments || []).filter(
      inv => inv.paymentStatus === 'COMPLETED'
    )

    // Calculate portfolio value from investments (properties user has invested in)
    const totalInvested = completedInvestments.reduce((sum, inv) => {
      return sum + (inv.investmentAmount || 0)
    }, 0)
    
    // Calculate current value based on property value and share ownership
    const investmentValue = completedInvestments.reduce((sum, inv) => {
      if (!inv.property || !inv.property.assetValue || !inv.property.totalShares || inv.property.totalShares === 0) {
        return sum
      }
      const propertyValue = inv.property.assetValue
      const totalShares = inv.property.totalShares
      const userShares = inv.shares || 0
      const shareValue = (propertyValue / totalShares) * userShares
      return sum + shareValue
    }, 0)

    // Calculate value from properties owned (full property value for properties user owns)
    const ownedPropertiesValue = (user.properties || []).reduce((sum, property) => {
      // Only count approved/tokenized/funded properties in portfolio value
      if (['APPROVED', 'TOKENIZED', 'FUNDED'].includes(property.status) && property.assetValue) {
        return sum + property.assetValue
      }
      return sum
    }, 0)

    // Total portfolio value = investment value + owned properties value
    const currentValue = investmentValue + ownedPropertiesValue

    // Calculate ROI based on investments only (not owned properties)
    const totalROI = totalInvested > 0 
      ? ((investmentValue - totalInvested) / totalInvested) * 100 
      : 0

    // Count unique properties from completed investments (properties user has invested in)
    const uniqueInvestedProperties = new Set(
      completedInvestments
        .filter(inv => inv.property) // Only count investments with valid properties
        .map(inv => inv.propertyId)
    )
    
    // Properties owned = properties user created + properties user has invested in
    const propertiesCreated = (user.properties || []).length
    const propertiesInvestedIn = uniqueInvestedProperties.size
    
    // Total properties owned (created + invested in, avoiding duplicates)
    // Note: A user could both create and invest in the same property, so we use Set to deduplicate
    const allPropertyIds = new Set([
      ...(user.properties || []).map(p => p.id),
      ...Array.from(uniqueInvestedProperties)
    ])
    const propertiesOwned = allPropertyIds.size
    
    console.log(`[Portfolio Stats] Properties created: ${propertiesCreated}, Properties invested in: ${propertiesInvestedIn}, Total unique: ${propertiesOwned}`)

    // Calculate royalty earnings (sum of all royalties from user's properties)
    let royaltyAmount = 0
    try {
      const royaltyEarnings = await prisma.royaltyPayment.aggregate({
        where: {
          property: {
            ownerId: user.id
          }
        },
        _sum: {
          amount: true
        }
      })
      // Handle null case from Prisma aggregate
      royaltyAmount = royaltyEarnings._sum.amount ?? 0
    } catch (error: any) {
      // RoyaltyPayment model might not exist in database yet
      console.log('[Portfolio Stats] RoyaltyPayment model not available:', error.message)
      royaltyAmount = 0
    }

    const response = {
      portfolioValue: `$${currentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      propertiesOwned: propertiesOwned.toString(),
      totalROI: `${totalROI.toFixed(1)}%`,
      royaltyEarnings: `$${royaltyAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      totalInvested,
      currentValue,
      totalEarned: royaltyAmount
    }

    console.log(`[Portfolio Stats] Response:`, {
      propertiesOwned: response.propertiesOwned,
      portfolioValue: response.portfolioValue,
      totalROI: response.totalROI,
      investmentValue: investmentValue || 0,
      ownedPropertiesValue: ownedPropertiesValue || 0,
      totalInvested: totalInvested || 0
    })

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('[Portfolio Stats] Error:', error)
    console.error('[Portfolio Stats] Error stack:', error.stack)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch portfolio stats',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

