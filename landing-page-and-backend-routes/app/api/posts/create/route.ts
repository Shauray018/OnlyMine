// app/api/posts/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateTrendingScore } from '@/lib/feed-algorithm';

export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      imageUrl,
      caption,
      location,
      aspectRatio,
    } = await request.json();

    if (!userId || !imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create post with initial trending score
    const post = await prisma.post.create({
      data: {
        userId,
        imageUrl,
        caption: caption || null,
        location: location || null,
        aspectRatio: aspectRatio || 1.0,
        trendingScore: calculateTrendingScore(0, 0, new Date()),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            walletAddress: true,
          },
        },
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Post creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}