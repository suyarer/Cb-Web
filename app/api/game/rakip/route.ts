import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { trGunu } from '@/lib/game/gun';
import { redisAl, zamanAsimi } from '@/lib/game/redis';

/**
 * Rakip kartı okuma — meydan okuma döngüsünün sunucu ucu.
 *
 * Paylaşılan link `/sosyal-obezite?rakip=<runId>` ile geri döndüğünde oyuncu
 * rakibinin skorunu TAŞIYARAK oynar. Skoru query string'e gömmek daha kolaydı
 * ama uydurulabilirdi: "Ahmet 9999 kurtardı" diye link üretip insanları
 * yıldırmak mümkün olurdu. Bu yüzden rakip verisi daima Redis'ten okunur.
 *
 * anonId, IP, oturum kimliği DÖNMEZ — yalnız kartta zaten görünen alanlar.
 * Kart verisi değişmez → CDN'de 60 sn önbellek (Upstash komut kotası — guvenlik-8).
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Kosu = { takmaAd: string; skor: number; yakalanan: number; kacan: number; gun?: string };

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id') ?? '';
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ bulundu: false });
  }
  const redis = redisAl();
  if (!redis) return NextResponse.json({ bulundu: false });

  try {
    const ham = await zamanAsimi(redis.get<string | Kosu>(`run:${id}`), 2000, null);
    if (!ham) return NextResponse.json({ bulundu: false });
    const k = typeof ham === 'string' ? (JSON.parse(ham) as Kosu) : ham;
    return NextResponse.json(
      {
        bulundu: true,
        ad: k.takmaAd,
        skor: k.skor,
        yakalanan: k.yakalanan,
        toplam: k.yakalanan + k.kacan,
        /**
         * Rakip bugünün akışını mı oynadı? Değilse kıyas birebir değil, söylenir.
         * Gün alanı YOKSA (alan eklenmeden önce yazılmış eski kayıt) `undefined`
         * döner ve arayüz hiçbir şey iddia etmez.
         */
        ayniGun: k.gun ? k.gun === trGunu() : undefined,
      },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
    );
  } catch (err) {
    Sentry.captureException(err, { tags: { alan: 'oyun', rota: 'rakip' } });
    return NextResponse.json({ bulundu: false });
  }
}
