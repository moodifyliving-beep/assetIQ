// app/api/properties/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        documents: true,
        owner: true,
        investments: {
          include: {
            user: true
          }
        }
      }
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { walletAddress, ...updateData } = body
    
    // First, get the property to verify ownership
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        owner: true,
        _count: {
          select: { investments: true }
        }
      }
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (!walletAddress || property.owner.walletAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return NextResponse.json(
        { error: 'Unauthorized: You do not own this property' },
        { status: 403 }
      )
    }

    // Check if property has investments and is approved - restrict certain edits
    const hasInvestments = property._count.investments > 0
    const isApproved = ['APPROVED', 'TOKENIZED', 'FUNDED'].includes(property.status)
    
    if (hasInvestments && isApproved) {
      // Don't allow changes to assetValue or totalShares if property has investments
      if (updateData.assetValue !== undefined && updateData.assetValue !== property.assetValue) {
        return NextResponse.json(
          { error: 'Cannot change asset value for properties with active investments' },
          { status: 400 }
        )
      }
      if (updateData.totalShares !== undefined && updateData.totalShares !== property.totalShares) {
        return NextResponse.json(
          { error: 'Cannot change total shares for properties with active investments' },
          { status: 400 }
        )
      }
    }

    // Handle documents update - delete old documents and create new ones
    if (updateData.documents) {
      // Delete existing documents
      await prisma.document.deleteMany({
        where: { propertyId: id }
      })

      // Create new documents
      const documentsToCreate = updateData.documents.map((doc: any) => ({
        type: doc.type,
        name: doc.name,
        url: doc.url,
        verified: false
      }))

      // Remove documents from updateData and handle separately
      const { documents, ...restUpdateData } = updateData
      
      const updatedProperty = await prisma.property.update({
        where: { id },
        data: {
          ...restUpdateData,
          documents: {
            create: documentsToCreate
          }
        },
        include: {
          documents: true,
          owner: true
        }
      })

      return NextResponse.json(updatedProperty)
    }

    // Update property without documents
    const updatedProperty = await prisma.property.update({
      where: { id },
      data: updateData,
      include: {
        documents: true,
        owner: true
      }
    })

    return NextResponse.json(updatedProperty)
  } catch (error) {
    console.error('Error updating property:', error)
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.property.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    )
  }
}