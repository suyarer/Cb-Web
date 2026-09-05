/**
 * SOSYAL OBEZİTE — canlı denetim harness'i.
 *
 * Neden bu var: oyunun yakalama penceresi 1.8 saniye. Ekran görüntüsüyle elle
 * denetimde gidiş-dönüş ~10 saniye sürüyor, yani pencereyi vurmak fiziksel
 * olarak imkânsız ve "yakalama çalışmıyor" gibi YANLIŞ bulgular üretiyor.
 * Kare hızı, uzun görev, düzen kayması gibi ölçümler de göz kararı yapılamaz.
 *
 * Playwright ile hem WebKit (Safari motoru — hedef kitlenin çoğunluğu iPhone)
 * hem Chromium'da gerçek ölçüm alınır.
 *
 * Kullanım: node scripts/canli-denetim.mjs [taban-url]
 */

import { chromium, webkit } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { writeFileSync } from 'node:fs';

const TABAN = process.argv[2] ?? 'http://localhost:3100';
const OYUN = `${TABAN}/sosyal-obezite`;

const bulgular = [];
const not = (motor, alan, durum, mesaj, veri) =>
  bulgular.push({ motor, alan, durum, mesaj, ...(veri ? { veri } : {}) });

/** Kare hızı + uzun görev ölçümü sayfaya enjekte edilir. */
const OLCUM_BASLAT = `
window.__olcum = { kareler: [], uzunGorev: [], cls: 0 };
(function () {
  let son = performance.now();
  function kare(t) { window.__olcum.kareler.push(t - son); son = t; requestAnimationFrame(kare); }
  requestAnimationFrame(kare);
  try {
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__olcum.uzunGorev.push(Math.round(e.duration)); })
      .observe({ type: 'longtask', buffered: true });
  } catch {}
  try {
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__olcum.cls += e.value; })
      .observe({ type: 'layout-shift', buffered: true });
  } catch {}
})();
`;

