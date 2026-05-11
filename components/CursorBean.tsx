'use client';

import { motion, useMotionValue, useReducedMotion, useSpring } from '@/lib/motion';
import { useEffect, useState } from 'react';

// Masaüstü: imleci takip eden küçük bir Bean filiz.
// Sistem cursor'ı kaybolmuyor — bunun üstünde hafif bir trail.
// Tıklanabilir öğeler (a, button) üzerinde büyür.
// prefers-reduced-motion + mobil/touch device'lerde devre dışı.
export default function CursorBean() {
  const reduced = useReducedMotion() ?? false;
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 450, damping: 35, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 450, damping: 35, mass: 0.4 });

  useEffect(() => {
    if (reduced) return;
    if (typeof window === 'undefined') return;
    // Sadece hover destekli cihazlar (masaüstü)
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return setHovering(false);
      const interactive = t.closest('a, button, [role="button"], input, textarea, select, label');
      setHovering(!!interactive);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
    };
  }, [x, y, reduced]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 z-[70] pointer-events-none will-change-transform"
      style={{ x: sx, y: sy }}
    >
      {/* -translate yerine motion x/y kullanıyoruz; ortalama için inline transform */}
      <div
        className="relative"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        {/* Ambient glow */}
        <motion.div
          animate={{
            scale: hovering ? 1.8 : 1,
            opacity: hovering ? 0.6 : 0.35,
          }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 -m-3 bg-acid/30 blur-md rounded-full"
        />
        {/* Bean svg — hover'da büyür */}
        <motion.svg
          width="18"
          height="14"
          viewBox="0 0 28 20"
          animate={{ scale: hovering ? 1.45 : 1 }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          className="relative drop-shadow-[0_0_8px_rgba(168,230,0,0.7)]"
        >
          <defs>
            <linearGradient id="cursor-bean" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#CBEC4A" />
              <stop offset="60%" stopColor="#7ED848" />
              <stop offset="100%" stopColor="#3EA52A" />
            </linearGradient>
          </defs>
          <path
            d="M 2 10 C 2 16 6 18 14 18 C 22 18 26 16 26 10 C 26 7 24 5 20 5 L 8 5 C 4 5 2 7 2 10 Z"
            fill="url(#cursor-bean)"
          />
        </motion.svg>
      </div>
    </motion.div>
  );
}
