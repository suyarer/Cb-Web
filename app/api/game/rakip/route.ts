import { NextResponse } from 'next/server';
import { trGunu } from '@/lib/game/gun';
import { redisAl } from '@/lib/game/redis';

/**
 * Rakip kartı okuma — meydan okuma döngüsünün sunucu ucu.
 *
 * Paylaşılan link `/sosyal-obezite?rakip=<runId>` ile geri döndüğünde oyuncu
 * rakibinin skorunu TAŞIYARAK oynar. Skoru query string'e gömmek daha kolaydı
 * ama uydurulabilirdi: "Ahmet 9999 kurtardı" diye link üretip insanları
 * yıldırmak mümkün olurdu. Bu yüzden rakip verisi daima Redis'ten okunur.
 *
 * anonId, IP, oturum kimliği DÖNMEZ — yalnız kartta zaten görünen alanlar.
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
    const ham = await redis.get<string | Kosu>(`run:${id}`);
    if (!ham) return NextResponse.json({ bulundu: false });
    const k = typeof ham === 'string' ? (JSON.parse(ham) as Kosu) : ham;
    return NextResponse.json({
      bulundu: true,
      ad: k.takmaAd,
      skor: k.skor,
      yakalanan: k.yakalanan,
      toplam: k.yakalanan + k.kacan,
      /**
       * Rakip bugünün akışını mı oynadı? Değilse kıyas birebir değil, söylenir.
       * Gün alanı YOKSA (alan eklenmeden önce yazılmış eski kayıt) `undefined`
       * döner ve arayüz hiçbir şey iddia etmez — "başka gün" demek yanlış
       * olurdu, bilmiyoruz.
       */
      ayniGun: k.gun ? k.gun === trGunu() : undefined,
    });
  } catch {
    return NextResponse.json({ bulundu: false });
  }
}
