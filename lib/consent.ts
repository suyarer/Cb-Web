/**
 * Çerez tercih yönetimi
 *
 * Anti-platform manifestomuza uygun şekilde:
 * - Hiçbir tracking varsayılan olarak çalışmaz.
 * - Kullanıcı açıkça izin verene kadar Meta Pixel yüklenmez.
 * - localStorage'da küçük bir flag tutulur.
 * - Kullanıcı tercihi sonradan değiştirebilir.
 */

export type ConsentValue = 'granted' | 'denied' | 'unset';

const STORAGE_KEY = 'clubbeans-consent-v1';

export function getConsent(): ConsentValue {
  if (typeof window === 'undefined') return 'unset';
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'granted' || v === 'denied') return v;
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
