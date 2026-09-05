import { Ratelimit } from '@upstash/ratelimit';
import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { HILE_REDDI } from '@/content/sosyal-obezite-feed';
import { aklaYatkin, sunucuSkoru, type TurOzeti } from '@/lib/game/engine';
import { trGunu } from '@/lib/game/gun';
import { takmaAdGecerli } from '@/lib/game/nickname';
import { anonIdOku, istemciIp, originGecerli } from '@/lib/game/oturum';
import { redisAl } from '@/lib/game/redis';

/**
 * SOSYAL OBEZİTE — skor gönderimi.
 *
 * Sunucu istemcinin skoruna ASLA güvenmez: kendi hesabını yapar ve onu yazar.
 *
 * KİMLİK MODELİ (spec §5.3 — ilk yazımda ihlal edilmişti):
 *   sorted-set member = anonId (çerezden). Takma ad member DEĞİL.
 *   Ad sahipliği: SETNX nickowner:{iskelet} → anonId. Başkasının adını alamazsın.
 *   Görüntülenen ad: nick:{anonId} hash'inde.
 * Aksi halde `takmaAd:'Ayşe'` yazan herkes Ayşe'nin skorunu ezebiliyordu ve
 * ZADD GT tek yönlü olduğu için ad kalıcı olarak işgal ediliyordu.
 */

let limiter: Ratelimit | null | undefined;
function limiterAl(): Ratelimit | null {
  if (limiter !== undefined) return limiter;
  const redis = redisAl();
  limiter = redis
    ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(40, '1 m'), prefix: 'rl:game:submit' })
    : null;
  return limiter;
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const Govde = z.object({
  sessionId: z.string().uuid(),
  // nickname.ts tavanı 20; Zod'u aynı değere hizala (24 iken sessiz uyuşmazlıktı)
  takmaAd: z.string().min(1).max(20),
  skor: z.number().int().min(0).max(100_000),
  ozet: z.object({
    kart: z.number().int().min(0).max(100_000),
    yakalanan: z.number().int().min(0).max(64),
    kacan: z.number().int().min(0).max(64),
    yanlisDokunma: z.number().int().min(0).max(10_000),
    sureMs: z.number().int().min(0).max(600_000),
  }),
  olaylar: z.array(z.enum(['yakala', 'kacir'])).max(64),
  toplamSaniye: z.number().int().min(0).max(86_400).optional(),
});

/** Oturum şekli — cast yerine parse. `baslangic` yoksa NaN karşılaştırması
 *  duvar-saati kapısını SESSİZCE geçiriyordu. */
const Oturum = z
  .object({ baslangic: z.number().int().positive() })
  .passthrough();

