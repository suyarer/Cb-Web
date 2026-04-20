'use client';

import { easeOutExpo } from '@/lib/motion';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const negatives = [
  'Biz algoritma kurmuyoruz.',
  'Davranışını takip etmiyoruz.',
  'Verini kimseye satmıyoruz.',
  'Dikkat ekonomisinin bir parçası değiliz.',
];

const positives = [
  'Biz topluluk kuruyoruz.',
  'Radar senin için çalışır, senin aleyhine değil.',
  'Verin sende kalır — şeffaf, taşınabilir.',
  'Dikkatini değil, zamanını kıymetli biliriz.',
];

const ending = "Sen, kendi tribe'ını seçersin.";

export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);

  return (
    <section id="manifesto" ref={ref} className="relative py-40 md:py-56 overflow-hidden">
      <motion.div style={{ opacity }} className="container-x relative">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block text-xs uppercase tracking-[0.3em] text-acid mb-8 font-mono">
            Manifesto
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-16 text-left mb-20">
            <div className="space-y-3 md:space-y-4">
              {negatives.map((s, i) => (
                <motion.p
                  key={s}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-15%' }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: easeOutExpo }}
                  className="text-xl md:text-2xl font-semibold text-zinc-600 leading-snug tracking-tight"
                >
                  {s}
                </motion.p>
              ))}
            </div>
            <div className="space-y-3 md:space-y-4">
              {positives.map((s, i) => (
                <motion.p
                  key={s}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-15%' }}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: easeOutExpo }}
                  className="text-xl md:text-2xl font-semibold text-white leading-snug tracking-tight"
                >
                  {s}
                </motion.p>
              ))}
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1, delay: 0.5, ease: easeOutExpo }}
            className="text-display font-bold text-white tracking-tight leading-none"
          >
            {ending.split("'").map((part, i) =>
              i === 1 ? (
                <span key={i} className="text-acid">
                  &apos;{part}
                </span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