async function motorDenetle(tarayiciTipi, ad) {
  const tarayici = await tarayiciTipi.launch();
  const baglam = await tarayici.newContext({
    viewport: { width: 393, height: 852 },      // iPhone 17 Pro mantık pikseli
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    locale: 'tr-TR',
  });
  const sayfa = await baglam.newContext ? null : null;
  const p = await baglam.newPage();

  const konsolHatalari = [];
  const agHatalari = [];
  /**
   * KVKK BEKÇİSİ (P0, 2026-09-05): oyun rotalarında Meta Pixel / CAPI / PostHog çerezli
   * örneği HİÇ istek atmamalı. Bir kez rızasız ateşlenmişti; bu sayaç 0 değilse KALDI.
   */
  const izleyiciIstekleri = [];
  p.on('request', (r) => {
    if (/facebook\.|fbevents|meta-capi|connect\.facebook/i.test(r.url())) izleyiciIstekleri.push(r.url().slice(0, 120));
  });
  p.on('console', (m) => { if (m.type() === 'error') konsolHatalari.push(m.text().slice(0, 200)); });
  p.on('requestfailed', (r) => agHatalari.push(`${r.url().slice(0, 120)} — ${r.failure()?.errorText}`));
  p.on('response', (r) => { if (r.status() >= 400) agHatalari.push(`HTTP ${r.status()} ${r.url().slice(0, 140)}`); });
  p.on('pageerror', (e) => konsolHatalari.push('PAGEERROR: ' + String(e).slice(0, 200)));

  await p.addInitScript(OLCUM_BASLAT);

  // ── 1) Yükleme ────────────────────────────────────────────────────────────
  const t0 = Date.now();
  await p.goto(OYUN, { waitUntil: 'load' });
  const yuklemeMs = Date.now() - t0;
  await p.waitForTimeout(1200);

  const vitals = await p.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] || {};
    const lcp = performance.getEntriesByType('largest-contentful-paint').at(-1);
    const fcp = performance.getEntriesByName('first-contentful-paint')[0];
    return {
      domInteractive: Math.round(nav.domInteractive || 0),
      loadEvent: Math.round(nav.loadEventEnd || 0),
      fcp: fcp ? Math.round(fcp.startTime) : null,
      lcp: lcp ? Math.round(lcp.startTime) : null,
      cls: Number((window.__olcum?.cls ?? 0).toFixed(4)),
      uzunGorev: window.__olcum?.uzunGorev ?? [],
    };
  });
  not(ad, 'yukleme', 'BILGI', `yükleme ${yuklemeMs}ms`, vitals);

  // ── 2) Giriş ekranı: dokunma hedefleri + kontrast ─────────────────────────
  const girisDugme = p.getByRole('button', { name: /60 saniye/i });
  const gorunur = await girisDugme.isVisible().catch(() => false);
  not(ad, 'giris', gorunur ? 'GECTI' : 'KALDI', gorunur ? 'itiraf kapısı görünür' : 'itiraf kapısı YOK');

  const kucukHedefler = await p.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('button, a, input, [role="button"]')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (r.height < 44 || r.width < 44) {
        out.push({ etiket: (el.textContent || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 40),
                   w: Math.round(r.width), h: Math.round(r.height) });
      }
    }
    return out;
  });
  not(ad, 'dokunma-hedefi', kucukHedefler.length ? 'UYARI' : 'GECTI',
      `44pt altı hedef: ${kucukHedefler.length}`, kucukHedefler);

  // ── 3) axe erişilebilirlik — giriş ekranı ─────────────────────────────────
  try {
    const axe = await new AxeBuilder({ page: p }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    not(ad, 'axe-giris', axe.violations.length ? 'UYARI' : 'GECTI',
        `${axe.violations.length} ihlal`,
        axe.violations.map((v) => ({ id: v.id, etki: v.impact, adet: v.nodes.length,
          ornek: v.nodes[0]?.html?.slice(0, 120) })));
  } catch (e) { not(ad, 'axe-giris', 'ATLANDI', String(e).slice(0, 120)); }

  // ── 4) Turu başlat ────────────────────────────────────────────────────────
  await girisDugme.click();
  await p.waitForTimeout(1500);
  await p.evaluate(() => { window.__olcum.kareler.length = 0; });

  // ── 5) Kaydırma hissi: gerçek fırlatma + kare hızı ────────────────────────
  /**
   * GERÇEK girdi kullanılır — `dispatchEvent` ile üretilen sahte PointerEvent
   * BU OYUNDA ÇALIŞMAZ: onDown ilk satırda `setPointerCapture(e.pointerId)`
   * çağırıyor ve var olmayan bir pointer kimliğiyle bu NotFoundError atıp
   * handler'ı yarıda kesiyor. Sahte olayla ölçülen "60 fps" aslında boşta
   * dönen rAF döngüsüydü, kaydırma hiç olmamıştı.
   */
  const kutu = p.viewportSize();
  const orta = Math.round(kutu.width / 2);

  const firlat = async () => {
    await p.mouse.move(orta, 700);
    await p.mouse.down();
    for (let i = 1; i <= 10; i++) {
      await p.mouse.move(orta, 700 - i * 48);
      await p.waitForTimeout(8);
    }
    await p.mouse.up();
  };

  // Isınma turu + ölçüm sıfırlama
  await firlat();
  await p.waitForTimeout(600);
  const oncekiOffset = await p.evaluate(() => document.querySelectorAll('[style*="translate3d"]').length);
  await p.evaluate(() => { window.__olcum.kareler.length = 0; window.__olcum.uzunGorev.length = 0; });

  for (let i = 0; i < 5; i++) { await firlat(); await p.waitForTimeout(700); }
  await p.waitForTimeout(500);

  const kare = await p.evaluate(() => {
    const k = (window.__olcum?.kareler ?? []).filter((x) => x > 0 && x < 500);
    if (!k.length) return null;
    const s = [...k].sort((a, b) => a - b);
    const ort = k.reduce((a, b) => a + b, 0) / k.length;
    return {
      kareSayisi: k.length,
      ortalamaMs: Number(ort.toFixed(2)),
      fps: Math.round(1000 / ort),
      p95Ms: Number(s[Math.floor(s.length * 0.95)].toFixed(2)),
      enKotuMs: Number(s.at(-1).toFixed(2)),
      dusukKare: k.filter((x) => x > 20).length,      // 50fps altı
      cokDusukKare: k.filter((x) => x > 34).length,   // 30fps altı
    };
  });
  const uzunGorev = await p.evaluate(() => window.__olcum?.uzunGorev ?? []);
  not(ad, 'uzun-gorev', uzunGorev.length ? 'UYARI' : 'GECTI',
      `${uzunGorev.length} uzun görev (>50ms)`, uzunGorev.slice(0, 8));

  not(ad, 'kare-hizi', kare && kare.fps >= 50 ? 'GECTI' : 'UYARI',
      kare ? `${kare.fps} fps ort, p95 ${kare.p95Ms}ms, 20ms üstü ${kare.dusukKare}/${kare.kareSayisi}` : 'ölçülemedi',
      kare);

  // ── 6) YAKALAMA MEKANİĞİ — 1.8sn penceresini programatik vur ──────────────
  const yakalama = await p.evaluate(async () => {
    /**
     * Skoru METİNDEN oku: HUD'da "SKOR" etiketinin hemen ardından gelen sayı.
     * Önceki sürüm `[class*="tabular"]` içindeki ilk rakamı alıyordu ve KALAN
     * sayacını okuyup her turda 0 döndürüyordu — yani test kendi kendini
     * kandırıyordu.
     */
    const skorOku = () => {
      const m = document.body.innerText.match(/SKOR\s*\n?\s*(-?\d+)/i);
      return m ? Number(m[1]) : null;
    };
    /** Gerçek AKTİF mi: işaret kutusunun HESAPLANMIŞ opaklığı (inline değil). */
    const isaret = () => [...document.querySelectorAll('div[aria-hidden]')].find((d) => {
      if (!d.className.includes?.('border-2')) return false;
      return Number(getComputedStyle(d).opacity) > 0.5;
    });

    const sonuc = { beklendiMs: 0, gorundu: false, oncekiSkor: skorOku(),
                    sonrakiSkor: null, klavyeSkor: null, hedefEtiket: null };
    const bas = performance.now();
    let im = null;
    while (performance.now() - bas < 28000) {
      im = isaret();
      if (im) { sonuc.gorundu = true; break; }
      await new Promise((r) => setTimeout(r, 25));
    }
    sonuc.beklendiMs = Math.round(performance.now() - bas);
    if (!sonuc.gorundu) return sonuc;

    sonuc.oncekiSkor = skorOku();
    return sonuc;   // asıl dokunuşu Playwright GERÇEK girdiyle atar
  });

  // Gerçek tıklama: pencere açıkken, tarayıcının kendi girdi hattından
  if (yakalama.gorundu) {
    await p.mouse.click(orta, 420, { delay: 30 });
    await p.waitForTimeout(400);
    yakalama.sonrakiSkor = await p.evaluate(() => {
      const m = document.body.innerText.match(/SKOR\s*\n?\s*(-?\d+)/i);
      return m ? Number(m[1]) : null;
    });
    yakalama.anons = await p.evaluate(() =>
      document.querySelector('[aria-live]')?.textContent?.trim() ?? null);
  }

  const yakalandi = yakalama.gorundu && yakalama.sonrakiSkor != null &&
    yakalama.oncekiSkor != null && yakalama.sonrakiSkor > yakalama.oncekiSkor;
  // Klavye yolu — giriş ekranı "boşluk yakalar" diyor, sözünü tutuyor mu?
  {
    const bekle = await p.evaluate(async () => {
      const isaret = () => [...document.querySelectorAll('div[aria-hidden]')].find(
        (d) => d.className.includes?.('border-2') && Number(getComputedStyle(d).opacity) > 0.5);
      const bas = performance.now();
      while (performance.now() - bas < 22000) {
        if (isaret()) return true;
        await new Promise((r) => setTimeout(r, 25));
      }
      return false;
    });
    let kOnce = null, kSonra = null;
    if (bekle) {
      const oku = () => p.evaluate(() => {
        const m = document.body.innerText.match(/SKOR\s*\n?\s*(-?\d+)/i);
        return m ? Number(m[1]) : null;
      });
      kOnce = await oku();
      await p.keyboard.press('Space');
      await p.waitForTimeout(400);
      kSonra = await oku();
    }
    not(ad, 'yakalama-klavye', bekle && kSonra > kOnce ? 'GECTI' : 'KALDI',
        bekle ? `boşluk: ${kOnce} → ${kSonra}` : 'gerçek belirmedi', { kOnce, kSonra });
  }
  not(ad, 'yakalama', yakalandi ? 'GECTI' : 'KALDI',
      yakalandi ? 'pencere içi dokunma skoru artırdı' : 'pencere içi dokunma skoru ARTIRMADI', yakalama);

  // ── 7) Tur sonu ekranı (poz modu) + axe ───────────────────────────────────
  const p2 = await baglam.newPage();
  await p2.goto(`${OYUN}?bitis=7`, { waitUntil: 'load' });
  await p2.waitForTimeout(2500);
  const sonEkran = await p2.evaluate(() => ({
    metin: document.body.innerText.slice(0, 700),
    yatayTasma: document.documentElement.scrollWidth > window.innerWidth + 1,
    scrollW: document.documentElement.scrollWidth, innerW: window.innerWidth,
  }));
  not(ad, 'tur-sonu', sonEkran.yatayTasma ? 'KALDI' : 'GECTI',
      sonEkran.yatayTasma ? `YATAY TAŞMA ${sonEkran.scrollW}>${sonEkran.innerW}` : 'yatay taşma yok');
  try {
    const axe2 = await new AxeBuilder({ page: p2 }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    not(ad, 'axe-tursonu', axe2.violations.length ? 'UYARI' : 'GECTI',
        `${axe2.violations.length} ihlal`,
        axe2.violations.map((v) => ({ id: v.id, etki: v.impact, adet: v.nodes.length,
          ornek: v.nodes[0]?.html?.slice(0, 120) })));
  } catch (e) { not(ad, 'axe-tursonu', 'ATLANDI', String(e).slice(0, 120)); }

  await p2.screenshot({ path: `/tmp/so-${ad}-tursonu.png`, fullPage: true }).catch(() => {});
  await p.screenshot({ path: `/tmp/so-${ad}-oynanis.png` }).catch(() => {});

  // ── 7b) KVKK bekçisi: utm'li açılışta ve önceden onaylı profilde bile izleyici yok ──
  {
    const p3 = await baglam.newPage();
    await p3.addInitScript(() => { try { localStorage.setItem('clubbeans-consent-v1', 'granted'); } catch {} });
    const p3Istek = [];
    p3.on('request', (r) => {
      if (/facebook\.|fbevents|meta-capi|connect\.facebook/i.test(r.url())) p3Istek.push(r.url().slice(0, 120));
    });
    await p3.goto(`${OYUN}?utm_source=denetim`, { waitUntil: 'load' });
    await p3.waitForTimeout(1500);
    const rizaYazildi = await p3.evaluate(() => localStorage.getItem('clubbeans-consent-v1'));
    const toplam = izleyiciIstekleri.length + p3Istek.length;
    not(ad, 'kvkk-izleyici', toplam === 0 ? 'GECTI' : 'KALDI',
        `oyun rotasında Meta/CAPI isteği: ${toplam} (onaylı profil + utm dahil)`,
        toplam ? { organik: izleyiciIstekleri.slice(0, 3), onayliUtm: p3Istek.slice(0, 3), rizaYazildi } : undefined);
    await p3.close();
  }

  // ── 8) Hata günlükleri ────────────────────────────────────────────────────
  const gercekAgHatalari = agHatalari.filter((x) => !x.includes('_vercel'));
  const gercekKonsol = konsolHatalari.filter((x) => !x.includes('_vercel') && !x.includes('insights'));
  not(ad, 'konsol', gercekKonsol.length ? 'UYARI' : 'GECTI', `${gercekKonsol.length} hata`, gercekKonsol.slice(0, 6));
  not(ad, 'ag', gercekAgHatalari.length ? 'UYARI' : 'GECTI', `${gercekAgHatalari.length} düşen istek`, gercekAgHatalari.slice(0, 6));

  await tarayici.close();
}

await motorDenetle(webkit, 'webkit');
await motorDenetle(chromium, 'chromium');

writeFileSync('/tmp/so-denetim.json', JSON.stringify(bulgular, null, 2));
console.log(`\n${'='.repeat(72)}\nSOSYAL OBEZİTE — CANLI DENETİM\n${'='.repeat(72)}`);
for (const b of bulgular) {
  const im = { GECTI: '✓', KALDI: '✗', UYARI: '!', BILGI: 'i', ATLANDI: '·' }[b.durum] ?? '?';
  console.log(`${im} [${b.motor}] ${b.alan}: ${b.mesaj}`);
  if (b.veri && b.durum !== 'GECTI') console.log('    ' + JSON.stringify(b.veri).slice(0, 600));
}
console.log('\nTam çıktı: /tmp/so-denetim.json');
