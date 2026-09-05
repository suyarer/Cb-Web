import {
  spawnTakvimi, hesaplaSkor, yakalamaPuani, mesafePuani, teorikTavan,
  aklaYatkin, beanFazi, rng, seedToInt,
  GERCEK_SAYISI, TUR_SURESI_MS, YAKALANABILIR_MS, HIZ_TAVANI_KART_SN,
} from '../lib/game/engine.ts';

let fail = 0;
const ok = (c, m, extra='') => { if (!c) { console.log('  ✗', m, extra); fail++; } else console.log('  ✓', m); };

console.log('\n== DETERMİNİZM ==');
const a = spawnTakvimi('abc'), b = spawnTakvimi('abc'), c = spawnTakvimi('xyz');
ok(JSON.stringify(a) === JSON.stringify(b), 'aynı seed → aynı takvim');
ok(JSON.stringify(a) !== JSON.stringify(c), 'farklı seed → farklı takvim');

console.log('\n== SPAWN TAKVİMİ ==');
ok(a.length === GERCEK_SAYISI, `tur başına ${GERCEK_SAYISI} gerçek`, a.length);
ok(a.every((t,i)=> i===0 || t>=a[i-1]), 'sıralı');
const sonSinir = TUR_SURESI_MS - YAKALANABILIR_MS;
ok(a.every(t => t>=500 && t<=sonSinir), `hepsi [500, ${sonSinir}] içinde`, JSON.stringify(a));
const ilk = spawnTakvimi('seed-1', true);
ok(ilk[0] >= 4000 && ilk[0] <= 6000, 'ilk turda ilk spawn 4-6 sn', ilk[0]);

console.log('\n== ÇARPAN MERDİVENİ ==');
ok(yakalamaPuani(['yakala']) === 50, '1. yakalama = 50');
ok(yakalamaPuani(['yakala','yakala']) === 125, '2 ardışık = 50+75', yakalamaPuani(['yakala','yakala']));
ok(yakalamaPuani(['yakala','yakala','yakala']) === 225, '3 ardışık = +100');
ok(yakalamaPuani(['yakala','yakala','kacir','yakala']) === 175, 'kaçırma çarpanı SIFIRLAR', yakalamaPuani(['yakala','yakala','kacir','yakala']));

console.log('\n== HIZ TAVANI ==');
ok(mesafePuani(480, 60000) === 480, 'tavanda tam puan');
ok(mesafePuani(5000, 60000) === 480, 'tavan üstü kaydırma EK PUAN VERMEZ', mesafePuani(5000,60000));

console.log('\n== TEORİK TAVAN ==');
const tav = teorikTavan();
ok(tav === 1605, 'tavan = 1605 (sentez §2.3)', tav);
const yak = yakalamaPuani(Array(12).fill('yakala'));
ok(Math.round(yak/tav*100) === 70, 'yakalama payı ~%70 (marka savunma hattı)', Math.round(yak/tav*100)+'%');

console.log('\n== CEZA VE TABAN ==');
const s = hesaplaSkor({kart:0,yakalanan:0,kacan:0,yanlisDokunma:99,sureMs:60000}, []);
ok(s.skor === 0, 'skor tabanı 0 (negatife düşmez)', s.skor);

console.log('\n== BEAN FAZLARI ==');
ok(beanFazi(0)===0 && beanFazi(11999)===0, 't<12sn → faz 0');
ok(beanFazi(12000)===1, '12sn → faz 1');
ok(beanFazi(57000)===5 && beanFazi(99999)===5, 'faz tavanı 5');

console.log('\n== AKLA-YATKINLIK ==');
const iyiOlay = ['yakala','yakala','kacir'];
const iyiOzet = {kart:300,yakalanan:2,kacan:1,yanlisDokunma:1,sureMs:60000};
const dogruSkor = hesaplaSkor(iyiOzet, iyiOlay).skor;
ok(aklaYatkin(iyiOzet, dogruSkor, iyiOlay).gecerli, 'dürüst tur kabul');
ok(!aklaYatkin(iyiOzet, 99999, iyiOlay).gecerli, 'şişirilmiş skor RED');
ok(!aklaYatkin({...iyiOzet,sureMs:5000}, dogruSkor, iyiOlay).gecerli, 'kısa süre RED');
ok(!aklaYatkin({...iyiOzet,yakalanan:99,kacan:99}, dogruSkor, iyiOlay).gecerli, 'gerçek sayısı aşımı RED');
ok(!aklaYatkin({...iyiOzet,yakalanan:5}, dogruSkor, iyiOlay).gecerli, 'olay/özet uyuşmazlığı RED');
ok(!aklaYatkin({...iyiOzet,kart:999999}, dogruSkor, iyiOlay).gecerli, 'imkansız kart sayısı RED');
// dürüst ama çok iyi oyuncu kesilmemeli
const pro = {kart:480,yakalanan:12,kacan:0,yanlisDokunma:0,sureMs:60000};
const proOlay = Array(12).fill('yakala');
ok(aklaYatkin(pro, hesaplaSkor(pro,proOlay).skor, proOlay).gecerli, 'MÜKEMMEL dürüst tur kabul (yanlış pozitif yok)');

console.log('\n== RNG DAĞILIMI ==');
const r = rng(seedToInt('dagilim'));
const n = 20000; let sum=0, min=1, max=0;
for(let i=0;i<n;i++){const v=r();sum+=v;min=Math.min(min,v);max=Math.max(max,v);}
ok(Math.abs(sum/n-0.5)<0.02, 'ortalama ~0.5', (sum/n).toFixed(4));
ok(min>=0 && max<1, '[0,1) aralığı');

console.log(fail ? `\n❌ ${fail} TEST BAŞARISIZ\n` : '\n✅ TÜM TESTLER GEÇTİ\n');
process.exit(fail?1:0);
