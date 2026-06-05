/**
 * @file /post/[id]/opengraph-image
 * @governing_law PLATFORM_ANAYASASI
 *
 * Sprint: share-2-alpha-web Commit 10
 */

import { fetchPostPublic } from '@/lib/supabase/post';
import { createOgImage, ogContentType, ogSize } from '@/lib/ogImage';

export const runtime = 'edge';
export const size = ogSize;
export const contentType = ogContentType;
export const alt = 'ClubBeans paylaşımı';

export default async function Image({
  params,
}: {
  params: { id: string };
}) {
  const post = await fetchPostPublic(params.id);

  return createOgImage({
    kicker: 'Post',
    title: post?.caption?.slice(0, 80) ?? 'Post bulunamadı',
    subtitle: post?.author ? `@${post.author.username}` : undefined,
  });
}
