'use client';

import { motion } from 'framer-motion';

const items = [
  { label: 'popup' },
  { label: 'cookie banner' },
  { label: 'tracker' },
  { label: 'spam' },
  { label: 'abonelik' },
  { label: 'paywall' },
];

export default function AntiTrackerBadge({ inline = false }: { inline?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={
        inline
          ? 'inline-flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] md:text-xs font-mono'
          : 'flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[11px] md:text-xs font-mono py-6 border-y border-white/[0.06]'
      }
      role="note"
      aria-label="ClubBeans'in yapmadıkları"
    >
      <span className="inline-flex items-center gap-2 text-zinc-500">
        <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 text-acid" fill="currentColor">
          <path d="M10 2 C 10 6 6 6 6 10 C 6 14 10 14 10 18 C 10 14 14 14 14 10 C 14 6 10 6 10 2 Z" />
        </svg>
        <span className="uppercase tracking-[0.2em]">Bu sayfada yok</span>
      </span>

      {items.map((it) => (
        <span
          key={it.label}
          className="inline-flex items-center gap-1.5 text-zinc-400 bg-white/[0.02] border border-white/[0.06] rounded-full px-2.5 py-1"
        >
          <span className="text-acid font-bold">0</span>
          <span className="lowercase">{it.label}</span>
        </span>
      ))}

      <span className="text-zinc-600 italic">· sözümüzü tutuyoruz</span>
    </motion.div>
  );
}
