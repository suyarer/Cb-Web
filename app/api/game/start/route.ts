import { Ratelimit } from '@upstash/ratelimit';
import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { GERCEK_SAYISI, TUR_SURESI_MS } from '@/lib/game/engine';
import { trGunu } from '@/lib/game/gun';
import { oneriAdUret } from '@/lib/game/nickname';
import { anonIdAlVeYaz, istemciIp, originGecerli } from '@/lib/game/oturum';
import { oyunKapaliMi, redisAl, zamanAsimi } from '@/lib/game/redis';

/**
 * SOSYAL OBEZİTE — tur başlatma.
 * Tek kullanımlık oturum + seed üretir. Seed istemciye gider (spawn takvimi
 * deterministik olmak zorunda), bu yüzden bot mükemmel tur üretebilir —
 * BİLİNEN ve KABUL EDİLMİŞ risk (karar 10 sert replay doğrulama istemiyor).
 * Sınır: skor matematiksel tavanla kapalı (1605), bot tavana oturur,
 * tabloyu sonsuza kaçıramaz; kimlik başına günlük oturum sayacı (aşağıda) tek
 * botun top-20'yi doldurmasını da keser.
 */

// Tembel kurulum: env yoksa oyun Redis'siz oynanır (skor tablosu devre dışı).
let limiter: Ratelimit | null | undefined;
let ipsizLimiter: Ratelimit | null | undefined;
function limiterAl(ipli: boolean): Ratelimit | null {
  const redis = redisAl();
  if (!redis) return null;
  if (ipli) {
    limiter ??= new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(60, '1 m'), prefix: 'rl:game:start', timeout: 1000 });
    return limiter;
  }
  // IP'siz istekler tek "bilinmiyor" kovasına düşüyordu — ayrı ve daha sıkı kova (guvenlik-10)
  ipsizLimiter ??= new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '1 m'), prefix: 'rl:game:start:ipsiz', timeout: 1000 });
  return ipsizLimiter;
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Kimlik başına günlük tur tavanı — bot tek kimlikle sınırsız satır açamasın (guvenlik-1) */
const GUNLUK_TUR_TAVANI = 200;

export async function POST(req: Request) {
  // Köken denetimi cookie'den ÖNCE — anonId çerezi CSRF yüzeyini yükseltiyor
  if (!originGecerli(req)) {
    return NextResponse.json({ hata: 'kaynak-reddedildi' }, { status: 403 });
  }

  const redis = redisAl();
  if (await oyunKapaliMi(redis)) {
    return NextResponse.json({ hata: 'kapali' }, { status: 503, headers: { 'Retry-After': '300' } });
  }

  const ip = istemciIp(req);
  const rl = limiterAl(ip !== null);
  if (rl) {
    const { success, reset } = await rl.limit(ip ?? 'ipsiz');
    if (!success) {
      return NextResponse.json(
        { hata: 'yogunluk', mesaj: 'Şu an yoğunluk var, birazdan tekrar dene.' },
        { status: 429, headers: { 'Retry-After': String(Math.max(1, Math.ceil((reset - Date.now()) / 1000))) } }
      );
    }
  }

  let ilkTur = true;
  try {
    const body = (await req.json()) as { turNo?: number } | null;
    ilkTur = !body?.turNo || body.turNo <= 1;
  } catch {
    // gövde yoksa ilk tur varsayılır
  }

  const sessionId = randomUUID();
  /**
   * GÜNLÜK ORTAK SEED — GeoGuessr Daily deseni.
   *
   * Herkes aynı gün AYNI 12 gerçeği aynı zamanlamayla oynar; spawnTakvimi()
   * zaten deterministik, yalnız seed kaynağı değişti. Bu olmadan skor tablosu
   * elmayla armudu kıyaslıyordu — kimin turu daha kolaydı belli değildi.
   *
   * Kullanıcı kararı: deneme sınırı YOK. Kıtlık yerine ustalaşma yarışı
   * (Flappy Bird deseni). ZADD GT sayesinde kaç kez oynarsan oyna tabloda
   * tek satırın var ve yalnız en iyi skorun durur — enflasyon olmaz.
   */
  const seed = `so-${trGunu()}`;
  // Kalıcı anonim kimlik — skor tablosunun sorted-set member'ı bu olur
  const anonId = await anonIdAlVeYaz();

  /**
   * TTL 600 sn (180 değil): oyuncu tur sonu ekranında oyalanabilir, bildirime
   * geçip dönebilir. 180 sn'de dürüst oyuncunun submit'i getdel-null → 409
   * ile sessizce kayboluyordu. Duvar-saati kontrolü (>=45 sn) hile kapısını
   * zaten tutuyor, TTL'yi kısa tutmanın güvenlik faydası yok.
   *
   * Oturum kaydında IP YOK (KVKK: yalnız hız sınırı için işlenir, saklanmaz — kvkk-4).
   * Redis askıda kalırsa 1500 ms'de vazgeçilir; sessionId '' döner, oyun tablosuz oynanır.
   */
  let tabloAcik = false;
  if (redis) {
    const sayac = await zamanAsimi(redis.incr(`sess-count:${anonId}`), 800, 0);
    if (sayac === 1) void zamanAsimi(redis.expire(`sess-count:${anonId}`, 86_400), 800, 0);
    if (sayac > GUNLUK_TUR_TAVANI) {
      return NextResponse.json(
        { hata: 'gunluk-tavan', mesaj: 'Bugünlük bu kadar. Yarın aynı akış, yeni gerçekler.' },
        { status: 429, headers: { 'Retry-After': '3600' } }
      );
    }
    const yazildi = await zamanAsimi(
      redis.set(`sess:${sessionId}`, JSON.stringify({ seed, ilkTur, baslangic: Date.now() }), { ex: 600 }),
      1500,
      null
    );
    tabloAcik = yazildi === 'OK';
  }

  return NextResponse.json({
    // Redis yoksa/askıdaysa sessionId boş gider → istemci skoru göndermeye çalışmaz
    sessionId: tabloAcik ? sessionId : '',
    seed,
    ilkTur,
    turSuresiMs: TUR_SURESI_MS,
    gercekSayisi: GERCEK_SAYISI,
    // Sunucu-üretimi takma ad önerisi — alan dolu gelir, tek dokunuşla yazılır (spec §3.4)
    oneriAd: oneriAdUret(`${anonId}:${seed}`),
  });
}
