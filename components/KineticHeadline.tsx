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
      <h1 className="text-hero font-bold tracking-tight leading-[0.95] mb-6">
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
      className="text-hero font-bold tracking-tight leading-[0.95] mb-6"
      aria-label="Ekran süresi değil, yaşam süresi."
    >
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
