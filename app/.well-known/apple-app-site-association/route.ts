/**
 * @route /.well-known/apple-app-site-association
 * @governing_law PLATFORM_ANAYASASI, NAVIGASYON_ANAYASASI
 *
 * Apple Universal Links AASA file (Content-Type: application/json zorunlu).
 * Apple CDN proxy redirect tolere etmez (301/302/307 hepsi reddedilir).
 * Static public/.well-known/ content-type: application/octet-stream döndürüyordu —
 * Apple parse fail → sessizce UL bozuluyordu. Route Handler ile fix.
 *
 * Sprint: share-2-alpha-web Commit 3
 */

import { NextResponse } from 'next/server';

const AASA = {
  applinks: {
    apps: [],
    details: [
      {
        appID: '3FKY8YVC66.com.clubbeans.app',
        paths: [
          '/bean/*',
          '/club/*',
          '/user/*',
          '/post/*',
          'NOT /privacy',
          'NOT /terms',
          'NOT /support',
          'NOT /delete-account',
        ],
      },
    ],
  },
  webcredentials: {
    apps: ['3FKY8YVC66.com.clubbeans.app'],
  },
};

export const dynamic = 'force-static';
export const revalidate = false;

export function GET() {
  return NextResponse.json(AASA, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
