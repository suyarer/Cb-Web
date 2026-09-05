import * as Sentry from '@sentry/nextjs';
import { Ratelimit } from '@upstash/ratelimit';
import { NextResponse } from 'next/server';
import { trGunu } from '@/lib/game/gun';
import { anonIdOku, istemciIp } from '@/lib/game/oturum';
import { oyunKapaliMi, redisAl, zamanAsimi } from '@/lib/game/redis';

/**
 * Skor tablosu okuma.
 *
 * Sorted-set member'ı anonId'dir (takma ad DEĞİL — bkz. submit route'undaki
 * kimlik modeli). Görüntülenen ad `nick:{anonId}` hash'inden çözülür ve
 * anonId istemciye ASLA sızmaz: sızarsa başkasının kimliğiyle skor yazılabilir.
 *
 * Sınırsız deneme modelinde enflasyon ZADD GT ile engellenir: bir oyuncu ne
 * kadar oynarsa oynasın tabloda tek satırı vardır ve yalnız en iyi skoru durur.
 *
 * MALİYET (denetim guvenlik-8 / performans-6): istek başına 9-10 komut, önbellek ve
 * hız sınırı yoktu. Top-20 artık 10 sn modül-önbelleğinde (lambda örneği başına),
 * "sen" satırı çerez varsa taze; istek 2 pipeline'a indirildi; 120/dk/IP sınırı.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TAVAN = 20;
const ONBELLEK_MS = 10_000;

type Satir = { sira: number; ad: string; skor: number; ben: boolean };
type Tablo = { gun: string; bugun: Array<{ id: string; skor: number; ad: string }>; tum: Array<{ id: string; skor: number; ad: string }>; toplam: number };

let onbellek: { zaman: number; tablo: Tablo } | null = null;
let limiter: Ratelimit | null | undefined;

const KAPALI = { acik: false, bugun: [], tumZamanlar: [] };

async function tabloOku(): Promise<Tablo | null> {
  const redis = redisAl();
  if (!redis) return null;
  const simdi = Date.now();
  if (onbellek && simdi - onbellek.zaman < ONBELLEK_MS) return onbellek.tablo;

  const gun = trGunu();
  const p1 = redis.pipeline();
  p1.zrange(`lb:day:${gun}`, 0, TAVAN - 1, { rev: true, withScores: true });
  p1.zrange('lb:all', 0, TAVAN - 1, { rev: true, withScores: true });
  p1.zcard('lb:all');
  const [bugunHam, tumHam, toplam] = (await zamanAsimi(p1.exec(), 2500, null)) ?? [];
  if (!bugunHam || !tumHam) return null;

  const coz = (ham: unknown): Array<{ id: string; skor: number }> => {
    const dizi = ham as Array<string | number>;
    const out: Array<{ id: string; skor: number }> = [];
    for (let i = 0; i + 1 < dizi.length; i += 2) out.push({ id: String(dizi[i]), skor: Number(dizi[i + 1]) });
    return out;
  };
  const bugun = coz(bugunHam);
  const tum = coz(tumHam);
  const idler = [...new Set([...bugun, ...tum].map((s) => s.id))];
  const adlar = idler.length
    ? (await zamanAsimi(redis.mget<Array<string | null>>(...idler.map((id) => `nick:${id}`)), 2500, null)) ?? []
    : [];
  const adHaritasi = new Map(idler.map((id, i) => [id, adlar[i] ?? 'anonim']));
  const tablo: Tablo = {
    gun,
    bugun: bugun.map((s) => ({ ...s, ad: adHaritasi.get(s.id) ?? 'anonim' })),
    tum: tum.map((s) => ({ ...s, ad: adHaritasi.get(s.id) ?? 'anonim' })),
    toplam: typeof toplam === 'number' ? toplam : 0,
  };
  onbellek = { zaman: simdi, tablo };
  return tablo;
}

/** Top-20 dışındaki oyuncunun kendi satırı — tabloda kendini göremeyen yarışmadan çıkar. */
async function benimSatirim(anahtar: string, benimId: string, ad: string | null): Promise<Satir | null> {
  const redis = redisAl();
  if (!redis) return null;
  const p = redis.pipeline();
  p.zrevrank(anahtar, benimId);
  p.zscore(anahtar, benimId);
  const [rank, skor] = (await zamanAsimi(p.exec(), 1500, null)) ?? [null, null];
  if (rank == null || skor == null) return null;
  if (Number(rank) < TAVAN) return null; // zaten tabloda görünüyor
  return { sira: Number(rank) + 1, ad: ad ?? 'anonim', skor: Number(skor), ben: true };
}

export async function GET(req: Request) {
  const redis = redisAl();
  if (!redis || (await oyunKapaliMi(redis))) return NextResponse.json(KAPALI);

  const ip = istemciIp(req);
  limiter ??= new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(120, '1 m'), prefix: 'rl:game:lb', timeout: 1000 });
  const { success } = await limiter.limit(ip ?? 'ipsiz');
  if (!success) return NextResponse.json({ ...KAPALI, hata: 'yogunluk' }, { status: 429 });

  try {
    // "Sen" işareti SUNUCUDAN gelir: anonId httpOnly çerezde, istemci onu bilmez.
    const benimId = await anonIdOku();
    const tablo = await tabloOku();
    if (!tablo) return NextResponse.json(KAPALI);

    const satirla = (liste: Tablo['bugun']): Satir[] =>
      liste.map((s, i) => ({ sira: i + 1, ad: s.ad, skor: s.skor, ben: !!benimId && s.id === benimId }));

    let benBugun: Satir | null = null;
    let benTum: Satir | null = null;
    if (benimId) {
      const benimAd = (await zamanAsimi(redis.get<string>(`nick:${benimId}`), 1000, null)) ?? null;
      [benBugun, benTum] = await Promise.all([
        benimSatirim(`lb:day:${tablo.gun}`, benimId, benimAd),
        benimSatirim('lb:all', benimId, benimAd),
      ]);
    }

    return NextResponse.json(
      {
        acik: true,
        gun: tablo.gun,
        bugun: satirla(tablo.bugun),
        tumZamanlar: satirla(tablo.tum),
        benBugun,
        benTum,
        toplamOyuncu: tablo.toplam,
      },
      { headers: { 'Cache-Control': 'private, no-store' } }
    );
  } catch (err) {
    Sentry.captureException(err, { tags: { alan: 'oyun', rota: 'leaderboard' } });
    return NextResponse.json(KAPALI);
  }
}
