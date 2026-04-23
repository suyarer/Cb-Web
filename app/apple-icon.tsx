import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 100,
          background: 'linear-gradient(135deg, #050505 0%, #0a0a0a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 40,
        }}
      >
        <svg viewBox="0 0 100 120" width="140" height="140">
          <defs>
            <linearGradient id="bean" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7ED848" />
              <stop offset="55%" stopColor="#3EA52A" />
              <stop offset="100%" stopColor="#1C6A13" />
            </linearGradient>
            <linearGradient id="leafR" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#6BB01E" />
              <stop offset="100%" stopColor="#CBEC4A" />
            </linearGradient>
            <linearGradient id="leafL" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E5E4E" />
              <stop offset="100%" stopColor="#0E3A2E" />
            </linearGradient>
          </defs>
          <path
            d="M 12 78 C 12 92 26 102 50 102 C 74 102 88 92 88 78 C 88 72 85 66 78 66 L 22 66 C 15 66 12 72 12 78 Z"
            fill="url(#bean)"
          />
          <path
            d="M 50 66 C 50 58 50 52 50 40"
            stroke="#3EA52A"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 50 44 C 36 40 24 30 22 18 C 36 18 48 30 50 44 Z"
            fill="url(#leafL)"
          />
          <path
            d="M 50 44 C 66 38 80 26 82 12 C 68 13 54 26 50 44 Z"
            fill="url(#leafR)"
          />
        </svg>
      </div>
    ),
    size
  );
}
