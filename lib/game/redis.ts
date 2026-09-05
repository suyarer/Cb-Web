import { Redis } from '@upstash/redis';

/**
 * Tembel Redis — env yoksa null döner, PATLAMAZ.
 *
 * `Redis.fromEnv()` modül seviyesinde çağrılırsa env eksikken import anında
 * throw eder; Next.js'te bu route'un soğuk başlangıçta 500 vermesi demektir.
 * Ayrıca yerelde .env olmadığı için sayfa hiç açılamıyordu.
 *
 * Sözleşme: null dönerse çağıran taraf "skor tablosu devre dışı" moduna geçer.
 * Oyunun kendisi Redis'siz oynanabilir — kampanya sayfasının tek bir altyapı
 * arızasıyla tamamen ölmesi kabul edilemez.
 *
 * ZAMAN AŞIMI (denetim guvenlik-7): Upstash askıda kalınca start 40 sn+ yanıtsızdı
 * (undici 10 sn × 5 yeniden deneme) ve "Redis yoksa oynanır" vaadi yalnız env
 * eksikliğinde tutuyordu. Yeniden deneme 1'e indirildi; her çağrı `zamanAsimi()`
 * ile sınırlandırılır, süre dolunca çağıran taraf tablosuz devam eder.
 */

let onbellek: Redis | null | undefined;

export function redisAl(): Redis | null {
  if (onbellek !== undefined) return onbellek;
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  onbellek = url && token ? new Redis({ url, token, retry: { retries: 1, backoff: () => 200 } }) : null;
  return onbellek;
}

export function redisVarMi(): boolean {
  return redisAl() !== null;
}

/** Sözü süreye bağlar; süre dolunca `yedek` döner (throw etmez). */
export async function zamanAsimi<T>(soz: Promise<T>, ms: number, yedek: T): Promise<T> {
  let zamanlayici: ReturnType<typeof setTimeout> | undefined;
  const bekleyici = new Promise<T>((resolve) => {
    zamanlayici = setTimeout(() => resolve(yedek), ms);
  });
  try {
    return await Promise.race([soz, bekleyici]);
  } catch {
    return yedek;
  } finally {
    if (zamanlayici) clearTimeout(zamanlayici);
  }
}

/**
 * Kill-switch (spec §12): iki katman.
 *  - Yapı zamanı: NEXT_PUBLIC_OYUN_KAPALI=1 (Vercel env → yeniden dağıtım gerekir)
 *  - Canlı, dağıtımsız: Redis `oyun:kapali` = '1' (scripts/oyun-kapat.mjs)
 * Redis'e ulaşılamazsa AÇIK sayılır (kapatma sinyali yoksa oyun oynanır).
 */
export async function oyunKapaliMi(redis: Redis | null): Promise<boolean> {
  if (process.env.NEXT_PUBLIC_OYUN_KAPALI === '1') return true;
  if (!redis) return false;
  const v = await zamanAsimi(redis.get<string | number>('oyun:kapali'), 800, null);
  return v === '1' || v === 1;
}
