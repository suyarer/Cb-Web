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
 */

let onbellek: Redis | null | undefined;

export function redisAl(): Redis | null {
  if (onbellek !== undefined) return onbellek;
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  onbellek = url && token ? new Redis({ url, token }) : null;
  return onbellek;
}

export function redisVarMi(): boolean {
  return redisAl() !== null;
}
