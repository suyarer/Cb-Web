'use client';

import BeanSprout from '@/components/BeanSprout';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

type Position = {
  side: 'left' | 'right';
  top: number; // vh
};

const MESSAGES = [
  'Merhaba. Sen bizi gördün. Biz de seni görüyoruz.',
  'Bu, tesadüf değil. Gerçek bir buluşma seni çağırıyor olabilir.',
  'Az rastlanır bir an. Cumartesine iyi yansır.',
];

// %12 şansla göster (her sayfa yüklemesinde), 30-90 sn sonra,
// rastgele kenar + rastgele dikey konum.
export default function SerendipityBean() {
  const reduced = useReducedMotion() ?? false;
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Position | null>(null);
  const [msg] = useState(() => MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (reduced) return;
    if (typeof window === 'undefined') return;

    // Her sayfa yüklemesinde %12 şans
    if (Math.random() > 0.12) return;

    // 30-90 saniye sonra belirir
    const delay = 30_000 + Math.random() * 60_000;

    const id = setTimeout(() => {
      setPos({
        side: Math.random() > 0.5 ? 'left' : 'right',
        top: 35 + Math.random() * 30, // %35-65 arası dikey
      });
      setOpen(true);
    }, delay);

    return () => clearTimeout(id);
  }, [reduced]);

  // Auto-dismiss 6 saniye sonra (hover'da reset)
  useEffect(() => {
    if (!open) return;
    if (hovered) return;
    const id = setTimeout(() => setOpen(false), 6000);
    return () => clearTimeout(id);
  }, [open, hovered]);

  if (reduced || !pos) return null;

  const side = pos.side === 'left' ? 'left-4 md:left-8' : 'right-4 md:right-8';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.92 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={`fixed ${side} z-[55] cursor-pointer select-none`}
          style={{ top: `${pos.top}vh` }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => setOpen(false)}
          role="status"
          aria-live="polite"
        >
          <div className="relative">
            {/* BeanSprout + ambient glow */}
            <div className="relative">
              <div className="absolute -inset-8 bg-acid/15 blur-3xl rounded-full pointer-events-none" />
              <div className="relative">
                <BeanSprout size={54} animated breathe />
              </div>
            </div>

            {/* Mesaj — sadece hover'da */}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.3 }}
                  className={`absolute ${pos.side === 'left' ? 'left-16' : 'right-16'} top-1/2 -translate-y-1/2 w-52 bg-midnight/95 backdrop-blur-xl border border-acid/30 rounded-2xl px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.6)]`}
                >
                  <div className="text-[10px] font-mono uppercase tracking-wider text-acid mb-1">
                    Serendipity
                  </div>
                  <div className="text-xs text-white leading-snug">{msg}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
