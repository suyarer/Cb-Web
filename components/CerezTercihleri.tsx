'use client';

import { clearConsent } from '@/lib/consent';

/**
 * "Çerez tercihleri" — verilen/verilmeyen onayı sıfırlar, onay bandı yeniden açılır.
 * KVKK: onayı geri almak vermek kadar kolay olmalı (2026-09-25 öncesi yalnız "çerezleri sil" / e-posta yoluydu).
 * Pixel `fbq('consent','revoke')` ile, PostHog opt-out ile susar (MetaPixel.tsx · lib/posthog.ts).
 *
 * @governing_law clubbeans-privacy-v1
 */
export default function CerezTercihleri({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => clearConsent()} className={className}>
      Çerez tercihleri
    </button>
  );
}
