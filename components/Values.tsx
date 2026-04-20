'use client';

import AnimatedCounter from '@/components/AnimatedCounter';
import { easeOutExpo } from '@/lib/motion';
import { motion } from 'framer-motion';

const values = [
  {
    big: { value: 0, suffix: '', text: null },
    title: 'dikkat algoritması',
    text: 'Seni ekranda tutmak için hiçbir satır kod yazmıyoruz. Sıralama senin filtrelerinle çalışır; kararı kara kutu değil, sen verirsin.',
  },
  {
    big: { value: 1, suffix: ' dk', text: null },
    title: "Club'ını kur",
    text: 'Topluluk kurmak artık formlar, WhatsApp grupları ve Instagram postları arasında dolaşmak değil. Dakikalar içinde Club aç, Bean düzenle, davet et.',
  },
  {
    big: { value: 4, suffix: ' sa', text: null },
    title: 'sabit buluşma süresi',
    text: 'Her Bean 4 saatlik, başı sonu belli bir fiziksel buluşma. Ekrana değil masaya otururuz; sohbete değil yaşamaya zaman ayırırız.',
  },
  {
    big: { value: 0, suffix: '', text: 'Trust' },
    title: 'Score ile kaliteli çevre',
    text: 'Herkesin herkese ulaştığı kaotik bir yer değiliz. TrustScore referansı ve güveni ölçer — curated network bir vaadimiz değil, mekanizmamız.',
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
                    {v.big.text ?? (
                      <AnimatedCounter value={v.big.value} duration={1.8} />
                    )}
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
