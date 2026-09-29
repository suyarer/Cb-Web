/**
 * Masa Ritüeli Pilotu (2026-09-29) — /masa sayfasının seçim kuralı.
 * Neden: reklam adresi sabit kalır, sayfa her hafta resmi kulübün sıradaki "Perşembe Masası"nı kendisi bulur;
 * yanlış masa (iptal, geçmiş, test, başka başlık) reklam parasını boşa indirir.
 * Çalıştır: node scripts/masa.test.mts
 */
// Vercel sunucusu UTC'de çalışır; geliştirici makinesi İstanbul'da → saat testi yerel TZ'de koşarsa `timeZone` satırı
// silinse de geçer (7b bulgusu, 2026-09-29). Test sunucu koşulunda koşsun:
process.env.TZ = 'UTC';
import { siradakiMasa, pilotMasasiMi, kalanYer, kimlikGerekirMi, istanbulTarihSaat, type MasaSatiri } from '../lib/masaSecim.ts';

let fail = 0;
const ok = (c: boolean, m: string, x = '') => { if (!c) { console.log('  ✗', m, x); fail++; } else console.log('  ✓', m); };

const SIMDI = new Date('2026-10-06T12:00:00Z');
const m = (o: Partial<MasaSatiri>): MasaSatiri => ({
  id: 'x', title: 'Perşembe Masası · Moda · 8 kişi', start_time: '2026-10-08T17:00:00Z', venue_name: 'Mekân',
  max_capacity: 8, current_attendees: 0, is_cancelled: false, is_test: false, identity_required: false, ...o,
});

// pilotMasasiMi — Türkçe büyük/küçük harf ve ASCII yazım (DB ilike ı/I katlamaz; kod katlar)
ok(pilotMasasiMi('Perşembe Masası · Moda'), 'kanonik başlık');
ok(pilotMasasiMi('PERŞEMBE MASASI'), 'tamamı büyük harf');
ok(pilotMasasiMi('Persembe Masasi'), 'ASCII yazım');
ok(pilotMasasiMi('  perşembe masası'), 'baştaki boşluk');
ok(!pilotMasasiMi('Cuma Masası'), 'başka gün değil');
ok(!pilotMasasiMi('Bu perşembe masası var'), 'önek değilse değil');
ok(!pilotMasasiMi(null), 'başlık yoksa değil');

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
const a = m({ id: 'a', start_time: '2026-10-08T17:00:00Z' });
const b = m({ id: 'b', start_time: '2026-10-15T17:00:00Z' });
ok(siradakiMasa([b, a], SIMDI)?.masa.id === 'a', 'en yakın tarihli seçilir (sıra bağımsız)');
ok(siradakiMasa([m({ id: 'g', start_time: '2026-10-01T17:00:00Z' }), b], SIMDI)?.masa.id === 'b', 'geçmiş elenir');
ok(siradakiMasa([m({ id: 'i', is_cancelled: true }), b], SIMDI)?.masa.id === 'b', 'iptal elenir');
ok(siradakiMasa([m({ id: 't', is_test: true }), b], SIMDI)?.masa.id === 'b', 'test masası elenir');
ok(siradakiMasa([m({ id: 'k', title: 'Kahve Buluşması' }), b], SIMDI)?.masa.id === 'b', 'başka başlık elenir');
const doluA = m({ id: 'da', current_attendees: 8 });
ok(siradakiMasa([doluA, b], SIMDI)?.masa.id === 'b', 'yakın masa doluysa yeri olan sonraki');
const doluB = m({ id: 'db', start_time: '2026-10-15T17:00:00Z', current_attendees: 9 });
const s = siradakiMasa([doluB, doluA], SIMDI);
ok(s?.masa.id === 'da' && s.dolu === true, 'hepsi doluysa en yakını "dolu" ile', JSON.stringify(s));
ok(siradakiMasa([a], SIMDI)?.dolu === false, 'yeri varsa dolu=false');
ok(siradakiMasa([m({ id: 'n', max_capacity: null })], SIMDI)?.dolu === false, 'kapasite bilinmiyorsa dolu sayılmaz');
ok(siradakiMasa([m({ id: 'z', start_time: 'bozuk' })], SIMDI) === null, 'bozuk tarih elenir');

// istanbulTarihSaat — sunucu UTC'de çalışır; saat İstanbul'a göre yazılmalı
const t = istanbulTarihSaat('2026-10-08T17:00:00Z');
ok(t.includes('20:00'), '17:00Z → 20:00 İstanbul', t);
ok(t.includes('8 Ekim') && t.includes('Perşembe'), 'gün + ay adı Türkçe', t);

console.log(fail ? `\n${fail} başarısız` : '\ntümü geçti');
process.exit(fail ? 1 : 0);
