/**
 * GİRDİ YORUMLAMA testleri — his denetiminin 1. ve 2. bulguları.
 * Bileşendeki karar mantığını saf fonksiyon olarak yeniden kurup doğrular.
 */
import { firlatmaHizi, sonumUygula } from '../lib/game/fizik.ts';
let fail=0; const ok=(c:boolean,m:string,x='')=>{if(!c){console.log('  ✗',m,x);fail++}else console.log('  ✓',m,x)};

const TAP_PX=18, TAP_MS=500, GEVSEK_PX=28, GEVSEK_HIZ=250, FREN=200;
type Bitis={mesafe:number;sure:number;fling:number;hizOnDown:number;gercekVar:boolean};
function karar(b:Bitis){
  const tap=(b.mesafe<TAP_PX&&b.sure<TAP_MS)||(b.mesafe<GEVSEK_PX&&Math.abs(b.fling)<GEVSEK_HIZ);
  if(!tap) return 'fling';
  return (Math.abs(b.hizOnDown)>FREN && !b.gercekVar) ? 'fren-bedava' : 'yakalama-denemesi';
}

console.log('\n== DOĞAL FREN CEZASIZ ==');
ok(karar({mesafe:4,sure:120,fling:20,hizOnDown:2400,gercekVar:false})==='fren-bedava',
   'akan akışı durdurmak için dokunuş → ceza YOK');
ok(karar({mesafe:4,sure:120,fling:20,hizOnDown:2400,gercekVar:true})==='yakalama-denemesi',
   'ama gerçek varsa fren dokunuşu yine YAKALAR');
ok(karar({mesafe:4,sure:120,fling:20,hizOnDown:0,gercekVar:false})==='yakalama-denemesi',
   'duran akışta dokunmak normal ceza yolu (suistimal kapalı)');
ok(karar({mesafe:4,sure:120,fling:20,hizOnDown:150,gercekVar:false})==='yakalama-denemesi',
   'eşik altı yavaş kayma fren sayılmaz');

console.log('\n== ACELECİ YAKALAMA SÜRÜKLEMEYE DÖNMEZ ==');
ok(karar({mesafe:22,sure:300,fling:120,hizOnDown:0,gercekVar:true})==='yakalama-denemesi',
   '22px kayan aceleci dokunuş hâlâ yakalama (eski 12px eşiği kaçırıyordu)');
ok(karar({mesafe:60,sure:200,fling:1800,hizOnDown:0,gercekVar:true})==='fling',
   'gerçek fırlatma yakalama sayılmaz');
ok(karar({mesafe:10,sure:900,fling:15,hizOnDown:0,gercekVar:true})==='yakalama-denemesi',
   'uzun basılı tutup bırakmak da yakalama (gevşek kapı)');

console.log('\n== HAYALET FLING ÖLDÜ ==');
{
  const o=[{t:0,y:500},{t:16,y:400},{t:32,y:300}];
  ok(firlatmaHizi(o,32)>1000,'taze örnek → fırlatma var',firlatmaHizi(o,32).toFixed(0));
  ok(firlatmaHizi(o,600)===0,'600ms bekleyip bırakınca fırlatma YOK (hortlak ölü)');
  ok(firlatmaHizi(o,32+90)===0,'pencere sınırında bayat örnek reddediliyor');
}

console.log('\n== ÇARPAN MERDİVENİ GÖRÜNÜR DEĞER ==');
{
  const CARPAN=[1,1.5,2], TABAN=50;
  const p=(seri:number)=>Math.round(TABAN*CARPAN[Math.min(seri,2)]);
  ok(p(0)===50&&p(1)===75&&p(2)===100&&p(9)===100,'rozet 50/75/100 gösterir (sabit +50 değil)');
}

console.log(fail?`\n❌ ${fail} BAŞARISIZ\n`:'\n✅ GEÇTİ\n');
process.exit(fail?1:0);
