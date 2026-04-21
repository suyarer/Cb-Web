'use client';

import AttentionCounter from '@/components/AttentionCounter';
import BeanSprout from '@/components/BeanSprout';
import CompassSwitcher from '@/components/compass/CompassSwitcher';
import KabileLivePulse from '@/components/KabileLivePulse';
import KineticHeadline from '@/components/KineticHeadline';
import NextBeanCountdown from '@/components/NextBeanCountdown';
import { easeOutExpo, fadeUpVariant } from '@/lib/motion';
import { useTimeGreeting } from '@/lib/useTimeGreeting';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import PhoneMockup from './PhoneMockup';

export default function Hero() {
  const reduced = useReducedMotion() ?? false;
  const variants = fadeUpVariant(reduced);
  const sectionRef = useRef<HTMLElement>(null);
  const greeting = useTimeGreeting();

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
      className="relative overflow-hidden pt-28 md:pt-40 pb-16 md:pb-32"
    >
      {/* Arka plan — çoklu glow katmanı */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
      <div
        aria-hidden
        className="absolute left-1/2 -top-40 -translate-x-1/2 w-[min(720px,120vw)] h-[min(720px,120vw)] rounded-full opacity-40 blur-[80px] md:blur-[140px] pointer-events-none"
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
        {/* Pre-hero statement + filizlenen Bean */}
        <div className="mb-8 md:mb-16 flex flex-col-reverse sm:flex-row items-start sm:items-start justify-between gap-6 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOutExpo }}
            className="max-w-2xl w-full sm:w-auto"
          >
            <div className="flex items-center gap-3 text-[10.5px] md:text-xs font-mono uppercase tracking-[0.2em] md:tracking-[0.25em] text-zinc-500">
              <span className="w-6 md:w-8 h-px bg-zinc-700 flex-shrink-0" />
              <span className="flex items-center gap-2">
                {greeting ? (
                  <>
                    <span className="text-acid">{greeting.kicker}</span>
                    <span className="text-zinc-700">·</span>
                    <span>Bu bir pazarlama sayfası değil.</span>
                  </>
                ) : (
                  <span>Bu bir pazarlama sayfası değil.</span>
                )}
              </span>
            </div>
            <div className="mt-3 text-sm text-zinc-400 max-w-lg leading-relaxed">
              {greeting ? (
                <span dangerouslySetInnerHTML={{ __html: greeting.message }} />
              ) : (
                <>
                  Bir duyuru. Bir imza. Bir davet. &quot;Bu akşam ne yapsak?&quot;
                  sorusunun yanıtı, 12 kişinin okuyup geçtiği WhatsApp grubunda
                  değil — aşağıda.
                </>
              )}
            </div>
          </motion.div>

          {/* Filizlenen Bean — markanın metaforu, sayfaya girişte canlanır */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: easeOutExpo }}
            className="relative flex-shrink-0 self-start"
          >
            <div
              className="absolute -inset-6 sm:-inset-8 bg-acid/20 blur-3xl rounded-full pointer-events-none"
              aria-hidden
            />
            <div className="relative">
              <span className="block sm:hidden">
                <BeanSprout size={96} animated breathe />
              </span>
              <span className="hidden sm:block">
                <BeanSprout size={88} animated breathe />
              </span>
            </div>
            <div className="mt-2 text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] md:tracking-[0.25em] text-zinc-600 text-center whitespace-nowrap">
              Tohumdan <span className="text-zinc-700">·</span> Topluluğa
            </div>
          </motion.div>
        </div>

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
              <span className="w-1.5 h-1.5 rounded-full bg-acid brand-pulse" />
              2026 Q2 · Lansmandan önce ilk sen haber al
            </motion.div>

            <KineticHeadline />

            <motion.p
              variants={variants}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-lg md:text-xl text-zinc-400 max-w-xl leading-relaxed mb-8"
            >
              ClubBeans hem katılan hem kurucu için yazıldı. Yakınındaki
              Bean&apos;e katılırsın — ya da kendi Club&apos;ını bir dakikada
              açarsın. Masaya oturmak ve masayı kurmak arasındaki fark, artık
              tek dokunuş. Cumartesi akşamı artık senin.
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
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <AttentionCounter />
              <span className="hidden md:block w-px h-4 bg-white/10" />
              <NextBeanCountdown />
            </motion.div>

            <motion.div
              variants={variants}
              initial="hidden"
              animate="visible"
              custom={3.75}
              className="mt-4"
            >
              <KabileLivePulse />
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
              className="mt-12 grid sm:grid-cols-2 gap-3 max-w-lg"
            >
              <PersonaCard
                kicker="Bean'e otur"
                title="Keşfet, Katıl"
                meta="Yakında ne varsa, 3 dokunuş uzakta"
                href="#nasil-calisir"
              />
              <PersonaCard
                kicker="Masayı sen kur"
                title="Club aç, kabile büyüt"
                meta="Bir dakikada kulüp, bir ekranda yönetim"
                href="#club-kur"
              />
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

function PersonaCard({
  kicker,
  title,
  meta,
  href,
}: {
  kicker: string;
  title: string;
  meta: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group relative bg-white/[0.02] border border-white/10 hover:border-acid/40 hover:bg-acid/[0.04] rounded-2xl p-5 no-underline transition overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-acid/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />
      <div className="relative">
        <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-2">
          {kicker}
        </div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="text-base font-bold text-white group-hover:text-acid transition">
            {title}
          </div>
          <span className="text-zinc-600 group-hover:text-acid group-hover:translate-x-0.5 transition">
            →
          </span>
        </div>
        <div className="text-xs text-zinc-500">{meta}</div>
      </div>
    </a>
  );
}
