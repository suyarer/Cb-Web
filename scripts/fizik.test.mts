/**
 * Skor tavanı ile HAREKET tavanının ayrıldığını kanıtlar.
 *
 * Eski sürüm tavanı harekete uyguluyordu ("melas" hissi). Yeni sözleşme:
 *   hareket = sınırsız, 1:1 parmak takibi   (lib/game/fizik.ts)
 *   skor    = tavanlı, sunucuda kırpılır     (lib/game/engine.ts)
 */
import { konumIlerlet } from '../lib/game/fizik.ts';
import { mesafePuani, hesaplaSkor, HIZ_TAVANI_KART_SN, TUR_SURESI_MS } from '../lib/game/engine.ts';

const KART_H = 188;
let fail=0; const ok=(c:boolean,m:string,x='')=>{if(!c){console.log('  ✗',m,x);fail++}else console.log('  ✓',m,x)};

console.log('\n== HAREKET SINIRSIZ ==');
{
  let off=0; const dt=1/60;
  for(let i=0;i<60;i++) off=konumIlerlet(off, 4000*dt);   // agresif fırlatma
  const kart=off/KART_H;
  ok(Math.abs(off-4000)<1, '4000px/sn hiç kırpılmıyor', off.toFixed(0)+'px');
  ok(kart > HIZ_TAVANI_KART_SN, `saniyede ${kart.toFixed(1)} kart geçilebiliyor (tavan ${HIZ_TAVANI_KART_SN})`);
}

console.log('\n== SKOR TAVANLI (asıl sınır burada) ==');
{
  ok(mesafePuani(480, 60000) === 480, 'tavanda tam puan');
  ok(mesafePuani(5000, 60000) === 480, '5000 kart geçse de mesafe puanı 480de duruyor', String(mesafePuani(5000,60000)));
  const yavas = hesaplaSkor({kart:480,yakalanan:12,kacan:0,yanlisDokunma:0,sureMs:60000}, Array(12).fill('yakala')).skor;
  const hizli = hesaplaSkor({kart:5000,yakalanan:12,kacan:0,yanlisDokunma:0,sureMs:60000}, Array(12).fill('yakala')).skor;
  ok(yavas === hizli, 'çılgın hızlı kaydıran EK PUAN ALMIYOR — tez korunuyor', `${yavas} = ${hizli}`);
}

console.log('\n== YAKALAMA HÂLÂ BASKIN ==');
{
  const sadeceKaydiran = hesaplaSkor({kart:9999,yakalanan:0,kacan:12,yanlisDokunma:0,sureMs:60000}, Array(12).fill('kacir')).skor;
  const sadeceYakalayan = hesaplaSkor({kart:0,yakalanan:12,kacan:0,yanlisDokunma:0,sureMs:60000}, Array(12).fill('yakala')).skor;
  ok(sadeceYakalayan > sadeceKaydiran*2, 'hiç kaydırmadan yakalayan, hiç yakalamadan kaydıranı 2x geçiyor', `${sadeceYakalayan} vs ${sadeceKaydiran}`);
}

console.log('\n== KART SAYIMI TUTARLI ==');
{
  let off=0, kart=0;
  for(let i=0;i<600;i++){ const o=off; off=konumIlerlet(off, 30); const g=Math.floor(off/KART_H)-Math.floor(o/KART_H); if(g>0)kart+=g; }
  ok(kart === Math.floor(off/KART_H), 'sayaç görülen mesafeyle birebir', `${kart} kart / ${off.toFixed(0)}px`);
}

console.log(fail?`\n❌ ${fail} BAŞARISIZ\n`:'\n✅ GEÇTİ\n');
process.exit(fail?1:0);
