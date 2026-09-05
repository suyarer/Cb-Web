/**
 * Skor tablosu test verisi temizliği — LANSMANDAN ÖNCE ÇALIŞTIRILMALI.
 *
 * Neden gerekli: geliştirme sırasında canlı Upstash'e test kayıtları yazıldı.
 * Bunlardan biri 1594 puan — teorik tavan 1605. Gerçek bir oyuncunun asla
 * ulaşamayacağı bu skor tablonun tepesinde dururken "yarış" mekaniği ölür:
 * gelen herkes ilk bakışta geçilemez bir sayı görür ve denemez.
 *
 * Kullanım (Upstash kimlik bilgileri ortamda olmalı):
 *   node --env-file=.env.local scripts/oyun-temizle.mjs           # yalnız gösterir
 *   node --env-file=.env.local scripts/oyun-temizle.mjs --uygula  # gerçekten siler
 *
 * Varsayılan KURU ÇALIŞMA'dır: --uygula verilmeden hiçbir şey silinmez.
 */

import { Redis } from '@upstash/redis';

const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

if (!url || !token) {
  console.error('Upstash ortam değişkenleri yok. --env-file=.env.local ile çalıştır.');
  process.exit(1);
}

const uygula = process.argv.includes('--uygula');
const redis = new Redis({ url, token });

// SCAN tek desen alır; her önek için ayrı geçiş
const desenler = ['lb:*', 'nick:*', 'run:*', 'nickowner:*', 'sess:*'];
const hepsi = new Set();
for (const d of desenler) {
  let i = '0';
  do {
    const [yeni, parti] = await redis.scan(i, { match: d, count: 200 });
    i = yeni;
    for (const k of parti) hepsi.add(k);
  } while (i !== '0');
}

const liste = [...hepsi].sort();
console.log(`Bulunan anahtar: ${liste.length}`);
for (const k of liste) console.log('  ' + k);

if (!uygula) {
  console.log('\nKURU ÇALIŞMA — hiçbir şey silinmedi. Silmek için: --uygula');
  process.exit(0);
}

if (liste.length) {
  await redis.del(...liste);
  console.log(`\n${liste.length} anahtar silindi. Tablo sıfırlandı.`);
} else {
  console.log('\nSilinecek anahtar yok.');
}
