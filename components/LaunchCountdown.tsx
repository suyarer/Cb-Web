'use client';

import { motion } from '@/lib/motion';
import { useEffect, useState } from 'react';

/**
 * Launch countdown — sade, brand-aligned urgency.
 *
 * Önceki versiyondaki "Live subscriber count + progress bar"
 * KALDIRILDI çünkü:
 * - Düşük sayı (25 / 1.000 = %2.5) ters bandwagon effect tetikliyordu
 * - Anti-platform DNA "kalabalık göster" mantığına karşı
 * - Sayı sosyal kanıt değil, sosyal yetmezlik sinyaliydi
 *
 * Sade çözüm: sadece countdown timer.
 * - Deadline ≠ FOMO manipülasyonu (sayı yok)
 * - Daima çalışır (kayıt sayısından bağımsız)
 * - Premium ton: minimalist, monospace, sessiz urgency
 *
 * @governing_law clubbeans-privacy-v1
 */

// Lansman: 29 Mayıs 2026 Cuma 09:00 İstanbul saati
const LAUNCH_DATE = new Date('2026-05-29T09:00:00+03:00');

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

export default function LaunchCountdown() {
  const [countdown, setCountdown] = useState(() => getCountdown());

  useEffect(() => {
    // Her dakika güncelle (saat geçişlerini yakala)
    const id = setInterval(() => setCountdown(getCountdown()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="mt-4 max-w-md"
      role="status"
      aria-live="polite"
    >
      {countdown.expired ? (
        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em]">
          <span className="w-1.5 h-1.5 rounded-full bg-acid brand-pulse" aria-hidden />
          <span className="text-acid font-semibold">LANSMAN AKTİF</span>
          <span className="text-zinc-500">· şimdi indir</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500">
          <span className="w-1.5 h-1.5 rounded-full bg-acid brand-pulse" aria-hidden />
          <span>Lansmana</span>
          <span className="text-white tabular-nums">
            {countdown.days}g {countdown.hours}sa
          </span>
          <span className="text-zinc-700">·</span>
          <span>29 May 09:00</span>
        </div>
      )}
    </motion.div>
  );
}
