'use client';

import AnimatedCounter from '@/components/AnimatedCounter';
import AttentionCounter from '@/components/AttentionCounter';
import CompassSwitcher from '@/components/compass/CompassSwitcher';
import KineticHeadline from '@/components/KineticHeadline';
import NextBeanCountdown from '@/components/NextBeanCountdown';
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

            <KineticHeadline />

            <motion.p
              variants={variants}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-lg md:text-xl text-zinc-400 max-w-xl leading-relaxed mb-8"
            >
              ClubBeans bir uygulama değil, bir anti-platformdur. Diğer platformlar
              seni ekranda tutmak için algoritma yazar; biz seni sokağa çıkarmak için
              yazarız. <strong className="text-white">Sosyal Obezite</strong>&apos;ye karşı,
              kodla inşa edilmiş bir dalgakıran.
            </motion.p>

            <motion.div
              variants={variants}
              initial="hidden"
              animate="visible"
              custom={2.5}
              className="flex flex-wrap items-center gap-2 mb-10"
            >
              {[
                'Yakında Bul',
                'Birlikte Yap',
                'Kolay Kur',
              ].map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-white/[0.04] border border-white/10 rounded-full px-3 py-1.5"
                >
                  <span className="w-1 h-1 rounded-full bg-acid" />
                  {label}
                </span>
              ))}
            </motion.div>

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
              custom={3.5}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <AttentionCounter />
              <span className="hidden md:block w-px h-4 bg-white/10" />
              <NextBeanCountdown />
            </motion.div>

            <motion.div
              variants={variants}
              initial="hidden"
              animate="visible"
              custom={4}
              className="mt-10"
            >
              <CompassSwitcher />
            </motion.div>

            <motion.div
              variants={variants}
              initial="hidden"
              animate="visible"
              custom={4.5}
              className="mt-12 grid grid-cols-3 gap-6 max-w-md"
            >
              <Stat label="Bean süresi" value={4} suffix=" sa" />
              <Stat label="Dakika · Club kur" value={1} suffix=" dk" />
              <Stat label="Dikkat algoritması" value={0} accent />
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
