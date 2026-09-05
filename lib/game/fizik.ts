/**
 * SOSYAL OBEZİTE — kaydırma fiziği (saf, test edilebilir).
 *
 * TASARIM KURALI: parmak 1:1 takip edilir. Sürükleme ASLA kırpılmaz.
 * Hız tavanı SKORA aittir ve sunucuda uygulanır.
 *
 * Sabitler dış referanstan alındı (72 kaynaklı araştırma, docs/dis-referans-sentez.md):
 *   - iOS UIScrollView decelerationRate: normal 0.998 / **fast 0.99** (ms başına)
 *   - Android ViewConfiguration: MINIMUM_FLING_VELOCITY 50 dp/sn, MAXIMUM 8000 dp/sn
 *   - Android VelocityTracker: ASSUME_POINTER_STOPPED_TIME 40ms
 *   - iOS rubber band: (x·d·c)/(d+c·x), c = 0.55  (chpwn tersine mühendislik)
 *   - better-scroll: momentumLimitDistance 15px, swipeBounceTime 500ms
 *
 * ⚠️ EN ÖNEMLİ DÜZELTME: 0.998 YANLIŞ DEĞER DEĞİLDİ, YANLIŞ MODDU.
 * Gerçek reel'ler "fast + sayfalama" kullanır. 0.998 ile 2000px/sn fırlatma
 * 2.56 saniye boyunca 999px başıboş süzülüyordu — "serbest liste" hissi.
 * 0.99 + karta oturma ile 0.51 saniye / 199px: "reel" hissi.
 */

/** iOS "fast" deceleration — ms başına. Reel/sayfalama hissinin taşıyıcısı. */
export const SONUM_MS = 0.99;
/** Bu hızın altında momentum durmuş sayılır (px/sn) */
export const DURMA_ESIGI = 12;
/** Altında fırlatma sayılmayan hız — Android MINIMUM_FLING_VELOCITY (50 dp/sn) */
export const MIN_FIRLATMA = 50;
/** Üstünde ölçüm hatası kabul edilen hız — Android MAXIMUM_FLING_VELOCITY (8000 dp/sn) */
export const MAX_FIRLATMA = 8000;
/** Toplam hareket bunun altındaysa momentum verilmez — better-scroll momentumLimitDistance */
export const MIN_MOMENTUM_MESAFESI = 15;
/** iOS lastik katsayısı (chpwn). Direnç mesafeyle ARTAR — doğrusal değil. */
export const LASTIK_C = 0.55;
/** Hız kestirim penceresi (ms) */
export const HIZ_PENCERESI_MS = 90;
/** Son örnek bundan eskiyse parmak DURMUŞ sayılır — Android ASSUME_POINTER_STOPPED_TIME */
export const BAYAT_ESIGI_MS = 40;
/**
 * Geri yaylanma sönümü. Hedef: better-scroll swipeBounceTime = 500ms.
 *
 * ⚠️ Sentez "0.985 ~200ms'de bitiyor, 0.994 yapın" dedi — ÖLÇÜM ÇÜRÜTTÜ:
 * 0.985 zaten ~450ms veriyordu (hedefe yakın), 0.994 ise 1.07sn'ye çıkardı.
 * -300px'ten 0.5px'e inmek ~6.4 zaman sabiti ister; 500ms için tc≈78ms gerekir.
 * exp(-1/71) ≈ 0.986 → yerleşme ~460ms.
 */
export const YAYLANMA_MS = 0.986;

export type Ornek = { t: number; y: number };

/**
 * Bırakma anındaki hız.
 *
 * İKİ DÜZELTME:
 * 1) Bayat örnek → 0. Parmağını ekranda TUTUP okuyan sonra kaldıran oyuncu
 *    (reel'in en yaygın ritmi) hayalet fırlatma alıyordu. Android 40ms kullanıyor;
 *    bizde 90ms'ti, yani 40-89ms arası duraklamalar hâlâ hayalet üretiyordu.
 * 2) SON-AĞIRLIKLI kestirim. Düz pencere ortalaması tepe hızı sistematik olarak
 *    DÜŞÜK tahmin ediyordu — "melas" hissinin kalan yarısı buydu. Artık son iki
 *    örneğin anlık hızı ile pencere ortalamasının BÜYÜĞÜ alınır.
 */
