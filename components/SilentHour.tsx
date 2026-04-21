'use client';

import BeanSprout from '@/components/BeanSprout';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const DURATION_SEC = 15 * 60;

export default function SilentHour() {
  const [active, setActive] = useState(false);
  const [remaining, setRemaining] = useState(DURATION_SEC);

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

  const mm = Math.floor(remaining / 60);
  const ss = (remaining % 60).toString().padStart(2, '0');

  return (
    <>
      {/* Toggle — her zaman sağ-alt köşede */}
      <button
        type="button"
        onClick={() => setActive((v) => !v)}
        aria-pressed={active}
        aria-label={active ? 'Sessiz saati kapat' : 'Sessiz saati başlat'}
        className={`fixed bottom-3 md:bottom-4 right-3 md:right-4 z-[45] flex items-center gap-2 rounded-full pl-2.5 pr-3.5 py-1.5 md:py-2 text-[10px] md:text-[11px] font-mono transition border ${
          active
            ? 'bg-acid text-midnight border-acid shadow-[0_0_30px_rgba(168,230,0,0.35)]'
            : 'bg-midnight/85 backdrop-blur-xl text-zinc-300 border-white/10 hover:border-acid/40 hover:text-white'
        }`}
      >
        <svg viewBox="0 0 20 20" className="w-3.5 h-3.5" fill="currentColor" aria-hidden>
          {active ? (
            <path d="M5 9.5 L5 10.5 L15 10.5 L15 9.5 Z" />
          ) : (
            <path d="M6 4 L6 16 L14 10 Z" />
          )}
        </svg>
        <span className="uppercase tracking-wider whitespace-nowrap">
          {active ? `Sessiz · ${mm}:${ss}` : '15 dk sessiz saat'}
        </span>
      </button>

      {/* Aktifken overlay + merkez filiz */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="silent-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[40] pointer-events-none"
          >
            <div className="absolute inset-0 bg-midnight/65 backdrop-blur-sm" />

            {/* Merkez filiz — yavaş nefes alır */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center pointer-events-auto">
                <motion.div
                  animate={{
                    scale: [1, 1.08, 1],
                    opacity: [0.85, 1, 0.85],
                  }}
                  transition={{
                    duration: 4.2,
                    repeat: Infinity,
                    ease: [0.45, 0, 0.55, 1],
                  }}
                >
                  <div className="relative">
                    <div className="absolute -inset-16 bg-acid/20 blur-3xl rounded-full" />
                    <div className="relative">
                      <BeanSprout size={120} />
                    </div>
                  </div>
                </motion.div>

                <div className="mt-10 text-center max-w-md px-6">
                  <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-acid mb-3">
                    Sessiz Saat · {mm}:{ss}
                  </div>
                  <p className="text-xl md:text-2xl font-bold text-white leading-tight mb-3">
                    Bir şey yapma.
                    <br />
                    <span className="text-zinc-400">Sadece etrafına bak.</span>
                  </p>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Tarayıcıyı kapatabilirsin. İstediğinde döner, bıraktığın yerden başlarsın.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
