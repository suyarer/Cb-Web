/**
 * POST /api/sayac — site mağaza düğmesi + reklam inişi sayacı (KİŞİSEL VERİSİZ).
 *
 * Gövde: {tur: 'inis'|'tik', kod, platform: 'ios'|'android'|'yok', kaynak} → Supabase `site_magaza_say` (anon RPC) → 204.
 * - KVKK: tabloya yalnız günlük toplam sayı yazılır. IP yalnız hız sınırı anahtarıdır (Upstash kayan pencere, saklanmaz) —
 *   abonelik rotasıyla aynı desen; gizlilik sayfası §5 Upstash "rate limit".
 * - Önizleme / dal dağıtımı üretim sayacına YAZMAZ (plan hasımı H5): `VERCEL==='1' && VERCEL_ENV!=='production'` → 204.
 * - Hız sınırı aşımı ve sayım hatası ziyaretçiye yansımaz (204); RPC hatası Sentry `api.sayac` (gövde/IP eklenmez).
 * - Kill-switch DB'de: `REVOKE EXECUTE ON FUNCTION public.site_magaza_say(text,text,text,text) FROM anon`.
 *
 * @governing_law clubbeans-privacy-v1 · CB2026 meta-magaza-tiklama-sayaci-2026-10-19
 */
import * as Sentry from '@sentry/nextjs';
import { createClient } from '@supabase/supabase-js';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const Govde = z.object({
  tur: z.enum(['inis', 'tik']),
  kod: z.string().regex(/^[a-z0-9_-]{1,40}$/),
  platform: z.enum(['ios', 'android', 'yok']),
  kaynak: z.string().regex(/^[a-z0-9_-]{1,30}$/),
});

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase =
  SUPABASE_URL && SUPABASE_ANON
    ? createClient(SUPABASE_URL, SUPABASE_ANON, { auth: { persistSession: false, autoRefreshToken: false } })
    : null;

function hizSiniriKur(): Ratelimit | null {
  try {
    return new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(60, '10 m'), prefix: 'sayac' });
  } catch {
    return null; // Upstash env yoksa (yerel) sınır yok — DB tavanı (satır başı 20.000/gün) yine sınırlar
  }
}
const hizSiniri = hizSiniriKur();

function istemciIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

const bos = () => new NextResponse(null, { status: 204 });

export async function POST(req: NextRequest) {
  if (process.env.VERCEL === '1' && process.env.VERCEL_ENV !== 'production') return bos();

  let ham: unknown;
  try {
    ham = JSON.parse(await req.text());
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const g = Govde.safeParse(ham);
  if (!g.success) return NextResponse.json({ ok: false }, { status: 400 });

  if (hizSiniri) {
    try {
      const { success } = await hizSiniri.limit(istemciIp(req));
      if (!success) return bos();
    } catch {
      // Upstash erişilemezse açık geçiş — sayım sürer, DB tavanı sınırlar
    }
  }
  if (!supabase) return bos();

  const { error } = await supabase.rpc('site_magaza_say', {
    p_tur: g.data.tur,
    p_kod: g.data.kod,
    p_platform: g.data.platform,
    p_kaynak: g.data.kaynak,
  });
  if (error) {
    Sentry.captureException(new Error(`site_magaza_say: ${error.code ?? '-'} ${error.message}`), {
      tags: { yer: 'api.sayac' },
    });
  }
  return bos();
}
