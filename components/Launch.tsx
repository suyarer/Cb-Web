'use client';

import SubscribeForm from '@/components/SubscribeForm';
import { easeOutExpo } from '@/lib/motion';
import { motion } from 'framer-motion';

export default function Launch() {
  return (
    <section id="launch" className="relative py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      <div className="container-x relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: easeOutExpo }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="text-xs uppercase tracking-[0.3em] text-acid mb-6 font-mono">
            2026 Q2 · Yolda
          </div>

          <h2 className="text-display font-bold tracking-tight mb-6">
            <span className="text-gradient-acid">Lansmanı</span>
            <br className="md:hidden" /> ilk sen öğren.
          </h2>

          <p className="text-lg text-zinc-400 max-w-xl mx-auto mb-10">
            Haftalık newsletter yok. Pazarlama e-postaları yok. Spam yok.
            Lansman günü tek mail, tek link, tek davet kodu. Gerisi senin
            akşamın.
          </p>

          <div className="flex justify-center mb-10">
            <SubscribeForm source="launch" />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <StoreBadge platform="apple" />
            <StoreBadge platform="google" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StoreBadge({ platform }: { platform: 'apple' | 'google' }) {
  const isApple = platform === 'apple';
  return (
    <a
      href="#launch"
      aria-label={`${isApple ? 'App Store' : 'Google Play'} · Mayıs 2026`}
      className="group relative inline-flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 no-underline hover:border-acid/30 transition-colors duration-300"
    >
      <div className="text-white">
        {isApple ? (
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
            <path d="M3.1 2.6c-.3.3-.4.7-.4 1.3v16.2c0 .6.1 1 .4 1.3l8.2-8.4L3.1 2.6zm15.5 8.8L14.8 9l-3.3 3.3 3.3 3.3 3.8-2.4c1-.5 1-1.6 0-2.1zm-4.6-2.5L4.8 2.3c-.3-.1-.7-.1-1-.1l8.8 8.8 1.4-1.1zm0 8.7L4.8 22c.3.1.7.1 1 0l9.2-8.8-1.4-1.1z" />
          </svg>
        )}
      </div>
      <div className="text-left">
        <div className="text-[10px] text-acid uppercase tracking-wider font-mono">
          Mayıs 2026
        </div>
        <div className="text-sm font-semibold text-white">
          {isApple ? 'App Store' : 'Google Play'}
        </div>
      </div>
    </a>
  );
}
