import { createOgImage, ogContentType, ogSize } from '@/lib/ogImage';

export const runtime = 'edge';
export const alt = 'ClubBeans Manifesto — Bir uygulama değil, anti-platform.';
export const size = ogSize;
export const contentType = ogContentType;

export default async function OG() {
  return createOgImage({
    kicker: 'Manifesto',
    title: 'Bir uygulama değil,\nbir anti-platform.',
    subtitle: 'Dikkat ekonomisine, Sosyal Obezite\'ye karşı dalgakıran.',
  });
}
