import { del, list } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

// Haftalık cron: abone yedeklerinin SÜRE TEMİZLİĞİ.
// Bülten 2026-11-17'de kapandı (hukuk T1 KARAR-205); yeni yedek ALINMAZ.
// Gizlilik metni "yedekler en geç 6 ay içinde silinir" der (KARAR-6): haftalık koşuda
// 173 günden eski yedekler silinir → hiçbir yedek 180 günü aşmaz.

const SAKLAMA_GUN = 173;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ ok: false, error: 'CRON_SECRET tanımlı değil.' }, { status: 500 });
  }
  if (authHeader !== expected) {
    return NextResponse.json({ ok: false, error: 'Yetkisiz.' }, { status: 401 });
  }

  const sinir = Date.now() - SAKLAMA_GUN * 24 * 60 * 60 * 1000;
  let incelenen = 0;
  const silinecek: string[] = [];
  try {
    let cursor: string | undefined;
    do {
      const sayfa = await list({ prefix: 'subscribers/', cursor, limit: 1000 });
      for (const b of sayfa.blobs) {
        incelenen++;
        if (new Date(b.uploadedAt).getTime() < sinir) silinecek.push(b.url);
      }
      cursor = sayfa.hasMore ? sayfa.cursor : undefined;
    } while (cursor);

    if (silinecek.length > 0) await del(silinecek);
    return NextResponse.json({ ok: true, incelenen, silinen: silinecek.length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown';
    return NextResponse.json({ ok: false, error: `Yedek temizliği başarısız: ${msg}` }, { status: 500 });
  }
}
