'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type Event = {
  city: string;
  action: string;
  seconds: number;
};

const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Moda', 'Kadıköy', 'Cihangir', 'Beyoğlu'];
const ACTIONS = [
  'yeni Bean açıldı',
  '3 kişi Bean\'e katıldı',
  'yeni Club kuruldu',
  'Koşu Kulübü\'ne 2 üye',
  'Pazartesi Bean\'i doldu',
  'Pitch Night yayınlandı',
  'Film Kulübü masası açıldı',
  'Brunch Bean\'i planlandı',
  'Kitap Kulübü toplandı',
];

function randomEvent(): Event {
  return {
    city: CITIES[Math.floor(Math.random() * CITIES.length)],
    action: ACTIONS[Math.floor(Math.random() * ACTIONS.length)],
    seconds: 3 + Math.floor(Math.random() * 45), // 3-48 saniye önce
  };
}

export default function KabileLivePulse() {
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    setEvent(randomEvent());
    const id = setInterval(() => setEvent(randomEvent()), 5500);
    return () => clearInterval(id);
  }, []);

  if (!event) return null;

  const key = `${event.city}-${event.action}-${event.seconds}`;

  return (
    <div className="inline-flex items-center gap-3 bg-white/[0.02] border border-white/[0.08] rounded-full pl-3 pr-4 py-2 backdrop-blur overflow-hidden max-w-full">
      <span className="inline-flex items-center gap-1.5 text-[10.5px] font-mono text-acid flex-shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-acid brand-pulse" />
        CANLI
      </span>
      <span className="w-px h-3 bg-white/10 flex-shrink-0" />
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="text-[11px] text-zinc-400 min-w-0 flex items-center gap-1.5"
        >
          <span className="text-zinc-500 tabular-nums">{event.seconds} sn önce</span>
          <span className="text-zinc-700">·</span>
          <span className="text-white font-semibold truncate">{event.city}</span>
          <span className="text-zinc-700">·</span>
          <span className="truncate">{event.action}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
