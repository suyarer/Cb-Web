import type { Metadata, Viewport } from 'next';
import OyunKabuk from '@/components/game/OyunKabuk';
import Yakinda from '@/components/game/Yakinda';
import { TANIM_SATIRI } from '@/content/sosyal-obezite-feed';

/**
 * clubbeans.com/sosyal-obezite (karar 15)
 *
 * Tanım satırı metadata'da da geçer: bağlamsız paylaşımda "obeziteyle dalga
 * geçen oyun" okumasının önüne geçen tek savunma metin katmanıdır
 * (üç uzmanın 1 numaralı riski).
 */

/**
 * `viewportFit: 'cover'` OLMADAN `env(safe-area-inset-*)` DAİMA 0 döner.
 *
 * Oyun ekranın tamamını kaplıyor ve alt mesaj/HUD güvenli alana göre
 * konumlanıyor; kapak modu açılmadan bu hesaplar iPhone'da hiçbir şey
 * yapmıyordu — tur mesajı ana ekran çubuğunun altında kalıyordu.
 * Sayfa düzeyinde tanımlı: sitenin geri kalanı etkilenmez.
 */
export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'Sosyal Obezite — 60 saniye',
  description: `${TANIM_SATIRI} Kaydır, gerçek belirince yakala. Kaç tanesini kurtarabilirsin?`,
  openGraph: {
    title: 'Sosyal Obezite — 60 saniye',
    description: `${TANIM_SATIRI} Sen kaçını kurtarabilirsin?`,
    type: 'website',
    siteName: 'ClubBeans',
    locale: 'tr_TR',
    url: 'https://clubbeans.com/sosyal-obezite',
  },
  twitter: { card: 'summary_large_image', site: '@ClubBeansapp' },
};

export default function Page() {
  // Kill-switch katman 1 (yapı zamanı): Vercel env NEXT_PUBLIC_OYUN_KAPALI=1 + Redeploy.
  // Katman 2 (dağıtımsız): Redis oyun:kapali → start 503 → OyunKabuk Yakinda'ya düşer.
  const kapali = process.env.NEXT_PUBLIC_OYUN_KAPALI === '1';
  return (
    <main className="min-h-[100dvh] bg-midnight">
      {kapali ? <Yakinda /> : <OyunKabuk />}
    </main>
  );
}
