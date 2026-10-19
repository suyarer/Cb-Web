/**
 * @module sayac
 * Site mağaza düğmesi + reklam inişi sayacı — KİŞİSEL VERİSİZ toplam sayım (CB2026 meta-magaza-tiklama-sayaci-2026-10-19).
 *
 * Neden: reklamdan gelen ziyaretçinin mağaza düğmesine basıp basmadığını reklam hücresi kodu (utm_campaign) × platform × sayfa
 * kırılımıyla görmek (iniş → mağaza → kurulum hunisindeki kopuş). Mevcut Pixel/PostHog tıklama olayı yalnız çerez onayıyla
 * çalışır; reklam trafiğinin çoğu onay vermez → görünmez kalıyordu.
 *
 * KVKK: çerez/yerel depolama YOK, kimlik YOK, cihaz parmak izi YOK. Aynı kökene yalnız {tur, kod, platform, kaynak} gider;
 * sunucu günlük toplamı +1 yapar (Supabase site_magaza_sayac). Gizlilik sayfası §2.7 ve §6'da yazılı.
 * Asla fırlatmaz ve beklenmez: düğmenin ve sayfanın davranışını etkilemez.
 *
 * @governing_law clubbeans-privacy-v1
 */
import { sayfaKampanyasi } from '@/lib/appLinks';

export type SayacTur = 'inis' | 'tik';
export type SayacPlatform = 'ios' | 'android' | 'yok';

const KAYNAK_RE = /^[a-z0-9_-]{1,30}$/;
const BOT_RE = /bot|crawl|spider|slurp|facebookexternalhit|headless|lighthouse|preview/i;

/** Mağaza bağlantısındaki kampanya etiketiyle AYNI temizleme (lib/appLinks) — Meta hücre koduyla birebir; fbclid-yalnız → `meta_organik`. */
export function sayacKodu(search: string): string {
  return sayfaKampanyasi(search, 'organik');
}

export function cihazPlatformu(ua: string): SayacPlatform {
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'yok';
}

export function botMu(ua: string): boolean {
  return BOT_RE.test(ua);
}

export function magazaSay(tur: SayacTur, platform: SayacPlatform, kaynak: string): void {
  try {
    if (typeof window === 'undefined' || botMu(navigator.userAgent)) return;
    const temizKaynak = kaynak.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 30);
    if (!KAYNAK_RE.test(temizKaynak)) return;
    const govde = JSON.stringify({ tur, platform, kaynak: temizKaynak, kod: sayacKodu(window.location.search) });
    if (navigator.sendBeacon?.('/api/sayac', new Blob([govde], { type: 'application/json' }))) return;
    void fetch('/api/sayac', {
      method: 'POST',
      body: govde,
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // Sayım yan kanal — hata düğmeyi/sayfayı etkilemez; sunucu tarafı hatalar Sentry'de (api.sayac).
  }
}
