/**
 * Kill-switch (spec §12) — dağıtımsız, <1 dk.
 *
 *   node --env-file=.env.local scripts/oyun-kapat.mjs            # durumu göster
 *   node --env-file=.env.local scripts/oyun-kapat.mjs --kapat    # oyun:kapali=1
 *   node --env-file=.env.local scripts/oyun-kapat.mjs --ac       # bayrağı kaldır
 *
 * Etki: /api/game/start 503 {hata:'kapali'} → sayfa "Akış bir ara verdi" (Yakinda);
 * submit 503 tablo-kapali; leaderboard acik:false. Yeniden dağıtım gerekmez.
 * Yedek katman: Vercel env NEXT_PUBLIC_OYUN_KAPALI=1 (+ Redeploy).
 */

import { Redis } from '@upstash/redis';

const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
if (!url || !token) {
  console.error('Upstash ortam değişkenleri yok. --env-file=.env.local ile çalıştır.');
  process.exit(1);
}
const redis = new Redis({ url, token });

if (process.argv.includes('--kapat')) {
  await redis.set('oyun:kapali', '1');
  console.log('oyun:kapali = 1 → start 503, oyun "Akış bir ara verdi" ekranına düşer.');
} else if (process.argv.includes('--ac')) {
  await redis.del('oyun:kapali');
  console.log('oyun:kapali silindi → oyun açık.');
} else {
  const v = await redis.get('oyun:kapali');
  console.log(v === '1' || v === 1 ? 'Durum: KAPALI (oyun:kapali=1)' : 'Durum: AÇIK');
}
