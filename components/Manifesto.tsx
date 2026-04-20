'use client';

import { easeOutExpo } from '@/lib/motion';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const negatives = [
  'Algoritma seni ekranda tutmak için yazılmaz.',
  'Bildirim, yapay aciliyetle seni geri çağırmaz.',
  'Davranışın izlenmez, verin satılmaz.',
  'Dikkat ekonomisinin bir halkası değiliz.',
];

const positives = [
  'Biz seni sokağa çıkarmak için algoritma yazarız.',
  'Bildirim, sadece gerçekten anlamlı olduğunda gelir.',
  'Senden topluluk kurarız, profil değil.',
  'Başarımız, uygulamayı kapattığın an başlar.',
];

const ending = 'Ekran süresi değil, yaşam süresi.';

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
        <div className="max-w-5xl mx-auto">
          <div className="inline-block text-xs uppercase tracking-[0.3em] text-acid mb-8 font-mono">
            Manifesto
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="text-section font-bold tracking-tight text-white mb-4"
          >
            Biz bir uygulama değil,
            <br />
            <span className="text-zinc-500">bir anti-platformuz.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, delay: 0.15, ease: easeOutExpo }}
            className="text-lg md:text-xl text-zinc-400 max-w-3xl leading-relaxed mb-20"
          >
            Dijital çağın getirdiği <strong className="text-white">Sosyal Obezite</strong>&apos;ye
            — çok kaydırma, az yaşama — karşı, kodla inşa edilmiş bir dalgakıran.
          </motion.p>

          <div className="grid md:grid-cols-2 gap-8 md:gap-16 mb-20">
            <div className="space-y-3 md:space-y-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-2">
                Yapmıyoruz
              </div>
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
              <div className="text-[10px] font-mono uppercase tracking-wider text-acid mb-2">
                Yapıyoruz
              </div>
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
            className="text-display font-bold text-white tracking-tight leading-none text-center"
          >
            Ekran süresi değil,{' '}
            <span className="text-acid">yaşam süresi.</span>
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
