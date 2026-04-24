import { createOgImage, ogContentType, ogSize } from '@/lib/ogImage';

export const runtime = 'edge';
export const alt = 'ClubBeans — Kendi kulübünü bir dakikada kur.';
export const size = ogSize;
export const contentType = ogContentType;

export default async function OG() {
  return createOgImage({
    kicker: 'Kulüp aç',
    title: 'Kendi kulübünü\nbir dakikada kur.',
    subtitle: 'İlk 1000 kuruculu için sıfır komisyon, kalıcı.',
  });
}
