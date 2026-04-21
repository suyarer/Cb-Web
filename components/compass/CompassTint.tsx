'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useCompass } from './CompassContext';

export default function CompassTint() {
  const { color, mode } = useCompass();
  const firstRender = useRef(true);
  const [badgeOpen, setBadgeOpen] = useState(false);
  const [washKey, setWashKey] = useState(0);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setBadgeOpen(true);
    setWashKey((k) => k + 1);
    const id = setTimeout(() => setBadgeOpen(false), 2600);
    return () => clearTimeout(id);
  }, [mode]);

  return (
    <>
      {/* Katman 1 — ana üst-orta glow (tüm cihazlar) */}
      <motion.div
        aria-hidden
        animate={{
          background: `radial-gradient(ellipse 70% 45% at 50% 0%, rgba(${color.glow}, 0.26), transparent 72%)`,
        }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 pointer-events-none z-[1] mix-blend-screen"
      />

      {/* Katman 2 — sol-alt blob (sadece md+) */}
      <motion.div
        aria-hidden
        animate={{
          background: `radial-gradient(ellipse 55% 55% at 15% 100%, rgba(${color.glow}, 0.18), transparent 65%)`,
        }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        className="hidden md:block fixed inset-0 pointer-events-none z-[1] mix-blend-screen"
      />

      {/* Katman 3 — sağ-orta blob (sadece md+) */}
      <motion.div
        aria-hidden
        animate={{
          background: `radial-gradient(ellipse 40% 50% at 92% 55%, rgba(${color.glow}, 0.14), transparent 60%)`,
        }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        className="hidden md:block fixed inset-0 pointer-events-none z-[1] mix-blend-screen"
      />

      {/* Wash — mod değiştiğinde tek seferlik ekran dalgası (reduced-motion'da pas) */}
      {!reduced && washKey > 0 && (
        <motion.div
          key={washKey}
          aria-hidden
          initial={{ opacity: 0.45 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 pointer-events-none z-[2]"
          style={{
            background: `radial-gradient(ellipse 60% 55% at 50% 40%, rgba(${color.glow}, 0.22), transparent 70%)`,
          }}
        />
      )}

      {/* Mod badge — kullanıcı değiştirdiğinde */}
      <AnimatePresence mode="wait">
        {badgeOpen && (
          <motion.div
            key={`badge-${mode}`}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-20 md:top-24 left-1/2 -translate-x-1/2 z-[60] pointer-events-none max-w-[92vw]"
            role="status"
            aria-live="polite"
          >
            <div
              className="bg-midnight/90 backdrop-blur-xl border rounded-full pl-3 pr-4 py-1.5 flex items-center gap-2.5 shadow-[0_10px_40px_rgba(0,0,0,0.4)] whitespace-nowrap"
              style={{ borderColor: `${color.accent}55` }}
            >
              <span
                className="w-2 h-2 rounded-full brand-pulse flex-shrink-0"
                style={{ backgroundColor: color.accent }}
              />
              <span className="text-[10.5px] md:text-[11px] font-mono">
                <span className="font-bold" style={{ color: color.accent }}>
                  {color.label}
                </span>{' '}
                <span className="text-zinc-400">· {color.hint}</span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
