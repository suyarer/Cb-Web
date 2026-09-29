/**
 * @module masaSecim
 * Masa Ritüeli Pilotu (2026-09-29) — /masa sayfasının saf seçim kuralı.
 *
 * Reklam adresi sabit kalır (clubbeans.com/masa); sayfa her istekte resmi kulübün sıradaki pilot
 * masasını (`PILOT_BASLIK_ONEKI`) bu kuralla bulur: iptal · geçmiş · test · başka başlık elenir; en yakın tarihli
 * ve yeri olan seçilir; hepsi doluysa en yakını "dolu" işaretiyle döner.
 * Test: `node scripts/masa.test.mts`.
 *
 * @governing_law BEAN_ANAYASASI, KVKK_ANAYASASI K6
 */

/** Resmi kulüp (ClubBeans Club) — pilot masalarını yalnız bu kulüp açar. */
export const RESMI_KULUP_ID = 'bbfb93e4-25dc-481f-ad07-e1698db4b672';

/**
 * Pilotun ritüel günü/saati — gün değişirse YALNIZ burası değişir (başlık öneki, sayfa metinleri, SQL deseni türer).
 * Kullanıcı kararı 2026-09-29: Pazar 15:00 (Perşembe 20:00'den; dayanak meta-reklam `masa-gunu-arastirmasi-2026-09-29`).
 * `saat` metinde eksiz kullanılır ("Her Pazar · 15:00") — Türkçe saat eki saate göre değişir.
 */
export const PILOT = { gun: 'Pazar', saat: '15:00', zamanIfadesi: 'Pazar öğleden sonra' } as const;

/** Pilot masa başlığının kanonik öneki; karşılaştırma harf/aksan katlanmış yapılır. */
export const PILOT_BASLIK_ONEKI = `${PILOT.gun} Masası`;

export interface MasaSatiri {
  id: string;
  title: string | null;
  start_time: string;
  venue_name: string | null;
  max_capacity: number | null;
  current_attendees: number | null;
  is_cancelled: boolean | null;
  is_test: boolean | null;
  identity_required: boolean | null;
}

export interface SeciliMasa {
  masa: MasaSatiri;
  dolu: boolean;
}

const KATLA: Record<string, string> = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u' };

/** tr-TR küçült + Türkçe harfi ASCII'ye katla: "PERŞEMBE MASASI" = "Persembe Masasi" = kanonik. */
function katla(s: string): string {
  return s.toLocaleLowerCase('tr-TR').replace(/[çğıöşü]/g, (h) => KATLA[h]).trim();
}

const ONEK = katla(PILOT_BASLIK_ONEKI);

/**
 * DB ön süzgeci için `ILIKE` deseni. DB collation en_US.UTF-8 Türkçe harfi katlamaz ve `İ` küçülünce iki kod
 * noktası olur (`_` eşleşmez — canlı SQL 2026-09-29: 'PAZARTESİ MASASI' ILIKE 'pazartes_ masas_%' = false) →
 * Türkçe harfler ve `i` `%` olur. Desen gevşektir; kesin eleme `pilotMasasiMi`'de.
 */
export function ilikeDeseni(onek: string): string {
  return `${onek.trim().toLocaleLowerCase('tr-TR').replace(/[çğıöşüi]/g, '%')}%`.replace(/%+/g, '%');
}

export function pilotMasasiMi(baslik: string | null): boolean {
  return baslik != null && katla(baslik).startsWith(ONEK);
}

/** Kalan yer; kapasite bilinmiyorsa null (sayfa "X yer kaldı" demez). */
export function kalanYer(m: MasaSatiri): number | null {
  if (m.max_capacity == null) return null;
  return Math.max(0, m.max_capacity - (m.current_attendees ?? 0));
}

/**
 * Sayfa "ilk biletinde kimliğini doğrularsın" demeli mi? Masa bazında `identity_required` (DB varsayılanı true);
 * yalnız açıkça false ise susar — sayfa metni masanın gerçek ayarıyla çelişmesin (7b bulgusu, 2026-09-29).
 */
export function kimlikGerekirMi(m: MasaSatiri): boolean {
  return m.identity_required !== false;
}

export function siradakiMasa(satirlar: MasaSatiri[], simdi: Date): SeciliMasa | null {
  const gelecek = satirlar
    .filter((m) => !m.is_cancelled && !m.is_test && pilotMasasiMi(m.title))
    .map((m) => ({ m, t: Date.parse(m.start_time) }))
    .filter(({ t }) => Number.isFinite(t) && t > simdi.getTime())
    .sort((x, y) => x.t - y.t)
    .map(({ m }) => m);
  if (gelecek.length === 0) return null;
  const yeriOlan = gelecek.find((m) => kalanYer(m) !== 0);
  return yeriOlan ? { masa: yeriOlan, dolu: false } : { masa: gelecek[0], dolu: true };
}

/** "11 Ekim Pazar, 15:00" — sunucu UTC'de çalışsa da saat İstanbul'a göre. */
export function istanbulTarihSaat(iso: string): string {
  const d = new Date(iso);
  const gun = new Intl.DateTimeFormat('tr-TR', { timeZone: 'Europe/Istanbul', day: 'numeric', month: 'long', weekday: 'long' }).format(d);
  const saat = new Intl.DateTimeFormat('tr-TR', { timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit', hour12: false }).format(d);
  return `${gun}, ${saat}`;
}
