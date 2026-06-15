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
 *    Source: androidpublisher generatedApks API (internal track vc23 certificateSha256Hash)
 *    = D3:BE:03:...:0B:BE:79
 * 2) EAS upload keystore (production, S8RNZ754YW) — for direct (non-Play) APK installs / dev.
 *    Source: vc23 AAB signer cert (keytool -printcert) = 10:9E:C4:...:BF:34:CA
 *
 * Sprint: SHARE-2-CB-WEB-ANDROID-ASSETLINKS-FINGERPRINT (#442, 2026-06-07)
 * Sprint 431-DEEP-AUDIT (2026-06-09): package_name com.clubbeans.app → com.clubbeans
 * PARITY-AUTH-1 (2026-06-15): stale 5E:39:34... → gerçek Play App Signing D3:BE:03... +
 *    upload key 10:9E:C4...; ilk Play (internal) upload sonrası App Links DOĞRULANDI.
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
        'D3:BE:03:07:BD:36:E3:7F:38:10:4D:85:D4:4D:40:F7:40:36:13:A0:C0:E8:40:3C:00:1F:3C:E7:D1:45:E3:DE:76:F3:7E:C0:13:C1:41:0C:1E:39:F0:10:35:0B:BE:79',
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
