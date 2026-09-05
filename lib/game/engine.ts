/**
 * SOSYAL OBEZİTE — saf oyun motoru (istemci + sunucu ORTAK)
 *
 * Bu dosya DOM'a, React'e ve tarayıcıya dokunmaz. Sebep: sunucu skoru
 * bağımsız yeniden hesaplayabilsin. Aynı seed + aynı olay listesi → aynı skor.
 *
 * Sayılar sentez §2.3'te kilitlendi. Skor tablosu (Redis sorted set) kalıcı
 * olduğu için lansmandan SONRA formül değiştirilemez — eski skorlar
 * kıyaslanamaz hale gelir.
 */

// ── SABİTLER (lansman öncesi kilitli) ────────────────────────────────────────
export const TUR_SURESI_MS = 60_000;
/** Tur başına gerçek nesne sayısı — sunucu seed'inden türetilir */
export const GERCEK_SAYISI = 12;
/** Her N ms'lik pencerede 1 spawn */
export const SPAWN_PENCERESI_MS = 5_000;
/** Pencere içi rastgelelik (± ms) */
export const SPAWN_JITTER_MS = 1_500;
/** Bir gerçek en az bu kadar süre yakalanabilir kalır — hız kademesinden BAĞIMSIZ (a11y, §C5) */
export const YAKALANABILIR_MS = 1_500;
/**
 * Gerçeğin ekranda yakalanabilir kaldığı GERÇEK pencere (istemci ve çubuk bunu kullanır).
 * Takvimin son sınırı da bu sayıdan türetilir: önceki 1500 ms sınırı son gerçeğin
 * çubuğunu tur biterken %17 dolu bırakıyordu (denetim dogruluk-10). Tek sabit, iki yer.
 */
export const YAKALAMA_PENCERESI_MS = 1_800;
/** İki spawn arası taban — yakalama penceresinden (1800ms) geniş olmak ZORUNDA */
export const MIN_SPAWN_ARALIGI_MS = 2_000;
/** İlk turda ilk gerçek bu aralığa sabitlenir (öğretim) */
export const ILK_SPAWN_MIN_MS = 4_000;
export const ILK_SPAWN_MAX_MS = 6_000;

/** Kart başına mesafe puanı — PİKSEL DEĞİL. Küçük/büyük ekran adaleti. */
export const KART_PUANI = 1;
export const YAKALAMA_TABAN = 50;
/** Çarpan merdiveni; tavan ×2.0. Kaçırma sıfırlar, yanlış dokunma ETKİLEMEZ. */
export const CARPAN_MERDIVENI = [1.0, 1.5, 2.0] as const;
export const YANLIS_DOKUNMA_CEZASI = -20;
/** Provizyonel hız tavanı (kart/sn). Soft-launch p99 × 1.5 ile kalibre edilecek. */
export const HIZ_TAVANI_KART_SN = 8;

/** Bean çözülme yayı eşikleri (ms). Her tur TAM yay yaşanır (sentez §2.4). */
export const BEAN_ESIKLERI_MS = [12_000, 25_000, 38_000, 50_000, 57_000] as const;
export type BeanFaz = 0 | 1 | 2 | 3 | 4 | 5;

export function beanFazi(gecenMs: number): BeanFaz {
  let f = 0;
  for (const e of BEAN_ESIKLERI_MS) if (gecenMs >= e) f++;
  return Math.min(f, 5) as BeanFaz;
}

