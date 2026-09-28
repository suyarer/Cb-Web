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
const APPLE_PT_VARSAYILAN = '129009038';
export const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.clubbeans';

/**
 * Kampanya atıflı mağaza linki — indirme dönüşümü mağaza konsolunda ayrışsın.
 *
 * iOS: `ct` kampanya etiketi + `mt=8`. App Store Connect → App Analytics → Campaign
 * Links'ten alınan `pt` (provider token) eklenmeden Apple bu kampanyayı raporlamaz;
 * `NEXT_PUBLIC_APPLE_PT` env'i tanımlanınca otomatik eklenir (link yine çalışır).
 * Play: `referrer` → Install Referrer API ile utm_* uygulama tarafına ulaşır.
 * `ortam` Play'de `utm_medium` olur (oyun · web); iOS'ta karşılığı yok.
 */
const TR_ASCII: Record<string, string> = { ç: 'c', ğ: 'g', ı: 'i', i̇: 'i', ö: 'o', ş: 's', ü: 'u' };

/**
 * URL'den gelen kampanya adını mağaza etiketine çevirir (2026-09-29, reklam ölçüm köprüsü).
 * Türkçe harf → ASCII, boşluk → `_`, izinli dışı karakter atılır, en çok 40 karakter; sonuç boşsa `varsayilan`.
 * Neden: panelde "Doğum Günü Deneme" yazılırsa sessizce varsayılana düşüp kampanya ayrışması kaybolmasın,
 * ama URL'deki serbest metin mağaza linkine ham da akmasın.
 */
export function kampanyaTemiz(ham: string | string[] | undefined, varsayilan: string): string {
  const deger = Array.isArray(ham) ? ham[0] : ham;
  if (!deger) return varsayilan;
  const temiz = deger
    .toLocaleLowerCase('tr-TR')
    .replace(/[çğıöşü]|i̇/g, (h) => TR_ASCII[h] ?? h)
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 40);
  return temiz || varsayilan;
}

/**
 * Reklam trafiği mi? `utm_source` dolu ya da `fbclid` var (Meta her reklam tıklamasına ekler).
 * SmartRedirect reklam trafiğinde otomatik uygulama/mağaza yönlendirmesi YAPMAZ — kişi masayı okur.
 */
export function reklamTrafigiMi(search: string): boolean {
  const p = new URLSearchParams(search);
  return Boolean(p.get('utm_source') || p.get('fbclid'));
}

/**
 * Site indirme düğmeleri için kampanya etiketi (2026-09-29): URL'de utm_campaign → temizlenmiş hâli; yalnız reklam izi
 * (utm_source / fbclid) varsa `meta_<varsayılan>`; organikte varsayılan. "Doğum günü deneme" reklamı ana sayfaya yalnız
 * fbclid ile iniyordu ve düğmeler kampanyasızdı → reklam kurulumu organikten ayrışmıyordu.
 */
export function sayfaKampanyasi(search: string, varsayilan: string): string {
  const p = new URLSearchParams(search);
  const ham = p.get('utm_campaign');
  if (ham) return kampanyaTemiz(ham, varsayilan);
  return reklamTrafigiMi(search) ? kampanyaTemiz(`meta_${varsayilan}`, varsayilan) : varsayilan;
}

export function magazaLinki(store: 'ios' | 'android', kampanya = 'site', ortam = 'oyun'): string {
  if (store === 'ios') {
    // pt = App Store Connect sağlayıcı kimliği (Campaign Links'te herkese açık görünür, gizli değil). Env yoksa varsayılan
    // (2026-09-29, App Store Connect'ten okundu) — ct raporu Apple'da ancak pt ile görünür; kampanya ≥5 kurulumdan sonra listelenir.
    const pt = process.env.NEXT_PUBLIC_APPLE_PT || APPLE_PT_VARSAYILAN;
    return `${APP_STORE_URL}?${pt ? `pt=${encodeURIComponent(pt)}&` : ''}ct=${encodeURIComponent(kampanya)}&mt=8`;
  }
  const referrer = `utm_source=clubbeans.com&utm_medium=${ortam}&utm_campaign=${kampanya}`;
  return `${PLAY_STORE_URL}&referrer=${encodeURIComponent(referrer)}`;
}
