// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST: Create a new post
export async function POST(request: NextRequest) {
  try {
    const { walletAddress, nftId, caption } = await request.json();

    if (!walletAddress || !nftId) {
      return NextResponse.json(
        { error: 'Wallet address and NFT ID are required' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify NFT exists and is owned by user
    const nft = await prisma.nFT.findUnique({
      where: { id: nftId },
    });

    if (!nft) {
      return NextResponse.json(
        { error: 'NFT not found' },
        { status: 404 }
      );
    }

    if (nft.ownerId !== user.id) {
      return NextResponse.json(
        { error: 'You do not own this NFT' },
        { status: 403 }
      );
    }

    // Create post
    const post = await prisma.post.create({
      data: {
        userId: user.id,
        nftId,
        caption: caption || '',
      },
      include: {
        user: {
          select: {
            walletAddress: true,
            username: true,
            displayName: true,
            profileImage: true,
          },
        },
        nft: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create post' },
      { status: 500 }
    );
  }
}

// GET: Fetch posts (feed)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const walletAddress = searchParams.get('wallet');

    let whereClause = {};

    // Filter by user if wallet provided
    if (walletAddress) {
      const user = await prisma.user.findUnique({
        where: { walletAddress },
      });

      if (user) {
        whereClause = { userId: user.id };
      } else {
        return NextResponse.json({ posts: [] });
      }
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            walletAddress: true,
            username: true,
            displayName: true,
            profileImage: true,
          },
        },
        nft: true,
        likes: {
          select: {
            userId: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                walletAddress: true,
                username: true,
                displayName: true,
                profileImage: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({ posts });
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}