/**
 * @route /.well-known/assetlinks.json
 * @governing_law PLATFORM_ANAYASASI, NAVIGASYON_ANAYASASI
 *
 * Android Digital Asset Links (Universal Links / App Links verification).
 * Content-Type: application/json zorunlu.
 * SHA256 fingerprint: EAS upload key + Play App Signing key (dual fingerprint
 * Google önerisi). Production fingerprint user'dan beklenir (Sprint Commit 1).
 *
 * Sprint: share-2-alpha-web Commit 3
 */

import { NextResponse } from 'next/server';

const ASSETLINKS = [
  {
    relation: ['delegate_permission/common.handle_all_urls'],
    target: {
      namespace: 'android_app',
      package_name: 'com.clubbeans.app',
      sha256_cert_fingerprints: [
        'REPLACE_WITH_EAS_UPLOAD_KEY_SHA256',
        'REPLACE_WITH_PLAY_APP_SIGNING_SHA256',
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
