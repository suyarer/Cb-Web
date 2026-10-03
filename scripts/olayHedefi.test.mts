/**
 * Olay hedefinden Element çıkarma — CursorBean'in `mouseover` dinleyicisi hedef Document ya da
 * Text olduğunda `.closest()` çağırıp patlıyordu (Sentry CB-WEB-1 / CB-WEB-5).
 * DOM'suz koşar: Element/Text/Document taklitleri yalnız ilgili özellikleri taşır.
 */
import { hedefElemani } from '../lib/olayHedefi.ts';

let fail = 0;
const ok = (c: boolean, m: string) => { if (!c) { console.log('  ✗', m); fail++; } else console.log('  ✓', m); };
const hedef = (x: unknown) => x as EventTarget;

const baglanti = { nodeType: 1, closest: () => baglanti };
const metinBaglantida = { nodeType: 3, parentElement: baglanti };
const metinYetim = { nodeType: 3, parentElement: null };
const belge = { nodeType: 9 };
const pencere = { addEventListener: () => {} };
const sahteKapali = { nodeType: 1, closest: 'fonksiyon değil' };

console.log('\n== hedefElemani ==');
ok(hedefElemani(hedef(baglanti)) === baglanti, 'Element hedef → kendisi');
ok(hedefElemani(hedef(metinBaglantida)) === baglanti, 'metin düğümü → ebeveyn eleman (bağlantı üstünde hover algılanır)');
ok(hedefElemani(hedef(belge)) === null, 'Document hedef → null (closest çağrılmaz)');
ok(hedefElemani(hedef(pencere)) === null, 'Window benzeri hedef → null');
ok(hedefElemani(hedef(metinYetim)) === null, 'ebeveynsiz metin düğümü → null');
ok(hedefElemani(null) === null, 'null hedef → null');
ok(hedefElemani(hedef(sahteKapali)) === null, 'closest fonksiyon değilse → null');

console.log(fail ? `\n❌ ${fail} TEST KIRMIZI` : '\n✅ GEÇTİ');
process.exit(fail ? 1 : 0);
