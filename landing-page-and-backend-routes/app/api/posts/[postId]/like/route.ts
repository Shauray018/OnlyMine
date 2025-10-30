import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { userId } = await request.json();
    const { postId } = params;

    await prisma.$transaction([
      prisma.like.create({
        data: { userId, postId },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json({ liked: true });
  } catch (error) {
    console.error('Like error:', error);
    return NextResponse.json(
      { error: 'Failed to process like' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { userId } = await request.json();
    const { postId } = params;

    await prisma.$transaction([
      prisma.like.delete({
        where: {
          userId_postId: { userId, postId },
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { likesCount: { decrement: 1 } },
      }),
    ]);

    return NextResponse.json({ liked: false });
  } catch (error) {
    console.error('Unlike error:', error);
    return NextResponse.json(
      { error: 'Failed to process unlike' },
      { status: 500 }
    );
  }
}