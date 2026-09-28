/**
 * Reklam ölçüm köprüsü (2026-09-29) — kampanya etiketi temizleme + reklam trafiği tespiti.
 * Neden: reklamdan /bean/[id]'e gelen kişi 2 sn'de mağazaya atılıyordu (masayı okuyamadan) ve mağaza linki
 * kampanyasızdı; /indir reklamın kampanya adını mağazaya taşımıyordu.
 * Çalıştır: node scripts/appLinks.test.mts
 */
import { kampanyaTemiz, reklamTrafigiMi, magazaLinki, sayfaKampanyasi } from '../lib/appLinks.ts';

let fail = 0;
const ok = (c: boolean, m: string, x = '') => { if (!c) { console.log('  ✗', m, x); fail++; } else console.log('  ✓', m); };

// kampanyaTemiz — URL'den gelen serbest metin mağaza linkine ham akmasın
ok(kampanyaTemiz('dogumgunu_deneme', 'indir') === 'dogumgunu_deneme', 'geçerli ad aynen');
ok(kampanyaTemiz('Doğum Günü Deneme', 'indir') === 'dogum_gunu_deneme', 'Türkçe harf + boşluk normalize', kampanyaTemiz('Doğum Günü Deneme', 'indir'));
ok(kampanyaTemiz('İSTANBUL-şık', 'indir') === 'istanbul-sik', 'büyük İ ve ş', kampanyaTemiz('İSTANBUL-şık', 'indir'));
ok(kampanyaTemiz(undefined, 'masa_e05e4108') === 'masa_e05e4108', 'yoksa varsayılan');
ok(kampanyaTemiz('', 'indir') === 'indir', 'boşsa varsayılan');
ok(kampanyaTemiz('   ', 'indir') === 'indir', 'yalnız boşluksa varsayılan');
ok(kampanyaTemiz('<script>', 'indir') === 'script', 'işaretler atılır', kampanyaTemiz('<script>', 'indir'));
ok(kampanyaTemiz('!!!', 'indir') === 'indir', 'hiç geçerli karakter yoksa varsayılan');
ok(kampanyaTemiz('a'.repeat(60), 'indir').length === 40, '40 karaktere kısalır');
ok(kampanyaTemiz(['x', 'y'], 'indir') === 'x', 'dizi gelirse ilki (Next searchParams)');

// reklamTrafigiMi — Meta her reklam tıklamasına fbclid ekler; panelden utm'siz kurulan reklam da tanınsın
ok(reklamTrafigiMi('?utm_source=meta&utm_campaign=x') === true, 'utm_source → reklam');
ok(reklamTrafigiMi('?fbclid=IwAR123') === true, 'fbclid → reklam');
ok(reklamTrafigiMi('?utm_source=') === false, 'boş utm_source reklam değil');
ok(reklamTrafigiMi('') === false, 'parametresiz = organik paylaşım');
ok(reklamTrafigiMi('?ref=share') === false, 'başka parametre = organik');

// sayfaKampanyasi — site indirme düğmeleri (ana sayfa/alt sayfa): reklam trafiğini organikten ayır (2026-09-29)
// "Doğum günü deneme" reklamı ana sayfaya yalnız fbclid ile iniyor; düğmeler kampanyasızdı → kurulum ayrışmıyordu
ok(sayfaKampanyasi('?utm_source=meta&utm_campaign=Doğum Günü', 'site_hero') === 'dogum_gunu', 'utm_campaign öncelikli');
ok(sayfaKampanyasi('?fbclid=IwAR1', 'site_hero') === 'meta_site_hero', 'yalnız fbclid → meta_ öneki');
ok(sayfaKampanyasi('', 'site_hero') === 'site_hero', 'organik → varsayılan');
ok(sayfaKampanyasi('?utm_source=meta', 'site_hero') === 'meta_site_hero', 'utm_source var, kampanya yok → meta_ öneki');

// magazaLinki kampanya taşır (mevcut davranış korunur)
ok(magazaLinki('ios', 'masa_e05e4108', 'reklam').includes('ct=masa_e05e4108'), 'iOS ct');
// Apple ct'yi yalnız pt (sağlayıcı kimliği) ile raporlar — pt herkese açık bir kimlik, env yoksa varsayılan (2026-09-29)
ok(magazaLinki('ios', 'x').includes('pt=129009038&ct=x'), 'iOS pt varsayılanı', magazaLinki('ios', 'x'));
ok(decodeURIComponent(magazaLinki('android', 'masa_e05e4108', 'reklam')).includes('utm_campaign=masa_e05e4108&') ||
   decodeURIComponent(magazaLinki('android', 'masa_e05e4108', 'reklam')).endsWith('utm_campaign=masa_e05e4108'), 'Play referrer utm_campaign');

console.log(fail ? `\n✗ ${fail} başarısız` : '\n✅ GEÇTİ');
process.exit(fail ? 1 : 0);
