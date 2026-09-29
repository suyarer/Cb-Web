/**
 * @module pazarProgrami
 * Pazar Programı (2026-09-29) — `/pazar` sayfasının saf seçim kuralı: "Her Pazar bir etkinlik".
 *
 * SEÇİLMİŞ PROGRAM: sayfaya yalnız `PAZAR_PROGRAMI`'na yazılan girdi çıkar (girdi eklemek = commit = insan onayı; ortak
 * kulübün her etkinliği kendiliğinden reklam iniş sayfasına düşmez). Girdi DB'deki etkinlikle eşlenir: aynı kulüp · aynı
 * İstanbul günü · iptal/test değil · "test" başlıklı değil · alkol çağrışımı yok (başlık + açıklama + mekân). Eşleşme yoksa
 * kart girdideki bilgiyle "kayıtlar yakında" der. Fiyat ve tanıtım girdide (ev sahibiyle teyitli) — ev sahibinin serbest
 * açıklaması GÖSTERİLMEZ, yalnız alkol süzgecine girer (kişisel veri / yanlış fiyat okuma riski; plan hasım H4, H8).
 * Test: `node scripts/pazar.test.mts`.
 *
 * @governing_law BEAN_ANAYASASI, KVKK_ANAYASASI K6
 */

export interface ProgramGirdisi {
  /** İstanbul günü, YYYY-MM-DD (Pazar olmalı — test bekçisi). */
  tarih: string;
  kulupId: string;
  /** Görünen ad (DB adı küçük harf olabilir). */
  kulupAdi: string;
  baslik: string;
  tanitim: string;
  /** Toplam katılım ücreti (TL); null = ücretsiz. Ödeme ev sahibine, uygulama dışında. */
  ucretTl: number | null;
  dahil: string | null;
  /** Ortağın reklam iniş sayfasında gösterim onayının kaydı (boş olamaz — test bekçisi). */
  izin: string;
}

/** Programa girdi eklemek insan onayıdır: tarih + kulüp + teyitli ücret + ortak onayı. */
export const PAZAR_PROGRAMI: readonly ProgramGirdisi[] = [
  {
    tarih: '2026-10-25',
    kulupId: 'cbfdbede-2692-405f-a64a-2fdf116e0952',
    kulupAdi: 'Rotaİsta',
    baslik: 'Vision Board Workshop',
    tanitim:
      'Sonbaharın ruhuyla: hedeflerimizi panoya dönüştürüyoruz. Birlikte hayal edip ilham alıyor, kafamızdaki hedefleri somut bir görsele çeviriyoruz.',
    ucretTl: 350,
    dahil: 'tüm atölye malzemeleri ve filtre kahve',
    izin: 'kullanıcı 2026-09-29: dış ev sahibi, reklamda kulüp ve etkinlik adının kullanımına izin verdi',
  },
];

export interface EtkinlikSatiri {
  id: string;
  club_id: string;
  title: string | null;
  start_time: string;
  venue_name: string | null;
  max_capacity: number | null;
  current_attendees: number | null;
  is_cancelled: boolean | null;
  is_test: boolean | null;
  identity_required: boolean | null;
  /** Yalnız alkol süzgecine girer; sayfada GÖSTERİLMEZ. */
  description: string | null;
}

export interface PazarKalemi {
  girdi: ProgramGirdisi;
  etkinlik: EtkinlikSatiri | null;
  dolu: boolean;
}

const TZ = 'Europe/Istanbul';

/** ISO an → İstanbul günü 'YYYY-MM-DD' (en-CA biçimi yıl-ay-gün). */
export function istanbulGunu(iso: string): string | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

/** 'YYYY-MM-DD' → "25 Ekim Pazar" (öğlen İstanbul'u kullanılır; gün sınırı kaymaz). */
export function istanbulTarih(tarih: string): string {
  const d = new Date(`${tarih}T12:00:00+03:00`);
  return new Intl.DateTimeFormat('tr-TR', { timeZone: TZ, day: 'numeric', month: 'long', weekday: 'long' }).format(d);
}

/** "25 Ekim Pazar, 14:00" — sunucu UTC'de çalışsa da saat İstanbul'a göre. */
export function istanbulTarihSaat(iso: string): string {
  const d = new Date(iso);
  const saat = new Intl.DateTimeFormat('tr-TR', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false }).format(d);
  return `${istanbulTarih(istanbulGunu(iso) ?? '')}, ${saat}`;
}

function sozcukler(...metinler: (string | null | undefined)[]): string[] {
  return metinler
    .filter((m): m is string => Boolean(m))
    .join(' ')
    .toLocaleLowerCase('tr-TR')
    .split(/[^\p{L}]+/u)
    .filter(Boolean);
}

