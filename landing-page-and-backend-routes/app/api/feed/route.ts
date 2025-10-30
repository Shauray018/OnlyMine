import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '20');
    const userId = searchParams.get('userId');

    const posts = await prisma.post.findMany({
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      orderBy: [
        { trendingScore: 'desc' },
        { createdAt: 'desc' },
      ],
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
        likes: userId ? {
          where: { userId },
          select: { id: true },
        } : false,
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });

    const hasMore = posts.length > limit;
    const postsToReturn = hasMore ? posts.slice(0, -1) : posts;

    return NextResponse.json({
      posts: postsToReturn.map(post => ({
        ...post,
        isLiked: userId ? (post.likes as any[])?.length > 0 : false,
        likes: undefined,
      })),
      nextCursor: hasMore ? postsToReturn[postsToReturn.length - 1].id : null,
    });
  } catch (error) {
    console.error('Feed error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feed' },
      { status: 500 }
    );
  }
}