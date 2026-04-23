'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const CITIES = ['Kadıköy', 'Beşiktaş', 'Cihangir', 'Beyoğlu', 'Moda', 'Karaköy'];

function istanbulNow(): Date {
  const now = new Date();
  // UTC+3 (TSİ)
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 3 * 3600000);
}

function sunsetMinutesLeft(): number {
  // Kabaca İstanbul Nisan — 19:45
  const now = istanbulNow();
  const sunset = new Date(now);
  sunset.setHours(19, 45, 0, 0);
  const diff = Math.floor((sunset.getTime() - now.getTime()) / 60000);
  return diff;
}

function formatTime(d: Date) {
  return `${d.getHours().toString().padStart(2, '0')}:${d
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
}

export default function LiveTicker() {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date>(istanbulNow());
  const [activeBeans, setActiveBeans] = useState(0);
  const [city, setCity] = useState(CITIES[0]);

  useEffect(() => {
    setMounted(true);
    setActiveBeans(3 + Math.floor(Math.random() * 6));
    setCity(CITIES[Math.floor(Math.random() * CITIES.length)]);
    const id = setInterval(() => setNow(istanbulNow()), 30000);
    const rotate = setInterval(() => {
      setActiveBeans((n) => Math.max(1, n + (Math.random() > 0.5 ? 1 : -1)));
      setCity(CITIES[Math.floor(Math.random() * CITIES.length)]);
    }, 9000);
    return () => {
      clearInterval(id);
      clearInterval(rotate);
    };
  }, []);

  if (!mounted) return null;

  const minsLeft = sunsetMinutesLeft();
  const sunLabel =
    minsLeft > 0
      ? `Güneşe ${Math.floor(minsLeft / 60)}sa ${minsLeft % 60}dk`
      : `Güneş battı`;

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-3 md:bottom-4 left-3 md:left-4 z-30 flex items-center gap-2 md:gap-3 bg-midnight/85 backdrop-blur-xl border border-white/10 rounded-full pl-2.5 md:pl-3 pr-3 md:pr-4 py-1.5 md:py-2 text-[10px] md:text-[11px] font-mono max-w-[calc(100vw-1.5rem)]"
      role="status"
      aria-label="İstanbul canlı durum"
    >
      <span className="flex items-center gap-1.5 text-acid flex-shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-acid brand-pulse" />
        Şimdi
      </span>
      <span className="w-px h-3 bg-white/10 flex-shrink-0" />
      <span className="text-white tabular-nums flex-shrink-0">{formatTime(now)}</span>
      <span className="w-px h-3 bg-white/10 flex-shrink-0" />
      <span className="text-zinc-400 truncate">
        {city}&apos;de <span className="text-white">{activeBeans}</span> etkinlik
      </span>
      {/* Güneş bilgisi sadece md+ ekranlarda — mobile'da yer yok */}
      <span className="w-px h-3 bg-white/10 flex-shrink-0 hidden md:inline-block" />
      <span className="text-zinc-500 hidden md:inline flex-shrink-0">{sunLabel}</span>
    </motion.div>
  );
}
