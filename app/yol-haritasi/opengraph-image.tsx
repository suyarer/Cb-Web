import { createOgImage, ogContentType, ogSize } from '@/lib/ogImage';

export const runtime = 'edge';
export const alt = 'ClubBeans — Açık takvim, ne zaman nerede.';
export const size = ogSize;
export const contentType = ogContentType;

export default async function OG() {
  return createOgImage({
    kicker: 'Yol haritası',
    title: 'Açık takvim —\nne zaman, nerede?',
    subtitle: '2026 Q2 lansman. Önce İstanbul, sonra 3 şehir.',
  });
}
