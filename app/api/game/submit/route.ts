import * as Sentry from '@sentry/nextjs';
import { Ratelimit } from '@upstash/ratelimit';
import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { HILE_REDDI } from '@/content/sosyal-obezite-feed';
import { aklaYatkin, sunucuSkoru, type TurOzeti } from '@/lib/game/engine';
import { trGunu } from '@/lib/game/gun';
import { iskelet, takmaAdGecerli } from '@/lib/game/nickname';
import { anonIdOku, istemciIp, originGecerli } from '@/lib/game/oturum';
import { oyunKapaliMi, redisAl, zamanAsimi } from '@/lib/game/redis';

/**
 * SOSYAL OBEZİTE — skor gönderimi.
 *
 * Sunucu istemcinin skoruna ASLA güvenmez: kendi hesabını yapar ve onu yazar.
 *
 * KİMLİK MODELİ (spec §5.3):
 *   sorted-set member = anonId (imzalı çerezden). Takma ad member DEĞİL.
 *   Ad sahipliği: SETNX nickowner:{iskelet} → anonId. Başkasının adını alamazsın.
 *   Görüntülenen ad: nick:{anonId} hash'inde.
 *
 * SIRA (denetim 2026-09-05, bilinen #5 CONFIRMED): ad rezervasyonu GETDEL'den ÖNCE.
 * Önce oturum tüketilip sonra 409 'ad-alinmis' dönünce dürüst oyuncunun turu çöpe
 * gidiyordu; artık ad çakışırsa oturum yaşar, oyuncu başka ad dener.
 *
 * TTL'ler (guvenlik-1/-2, dogruluk-5): nick:/nickowner: 180 gün (run: ile hizalı, her
 * submit'te yenilenir); ad değişince eski iskelet yalnız sahibi bensem serbest bırakılır
 * (Lua, atomik); günde 3 ad değişimi; lb:all en fazla 5000 üye.
 */

let limiter: Ratelimit | null | undefined;
let ipsizLimiter: Ratelimit | null | undefined;
function limiterAl(ipli: boolean): Ratelimit | null {
  const redis = redisAl();
  if (!redis) return null;
  if (ipli) {
    limiter ??= new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(40, '1 m'), prefix: 'rl:game:submit', timeout: 1000 });
    return limiter;
  }
  ipsizLimiter ??= new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(8, '1 m'), prefix: 'rl:game:submit:ipsiz', timeout: 1000 });
  return ipsizLimiter;
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const AD_TTL = 60 * 60 * 24 * 180;
const RUN_TTL = 60 * 60 * 24 * 180;
const TABLO_TAVANI = 5000;
const GUNLUK_AD_DEGISIMI = 3;

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

/** Yalnız değeri anonId ise siler — başkasının rezervasyonuna dokunmaz. */
const ESKI_ADI_SERBEST_BIRAK = "if redis.call('GET', KEYS[1]) == ARGV[1] then return redis.call('DEL', KEYS[1]) end return 0";

function reddedildi(sebep: string, ekstra?: Record<string, string | number>) {
  Sentry.captureMessage('oyun.skor_reddedildi', { level: 'info', tags: { alan: 'oyun', rota: 'submit', sebep }, extra: ekstra });
}

