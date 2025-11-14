// app/api/investments/[id]/mint-nft/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { tokenId, metadataUri } = body

    const investment = await prisma.investment.findUnique({
      where: { id: params.id },
      include: { property: true, user: true }
    })

    if (!investment) {
      return NextResponse.json(
        { error: 'Investment not found' },
        { status: 404 }
      )
    }

    if (investment.paymentStatus !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      )
    }

    // Update investment with NFT data
    const updatedInvestment = await prisma.investment.update({
      where: { id: params.id },
      data: {
        nftTokenId: tokenId,
        nftMetadataUri: metadataUri,
        nftMinted: true,
      }
    })

    // Create NFT metadata record
    await prisma.nFTMetadata.create({
      data: {
        tokenId,
        name: `${investment.property.title} - Share Certificate`,
        description: `Ownership certificate for ${investment.shares} shares of ${investment.property.title}`,
        image: investment.property.images[0] || '',
        attributes: {
          propertyTitle: investment.property.title,
          location: investment.property.location,
          shares: investment.shares,
          investmentAmount: investment.investmentAmount,
          investmentDate: investment.createdAt,
        },
        propertyId: investment.propertyId,
        ownerId: investment.userId,
      }
    })

    // Create activity log
    await prisma.propertyActivityLog.create({
      data: {
        propertyId: investment.propertyId,
        action: 'NFT_MINTED',
        description: `NFT ownership certificate minted for ${investment.shares} shares`,
        performedBy: investment.user.walletAddress,
        metadata: {
          tokenId,
          investmentId: investment.id
        }
      }
    })

    return NextResponse.json({ success: true, investment: updatedInvestment })
  } catch (error) {
    console.error('Error minting NFT:', error)
    return NextResponse.json(
      { error: 'Failed to mint NFT' },
      { status: 500 }
    )
  }
}