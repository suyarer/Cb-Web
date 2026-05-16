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
        Cumartesileri
        <br />
        <span className="text-gradient-acid">geri al.</span>
      </h1>
    );
  }

  return (
    <motion.h1
      variants={container}
      initial="hidden"
      animate="visible"
      className="text-hero font-bold tracking-tight leading-[0.95] mb-6"
      aria-label="Cumartesileri geri al."
    >
      <span className="block overflow-hidden">
        <motion.span variants={word} className="inline-block relative">
          <span className="relative text-white">Cumartesileri</span>
        </motion.span>
      </span>

      <span className="block overflow-hidden">
        <motion.span
          variants={word}
          className="inline-block text-gradient-acid"
          style={{ paddingRight: '0.1em' }}
        >
          geri al.
        </motion.span>
      </span>
    </motion.h1>
  );
}
