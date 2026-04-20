import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'ClubBeans — Etkinlik odaklı anti-platform topluluk';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #050505 0%, #0a0a0a 50%, #1a1a1a 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '80px',
        fontFamily: 'system-ui',
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '-30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(168, 230, 0, 0.2) 0%, transparent 60%)',
        }}
      />

      {/* Top: Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            width: '60px',
            height: '60px',
            background: '#A8E600',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            fontWeight: 900,
            color: '#050505',
          }}
        >
          CB
        </div>
        <div style={{ color: '#fff', fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em' }}>
          ClubBeans
        </div>
      </div>

      {/* Middle: Headline */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontSize: '96px',
          fontWeight: 900,
          lineHeight: 1,
          color: '#fff',
          letterSpacing: '-0.04em',
        }}
      >
        <div>Algoritma değil</div>
        <div
          style={{
            background: 'linear-gradient(135deg, #fff 0%, #A8E600 100%)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          sen seç.
        </div>
      </div>

      {/* Bottom: Tagline */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#737373',
          fontSize: '22px',
        }}
      >
        <div>Etkinlik odaklı anti-platform topluluk · 2026</div>
        <div style={{ color: '#A8E600', fontFamily: 'monospace' }}>clubbeans.com</div>
      </div>
    </div>,
    size
  );
}
