import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Storage keys
const SUBSCRIBERS_SET = 'subscribers';
const SUBSCRIBER_META = (email: string) => `subscriber:${email}`;

// Env: KV_REST_API_URL, KV_REST_API_TOKEN (Vercel Upstash auto-populated)
const redis = Redis.fromEnv();

// Rate limit: IP başına 10 dakikada 5 istek
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '10 m'),
  analytics: false,
  prefix: 'cb:subscribe:rl',
});

const subscribeSchema = z.object({
  email: z.string().email().max(254),
  source: z.string().max(32).optional(),
  // Honeypot — bot doldurursa 200 döneriz ama kaydetmeyiz
  website: z.string().max(0).optional(),
});

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  const real = req.headers.get('x-real-ip');
  if (real) return real;
  return 'unknown';
}

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limit
    const ip = getClientIp(req);
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { ok: false, error: 'Çok sık deniyorsun, biraz sonra tekrar dene.' },
        { status: 429 }
      );
    }

    // 2. Origin check (basit CSRF koruması)
    const origin = req.headers.get('origin');
    const host = req.headers.get('host');
    const allowedOrigins = [
      'https://clubbeans.com',
      'https://www.clubbeans.com',
      `https://${host}`,
      'http://localhost:3000',
    ];
    if (origin && !allowedOrigins.includes(origin)) {
      return NextResponse.json({ ok: false, error: 'Geçersiz istek.' }, { status: 403 });
    }

    // 3. Body + schema
    const body = await req.json().catch(() => ({}));
    const parsed = subscribeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: 'Geçersiz e-posta.' }, { status: 400 });
    }

    // 4. Honeypot: field dolu → bot, sessizce OK döndür
    if (parsed.data.website && parsed.data.website.length > 0) {
      return NextResponse.json({ ok: true, position: 0 });
    }

    const email = parsed.data.email.trim().toLowerCase();
    const source = parsed.data.source || 'unknown';

    // 5. Redis: set'e ekle + metadata yaz
    const added = await redis.sadd(SUBSCRIBERS_SET, email);
    if (added === 1) {
      // Yeni abone — metadata kaydet
      await redis.hset(SUBSCRIBER_META(email), {
        source,
        ip: ip.slice(0, 16), // privacy: IP'yi kısalt (sadece abuse için)
        ts: Date.now(),
      });
    }

    const position = await redis.scard(SUBSCRIBERS_SET);

    return NextResponse.json({
      ok: true,
      position,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[subscribe] error:', err);
    }
    return NextResponse.json(
      { ok: false, error: 'Bir şey ters gitti. Tekrar dener misin?' },
      { status: 500 }
    );
  }
}
