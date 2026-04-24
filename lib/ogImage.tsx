import { ImageResponse } from 'next/og';

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

type OgParams = {
  kicker?: string;
  title: string;
  subtitle?: string;
};

export function createOgImage({ kicker = 'ClubBeans', title, subtitle }: OgParams) {
  return new ImageResponse(
    (
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
            background:
              'radial-gradient(circle, rgba(168, 230, 0, 0.2) 0%, transparent 60%)',
          }}
        />

        {/* Top: Logo + kicker */}
        <div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
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
            <div
              style={{
                color: '#fff',
                fontSize: '28px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
              }}
            >
              ClubBeans
            </div>
          </div>
          <div
            style={{
              color: '#A8E600',
              fontSize: '18px',
              fontFamily: 'monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
            }}
          >
            {kicker}
          </div>
        </div>

        {/* Middle: Headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: title.length > 40 ? '68px' : '84px',
            fontWeight: 900,
            lineHeight: 1.05,
            color: '#fff',
            letterSpacing: '-0.03em',
            maxWidth: '1040px',
          }}
        >
          {title}
        </div>

        {/* Bottom: Subtitle */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#737373',
            fontSize: '22px',
          }}
        >
          <div style={{ maxWidth: '900px' }}>{subtitle || 'Anti-platform topluluk'}</div>
          <div style={{ color: '#A8E600', fontFamily: 'monospace' }}>clubbeans.com</div>
        </div>
      </div>
    ),
    ogSize
  );
}
