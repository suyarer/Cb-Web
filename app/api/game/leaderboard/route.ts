import { NextResponse } from 'next/server';
import { trGunu } from '@/lib/game/gun';
import { anonIdOku } from '@/lib/game/oturum';
import { redisAl } from '@/lib/game/redis';

/**
 * Skor tablosu okuma.
 *
 * Sorted-set member'ı anonId'dir (takma ad DEĞİL — bkz. submit route'undaki
 * kimlik modeli). Görüntülenen ad `nick:{anonId}` hash'inden çözülür ve
 * anonId istemciye ASLA sızmaz: sızarsa başkasının kimliğiyle skor yazılabilir.
 *
 * Sınırsız deneme modelinde enflasyon ZADD GT ile engellenir: bir oyuncu ne
 * kadar oynarsa oynasın tabloda tek satırı vardır ve yalnız en iyi skoru durur.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TAVAN = 20;

type Satir = { sira: number; ad: string; skor: number; ben: boolean };

export async function GET() {
  const redis = redisAl();
  if (!redis) {
    return NextResponse.json({ acik: false, bugun: [], tumZamanlar: [] });
  }

  /**
   * "Sen" işareti SUNUCUDAN gelir.
   *
   * Önceki hâli `?ben=<anonId>` query parametresiydi ve HİÇ çalışmazdı: anonId
   * httpOnly çerezde tutuluyor, istemci onu okuyup gönderemiyor. httpOnly'yi
   * gevşetmek ise kimlik modelini çökertirdi (anonId sızarsa başkasının adına
   * skor yazılır). Doğrusu: sunucu çerezi kendi okur, istemci hiç bilmez.
   */
  const benimId = await anonIdOku();

  const gun = trGunu();

  async function tablo(anahtar: string): Promise<Satir[]> {
    const ham = (await redis!.zrange(anahtar, 0, TAVAN - 1, {
      rev: true,
      withScores: true,
    })) as Array<string | number>;
    if (!ham?.length) return [];

    const idler: string[] = [];
    const skorlar: number[] = [];
    for (let i = 0; i < ham.length; i += 2) {
      idler.push(String(ham[i]));
      skorlar.push(Number(ham[i + 1]));
    }
    const adlar = idler.length
      ? await redis!.mget<Array<string | null>>(...idler.map((id) => `nick:${id}`))
      : [];

    return idler.map((id, i) => ({
      sira: i + 1,
      ad: adlar?.[i] ?? 'anonim',
      skor: skorlar[i],
      ben: !!benimId && id === benimId,
    }));
  }

  /**
   * Top-20 dışındaki oyuncunun kendi satırı.
   * Tabloda kendini GÖREMEYEN oyuncu yarışmadan çıkar; sıralaman 3184. bile
   * olsa görünmek "bir sonraki sefere" duygusunu ayakta tutar.
   */
  async function benimSatirim(anahtar: string): Promise<Satir | null> {
    if (!benimId) return null;
    const [rank, skor] = await Promise.all([
      redis!.zrevrank(anahtar, benimId),
      redis!.zscore(anahtar, benimId),
    ]);
    if (rank == null || skor == null) return null;
    if (rank < TAVAN) return null; // zaten tabloda görünüyor
    const ad = await redis!.get<string>(`nick:${benimId}`);
    return { sira: rank + 1, ad: ad ?? 'anonim', skor: Number(skor), ben: true };
  }

  try {
    const [bugun, tumZamanlar, toplam, benBugun, benTum] = await Promise.all([
      tablo(`lb:day:${gun}`),
      tablo('lb:all'),
      redis.zcard('lb:all'),
      benimSatirim(`lb:day:${gun}`),
      benimSatirim('lb:all'),
    ]);
    return NextResponse.json({
      acik: true,
      gun,
      bugun,
      tumZamanlar,
      benBugun,
      benTum,
      toplamOyuncu: typeof toplam === 'number' ? toplam : 0,
    });
  } catch {
    return NextResponse.json({ acik: false, bugun: [], tumZamanlar: [] });
  }
}
