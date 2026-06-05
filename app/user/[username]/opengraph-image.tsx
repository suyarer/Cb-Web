/**
 * @file /user/[username]/opengraph-image
 * @governing_law PLATFORM_ANAYASASI
 *
 * Sprint: share-2-alpha-web Commit 9
 */

import { fetchUserPublic } from '@/lib/supabase/user';
import { createOgImage, ogContentType, ogSize } from '@/lib/ogImage';

export const runtime = 'edge';
export const size = ogSize;
export const contentType = ogContentType;
export const alt = 'ClubBeans Bean profili';

export default async function Image({
  params,
}: {
  params: { username: string };
}) {
  const user = await fetchUserPublic(params.username);

  return createOgImage({
    kicker: 'Bean',
    title: user ? `@${user.username}` : 'Bean bulunamadı',
    subtitle: user?.bio ?? undefined,
  });
}
