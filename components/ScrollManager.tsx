'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Scroll restoration + cross-page hash navigation.
 *
 * Sorunlar:
 * 1) Sayfa yenilendiğinde tarayıcı eski scroll pozisyonunu restore ediyor →
 *    hikaye akışı (hero → blocks → trust → kurucu notu) bağlamı bozuluyor.
 * 2) Navbar "Lansman listesi" butonu farklı sayfadaysa hash navigation 1.
 *    tıklamada işlemiyor (hash mount sonrası kaybediliyor).
 *
 * Çözüm:
 * - history.scrollRestoration = 'manual' (tarayıcı default restore'u kapat)
 * - Mount sırasında scrollTo(0,0)
 * - sessionStorage 'scrollToLaunch' flag varsa ana sayfaya gelir gelmez
 *   #launch'a smooth scroll yap (Nav.tsx handleLaunchClick ile uyumlu)
 *
 * @governing_law clubbeans-ux-v1
 */
export default function ScrollManager() {
  const pathname = usePathname();

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    // Cross-page launch jump: Nav.tsx sessionStorage flag bırakır,
    // burada ana sayfaya gelince yakalayıp scroll yaparız.
    if (typeof window === 'undefined') return;
    const shouldJumpToLaunch =
      pathname === '/' && sessionStorage.getItem('scrollToLaunch') === '1';

    if (shouldJumpToLaunch) {
      sessionStorage.removeItem('scrollToLaunch');
      // Mount + render bekle, sonra scroll (300ms = motion delay'lerden sonra)
      const id = window.setTimeout(() => {
        document
          .getElementById('launch')
          ?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
      return () => window.clearTimeout(id);
    }

    // Default: her pathname değişiminde + ilk mount'ta başa atla
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
