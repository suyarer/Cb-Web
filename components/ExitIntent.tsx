'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const MESSAGES = [
  'Git. Zaten gitmeni istiyoruz — ama önce telefonu yan tarafa koy.',
  'Sekmeyi kapat, dışarı çık. Biz bunun için yazıyoruz.',
  'Aferin. Doğru şey, bu sayfayı kapatmak.',
  'Durma, çık. Bir yerde seninle oturmak isteyen biri var.',
  'Kapat. Bir Bean bundan daha iyi açıklar bizi.',
];

const STORAGE_KEY = 'cb_exit_intent_shown';

export default function ExitIntent() {
  const [open, setOpen] = useState(false);
  const [msg] = useState(() => MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 8 && e.relatedTarget === null) {
        setOpen(true);
        sessionStorage.setItem(STORAGE_KEY, '1');
      }
    };
    // Sadece masaüstü
    if (window.matchMedia('(hover: hover)').matches) {
      document.addEventListener('mouseleave', onLeave);
      return () => document.removeEventListener('mouseleave', onLeave);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => setOpen(false), 6000);
    return () => clearTimeout(id);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 inset-x-0 z-[60] bg-acid text-midnight"
          role="status"
          aria-live="polite"
        >
          <div className="container-x py-3 flex items-center gap-4 justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider bg-midnight/15 px-2 py-0.5 rounded-full flex-shrink-0">
                Ters davet
              </span>
              <span className="text-sm md:text-base font-semibold truncate">{msg}</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Kapat"
              className="w-7 h-7 rounded-full bg-midnight/15 hover:bg-midnight/25 flex items-center justify-center text-midnight flex-shrink-0"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
