import { createOgImage, ogContentType, ogSize } from '@/lib/ogImage';

export const runtime = 'edge';
export const alt = 'ClubBeans — Ürünü içeriden gör.';
export const size = ogSize;
export const contentType = ogContentType;

export default async function OG() {
  return createOgImage({
    kicker: 'Ürün',
    title: 'ClubBeans\'i içeriden gör.',
    subtitle: 'Radar · TrustScore · Compass Mode · Signal',
  });
}
