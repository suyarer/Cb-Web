/**
 * RIZA BEKÇİSİ — çerez onayının GERÇEK tarayıcı davranışı (KVKK, 2026-09-25).
 *
 * Neden var: eski kod reklamdan gelen (fbclid) ziyaretçiyi, "Hayır" demiş olsa bile otomatik
 * "granted" yapıyordu; PostHog ise karar vermemiş ziyaretçide oturum kaydı başlatıyordu. Kod
 * okumak bunu yakalamadı — tarayıcıda izleyici isteği sayılır.
 *
 * İzleyici istekleri (Meta, PostHog, /api/meta-capi) tarayıcıda KESİLİR ve yalnız kaydedilir:
 * bekçi hiçbir veriyi dışarı göndermez, canlı sitede de güvenle koşar.
 *
 * Kullanım: node scripts/riza-bekcisi.mjs [taban-url]     (varsayılan http://localhost:3217)
 * Yerel koşu için derlemeyi sahte anahtarlarla yap (bant yalnız Pixel ID varken görünür):
 *   NEXT_PUBLIC_FB_PIXEL_ID=100000000000001 NEXT_PUBLIC_POSTHOG_KEY=phc_yerel_sinama \
 *   NEXT_PUBLIC_POSTHOG_HOST=http://127.0.0.1:9 npx next build && npx next start -p 3217
 */

import { chromium, webkit } from 'playwright';

const TABAN = process.argv[2] ?? 'http://localhost:3217';
const SAYFA = `${TABAN}/indir?fbclid=BEKCI_TEST_ID&utm_source=meta`;
const IZLEYICI = /facebook\.(com|net)|fbevents|\/api\/meta-capi|posthog|127\.0\.0\.1:9/i;
// PostHog ilk isteğini init'ten saniyeler sonra atar (config.js) → "izleyici yok" iddiası için TAM bekle,
// "izleyici başladı" iddiası için yokla. 2,5 sn'lik ilk sürüm başlamış PostHog'u göremedi (2026-09-25).
const SESSIZLIK_MS = 6000;
const bekle = async (sayfa, kosul, ms = 12000) => { for (let t = 0; t < ms && !kosul(); t += 500) await sayfa.waitForTimeout(500); };
const V1 = 'clubbeans-consent-v1';
const V2 = 'clubbeans-consent-v2';

const sonuc = [];
const atlanan = [];
const kontrol = (motor, ad, gecti, ayrinti) => sonuc.push({ motor, ad, gecti, ayrinti });

async function yeniSayfa(tarayici, onceki) {
  const baglam = await tarayici.newContext();
  if (onceki) await baglam.addInitScript(onceki);
  const sayfa = await baglam.newPage();
  const istekler = [];
  // SAY: her deneme ('request' olayı — sitenin CSP'sine takılıp ağa hiç çıkmayanlar dahil; yerelde sahte PostHog
  // adresi CSP'ye takılıyordu ve yalnız route ile sayınca başlamış PostHog görünmüyordu). KES: ağa çıkanı durdur.
  sayfa.on('request', (r) => { if (IZLEYICI.test(r.url())) istekler.push(r.url().slice(0, 90)); });
  await sayfa.route(IZLEYICI, (r) => r.abort());
  return { baglam, sayfa, istekler };
}

const bantGorunur = (s) => s.getByRole('dialog').filter({ hasText: 'Meta Pikseli' }).isVisible();

async function baslat(tur, motor) {
  try {
    return await tur.launch();
  } catch (e) {
    if (motor === 'chromium') return tur.launch({ channel: 'chrome' });   // Playwright tarayıcısı yoksa kurulu Chrome
    throw e;
  }
}

