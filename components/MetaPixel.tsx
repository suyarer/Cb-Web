'use client';

import { getConsent, type ConsentValue } from '@/lib/consent';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Meta Pikseli — onay sonrası yüklenir, ardından her route değişiminde PageView fire eder.
 *
 * KRİTİK: fbq('init') tek başına EVENT GÖNDERMEZ — `fbq('track', 'PageView')` zorunlu.
 * SPA navigation'da script yeniden çalışmaz → her pathname değişiminde manuel track.
 *
 * @governing_law clubbeans-privacy-v1
 */
export default function MetaPixel() {
  const [consent, setConsentState] = useState<ConsentValue>('unset');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  const pathname = usePathname();

  // Consent state senkronizasyonu
  useEffect(() => {
    setConsentState(getConsent());

    function handleConsentChange(e: Event) {
      const detail = (e as CustomEvent<ConsentValue>).detail;
      setConsentState(detail);
    }
    window.addEventListener('clubbeans:consent', handleConsentChange);
    return () =>
      window.removeEventListener('clubbeans:consent', handleConsentChange);
  }, []);

  // SPA route değişimi → manuel PageView track
  // Bu effect script yüklendikten sonra her pathname/searchParams değişiminde tetiklenir.
  useEffect(() => {
    if (consent !== 'granted') return;
    if (!scriptLoaded) return;
    if (typeof window === 'undefined') return;
    if (typeof window.fbq !== 'function') return;

    // Route değişimi PageView — Meta SPA için tavsiye edilen pattern
    window.fbq('track', 'PageView');
  }, [pathname, consent, scriptLoaded]);

  // Pixel ID ortam değişkeni yoksa hiç render etme (build-time guard)
  if (!pixelId) return null;

  // Onay verilmediği sürece hiç render etme
  if (consent !== 'granted') return null;

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
        onReady={() => setScriptLoaded(true)}
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
