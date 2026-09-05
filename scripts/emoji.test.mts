import { emojiPaylasim, emojiSatiri, gunNo } from '../content/sosyal-obezite-feed.ts';
let fail=0; const ok=(c:boolean,m:string,x='')=>{if(!c){console.log('  ✗',m,x);fail++}else console.log('  ✓',m,x)};
const o:Array<'yakala'|'kacir'>=['yakala','yakala','kacir','yakala','kacir','yakala','yakala','yakala','kacir','yakala','yakala','kacir'];
console.log('\n== WORDLE BİÇİMİ ==');
ok([...emojiSatiri(o)].length===12,'12 olay = 12 emoji',emojiSatiri(o));
// Wordle izgarasi hizali cunku 🟩 (U+1F7E9) ve ⬛ (U+2B1B) ikisi de Emoji_Presentation
// + Wide. Dar olan ⚫ (U+26AB) degil — o yuzden degistirildi.
const kodlar=[...new Set([...emojiSatiri(o)])].map(c=>c.codePointAt(0)!);
ok(kodlar.every(k=>k===0x1F7E9||k===0x2B1B),'esit genislikli kare ailesi kullaniliyor',kodlar.map(k=>'U+'+k.toString(16).toUpperCase()).join(' '));
const m=emojiPaylasim({olaylar:o,yakalanan:8,toplam:12,enYuksekCarpan:2,url:'https://clubbeans.com/sosyal-obezite',seri:4});
console.log('\n--- örnek kart ---\n'+m+'\n---');
ok(!/\d{3,}/.test(m.split('\n')[2]),'skor kartta ÖNE ÇIKMIYOR (kahraman: kurtarılan gerçek)');
ok(m.includes('🟩')&&m.includes('⬛'),'spoiler yok, yalnız desen');
ok(m.includes('#'),'gün numarası var (ortak bulmaca hissi)');
ok(m.includes('🔥4'),'gün serisi görünüyor');
ok(gunNo(new Date(Date.UTC(2026,7,18)))===1,'epok günü = 1');
ok(gunNo(new Date(Date.UTC(2026,7,25)))===8,'bir hafta sonra = 8');
ok(gunNo(new Date(Date.UTC(2026,7,18,21,30)))===2,'TR 00:30 (UTC 21:30) → ertesi gün (günlük seed ile aynı eksen)');
ok(gunNo(new Date(Date.UTC(2026,7,18,20,59)))===1,'TR 23:59 → hâlâ aynı gün');