export async function POST(req: Request) {
  // 1) Köken — cookie tabanlı kimlikten ÖNCE (CSRF yazma vektörü)
  if (!originGecerli(req)) {
    return NextResponse.json({ hata: 'kaynak-reddedildi' }, { status: 403 });
  }

  // 2) Hız sınırı. IP yoksa daha sıkı ayrı kova.
  const ip = istemciIp(req);
  const rl = limiterAl(ip !== null);
  if (rl) {
    const { success, reset } = await rl.limit(ip ?? 'ipsiz');
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
  if (!redis || (await oyunKapaliMi(redis))) {
    return NextResponse.json(
      { hata: 'tablo-kapali', mesaj: 'Skor tablosu şu an kapalı. Oyun oynanmaya devam eder.' },
      { status: 503 }
    );
  }

  try {
    // 3) Ön okuma — TEK gidiş-dönüş: engel, ad rezervasyonu (NX), mevcut sahip, mevcut ad, en iyi skor
    const onOkuma = redis.pipeline();
    onOkuma.sismember('oyun:engelli', anonId);
    onOkuma.set(`nickowner:${ad.iskelet}`, anonId, { nx: true, ex: AD_TTL });
    onOkuma.get<string>(`nickowner:${ad.iskelet}`);
    onOkuma.get<string>(`nick:${anonId}`);
    onOkuma.zscore('lb:all', anonId);
    const [engelli, , sahip, eskiAd, eskiSkor] = (await onOkuma.exec()) as [
      number, unknown, string | null, string | null, number | null,
    ];

    if (engelli === 1) {
      reddedildi('engelli');
      return NextResponse.json({ hata: 'engelli', mesaj: 'Bu kimlikten skor kabul edilmiyor.' }, { status: 403 });
    }
    if (sahip && sahip !== anonId) {
      // Oturum TÜKETİLMEDİ — oyuncu başka bir ad deneyebilir.
      reddedildi('ad-alinmis');
      return NextResponse.json(
        {
          hata: 'ad-alinmis',
          mesaj: 'Bu takma ad başkasına ait. Başka bir şey dene. (Sen aldıysan: privacy@clubbeans.com)',
        },
        { status: 409 }
      );
    }

    // Ad değişimi: günlük sınır + eski iskeleti serbest bırak (yalnız sahibi bensem)
    const eskiIskelet = eskiAd ? iskelet(eskiAd) : null;
    const adDegisti = !!eskiIskelet && eskiIskelet !== ad.iskelet;
    if (adDegisti) {
      const sayac = await redis.incr(`nickchg:${anonId}`);
      if (sayac === 1) await redis.expire(`nickchg:${anonId}`, 86_400);
      if (sayac > GUNLUK_AD_DEGISIMI) {
        // Yeni rezervasyonu geri al ki ad boşta kalmasın
        await redis.eval(ESKI_ADI_SERBEST_BIRAK, [`nickowner:${ad.iskelet}`], [anonId]);
        reddedildi('ad-degisim-siniri');
        return NextResponse.json(
          { hata: 'ad-degisim-siniri', mesaj: 'Bugün için ad değiştirme hakkın doldu. Önceki adınla devam et.' },
          { status: 422 }
        );
      }
    }

    // 4) Tek kullanımlık oturum — GETDEL atomik, paralel iki submit yarışını çözer
    const oturumHam = await redis.getdel<string | Record<string, unknown>>(`sess:${sessionId}`);
    if (!oturumHam) {
      reddedildi('oturum-bitti');
      return NextResponse.json(
        { hata: 'oturum-bitti', mesaj: 'Tur kaydı için süre doldu. Bir tur daha oyna.' },
        { status: 409 }
      );
    }
    const oturumParse = Oturum.safeParse(
      typeof oturumHam === 'string' ? JSON.parse(oturumHam) : oturumHam
    );
    if (!oturumParse.success) {
      reddedildi('oturum-bozuk');
      return NextResponse.json({ hata: 'oturum-bozuk' }, { status: 422 });
    }
    const oturum = oturumParse.data;

    // Duvar saati: 60 sn'lik tur 45 sn'den kısa sürede gelemez
    const gecen = Date.now() - oturum.baslangic;
    if (!Number.isFinite(gecen) || gecen < 45_000) {
      reddedildi('duvar-saati', { gecen: Math.round(gecen) });
      return NextResponse.json(
        { hata: 'akla-yatmadi', mesaj: HILE_REDDI },
        { status: 422 }
      );
    }

    const dogrulama = aklaYatkin(ozet as TurOzeti, skor, olaylar);
    if (!dogrulama.gecerli) {
      // Eşik adı yalnız telemetriye — saldırgana deneme-yanılma haritası vermez (spec §6)
      reddedildi(dogrulama.sebep);
      return NextResponse.json(
        { hata: 'akla-yatmadi', mesaj: HILE_REDDI },
        { status: 422 }
      );
    }

    const nihaiSkor = sunucuSkoru(ozet as TurOzeti, olaylar);
    const runId = randomUUID();
    // Gün kovası TUR BAŞLANGICINDAN — gece yarısını turun içinde geçen oyuncunun
    // skoru başladığı güne yazılır (spec §5.4)
    const gun = trGunu(new Date(oturum.baslangic));
    // Görünen ad yalnız en iyi skor gerçekten güncellendiyse değişir (tablo = en iyi tur)
    const nickYaz = eskiSkor == null || nihaiSkor >= Number(eskiSkor) || !eskiAd;

    // 5) Yazma — tek pipeline. Biri düşerse oturum tüketilmiş ama skor yazılmamış
    //    olurdu; tek gidiş-dönüşte ya hepsi ya hiçbiri (Upstash pipeline ardışık ama tek RTT).
    const p = redis.pipeline();
    p.set(
      `run:${runId}`,
      JSON.stringify({
        takmaAd: ad.temiz, skor: nihaiSkor,
        yakalanan: ozet.yakalanan, kacan: ozet.kacan, kart: ozet.kart,
        toplamSaniye: toplamSaniye ?? Math.round(ozet.sureMs / 1000),
        gun,
        tarih: Date.now(),
      }),
      { ex: RUN_TTL }
    );
    if (nickYaz) p.set(`nick:${anonId}`, ad.temiz, { ex: AD_TTL });
    else p.expire(`nick:${anonId}`, AD_TTL);
    p.expire(`nickowner:${ad.iskelet}`, AD_TTL);
    if (adDegisti && eskiIskelet) p.eval(ESKI_ADI_SERBEST_BIRAK, [`nickowner:${eskiIskelet}`], [anonId]);
    p.zadd('lb:all', { gt: true }, { score: nihaiSkor, member: anonId });
    p.zadd(`lb:day:${gun}`, { gt: true }, { score: nihaiSkor, member: anonId });
    p.expire(`lb:day:${gun}`, 172_800);
    // KVKK silme zinciri: takma ad → anonId → kartlar (scripts/oyun-sil.mjs)
    p.sadd(`runs:${anonId}`, runId);
    p.expire(`runs:${anonId}`, RUN_TTL);
    // Tablo tavanı: bot pompalamasında sınırsız büyüme yok
    p.zremrangebyrank('lb:all', 0, -(TABLO_TAVANI + 1));
    p.zcount('lb:all', nihaiSkor + 1, '+inf');
    p.zcard('lb:all');
    const sonuc = await p.exec();
    const sira = sonuc[sonuc.length - 2];
    const toplam = sonuc[sonuc.length - 1];

    return NextResponse.json({
      runId,
      skor: nihaiSkor,
      sira: (typeof sira === 'number' ? sira : 0) + 1,
      toplamOyuncu: typeof toplam === 'number' ? toplam : 0,
      takmaAd: ad.temiz,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error('[oyun] submit yazma hatası:', err);
    // Takma ad / IP gönderilmez (KVKK); yalnız rota ve hata nesnesi.
    Sentry.captureException(err, { tags: { alan: 'oyun', rota: 'submit' } });
    // Oturum tüketilmiş olabilir ama yazma düştü — 409 "zaten kaydedildi" DEMİYORUZ,
    // çünkü kaydedilmedi. Dürüst oyuncu doğru teşhis görmeli.
    return NextResponse.json(
      { hata: 'kayit-tamamlanamadi', mesaj: 'Kayıt tamamlanamadı. Bir tur daha oyna.' },
      { status: 500 }
    );
  }
}
