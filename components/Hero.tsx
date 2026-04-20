'use client';

import { easeOutExpo } from '@/lib/motion';
import { motion } from 'framer-motion';
import PhoneMockup from './PhoneMockup';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + i * 0.1, duration: 0.8, ease: easeOutExpo },
  }),
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 md:pt-48 pb-20 md:pb-32">
      {/* Background glow */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      {/* Subtle grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, black 40%, transparent 100%)',
        }}
      />

      <div className="container-x relative">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-center">
          {/* Left: Copy */}
          <div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 text-xs font-medium text-zinc-300 backdrop-blur"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-acid animate-glow-pulse" />
              2026 Q2 · Yakında App Store &amp; Google Play
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="text-hero font-bold tracking-tight leading-[0.95] mb-6"
            >
              Algoritma değil
              <br />
              <span className="text-gradient-acid">sen seç.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-lg md:text-xl text-zinc-400 max-w-xl leading-relaxed mb-10"
            >
              ClubBeans, etkinlik odaklı anti-platform topluluk uygulamasıdır.
              Yakınındaki <strong className="text-white">Bean</strong>&apos;leri keşfet,
              vibe&apos;ına uyan <strong className="text-white">tribe</strong>&apos;lara{' '}
              <strong className="text-acid">Jump In</strong> et.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <a
                href="#launch"
                className="group inline-flex items-center gap-2 bg-acid text-midnight font-semibold px-6 py-3.5 rounded-full text-sm no-underline hover:bg-acid-400 transition"
              >
                Lansman listesine katıl
                <span className="group-hover:translate-x-0.5 transition">→</span>
              </a>
              <a
                href="#manifesto"
                className="text-zinc-400 hover:text-white text-sm font-medium no-underline transition"
              >
                Manifesto →
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={4}
              className="mt-16 grid grid-cols-3 gap-6 max-w-md"
            >
              <Stat label="Bean süresi" value="4sa" />
              <Stat label="Vibe kategorisi" value="12+" />
              <Stat label="Algoritma" value="0" accent />
            </motion.div>
          </div>

          {/* Right: Phone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: -4 }}
            transition={{ duration: 1.2, delay: 0.4, ease: easeOutExpo }}
            className="relative flex justify-center lg:justify-end"
          >
            <PhoneMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className={`text-2xl md:text-3xl font-bold ${accent ? 'text-acid' : 'text-white'}`}>
        {value}
      </div>
      <div className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">{label}</div>
    </div>
  );
}
