//@ts-ignore
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function getUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
  });
  
  // Generate presigned URL (valid for 1 hour)
  const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
  
  // Public URL for accessing the image after upload
  const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
  
  return { uploadUrl, publicUrl };
}