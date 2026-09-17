/**
 * Platform tespiti — /indir sayfası doğru mağazayı en üste koyabilsin.
 * Gerçek User-Agent dizeleriyle (Safari, Chrome, uygulama-içi tarayıcılar, masaüstü).
 */
import { platformBul } from '../lib/platform.ts';

let fail = 0;
const ok = (c: boolean, m: string, x = '') => { if (!c) { console.log('  ✗', m, x); fail++; } else console.log('  ✓', m); };

const IPHONE_SAFARI = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1';
const IPHONE_INSTAGRAM = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 350.0.0.0.0 (iPhone16,2; iOS 18_5; tr_TR)';
const IPAD_ESKI = 'Mozilla/5.0 (iPad; CPU OS 15_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1';
const IPOD = 'Mozilla/5.0 (iPod touch; CPU iPhone OS 15_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148';
const ANDROID_CHROME = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36';
const ANDROID_WHATSAPP_WEBVIEW = 'Mozilla/5.0 (Linux; Android 13; SM-A536B Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/138.0.0.0 Mobile Safari/537.36';
const SAMSUNG_INTERNET = 'Mozilla/5.0 (Linux; Android 14; SAMSUNG SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/27.0 Chrome/125.0.0.0 Mobile Safari/537.36';
const MAC_SAFARI = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15';
const WINDOWS_CHROME = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36';
const WHATSAPP_ONIZLEME = 'WhatsApp/2.24.10.78 A';

console.log('\n== iOS ==');
ok(platformBul(IPHONE_SAFARI) === 'ios', 'iPhone Safari');
ok(platformBul(IPHONE_INSTAGRAM) === 'ios', 'iPhone Instagram uygulama-içi tarayıcı');
ok(platformBul(IPAD_ESKI) === 'ios', 'iPad (iPadOS öncesi UA)');
ok(platformBul(IPOD) === 'ios', 'iPod touch');

console.log('\n== Android ==');
ok(platformBul(ANDROID_CHROME) === 'android', 'Android Chrome');
ok(platformBul(ANDROID_WHATSAPP_WEBVIEW) === 'android', 'Android WebView (WhatsApp içi)');
ok(platformBul(SAMSUNG_INTERNET) === 'android', 'Samsung Internet');

console.log('\n== Bilinmiyor (iki mağaza + QR gösterilir) ==');
ok(platformBul(MAC_SAFARI) === 'bilinmiyor', 'Mac Safari (iPadOS masaüstü UA da buraya düşer — iki mağaza gösterilir)');
ok(platformBul(WINDOWS_CHROME) === 'bilinmiyor', 'Windows Chrome');
ok(platformBul(WHATSAPP_ONIZLEME) === 'bilinmiyor', 'bağlantı önizleme botu');
ok(platformBul('') === 'bilinmiyor', 'boş UA');
ok(platformBul(null) === 'bilinmiyor', 'UA başlığı yok');

console.log(fail ? `\n❌ ${fail} BAŞARISIZ\n` : '\n✅ GEÇTİ\n');
process.exit(fail ? 1 : 0);