/** Resmi kulüp test etkinliklerini `is_test` olmadan açıyor ("Test 1 / herkese açık") → ilk sözcük tam "test" ise test. */
export function testBasligi(baslik: string | null): boolean {
  return sozcukler(baslik)[0] === 'test';
}

// Alkol süzgeci (TR 4250 reklam yasağı + Meta politikası; 04 §2: alkol satan mekâna davet de alkol atfı). Sözcük bazlı: alt-dizi
// eşleme "biraz"/"sipariş"i yakalardı (hasım H2). Tam sözcükler + kökler (ünsüz yumuşaması dahil: şarap/şarab).
const ALKOL_SOZCUK = new Set([
  'bira', 'biralar', 'birası', 'birayı', 'bar', 'barı', 'barda', 'pub', 'wine', 'wines', 'beer', 'sip', 'cocktail', 'cocktails',
  'viski', 'whisky', 'whiskey', 'votka', 'vodka', 'tekila', 'tequila', 'likör', 'gin', 'rom', 'rum', 'bourbon', 'vermut', 'martini',
  'margarita', 'negroni', 'mimosa', 'sake', 'cider', 'prosecco', 'şampanya', 'champagne', 'sangria', 'mojito', 'aperol', 'spritz',
  'rakı', 'rakısı', 'rakılı', 'raki', 'içki', 'içkili', 'alkol', 'alkollü',
]);
// "rakı" kök DEĞİL: "rakım" (yükseklik) yanlış alarm verirdi (7b bulgusu) → tam sözcük listesinde.
const ALKOL_KOK = ['şarap', 'şarab', 'kokteyl', 'meyhane', 'kadeh'];
const ALKOL_EMOJI = /[🍷🥂🍹🍺🍻🍸🥃🍾]/u;

export function alkolCagrisimi(...metinler: (string | null | undefined)[]): boolean {
  if (metinler.some((m) => m && ALKOL_EMOJI.test(m))) return true;
  return sozcukler(...metinler).some((s) => ALKOL_SOZCUK.has(s) || ALKOL_KOK.some((k) => s.startsWith(k)));
}

/**
 * DB sorgusunun alt sınırı: şimdi − 24 sa. Başlamış etkinlik de gelmeli ki `pazarProgrami` o Pazar'ı "geçti" sayıp sıradakine
 * geçsin; `start_time > şimdi` ile etkinlik günü başlangıçtan gece yarısına kadar kart "kayıtlar yakında" diyordu (7b bulgusu).
 */
export function sorguAltSiniri(simdi: Date): Date {
  return new Date(simdi.getTime() - 24 * 60 * 60 * 1000);
}

/** Kalan yer; kapasite bilinmiyorsa null. */
export function kalanYer(e: EtkinlikSatiri): number | null {
  if (e.max_capacity == null) return null;
  return Math.max(0, e.max_capacity - (e.current_attendees ?? 0));
}

/** Kimlik satırı yalnız etkinlik açıkça kimlik istemiyorsa susar (DB varsayılanı true). */
export function kimlikGerekirMi(e: EtkinlikSatiri): boolean {
  return e.identity_required !== false;
}

/** Girdinin etkinliği: aynı kulüp + aynı İstanbul günü + iptal/test değil + test başlıklı değil + alkolsüz; en erken. */
export function eslesenEtkinlik(girdi: ProgramGirdisi, satirlar: EtkinlikSatiri[]): EtkinlikSatiri | null {
  const adaylar = satirlar
    .filter((e) => e.club_id === girdi.kulupId && istanbulGunu(e.start_time) === girdi.tarih)
    .filter((e) => !e.is_cancelled && !e.is_test && !testBasligi(e.title))
    .filter((e) => !alkolCagrisimi(e.title, e.description, e.venue_name))
    .sort((a, b) => Date.parse(a.start_time) - Date.parse(b.start_time));
  return adaylar[0] ?? null;
}

export function pazarProgrami(
  program: readonly ProgramGirdisi[],
  satirlar: EtkinlikSatiri[],
  simdi: Date,
): { buPazar: PazarKalemi | null; sonrakiler: PazarKalemi[] } {
  const bugun = istanbulGunu(simdi.toISOString()) ?? '';
  const kalemler = [...program]
    .filter((g) => g.tarih >= bugun)
    .sort((a, b) => a.tarih.localeCompare(b.tarih))
    .map((girdi) => {
      const etkinlik = eslesenEtkinlik(girdi, satirlar);
      return { girdi, etkinlik, dolu: etkinlik ? kalanYer(etkinlik) === 0 : false };
    })
    // Etkinlik başladıysa o Pazar geçmiştir; bir sonrakine geçilir.
    .filter((k) => !k.etkinlik || Date.parse(k.etkinlik.start_time) > simdi.getTime());
  return { buPazar: kalemler[0] ?? null, sonrakiler: kalemler.slice(1, 4) };
}
