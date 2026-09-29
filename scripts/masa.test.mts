/**
 * Masa Ritüeli Pilotu (2026-09-29) — /masa sayfasının seçim kuralı.
 * Neden: reklam adresi sabit kalır, sayfa her hafta resmi kulübün sıradaki pilot masasını ("Pazar Masası") kendisi bulur;
 * yanlış masa (iptal, geçmiş, test, başka başlık) reklam parasını boşa indirir.
 * Çalıştır: node scripts/masa.test.mts
 */
// Vercel sunucusu UTC'de çalışır; geliştirici makinesi İstanbul'da → saat testi yerel TZ'de koşarsa `timeZone` satırı
// silinse de geçer (7b bulgusu, 2026-09-29). Test sunucu koşulunda koşsun:
process.env.TZ = 'UTC';
import {
  siradakiMasa, pilotMasasiMi, pilotSaatindeMi, kalanYer, kimlikGerekirMi, istanbulTarihSaat, ilikeDeseni, PILOT, PILOT_BASLIK_ONEKI,
  type MasaSatiri,
} from '../lib/masaSecim.ts';

let fail = 0;
const ok = (c: boolean, m: string, x = '') => { if (!c) { console.log('  ✗', m, x); fail++; } else console.log('  ✓', m); };

const SIMDI = new Date('2026-10-06T12:00:00Z');
const m = (o: Partial<MasaSatiri>): MasaSatiri => ({
  id: 'x', title: 'Pazar Masası · Moda · 8 kişi', start_time: '2026-10-11T12:00:00Z', venue_name: 'Mekân',
  max_capacity: 8, current_attendees: 0, is_cancelled: false, is_test: false, identity_required: false, ...o,
});

// Karar bekçisi — kullanıcı kararı 2026-09-29: pilot Pazar 15:00 (Perşembe 20:00'den taşındı). Değişirse bilerek değişsin.
ok(PILOT.gun === 'Pazar' && PILOT.saat === '15:00', 'pilot günü/saati Pazar 15:00', JSON.stringify(PILOT));
ok(PILOT_BASLIK_ONEKI === 'Pazar Masası', 'başlık öneki günden türer', PILOT_BASLIK_ONEKI);
ok(PILOT.zamanIfadesi.startsWith(PILOT.gun), 'H1 zaman ifadesi günle aynı (7b: gün değişip ifade kalmasın)', PILOT.zamanIfadesi);

// pilotSaatindeMi — masa pilot gün/saatinde mi açılmış? (7b: "Pazar Masası" 16:00'ya açılırsa üst satır ile kart çelişir)
ok(pilotSaatindeMi('2026-10-11T12:00:00Z'), 'Pazar 15:00 İstanbul → uyumlu');
ok(!pilotSaatindeMi('2026-10-11T13:00:00Z'), 'Pazar 16:00 → uyumsuz');
ok(!pilotSaatindeMi('2026-10-10T12:00:00Z'), 'Cumartesi 15:00 → uyumsuz');
ok(!pilotSaatindeMi('bozuk'), 'bozuk tarih → uyumsuz');

// pilotMasasiMi — Türkçe büyük/küçük harf ve ASCII yazım (DB ilike ı/I katlamaz; kod katlar)
ok(pilotMasasiMi('Pazar Masası · Moda'), 'kanonik başlık');
ok(pilotMasasiMi('PAZAR MASASI'), 'tamamı büyük harf');
ok(pilotMasasiMi('Pazar Masasi'), 'ASCII yazım');
ok(pilotMasasiMi('  pazar masası'), 'baştaki boşluk');
ok(!pilotMasasiMi('Perşembe Masası · Moda'), 'eski kalıp (Perşembe) artık seçilmez');
ok(!pilotMasasiMi('Pazartesi Masası'), '"Pazar" ile başlayan başka gün seçilmez');
ok(!pilotMasasiMi('Bu pazar masası var'), 'önek değilse değil');
ok(!pilotMasasiMi(null), 'başlık yoksa değil');

