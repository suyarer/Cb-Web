'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useCompass } from './CompassContext';

export default function CompassTint() {
  const { color, mode } = useCompass();
  const firstRender = useRef(true);
  const [badgeOpen, setBadgeOpen] = useState(false);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setBadgeOpen(true);
    const id = setTimeout(() => setBadgeOpen(false), 2600);
    return () => clearTimeout(id);
  }, [mode]);

  return (
    <>
      {/* Katman 1 — üst-orta ana glow (kalıcı, yavaş hareket) */}
      <motion.div
        aria-hidden
        animate={{
          background: `radial-gradient(ellipse 65% 45% at 50% 0%, rgba(${color.glow}, 0.26), transparent 72%)`,
        }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 pointer-events-none z-[1] mix-blend-screen"
      />

      {/* Katman 2 — sol-alt blob */}
      <motion.div
        aria-hidden
        animate={{
          background: `radial-gradient(ellipse 55% 55% at 15% 100%, rgba(${color.glow}, 0.18), transparent 65%)`,
        }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 pointer-events-none z-[1] mix-blend-screen"
      />

      {/* Katman 3 — sağ-orta blob */}
      <motion.div
        aria-hidden
        animate={{
          background: `radial-gradient(ellipse 40% 50% at 92% 55%, rgba(${color.glow}, 0.14), transparent 60%)`,
        }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 pointer-events-none z-[1] mix-blend-screen"
      />

      {/* Wash — mod değiştiğinde tek seferlik ekran dalgası */}
      <AnimatePresence>
        <motion.div
          aria-hidden
          key={`wash-${mode}`}
          initial={{ opacity: 0.45, scale: 0.9 }}
          animate={{ opacity: 0, scale: 1.15 }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 pointer-events-none z-[2]"
          style={{
            background: `radial-gradient(ellipse 50% 50% at 50% 50%, rgba(${color.glow}, 0.22), transparent 70%)`,
          }}
        />
      </AnimatePresence>

      {/* İnce vignette — her modda tona göre */}
      <motion.div
        aria-hidden
        animate={{
          boxShadow: `inset 0 0 260px 40px rgba(${color.glow}, 0.08)`,
        }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 pointer-events-none z-[1]"
      />

      {/* Mod badge — sadece kullanıcı değiştirdiğinde */}
      <AnimatePresence>
        {badgeOpen && (
          <motion.div
            key={`badge-${mode}`}
            initial={{ opacity: 0, y: -16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-20 md:top-24 left-1/2 -translate-x-1/2 z-[60] pointer-events-none"
            role="status"
            aria-live="polite"
          >
            <div
              className="bg-midnight/90 backdrop-blur-xl border rounded-full pl-3 pr-4 py-1.5 flex items-center gap-2.5 shadow-[0_10px_40px_rgba(0,0,0,0.4)]"
              style={{
                borderColor: `${color.accent}55`,
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: color.accent }}
              />
              <span className="text-[11px] font-mono">
                <span className="font-bold" style={{ color: color.accent }}>
                  {color.label}
                </span>{' '}
                <span className="text-zinc-400">modu · {color.hint}</span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
