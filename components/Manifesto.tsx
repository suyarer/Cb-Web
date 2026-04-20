'use client';

import { easeOutExpo } from '@/lib/motion';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const sentences = [
  'Biz algoritma kurmuyoruz.',
  'Davranışını takip etmiyoruz.',
  'Verini kimseye satmıyoruz.',
  'Dikkat ekonomisinin bir parçası değiliz.',
];

const ending = 'Sen, kendi tribe\'ını seçersin.';

export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section id="manifesto" ref={ref} className="relative py-40 md:py-56 overflow-hidden">
      <motion.div style={{ opacity }} className="container-x relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block text-xs uppercase tracking-[0.3em] text-acid mb-8 font-mono">
            Manifesto
          </div>

          <div className="space-y-4 md:space-y-6 mb-12">
            {sentences.map((sentence, i) => (
              <motion.p
                key={sentence}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20%' }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: easeOutExpo }}
                className="text-2xl md:text-4xl lg:text-5xl font-bold text-zinc-500 leading-tight tracking-tight"
              >
                {sentence}
              </motion.p>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1, delay: 0.6, ease: easeOutExpo }}
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