// ilikeDeseni — DB ön süzgeci: Türkçe harf ve i → % (İ iki kod noktası; `_` eşleşmez — canlı SQL kanıtı 2026-09-29)
ok(ilikeDeseni('Pazar Masası') === 'pazar masas%', 'Pazar deseni', ilikeDeseni('Pazar Masası'));
ok(ilikeDeseni('Perşembe Masası') === 'per%embe masas%', 'Perşembe deseni', ilikeDeseni('Perşembe Masası'));
ok(ilikeDeseni('Pazartesi Masası') === 'pazartes% masas%', 'İ içeren gün deseni', ilikeDeseni('Pazartesi Masası'));
ok(ilikeDeseni('Çarşamba Masası') === '%ar%amba masas%', 'baştaki Türkçe harf', ilikeDeseni('Çarşamba Masası'));
ok(!ilikeDeseni(PILOT_BASLIK_ONEKI).includes('%%'), 'ardışık % yok');

// kalanYer — negatif/null güvenli
ok(kalanYer(m({ max_capacity: 8, current_attendees: 3 })) === 5, '8−3=5');
ok(kalanYer(m({ max_capacity: 8, current_attendees: 10 })) === 0, 'taşma → 0');
ok(kalanYer(m({ max_capacity: null })) === null, 'kapasite yoksa bilinmiyor');
ok(kalanYer(m({ current_attendees: null })) === 8, 'katılımcı null → 0 sayılır');

// kimlikGerekirMi — sayfa kimlik adımını yalnız masa gerçekten istemiyorsa gizler (DB varsayılanı true)
ok(kimlikGerekirMi(m({ identity_required: true })) === true, 'kimlik açık → söylenir');
ok(kimlikGerekirMi(m({ identity_required: false })) === false, 'kimlik kapalı → söylenmez');
ok(kimlikGerekirMi(m({ identity_required: null })) === true, 'bilinmiyorsa söylenir (DB varsayılanı true)');

// siradakiMasa
ok(siradakiMasa([], SIMDI) === null, 'hiç masa yok → null');
const a = m({ id: 'a', start_time: '2026-10-11T12:00:00Z' });
const b = m({ id: 'b', start_time: '2026-10-18T12:00:00Z' });
ok(siradakiMasa([b, a], SIMDI)?.masa.id === 'a', 'en yakın tarihli seçilir (sıra bağımsız)');
ok(siradakiMasa([m({ id: 'g', start_time: '2026-10-04T12:00:00Z' }), b], SIMDI)?.masa.id === 'b', 'geçmiş elenir');
ok(siradakiMasa([m({ id: 'i', is_cancelled: true }), b], SIMDI)?.masa.id === 'b', 'iptal elenir');
ok(siradakiMasa([m({ id: 't', is_test: true }), b], SIMDI)?.masa.id === 'b', 'test masası elenir');
ok(siradakiMasa([m({ id: 'k', title: 'Kahve Buluşması' }), b], SIMDI)?.masa.id === 'b', 'başka başlık elenir');
const doluA = m({ id: 'da', current_attendees: 8 });
ok(siradakiMasa([doluA, b], SIMDI)?.masa.id === 'b', 'yakın masa doluysa yeri olan sonraki');
const doluB = m({ id: 'db', start_time: '2026-10-18T12:00:00Z', current_attendees: 9 });
const s = siradakiMasa([doluB, doluA], SIMDI);
ok(s?.masa.id === 'da' && s.dolu === true, 'hepsi doluysa en yakını "dolu" ile', JSON.stringify(s));
ok(siradakiMasa([a], SIMDI)?.dolu === false, 'yeri varsa dolu=false');
ok(siradakiMasa([m({ id: 'n', max_capacity: null })], SIMDI)?.dolu === false, 'kapasite bilinmiyorsa dolu sayılmaz');
ok(siradakiMasa([m({ id: 'z', start_time: 'bozuk' })], SIMDI) === null, 'bozuk tarih elenir');

// istanbulTarihSaat — sunucu UTC'de çalışır; saat İstanbul'a göre yazılmalı
const t = istanbulTarihSaat('2026-10-11T12:00:00Z');
ok(t.includes('15:00'), '12:00Z → 15:00 İstanbul', t);
ok(t.includes('11 Ekim') && t.includes('Pazar'), 'gün + ay adı Türkçe', t);

console.log(fail ? `\n${fail} başarısız` : '\ntümü geçti');
process.exit(fail ? 1 : 0);
