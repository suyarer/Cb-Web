import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import disposableDomains from 'disposable-email-domains';
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

// Disposable email domain set — O(1) lookup
const disposableSet = new Set<string>(disposableDomains as string[]);

const subscribeSchema = z.object({
  email: z.string().email().max(254),
  source: z.string().max(32).optional(),
  // KVKK açık rıza — form checkbox ile true olmalı
  consent: z.literal(true),
  // UTM kampanya takibi
  utm: z
    .object({
      source: z.string().max(64).optional(),
      medium: z.string().max(64).optional(),
      campaign: z.string().max(64).optional(),
    })
    .optional(),
  // Honeypot — bot doldurursa reddet
  website: z.string().max(0).optional(),
  // Cloudflare Turnstile token (user-action gerektirdiği için şimdilik opsiyonel)
  turnstileToken: z.string().max(2048).optional(),
});

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  const real = req.headers.get('x-real-ip');
  if (real) return real;
  return 'unknown';
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Turnstile kurulu değilse pas geç (dev/preview için)
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
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
      const first = parsed.error.issues[0];
      // KVKK consent hatasını ayırt et — kullanıcıya net mesaj
      if (first?.path?.[0] === 'consent') {
        return NextResponse.json(
          { ok: false, error: 'E-posta izni kutusunu işaretlemen gerek.' },
          { status: 400 }
        );
      }
      return NextResponse.json({ ok: false, error: 'Geçersiz e-posta.' }, { status: 400 });
    }

    // 4. Honeypot: field dolu → bot, sessizce OK döndür (bot bir şey anlamasın)
    if (parsed.data.website && parsed.data.website.length > 0) {
      return NextResponse.json({ ok: true, position: 0 });
    }

    // 5. Turnstile doğrulama (token varsa)
    if (parsed.data.turnstileToken) {
      const valid = await verifyTurnstile(parsed.data.turnstileToken, ip);
      if (!valid) {
        return NextResponse.json(
          { ok: false, error: 'Bot olmadığını doğrulayamadık, sayfayı yenile.' },
          { status: 403 }
        );
      }
    }

    const email = parsed.data.email.trim().toLowerCase();
    const source = parsed.data.source || 'unknown';

    // 6. Disposable email filter (mailinator, tempmail, vs.)
    const domain = email.split('@')[1];
    if (disposableSet.has(domain)) {
      return NextResponse.json(
        { ok: false, error: 'Geçici e-posta adresleri kabul edilmiyor.' },
        { status: 400 }
      );
    }

    // 7. Redis: set'e ekle + metadata yaz
    const added = await redis.sadd(SUBSCRIBERS_SET, email);
    if (added === 1) {
      // Yeni abone — metadata kaydet
      const metadata: Record<string, string | number> = {
        source,
        ip: ip.slice(0, 16), // privacy: IP'yi kısalt (sadece abuse için)
        ts: Date.now(),
        consent_ts: Date.now(), // KVKK açık rıza zamanı
      };
      if (parsed.data.utm?.source) metadata.utm_source = parsed.data.utm.source;
      if (parsed.data.utm?.medium) metadata.utm_medium = parsed.data.utm.medium;
      if (parsed.data.utm?.campaign) metadata.utm_campaign = parsed.data.utm.campaign;
      await redis.hset(SUBSCRIBER_META(email), metadata);
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
