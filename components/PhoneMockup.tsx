'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PhoneMockupProps {
  children?: ReactNode;
  className?: string;
  floating?: boolean;
}

/**
 * Placeholder iPhone mockup — gerçek screenshot gelene kadar stylized fake UI render eder.
 * Dynamic Island, notch, realistic bezel, glass reflection.
 */
export default function PhoneMockup({ children, className = '', floating = true }: PhoneMockupProps) {
  const Wrapper = floating ? motion.div : 'div';
  const motionProps = floating
    ? {
        animate: { y: [0, -12, 0] },
        transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' as const },
      }
    : {};

  return (
    <Wrapper
      {...motionProps}
      className={`relative w-[280px] md:w-[340px] aspect-[9/19.5] ${className}`}
    >
      {/* Glow */}
      <div className="absolute -inset-20 bg-acid/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Phone body */}
      <div className="relative w-full h-full rounded-[3rem] bg-gradient-to-br from-zinc-800 to-zinc-950 p-[3px] shadow-2xl shadow-black/50">
        <div className="w-full h-full rounded-[2.85rem] bg-black overflow-hidden relative">
          {/* Dynamic Island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-20" />

          {/* Screen content */}
          <div className="absolute inset-0 pt-8">
            {children ?? <DefaultAppPreview />}
          </div>

          {/* Glass reflection overlay */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.03) 100%)',
            }}
          />
        </div>
      </div>
    </Wrapper>
  );
}

function DefaultAppPreview() {
  return (
    <div className="h-full bg-midnight text-white px-4 py-4 overflow-hidden relative">
      {/* Status bar */}
      <div className="flex justify-between text-[10px] text-white/60 px-2 mb-4">
        <span className="font-semibold">21:47</span>
        <span>●●● ●●</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <div className="text-xs text-zinc-500">Merhaba</div>
          <div className="text-base font-bold">Keşfet</div>
        </div>
        <div className="w-7 h-7 rounded-full bg-acid/20 border border-acid/40" />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-4 px-1 text-xs">
        <span className="text-white font-semibold border-b-2 border-acid pb-1">Sana Özel</span>
        <span className="text-zinc-500">Takip</span>
      </div>

      {/* Fake feed cards */}
      <div className="space-y-3">
        <FeedCard
          title="Kadıköy Vinyl Night"
          subtitle="Moda Sahnesi · 19 Nisan Cs"
          tag="🎵 Müzik"
          gradient="from-purple-500/20 to-pink-500/10"
        />
        <FeedCard
          title="Bağdat Caddesi Run Club"
          subtitle="Fenerbahçe Parkı · Pazar 08:00"
          tag="🏃 Spor"
          gradient="from-emerald-500/20 to-teal-500/10"
        />
        <FeedCard
          title="Startup Brunch #12"
          subtitle="Karaköy · 20 Nisan Cuma"
          tag="💼 Network"
          gradient="from-amber-500/20 to-orange-500/10"
        />
      </div>

      {/* Bottom nav */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/5 px-6 py-3 flex justify-around">
        {['🏠', '🔍', '📍', '🔔', '👤'].map((icon, i) => (
          <span key={icon} className={`text-lg ${i === 0 ? 'opacity-100' : 'opacity-30'}`}>
            {icon}
          </span>
        ))}
      </div>
    </div>
  );
}

function FeedCard({
  title,
  subtitle,
  tag,
  gradient,
}: {
  title: string;
  subtitle: string;
  tag: string;
  gradient: string;
}) {
  return (
    <div className={`bg-gradient-to-br ${gradient} border border-white/5 rounded-2xl p-3 backdrop-blur-sm`}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-[10px] bg-white/10 rounded-full px-2 py-0.5 text-white/80">{tag}</span>
        <span className="text-[10px] text-acid font-bold">%94 match</span>
      </div>
      <div className="text-sm font-bold text-white mb-1">{title}</div>
      <div className="text-[10px] text-zinc-400">{subtitle}</div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex -space-x-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-700 border-2 border-midnight"
            />
          ))}
        </div>
        <div className="text-[10px] bg-acid text-midnight font-bold px-2.5 py-1 rounded-full">
          Jump In
        </div>
      </div>
    </div>
  );
}
