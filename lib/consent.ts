/**
 * Çerez tercih yönetimi
 *
 * - Hiçbir izleyici (Meta Pikseli + Dönüşüm API'si, PostHog) açık onay olmadan çalışmaz.
 * - Reklamdan gelmek (fbclid/gclid/ttclid) ONAY DEĞİLDİR ve önceki "Hayır"ı asla ezmez
 *   (KVKK 2026-09-25: eski auto-grant, "Hayır" demiş ziyaretçiyi reklam tıklamasıyla
 *   "granted" yapıyordu; Meta'daki reklam onayı bu sitenin çerezleri için rıza sayılmaz).
 * - Anahtar v2: v1'deki "granted" kayıtlarının bir kısmı auto-grant ile yazıldı ve gerçek
 *   onaydan ayırt edilemez → hepsi geçersiz, herkese bir kez yeniden sorulur.
 * - Onay, "Çerez tercihleri" düğmesiyle (FooterLegal) her an geri alınabilir.
 *
 * @governing_law clubbeans-privacy-v1
 */

export type ConsentValue = 'granted' | 'denied' | 'unset';

const STORAGE_KEY = 'clubbeans-consent-v2';
const ESKI_ANAHTAR = 'clubbeans-consent-v1';

/**
 * Reklam tıklamasının iniş anı — YALNIZ onay verildiyse saklanır (Dönüşüm API'sinde fbc için).
 * Onaysız ziyaretçinin cihazına reklam kimliği yazılmaz.
 */
function reklamTiklamasiniKaydet(): void {
  try {
    if (!new URL(window.location.href).searchParams.has('fbclid')) return;
    if (!sessionStorage.getItem('cb-fbclid-ts')) {
      sessionStorage.setItem('cb-fbclid-ts', String(Date.now()));
    }
  } catch {
    // sessionStorage erişilemez (gizli pencere vb.) — sessiz geç
  }
}

export function getConsent(): ConsentValue {
  if (typeof window === 'undefined') return 'unset';
  try {
    localStorage.removeItem(ESKI_ANAHTAR);
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'granted') {
      reklamTiklamasiniKaydet();
      return v;
    }
    if (v === 'denied') return v;
    return 'unset';
  } catch {
    return 'unset';
  }
}

export function setConsent(value: 'granted' | 'denied'): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, value);
    if (value === 'granted') reklamTiklamasiniKaydet();
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
