/**
 * İstemci IP'si — Cloudflare arkasında gerçek ziyaretçi IP'si (lib/istemciIp).
 * Gerçek üretim başlık şekilleriyle: Cloudflare'den gelen istekte x-forwarded-for / x-real-ip = Cloudflare çıkış IP'si.
 */
import { istemciIp, istemciIpKaynagi } from '../lib/istemciIp.ts';

let fail = 0;
const ok = (c: boolean, m: string, x = '') => { if (!c) { console.log('  ✗', m, x); fail++; } else console.log('  ✓', m); };
const istek = (h: Record<string, string>) => new Request('https://www.clubbeans.com/api/sayac', { method: 'POST', headers: h });

const CF_CIKIS = '172.71.182.10';
const ZIYARETCI = '88.230.14.7';

console.log('\n== Cloudflare arkası (üretim) ==');
const cf = istek({ 'cf-ray': 'a4d0a260cb10be9d-IST', 'cf-connecting-ip': ZIYARETCI, 'x-forwarded-for': CF_CIKIS, 'x-real-ip': CF_CIKIS });
ok(istemciIp(cf) === ZIYARETCI, 'cf-ray varsa cf-connecting-ip okunur, CF çıkış IP\'si değil', String(istemciIp(cf)));
ok(istemciIpKaynagi(cf).kaynak === 'cf', 'kaynak = cf');
const cf6 = istek({ 'cf-ray': 'x-AMS', 'cf-connecting-ip': ' 2a02:ff0:3::1 ', 'x-real-ip': CF_CIKIS });
ok(istemciIp(cf6) === '2a02:ff0:3::1', 'IPv6 + boşluk kırpılır');

console.log('\n== Uydurma koruması ==');
const uydurma = istek({ 'cf-connecting-ip': '1.2.3.4', 'x-real-ip': ZIYARETCI });
ok(istemciIp(uydurma) === ZIYARETCI, 'cf-ray yoksa cf-connecting-ip YOK sayılır');
ok(istemciIpKaynagi(uydurma).kaynak === 'real', 'kaynak = real');
const xffSol = istek({ 'x-forwarded-for': '6.6.6.6, ' + ZIYARETCI });
ok(istemciIp(xffSol) === null, 'x-forwarded-for sol ucu hiç okunmaz (istemci uydurabilir)');

console.log('\n== Vercel platform başlıkları ==');
const vf = istek({ 'x-vercel-forwarded-for': `${ZIYARETCI}, 10.0.0.1` });
ok(istemciIp(vf) === ZIYARETCI, 'x-vercel-forwarded-for ilk değeri');
ok(istemciIpKaynagi(vf).kaynak === 'vercel', 'kaynak = vercel');
const cfBos = istek({ 'cf-ray': 'x-IST', 'cf-connecting-ip': '  ', 'x-real-ip': ZIYARETCI });
ok(istemciIp(cfBos) === ZIYARETCI, 'cf-connecting-ip boşsa x-real-ip\'e düşer');

console.log('\n== IP yok ==');
const yok = istek({});
ok(istemciIp(yok) === null, 'başlık yoksa null');
ok(istemciIpKaynagi(yok).kaynak === 'yok', 'kaynak = yok');

console.log(fail ? `\n❌ ${fail} BAŞARISIZ\n` : '\n✅ GEÇTİ\n');
process.exit(fail ? 1 : 0);
