// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST: Create or get user by wallet
export async function POST(request: NextRequest) {
  try {
    const { walletAddress, username, displayName } = await request.json();

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          walletAddress,
          username: username || `user_${walletAddress.slice(0, 6)}`,
          displayName: displayName || null,
        },
      });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Error creating/fetching user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process user' },
      { status: 500 }
    );
  }
}

// GET: Fetch user by wallet address
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('wallet');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress },
      include: {
        _count: {
          select: {
            nfts: true,
            posts: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user' },
      { status: 500 }
    );
  }
}