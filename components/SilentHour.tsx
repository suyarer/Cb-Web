'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

const DURATION_SEC = 15 * 60;

export default function SilentHour() {
  const reduced = useReducedMotion() ?? false;
  const [active, setActive] = useState(false);
  const [remaining, setRemaining] = useState(DURATION_SEC);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!active) return;
    setRemaining(DURATION_SEC);
    document.documentElement.classList.add('silent-hour-on');

    const id = setInterval(() => {
      setRemaining((s) => {
        if (s <= 1) {
          setActive(false);
          document.documentElement.classList.remove('silent-hour-on');
          return DURATION_SEC;
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      clearInterval(id);
      document.documentElement.classList.remove('silent-hour-on');
    };
  }, [active]);

  // ESC ile çık
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  const mm = Math.floor(remaining / 60)
    .toString()
    .padStart(2, '0');
  const ss = (remaining % 60).toString().padStart(2, '0');
  const progress = 1 - remaining / DURATION_SEC;
  const CIRCUMFERENCE = 2 * Math.PI * 16; // r=16
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <>
      {/* TOGGLE — 40×40 circle, GutterSprout filizinin solunda */}
      <div
        className="fixed bottom-[4.25rem] md:bottom-4 right-6 md:right-14 z-[45] flex items-center gap-2.5"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <AnimatePresence>
          {hovered && !active && (
            <motion.span
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 4 }}
              transition={{ duration: 0.25 }}
              className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 whitespace-nowrap pointer-events-none hidden md:inline"
            >
              15 dk ekrandan uzaklaş
            </motion.span>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setActive((v) => !v)}
          aria-pressed={active}
          aria-label={active ? 'Sessiz saati kapat' : '15 dakika sessiz saat başlat'}
          className="relative w-11 h-11 rounded-full flex items-center justify-center transition-colors bg-midnight/80 backdrop-blur-xl border border-white/10 hover:border-acid/40"
        >
          {/* Progress ring — sadece aktifken */}
          {active && (
            <svg
              viewBox="0 0 36 36"
              className="absolute inset-0 -rotate-90"
              aria-hidden
            >
              <circle
                cx="18"
                cy="18"
                r="16"
                stroke="rgba(168,230,0,0.15)"
                strokeWidth="1.5"
                fill="none"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                stroke="#A8E600"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
          )}

          {/* İkon — moon veya dot */}
          {active ? (
            <span
              className="w-1.5 h-1.5 rounded-full bg-acid relative"
              style={{
                animation: reduced ? undefined : 'silent-heartbeat 4s ease-in-out infinite',
              }}
            />
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 text-zinc-400"
              fill="currentColor"
              aria-hidden
            >
              {/* Minimalist moon */}
              <path d="M 17 12 C 17 15 14 18 10 18 C 13.5 17 15.5 14.5 15.5 11 C 15.5 8 13.5 5.5 10 4.5 C 14 4.5 17 7.5 17 12 Z" />
            </svg>
          )}
        </button>
      </div>

      {/* OVERLAY — breathing circle, minimalist */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="silent-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[40] bg-midnight/96 backdrop-blur-lg flex items-center justify-center cursor-pointer"
            onClick={() => setActive(false)}
            role="dialog"
            aria-label="Sessiz saat"
          >
            <div className="flex flex-col items-center select-none">
              {/* BREATHING CIRCLE — tek merkezi eleman */}
              <div className="relative w-40 h-40 md:w-52 md:h-52 mb-16 md:mb-20 flex items-center justify-center">
                {/* En dış sessiz halka */}
                <div className="absolute inset-0 rounded-full border border-white/[0.04]" />

                {/* Nefes dairesi — inhale/exhale döngüsü (4s-4s) */}
                {!reduced ? (
                  <motion.div
                    animate={{ scale: [0.65, 1, 0.65] }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: [0.45, 0, 0.55, 1],
                    }}
                    className="w-full h-full rounded-full bg-acid/[0.08] border border-acid/30"
                    style={{
                      boxShadow: '0 0 80px rgba(168,230,0,0.15)',
                    }}
                  />
                ) : (
                  <div className="w-3/4 h-3/4 rounded-full bg-acid/[0.08] border border-acid/30" />
                )}

                {/* Merkez nokta */}
                <div className="absolute w-1.5 h-1.5 rounded-full bg-acid" />
              </div>

              {/* SAYAÇ — büyük ama ince (font-light) */}
              <div className="text-4xl md:text-6xl font-light text-white tabular-nums tracking-[0.08em] mb-6">
                {mm}
                <span className="text-zinc-600 mx-0.5">:</span>
                {ss}
              </div>

              {/* TEK CÜMLE */}
              <div className="text-xs md:text-sm font-mono uppercase tracking-[0.3em] text-zinc-500">
                Nefes al.
              </div>

              {/* Kapanış ipucu — minimal alt bilgi */}
              <div className="mt-16 md:mt-20 text-[10px] font-mono text-zinc-500 tracking-wider">
                tıkla · veya · esc
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse keyframe — component-local */}
      <style jsx global>{`
        @keyframes silent-heartbeat {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.4);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes silent-heartbeat {
            0%, 100% { opacity: 1; transform: scale(1); }
          }
        }
      `}</style>
    </>
  );
}
