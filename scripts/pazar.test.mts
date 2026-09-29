/**
 * Pazar Programı (2026-09-29) — /pazar sayfasının seçim kuralı ve program bekçisi.
 * Neden: reklamın sabit iniş sayfası her Pazar ortak bir kulübün etkinliğini gösterir; sayfaya yalnız bizim onayladığımız
 * (programa yazılan) etkinlik çıkar. Test/alkol çağrışımlı/başka günün etkinliği reklam parasını boşa ya da hukuka aykırı indirir.
 * Çalıştır: node scripts/pazar.test.mts
 */
// Vercel sunucusu UTC'de çalışır; test sunucu koşulunda koşsun (yerel İstanbul TZ saat hatasını gizler).
process.env.TZ = 'UTC';
import {
  PAZAR_PROGRAMI, pazarProgrami, eslesenEtkinlik, istanbulGunu, istanbulTarih, istanbulTarihSaat, alkolCagrisimi,
  testBasligi, kalanYer, kimlikGerekirMi, sorguAltSiniri, type EtkinlikSatiri, type ProgramGirdisi,
} from '../lib/pazarProgrami.ts';

let fail = 0;
const ok = (c: boolean, m: string, x = '') => { if (!c) { console.log('  ✗', m, x); fail++; } else console.log('  ✓', m); };

const ROTA = 'cbfdbede-2692-405f-a64a-2fdf116e0952';
const G = (o: Partial<ProgramGirdisi>): ProgramGirdisi => ({
  tarih: '2026-10-25', kulupId: ROTA, kulupAdi: 'Rotaİsta', baslik: 'Vision Board Workshop', tanitim: 'Hedefleri panoya.',
  ucretTl: 350, dahil: 'malzemeler ve filtre kahve', izin: 'test', ...o,
});
const E = (o: Partial<EtkinlikSatiri>): EtkinlikSatiri => ({
  id: 'e', club_id: ROTA, title: 'Vision Board Workshop', start_time: '2026-10-25T11:00:00Z', venue_name: 'Kafe',
  max_capacity: 12, current_attendees: 2, is_cancelled: false, is_test: false, identity_required: false,
  description: 'Filtre kahveniz bizden. Katılım: 350₺', ...o,
});
const SIMDI = new Date('2026-10-20T09:00:00Z');

// Program bekçisi — programa giren her girdi: Pazar günü (İstanbul), alkolsüz, ortak onayı yazılı, ilk girdi 25.10 Rotaİsta
ok(PAZAR_PROGRAMI.length >= 1 && PAZAR_PROGRAMI[0].tarih === '2026-10-25' && PAZAR_PROGRAMI[0].kulupId === ROTA,
  'ilk Pazar: 25 Ekim Rotaİsta (kullanıcı kararı 2026-09-29)');
for (const g of PAZAR_PROGRAMI) {
  ok(istanbulTarih(g.tarih).endsWith('Pazar'), `${g.tarih} Pazar günü`, istanbulTarih(g.tarih));
  ok(!alkolCagrisimi(g.baslik, g.tanitim, g.dahil), `${g.tarih} girdisi alkolsüz`);
  ok(g.izin.trim().length > 0, `${g.tarih} ortak onayı kayıtlı`);
}

// istanbulGunu — gün sınırı İstanbul'a göre
ok(istanbulGunu('2026-10-24T21:30:00Z') === '2026-10-25', '24.10 21:30Z = 25.10 00:30 İstanbul', String(istanbulGunu('2026-10-24T21:30:00Z')));
ok(istanbulGunu('2026-10-25T20:59:00Z') === '2026-10-25', '25.10 23:59 İstanbul hâlâ 25.10');
ok(istanbulGunu('bozuk') === null, 'bozuk tarih → null');
ok(istanbulTarih('2026-10-25') === '25 Ekim Pazar', 'girdi tarihi okunur', istanbulTarih('2026-10-25'));

// testBasligi — resmi kulüp test etkinliklerini is_test olmadan açıyor (hasım H1, canlı)
ok(testBasligi('Test 1 / herkese açık / doğrulamasız'), '"Test 1 …" test');
ok(testBasligi('  TEST // Herkese açık'), 'büyük harf + boşluk');
ok(!testBasligi('Vision Board Workshop'), 'gerçek başlık test değil');
ok(!testBasligi('Testere atölyesi'), 'ilk sözcük tam "test" değilse test değil');

// alkolCagrisimi — başlık + açıklama + mekân; sözcük bazlı (hasım H2, Dalika'nın gerçek verisi)
ok(alkolCagrisimi('Üzüm ve Mum..', 'Şaraphanede mum atölyesi', null), 'Şaraphane (kök) yakalanır');
ok(alkolCagrisimi('Candle & Sip Workshop 🥂✨🕯️'), '"Sip" + 🥂');
ok(alkolCagrisimi('Bir Kadeh Bir Kahkaha 🎭✨🍹'), 'kadeh + 🍹');
ok(alkolCagrisimi('Mum Atölyesi', null, 'Bordo Wine Bar'), 'mekân adı taranır (Wine Bar)');
ok(alkolCagrisimi('Kokteyl akşamı'), 'kokteyl');
ok(alkolCagrisimi('Rakı balık'), 'rakı');
ok(alkolCagrisimi('Bira tadımı'), 'bira');
ok(alkolCagrisimi('Şarabı seçiyoruz'), 'şarabı (ünsüz yumuşaması)');
ok(!alkolCagrisimi('Biraz sohbet, biraz kahve'), '"biraz" alkol değil');
ok(!alkolCagrisimi('Siparişinizi kendiniz verin'), '"sipariş" alkol değil');
ok(!alkolCagrisimi('Barış ile resim', null, 'Canopy by Hilton İstanbul Taksim'), '"Barış" ve otel adı alkol değil');
ok(!alkolCagrisimi('Vision Board Workshop', 'Sonbaharın ruhuyla. Filtre kahveniz bizden. Katılım: 350₺', 'Kafe'), 'Vision Board metni geçer');
// 7b bulguları (2026-09-29): emoji katmanı tek başına sınanmıyordu; kaçan içki adları; "rakım" yanlış alarmı
ok(alkolCagrisimi('Pazar keyfi 🍷'), 'yalnız emoji de yakalanır');
ok(alkolCagrisimi('Mimosa brunch') && alkolCagrisimi('Sake tadımı') && alkolCagrisimi('Cider akşamı'), 'mimosa · sake · cider');
ok(alkolCagrisimi('Raki sofrası') && alkolCagrisimi('İçkili sohbet'), 'ASCII raki · içkili');
ok(!alkolCagrisimi('Rakım 1200 m yürüyüş'), '"rakım" (yükseklik) alkol değil');

