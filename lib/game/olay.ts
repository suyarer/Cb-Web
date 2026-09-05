/**
 * SOSYAL OBEZİTE — analitik olayları (rıza-öncesi ÇEREZSİZ).
 *
 * İki kanal, ikisi de kimlik/çerez yazmaz:
 *  1) Vercel Web Analytics `track` — aynı origin, çerezsiz; anahtar gerektirmez.
 *  2) PostHog — YALNIZ `NEXT_PUBLIC_POSTHOG_KEY` tanımlıysa, ayrı 'oyun' örneğiyle:
 *     persistence 'memory' (ph_* çerez/localStorage = 0), autocapture kapalı,
 *     pageview kapalı, kayıt kapalı, person_profiles 'never'. Site geneli
 *     PosthogProvider bu rotada çalışmaz (SiteKatmanlari kapısı) — aydınlatma
 *     metnindeki "reklam kimliği yok, cihaz takibi yok" beyanı böyle korunur.
 *
 * posthog-js kritik yola girmesin diye tembel `import()` ile, ilk olayda yüklenir.
 * Olay adları spec §11'in Türkçe karşılığı; özellikler düz (string/number) —
 * takma ad, IP, runId gibi kişi/kimlik verisi ASLA gönderilmez.
 */

import { track } from '@vercel/analytics';

export type OyunOlay =
  | 'oyun_goruntulendi'
  | 'tur_basladi'
  | 'tur_bitti'
  | 'skor_yazildi'
  | 'skor_reddedildi'
  | 'paylasim_tiklandi'
  | 'indir_tiklandi'
  | 'tablo_goruntulendi'
  | 'takma_ad_yazildi'
  | 'bir_tur_daha'
  | 'rakip_ile_gelindi';

type Ozellik = Record<string, string | number | boolean>;

type PosthogOrnegi = { capture: (ad: string, ozellikler?: Record<string, unknown>) => void };
let posthogSoz: Promise<PosthogOrnegi | null> | null = null;

function posthogAl(): Promise<PosthogOrnegi | null> {
  if (posthogSoz) return posthogSoz;
  const anahtar = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!anahtar || typeof window === 'undefined') {
    posthogSoz = Promise.resolve(null);
    return posthogSoz;
  }
  posthogSoz = import('posthog-js')
    .then(({ default: posthog }) => {
      const ornek = posthog.init(
        anahtar,
        {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
          persistence: 'memory',
          autocapture: false,
          capture_pageview: false,
          capture_pageleave: false,
          disable_session_recording: true,
          disable_surveys: true,
          person_profiles: 'never',
          ip: false,
        },
        'oyun'
      );
      return (ornek ?? null) as PosthogOrnegi | null;
    })
    .catch(() => null);
  return posthogSoz;
}

/**
 * Tek giriş noktası. Asla throw etmez; analitik oyun akışını kıramaz.
 */
export function oyunOlay(ad: OyunOlay, ozellikler: Ozellik = {}): void {
  if (typeof window === 'undefined') return;
  const veri = { ...ozellikler, alan: 'sosyal-obezite' };
  try {
    track(ad, veri);
  } catch {
    // Vercel Analytics yüklenmemiş olabilir — sessiz
  }
  void posthogAl().then((ph) => {
    try {
      ph?.capture(ad, veri);
    } catch {
      // sessiz
    }
  });
}
