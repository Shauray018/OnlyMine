import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { calculateTrendingScore } from '@/lib/feed-algorithm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    userId,
    imageUrl,
    caption,
    location,
    aspectRatio,
  } = req.body;

  if (!userId || !imageUrl) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
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

    return res.status(201).json({ post });
  } catch (error) {
    console.error('Post creation error:', error);
    return res.status(500).json({ error: 'Failed to create post' });
  }
}
