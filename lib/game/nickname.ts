/**
 * SOSYAL OBEZİTE — takma ad denetimi.
 *
 * İki iş yapar:
 *  1) Küfür/hakaret filtresi — gömülü (substring) eşleşme, çünkü Türkçe'de
 *     kök kelime ek alarak gizlenir. FP kapısı: uzun kökler "landmine" listesine
 *     alınmaz (ör. masum kelime içinde geçenler).
 *  2) Taklit engeli — homoglif/boşluk normalizasyonu ile "iskelet" üretir;
 *     "ClubBeans", "C1ubBeans", "Club Beans" aynı iskelete iner ve rezerve edilir.
 *
 * Not: uygulamadaki (CB2026) küfür sistemi tier'lı ve daha geniştir. Bu, web
 * için sadeleştirilmiş taşımadır — tek kaynak DEĞİL, bilinçli kopya.
 */

/** Tam eşleşme aranan kısa kökler (gömülü arama FP üretir) */
const TAM_ESLESME = new Set([
  'oc', 'aq', 'as', 'sik', 'am', 'god', 'kro',
  // 'pic': GOMULU'da 'pic ' olarak duruyordu ama iskelet boşlukları sildiği için
  // kelime-sınırı kökü çıplak substring'e dönüşüp Picasso/Epic35/Tropical/Pictor/
  // Spiciy'i reddediyordu (canlı testle doğrulandı). Tam eşleşmeye taşındı.
  'pic',
]);

/** Gömülü (substring) aranan kökler — uzun oldukları için FP riski düşük */
const GOMULU = [
  'orospu', 'kahpe', 'yavsak', 'pezeven', 'gavat', 'ibne', 'top lak',
  'siktir', 'sikeyim', 'sikik', 'amcik', 'amina', 'aminakoy', 'anasini',
  'yavsa', 'gotver', 'gotune', 'kaltak', 'serefsiz', 'picler',
  'salak', 'gerizekali', 'oruspu', 'sirtlan',
];

/** Rezerve — marka ve yetki taklidi */
const REZERVE = [
  'clubbeans', 'club beans', 'admin', 'yonetici', 'moderator', 'destek',
  'clubbeansdestek', 'resmi', 'official', 'sosyalobezite',
];

/**
 * Karıştırılabilir harf SINIFLARI. Tek yönlü homoglif eşlemesi yetmez:
 * "1" hem i hem l yerine geçer, o yüzden {i,l,1} tek sembole ÇÖKER.
 * Bu yüzden hem girdi hem de yasak listeler AYNI fonksiyondan geçirilir —
 * yoksa "kaltak" kökü "kaitak" girdisini yakalamaz.
 */
const SINIFLAR: Array<[string, string]> = [
  ['i', 'iıİl1|!ïí'],
  ['o', 'o0öÖóòø'],
  ['s', 's5$şŞ'],
  ['a', 'a4@âäàá'],
  ['e', 'e3êëéè'],
  ['t', 't7'],
  ['g', 'g9ğĞ'],
  ['u', 'uüÜûùú'],
  ['c', 'cçÇ¢'],
  ['b', 'b8'],
  ['z', 'z2'],
  ['n', 'nñ'],
];

const SINIF_HARITASI: Record<string, string> = (() => {
  const m: Record<string, string> = {
    // kiril görsel ikizleri
    а: 'a', е: 'e', о: 'o', с: 'c', р: 'p', х: 'x', у: 'y', к: 'k', м: 'm', т: 't',
  };
  for (const [kanonik, uyeler] of SINIFLAR) {
    for (const ch of uyeler) m[ch] = kanonik;
  }
  return m;
})();

/** Karşılaştırma iskeleti: küçült, karıştırılabilir sınıfları çökert, gerisini at */
export function iskelet(s: string): string {
  return s
    .toLowerCase()
    .split('')
    .map((c) => SINIF_HARITASI[c] ?? c)
    .join('')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Yasak listeler girdiyle AYNI normalizasyondan geçer. Bu şart:
 * aksi halde "kaltak" kökü, iskeleti "kaitak" olan girdiyi kaçırır.
 */
const TAM_ESLESME_ISK = new Set([...TAM_ESLESME].map(iskelet).filter(Boolean));
const GOMULU_ISK = GOMULU.map(iskelet).filter(Boolean);
const REZERVE_ISK = REZERVE.map(iskelet).filter(Boolean);

export type AdSonucu =
  | { gecerli: true; temiz: string; iskelet: string }
  | { gecerli: false; mesaj: string };

export function takmaAdGecerli(ham: string): AdSonucu {
  // Görünmez karakter ve fazla boşluk temizliği
  const temiz = ham
    .replace(/[​-‍﻿⁠]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (temiz.length < 2) return { gecerli: false, mesaj: 'Takma ad en az 2 karakter olmalı.' };
  if (temiz.length > 20) return { gecerli: false, mesaj: 'Takma ad en fazla 20 karakter olabilir.' };

  // Yalnız harf, rakam, boşluk, alt çizgi, kısa çizgi, nokta
  if (!/^[\p{L}\p{N} _.\-]+$/u.test(temiz)) {
    return { gecerli: false, mesaj: 'Takma adda yalnız harf, rakam, boşluk ve _ . - kullanılabilir.' };
  }

  const isk = iskelet(temiz);
  if (!isk) return { gecerli: false, mesaj: 'Takma ad okunabilir olmalı.' };

  if (REZERVE_ISK.some((r) => isk === r)) {
    return { gecerli: false, mesaj: 'Bu takma ad ayrılmış. Başka bir şey dene.' };
  }

  const kelimeler = isk.match(/[a-z]+|[0-9]+/g) ?? [];
  if (kelimeler.some((k) => TAM_ESLESME_ISK.has(k))) {
    return { gecerli: false, mesaj: 'Bu takma ad uygun değil.' };
  }
  if (GOMULU_ISK.some((k) => isk.includes(k))) {
    return { gecerli: false, mesaj: 'Bu takma ad uygun değil.' };
  }

  return { gecerli: true, temiz, iskelet: isk };
}
