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
      <p
        id="consent-desc"
        className="mb-4 text-sm leading-relaxed text-zinc-200"
      >
        Reklam ölçümü için Meta Pikseli kullanıyoruz. İzin verir misin?
        <Link
          href="/privacy"
          className="ml-1 text-zinc-500 underline-offset-2 hover:text-acid hover:underline"
        >
          Detay
        </Link>
      </p>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={handleDecline}
          className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-white/30 hover:text-white"
        >
          Hayır
        </button>
        <button
          type="button"
          onClick={handleAccept}
          className="rounded-full bg-acid px-4 py-2 text-sm font-semibold text-midnight transition hover:bg-acid-400"
        >
          İzin ver
        </button>
      </div>

      <h2 id="consent-title" className="sr-only">Çerez tercihi</h2>
    </div>
  );
}
