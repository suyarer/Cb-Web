'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { sadeMi } from '@/components/SiteKatmanlari';
import { initPostHog, syncPostHogConsent } from '@/lib/posthog';

/**
 * PostHog session recording + analytics provider.
 * Sayfa mount'ta init, consent change'lerine reaktif.
 *
 * Oyun rotalarında (/sosyal-obezite/*) BU örnek çalışmaz: orada çerez/kayıt
 * yok, olaylar lib/game/olay.ts'in çerezsiz 'oyun' örneğiyle gider (KVKK
 * aydınlatma metni "cihaz takibi yok" diyor; PostHog da rıza-öncesi tembel
 * yüklenir — denetim performans-3 / kvkk-3).
 */
export default function PosthogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const sade = sadeMi(pathname);
  useEffect(() => {
    if (sade) return;
    // İlk mount'ta init
    initPostHog();

    // Consent değişikliğinde opt-in/opt-out
    const handler = () => syncPostHogConsent();
    window.addEventListener('clubbeans:consent', handler);

    return () => {
      window.removeEventListener('clubbeans:consent', handler);
    };
  }, [sade]);

  return <>{children}</>;
}
