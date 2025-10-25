// app/api/nfts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST: Save minted NFT to database
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      walletAddress, 
      mintAddress, 
      metadataUri, 
      imageUrl, 
      name,
      description,
      attributes 
    } = body;

    // Validation
    if (!walletAddress || !mintAddress || !metadataUri || !imageUrl || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress,
          username: `user_${walletAddress.slice(0, 6)}`,
        },
      });
    }

    // Check if NFT already exists
    const existingNFT = await prisma.nFT.findUnique({
      where: { mintAddress },
    });

    if (existingNFT) {
      return NextResponse.json(
        { error: 'NFT already exists', nft: existingNFT },
        { status: 409 }
      );
    }

    // Create NFT record
    const nft = await prisma.nFT.create({
      data: {
        mintAddress,
        metadataUri,
        imageUrl,
        name,
        description,
        attributes: attributes || null,
        ownerId: user.id,
      },
      include: {
        owner: {
          select: {
            walletAddress: true,
            username: true,
            displayName: true,
            profileImage: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      nft,
    });
  } catch (error: any) {
    console.error('Error saving NFT:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save NFT' },
      { status: 500 }
    );
  }
}

// GET: Fetch NFTs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('wallet');
    const mintAddress = searchParams.get('mint');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get specific NFT by mint address
    if (mintAddress) {
      const nft = await prisma.nFT.findUnique({
        where: { mintAddress },
        include: {
          owner: {
            select: {
              walletAddress: true,
              username: true,
              displayName: true,
              profileImage: true,
            },
          },
          posts: {
            include: {
              _count: {
                select: {
                  likes: true,
                  comments: true,
                },
              },
            },
          },
        },
      });

      if (!nft) {
        return NextResponse.json(
          { error: 'NFT not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ nft });
    }

    // Get NFTs by wallet
    if (walletAddress) {
      const user = await prisma.user.findUnique({
        where: { walletAddress },
      });

      if (!user) {
        return NextResponse.json({ nfts: [] });
      }

      const nfts = await prisma.nFT.findMany({
        where: { ownerId: user.id },
        include: {
          owner: {
            select: {
              walletAddress: true,
              username: true,
              displayName: true,
              profileImage: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      });

      return NextResponse.json({ nfts });
    }

    // Get all NFTs
    const nfts = await prisma.nFT.findMany({
      include: {
        owner: {
          select: {
            walletAddress: true,
            username: true,
            displayName: true,
            profileImage: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({ nfts });
  } catch (error: any) {
    console.error('Error fetching NFTs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch NFTs' },
      { status: 500 }
    );
  }
}