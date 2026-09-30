/**
 * @route /.well-known/assetlinks.json
 * @governing_law PLATFORM_ANAYASASI, NAVIGASYON_ANAYASASI
 *
 * Android Digital Asset Links (Universal Links / App Links verification).
 * Content-Type: application/json zorunlu.
 *
 * SHA256 fingerprints:
 * 1) Play App Signing key (Google generated) — installed Play-store apps are signed with
 *    THIS key, so App Links verification requires it. REQUIRED.
 *    Source: androidpublisher generatedApks API certificateSha256Hash (HEX, 32 bayt)
 *    = 07:4D:B7:...:A1:C7:55
 * 2) EAS upload keystore (production, S8RNZ754YW) — for direct (non-Play) APK installs / dev.
 *    Source: vc23 AAB signer cert (keytool -printcert) = 10:9E:C4:...:BF:34:CA
 *
 * Sprint: SHARE-2-CB-WEB-ANDROID-ASSETLINKS-FINGERPRINT (#442, 2026-06-07)
 * Sprint 431-DEEP-AUDIT (2026-06-09): package_name com.clubbeans.app → com.clubbeans
 * PARITY-AUTH-1 (2026-06-15): stale 5E:39:34... → gerçek Play App Signing D3:BE:03... +
 *    upload key 10:9E:C4...; ilk Play (internal) upload sonrası App Links DOĞRULANDI.
 * ⚠️ DÜZELTME (2026-09-30, CB2026 İP-H): o gün yazılan D3:BE:03… 48 BAYTTI — API'nin HEX dizesi base64
 *    sanılıp çözülmüştü. Google DAL 3,5 ay 'malformed cert fingerprint' dedi; Play'den kurulan
 *    uygulamada App Links HİÇ doğrulanmadı (şifre sıfırlama bağlantısı tarayıcıda kaldı). "DOĞRULANDI"
 *    notu yalnız upload key ifadesinin listelenmesiydi. Bekçi: scripts/check-well-known.mjs (derlemede).
 */

import { NextResponse } from 'next/server';

const ASSETLINKS = [
  {
    relation: ['delegate_permission/common.handle_all_urls'],
    target: {
      namespace: 'android_app',
      package_name: 'com.clubbeans',
      sha256_cert_fingerprints: [
        // 1) Play App Signing key (Google generated) — installed Play apps signed with this. REQUIRED.
        '07:4D:B7:02:43:84:EE:2F:1E:1A:90:A2:E6:DA:6E:A8:AB:88:59:FF:49:52:83:7A:E8:FB:DB:45:8B:A1:C7:55',
        // 2) EAS upload keystore (production, S8RNZ754YW) — direct (non-Play) APK installs / dev.
        '10:9E:C4:4B:B6:29:A2:C3:64:74:77:64:0D:CE:33:87:CB:0E:C9:85:B5:F0:BE:DA:13:4D:8E:C4:11:BF:34:CA',
      ],
    },
  },
];

export const dynamic = 'force-static';
export const revalidate = false;

export function GET() {
  return NextResponse.json(ASSETLINKS, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
