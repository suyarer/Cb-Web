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

  // 1b. /auth/callback (şifre sıfırlama / sihirli bağlantı dönüşü) apex'te de DOĞRUDAN — Supabase redirect_to
  //     https://clubbeans.com/auth/callback; 308 → www bir atlama ekliyor, App Link/Universal Link değerlendirmesini
  //     yönlendirme zincirine bırakıyordu (CB2026 İP-H, 2026-09-30). Sayfa noindex; SEO etkisi yok.
  if (request.nextUrl.pathname === '/auth/callback') {
    return NextResponse.next();
  }

  // 1c. /hazir?k=… → /hazir#k=… (CB2026 hazir-hesap-giris-baglantisi, hasım B4). Bağlantı hash taşır; bir DM
  //     sarmalayıcısı hash'i sorguya çevirirse anahtar sorgudan atılır ki sonraki istek/günlük/Referer onu
  //     görmesin. Bu tek isteğin günlük satırı KABUL edilen artık risk (tek kullanımlık + DB'de yalnız özet).
  if (request.nextUrl.pathname === '/hazir' && request.nextUrl.search) {
    const k = request.nextUrl.searchParams.get('k') ?? '';
    const url = request.nextUrl.clone();
    url.search = '';
    url.hash = /^[A-Za-z0-9_-]{43}$/.test(k) ? `k=${k}` : '';
    if (host === 'clubbeans.com') url.host = 'www.clubbeans.com';
    const yanit = NextResponse.redirect(url, 302);
    yanit.headers.set('Cache-Control', 'no-store');
    yanit.headers.set('Referrer-Policy', 'no-referrer');
    return yanit;
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
