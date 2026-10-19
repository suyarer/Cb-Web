/**
 * İstemci IP'si bekçisi — Vercel derlemesinden ÖNCE koşar (vercel.json buildCommand).
 * @governing_law clubbeans-privacy-v1 · CB2026 sprint site-ip-cloudflare-2026-10-19
 *
 * NEDEN: clubbeans.com Cloudflare arkasında; Vercel x-forwarded-for / x-real-ip'i Cloudflare çıkış IP'siyle ezer.
 * Aynı hata İKİ kez üretime çıktı: oyunda (ab7c2c8 — tüm oyuncular tek hız-sınırı kovası) ve 19.10'da sayaç +
 * abonelik + Meta CAPI. İkinci tekrarda not değil kapı: IP okuması yalnız lib/istemciIp.ts'de olabilir.
 *
 * Kural (yorumlar soyulduktan sonra, büyük/küçük harf duyarsız): IP başlığı adı literali, 'x-vercel-ip-' öneki,
 * ipAddress( / geolocation( çağrısı ya da '@vercel/functions' importu → İHLAL.
 * Tarama: app/ lib/ components/ altındaki .ts/.tsx + kökte proxy, middleware, instrumentation(-client), sentry.X.config (.ts).
 * İzinli tek dosya: lib/istemciIp.ts. scripts/ ve docs/ taranmaz.
 * Kullanım: node scripts/ip-bekcisi.mjs            → 0 temiz, 1 ihlal
 *           node scripts/ip-bekcisi.mjs --selftest → ihlal örnekleri KIRMIZI, temiz örnekler YEŞİL olmalı
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const IZINLI = 'lib/istemciIp.ts';
const ATLA = new Set(['node_modules', '.next', '.git', '.vercel']);
const DESENLER = [
  [/['"`](x-forwarded-for|x-real-ip|cf-connecting-ip|x-vercel-forwarded-for|true-client-ip|x-client-ip)['"`]/i, 'IP başlığı'],
  [/['"`]x-vercel-ip-/i, 'x-vercel-ip-* (Cloudflare IP\'sinden türer)'],
  [/\bipAddress\s*\(/, 'ipAddress()'],
  [/\bgeolocation\s*\(/, 'geolocation()'],
  [/['"`]@vercel\/functions['"`]/, '@vercel/functions'],
];

/** Yorumları satır numarasını koruyarak soyar (blok yorum → boşluk; // yalnız satır başı/boşluk/ayraç sonrası). */
function yorumsuz(metin) {
  return metin
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .split('\n')
    .map((s) => s.replace(/(^|[\s;,({}])\/\/.*$/, '$1'))
    .join('\n');
}

export function denetleMetin(metin) {
  const bulgular = [];
  yorumsuz(metin).split('\n').forEach((satir, i) => {
    for (const [re, ad] of DESENLER) if (re.test(satir)) bulgular.push({ satir: i + 1, ad });
  });
  return bulgular;
}

function dosyalar(dizin) {
  const sonuc = [];
  for (const ad of readdirSync(dizin)) {
    if (ATLA.has(ad)) continue; // .well-known gibi noktalı ROTA klasörleri taranır
    const yol = join(dizin, ad);
    if (statSync(yol).isDirectory()) sonuc.push(...dosyalar(yol));
    else if (/\.tsx?$/.test(ad)) sonuc.push(yol);
  }
  return sonuc;
}

function taranacaklar() {
  const kok = readdirSync(KOK)
    .filter((ad) => /^(proxy|middleware|instrumentation[\w.-]*|sentry\.[\w-]+\.config)\.ts$/.test(ad))
    .map((ad) => join(KOK, ad));
  return [...['app', 'lib', 'components'].flatMap((d) => dosyalar(join(KOK, d))), ...kok];
}

if (process.argv.includes('--selftest')) {
  const IHLAL = [
    "const ip = req.headers.get('x-forwarded-for');",
    'const r = headers.get("X-Real-IP");',
    'const H = `cf-connecting-ip`;',
    'const ip = ipAddress(req);',
    "import { geolocation } from '@vercel/functions';",
    "const ulke = req.headers.get('x-vercel-ip-country');",
  ];
  const TEMIZ = [
    '// x-forwarded-for burada okunmaz; lib/istemciIp kullan',
    '/* x-real-ip Cloudflare çıkış IP\'sidir */ const a = 1;',
    'navigator.geolocation.getCurrentPosition(cb);',
    "const p = req.headers.get('x-forwarded-proto'); const u = 'https://a.com//b';",
  ];
  const kirmizi = IHLAL.filter((m) => denetleMetin(m).length > 0).length;
  const yesil = TEMIZ.filter((m) => denetleMetin(m).length === 0).length;
  console.log(`selftest ihlal-kırmızı=${kirmizi}/${IHLAL.length} temiz-yeşil=${yesil}/${TEMIZ.length}`);
  process.exit(kirmizi === IHLAL.length && yesil === TEMIZ.length ? 0 : 1);
}

const ihlaller = [];
let sayilan = 0;
for (const yol of taranacaklar()) {
  const goreli = relative(KOK, yol);
  if (goreli === IZINLI) continue;
  sayilan += 1;
  for (const b of denetleMetin(readFileSync(yol, 'utf8'))) ihlaller.push(`${goreli}:${b.satir} — ${b.ad}`);
}
if (ihlaller.length) {
  console.error(`❌ ip-bekcisi: ${ihlaller.length} ihlal — istemci IP'sini yalnız ${IZINLI} okuyabilir (Cloudflare arkası):`);
  for (const s of ihlaller) console.error(`   ${s}`);
  process.exit(1);
}
console.log(`✅ ip-bekcisi: ${sayilan} dosya tarandı, ihlal 0 (izinli: ${IZINLI})`);
