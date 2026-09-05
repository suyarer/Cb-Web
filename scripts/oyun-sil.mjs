/**
 * Skor tablosundan tek oyuncuyu silme / moderasyon — KVKK m.11 silme talebi ve
 * marka taklidi/hile durumları için. Varsayılan KURU ÇALIŞMA; --uygula olmadan
 * hiçbir şey silinmez.
 *
 * Kullanım:
 *   node --env-file=.env.local scripts/oyun-sil.mjs --ad "Takma Ad"            # göster
 *   node --env-file=.env.local scripts/oyun-sil.mjs --ad "Takma Ad" --uygula   # sil
 *   node --env-file=.env.local scripts/oyun-sil.mjs --ad "Takma Ad" --uygula --engelle
 *     → ayrıca anonId'yi oyun:engelli kümesine ekler; submit bu kimlikten skor kabul etmez
 *
 * Zincir: takma ad → iskelet → nickowner:{iskelet} → anonId → lb:all + lb:day:* (ZREM),
 *         nick:{anonId}, nickowner:{iskelet}, runs:{anonId} → run:{runId}* (DEL).
 * runs:{anonId} indeksi F13 ile yazılmaya başlar; eski kayıtlarda run:* taraması
 * (SCAN + JSON takmaAd karşılaştırması) yedek yoldur.
 */

import { Redis } from '@upstash/redis';
import { iskelet } from '../lib/game/nickname.ts';

const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
if (!url || !token) {
  console.error('Upstash ortam değişkenleri yok. --env-file=.env.local ile çalıştır.');
  process.exit(1);
}

const argv = process.argv.slice(2);
const adIdx = argv.indexOf('--ad');
const ad = adIdx >= 0 ? argv[adIdx + 1] : null;
const uygula = argv.includes('--uygula');
const engelle = argv.includes('--engelle');
if (!ad) {
  console.error('Kullanım: --ad "Takma Ad" [--uygula] [--engelle]');
  process.exit(2);
}

const redis = new Redis({ url, token });
const isk = iskelet(ad);
const anonId = await redis.get(`nickowner:${isk}`);
if (!anonId) {
  console.log(`'${ad}' (iskelet ${isk}) için rezervasyon yok — tabloda böyle bir ad görünmüyor.`);
  process.exit(0);
}
console.log(`ad='${ad}' iskelet=${isk} anonId=${String(anonId).slice(0, 8)}…`);

async function tara(desen) {
  const out = [];
  let i = '0';
  do {
    const [yeni, parti] = await redis.scan(i, { match: desen, count: 200 });
    i = yeni;
    out.push(...parti);
  } while (i !== '0');
  return out;
}

const gunAnahtarlari = await tara('lb:day:*');
const runIndeks = await redis.smembers(`runs:${anonId}`).catch(() => []);
let runAnahtarlari = runIndeks.map((r) => `run:${r}`);
if (!runAnahtarlari.length) {
  // Yedek yol: eski kayıtlar için run:* taraması
  for (const k of await tara('run:*')) {
    const v = await redis.get(k);
    const o = typeof v === 'string' ? JSON.parse(v) : v;
    if (o && iskelet(String(o.takmaAd ?? '')) === isk) runAnahtarlari.push(k);
  }
}

console.log('Silinecekler:');
console.log(`  ZREM lb:all + ${gunAnahtarlari.length} günlük tablo (üye ${String(anonId).slice(0, 8)}…)`);
console.log(`  DEL nick:${String(anonId).slice(0, 8)}…, nickowner:${isk}, runs:${String(anonId).slice(0, 8)}…`);
for (const k of runAnahtarlari) console.log(`  DEL ${k}`);
if (engelle) console.log('  SADD oyun:engelli <anonId>');

if (!uygula) {
  console.log('\nKURU ÇALIŞMA — hiçbir şey silinmedi. Silmek için: --uygula');
  process.exit(0);
}

const p = redis.pipeline();
p.zrem('lb:all', anonId);
for (const g of gunAnahtarlari) p.zrem(g, anonId);
p.del(`nick:${anonId}`, `nickowner:${isk}`, `runs:${anonId}`);
if (runAnahtarlari.length) p.del(...runAnahtarlari);
if (engelle) p.sadd('oyun:engelli', anonId);
await p.exec();
console.log(`\nSilindi. ${runAnahtarlari.length} paylaşım kartı, ${gunAnahtarlari.length + 1} tablo üyeliği kaldırıldı${engelle ? ', kimlik engellendi' : ''}.`);