async function denetle(tur, motor) {
  let tarayici;
  try {
    tarayici = await baslat(tur, motor);
  } catch (e) {
    atlanan.push(`${motor}: ${String(e).split('\n')[0].slice(0, 100)}`);
    return;
  }

  // 1) Temiz profil + reklam tıklaması → bant var, izleyici YOK, cihaza reklam kimliği yazılmaz
  {
    const { baglam, sayfa, istekler } = await yeniSayfa(tarayici);
    await sayfa.goto(SAYFA, { waitUntil: 'load' });
    await sayfa.waitForTimeout(SESSIZLIK_MS);
    const depo = await sayfa.evaluate(([v2]) => ({ riza: localStorage.getItem(v2), ts: sessionStorage.getItem('cb-fbclid-ts') }), [V2]);
    kontrol(motor, '1 reklam tıklaması onay sayılmaz', (await bantGorunur(sayfa)) && istekler.length === 0 && !depo.riza && !depo.ts,
      { bant: await bantGorunur(sayfa), istekler, depo });
    await baglam.close();
  }

  // 2) Önceden "Hayır" + reklam tıklaması → "Hayır" korunur, izleyici YOK
  {
    const { baglam, sayfa, istekler } = await yeniSayfa(tarayici, `try{localStorage.setItem('${V2}','denied')}catch{}`);
    await sayfa.goto(SAYFA, { waitUntil: 'load' });
    await sayfa.waitForTimeout(SESSIZLIK_MS);
    const riza = await sayfa.evaluate((v2) => localStorage.getItem(v2), V2);
    kontrol(motor, '2 önceki Hayır ezilmez', riza === 'denied' && istekler.length === 0 && !(await bantGorunur(sayfa)), { riza, istekler });
    await baglam.close();
  }

  // 3) Eski v1 "granted" (auto-grant mirası) → geçersiz: silinir, bant yeniden sorar, izleyici YOK
  {
    const { baglam, sayfa, istekler } = await yeniSayfa(tarayici, `try{localStorage.setItem('${V1}','granted')}catch{}`);
    await sayfa.goto(SAYFA, { waitUntil: 'load' });
    await sayfa.waitForTimeout(SESSIZLIK_MS);
    const v1 = await sayfa.evaluate((k) => localStorage.getItem(k), V1);
    kontrol(motor, '3 eski v1 onayı geçersiz', v1 === null && istekler.length === 0 && (await bantGorunur(sayfa)), { v1, istekler });
    await baglam.close();
  }

  // 4-6) İzin ver → izleyiciler başlar · Çerez tercihleri → Hayır → yeni istek yok · düğmeler eşit
  try {
    const { baglam, sayfa, istekler } = await yeniSayfa(tarayici);
    await sayfa.goto(SAYFA, { waitUntil: 'load' });
    await sayfa.waitForTimeout(1500);
    const dugmeler = sayfa.getByRole('dialog').getByRole('button');
    const siniflar = await dugmeler.evaluateAll((d) => d.map((x) => [x.textContent?.trim(), x.className]));
    kontrol(motor, '6 düğmeler eşit görünür', siniflar.length === 2 && siniflar[0][1] === siniflar[1][1], { siniflar });

    await sayfa.getByRole('button', { name: 'İzin ver' }).click({ timeout: 8000 });
    const metaSay = () => istekler.filter((u) => /facebook|fbevents|meta-capi/i.test(u)).length;
    const phSay = () => istekler.filter((u) => /posthog|127\.0\.0\.1:9/i.test(u)).length;
    await bekle(sayfa, () => metaSay() > 0 && phSay() > 0);
    const meta = metaSay();
    const ph = phSay();
    const ts = await sayfa.evaluate(() => sessionStorage.getItem('cb-fbclid-ts'));
    kontrol(motor, '4 İzin ver → Meta + PostHog başlar', meta > 0 && ph > 0 && !!ts, { meta, ph, ts: !!ts });

    await sayfa.getByRole('button', { name: 'Çerez tercihleri' }).click();
    await sayfa.waitForTimeout(500);
    const bantTekrar = await bantGorunur(sayfa);
    await sayfa.getByRole('dialog').getByRole('button', { name: 'Hayır' }).click();
    await sayfa.waitForTimeout(800);
    const once = istekler.length;
    await sayfa.goto(`${TABAN}/privacy`, { waitUntil: 'load' });
    await sayfa.waitForTimeout(SESSIZLIK_MS);
    const yeni = istekler.slice(once);
    kontrol(motor, '5 Çerez tercihleri → Hayır → izleme durur', bantTekrar && yeni.length === 0, { bantTekrar, yeni });
    await baglam.close();
  } catch (e) {
    kontrol(motor, '4-5 onay ver / geri al akışı', false, { hata: String(e).split('\n')[0].slice(0, 140) });
  }

  await tarayici.close();
}

await denetle(chromium, 'chromium');
await denetle(webkit, 'webkit');

let kalan = 0;
for (const k of sonuc) {
  if (!k.gecti) kalan += 1;
  console.log(`${k.gecti ? 'GEÇTİ' : 'KALDI'}  [${k.motor}] ${k.ad}${k.gecti ? '' : `  ${JSON.stringify(k.ayrinti)}`}`);
}
for (const a of atlanan) console.log(`ATLANDI ${a}  (npx playwright install ile kurulabilir)`);
if (!sonuc.length) { console.log('\n❌ hiçbir motor koşmadı — sonuç YOK (geçti sayılmaz)'); process.exit(2); }
console.log(kalan ? `\n❌ ${kalan} kontrol kaldı (${TABAN})` : `\n✅ ${sonuc.length}/${sonuc.length} geçti (${TABAN})${atlanan.length ? ` — ${atlanan.length} motor atlandı` : ''}`);
process.exit(kalan ? 1 : 0);
