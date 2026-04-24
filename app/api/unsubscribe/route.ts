import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';
import { verifyUnsubscribeToken } from '@/lib/unsubscribeToken';

const redis = Redis.fromEnv();

const SUBSCRIBERS_SET = 'subscribers';
const SUBSCRIBER_META = (email: string) => `subscriber:${email}`;

// RFC 8058: One-Click Unsubscribe (GET redirect + POST silent)
// GET → landing page'e yönlendir
// POST → direkt kaldır (mail client otomatik gönderir)

async function unsubscribe(email: string): Promise<{ removed: boolean; count: number }> {
  const removed = await redis.srem(SUBSCRIBERS_SET, email);
  // Metadata silmeyiz — audit trail (KVKK ihlali değil çünkü kullanıcı kendisi istedi)
  // Ama flag koyarız
  if (removed === 1) {
    await redis.hset(SUBSCRIBER_META(email), {
      unsubscribed_ts: Date.now(),
    });
  }
  const count = await redis.scard(SUBSCRIBERS_SET);
  return { removed: removed === 1, count };
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.redirect(new URL('/unsubscribed?status=invalid', req.url));
  }

  const email = verifyUnsubscribeToken(token);
  if (!email) {
    return NextResponse.redirect(new URL('/unsubscribed?status=invalid', req.url));
  }

  try {
    const { removed } = await unsubscribe(email);
    const status = removed ? 'ok' : 'not-found';
    return NextResponse.redirect(new URL(`/unsubscribed?status=${status}`, req.url));
  } catch {
    return NextResponse.redirect(new URL('/unsubscribed?status=error', req.url));
  }
}

// POST — Gmail/Outlook List-Unsubscribe-Post=One-Click için
export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json({ ok: false, error: 'token eksik' }, { status: 400 });
  }

  const email = verifyUnsubscribeToken(token);
  if (!email) {
    return NextResponse.json({ ok: false, error: 'geçersiz token' }, { status: 400 });
  }

  try {
    const { removed } = await unsubscribe(email);
    return NextResponse.json({ ok: true, removed });
  } catch {
    return NextResponse.json({ ok: false, error: 'sunucu hatası' }, { status: 500 });
  }
}
