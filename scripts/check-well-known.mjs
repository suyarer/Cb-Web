/**
 * .well-known biçim bekçisi — Vercel derlemesinden ÖNCE koşar (vercel.json buildCommand).
 * @governing_law PLATFORM_ANAYASASI, NAVIGASYON_ANAYASASI · CB2026 sprint acik-kalanlar-push-k10 İP-H4
 *
 * NEDEN (2026-09-30): assetlinks.json'daki Play App Signing parmak izi 48 bayttı (HEX dizesi base64 sanılıp
 * çözülmüştü). Google 3,5 ay 'malformed cert fingerprint' dedi; Play'den kurulan Android'de App Links hiç
 * doğrulanmadı → şifre sıfırlama bağlantısı uygulama yerine tarayıcıda kaldı. Kimse fark etmedi çünkü
 * hiçbir denetim yoktu.
 *
 * Kural: her sha256_cert_fingerprints girdisi tam 32 bayt ('AA:BB:…' 32 çift); package_name com.clubbeans;
 * AASA appID S8RNZ754YW.com.clubbeans ve '/auth/callback' yolu. Kaynak: route dosyaları (metin).
 * Kullanım: node scripts/check-well-known.mjs            → 0 sağlıklı, 1 bozuk
 *           node scripts/check-well-known.mjs --selftest → bozuk örnek KIRMIZI vermeli (bekçinin bekçisi)
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const PARMAK_IZI = /^([0-9A-F]{2}:){31}[0-9A-F]{2}$/;

export function denetle(assetlinks, aasa) {
  const hatalar = [];
  const izler = [...assetlinks.matchAll(/'([0-9A-Fa-f]{2}(?::[0-9A-Fa-f]{2})+)'/g)].map((m) => m[1]);
  if (izler.length === 0) hatalar.push('assetlinks: hiç parmak izi bulunamadı');
  for (const iz of izler) {
    if (!PARMAK_IZI.test(iz)) hatalar.push(`assetlinks: parmak izi 32 bayt değil (${iz.split(':').length} bayt): ${iz.slice(0, 20)}…`);
  }
  if (!/package_name:\s*'com\.clubbeans'/.test(assetlinks)) hatalar.push("assetlinks: package_name 'com.clubbeans' yok");
  if (!aasa.includes('S8RNZ754YW.com.clubbeans')) hatalar.push('AASA: appID S8RNZ754YW.com.clubbeans yok');
  if (!aasa.includes("'/auth/callback'")) hatalar.push("AASA: '/auth/callback' yolu yok");
  return hatalar;
}

const oku = (y) => readFileSync(join(KOK, y), 'utf8');

if (process.argv.includes('--selftest')) {
  const saglam = "package_name: 'com.clubbeans', ['07:4D:B7:02:43:84:EE:2F:1E:1A:90:A2:E6:DA:6E:A8:AB:88:59:FF:49:52:83:7A:E8:FB:DB:45:8B:A1:C7:55']";
  const bozuk = "package_name: 'com.clubbeans', ['D3:BE:03:07:BD:36:E3:7F:38:10:4D:85:D4:4D:40:F7:40:36:13:A0:C0:E8:40:3C:00:1F:3C:E7:D1:45:E3:DE:76:F3:7E:C0:13:C1:41:0C:1E:39:F0:10:35:0B:BE:79']";
  const aasa = "appIDs: ['S8RNZ754YW.com.clubbeans'], paths: ['/auth/callback']";
  const s = denetle(saglam, aasa).length === 0;
  const b = denetle(bozuk, aasa).length > 0;
  const a = denetle(saglam, "appIDs: ['X.com.baska']").length === 2;
  console.log(`selftest sağlam=${s} bozuk-kırmızı=${b} aasa-kırmızı=${a}`);
  process.exit(s && b && a ? 0 : 1);
}

const hatalar = denetle(
  oku('app/.well-known/assetlinks.json/route.ts'),
  oku('app/.well-known/apple-app-site-association/route.ts')
);
if (hatalar.length) {
  console.error('✗ .well-known bozuk — derleme durduruldu:\n  ' + hatalar.join('\n  '));
  process.exit(1);
}
console.log('✓ .well-known biçimi sağlam');