// ── Panel sonrası: kimlik etiketi, fiyasko dalı, X linksiz varyantı ─────────
{
  const { etiketEsle, meydanOkumaMetni, ITIRAF_KISA } = await import(
    '../content/sosyal-obezite-feed.ts'
  );
  const esit = (a: unknown, b: unknown, m: string) => ok(a === b, m, `${a}`);
  const dogru = ok;

  const olaylar12 = (n: number): Array<'yakala' | 'kacir'> =>
    Array.from({ length: 12 }, (_, i) => (i < n ? 'yakala' : 'kacir'));

  console.log('\n--- kimlik etiketi ---');
  esit(etiketEsle(0, 0), 'Tam Teslimiyet', '0 yakalama etiketi');
  esit(etiketEsle(2, 0), 'Akıntıya Kapılan', 'düşük etiket');
  esit(etiketEsle(5, 0), 'Aradaki Bean', 'orta etiket');
  esit(etiketEsle(9, 0), 'Uyanık', 'yüksek etiket');
  esit(etiketEsle(12, 0), 'Akışa Direnen', 'tam etiket');
  esit(etiketEsle(10, 5), 'Panik Parmak', 'yanlış dokunma etiketi ezer');

  console.log('\n--- X kanalı: link YASAK ---');
  const xMetin = emojiPaylasim({
    olaylar: olaylar12(5), yakalanan: 5, toplam: 12, enYuksekCarpan: 2,
    url: 'https://clubbeans.com/sosyal-obezite', kanal: 'x',
  });
  dogru(!xMetin.includes('http'), 'X metninde URL YOK (link cezası)');
  dogru(xMetin.includes('Aradaki Bean'), 'X metninde kimlik etiketi var');

  const genelMetin = emojiPaylasim({
    olaylar: olaylar12(5), yakalanan: 5, toplam: 12, enYuksekCarpan: 2,
    url: 'https://clubbeans.com/sosyal-obezite', kanal: 'genel',
  });
  dogru(genelMetin.includes('https://'), 'genel kanalda URL var');

  console.log('\n--- fiyasko dalı: çifte şaka yasağı ---');
  const fiyasko = emojiPaylasim({
    olaylar: olaylar12(1), yakalanan: 1, toplam: 12, enYuksekCarpan: 1,
    url: 'https://clubbeans.com/sosyal-obezite',
  });
  dogru(!fiyasko.includes(ITIRAF_KISA), 'fiyaskoda itiraf satırı GİRMEZ');
  dogru(/[Aa]kış/.test(fiyasko), 'fiyasko satırının öznesi akış (oyuncu değil)');
  {
    const { FIYASKO_SATIRLARI } = await import('../content/sosyal-obezite-feed.ts');
    dogru(FIYASKO_SATIRLARI.every((f: string) => /[Aa]kış/.test(f)), 'HER fiyasko satırının öznesi akış (gün-bağımsız)');
  }
  dogru(genelMetin.includes(ITIRAF_KISA), 'normal turda itiraf satırı var');

  console.log('\n--- satır bütçesi + X 280 karakter ---');
  for (const n of [0, 1, 5, 12]) {
    const m = emojiPaylasim({
      olaylar: olaylar12(n), yakalanan: n, toplam: 12, enYuksekCarpan: 2,
      url: 'https://clubbeans.com/sosyal-obezite', kanal: 'x', seri: 9,
    });
    dogru(m.split('\n').length <= 6, `${n} yakalama: satır ≤6`);
    // X sayımı: emoji 2 karakter, URL yok
    const xUzunluk = [...m].reduce((t, c) => t + (c.codePointAt(0)! > 0xffff ? 1 : 1), 0)
      + m.split('🟩').length - 1 + m.split('⬛').length - 1;
    dogru(xUzunluk <= 280, `${n} yakalama: X sayımı ${xUzunluk} ≤ 280`);
  }

  console.log('\n--- meydan okuma ---');
  const mdX = meydanOkumaMetni({ olaylar: olaylar12(8), yakalanan: 8, toplam: 12, kanal: 'x' });
  dogru(!mdX.includes('http'), 'X meydan okumasında URL YOK (düz alan adı var)');
  dogru(mdX.includes('kurtarırsın'), 'meydan okuma fiili "kurtar" ("geçemezsin" değil)');
  const mdGenel = meydanOkumaMetni({
    olaylar: olaylar12(8), yakalanan: 8, toplam: 12, kanal: 'genel',
    url: 'https://clubbeans.com/sosyal-obezite/s/abc',
  });
  dogru(mdGenel.includes('/s/abc'), 'genel meydan okuması kart linki taşıyor (cevap yolu)');
  const mdRakip = meydanOkumaMetni({
    olaylar: olaylar12(7), yakalanan: 7, toplam: 12, kanal: 'genel', url: 'https://x/s/1',
    rakip: { ad: 'sartaa', yakalanan: 6 },
  });
  dogru(mdRakip.includes('sartaa 6, ben 7') && mdRakip.includes('Sıra sende'), 'rakip cevabı rakibi anıyor');

  console.log('\n--- tanım satırı her paylaşım yüzeyinde (spec §12) ---');
  dogru(xMetin.includes('Sosyal obezite:'), 'X metninde kısa tanım satırı var');
  dogru(mdX.includes('Sosyal obezite:'), 'meydan okumada kısa tanım satırı var');
  dogru(xMetin.includes('clubbeans.com/sosyal-obezite'), 'X metninde düz alan adı var (oyuna yol)');
  dogru(xMetin.split('\n').length <= 6, 'X metni ≤6 satır');
}

console.log(fail?`\n❌ ${fail} BAŞARISIZ\n`:'\n✅ GEÇTİ\n'); process.exit(fail?1:0);
