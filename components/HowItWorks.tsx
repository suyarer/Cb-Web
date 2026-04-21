'use client';

import { easeOutExpo } from '@/lib/motion';
import { motion } from 'framer-motion';

const steps = [
  {
    n: '01',
    key: 'Keşfet',
    title: 'Radar\'ı aç. Yakınını gör.',
    body:
      'Yürüme mesafende ne oluyor? Saat, yer, vibe — filtreyi sen kurarsın. Algoritma seni beslemez; şehir sana konuşur.',
  },
  {
    n: '02',
    key: 'Jump In',
    title: 'Tek dokunuş. Yer senin.',
    body:
      'Form yok. Mail beklemek yok. Beğendiğin Bean\'e Jump In dersin — host TrustScore\'unu görür, sen de kimlerin masaya oturduğunu.',
  },
  {
    n: '03',
    key: 'Yaşa',
    title: 'Ekranı bırak. Sohbete geç.',
    body:
      '4 saat. Bir masa. Gerçek yüzler. Bean biter, TrustScore güncellenir, bir sonraki davet daha yakın gelir. Uygulamadan hayata.',
  },
];

export default function HowItWorks() {
  return (
    <section id="nasil-calisir" className="relative py-24 md:py-36 overflow-hidden">
      <div className="container-x">
        <div className="max-w-3xl mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.3em] text-acid mb-6 font-mono"
          >
            Nasıl çalışır
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="text-section font-bold tracking-tight text-white"
          >
            Keşfet, Jump In,
            <br />
            <span className="text-zinc-500">sonra yaşa.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-zinc-400 max-w-2xl"
          >
            Üç adım. Toplam bir dakika. Dördüncü adım zaten uygulamanın dışında —
            masan, parkın, stüdyon.
          </motion.p>
        </div>

        <div className="relative">
          {/* Bağlantı çizgisi */}
          <div
            aria-hidden
            className="hidden lg:block absolute top-16 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-acid/30 to-transparent"
          />

          <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: easeOutExpo }}
                className="relative bg-elevated border border-border rounded-3xl p-8 md:p-10 hover:border-acid/30 transition"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-midnight border border-white/10 flex items-center justify-center">
                    <span className="text-xl font-mono font-bold text-acid">{s.n}</span>
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    Adım {i + 1}
                  </div>
                </div>

                <div className="text-xs uppercase tracking-[0.25em] text-acid mb-3 font-mono">
                  {s.key}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4 leading-tight">
                  {s.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
