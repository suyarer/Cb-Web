'use client';

import { motion, useReducedMotion } from 'framer-motion';

const CLUBS = [
  { name: 'Moda Yoga Kulübü', kabile: 47, when: 'Pazar 09:00', vibe: '🧘' },
  { name: 'AI Girişimcileri İstanbul', kabile: 247, when: 'Cumartesi 20:00', vibe: '🎯' },
  { name: 'Kadıköy Vinyl Night', kabile: 89, when: 'Cuma 21:00', vibe: '🎵' },
  { name: 'Cihangir Kitap Club', kabile: 34, when: 'Çarşamba akşamı', vibe: '📚' },
  { name: 'Fenerbahçe Koşu', kabile: 112, when: 'Sabah 07:00', vibe: '🏃' },
  { name: 'Beyoğlu Film Kulübü', kabile: 156, when: 'Perşembe 20:30', vibe: '🎞' },
  { name: 'Bebek Brunch', kabile: 68, when: 'Pazar 11:00', vibe: '☕' },
  { name: 'Ankara Startup Pitch', kabile: 201, when: 'Salı 19:00', vibe: '💼' },
];

export default function KabileTicker() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      id="kabile-ticker"
      aria-label="ClubBeans örnek kabile topluluklarından seçmeler"
      className="relative py-14 md:py-16 overflow-hidden border-y border-white/[0.04] bg-elevated/30"
    >
      <div className="container-x mb-8">
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-acid mb-2 font-mono">
              Lansmana hazır kulüpler
            </div>
            <div className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Cumartesilere şehrin kulüpleri hazırlanıyor.
            </div>
          </div>
          <div className="text-xs text-zinc-500 font-mono">Örnektir · lansmandaki kulüpler farklı olabilir</div>
        </div>
      </div>

      {/* Üst satır — soldan sağa */}
      <TickerRow items={CLUBS} direction="ltr" duration={reduced ? 0 : 42} />

      {/* Alt satır — sağdan sola (ters) — offset ile farklı kulüp başlar */}
      <div className="mt-4">
        <TickerRow
          items={[...CLUBS.slice(4), ...CLUBS.slice(0, 4)]}
          direction="rtl"
          duration={reduced ? 0 : 48}
        />
      </div>
    </section>
  );
}

function TickerRow({
  items,
  direction,
  duration,
}: {
  items: typeof CLUBS;
  direction: 'ltr' | 'rtl';
  duration: number;
}) {
  // 2x ile seamless loop — animate 0 → -50%
  const doubled = [...items, ...items];

  return (
    <div className="relative flex overflow-hidden">
      {/* Soft gradient kenarlar — ticker fade in/out */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-midnight to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-midnight to-transparent z-10" />

      <motion.div
        animate={
          duration === 0
            ? undefined
            : {
                x: direction === 'ltr' ? ['0%', '-50%'] : ['-50%', '0%'],
              }
        }
        transition={
          duration === 0
            ? undefined
            : {
                duration,
                ease: 'linear',
                repeat: Infinity,
              }
        }
        className="flex gap-3 pr-3 flex-shrink-0 whitespace-nowrap"
      >
        {doubled.map((c, i) => (
          <ClubChip key={`${c.name}-${i}`} {...c} />
        ))}
      </motion.div>
    </div>
  );
}

function ClubChip({
  name,
  kabile,
  when,
  vibe,
}: {
  name: string;
  kabile: number;
  when: string;
  vibe: string;
}) {
  return (
    <div className="inline-flex items-center gap-3 bg-white/[0.02] border border-white/[0.08] rounded-full pl-3 pr-4 py-2.5 flex-shrink-0 hover:border-acid/30 transition">
      <span className="w-7 h-7 rounded-full bg-midnight border border-white/10 flex items-center justify-center text-sm flex-shrink-0">
        {vibe}
      </span>
      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold text-white">{name}</span>
        <span className="text-zinc-600">·</span>
        <span className="text-acid font-mono tabular-nums text-[11px]">{kabile} kabile</span>
        <span className="text-zinc-600">·</span>
        <span className="text-zinc-500 text-[11px]">{when}</span>
      </div>
    </div>
  );
}
