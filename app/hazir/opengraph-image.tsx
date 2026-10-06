/**
 * @route /hazir (OG görseli)
 * @governing_law GUVENLIK_ANAYASASI · CB2026 hazir-hesap-giris-baglantisi-2026-10-06
 *
 * DM'de bağlantı önizlemesi: yalnız "hesabın hazır" der. Önizleme botu hash'i (#k=) hiç görmez;
 * sayfa yüklemede ağ çağrısı yapmadığı için bot hakkı da yakamaz.
 */
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'ClubBeans hesabın hazır — tek dokunuşla hesabına gir.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function HazirOG() {
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
        <div style={{ color: '#fff', fontSize: '28px', fontWeight: 700 }}>ClubBeans</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', color: '#fff', lineHeight: 1.05 }}>
        <div style={{ fontSize: '104px', fontWeight: 900, letterSpacing: '-0.04em' }}>Hesabın hazır.</div>
        <div style={{ fontSize: '40px', color: '#A8E600', marginTop: '24px' }}>Tek dokunuşla hesabına gir.</div>
      </div>
      <div style={{ display: 'flex', color: '#737373', fontSize: '22px' }}>Bağlantıyı telefonundan aç</div>
    </div>,
    size
  );
}
