'use client';

import { getConsent, type ConsentValue } from '@/lib/consent';
import Script from 'next/script';
import { useEffect, useState } from 'react';

/**
 * Meta Pikseli — yalnızca açık onayla yüklenir.
 *
 * Onay verilmediği sürece <Script> hiç DOM'a girmez,
 * dolayısıyla hiçbir tracking pikseli ateşlenmez.
 *
 * @governing_law clubbeans-privacy-v1
 */
export default function MetaPixel() {
  const [consent, setConsentState] = useState<ConsentValue>('unset');
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

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

  // Pixel ID ortam değişkeni yoksa hiç render etme (build-time guard)
  if (!pixelId) return null;

  // Onay verilmediği sürece hiç render etme
  if (consent !== 'granted') return null;

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
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
