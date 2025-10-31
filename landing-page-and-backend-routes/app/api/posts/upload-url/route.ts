// import type { NextApiRequest, NextApiResponse } from 'next';
// import { getUploadUrl } from '@/lib/r2';
// import { generateImageKey } from '@/lib/image-utils';
// import { prisma } from '@/lib/prisma';

// export async function POST(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   const { userId, filename, contentType } = req.body;

//   if (!userId || !filename) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }

//   try {
//     // Verify user exists
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//     });

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Generate unique key for the image
//     const imageKey = generateImageKey(userId, filename);
    
//     // Get presigned upload URL
//     const { uploadUrl, publicUrl } = await getUploadUrl(
//       imageKey,
//       contentType || 'image/jpeg'
//     );

//     return res.status(200).json({
//       uploadUrl,
//       imageUrl: publicUrl,
//       imageKey,
//     });
//   } catch (error) {
//     console.error('Upload URL generation error:', error);
//     return res.status(500).json({ error: 'Failed to generate upload URL' });
//   }
// }
// app/api/posts/upload-url/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUploadUrl } from '@/lib/r2';
import { generateImageKey } from '@/lib/image-utils';
import { prisma } from '@/lib/prisma';

// ✅ Named export POST (not default export)
export async function POST(request: NextRequest) {
  try {
    const { userId, filename, contentType } = await request.json();

    if (!userId || !filename) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate unique key for the image
    const imageKey = generateImageKey(userId, filename);
    
    // Get presigned upload URL
    const { uploadUrl, publicUrl } = await getUploadUrl(
      imageKey,
      contentType || 'image/jpeg'
    );

    return NextResponse.json({
      uploadUrl,
      imageUrl: publicUrl,
      imageKey,
    });
  } catch (error) {
    console.error('Upload URL generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}