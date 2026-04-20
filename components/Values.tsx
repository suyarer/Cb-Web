'use client';

import AnimatedCounter from '@/components/AnimatedCounter';
import { easeOutExpo } from '@/lib/motion';
import { motion } from 'framer-motion';

const values = [
  {
    big: { value: 0, suffix: '', prefix: '' },
    title: 'algoritma',
    text: 'Kime neyi göstereceğine karar veren bir kara kutu yok. Radar senin için çalışır — senin yerine değil.',
  },
  {
    big: { value: 4, suffix: ' sa', prefix: '' },
    title: 'sabit Bean süresi',
    text: 'Her Bean 4 saat. Başı, sonu belli. Sonsuz scroll yok, yapay aciliyet yok — topluluk gerçek zamanda bir araya gelir.',
  },
  {
    big: { value: 30, suffix: '%', prefix: '' },
    title: 'zorunlu keşif',
    text: 'Feed\'inin %30\'u filter bubble dışından gelir. Konforun dışında, yeni tribe\'larla karşılaşman için.',
  },
  {
    big: { value: 100, suffix: '%', prefix: '' },
    title: 'verin sende',
    text: 'Üçüncü taraf reklam ağı yok. Davranış verisi satmıyoruz. KVKK ve GDPR uyumlu — her an dışa aktarabilir, silebilirsin.',
  },
];

export default function Values() {
  return (
    <section id="ilkeler" className="relative py-24 md:py-36 overflow-hidden">
      <div className="container-x relative">
        <div className="max-w-3xl mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.3em] text-acid mb-6 font-mono"
          >
            İlkelerimiz
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="text-section font-bold tracking-tight text-white"
          >
            Dört ilke,
            <br />
            <span className="text-zinc-500">tek bir yön.</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-white/[0.05] rounded-3xl overflow-hidden border border-white/[0.06]">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.8, delay: (i % 2) * 0.08, ease: easeOutExpo }}
              className="relative bg-elevated p-8 md:p-12 group"
            >
              <div className="absolute inset-0 bg-radial-glow opacity-0 group-hover:opacity-40 transition duration-700 pointer-events-none" />
              <div className="relative">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-6xl md:text-7xl font-black text-acid tracking-tighter leading-none">
                    {v.big.prefix}
                    <AnimatedCounter value={v.big.value} duration={1.8} />
                    {v.big.suffix}
                  </span>
                </div>
                <div className="text-lg md:text-xl font-semibold text-white mb-3">
                  {v.title}
                </div>
                <p className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-md">
                  {v.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
