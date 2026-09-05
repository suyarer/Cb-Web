'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import ClientExtras from '@/components/ClientExtras';
import CookieConsent from '@/components/CookieConsent';
import CosyMode from '@/components/CosyMode';
import GutterSprout from '@/components/GutterSprout';
import LiveTicker from '@/components/LiveTicker';
import ScrollManager from '@/components/ScrollManager';
import ScrollRoots from '@/components/ScrollRoots';

/**
 * Sitenin global süs/etkileşim katmanları — OYUN ROTASINDA KAPALI.
 *
 * Neden: /sosyal-obezite 60fps'e ve "ana thread neredeyse boş" varsayımına
 * dayanıyor (sentez §C2). Root layout'un global yükü bu varsayımı çökertiyordu:
 *   - grain-overlay: fixed inset-0 mix-blend-overlay → oyunun 13 hareketli
 *     will-change katmanının ÜSTÜNDE her frame tüm viewport'u yeniden karıştırır
 *   - LiveTicker: 9sn/30sn setInterval React commit'leri + oyunun üstüne şerit
 *   - ClientExtras → CursorBean: mousemove + 2 spring motion-loop, masaüstünde
 *     oyunun pointer akışıyla yarışır
 *   - ScrollManager / ScrollRoots / CosyMode / GutterSprout: scroll dinleyicileri,
 *     oyun native scroll KULLANMADIĞI için tamamen gereksiz
 *
 * Route group ile ayrı root layout kurmak "doğru" çözümdü ama canlı sitenin
 * TÜM sayfalarını (site) grubuna taşımayı gerektiriyor — yüksek riskli refactor.
 * Bu, aynı runtime etkisini ~30 satırda ve mevcut sayfalara sıfır dokunuşla verir.
 *
 * grain-overlay CSS ile kapatılır (server-render edildiği için burada koşullanamaz):
 * `html[data-oyun="1"] .grain-overlay { display: none }`
 */

/** Global süs katmanlarının kapatılacağı rotalar */
const SADE_ROTALAR = ['/sosyal-obezite'];

export function sadeMi(pathname: string | null): boolean {
  if (!pathname) return false;
  return SADE_ROTALAR.some((r) => pathname === r || pathname.startsWith(`${r}/`));
}

/**
 * konum: mevcut layout'taki SIRAYI korumak için. Bazı katmanlar {children}
 * ÖNCESİNDE, bazıları sonrasındaydı; hepsini tek yere toplamak z-index
 * yığılmasını değiştirirdi.
 */
export default function SiteKatmanlari({ konum }: { konum: 'on' | 'arka' }) {
  const pathname = usePathname();
  const sade = sadeMi(pathname);

  // grain-overlay gibi server-render edilen CSS katmanları için işaret.
  // Yalnız 'on' örneği yazsın — iki örnek aynı attribute'u yarıştırmasın.
  useEffect(() => {
    if (konum !== 'on') return;
    const el = document.documentElement;
    if (sade) el.setAttribute('data-oyun', '1');
    else el.removeAttribute('data-oyun');
    return () => el.removeAttribute('data-oyun');
  }, [sade, konum]);

  if (sade) return null;

  if (konum === 'on') {
    return (
      <>
        <ScrollManager />
        <CosyMode />
        <ScrollRoots />
        <GutterSprout />
      </>
    );
  }
  return (
    <>
      <LiveTicker />
      <ClientExtras />
      <CookieConsent />
    </>
  );
}
