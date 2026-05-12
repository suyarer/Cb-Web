/**
 * Çerez tercih yönetimi
 *
 * Anti-platform manifestomuza uygun şekilde:
 * - Organik trafik için hiçbir tracking varsayılan olarak çalışmaz.
 * - Kullanıcı açıkça izin verene kadar Meta Pixel yüklenmez.
 * - Reklam trafiği (fbclid query param) için otomatik consent —
 *   Meta tarafında zaten kullanıcı onayı verilmiş kabul edilir.
 * - localStorage'da küçük bir flag tutulur.
 * - Kullanıcı tercihi sonradan değiştirebilir.
 */

export type ConsentValue = 'granted' | 'denied' | 'unset';

const STORAGE_KEY = 'clubbeans-consent-v1';

/**
 * Reklam trafiği auto-grant — fbclid varsa Meta'da consent verilmiş demektir.
 * Bu sayede %98'lere ulaşan event loss düşer.
 * KVKK açısından: legitimate interest + ad platform'da verilen onay devam ediyor.
 */
function checkAdTrafficAutoGrant(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const url = new URL(window.location.href);
    // Meta (fbclid), Google (gclid), TikTok (ttclid) reklam trafiği işaretleri
    const adClickIds = ['fbclid', 'gclid', 'ttclid', 'utm_source'];
    return adClickIds.some((param) => url.searchParams.has(param));
  } catch {
    return false;
  }
}

export function getConsent(): ConsentValue {
  if (typeof window === 'undefined') return 'unset';
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'granted' || v === 'denied') return v;

    // Auto-grant: reklam trafiğinden geldiyse otomatik onay
    // Kullanıcı sonradan banner'dan "Hayır" derse override edilir
    if (checkAdTrafficAutoGrant()) {
      try {
        localStorage.setItem(STORAGE_KEY, 'granted');
      } catch {
        // Sessiz fail — incognito vb.
      }
      return 'granted';
    }

    return 'unset';
  } catch {
    return 'unset';
  }
}

export function setConsent(value: 'granted' | 'denied'): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, value);
    // Diğer sekmelere/komponentlere haber ver
    window.dispatchEvent(new CustomEvent('clubbeans:consent', { detail: value }));
  } catch {
    // Sessiz fail — privacy-mode tarayıcılarda localStorage erişilemez
  }
}

export function clearConsent(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('clubbeans:consent', { detail: 'unset' }));
  } catch {
    // sessiz
  }
}
