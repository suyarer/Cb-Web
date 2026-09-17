import { createOgImage, ogContentType, ogSize } from '@/lib/ogImage';

export const runtime = 'edge';
export const alt = 'ClubBeans uygulamasını indir — App Store ve Google Play, ücretsiz.';
export const size = ogSize;
export const contentType = ogContentType;

export default async function OG() {
  return createOgImage({
    kicker: 'İndir · Ücretsiz',
    title: "ClubBeans'i telefonuna indir.",
    subtitle: 'App Store · Google Play · clubbeans.com/indir',
  });
}
