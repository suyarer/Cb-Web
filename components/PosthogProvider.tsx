'use client';

import { useEffect } from 'react';
import { initPostHog, syncPostHogConsent } from '@/lib/posthog';

/**
 * PostHog session recording + analytics provider.
 * Sayfa mount'ta init, consent change'lerine reaktif.
 *
 * Conversion %0.07 root cause araştırması için kritik.
 * Session recordings ile gerçek user behavior izlenir.
 */
export default function PosthogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // İlk mount'ta init
    initPostHog();

    // Consent değişikliğinde opt-in/opt-out
    const handler = () => syncPostHogConsent();
    window.addEventListener('clubbeans:consent', handler);

    return () => {
      window.removeEventListener('clubbeans:consent', handler);
    };
  }, []);

  return <>{children}</>;
}