export async function POST(req: Request) {
  // 1) Köken — cookie tabanlı kimlikten ÖNCE (CSRF yazma vektörü)
  if (!originGecerli(req)) {
    return NextResponse.json({ hata: 'kaynak-reddedildi' }, { status: 403 });
  }

  // 2) Hız sınırı. IP yoksa daha sıkı ayrı kova — tek "bilinmiyor" kovası
  //    tüm trafiği aynı limite sıkıştırıyordu.
  const ip = istemciIp(req);
  const rl = limiterAl();
  if (rl) {
    const anahtar = ip ?? 'ipsiz';
    const { success, reset } = await rl.limit(anahtar);
    if (!success) {
      // NÖTR metin: CGNAT arkasındaki dürüst oyuncuya "hileci" demek marka riski.
      // HILE_REDDI yalnız 422 (akla-yatkınlık) yolunda kullanılır.
      return NextResponse.json(
        { hata: 'yogunluk', mesaj: 'Şu an yoğunluk var, birazdan tekrar dene.' },
        { status: 429, headers: { 'Retry-After': String(Math.max(1, Math.ceil((reset - Date.now()) / 1000))) } }
      );
    }
  }

  const ayristirma = Govde.safeParse(await req.json().catch(() => null));
  if (!ayristirma.success) {
    return NextResponse.json({ hata: 'gecersiz-govde' }, { status: 400 });
  }
  const { sessionId, takmaAd, skor, ozet, olaylar, toplamSaniye } = ayristirma.data;

  const ad = takmaAdGecerli(takmaAd);
  if (!ad.gecerli) {
    return NextResponse.json({ hata: 'takma-ad', mesaj: ad.mesaj }, { status: 422 });
  }

  const anonId = await anonIdOku();
  if (!anonId) {
    return NextResponse.json(
      { hata: 'kimlik-yok', mesaj: 'Turu yeniden başlat.' },
      { status: 401 }
    );
  }

  const redis = redisAl();
  if (!redis) {
    return NextResponse.json(
      { hata: 'tablo-kapali', mesaj: 'Skor tablosu şu an kapalı. Oyun oynanmaya devam eder.' },
      { status: 503 }
    );
  }

  // 3) Tek kullanımlık oturum — GETDEL atomik, paralel iki submit yarışını çözer
  const oturumHam = await redis.getdel<string | Record<string, unknown>>(`sess:${sessionId}`);
  if (!oturumHam) {
    return NextResponse.json(
      { hata: 'oturum-bitti', mesaj: 'Tur kaydı için süre doldu. Bir tur daha oyna.' },
      { status: 409 }
    );
  }
  const oturumParse = Oturum.safeParse(
    typeof oturumHam === 'string' ? JSON.parse(oturumHam) : oturumHam
  );
  if (!oturumParse.success) {
    return NextResponse.json({ hata: 'oturum-bozuk' }, { status: 422 });
  }
  const oturum = oturumParse.data;

  // Duvar saati: 60 sn'lik tur 45 sn'den kısa sürede gelemez
  const gecen = Date.now() - oturum.baslangic;
  if (!Number.isFinite(gecen) || gecen < 45_000) {
    return NextResponse.json(
      { hata: 'akla-yatmadi', sebep: 'duvar-saati', mesaj: HILE_REDDI },
      { status: 422 }
    );
  }

  const dogrulama = aklaYatkin(ozet as TurOzeti, skor, olaylar);
  if (!dogrulama.gecerli) {
    return NextResponse.json(
      { hata: 'akla-yatmadi', sebep: dogrulama.sebep, mesaj: HILE_REDDI },
      { status: 422 }
    );
  }

  const nihaiSkor = sunucuSkoru(ozet as TurOzeti, olaylar);
  const runId = randomUUID();
  // Gün kovası TUR BAŞLANGICINDAN — gece yarısını turun içinde geçen oyuncunun
  // skoru başladığı güne yazılır (spec §5.4)
  const gun = trGunu(new Date(oturum.baslangic));

  try {
    // 4) Ad sahipliği: iskelet üzerinden rezervasyon. Anahtar DAİMA iskelet;
    //    "Ayşe"/"ayşe"/"AYŞE" aynı iskelete iner, tabloda tek satır olur.
    const sahip = await redis.set(`nickowner:${ad.iskelet}`, anonId, { nx: true });
    if (sahip === null) {
      const mevcutSahip = await redis.get<string>(`nickowner:${ad.iskelet}`);
      if (mevcutSahip !== anonId) {
        return NextResponse.json(
          { hata: 'ad-alinmis', mesaj: 'Bu takma ad başkasına ait. Başka bir şey dene.' },
          { status: 409 }
        );
      }
    }

    // 5) Yazma — tek pipeline. Önce 5 ayrı await vardı: biri düşerse oturum
    //    tüketilmiş ama skor yazılmamış oluyordu, retry 409 "zaten kaydedildi"
    //    yalanı dönüyordu ve dürüst skor sessizce kayboluyordu.
    const p = redis.pipeline();
    p.set(
      `run:${runId}`,
      JSON.stringify({
        takmaAd: ad.temiz, skor: nihaiSkor,
        yakalanan: ozet.yakalanan, kacan: ozet.kacan, kart: ozet.kart,
        toplamSaniye: toplamSaniye ?? Math.round(ozet.sureMs / 1000),
        // Turun OYNANDIĞI gün. Seed günlük olduğu için şart: dünkü bir kartın
        // linkiyle gelen oyuncu BUGÜNÜN akışını oynar, yani "aynı turu oynadık"
        // vaadi tutmaz. Gün yazılmadan bu farkı arayüzde söylemek imkânsızdı.
        gun,
        tarih: Date.now(),
      }),
      // TTL: OG kartı viral kuyrukta 2 hafta sonra da açılır ama TTL'siz bırakmak
      // bot pompalamasında sınırsız Redis büyümesi demek. 180 gün ikisini dengeler.
      { ex: 60 * 60 * 24 * 180 }
    );
    p.set(`nick:${anonId}`, ad.temiz);
    p.zadd('lb:all', { gt: true }, { score: nihaiSkor, member: anonId });
    p.zadd(`lb:day:${gun}`, { gt: true }, { score: nihaiSkor, member: anonId });
    p.expire(`lb:day:${gun}`, 172_800);
    await p.exec();

    const [sira, toplam] = await Promise.all([
      redis.zcount('lb:all', nihaiSkor + 1, '+inf'),
      redis.zcard('lb:all'),
    ]);

    return NextResponse.json({
      runId,
      skor: nihaiSkor,
      sira: (typeof sira === 'number' ? sira : 0) + 1,
      toplamOyuncu: typeof toplam === 'number' ? toplam : 0,
      takmaAd: ad.temiz,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error('[oyun] submit yazma hatası:', err);
    // Oturum tüketildi ama yazma düştü — 409 "zaten kaydedildi" DEMİYORUZ,
    // çünkü kaydedilmedi. Dürüst oyuncu doğru teşhis görmeli.
    return NextResponse.json(
      { hata: 'kayit-tamamlanamadi', mesaj: 'Kayıt tamamlanamadı. Bir tur daha oyna.' },
      { status: 500 }
    );
  }
}
