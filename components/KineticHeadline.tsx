'use client';

import { easeOutExpo } from '@/lib/motion';
import { motion, useReducedMotion } from '@/lib/motion';

const container = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const word = {
  hidden: { y: '120%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: { duration: 1, ease: easeOutExpo },
  },
};

export default function KineticHeadline() {
  const reduced = useReducedMotion() ?? false;

  if (reduced) {
    return (
      <h1 className="text-4xl sm:text-5xl md:text-hero font-bold tracking-tight leading-[0.95] mb-5 md:mb-6">
        {/* Marka adı h1'in İÇİNDE: Google OAuth marka doğrulaması ana başlıkta uygulama
            adını arıyor ("app name does not match the app name on your home page",
            2026-08-17 red gerekçesi). Slogan korunur. */}
        <span className="block text-sm sm:text-base md:text-lg font-semibold uppercase tracking-[0.18em] leading-none text-acid mb-3 md:mb-4">
          ClubBeans
        </span>
        Ekran süresi değil,
        <br />
        <span className="text-gradient-acid">yaşam süresi.</span>
      </h1>
    );
  }

  return (
    <motion.h1
      variants={container}
      initial="hidden"
      animate="visible"
      className="text-4xl sm:text-5xl md:text-hero font-bold tracking-tight leading-[0.95] mb-5 md:mb-6"
      aria-label="ClubBeans — Ekran süresi değil, yaşam süresi."
    >
      {/* Marka adı h1'in İÇİNDE: Google OAuth marka doğrulaması ana başlıkta uygulama adını
          arıyor ("app name does not match the app name on your home page", 2026-08-17 red
          gerekçesi). Slogan ve kinetik animasyon korunur.
          ⚠️ BİLEREK motion DEĞİL: motion.span SSR'da style="opacity:0" basıyor — JS
          çalıştırmayan bir denetleyici satırı GÖREMEZ. Bu satırın tek işi görünmek, o yüzden
          animasyondan bağımsız. motion'a çevirme. */}
      <span className="block text-sm sm:text-base md:text-lg font-semibold uppercase tracking-[0.18em] leading-none text-acid mb-3 md:mb-4">
        ClubBeans
      </span>

      <span className="block overflow-hidden">
        <motion.span variants={word} className="inline-block relative">
          <span className="relative text-zinc-400">
            Ekran süresi
            {/* üzerini çizen animasyonlu şerit */}
            <motion.span
              aria-hidden
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1.4, ease: easeOutExpo }}
              className="absolute left-0 right-0 top-[58%] h-[0.08em] origin-left bg-zinc-400"
              style={{ transformOrigin: '0% 50%' }}
            />
          </span>{' '}
          <span className="text-zinc-500">değil,</span>
        </motion.span>
      </span>

      <span className="block overflow-hidden">
        <motion.span
          variants={word}
          className="inline-block text-gradient-acid"
          style={{ paddingRight: '0.1em' }}
        >
          yaşam süresi.
        </motion.span>
      </span>
    </motion.h1>
  );
}
