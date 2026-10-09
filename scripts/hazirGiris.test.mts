/**
 * /hazir saf kararları — CB2026 sprint hazir-hesap-giris-baglantisi-2026-10-06 (K-W1).
 * Çalıştır: node scripts/hazirGiris.test.mts
 */
import {
  ANAHTAR_RE,
  cihazSinifi,
  GIR_DUGMESI,
  gizliMaskele,
  hataBilgisi,
  izleyicisizMi,
  jetonlariAl,
  olayMaskele,
  oturumAdresi,
  temizlemeBetigi,
  uygulamaIciMi,
} from '../lib/hazirGiris.ts';

let fail = 0;
const ok = (c: boolean, m: string, x = '') => { if (!c) { console.log('  ✗', m, x); fail++; } else console.log('  ✓', m); };

const ANAHTAR = 'AbCdEfGhIjKlMnOpQrStUvWxYz0123456789_-AbCdE';
const JWT = 'eyJhbGciOiJIUzI1NiJ9.eyJzZXNzaW9uX2lkIjoiYSJ9.c2lnbmF0dXJlLXNpZw';
const J = { access_token: JWT, refresh_token: 'r3fr3shT0k3n' };
const IG_IOS = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 350.0.0';
const SAFARI = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const CHROME_AND = 'Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36';
const MAC = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15';

// Sözleşmeler (CB2026 ile AYNI olmalı)
ok(ANAHTAR.length === 43 && ANAHTAR_RE.test(ANAHTAR), 'anahtar 43 karakter base64url');
ok(!ANAHTAR_RE.test(ANAHTAR.slice(0, 42)) && !ANAHTAR_RE.test(`${ANAHTAR.slice(0, 42)}+`), 'kısa / base64 + reddedilir');
ok(GIR_DUGMESI === 'Hesabına gir', 'düğme adı DM ile aynı (hazirHesapDm WEB_GIR_DUGMESI)');

// İzleyicisiz rota
ok(izleyicisizMi('/hazir') && izleyicisizMi('/hazir/x'), '/hazir izleyicisiz');
ok(!izleyicisizMi('/hazirlik') && !izleyicisizMi('/') && !izleyicisizMi(null), '/hazirlik, kök, null izleyicili');
// google-donus-acil (2026-10-09): giriş dönüş sayfası ?code= taşır → izleyicisiz; benzer adlar izleyicili kalır
ok(izleyicisizMi('/auth/callback') && izleyicisizMi('/auth/callback/x'), '/auth/callback izleyicisiz');
ok(!izleyicisizMi('/auth/callbackx') && !izleyicisizMi('/auth') && !izleyicisizMi('/auth/giris'), '/auth/callbackx, /auth izleyicili');
{
  const om = olayMaskele({ request: { url: 'https://clubbeans.com/auth/callback?code=gizli-kod-123&recovery=1&error_code=otp_expired' } }) as { request: { url: string } };
  ok(!om.request.url.includes('gizli-kod-123'), 'Sentry: ?code= maskelendi', om.request.url);
  ok(om.request.url.includes('recovery=1') && om.request.url.includes('error_code=otp_expired'), 'Sentry: recovery ve error_code korunur', om.request.url);
}

// Cihaz sınıfı
ok(cihazSinifi(CHROME_AND, 5) === 'android', 'Android Chrome → android');
ok(cihazSinifi(SAFARI, 5) === 'ios', 'iPhone Safari → ios');
ok(cihazSinifi(MAC, 5) === 'ios', 'iPadOS (Mac UA + dokunma) → ios');
ok(cihazSinifi(MAC, 0) === 'masaustu', 'Mac → masaüstü');
ok(uygulamaIciMi(IG_IOS) && !uygulamaIciMi(SAFARI) && !uygulamaIciMi(CHROME_AND), 'Instagram uygulama içi; Safari/Chrome değil');

// Jetonlar
ok(jetonlariAl(J)?.refresh_token === J.refresh_token, 'geçerli yanıt jeton verir');
ok(jetonlariAl({ access_token: JWT }) === null, 'refresh_token yoksa null');
ok(jetonlariAl({ access_token: 'duz-metin', refresh_token: 'r3fr3shT0k3n' }) === null, 'JWT olmayan erişim jetonu null');
ok(jetonlariAl({ access_token: JWT, refresh_token: 'a b&c=d#e' }) === null, 'boşluk/& taşıyan yenileme jetonu null');
ok(jetonlariAl(null) === null && jetonlariAl([J]) === null, 'null / dizi null');

// Uygulamayı açan adres: YALNIZ iki jeton parametresi
const ios = oturumAdresi('ios', J);
ok(ios === `clubbeans://auth/callback?access_token=${JWT}&refresh_token=r3fr3shT0k3n`, 'iOS clubbeans:// şeması', ios);
const params = new URLSearchParams(ios.split('?')[1]);
ok([...params.keys()].join(',') === 'access_token,refresh_token', 'yalnız iki parametre', [...params.keys()].join(','));
const and = oturumAdresi('android', J);
ok(and.startsWith('intent://auth/callback?access_token=') && and.includes('#Intent;scheme=clubbeans;package=com.clubbeans;'), 'Android intent:// paket adlı', and.slice(0, 60));
ok(and.includes(`S.browser_fallback_url=${encodeURIComponent('https://play.google.com/store/apps/details?id=com.clubbeans')};end`), 'Android Play yedeği');
ok(oturumAdresi('masaustu', J).startsWith('clubbeans://'), 'masaüstü şema (düğme gösterilmez ama adres tutarlı)');

