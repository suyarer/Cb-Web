/**
 * @file /club/[id]/opengraph-image
 * @governing_law PLATFORM_ANAYASASI
 *
 * Sprint: share-2-alpha-web Commit 8
 */

import { fetchClubPublic } from '@/lib/supabase/club';
import { createOgImage, ogContentType, ogSize } from '@/lib/ogImage';

export const runtime = 'edge';
export const size = ogSize;
export const contentType = ogContentType;
export const alt = 'ClubBeans kulüp';

export default async function Image({
  params,
}: {
  params: { id: string };
}) {
  const club = await fetchClubPublic(params.id);

  return createOgImage({
    kicker: 'Kulüp',
    title: club?.name ?? 'Kulüp bulunamadı',
    subtitle:
      club?.member_count !== null && club?.member_count !== undefined
        ? `${club.member_count.toLocaleString('tr-TR')} üye`
        : undefined,
  });
}
