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

  // Telefonda kenara yapışık ince şerit (2026-10-19): eski kutu (~255 px) ilk ekranda mağaza düğmelerinin
  // üstüne biniyordu — 393 reklam inişine 0 basış. Metin, iki EŞİT düğme ve rıza kuralı AYNEN; yalnız boyut/yer.
  // Masaüstü (md:) eski kutu görünümünde kalır.
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-2xl border-t border-border bg-elevated/95 px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-2xl backdrop-blur-md md:bottom-6 md:left-4 md:right-4 md:rounded-2xl md:border md:p-6"
      role="dialog"
      aria-labelledby="consent-title"
      aria-describedby="consent-desc"
    >
      <p
        id="consent-desc"
        className="mb-2 text-xs leading-snug text-zinc-300 md:mb-4 md:text-sm md:leading-relaxed md:text-zinc-200"
      >
        İzin verirsen iki ölçüm aracı çalışır: reklamlarımızın işe yarayıp yaramadığını görmek için
        Meta Pikseli, siteyi iyileştirmek için PostHog (tıklamalar ve oturum kaydı; yazdıkların
        gizlenir). Reklamdan gelmen izin sayılmaz. İzin vermezsen site aynen çalışır.
        <Link
          href="/privacy"
          className="ml-1 text-zinc-500 underline-offset-2 hover:text-acid hover:underline"
        >
          Detay
        </Link>
      </p>

      <div className="flex items-center justify-end gap-2">
        {/* KVKK Çerez Rehberi: reddetmek kabul etmek kadar kolay ve görünür olmalı → iki düğme AYNI stil */}
        <button
          type="button"
          onClick={handleDecline}
          className="rounded-full border border-white/25 min-h-[40px] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:border-white/50 md:min-h-0 md:px-4 md:py-2 md:text-sm"
        >
          Hayır
        </button>
        <button
          type="button"
          onClick={handleAccept}
          className="rounded-full border border-white/25 min-h-[40px] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:border-white/50 md:min-h-0 md:px-4 md:py-2 md:text-sm"
        >
          İzin ver
        </button>
      </div>

      <h2 id="consent-title" className="sr-only">Çerez tercihi</h2>
    </div>
  );
}
