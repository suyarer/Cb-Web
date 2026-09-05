import { cookies } from 'next/headers';
import { randomUUID } from 'node:crypto';

/**
 * Kimlik ve köken (origin) katmanı — spec §5.3.
 *
 * ÖNCEKİ HATA: skor tablosunun sorted-set member'ı takma adın kendisiydi.
 * Sonuç: A kullanıcısı `takmaAd:'Ayşe'` yazıp ZADD GT ile B'nin skorunu
 * ezebiliyordu; GT tek yönlü olduğu için B adını bir daha geri alamıyordu.
 * Doğrusu: member = anonId (kalıcı, httpOnly cookie), takma ad ayrı hash'te,
 * ad sahipliği iskelet üzerinden SETNX ile rezerve edilir.
 *
 * Origin denetimi anonId cookie'sinden ÖNCE gelmek zorunda: cookie eklendiği
 * an, content-type'sız simple-request ile yapılabilen cross-site POST gerçek
 * bir CSRF yazma vektörüne yükselir.
 */

const COOKIE = 'cb_oyun_id';
const BIR_YIL = 60 * 60 * 24 * 365;

/** İzinli kökenler. Origin YOKSA geçer — eski WebView'lar boş gönderir. */
export function originGecerli(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true;
  try {
    const { hostname, protocol } = new URL(origin);
    if (protocol !== 'https:' && hostname !== 'localhost' && hostname !== '127.0.0.1') return false;
    return (
      hostname === 'clubbeans.com' ||
      hostname === 'www.clubbeans.com' ||
      hostname.endsWith('.vercel.app') || // preview dağıtımları
      hostname === 'localhost' ||
      hostname === '127.0.0.1'
    );
  } catch {
    return false;
  }
}

/**
 * Kalıcı anonim kimlik. Yoksa üretir ve çerezi yazar.
 * Kişisel veri değil: rastgele UUID, hiçbir profile bağlanmıyor.
 */
export async function anonIdAlVeYaz(): Promise<string> {
  const jar = await cookies();
  const mevcut = jar.get(COOKIE)?.value;
  if (mevcut && /^[0-9a-f-]{36}$/i.test(mevcut)) return mevcut;
  const yeni = randomUUID();
  jar.set(COOKIE, yeni, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: BIR_YIL,
  });
  return yeni;
}

/** Yalnız okur — yoksa null. Submit'te kimlik zorunlu olduğu için ayrı. */
export async function anonIdOku(): Promise<string | null> {
  const jar = await cookies();
  const v = jar.get(COOKIE)?.value;
  return v && /^[0-9a-f-]{36}$/i.test(v) ? v : null;
}

/**
 * İstemci IP'si — spec §5.3 soldan-XFF desenini AÇIKÇA yasakladı.
 * XFF istemci tarafından uydurulabilir; Vercel platform header'ı `x-real-ip`
 * güvenilirdir. IP hiç yoksa null döner ve çağıran taraf sıkı limite bağlar
 * (tek "bilinmiyor" kovası tüm trafiği tek limite sıkıştırıyordu).
 */
export function istemciIp(req: Request): string | null {
  const real = req.headers.get('x-real-ip')?.trim();
  if (real) return real;
  const vercel = req.headers.get('x-vercel-forwarded-for')?.trim();
  if (vercel) return vercel.split(',')[0]?.trim() || null;
  return null;
}
