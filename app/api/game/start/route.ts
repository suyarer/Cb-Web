import { Ratelimit } from '@upstash/ratelimit';
import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { GERCEK_SAYISI, TUR_SURESI_MS } from '@/lib/game/engine';
import { trGunu } from '@/lib/game/gun';
import { anonIdAlVeYaz, istemciIp, originGecerli } from '@/lib/game/oturum';
import { redisAl } from '@/lib/game/redis';

/**
 * SOSYAL OBEZİTE — tur başlatma.
 * Tek kullanımlık oturum + seed üretir. Seed istemciye gider (spawn takvimi
 * deterministik olmak zorunda), bu yüzden bot mükemmel tur üretebilir —
 * BİLİNEN ve KABUL EDİLMİŞ risk (karar 10 sert replay doğrulama istemiyor).
 * Sınır: skor matematiksel tavanla kapalı (1605), bot tavana oturur,
 * tabloyu sonsuza kaçıramaz.
 */

// Tembel kurulum: env yoksa oyun Redis'siz oynanır (skor tablosu devre dışı).
let limiter: Ratelimit | null | undefined;
function limiterAl(): Ratelimit | null {
  if (limiter !== undefined) return limiter;
  const redis = redisAl();
  limiter = redis
    ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(60, '1 m'), prefix: 'rl:game:start' })
    : null;
  return limiter;
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  // Köken denetimi cookie'den ÖNCE — anonId çerezi CSRF yüzeyini yükseltiyor
  if (!originGecerli(req)) {
    return NextResponse.json({ hata: 'kaynak-reddedildi' }, { status: 403 });
  }

  const ip = istemciIp(req);
  const rl = limiterAl();
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
  await anonIdAlVeYaz();

  const redis = redisAl();
  /**
   * TTL 600 sn (180 değil): oyuncu itiraf ekranında oyalanabilir, bildirime
   * geçip dönebilir. 180 sn'de dürüst oyuncunun submit'i getdel-null → 409
   * ile sessizce kayboluyordu. Duvar-saati kontrolü (>=45 sn) hile kapısını
   * zaten tutuyor, TTL'yi kısa tutmanın güvenlik faydası yok.
   */
  if (redis) {
    await redis.set(
      `sess:${sessionId}`,
      JSON.stringify({ seed, ilkTur, baslangic: Date.now(), ip: ip ?? 'ipsiz' }),
      { ex: 600 }
    );
  }

  return NextResponse.json({
    // Redis yoksa sessionId boş gider → istemci skoru göndermeye çalışmaz
    sessionId: redis ? sessionId : '',
    seed,
    ilkTur,
    turSuresiMs: TUR_SURESI_MS,
    gercekSayisi: GERCEK_SAYISI,
  });
}