// ── DETERMİNİSTİK RNG (mulberry32) ───────────────────────────────────────────
// Aynı seed her yerde aynı diziyi üretir → sunucu spawn takvimini doğrulayabilir.
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** String seed → 32-bit sayı */
export function seedToInt(seed: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Spawn takvimi — seed'den deterministik.
 * İlk tur ilk spawn ILK_SPAWN aralığına sabitlenir (ilkTur=true).
 */
export function spawnTakvimi(seed: string, ilkTur = false): number[] {
  const r = rng(seedToInt(seed));
  const out: number[] = [];
  for (let i = 0; i < GERCEK_SAYISI; i++) {
    const merkez = i * SPAWN_PENCERESI_MS + SPAWN_PENCERESI_MS / 2;
    const jitter = (r() * 2 - 1) * SPAWN_JITTER_MS;
    out.push(Math.round(merkez + jitter));
  }
  if (ilkTur) {
    out[0] = Math.round(ILK_SPAWN_MIN_MS + r() * (ILK_SPAWN_MAX_MS - ILK_SPAWN_MIN_MS));
  }
  // Sıralı ve tur içinde kalmalı; son gerçeğin TAM yakalama penceresi de sığmalı
  const enSon = TUR_SURESI_MS - YAKALAMA_PENCERESI_MS;
  const sirali = out.map((t) => Math.min(Math.max(t, 500), enSon)).sort((a, b) => a - b);

  /**
   * ARDIŞIK SPAWN TABANI — denetim bulgusu (20K örnekte ~%27 çakışma, min 12ms).
   * İki spawn 1800ms'lik yakalama penceresinden daha yakın gelirse ikincisi
   * birincisini ezer; ezilen gerçek ne yakalanan ne kaçan sayılır → tur sonu
   * "6/11" gösterir, sessiz veri kaybı olur. Taban pencereden geniş tutuldu.
   */
  for (let i = 1; i < sirali.length; i++) {
    if (sirali[i] - sirali[i - 1] < MIN_SPAWN_ARALIGI_MS) {
      sirali[i] = sirali[i - 1] + MIN_SPAWN_ARALIGI_MS;
    }
  }
  // Taban kaydırması sonu taşırdıysa geriye doğru sıkıştır
  for (let i = sirali.length - 1; i > 0; i--) {
    if (sirali[i] > enSon) sirali[i] = enSon;
    if (sirali[i] - sirali[i - 1] < MIN_SPAWN_ARALIGI_MS) {
      sirali[i - 1] = Math.max(500, sirali[i] - MIN_SPAWN_ARALIGI_MS);
    }
  }
  return sirali;
}

// ── SKOR ────────────────────────────────────────────────────────────────────
export type TurOzeti = {
  /** Geçilen kart sayısı (mesafe birimi) */
  kart: number;
  /** Yakalanan gerçek sayısı */
  yakalanan: number;
  /** Kaçan gerçek sayısı */
  kacan: number;
  /** Ekranda gerçek yokken yapılan dokunma sayısı */
  yanlisDokunma: number;
  /** Turda geçen süre (ms) */
  sureMs: number;
};

export type SkorKirilimi = {
  mesafePuani: number;
  yakalamaPuani: number;
  cezaPuani: number;
  skor: number;
};

/**
 * Yakalama puanı: çarpan merdiveni ardışık yakalamada yükselir, KAÇIRMA sıfırlar.
 * Bu yüzden sıralı olay listesi gerekir — sadece toplam sayı yetmez.
 */
export function yakalamaPuani(olaylar: Array<'yakala' | 'kacir'>): number {
  let seri = 0;
  let toplam = 0;
  for (const o of olaylar) {
    if (o === 'kacir') {
      seri = 0;
      continue;
    }
    const carpan = CARPAN_MERDIVENI[Math.min(seri, CARPAN_MERDIVENI.length - 1)];
    toplam += YAKALAMA_TABAN * carpan;
    seri++;
  }
  return Math.round(toplam);
}

/** Mesafe puanı — hız tavanı uygulanır: tavan üstü kaydırma skor ÜRETMEZ. */
export function mesafePuani(kart: number, sureMs: number): number {
  const tavan = Math.ceil((HIZ_TAVANI_KART_SN * sureMs) / 1000);
  return Math.min(kart, tavan) * KART_PUANI;
}

export function hesaplaSkor(
  ozet: TurOzeti,
  olaylar: Array<'yakala' | 'kacir'>
): SkorKirilimi {
  const m = mesafePuani(ozet.kart, ozet.sureMs);
  const y = yakalamaPuani(olaylar);
  const c = ozet.yanlisDokunma * YANLIS_DOKUNMA_CEZASI;
  return {
    mesafePuani: m,
    yakalamaPuani: y,
    cezaPuani: c,
    skor: Math.max(0, m + y + c), // taban 0
  };
}

/** Teorik tavan — denetim ve test için. */
export function teorikTavan(): number {
  const olaylar = Array<'yakala'>(GERCEK_SAYISI).fill('yakala');
  return (
    yakalamaPuani(olaylar) +
    mesafePuani(HIZ_TAVANI_KART_SN * (TUR_SURESI_MS / 1000), TUR_SURESI_MS)
  );
}

// ── AKLA-YATKINLIK (karar 10 — sunucu tarafı) ───────────────────────────────
export type Reddetme = { gecerli: false; sebep: string };
export type Kabul = { gecerli: true };
export type Dogrulama = Kabul | Reddetme;

/**
 * Sunucu YALNIZ UÇ değerleri keser. Ceza/çarpan gibi oyun kuralları istemcide
 * kalır; burada amaç fizik olarak imkânsızı reddetmek.
 * Eşikler bilerek gevşek (dürüst oyuncuyu kesmemek > her hileyi yakalamak).
 */
export function aklaYatkin(ozet: TurOzeti, bildirilenSkor: number, olaylar: Array<'yakala' | 'kacir'>): Dogrulama {
  if (!Number.isFinite(bildirilenSkor) || bildirilenSkor < 0) {
    return { gecerli: false, sebep: 'skor-gecersiz' };
  }
  // Süre turdan uzun/kısa olamaz (±2 sn tolerans: rAF sapması, sekme kısılması)
  if (ozet.sureMs < TUR_SURESI_MS - 2_000 || ozet.sureMs > TUR_SURESI_MS + 2_000) {
    return { gecerli: false, sebep: 'sure-tutarsiz' };
  }
  // Yakalanan + kaçan, spawn edilen gerçek sayısını aşamaz
  if (ozet.yakalanan + ozet.kacan > GERCEK_SAYISI) {
    return { gecerli: false, sebep: 'gercek-sayisi-asildi' };
  }
  if (ozet.yakalanan < 0 || ozet.kacan < 0 || ozet.yanlisDokunma < 0 || ozet.kart < 0) {
    return { gecerli: false, sebep: 'negatif-deger' };
  }
  // Olay listesi özetle tutarlı olmalı
  const y = olaylar.filter((o) => o === 'yakala').length;
  const k = olaylar.filter((o) => o === 'kacir').length;
  if (y !== ozet.yakalanan || k !== ozet.kacan) {
    return { gecerli: false, sebep: 'olay-ozet-uyusmazligi' };
  }
  // Fiziksel kart tavanı — 10× pay bırakılır (sentez: dürüst oyuncuyu kesme)
  if (ozet.kart > HIZ_TAVANI_KART_SN * 10 * (TUR_SURESI_MS / 1000)) {
    return { gecerli: false, sebep: 'kart-sayisi-imkansiz' };
  }
  // Sunucu skoru bağımsız hesaplar; istemcinin bildirdiği ile uyuşmak zorunda
  const { skor } = hesaplaSkor(ozet, olaylar);
  if (Math.abs(skor - bildirilenSkor) > 1) {
    return { gecerli: false, sebep: 'skor-yeniden-hesap-uyusmazligi' };
  }
  return { gecerli: true };
}

/** Sunucu her zaman KENDİ hesabını yazar — istemci sayısına asla güvenilmez. */
export function sunucuSkoru(ozet: TurOzeti, olaylar: Array<'yakala' | 'kacir'>): number {
  return hesaplaSkor(ozet, olaylar).skor;
}
