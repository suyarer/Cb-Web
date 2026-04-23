'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Mobil'de sayfa scroll edildikten sonra alt kenarda beliren sticky CTA.
// - Ana sayfada: Launch görünürse gizlenir (orada form var).
// - Alt sayfada: her zaman scroll sonrası görünür; /#launch'a yönlendirir.
export default function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const [onHome, setOnHome] = useState(false);

  useEffect(() => {
    // Ana sayfada mı kontrol et
    if (typeof window !== 'undefined') {
      setOnHome(window.location.pathname === '/' || window.location.pathname === '');
    }

    const onScroll = () => {
      const y = window.scrollY;
      const viewportH = window.innerHeight;
      const showAfter = viewportH * 1.0;

      // Ana sayfadaysak Launch görünürlüğünü de kontrol et
      if (onHome) {
        const launchEl = document.getElementById('launch');
        if (launchEl) {
          const rect = launchEl.getBoundingClientRect();
          if (rect.top < viewportH * 0.9) {
            setVisible(false);
            return;
          }
        }
      }

      setVisible(y > showAfter);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onHome]);

  const href = onHome ? '#launch' : '/#launch';

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={href}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed md:hidden bottom-0 inset-x-0 z-[44] pointer-events-auto no-underline"
        >
          <div className="mx-3 mb-3 bg-acid text-midnight rounded-full shadow-[0_20px_60px_rgba(168,230,0,0.35)] flex items-center justify-between px-5 py-3.5 min-h-[48px]">
            <span className="text-sm font-bold">Lansman listesine katıl</span>
            <span className="text-sm font-bold">→</span>
          </div>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
