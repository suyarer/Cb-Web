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
          // Sprint GAP-2 (2026-06-07): /auth/callback + /kyc-complete eklendi
          // Magic Link + KYC Didit callback URL'leri Apple Universal Link
          // gate'ini geçsin diye. Önceden listede yoktu → tap edince browser
          // açılıyordu, app açılmıyordu.
          '/auth/callback',
          '/kyc-complete',
          '/bean/*',
          '/club/*',
          '/user/*',
          '/post/*',
          // DEEP-CHAIN-4 (2026-06-07): cb-web web-only routes explicit NOT.
          // Önceden listede tanımsızdı → Apple default davranış browser açar
          // (zaten doğruydu), ama explicit NOT netliği artırır + Apple cache
          // davranışı kesinleşir.
          'NOT /privacy',
          'NOT /terms',
          'NOT /support',
          'NOT /delete-account',
          'NOT /sss',
          'NOT /manifesto',
          'NOT /fark',
          'NOT /founding-voices',
          'NOT /club-kur',
          'NOT /urun',
          'NOT /yol-haritasi',
          'NOT /unsubscribed',
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
