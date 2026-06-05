/**
 * @file proxy.ts (Next.js 16 — middleware.ts'in yeni adı)
 * @governing_law PLATFORM_ANAYASASI, NAVIGASYON_ANAYASASI
 *
 * Apex (clubbeans.com) → www.clubbeans.com 308 redirect.
 * ÖZEL: /.well-known/* path'leri redirect ETMEDEN serve edilir.
 * Apple AASA fetch + Google Asset Links fetch redirect (3xx) tolere etmiyor.
 *
 * Sprint: share-2-alpha-web Commit 4
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const host = request.headers.get('host');

  // 1. /.well-known/* her host'ta DOĞRUDAN serve et (redirect YOK)
  //    Apple ve Google CDN bu path'lerden 3xx tolere etmiyor.
  if (request.nextUrl.pathname.startsWith('/.well-known/')) {
    return NextResponse.next();
  }

  // 2. Apex (clubbeans.com) → www 308 permanent redirect (SEO canonical)
  if (host === 'clubbeans.com') {
    const url = request.nextUrl.clone();
    url.host = 'www.clubbeans.com';
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Static assets ve Next.js internal'leri hariç tüm path'ler
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
