'use client';

import { useEffect, useState } from 'react';

// Ortalama "sonraki popüler Bean": bu Cumartesi 20:00 TSİ
function nextBeanDate(): Date {
  const now = new Date();
  const target = new Date(now);
  const daysUntilSat = (6 - now.getDay() + 7) % 7;
  target.setDate(now.getDate() + (daysUntilSat === 0 && now.getHours() >= 20 ? 7 : daysUntilSat));
  target.setHours(20, 0, 0, 0);
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 7);
  }
  return target;
}

export default function NextBeanCountdown() {
  const [ms, setMs] = useState<number | null>(null);

  useEffect(() => {
    const target = nextBeanDate();
    const tick = () => setMs(Math.max(0, target.getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (ms === null) return null;

  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);

  const parts = d > 0 ? [`${d}g`, `${h}sa`, `${m}dk`] : [`${h}sa`, `${m}dk`, `${s}sn`];

  return (
    <div className="inline-flex items-center gap-2.5 text-[11px] text-zinc-400 font-mono">
      <span className="text-zinc-500 uppercase tracking-wider">Sıradaki Bean</span>
      <span className="text-white tabular-nums flex items-center gap-1">
        {parts.map((p, i) => (
          <span key={i} className="inline-flex items-center">
            <span>{p}</span>
            {i < parts.length - 1 && <span className="mx-1 text-zinc-600">·</span>}
          </span>
        ))}
      </span>
      <span className="text-zinc-500">sonra başlıyor</span>
    </div>
  );
}
