'use client';

/**
 * @governing_law KVKK_ANAYASASI, GUVENLIK_ANAYASASI · CB2026 hazir-hesap-giris-baglantisi-2026-10-06
 *
 * Vercel Analytics + Speed Insights — izleyicisiz rotalarda (/hazir) HİÇ yüklenmez, ayrıca beforeSend o
 * rotanın olayını düşürür (istemci içi geçiş gibi beklenmedik yollara karşı ikinci kat). Kök layout bir
 * sunucu bileşeni olduğundan beforeSend işlevi ancak bu istemci sarmalayıcısında verilebilir.
 */
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { usePathname } from 'next/navigation';
import { izleyicisizMi } from '@/lib/hazirGiris';

function izleyicisizAdres(url: string): boolean {
  try {
    return izleyicisizMi(new URL(url, 'https://www.clubbeans.com').pathname);
  } catch {
    return true; // çözülemeyen adres gönderilmez
  }
}

export default function WebOlcum() {
  const pathname = usePathname();
  if (izleyicisizMi(pathname)) return null;
  return (
    <>
      <Analytics beforeSend={(e) => (izleyicisizAdres(e.url) ? null : e)} />
      <SpeedInsights beforeSend={(e) => (izleyicisizAdres(e.url) ? null : e)} />
    </>
  );
}
