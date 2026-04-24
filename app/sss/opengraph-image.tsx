import { createOgImage, ogContentType, ogSize } from '@/lib/ogImage';

export const runtime = 'edge';
export const alt = 'ClubBeans — Aklındakini sor.';
export const size = ogSize;
export const contentType = ogContentType;

export default async function OG() {
  return createOgImage({
    kicker: 'SSS',
    title: 'Aklındakini sor.\nBahaneye yer yok.',
    subtitle: 'ClubBeans sözlüğü + 6 net cevap.',
  });
}
