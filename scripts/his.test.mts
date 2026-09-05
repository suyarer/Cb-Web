/**
 * KAYDIRMA HİSSİ — dış referans sabitleriyle (docs/dis-referans-sentez.md, 72 kaynak).
 * Her iddia bir kaynağa bağlı; sayılar uydurma değil.
 */
import {
  firlatmaHizi, sonumUygula, konumIlerlet, geriYayla, durmaMesafesi, snapHedefi,
  lastikMesafesi, SONUM_MS, MIN_FIRLATMA, MAX_FIRLATMA, BAYAT_ESIGI_MS,
} from '../lib/game/fizik.ts';
let fail=0; const ok=(c:boolean,m:string,x='')=>{if(!c){console.log('  ✗',m,x);fail++}else console.log('  ✓',m,x)};
const KART_H=188;

console.log('\n== REEL MODU: iOS fast (0.99), normal (0.998) DEĞİL ==');
{
  ok(SONUM_MS===0.99,'sönüm iOS fast');
  const d=durmaMesafesi(2000);
  ok(Math.abs(d-199)<3,'2000px/sn fırlatma ~199px süzülür (referans: 199)',d.toFixed(0)+'px');
  let v=2000,t=0; while(v>0&&t<9000){v=sonumUygula(v,16.67);t+=16.67}
  ok(t>350&&t<750,'~0.5sn'+' sürer (eski 0.998: 2.56sn)',(t/1000).toFixed(2)+'sn');
  // eski mod kıyası
  let ve=2000,te=0; while(Math.abs(ve)>12&&te<9000){ve*=Math.pow(0.998,16.67);te+=16.67}
  ok(te>2000,'ESKİ normal mod 2.5sn+ sürüyordu (kıyas)',(te/1000).toFixed(2)+'sn');
}

console.log('\n== KART SNAP (reel sayfalama) ==');
{
  const h=snapHedefi(0,2000,KART_H);
  ok(h%KART_H===0,'hedef kart sınırında',h+'px = '+(h/KART_H)+' kart');
  ok(snapHedefi(500,0,KART_H)%KART_H===0,'durgunken de sınıra oturur');
  ok(snapHedefi(0,-5000,KART_H)===0,'yukarı fırlatma 0 altına inmez');
}

console.log('\n== FIRLATMA KAPILARI (Android ViewConfiguration) ==');
{
  const o=(v:number)=>[{t:0,y:0},{t:16,y:-v*16/1000}];
  ok(firlatmaHizi(o(30),16)===0,`${MIN_FIRLATMA}px/sn altı mikro-kayma fırlatma DEĞİL`);
  ok(firlatmaHizi(o(500),16)>0,'normal fırlatma geçiyor');
  ok(Math.abs(firlatmaHizi(o(50000),16))<=MAX_FIRLATMA,`bozuk ölçüm ${MAX_FIRLATMA}'e kırpılıyor`);
}

console.log('\n== BAYAT ÖRNEK: Android 40ms ==');
{
  const o=[{t:0,y:500},{t:16,y:400},{t:32,y:300}];
  ok(firlatmaHizi(o,32)>1000,'taze → fırlatma var');
  ok(firlatmaHizi(o,32+BAYAT_ESIGI_MS+1)===0,'41ms duraklama → hayalet fling YOK');
  ok(firlatmaHizi(o,32+60)===0,'ESKİ 90ms eşiğinde kaçan 60ms de kapandı');
}

console.log('\n== SON-AĞIRLIKLI KESTİRİM (melas düzeltmesi) ==');
{
  // Yavaş başlayıp hızlanan jest — düz ortalama tepe hızı düşük tahmin ederdi
  const o=[{t:0,y:500},{t:20,y:490},{t:40,y:470},{t:60,y:430},{t:80,y:340}];
  const v=firlatmaHizi(o,80);
  const duzOrtalama=((500-340)/80)*1000;
  ok(v>duzOrtalama*1.5,'ivmelenen jestte tepe hız yakalanıyor',`${v.toFixed(0)} vs düz ${duzOrtalama.toFixed(0)}`);
}

console.log('\n== ASİMPTOTİK LASTİK (iOS c=0.55) ==');
{
  const a=Math.abs(lastikMesafesi(-100,800)), b=Math.abs(lastikMesafesi(-400,800)), c=Math.abs(lastikMesafesi(-2000,800));
  ok(a<100&&b<400&&c<2000,'her mesafede direnç var');
  ok((b/400)<(a/100),'direnç mesafeyle ARTIYOR (doğrusal değil)',`${(a/100).toFixed(2)} → ${(b/400).toFixed(2)}`);
  ok(c<800,'sonsuz çekişte duvara yaklaşıyor',c.toFixed(0)+'px');
  let off=0; for(let i=0;i<20;i++) off=konumIlerlet(off,-50,800);
  ok(off<0,'yukarı çekiş negatife giriyor',off.toFixed(0)+'px');
}

console.log('\n== GERİ YAYLANMA ~500ms (better-scroll) ==');
{
  let g=-300,t=0; while(g<0&&t<3000){g=geriYayla(g,16.67);t+=16.67}
  ok(t>300&&t<900,'yerleşme ~0.5sn (eski 0.985: ~0.2sn)',(t/1000).toFixed(2)+'sn');
}

console.log('\n== SÜRÜKLEME HÂLÂ 1:1 ==');
{
  let off=0; for(let i=0;i<60;i++) off=konumIlerlet(off,4000/60,800);
  ok(Math.abs(off-4000)<1,'4000px hiç kırpılmadı',off.toFixed(0)+'px');
}

console.log(fail?`\n❌ ${fail} BAŞARISIZ\n`:'\n✅ GEÇTİ\n');
process.exit(fail?1:0);
