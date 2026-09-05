/**
 * Akış kartı üretimi — saf, deterministik (DOM yok).
 *
 * İki denetim düzeltmesi (2026-09-05):
 *  - oyun-tasarimi-9: havuz kademe başına 7 metin; ardışık iki kartta aynı metin
 *    %13, 5 kartlık görünür pencerede tekrar %86 çıkıyordu. Komşu kontrolü:
 *    seçilen metin bir önceki kartla aynıysa havuzda bir sonrakine geçilir.
 *  - oyun-tasarimi-8: aynı gün her tur birebir aynı içerikti. Spawn TAKVİMİ günlük
 *    kalır (tablo adaleti, "aynı 12 gerçek, aynı sıra" vaadi), yalnız kart ve
 *    davet METİNLERİ tur numarasıyla karılır — skora etkisi yok.
 */

import { rng } from '@/lib/game/engine';
import { AKIS_ADLARI, FEED, GERCEK_DAVETLER, type Kademe } from '@/content/sosyal-obezite-feed';

export function kademeIcin(gecenMs: number): Kademe {
  if (gecenMs < 12_000) return 'anlamli';
  if (gecenMs < 25_000) return 'klise';
  if (gecenMs < 38_000) return 'bos';
  return 'boskutu';
}

export type KartVerisi = {
  metin: string;
  ad: string;
  renk: number;
  medya: boolean;
  buyuk: boolean;
  sayilar: [number, number, number];
};

const HAVUZLAR: Record<Kademe, string[]> = {
  anlamli: FEED.filter((f) => f.kademe === 'anlamli').map((f) => f.metin),
  klise: FEED.filter((f) => f.kademe === 'klise').map((f) => f.metin),
  bos: FEED.filter((f) => f.kademe === 'bos').map((f) => f.metin),
  boskutu: FEED.filter((f) => f.kademe === 'boskutu').map((f) => f.metin),
};

function metinSec(havuz: string[], r: number, onceki: string | null): string {
  if (!havuz.length) return '';
  let i = Math.floor(r * havuz.length);
  if (havuz.length > 1 && havuz[i] === onceki) i = (i + 1) % havuz.length;
  return havuz[i];
}

/** Tur karması: tur 1 için seed'in kendisi; sonraki turlarda deterministik kayma. */
export function turSeedi(seedInt: number, turNo: number): number {
  return (seedInt + Math.max(0, turNo - 1) * 2_654_435_761) >>> 0;
}

function hamKart(index: number, kademe: Kademe, seedInt: number) {
  const r = rng(seedInt + index * 7919);
  const ad = AKIS_ADLARI[Math.floor(r() * AKIS_ADLARI.length)];
  const varyant = r(); // 0-1: <0.45 metin, <0.75 medyalı, else büyük punto
  const metinR = r();
  return {
    ad,
    metinR,
    renk: Math.floor(r() * 360),
    medya: varyant >= 0.45 && varyant < 0.75,
    buyuk: varyant >= 0.75,
    sayilar: [Math.floor(r() * 900), Math.floor(r() * 90), Math.floor(r() * 20)] as [number, number, number],
    havuz: HAVUZLAR[kademe],
  };
}

export function kartVerisi(index: number, kademe: Kademe, seedInt: number): KartVerisi {
  const onceki = index > 0 ? hamKart(index - 1, kademe, seedInt) : null;
  const oncekiMetin = onceki ? metinSec(onceki.havuz, onceki.metinR, null) : null;
  const k = hamKart(index, kademe, seedInt);
  return {
    metin: metinSec(k.havuz, k.metinR, oncekiMetin),
    ad: k.ad,
    renk: k.renk,
    medya: k.medya,
    buyuk: k.buyuk,
    sayilar: k.sayilar,
  };
}

/** n. gerçeğin davet metni — bir öncekiyle aynı olmaz. */
export function gercekDaveti(n: number, seedInt: number): { metin: string; renk: number } {
  const sec = (i: number, onceki: string | null) => {
    const r = rng(seedInt + i * 104_729);
    const metin = metinSec(GERCEK_DAVETLER, r(), onceki);
    return { metin, renk: Math.floor(r() * 360) };
  };
  const onceki = n > 0 ? sec(n - 1, null).metin : null;
  return sec(n, onceki);
}
