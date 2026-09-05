/**
 * @module appLinks
 * ClubBeans mağaza linkleri — TEK KAYNAK.
 *
 * Canlı doğrulama (2026-07): app App Store + Google Play'de YAYINDA.
 * - iOS:  id6778042472  (CLUBBEANS TEKNOLOJI LTD, region-siz redirect çalışır)
 * - Play: com.clubbeans
 *
 * ⚠️ Eski değerler `id6762319190` ve `com.clubbeans.app` 404 veriyordu —
 * tüm sitede indirme linkleri kırıktı. Yeni link yazan HER yer buradan import etsin,
 * hardcode ETME (drift = kırık link).
 */
export const APP_STORE_URL = 'https://apps.apple.com/app/id6778042472';
export const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.clubbeans';

/**
 * Kampanya atıflı mağaza linki — indirme dönüşümü mağaza konsolunda ayrışsın.
 *
 * iOS: `ct` kampanya etiketi + `mt=8`. App Store Connect → App Analytics → Campaign
 * Links'ten alınan `pt` (provider token) eklenmeden Apple bu kampanyayı raporlamaz;
 * `NEXT_PUBLIC_APPLE_PT` env'i tanımlanınca otomatik eklenir (link yine çalışır).
 * Play: `referrer` → Install Referrer API ile utm_* uygulama tarafına ulaşır.
 */
export function magazaLinki(store: 'ios' | 'android', kampanya = 'site'): string {
  if (store === 'ios') {
    const pt = process.env.NEXT_PUBLIC_APPLE_PT;
    return `${APP_STORE_URL}?${pt ? `pt=${encodeURIComponent(pt)}&` : ''}ct=${encodeURIComponent(kampanya)}&mt=8`;
  }
  const referrer = `utm_source=clubbeans.com&utm_medium=oyun&utm_campaign=${kampanya}`;
  return `${PLAY_STORE_URL}&referrer=${encodeURIComponent(referrer)}`;
}
