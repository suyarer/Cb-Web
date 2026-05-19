/**
 * GET /api/subscriber-count
 *
 * Public endpoint — toplam abone sayısı.
 * Sosyal kanıt + FOMO mechanic için landing'de kullanılır.
 *
 * Privacy: hiçbir kullanıcı verisi dönmez, sadece sayım.
 * Rate limit: yok — public read, 60s edge cache.
 *
 * @governing_law clubbeans-privacy-v1
 */

import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const revalidate = 60; // Edge cache 60sn

const SUBSCRIBERS_SET = 'subscribers';

export async function GET() {
  try {
    const redis = Redis.fromEnv();
    const count = await redis.scard(SUBSCRIBERS_SET);
    return NextResponse.json(
      { count: typeof count === 'number' ? count : 0 },
      {
        headers: {
          // Browser cache 30s, CDN cache 60s, stale-while-revalidate 5dk
          'Cache-Control': 'public, max-age=30, s-maxage=60, stale-while-revalidate=300',
          // CORS: clubbeans.com → www.clubbeans.com cross-origin
          'Access-Control-Allow-Origin': 'https://clubbeans.com',
        },
      }
    );
  } catch {
    return NextResponse.json({ count: 0 }, { status: 200 });
  }
}
