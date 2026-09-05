import { takmaAdGecerli, iskelet } from '../lib/game/nickname.ts';
let fail=0;
const ok=(c,m,x='')=>{if(!c){console.log('  ✗',m,x);fail++}else console.log('  ✓',m)};
const red=(s)=>!takmaAdGecerli(s).gecerli;
const kabul=(s)=>takmaAdGecerli(s).gecerli;

console.log('\n== KABUL EDİLMELİ ==');
['Selo','ahmet_89','Zeynep.K','koşucu-42','Böğürtlen','Ali Veli','x9'].forEach(s=>
  ok(kabul(s), `"${s}"`, JSON.stringify(takmaAdGecerli(s))));

console.log('\n== REDDEDİLMELİ: marka/yetki taklidi ==');
['ClubBeans','clubbeans','C1ubBeans','Club Beans','CLUB.BEANS','admin','Yönetici','Moderator','sosyalobezite'].forEach(s=>
  ok(red(s), `"${s}"`));

console.log('\n== REDDEDİLMELİ: gömülü marka/yetki taklidi (denetim guvenlik-3) ==');
['ClubBeans Resmi','clubbeans_tr','Admin1','Destek Ekibi','Yönetici-CB','moderator1','C1ub Beans TR','sosyalobezite2026'].forEach(s=>
  ok(red(s), `"${s}"`));

console.log('\n== KABUL: gömülü kökün masum taşıyıcıları ==');
['Resmiye','SolgunBean42','Beanie'].forEach(s=>
  ok(kabul(s), `"${s}"`, JSON.stringify(takmaAdGecerli(s))));

console.log('\n== REDDEDİLMELİ: tek harfli iskelet ==');
['aЖЖЖ','aДДД'].forEach(s=> ok(red(s), `"${s}"`));

console.log('\n== ÖNERİ ADI ==');
{
  const { oneriAdUret } = await import('../lib/game/nickname.ts');
  const a=oneriAdUret('seed-1'), b=oneriAdUret('seed-1'), c=oneriAdUret('seed-2');
  ok(a===b, 'aynı seed → aynı öneri', a);
  ok(/Bean\d{2}$/.test(a), 'kalıp <Sıfat>Bean<NN>', a);
  ok(kabul(a) && kabul(c), 'öneri filtreden geçer', a+' / '+c);
}

console.log('\n== REDDEDİLMELİ: küfür (gömülü + ekli) ==');
['orospu','orospucocugu','siktir','siktirgit','amcik','kaltak','şerefsiz','g0tver','0r0spu'].forEach(s=>
  ok(red(s), `"${s}"`));

console.log('\n== REDDEDİLMELİ: biçim ==');
['a','', '   ', 'x'.repeat(21), 'ad<script>', 'emoji🙂yok'].forEach(s=>
  ok(red(s), `"${s.slice(0,14)}"`));

console.log('\n== YANLIŞ POZİTİF OLMAMALI (masum kelimeler) ==');
['Sakarya','Amasya','Samsun','Asli','Asuman','Gokhan','Topkapi','Godiva','Kroki','Amine'].forEach(s=>
  ok(kabul(s), `"${s}"`, JSON.stringify(takmaAdGecerli(s))));

console.log('\n== GENİŞ YANLIŞ POZİTİF TARAMASI ==');
const isimler=['Selahattin','Mustafa','Ayse','Fatma','Hasan','Huseyin','Ibrahim','Mehmet','Emine','Hatice',
'Zeynep','Elif','Meryem','Sultan','Havva','Esra','Merve','Ozlem','Buse','Ceren','Kerem','Baris','Serkan',
'Tolga','Onur','Burak','Cagri','Deniz','Ege','Kaan','Levent','Murat','Nazli','Pinar','Sibel','Tugce','Umut',
'Yasemin','Kadikoy','Besiktas','Uskudar','Bakirkoy','Atasehir','Nisantasi','Karakoy','Galata','Balat',
'Salih','Talat','Kalender','Alkan','Aslan','Solmaz','Gulten','Bilal','Gultekin','Sila','Sinan','Alparslan'];
const fp=isimler.filter(n=>!takmaAdGecerli(n).gecerli);
ok(fp.length===0, `${isimler.length} masum isim/semt tarands`, fp.length?('YANLIS POZITIF: '+fp.join(', ')):'');

console.log('\n== İSKELET NORMALİZASYONU ==');
ok(iskelet('C1ubBeans')===iskelet('clubbeans'), 'karıştırılabilir sınıf {i,l,1} çöker', iskelet('C1ubBeans')+' vs '+iskelet('clubbeans'));
ok(iskelet('Club Beans')===iskelet('clubbeans'), 'boşluk atılır');
ok(iskelet('ŞİĞÜÖÇ')==='siguoc', 'Türkçe karakter latinleşir', iskelet('ŞİĞÜÖÇ'));

console.log('\n== GÖRÜNMEZ KARAKTER ENJEKSİYONU ==');
ok(red('club​beans'), 'zero-width ile taklit engellendi');

console.log(fail?`\n❌ ${fail} BAŞARISIZ\n`:'\n✅ TÜM TESTLER GEÇTİ\n');
process.exit(fail?1:0);
