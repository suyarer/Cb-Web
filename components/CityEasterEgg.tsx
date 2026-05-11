'use client';

import { AnimatePresence, motion } from '@/lib/motion';
import { useEffect, useState } from 'react';

const CITIES: { key: string; label: string }[] = [
  { key: 'moda', label: 'Moda' },
  { key: 'kadikoy', label: 'Kadıköy' },
  { key: 'kadıköy', label: 'Kadıköy' },
  { key: 'cihangir', label: 'Cihangir' },
  { key: 'beyoglu', label: 'Beyoğlu' },
  { key: 'beyoğlu', label: 'Beyoğlu' },
  { key: 'besiktas', label: 'Beşiktaş' },
  { key: 'beşiktaş', label: 'Beşiktaş' },
  { key: 'bebek', label: 'Bebek' },
  { key: 'ankara', label: 'Ankara' },
  { key: 'izmir', label: 'İzmir' },
  { key: 'alsancak', label: 'Alsancak' },
  { key: 'karakoy', label: 'Karaköy' },
  { key: 'karaköy', label: 'Karaköy' },
];

// Türkçe karakterleri ve boşlukları normalize et
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');
}

const MATCHES = CITIES.map((c) => ({ norm: normalize(c.key), label: c.label }));

export default function CityEasterEgg() {
  const [city, setCity] = useState<string | null>(null);

  useEffect(() => {
    let buffer = '';

    const onKey = (e: KeyboardEvent) => {
      // Input alanlarında ignore
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === 'INPUT' ||
          t.tagName === 'TEXTAREA' ||
          (t as HTMLElement).isContentEditable)
      ) {
        return;
      }

      // Yalnızca alfanümerik tek karakterleri ekle
      if (e.key.length !== 1) return;
      buffer = (buffer + e.key).slice(-20);

      const nb = normalize(buffer);
      for (const m of MATCHES) {
        if (nb.endsWith(m.norm)) {
          setCity(m.label);
          buffer = '';
          return;
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!city) return;
    const id = setTimeout(() => setCity(null), 3800);
    return () => clearTimeout(id);
  }, [city]);

  return (
    <AnimatePresence>
      {city && (
        <motion.div
          key={`city-${city}`}
          initial={{ opacity: 0, y: 24, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.94 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[65] pointer-events-none"
          role="status"
          aria-live="polite"
        >
          <div className="relative">
            <div className="absolute -inset-10 bg-acid/25 blur-3xl rounded-full pointer-events-none" />
            <div className="relative bg-midnight/95 backdrop-blur-xl border border-acid/40 rounded-2xl px-6 md:px-8 py-5 md:py-6 shadow-[0_30px_80px_rgba(0,0,0,0.6)] text-center min-w-[240px]">
              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-acid mb-2">
                Gizli komut · şehir
              </div>
              <div className="text-2xl md:text-3xl font-black text-white tracking-tight mb-1">
                {city}
              </div>
              <div className="text-xs text-zinc-400 mt-2 max-w-xs">
                kaydedildi · lansmanda sana öncelik
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
