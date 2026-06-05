/**
 * @file /bean/[id]/opengraph-image
 * @governing_law PLATFORM_ANAYASASI
 *
 * OG image generation (1200x630) for bean share link preview.
 * Uses reusable createOgImage from lib/ogImage.tsx.
 *
 * Sprint: share-2-alpha-web Commit 7
 */

import { fetchBeanPublic } from '@/lib/supabase/bean';
import { createOgImage, ogContentType, ogSize } from '@/lib/ogImage';

export const runtime = 'edge';
export const size = ogSize;
export const contentType = ogContentType;
export const alt = 'ClubBeans etkinlik';

export default async function Image({
  params,
}: {
  params: { id: string };
}) {
  const bean = await fetchBeanPublic(params.id);

  return createOgImage({
    kicker: 'Etkinlik',
    title: bean?.title ?? 'Etkinlik bulunamadı',
    subtitle: bean?.venue_name ?? undefined,
  });
}
