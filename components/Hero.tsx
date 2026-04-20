'use client';

import AnimatedCounter from '@/components/AnimatedCounter';
import { easeOutExpo, fadeUpVariant } from '@/lib/motion';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import PhoneMockup from './PhoneMockup';

export default function Hero() {
  const reduced = useReducedMotion() ?? false;
  const variants = fadeUpVariant(reduced);
  const sectionRef = useRef<HTMLElement>(null);

  // Mouse parallax (phone mockup)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const parallaxX = useSpring(useTransform(mouseX, [-1, 1], [-18, 18]), {
    stiffness: 60,
    damping: 20,
  });
  const parallaxY = useSpring(useTransform(mouseY, [-1, 1], [-18, 18]), {
    stiffness: 60,
    damping: 20,
  });
  const parallaxRotate = useSpring(useTransform(mouseX, [-1, 1], [-8, 0]), {
    stiffness: 60,
    damping: 20,
  });

  useEffect(() => {
    if (reduced) return;
    const el = sectionRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, [mouseX, mouseY, reduced]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden pt-32 md:pt-40 pb-20 md:pb-32"
    >
      {/* Arka plan — çoklu glow katmanı */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
      <div
        aria-hidden
        className="absolute left-1/2 -top-40 -translate-x-1/2 w-[720px] h-[720px] rounded-full opacity-40 blur-[140px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(168,230,0,0.35), transparent 60%)' }}
      />

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
          {/* Sol: Metin */}
          <div>
            <motion.div
              variants={variants}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 text-xs font-medium text-zinc-300 backdrop-blur"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-acid animate-glow-pulse" />
              2026 Q2 · Yakında App Store &amp; Google Play&apos;de
            </motion.div>

            <motion.h1
              variants={variants}
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
              variants={variants}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-lg md:text-xl text-zinc-400 max-w-xl leading-relaxed mb-10"
            >
              ClubBeans, etkinlik odaklı anti-platform topluluk uygulamasıdır.
              Yakınındaki <strong className="text-white">Bean</strong>&apos;leri keşfedersin,
              ruhuna uyan <strong className="text-white">tribe</strong>&apos;lara
              bir tık ile{' '}
              <strong className="text-acid">Jump In</strong> edersin.
            </motion.p>

            <motion.div
              variants={variants}
              initial="hidden"
              animate="visible"
              custom={3}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <a
                href="#launch"
                className="group inline-flex items-center gap-2 bg-acid text-midnight font-semibold px-6 py-3.5 rounded-full text-sm no-underline hover:bg-acid-400 transition hover:shadow-[0_0_40px_rgba(168,230,0,0.35)]"
              >
                Lansman listesine katıl
                <span className="group-hover:translate-x-0.5 transition">→</span>
              </a>
              <a
                href="#manifesto"
                className="text-zinc-400 hover:text-white text-sm font-medium no-underline transition"
              >
                Manifesto oku →
              </a>
            </motion.div>

            <motion.div
              variants={variants}
              initial="hidden"
              animate="visible"
              custom={4}
              className="mt-16 grid grid-cols-3 gap-6 max-w-md"
            >
              <Stat label="Bean süresi" value={4} suffix=" sa" />
              <Stat label="Vibe kategorisi" value={12} suffix="+" />
              <Stat label="Algoritma" value={0} accent />
            </motion.div>
          </div>

          {/* Sağ: Telefon (parallax) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: easeOutExpo }}
            style={{ x: parallaxX, y: parallaxY, rotate: parallaxRotate }}
            className="relative flex justify-center lg:justify-end will-change-transform"
          >
            <PhoneMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  suffix = '',
  accent = false,
}: {
  label: string;
  value: number;
  suffix?: string;
  accent?: boolean;
}) {
  return (
    <div>
      <div className={`text-2xl md:text-3xl font-bold ${accent ? 'text-acid' : 'text-white'}`}>
        <AnimatedCounter value={value} suffix={suffix} duration={1.8} />
      </div>
      <div className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">{label}</div>
    </div>
  );
}