export function firlatmaHizi(ornekler: Ornek[], simdi: number): number {
  if (ornekler.length < 2) return 0;
  const son = ornekler[ornekler.length - 1];
  if (simdi - son.t > BAYAT_ESIGI_MS) return 0;

  // (a) pencere ortalaması
  let ilk = ornekler[0];
  for (let i = ornekler.length - 1; i >= 0; i--) {
    if (simdi - ornekler[i].t <= HIZ_PENCERESI_MS) ilk = ornekler[i];
    else break;
  }
  const dtPencere = son.t - ilk.t;
  const vPencere = dtPencere > 0 ? ((ilk.y - son.y) / dtPencere) * 1000 : 0;

  // (b) son iki örneğin anlık hızı
  const onceki = ornekler[ornekler.length - 2];
  const dtAnlik = son.t - onceki.t;
  const vAnlik = dtAnlik > 0 ? ((onceki.y - son.y) / dtAnlik) * 1000 : 0;

  // Aynı yöndeyse büyüğünü al; yön uyuşmuyorsa pencereye güven (titreme)
  const v =
    Math.sign(vAnlik) === Math.sign(vPencere)
      ? Math.abs(vAnlik) > Math.abs(vPencere) ? vAnlik : vPencere
      : vPencere;

  if (Math.abs(v) < MIN_FIRLATMA) return 0;
  return Math.max(-MAX_FIRLATMA, Math.min(MAX_FIRLATMA, v));
}

/** Sönüm — süreye bağlı, frame hızından bağımsız */
export function sonumUygula(hiz: number, dtMs: number): number {
  const yeni = hiz * Math.pow(SONUM_MS, dtMs);
  return Math.abs(yeni) < DURMA_ESIGI ? 0 : yeni;
}

/**
 * Üstel sönümün kapalı-form toplam mesafesi: ∫v₀·k^t dt = (v₀/1000)/(-ln k)
 * Snap hedefini fırlatma anında hesaplamak için — kare kare beklemeye gerek yok.
 */
export function durmaMesafesi(hiz: number): number {
  return (hiz / 1000) / -Math.log(SONUM_MS);
}

/** Fırlatma nerede biterse, en yakın kart sınırına oturt (reel sayfalama hissi) */
export function snapHedefi(offset: number, hiz: number, kartH: number): number {
  const durus = offset + durmaMesafesi(hiz);
  return Math.max(0, Math.round(durus / kartH) * kartH);
}

/**
 * Üst sınır lastiği — iOS asimptotik formülü (chpwn): f(x) = (x·d·c)/(d+c·x)
 * Doğrusal 0.35 katsayısında direnç mesafeyle ARTMIYORDU; yeterince çekince
 * sayfa kopuyormuş gibi geliyordu. Asimptotikte ne kadar çekersen çek bir
 * duvara yaklaşırsın — gerçek kaydırmanın hissi budur.
 */
export function lastikMesafesi(hamMesafe: number, viewportH: number): number {
  const x = Math.abs(hamMesafe);
  const d = Math.max(1, viewportH);
  const sonuc = (x * d * LASTIK_C) / (d + LASTIK_C * x);
  return hamMesafe < 0 ? -sonuc : sonuc;
}

/** Konumu ilerlet. 0'ın üstünde serbest, altında asimptotik direnç. */
export function konumIlerlet(offset: number, delta: number, viewportH = 800): number {
  const yeni = offset + delta;
  if (yeni >= 0) return yeni;
  // Negatif bölge: toplam aşımı lastikten geçir
  const hamAsim = yeni;
  return lastikMesafesi(hamAsim, viewportH);
}

/** Bırakıldığında üst sınıra geri yaylanma */
export function geriYayla(offset: number, dtMs: number): number {
  if (offset >= 0) return offset;
  const yeni = offset * Math.pow(YAYLANMA_MS, dtMs);
  return yeni > -0.5 ? 0 : yeni;
}
