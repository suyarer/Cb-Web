import { Redis } from '@upstash/redis';
import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

// Haftalık cron: Redis'teki abone listesini Vercel Blob'a JSON snapshot olarak yaz.
// Vercel Cron sadece /api/cron/* rotalarını CRON_SECRET header ile çağırır.

const redis = Redis.fromEnv();

export async function GET(req: NextRequest) {
  // Sadece Vercel Cron veya yetkili çağrı
  const authHeader = req.headers.get('authorization');
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (!process.env.CRON_SECRET) {
    return NextResponse.json(
      { ok: false, error: 'CRON_SECRET tanımlı değil.' },
      { status: 500 }
    );
  }
  if (authHeader !== expected) {
    return NextResponse.json({ ok: false, error: 'Yetkisiz.' }, { status: 401 });
  }

  try {
    const emails = (await redis.smembers('subscribers')) as string[];

    // Her abone için metadata topla (pipeline — tek roundtrip)
    const pipeline = redis.pipeline();
    emails.forEach((email) => pipeline.hgetall(`subscriber:${email}`));
    const metadata = (await pipeline.exec()) as Array<Record<string, string | number>>;

    const snapshot = {
      generatedAt: new Date().toISOString(),
      count: emails.length,
      subscribers: emails.map((email, i) => ({
        email,
        ...(metadata[i] || {}),
      })),
    };

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `subscribers/backup-${timestamp}.json`;

    const blob = await put(filename, JSON.stringify(snapshot, null, 2), {
      access: 'public', // Public = URL ile erişilebilir (dump için OK; PII olduğu için private da olabilir)
      contentType: 'application/json',
      addRandomSuffix: false,
    });

    return NextResponse.json({
      ok: true,
      count: emails.length,
      url: blob.url,
      filename,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown';
    return NextResponse.json(
      { ok: false, error: `Backup başarısız: ${msg}` },
      { status: 500 }
    );
  }
}
