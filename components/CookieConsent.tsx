'use client';

import { getConsent, setConsent, type ConsentValue } from '@/lib/consent';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * ClubBeans Çerez Onay Bandı
 *
 * Anti-platform manifestomuza uygun:
 * - Sade dil, baskısız.
 * - Reddetme reddedilebilir bir buton (gri değil).
 * - Kabul edilmezse hiçbir tracking çalışmaz.
 * - Kabul edildikten sonra footer'dan değiştirilebilir.
 *
 * @governing_law clubbeans-privacy-v1
 */
export default function CookieConsent() {
  const [consent, setConsentState] = useState<ConsentValue>('unset');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setConsentState(getConsent());

    function handleConsentChange(e: Event) {
      const detail = (e as CustomEvent<ConsentValue>).detail;
      setConsentState(detail);
    }
    window.addEventListener('clubbeans:consent', handleConsentChange);
    return () =>
      window.removeEventListener('clubbeans:consent', handleConsentChange);
  }, []);

  // SSR sırasında hiçbir şey gösterme — hydration mismatch önle
  if (!mounted) return null;

  // Pixel ID konfigüre edilmemişse banner'a gerek yok — hiçbir tracker yok
  if (!process.env.NEXT_PUBLIC_FB_PIXEL_ID) return null;

  // Kullanıcı zaten karar verdiyse banner gösterme
  if (consent !== 'unset') return null;

  function handleAccept() {
    setConsent('granted');
  }

  function handleDecline() {
    setConsent('denied');
  }

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-2xl rounded-2xl border border-border bg-elevated/95 p-5 shadow-2xl backdrop-blur-md md:bottom-6 md:p-6"
      role="dialog"
      aria-labelledby="consent-title"
      aria-describedby="consent-desc"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-acid" />
        <h2
          id="consent-title"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-acid"
        >
          Çerez tercihi
        </h2>
      </div>

      <p
        id="consent-desc"
        className="mb-4 text-sm leading-relaxed text-zinc-300"
      >
        ClubBeans bir anti-platform — kullanıcı verisi satmıyor, davranış
        analitiği üzerine kurulmuyor. Yine de lansman dönemindeki reklamlarımızın
        ulaştığı kişileri ölçebilmek için <strong>Meta Pikseli</strong>{' '}
        kullanmak istiyoruz. Yalnızca onayın varsa çalışır, istediğinde geri
        alabilirsin.
      </p>

      <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center md:justify-end md:gap-3">
        <button
          type="button"
          onClick={handleDecline}
          className="rounded-full border border-white/15 bg-transparent px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-white/30 hover:text-white"
        >
          Hayır, gerek yok
        </button>
        <button
          type="button"
          onClick={handleAccept}
          className="rounded-full bg-acid px-5 py-2.5 text-sm font-semibold text-midnight transition hover:bg-acid-400"
        >
          Tamam, izin veriyorum
        </button>
      </div>

      <p className="mt-3 text-[11px] text-zinc-500">
        Detaylar için{' '}
        <Link
          href="/privacy"
          className="text-zinc-400 underline-offset-2 hover:text-acid hover:underline"
        >
          Gizlilik Politikası
        </Link>
        .
      </p>
    </div>
  );
}
