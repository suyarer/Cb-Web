'use client';

import { motion } from '@/lib/motion';
import { useEffect, useState } from 'react';

/**
 * Live subscriber counter + countdown timer.
 *
 * Davranış paneli kararı (Mira CRO):
 * "Promise-value uçurumu kapanmalı. Somut sayı + kıt kaynak + deadline
 *  klasik FOMO mechanic. Anti-platform DNA bozulmadan uygulanabilir."
 *
 * 3 element:
 * 1. Live abone sayısı (sosyal kanıt)
 * 2. Kalan kontenjan (scarcity)
 * 3. Lansmana geri sayım (deadline urgency)
 *
 * @governing_law clubbeans-privacy-v1
 */

// Lansman: 29 Mayıs 2026 Cuma 09:00 İstanbul saati
const LAUNCH_DATE = new Date('2026-05-29T09:00:00+03:00');
const TARGET = 1000;

function getCountdown(): { days: number; hours: number; expired: boolean } {
  const now = new Date();
  const diff = LAUNCH_DATE.getTime() - now.getTime();
  if (diff <= 0) {
    return { days: 0, hours: 0, expired: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return { days, hours, expired: false };
}

export default function LiveCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(() => getCountdown());

  useEffect(() => {
    // Abone sayısını çek — apex/www uyumu için absolute URL
    const apiUrl =
      typeof window !== 'undefined' && window.location.hostname === 'clubbeans.com'
        ? 'https://www.clubbeans.com/api/subscriber-count'
        : '/api/subscriber-count';

    fetch(apiUrl)
      .then((r) => r.json())
      .then((d: { count?: number }) => setCount(d.count ?? 0))
      .catch(() => setCount(null));

    // Countdown her dakika güncelle
    const id = setInterval(() => setCountdown(getCountdown()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Veri gelmezse render etme (silent fail, layout kırılmaz)
  if (count === null) return null;

  const remaining = Math.max(0, TARGET - count);
  const filled = Math.min(100, Math.round((count / TARGET) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="mt-4 max-w-md"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-baseline justify-between gap-3 text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500 mb-2">
        <span>
          <span className="text-acid tabular-nums">{count}</span>
          <span> · 1.000 Bean</span>
        </span>
        {!countdown.expired && (
          <span className="text-zinc-400">
            Lansmana <span className="text-white tabular-nums">{countdown.days}g {countdown.hours}sa</span>
          </span>
        )}
        {countdown.expired && (
          <span className="text-acid font-semibold">LANSMAN AKTİF</span>
        )}
      </div>
      {/* Progress bar — görsel scarcity */}
      <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-acid"
          initial={{ width: 0 }}
          animate={{ width: `${filled}%` }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <p className="mt-2 text-[10.5px] text-zinc-600 pl-0.5 font-mono">
        {remaining > 0 ? (
          <>
            <span className="text-acid">{remaining}</span> yer kaldı · ilk 1.000&apos;e öncelikli IRL davetiyesi
          </>
        ) : (
          <>1.000 Bean kontenjanı doldu — bekleme listesi başladı</>
        )}
      </p>
    </motion.div>
  );
}
