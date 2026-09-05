import { cookies } from 'next/headers';
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

/**
 * Kimlik ve köken (origin) katmanı — spec §5.3.
 *
 * ÖNCEKİ HATA: skor tablosunun sorted-set member'ı takma adın kendisiydi.
 * Sonuç: A kullanıcısı `takmaAd:'Ayşe'` yazıp ZADD GT ile B'nin skorunu
 * ezebiliyordu; GT tek yönlü olduğu için B adını bir daha geri alamıyordu.
 * Doğrusu: member = anonId (kalıcı, httpOnly cookie), takma ad ayrı hash'te,
 * ad sahipliği iskelet üzerinden SETNX ile rezerve edilir.
 *
 * İMZALI ÇEREZ (denetim guvenlik-1, 2026-09-05): çerez değeri düz UUID'yken istemci
 * kendi kimliğini seçebiliyor ('cb_oyun_id=0000…' kabul ediliyordu) ve çerez döndüren
 * bot her submit'te yeni tablo satırı açıyordu. Artık değer `uuid.imza`; imza sunucu
 * sırrıyla HMAC-SHA256. Sır: OYUN_CEREZ_SIRRI env'i, yoksa Redis token'ından türetilir
 * (zaten sunucu-only sır; yeni env gerektirmez). İkisi de yoksa imzasız mod (yerel,
 * Redis'siz — tablo zaten kapalı).
 *
 * Origin denetimi anonId cookie'sinden ÖNCE gelmek zorunda: cookie eklendiği
 * an, content-type'sız simple-request ile yapılabilen cross-site POST gerçek
 * bir CSRF yazma vektörüne yükselir.
 */

const COOKIE = 'cb_oyun_id';
const BIR_YIL = 60 * 60 * 24 * 365;
const UUID_RE = /^[0-9a-f-]{36}$/i;

function cerezSirri(): string | null {
  const acik = process.env.OYUN_CEREZ_SIRRI;
  if (acik) return acik;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return token ? `oyun-cerez:${token}` : null;
}

function imzala(uuid: string): string | null {
  const sir = cerezSirri();
  if (!sir) return null;
  return createHmac('sha256', sir).update(uuid).digest('base64url').slice(0, 22);
}

/** Çerez değerini doğrular; geçerliyse anonId (UUID) döner. */
function cerezCoz(deger: string | undefined): string | null {
  if (!deger) return null;
  const [uuid, imza] = deger.split('.');
  if (!uuid || !UUID_RE.test(uuid)) return null;
  const beklenen = imzala(uuid);
  if (beklenen === null) return imza ? null : uuid; // imzasız mod
  if (!imza || imza.length !== beklenen.length) return null;
  return timingSafeEqual(Buffer.from(imza), Buffer.from(beklenen)) ? uuid : null;
}

/** İzinli kökenler. Origin YOKSA geçer — eski WebView'lar boş gönderir. */
export function originGecerli(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true;
  try {
    const { hostname, protocol, port } = new URL(origin);
    if (protocol !== 'https:' && hostname !== 'localhost' && hostname !== '127.0.0.1') return false;
    // Port farkı (clubbeans.com:8443) kabul edilmiyordu ama edilmemeli — denetim guvenlik-6
    if (port && hostname !== 'localhost' && hostname !== '127.0.0.1') return false;
    if (hostname === 'clubbeans.com' || hostname === 'www.clubbeans.com') return true;
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true;
    // Önizleme: herkese açık *.vercel.app yerine yalnız BU dağıtımın adresi
    const kendi = [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL]
      .filter(Boolean)
      .map((h) => String(h).toLowerCase());
    return kendi.includes(hostname.toLowerCase());
  } catch {
    return false;
  }
}

/**
 * Kalıcı anonim kimlik. Yoksa/imza tutmuyorsa üretir ve çerezi yazar.
 * Kişisel veri değil: rastgele UUID, hiçbir profile bağlanmıyor.
 */
export async function anonIdAlVeYaz(): Promise<string> {
  const jar = await cookies();
  const mevcut = cerezCoz(jar.get(COOKIE)?.value);
  if (mevcut) return mevcut;
  const yeni = randomUUID();
  const imza = imzala(yeni);
  jar.set(COOKIE, imza ? `${yeni}.${imza}` : yeni, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: BIR_YIL,
  });
  return yeni;
}

/** Yalnız okur — yoksa/geçersizse null. Submit'te kimlik zorunlu olduğu için ayrı. */
export async function anonIdOku(): Promise<string | null> {
  const jar = await cookies();
  return cerezCoz(jar.get(COOKIE)?.value);
}

/**
 * İstemci IP'si.
 *
 * clubbeans.com Cloudflare proxy'sinin arkasında; Vercel `x-real-ip`'i Cloudflare çıkış
 * IP'siyle EZİYOR (denetim site-regresyon-1, CONFIRMED: tüm oyuncular tek hız-sınırı
 * kovasına düşüyordu). Cloudflare'dan gelen istekte (`cf-ray` var) gerçek IP
 * `cf-connecting-ip`; onun dışında Vercel platform başlıkları. XFF'in sol ucu
 * istemci tarafından uydurulabildiği için hiç okunmaz (spec §5.3).
 * IP hiç yoksa null döner; çağıran taraf ayrı, daha sıkı 'ipsiz' kovası kullanır.
 */
export function istemciIp(req: Request): string | null {
  if (req.headers.get('cf-ray')) {
    const cf = req.headers.get('cf-connecting-ip')?.trim();
    if (cf) return cf;
  }
  const real = req.headers.get('x-real-ip')?.trim();
  if (real) return real;
  const vercel = req.headers.get('x-vercel-forwarded-for')?.trim();
  if (vercel) return vercel.split(',')[0]?.trim() || null;
  return null;
}
