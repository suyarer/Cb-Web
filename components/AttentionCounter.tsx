'use client';

import { useEffect, useState } from 'react';

// Ortalama kullanıcı bir feed'de saniyede ~0.28 post kaydırır (benchmark 2024).
const POSTS_PER_SECOND = 0.28;

export default function AttentionCounter() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      setSeconds(Math.floor((Date.now() - start) / 1000));
    }, 1000);

    const onVis = () => {
      if (document.hidden) {
        // kullanıcı sekme değişti — şimdi gerçekten Sosyal Obezite oluyor
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  const posts = Math.floor(seconds * POSTS_PER_SECOND);
  const min = Math.floor(seconds / 60);
  const s = seconds % 60;
  const timeLabel = min > 0 ? `${min} dk ${s} sn` : `${s} sn`;

  return (
    <div
      className="group inline-flex items-center gap-2 bg-white/[0.02] border border-white/[0.08] rounded-full pl-3 pr-4 py-2 text-[11px] text-zinc-400 backdrop-blur"
      role="status"
      aria-live="polite"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-acid flex-shrink-0" aria-hidden />
      <span className="leading-snug">
        Tek bir kullanıcı{' '}
        <span className="font-mono tabular-nums text-acid">{timeLabel}</span>{' '}
        sürede ortalama{' '}
        <span className="font-mono tabular-nums text-white">{posts}</span>{' '}
        gönderi kaydırdı
      </span>
    </div>
  );
}
