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
  /** Aboneliğin TL cinsinden tahmini değeri — Meta optimizasyonu için */
  value?: number;
  currency?: string;
};

type ViewContentParams = {
  /** İçerik adı, örn: 'yol-haritasi', 'manifesto', 'lansman-event' */
  contentName?: string;
  /** İçerik kategorisi, örn: 'launch-roadmap', 'about-page' */
  contentCategory?: string;
  /** Meta sınıflandırma için, varsayılan 'page' */
  contentType?: string;
};

/**
 * Tek olay için unique ID üret.
 * Pixel + CAPI çift kanal gönderiminde Meta tarafında dedupe için.
 * UUID v4 — crypto.randomUUID modern tarayıcılarda mevcut.
 */
function generateEventId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback — düşük olasılıklı kolizyon, eski tarayıcılar için yeterli
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

/**
 * Bekleme listesi LTV tahmini — Meta optimizasyon algoritmasının
 * "ne kadar değerli" sorusuna cevap. Türkiye dijital ürün ortalaması
 * baz alındı: yaklaşık 50 TL net değer.
 */
const ESTIMATED_LEAD_VALUE_TRY = 50;

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
 * Lead — bekleme listesine kayıt başarılı olduğunda.
 *
 * Standart Meta Lead olayı: "potansiyel müşteri iletişim bilgisini paylaştı".
 * Bekleme listesi tam olarak bu — kişi e-posta veriyor, lansman günü geri dönüleceğini biliyor.
 *
 * Returns: event_id (CAPI server-side gönderiminde dedupe için kullanılır)
 */
export function trackLead(params: LeadParams = {}): string | null {
  if (!canTrack()) return null;
  const eventId = generateEventId();
  try {
    window.fbq?.(
      'track',
      'Lead',
      {
        content_name: params.source ?? 'waitlist',
        content_category: 'launch-waitlist',
        content_type: 'product_lead',
        value: params.value ?? ESTIMATED_LEAD_VALUE_TRY,
        currency: params.currency ?? 'TRY',
        ...(params.campaign ? { campaign: params.campaign } : {}),
      },
      { eventID: eventId },
    );
    return eventId;
  } catch {
    return null;
  }
}

/**
 * ViewContent — yüksek niyetli sayfaya girildi (yol-haritasi, manifesto vb.).
 *
 * Standart Meta ViewContent olayı: "kullanıcı önemli bir landing page gördü".
 * Custom Audience segmentasyonu için (örn. roadmap okuyucuları) kritik sinyal.
 *
 * Returns: event_id (CAPI dedupe için)
 */
export function trackViewContent(params: ViewContentParams = {}): string | null {
  if (!canTrack()) return null;
  const eventId = generateEventId();
  try {
    window.fbq?.(
      'track',
      'ViewContent',
      {
        content_name: params.contentName ?? 'unknown',
        content_category: params.contentCategory ?? 'page',
        content_type: params.contentType ?? 'page',
      },
      { eventID: eventId },
    );
    return eventId;
  } catch {
    return null;
  }
}

/**
 * Custom — manifesto serisi gibi marka-spesifik olaylar için.
 * Standart Meta listesinde olmayan olaylar burada (trackCustom).
 */
export function trackCustom(eventName: string, params: Record<string, unknown> = {}): string | null {
  if (!canTrack()) return null;
  const eventId = generateEventId();
  try {
    window.fbq?.('trackCustom', eventName, params, { eventID: eventId });
    return eventId;
  } catch {
    return null;
  }
}
