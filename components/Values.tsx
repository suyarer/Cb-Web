'use client';

import AnimatedCounter from '@/components/AnimatedCounter';
import { easeOutExpo } from '@/lib/motion';
import { motion } from 'framer-motion';

const values = [
  {
    big: { value: 0, suffix: '', text: null },
    title: 'dikkat algoritması',
    text: 'Seni ekranda tutmak için tek satır kod yazmıyoruz. Sıralamayı kara kutu değil, senin filtren belirler. Kullandıkça fazlalaşmayan, azalan bir uygulama.',
  },
  {
    big: { value: 1, suffix: ' dk', text: null },
    title: 'Club açmak yeter',
    text: 'Form, WhatsApp grubu, Instagram hesabı, Eventbrite sayfası — hiçbiri değil. Bir dakikada kulübünü kur, Bean aç, davet et. Tek ekran, sürtünmesiz.',
  },
  {
    big: { value: 4, suffix: ' sa', text: null },
    title: 'bir Bean sürer',
    text: 'Başı belli, sonu belli. Parkta koşu, masada sohbet, sahnede pitch. Ekrana değil masaya, yorum yapmaya değil yaşamaya zaman.',
  },
  {
    big: { value: 0, suffix: '', text: 'Trust' },
    title: 'Score ile gerçek çevre',
    text: 'Herkesin herkese ulaştığı kaotik bir yer değil. TrustScore tuttuğun sözleri ölçer. Curated network bir vaadimiz değil — mekanizmamız.',
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
            Söz verdiklerimiz
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="text-section font-bold tracking-tight text-white"
          >
            Dört söz,
            <br />
            <span className="text-zinc-500">Cumartesinde karşılığı var.</span>
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
