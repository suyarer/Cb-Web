/**
 * @route /.well-known/assetlinks.json
 * @governing_law PLATFORM_ANAYASASI, NAVIGASYON_ANAYASASI
 *
 * Android Digital Asset Links (Universal Links / App Links verification).
 * Content-Type: application/json zorunlu.
 *
 * SHA256 fingerprints:
 * 1) EAS upload keystore (production, S8RNZ754YW Team)
 *    Source: EAS GraphQL androidKeystore.sha256CertificateFingerprint
 *    Sprint 431-MIGRATION (2026-06-08): Yeni Apple Developer hesabı + yeni package
 * 2) Play App Signing fingerprint (Google generated after Play Console upload)
 *    Source: Play Console → Setup → App Integrity → App signing key certificate
 *    TODO: Play Console SHA-256 production'a yüklenince eklenecek.
 *
 * Sprint: SHARE-2-CB-WEB-ANDROID-ASSETLINKS-FINGERPRINT (#442, 2026-06-07)
 * Sprint 431-DEEP-AUDIT (2026-06-09): package_name com.clubbeans.app → com.clubbeans
 */

import { NextResponse } from 'next/server';

const ASSETLINKS = [
  {
    relation: ['delegate_permission/common.handle_all_urls'],
    target: {
      namespace: 'android_app',
      package_name: 'com.clubbeans',
      sha256_cert_fingerprints: [
        '5E:39:34:65:AC:D7:C3:A4:75:B7:7C:FE:E6:EC:76:D3:8E:3C:FF:E1:D0:8A:51:B2:B0:37:2A:44:7A:1B:58:4E',
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
