/**
 * Denetim modu — YALNIZ yerel geliştirme sunucusunda.
 *
 * `?poz=<sn>` (tek kare) ve `?bitis=<n>` (tur sonu ekranı) parametreleri
 * ekran görüntüsüyle denetim için var. Önceki sürümde `poz` hostname kapısı
 * olmadan okunuyordu; `bitis` kapısı da yalnız bir dalda vardı: paylaşılan bir
 * `clubbeans.com/sosyal-obezite?bitis=8` linki herkeste sonsuz "Akış hazırlanıyor…"
 * ekranı açıyordu (denetim guvenlik-5 / etkilesim-13 / dogruluk-6, CONFIRMED).
 * Artık tek kapı: yerel değilse parametre hiç okunmaz.
 */

export function denetimModu(): boolean {
  if (typeof window === 'undefined') return false;
  return /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);
}

/** Yalnız denetim modunda ve sonlu bir sayıysa değeri döner; aksi hâlde null. */
export function denetimSayisi(ad: 'poz' | 'bitis'): number | null {
  if (!denetimModu()) return null;
  const ham = new URLSearchParams(window.location.search).get(ad);
  if (ham === null) return null;
  const n = Number(ham);
  return Number.isFinite(n) ? n : null;
}
