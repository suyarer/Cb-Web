/**
 * @route /hazir (layout)
 * @governing_law GUVENLIK_ANAYASASI, KVKK_ANAYASASI, KIMLIK_ANAYASASI
 * @sprint CB2026 hazir-hesap-giris-baglantisi-2026-10-06
 *
 * Hazır hesap giriş bağlantısının sayfası. Bağlantı `#k=<anahtar>` taşır (hash: sunucuya, Vercel günlüğüne,
 * Referer'e gitmez). Satır içi betik HTML ayrıştırılırken — React/analitikten ÖNCE — anahtarı belleğe alır
 * ve adres çubuğunu temizler (`lib/hazirGiris.ts` temizlemeBetigi). Arama motoruna kapalı, canonical yok;
 * önizleme (OG) yalnız "hesabın hazır" der — anahtar önizleme isteğine hiç ulaşmaz.
 */
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { temizlemeBetigi } from '@/lib/hazirGiris';

const BASLIK = 'ClubBeans hesabın hazır';
const ACIKLAMA = 'Telefonundan aç, tek dokunuşla hesabına gir.';

export const metadata: Metadata = {
  title: `${BASLIK} 🎉`,
  description: ACIKLAMA,
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: 'no-referrer',
  openGraph: { title: BASLIK, description: ACIKLAMA, siteName: 'ClubBeans', locale: 'tr_TR', type: 'website' },
  twitter: { card: 'summary_large_image', title: BASLIK, description: ACIKLAMA },
};

export default function HazirLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* sabit, sunucuda üretilen betik — kullanıcı girdisi taşımaz */}
      <script dangerouslySetInnerHTML={{ __html: temizlemeBetigi() }} />
      {children}
    </>
  );
}
