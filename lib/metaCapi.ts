/**
 * Meta Conversion API (CAPI) — server-side event helper
 *
 * iOS 17+ ATT, ad-blocker'lar ve tarayıcı izleme kısıtlamaları
 * client-side Pixel event'lerinin %30-50'sini bloklar.
 * CAPI sunucudan doğrudan Meta'ya gönderir, bu kaybı geri kazanır.
 *
 * Çift kanal (Pixel + CAPI) gönderim:
 * - Aynı event_id ile çift kanal gönderilir
 * - Meta tarafında otomatik deduplication
 * - Hangi kanal başarılıysa o sayılır, çift sayım olmaz
 *
 * KVKK uyumu:
 * - Email SHA256 hash ile gönderilir, ham email asla Meta'ya gitmez
 * - IP ve UA hashlenmez ama anonim kalır (Meta IP'yi kendi storage'ında tutmaz)
 * - Sadece Lead/ViewContent gibi açık event'ler — passive tracking yok
 *
 * @governing_law clubbeans-privacy-v1
 */

import crypto from 'node:crypto';

const META_API_VERSION = 'v21.0';
const META_API_BASE = `https://graph.facebook.com/${META_API_VERSION}`;

export type CapiEventName = 'Lead' | 'ViewContent' | 'PageView' | 'Subscribe';

export type CapiEventInput = {
  /** Standart Meta event adı */
  eventName: CapiEventName;
  /** Pixel client-side event_id ile aynı — dedupe için kritik */
  eventId: string;
  /** Olay zamanı (varsayılan: şimdi) */
  eventTime?: number;
  /** Sayfa URL'si — request'ten alınmalı */
  eventSourceUrl: string;
  /** Eylem kaynağı — varsayılan 'website' */
  actionSource?: 'website' | 'app' | 'email' | 'phone_call' | 'chat';
  /** Kullanıcı bilgileri — Meta match için en az 1 alan gerekli */
  userData: {
    /** E-posta — fonksiyon içinde otomatik SHA256 hashlenir */
    email?: string;
    /** Client IP adresi */
    clientIpAddress?: string;
    /** Client User-Agent */
    clientUserAgent?: string;
    /** _fbp cookie değeri (Facebook browser ID) */
    fbp?: string;
    /** _fbc cookie değeri (Facebook click ID — reklam attribution için) */
    fbc?: string;
    /** Telefon — otomatik SHA256 hashlenir */
    phone?: string;
    /** Harici kullanıcı ID (örn. user.id) — otomatik SHA256 hashlenir */
    externalId?: string;
  };
  /** Olay özelinde custom data (Meta standart parametreler) */
  customData?: {
    contentName?: string;
    contentCategory?: string;
    contentType?: string;
    contentIds?: string[];
    value?: number;
    currency?: string;
    [key: string]: unknown;
  };
  /** Test event code — sadece geliştirme/test sırasında, prod'da boş bırak */
  testEventCode?: string;
};

/**
 * SHA256 hash üret. Meta CAPI ham PII'yi kabul etmez.
 * String'i normalize et (lower + trim) sonra hashle.
 */
