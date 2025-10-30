export function generateImageKey(userId: string, filename: string): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(7);
  const extension = filename.split('.').pop() || 'jpg';
  return `posts/${userId}/${timestamp}-${randomStr}.${extension}`;
}

export function generateThumbnailKey(originalKey: string): string {
  return originalKey.replace(/(\.[^.]+)$/, '-thumb$1');
}
