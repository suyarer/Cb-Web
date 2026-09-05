import { ImageResponse } from 'next/og';
import { GERCEK_SAYISI, TUR_SURESI_MS } from '@/lib/game/engine';
import { TANIM_SATIRI } from '@/content/sosyal-obezite-feed';
import { PikselBean } from '@/lib/game/og-bean';

/**
 * Oyun sayfasının paylaşım görseli.
 *
 * Bu dosya YOKTU: `/sosyal-obezite` linki X'e, WhatsApp'a veya Telegram'a
 * atıldığında önizleme görselsiz çıkıyordu — üstelik sayfa metadata'sı
 * `twitter: { card: 'summary_large_image' }` ilan ettiği için X büyük ama BOŞ
 * bir kart çiziyordu. Viral yayılması hedeflenen bir sayfada en pahalı eksik bu:
 * skor kartı olmayan (yani oynamamış birinin paylaştığı) her link kör gidiyordu.
 *
 * Skor kartından farkı: burada kişi yok, DAVET var. Sayı değil soru gösterilir.
 *
 * ⚠️ Satori kuralı için bkz. lib/game/og-bean.tsx başlığı — çoklu çocuklu her
 * div açık `display` ister, metin gövdeleri tek şablon dizesi olarak yazılır.
 */

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Sosyal Obezite — 60 saniye';

export default function Image() {
  const saniye = Math.round(TUR_SURESI_MS / 1000);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', padding: '72px',
          background: '#050505', fontFamily: 'system-ui', color: '#fff',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 26, letterSpacing: 6, color: '#8A8A8A' }}>SOSYAL OBEZİTE</div>
            <div style={{ fontSize: 20, color: '#8A8A8A', marginTop: 8 }}>clubbeans.com</div>
          </div>
          <PikselBean />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, lineHeight: 1.05, color: '#fff' }}>
            {`${saniye} saniye.`}
          </div>
          <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, lineHeight: 1.05, color: '#A8E600' }}>
            Akış akmaya devam edecek.
          </div>
          <div style={{ display: 'flex', fontSize: 32, color: '#9aa1b4', marginTop: 22, marginBottom: 28 }}>
            {`Arada ${GERCEK_SAYISI} gerçek davet belirir. Kaçını kurtarabilirsin?`}
          </div>
        </div>

        {/* Tanım satırı — bağlamsız dolaşan karede tek savunma katmanı */}
        <div
          style={{
            display: 'flex', flexDirection: 'column',
            borderLeft: '4px solid rgba(168,230,0,0.4)', paddingLeft: 20,
          }}
        >
          <div style={{ fontSize: 26, color: '#9aa1b4' }}>{TANIM_SATIRI}</div>
        </div>
      </div>
    ),
    size
  );
}
