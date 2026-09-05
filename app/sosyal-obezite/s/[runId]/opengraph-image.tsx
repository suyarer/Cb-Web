import { ImageResponse } from 'next/og';
import { TANIM_SATIRI } from '@/content/sosyal-obezite-feed';
import { PikselBean } from '@/lib/game/og-bean';
import { redisAl } from '@/lib/game/redis';

/**
 * Paylaşım kartının GÖRSELİ — X/WhatsApp önizlemesinde görünen şey.
 *
 * Üç zorunluluk (uzman paneli):
 *  1) Hiyerarşi: kurtarılan gerçek BÜYÜK, süre orta, skor KÜÇÜK.
 *     Skoru öne alan kart "çok kaydırdım" diye övünür → tez ters döner.
 *  2) TANIM_SATIRI kartta MUTLAKA olacak. Bağlamsız dolaşan tek karede
 *     "obeziteyle dalga geçen oyun" okumasının tek savunması bu satır.
 *  3) Bean'in ŞİŞKİN hâli kartta YER ALMAZ. Yalnız faz-5: dağılmış piksel
 *     ızgarası, gri-siyah palet, asit yeşili YOK.
 */

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Sosyal Obezite skor kartı';

type Kosu = {
  takmaAd: string; skor: number; yakalanan: number; kacan: number;
  kart: number; toplamSaniye: number; tarih: number;
};

async function kosuAl(runId: string): Promise<Kosu | null> {
  if (!/^[0-9a-f-]{36}$/i.test(runId)) return null;
  const redis = redisAl();
  if (!redis) return null;
  try {
    const ham = await redis.get<string | Kosu>(`run:${runId}`);
    if (!ham) return null;
    return typeof ham === 'string' ? (JSON.parse(ham) as Kosu) : ham;
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params;
  const k = await kosuAl(runId);
  const dk = k ? Math.max(1, Math.round(k.toplamSaniye / 60)) : 0;
  const toplam = k ? k.yakalanan + k.kacan : 12;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', padding: '72px',
          background: '#050505', fontFamily: 'system-ui', color: '#fff',
        }}
      >
        {/* Üst: marka + faz-5 Bean */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 26, letterSpacing: 6, color: '#737373' }}>SOSYAL OBEZİTE</div>
            <div style={{ display: 'flex', fontSize: 20, color: '#737373', marginTop: 8 }}>clubbeans.com</div>
          </div>
          <PikselBean />
        </div>

        {/* Orta: HİYERARŞİ — kurtarılan gerçek en büyük */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 24, color: '#737373', marginBottom: 6 }}>
            {k ? `${k.takmaAd} kurtardı` : 'kaç gerçeği kurtarabilirsin'}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', fontSize: 176, fontWeight: 700, lineHeight: 1, color: '#A8E600' }}>
              {k ? k.yakalanan : '?'}
            </div>
            {/* Satori: gövde TEK çocuk olmalı — "/{toplam}" iki düğüm üretiyordu */}
            <div style={{ display: 'flex', fontSize: 56, color: '#737373', marginLeft: 10, marginBottom: 20 }}>
              {`/${toplam}`}
            </div>
            <div style={{ display: 'flex', fontSize: 30, color: '#737373', marginLeft: 22, marginBottom: 28 }}>
              gerçek
            </div>
          </div>
          {k && (
            <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 14 }}>
              <div style={{ display: 'flex', fontSize: 34, color: '#e8eaf0' }}>{`${dk} dakikasını akış aldı`}</div>
              <div style={{ display: 'flex', fontSize: 20, color: '#737373', marginLeft: 20 }}>{`skor ${k.skor}`}</div>
            </div>
          )}
        </div>

        {/* Alt: TANIM SATIRI — zorunlu savunma katmanı */}
        <div
          style={{
            display: 'flex', flexDirection: 'column',
            borderLeft: '4px solid rgba(168,230,0,0.4)', paddingLeft: 20,
          }}
        >
          <div style={{ display: 'flex', fontSize: 26, color: '#9aa1b4' }}>{TANIM_SATIRI}</div>
          <div style={{ display: 'flex', fontSize: 22, color: '#737373', marginTop: 8 }}>
            Kaçırdığın gerçekler ekranda değil, dışarıda duruyor.
          </div>
        </div>
      </div>
    ),
    size
  );
}
