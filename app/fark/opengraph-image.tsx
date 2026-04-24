import { createOgImage, ogContentType, ogSize } from '@/lib/ogImage';

export const runtime = 'edge';
export const alt = 'ClubBeans — Neden başka bir app değil.';
export const size = ogSize;
export const contentType = ogContentType;

export default async function OG() {
  return createOgImage({
    kicker: 'Neden farklı',
    title: 'Neden başka\nbir app değil.',
    subtitle: 'Timeleft, Meetup, Bumble BFF ile karşılaştırma.',
  });
}
