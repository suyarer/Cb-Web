'use client';

import { memo } from 'react';
import type { BeanFaz } from '@/lib/game/engine';

/**
 * Bean çözülme yayı — karar 6 + sentez §2.4.
 *
 * Anlam KİLODA DEĞİL, uyuşma ve yok olmada. Şişme yayın yalnız ilk basamağı;
 * ağırlık renk solması + cam göz + pikselleşmede taşınır. Üç uzmanın 1 numaralı
 * riski "şişmiş Bean + logo aynı karede" olduğu için:
 *   - scale TAVANI 1.15 ve en/boy oranı KORUNUR ("tombul" okuması yasak)
 *   - faz 5'te asit yeşili paletten TAMAMEN çıkar (flaş/nöbet güvenliği + beden okuması)
 *   - paylaşım kartı faz 5 karesini kullanır, şişkin kareyi ASLA
 *
 * Uygulama notu: SVG filter (feTurbulence vb.) YASAK — mobilde GPU'yu yakıyor.
 * Pikselleşme, dikdörtgen dizisiyle taklit edilir (ucuz, deterministik).
 */

type Props = {
  faz: BeanFaz;
  size?: number;
  /** prefers-reduced-motion: geçiş animasyonu yok, faz anında değişir */
  reduced?: boolean;
  className?: string;
};

/** Faz başına görsel durum. scale tavanı 1.15 — aşılamaz. */
const FAZLAR = [
  { scale: 1.0, doygunluk: 1.0, aciklik: 1.0, gozBoyut: 3.2, pikselle: 0 },
  { scale: 1.06, doygunluk: 0.82, aciklik: 0.96, gozBoyut: 3.6, pikselle: 0 },
  { scale: 1.12, doygunluk: 0.6, aciklik: 0.88, gozBoyut: 4.4, pikselle: 0 },
  { scale: 1.15, doygunluk: 0.38, aciklik: 0.74, gozBoyut: 5.2, pikselle: 0.25 },
  { scale: 1.15, doygunluk: 0.18, aciklik: 0.58, gozBoyut: 5.8, pikselle: 0.6 },
  { scale: 1.15, doygunluk: 0.0, aciklik: 0.4, gozBoyut: 6.2, pikselle: 1.0 },
] as const;

/** Faz 5'te palet gri-siyah aralığına iner; #A8E600 yok. */
function govdeRengi(faz: BeanFaz): { ust: string; alt: string } {
  const f = FAZLAR[faz];
  if (faz >= 5) return { ust: '#3A3A3A', alt: '#151515' };
  // canlı yeşilden griye interpolasyon (doygunluk düşerken)
  const mix = (canli: [number, number, number], gri: number) => {
    const s = f.doygunluk;
    const r = Math.round(canli[0] * s + gri * (1 - s));
    const g = Math.round(canli[1] * s + gri * (1 - s));
    const b = Math.round(canli[2] * s + gri * (1 - s));
    return `rgb(${r},${g},${b})`;
  };
  return { ust: mix([126, 216, 72], 96), alt: mix([28, 106, 19], 42) };
}

/**
 * Pikselleşme — SVG filter yerine ucuz dikdörtgen ızgarası.
 *
 * İKİ DÜZELTME (canlı ekran görüntüsü kanıtı, faz 5):
 *
 * 1) SIRALI DOLDURMA → SAÇILMIŞ SIRA. Bloklar ızgara sırasıyla çiziliyordu;
 *    sonuç yukarıdan aşağı bir "silecek" hareketiydi, çözülme değil. Artık
 *    deterministik bir karıştırma sırası kullanılıyor: blok blok, gövdenin her
 *    yerinden delik açılır.
 *
 * 2) TAM ÖRTME → TAVAN. faz 5'te oran 1.0 idi, yani gövdenin ÜSTÜ tamamen
 *    kapanıyordu; ekranda Bean değil siyah bir dikdörtgen görünüyordu —
 *    "akışa karıştı" anlamı ölüyordu. Örtme tavanı 0.62: gövdenin bir kısmı
 *    daima durur, mozaik olarak okunur.
 */
const ORTME_TAVANI = 0.62;

const PIKSEL_IZGARA = (() => {
  const out: Array<{ x: number; y: number; w: number; i: number }> = [];
  let n = 0;
  for (let y = 62; y < 104; y += 7) {
    for (let x = 12; x < 88; x += 7) {
      out.push({ x, y, w: 7, i: n++ });
    }
  }
  // Saçılmış ama SABİT sıra: her render aynı deseni verir (kare titremesi yok)
  return out
    .map((p) => ({ p, k: ((p.i * 2654435761) % 4093) })) // Knuth çarpanı
    .sort((a, b) => a.k - b.k)
    .map((x) => x.p);
})();

