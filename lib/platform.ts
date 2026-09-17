/**
 * @governing_law /indir — ziyaretçinin telefonuna uygun mağazayı en üste koymak için
 * User-Agent'tan platform tespiti. Sunucuda (`headers()`) çalışır; istemci JS'i beklemez.
 *
 * Bilinçli sınırlar:
 * - iPadOS 13+ Safari masaüstü (Macintosh) UA'sı gönderir → 'bilinmiyor' döner ve iki mağaza
 *   birlikte gösterilir. Yanlış mağazayı öne koymaktan iyidir.
 * - Uygulama-içi tarayıcılar (Instagram, WhatsApp WebView) cihaz belirtecini korur → doğru tespit.
 * - Bağlantı önizleme botları ('WhatsApp/2.x') cihaz belirteci taşımaz → 'bilinmiyor'.
 */
export type Platform = 'ios' | 'android' | 'bilinmiyor';

export function platformBul(ua: string | null | undefined): Platform {
  if (!ua) return 'bilinmiyor';
  if (/\b(iPhone|iPad|iPod)\b/.test(ua)) return 'ios';
  if (/\bAndroid\b/i.test(ua)) return 'android';
  return 'bilinmiyor';
}