// eslesenEtkinlik — aynı kulüp + aynı İstanbul günü + iptal/test değil + test başlığı değil + alkolsüz; en erken
const g = G({});
ok(eslesenEtkinlik(g, [E({ id: 'a' })])?.id === 'a', 'eşleşen etkinlik bulunur');
ok(eslesenEtkinlik(g, [E({ club_id: 'baska' })]) === null, 'başka kulüp eşleşmez');
ok(eslesenEtkinlik(g, [E({ start_time: '2026-10-24T11:00:00Z' })]) === null, 'başka gün eşleşmez');
ok(eslesenEtkinlik(g, [E({ is_cancelled: true })]) === null, 'iptal eşleşmez');
ok(eslesenEtkinlik(g, [E({ is_test: true })]) === null, 'is_test eşleşmez');
ok(eslesenEtkinlik(g, [E({ title: 'Test 1 / herkese açık' })]) === null, '"Test" başlıklı eşleşmez (H1)');
ok(eslesenEtkinlik(g, [E({ venue_name: 'Bordo Wine Bar' })]) === null, 'alkol çağrışımlı mekân eşleşmez');
ok(eslesenEtkinlik(g, [E({ id: 'gec', start_time: '2026-10-25T15:00:00Z' }), E({ id: 'erken', start_time: '2026-10-25T08:00:00Z' })])?.id === 'erken',
  'aynı gün birden çok → en erken');

// pazarProgrami — gelecek girdiler sırayla, eşleşme yoksa "yakında" (etkinlik null)
const p0 = pazarProgrami([G({ tarih: '2026-11-01' }), G({})], [], SIMDI);
ok(p0.buPazar?.girdi.tarih === '2026-10-25' && p0.buPazar.etkinlik === null, 'etkinlik açılmadıysa en yakın girdi "yakında"');
ok(p0.sonrakiler.length === 1 && p0.sonrakiler[0].girdi.tarih === '2026-11-01', 'sonraki Pazarlar tarih sırasıyla');
ok(pazarProgrami([G({ tarih: '2026-10-18' })], [], SIMDI).buPazar === null, 'geçmiş girdi düşer');
const p1 = pazarProgrami([G({})], [E({ id: 'x' })], SIMDI);
ok(p1.buPazar?.etkinlik?.id === 'x' && p1.buPazar.dolu === false, 'eşleşen etkinlik karta bağlanır');
ok(pazarProgrami([G({})], [E({ current_attendees: 12 })], SIMDI).buPazar?.dolu === true, 'kapasite doluysa dolu');
ok(pazarProgrami([G({})], [E({})], new Date('2026-10-25T12:00:00Z')).buPazar === null, 'etkinlik başladıysa girdi düşer');
ok(pazarProgrami([G({}), G({ tarih: '2026-11-01' }), G({ tarih: '2026-11-08' }), G({ tarih: '2026-11-15' }), G({ tarih: '2026-11-22' })], [], SIMDI)
  .sonrakiler.length === 3, 'sonrakiler en çok 3');
ok(pazarProgrami([], [E({})], SIMDI).buPazar === null, 'program boşsa hiçbir etkinlik görünmez (insan onayı)');

// sorguAltSiniri — DB sorgusu başlamış etkinliği de getirmeli; yoksa etkinlik günü başlangıçtan gece yarısına kadar
// sayfa "kayıtlar yakında" der (7b bulgusu: .gt(start_time, şimdi) başlamış satırı hiç getirmiyordu)
ok(sorguAltSiniri(new Date('2026-10-25T12:00:00Z')).toISOString() === '2026-10-24T12:00:00.000Z', 'sorgu 24 sa geriden başlar');
const gun = new Date('2026-10-25T12:00:00Z');
const basladi = pazarProgrami([G({}), G({ tarih: '2026-11-01' })], [E({ start_time: '2026-10-25T11:00:00Z' })], gun);
ok(basladi.buPazar?.girdi.tarih === '2026-11-01', 'etkinlik günü başladıktan sonra sıradaki Pazar öne çıkar', JSON.stringify(basladi.buPazar?.girdi.tarih));

// taşınanlar
ok(kalanYer(E({ max_capacity: 12, current_attendees: 15 })) === 0 && kalanYer(E({ max_capacity: null })) === null, 'kalanYer güvenli');
ok(kimlikGerekirMi(E({ identity_required: null })) && !kimlikGerekirMi(E({ identity_required: false })), 'kimlik satırı kuralı');
const t = istanbulTarihSaat('2026-10-25T11:00:00Z');
ok(t.includes('25 Ekim') && t.includes('Pazar') && t.includes('14:00'), '11:00Z → 25 Ekim Pazar, 14:00', t);

console.log(fail ? `\n${fail} başarısız` : '\ntümü geçti');
process.exit(fail ? 1 : 0);