// Hata metinleri
const k = (d: number, kod: unknown) => hataBilgisi(d, kod);
ok(!k(410, 'BAGLANTI_KULLANILDI').tekrarDenenir && k(410, 'BAGLANTI_KULLANILDI').metin.includes('yedek giriş'), '410 kullanıldı → yedek yol, tekrar yok');
ok(k(410, 'BAGLANTI_KENDI_GIRISI').metin.includes('Uygulamayı açman yeterli'), 'kendi girişi → uygulamayı aç');
ok(k(429, 'COK_DENEME').tekrarDenenir, '429 → tekrar denenir');
ok(k(0, undefined).metin.startsWith('İnternete ulaşamadık') && k(0, undefined).tekrarDenenir, 'ağ yok → tekrar');
ok(k(500, 'SUNUCU_HATASI').tekrarDenenir && k(503, 'GECICI_HATA').tekrarDenenir, '5xx → tekrar');
ok(k(410, 'BAGLANTI_KAPALI').metin.includes('kapalı'), 'kapatma şalteri metni');
const yasak = /\b(Event|User|Join|Admin|Success|Tribe|Signal)\b/;
const tumMetinler = ['BAGLANTI_KULLANILDI', 'BAGLANTI_SURESI_DOLDU', 'BAGLANTI_IPTAL', 'BAGLANTI_KENDI_GIRISI', 'BAGLANTI_BULUNAMADI', 'BAGLANTI_KAPALI', 'HESAP_KULLANILAMAZ', 'COK_DENEME', 'X'].map((c) => k(410, c).metin);
ok(tumMetinler.every((m) => !yasak.test(m)), 'marka dışı terim yok');

// Satır içi betik: anahtarı alır, adresi temizler; uygulama içi tarayıcıda adresi KORUR
function kos(hash: string, search: string, ua: string) {
  const durum: { k?: string | null; temizlendi?: string | null } = { temizlendi: null };
  const w = {
    location: { hash, search, pathname: '/hazir' },
    history: { replaceState: (_s: unknown, _t: string, u: string) => { durum.temizlendi = u; } },
    __hazirK: undefined as string | null | undefined,
  };
  new Function('window', 'navigator', temizlemeBetigi())(w, { userAgent: ua });
  durum.k = w.__hazirK;
  return durum;
}
const s1 = kos(`#k=${ANAHTAR}`, '', SAFARI);
ok(s1.k === ANAHTAR && s1.temizlendi === '/hazir', 'hash anahtarı alınır + adres temizlenir', JSON.stringify(s1));
const s2 = kos('', `?k=${ANAHTAR}`, CHROME_AND);
ok(s2.k === ANAHTAR && s2.temizlendi === '/hazir', '?k= yedeği alınır + temizlenir');
const s3 = kos(`#k=${ANAHTAR}`, '', IG_IOS);
ok(s3.k === ANAHTAR && s3.temizlendi === null, 'Instagram içinde adres KORUNUR (Tarayıcıda aç taşısın)', JSON.stringify(s3));
const s4 = kos('#k=kisa', '', SAFARI);
ok(s4.k === null && s4.temizlendi === '/hazir', 'bozuk anahtar null, adres yine temizlenir');
const s5 = kos('', '', SAFARI);
ok(s5.k === null && s5.temizlendi === null, 'parametresiz sayfa dokunulmaz');

// Sentry maskesi
ok(gizliMaskele(`https://www.clubbeans.com/hazir#k=${ANAHTAR}`) === 'https://www.clubbeans.com/hazir#k=[maskeli]', 'URL hash maskelenir');
ok(!gizliMaskele(ios).includes(JWT) && !gizliMaskele(ios).includes('r3fr3shT0k3n'), 'şema adresindeki iki jeton maskelenir', gizliMaskele(ios));
ok(gizliMaskele(`Bearer ${JWT}`) === 'Bearer [maskeli-jwt]', 'çıplak JWT maskelenir');
ok(gizliMaskele('/club/abc?ref=share') === '/club/abc?ref=share', 'zararsız adres değişmez');
const olay = {
  request: { url: `https://www.clubbeans.com/hazir#k=${ANAHTAR}` },
  transaction: '/hazir',
  breadcrumbs: [{ category: 'navigation', data: { from: `/hazir#k=${ANAHTAR}`, to: '/hazir' } }],
};
const m = olayMaskele(olay);
ok(!JSON.stringify(m).includes(ANAHTAR), 'olayın hiçbir alanında anahtar kalmaz', JSON.stringify(m));
const temizOlay = { request: { url: 'https://www.clubbeans.com/' } };
ok(olayMaskele(temizOlay) === temizOlay, 'temiz olay aynı nesne döner (kopyalanmaz)');
const dongu: Record<string, unknown> = { request: { url: `/hazir#k=${ANAHTAR}` }, breadcrumbs: [{ message: `/hazir?k=${ANAHTAR}` }] };
dongu.self = dongu;
const md = olayMaskele(dongu) as { request: { url: string }; breadcrumbs: Array<{ message: string }> };
ok(!md.request.url.includes(ANAHTAR) && !md.breadcrumbs[0].message.includes(ANAHTAR), 'serileşmeyen (döngülü) olayda alan maskesi');

console.log(fail ? `\n✗ ${fail} başarısız` : '\n✅ GEÇTİ');
process.exit(fail ? 1 : 0);
