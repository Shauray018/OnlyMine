// app/api/posts/[id]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST: Add a comment to a post
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { walletAddress, content } = await request.json();
    const postId = params.id;

    if (!walletAddress || !content) {
      return NextResponse.json(
        { error: 'Wallet address and content are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        userId: user.id,
        postId,
        content,
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
      },
    });

    return NextResponse.json({ success: true, comment });
  } catch (error: any) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add comment' },
      { status: 500 }
    );
  }
}

// GET: Fetch all comments for a post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const comments = await prisma.comment.findMany({
      where: { postId },
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
      take: limit,
      skip: offset,
    });

    return NextResponse.json({ comments });
  } catch (error: any) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}