function BeanCozulmeIc({ faz, size = 96, reduced = false, className }: Props) {
  const f = FAZLAR[faz];
  const renk = govdeRengi(faz);
  const gecis = reduced ? 'none' : 'transform 900ms cubic-bezier(0.22,1,0.36,1), opacity 900ms linear';

  // Kaç piksel bloğu görünür — deterministik, rastgelelik yok (kare titremesi olmasın)
  const pikselSayisi = Math.round(PIKSEL_IZGARA.length * f.pikselle * ORTME_TAVANI);
  const kirpmaId = `bean-govde-${faz}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 120"
      className={className}
      role="img"
      aria-label={
        faz === 0
          ? 'Bean: canlı'
          : faz >= 5
            ? 'Bean: akışa karıştı, artık seçilmiyor'
            : `Bean: çözülüyor, ${faz}. aşama`
      }
      style={{ overflow: 'visible' }}
    >
      <defs>
        <clipPath id={kirpmaId}>
          <path
            d="M 12 78 C 12 92 26 102 50 102 C 74 102 88 92 88 78 C 88 72 85 66 78 66 L 22 66 C 15 66 12 72 12 78 Z"
            transform={`translate(50 84) scale(${f.scale}) translate(-50 -84)`}
          />
        </clipPath>
      </defs>
      <g
        style={{
          transform: `scale(${f.scale})`,
          transformOrigin: '50px 84px',
          transition: gecis,
          opacity: f.aciklik,
        }}
      >
        {/* Gövde */}
        <path
          d="M 12 78 C 12 92 26 102 50 102 C 74 102 88 92 88 78 C 88 72 85 66 78 66 L 22 66 C 15 66 12 72 12 78 Z"
          fill={renk.alt}
          style={{ transition: reduced ? 'none' : 'fill 900ms linear' }}
        />
        <path
          d="M 14 76 C 14 88 27 98 50 98 C 73 98 86 88 86 76 C 86 71 83 68 77 68 L 23 68 C 17 68 14 71 14 76 Z"
          fill={renk.ust}
          style={{ transition: reduced ? 'none' : 'fill 900ms linear' }}
        />

        {/* Sap + yapraklar — faz ilerledikçe düşer (canlılığın kaybı) */}
        <g style={{ opacity: Math.max(0, 1 - faz * 0.24), transition: gecis }}>
          <path
            d="M 50 66 C 50 58 50 52 50 40"
            stroke={renk.ust}
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={
              faz < 2
                ? 'M 50 44 C 36 40 24 30 22 18 C 36 18 48 30 50 44 Z'
                : 'M 50 46 C 38 46 28 42 24 34 C 36 30 48 36 50 46 Z' /* sarkmış */
            }
            fill={renk.alt}
            style={{ transition: reduced ? 'none' : 'd 900ms linear' }}
          />
          <path
            d={
              faz < 2
                ? 'M 50 44 C 66 38 80 26 82 12 C 68 13 54 26 50 44 Z'
                : 'M 50 46 C 64 46 74 42 78 34 C 66 30 54 36 50 46 Z'
            }
            fill={renk.ust}
            style={{ transition: reduced ? 'none' : 'd 900ms linear' }}
          />
        </g>

        {/* Gözler — faz ilerledikçe büyür ve camsılaşır (uyuşma sinyali) */}
        <g>
          <circle cx="40" cy="82" r={f.gozBoyut} fill="#0A0A0A" opacity={0.85} />
          <circle cx="60" cy="82" r={f.gozBoyut} fill="#0A0A0A" opacity={0.85} />
          {/* Işık noktası faz ilerledikçe kaybolur = camsı bakış */}
          <circle cx="41.4" cy="80.6" r={1.1} fill="#fff" opacity={Math.max(0, 1 - faz * 0.3)} />
          <circle cx="61.4" cy="80.6" r={1.1} fill="#fff" opacity={Math.max(0, 1 - faz * 0.3)} />
        </g>
      </g>

      {/* Pikselleşme katmanı — gövdeyi bloklara böler, "akışa karışma".
          Gövde yoluna KIRPILIR: kırpma olmadan bloklar siluetin dışına taşıp
          köşeli bir leke üretiyordu. */}
      {pikselSayisi > 0 && (
        <g aria-hidden clipPath={`url(#${kirpmaId})`}>
          {PIKSEL_IZGARA.slice(0, pikselSayisi).map((p) => (
            <rect
              key={p.i}
              x={p.x}
              y={p.y}
              width={p.w}
              height={p.w}
              fill={faz >= 5 ? '#0E0E0E' : renk.alt}
              opacity={faz >= 5 ? 0.92 : 0.55}
              style={{ transition: reduced ? 'none' : 'opacity 700ms linear' }}
            />
          ))}
        </g>
      )}
    </svg>
  );
}

export default memo(BeanCozulmeIc);
