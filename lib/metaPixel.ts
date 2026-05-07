/**
 * Meta Pixel client-side event helper
 *
 * Anti-platform manifestomuza uygun şekilde:
 * - Consent verilmediyse hiçbir event gönderilmez
 * - Pixel ID env var yoksa hiçbir event gönderilmez
 * - Window.fbq fonksiyonu yoksa (script henüz yüklenmediyse) sessiz fail
 *
 * Server-side eşdeğer Conversion API (CAPI) ile çift kanallı gönderim
 * yapılır — iOS 17+ ATT etkisinden kaynaklanan attribution kaybını telafi.
 *
 * @governing_law clubbeans-privacy-v1
 */

import { getConsent } from '@/lib/consent';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type LeadParams = {
  /** Form/CTA kaynağı, örn: 'hero' | 'launch' | 'subpage-cta' */
  source?: string;
  /** UTM kampanyası (varsa) */
  campaign?: string;
  /** Aboneliğin TL cinsinden değeri — bekleme listesi için 0 */
  value?: number;
  currency?: string;
};

type ViewContentParams = {
  /** Sayfa kategorisi, örn: 'roadmap' | 'launch-event' | 'manifesto' */
  contentName?: string;
  contentCategory?: string;
};

/**
 * Pixel kullanıma hazır mı?
 */
function canTrack(): boolean {
  if (typeof window === 'undefined') return false;
  if (!process.env.NEXT_PUBLIC_FB_PIXEL_ID) return false;
  if (getConsent() !== 'granted') return false;
  if (typeof window.fbq !== 'function') return false;
  return true;
}

/**
 * Lead — bekleme listesine kayıt başarılı olduğunda
 */
export function trackLead(params: LeadParams = {}): void {
  if (!canTrack()) return;
  try {
    window.fbq?.('track', 'Lead', {
      content_name: params.source ?? 'waitlist',
      content_category: 'launch-waitlist',
      value: params.value ?? 0,
      currency: params.currency ?? 'TRY',
      ...(params.campaign ? { campaign: params.campaign } : {}),
    });
  } catch {
    // Sessiz fail — analytics asla site fonksiyonelliğini etkilemesin
  }
}

/**
 * ViewContent — yüksek niyetli sayfaya girildi (yol-haritasi, manifesto vb.)
 */
export function trackViewContent(params: ViewContentParams = {}): void {
  if (!canTrack()) return;
  try {
    window.fbq?.('track', 'ViewContent', {
      content_name: params.contentName ?? 'unknown',
      content_category: params.contentCategory ?? 'page',
    });
  } catch {
    // sessiz
  }
}

/**
 * Custom — manifesto serisi gibi özel olaylar için
 */
export function trackCustom(eventName: string, params: Record<string, unknown> = {}): void {
  if (!canTrack()) return;
  try {
    window.fbq?.('trackCustom', eventName, params);
  } catch {
    // sessiz
  }
}