function hash(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

/**
 * Tek bir event'i Meta CAPI'ye POST eder.
 * Pixel ID ve access token environment'tan okunur.
 *
 * Returns: { success: boolean, error?: string }
 */
export async function sendCapiEvent(
  input: CapiEventInput,
): Promise<{ success: boolean; error?: string; eventsReceived?: number }> {
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;

  if (!pixelId) {
    return { success: false, error: 'NEXT_PUBLIC_FB_PIXEL_ID env yok' };
  }
  if (!accessToken) {
    return { success: false, error: 'META_CAPI_ACCESS_TOKEN env yok' };
  }

  const eventTime = input.eventTime ?? Math.floor(Date.now() / 1000);

  // user_data — Meta match keys (hash'lenmiş)
  const userData: Record<string, string | string[] | undefined> = {
    em: input.userData.email ? [hash(input.userData.email)!] : undefined,
    ph: input.userData.phone ? [hash(input.userData.phone)!] : undefined,
    external_id: input.userData.externalId
      ? [hash(input.userData.externalId)!]
      : undefined,
    client_ip_address: input.userData.clientIpAddress,
    client_user_agent: input.userData.clientUserAgent,
    fbp: input.userData.fbp,
    fbc: input.userData.fbc,
  };

  // undefined alanları temizle
  Object.keys(userData).forEach((key) => {
    if (userData[key] === undefined) delete userData[key];
  });

  const eventPayload = {
    event_name: input.eventName,
    event_time: eventTime,
    event_id: input.eventId,
    event_source_url: input.eventSourceUrl,
    action_source: input.actionSource ?? 'website',
    user_data: userData,
    custom_data: input.customData ?? {},
  };

  const body: Record<string, unknown> = {
    data: [eventPayload],
    access_token: accessToken,
  };

  if (input.testEventCode) {
    body.test_event_code = input.testEventCode;
  }

  try {
    const url = `${META_API_BASE}/${pixelId}/events`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as {
      events_received?: number;
      messages?: string[];
      fbtrace_id?: string;
      error?: { message: string; type: string; code: number };
    };

    if (!res.ok || data.error) {
      const errMsg = data.error?.message || `HTTP ${res.status}`;
      if (process.env.NODE_ENV !== 'production') {
        console.error('[Meta CAPI] error:', errMsg, data);
      }
      return { success: false, error: errMsg };
    }

    return {
      success: true,
      eventsReceived: data.events_received ?? 0,
    };
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Meta CAPI] fetch error:', errMsg);
    }
    return { success: false, error: errMsg };
  }
}

/**
 * NextRequest'ten user_data için gerekli alanları çıkar.
 *
 * fbc öncelik sırası:
 * 1. _fbc cookie (Meta Pixel script set eder)
 * 2. URL ?fbclid= query param (ilk visit fallback — cookie henüz set edilmemiş)
 * 3. eventSourceUrl ?fbclid= (referrer chain)
 *
 * fbclid → fbc dönüşüm formatı: `fb.1.{timestampMs}.{fbclid}`
 * Bu format Meta CAPI dokümante: https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/fbp-and-fbc
 */
export function extractUserDataFromRequest(
  req: Request,
  fallbackUrl?: string,
  clickTimestamp?: number,
): {
  clientIpAddress?: string;
  clientUserAgent?: string;
  fbp?: string;
  fbc?: string;
} {
  const headers = req.headers;
  const cookieHeader = headers.get('cookie') ?? '';

  // x-forwarded-for ilk IP (Vercel + Cloudflare arkasında)
  const xff = headers.get('x-forwarded-for');
  const clientIpAddress = xff
    ? xff.split(',')[0].trim()
    : (headers.get('x-real-ip') ?? undefined);

  const clientUserAgent = headers.get('user-agent') ?? undefined;

  // _fbp ve _fbc cookie'lerini parse et — RAW değer, decodeURIComponent YOK
  // (decodeURIComponent fbc/fbp değerlerini kıramaz ama Meta ham bekler)
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    }),
  );
  const fbp = cookies._fbp || undefined;
  let fbc: string | undefined = cookies._fbc || undefined;

  // fbc fallback — eventSourceUrl veya request URL'den fbclid çek
  // KRİTİK: Timestamp client'ın landing time'ı olmalı (server time DEĞİL).
  // Meta "modified value" warning'inin sebebi: server Date.now() ≠ click anı.
  if (!fbc) {
    try {
      const urlToCheck = fallbackUrl || req.url;
      if (urlToCheck) {
        const url = new URL(urlToCheck);
        const fbclid = url.searchParams.get('fbclid');
        if (fbclid) {
          // Client'tan gelen click timestamp > server fallback
          // Meta CAPI standard fbc format: fb.1.{timestampMs}.{fbclid}
          const ts = clickTimestamp || Date.now();
          fbc = `fb.1.${ts}.${fbclid}`;
        }
      }
    } catch {
      // URL parse hatası — sessiz geç
    }
  }

  return { clientIpAddress, clientUserAgent, fbp, fbc };
}
