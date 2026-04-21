'use client';

import { easeOutExpo } from '@/lib/motion';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function FoundersNote() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      id="not"
      ref={ref}
      className="relative py-28 md:py-40 overflow-hidden"
    >
      {/* Kağıt gradient arka plan */}
      <motion.div
        aria-hidden
        style={{ y }}
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto max-w-4xl h-[120%] opacity-40 pointer-events-none"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-acid/[0.08] via-transparent to-transparent blur-3xl" />
      </motion.div>

      <div className="container-x relative">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.3em] text-acid mb-10 font-mono flex items-center gap-3"
          >
            <span className="w-8 h-px bg-acid" />
            Kuruculardan
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: easeOutExpo }}
            className="text-section font-bold tracking-tight text-white mb-10 leading-tight"
          >
            Bir uygulama daha mı?
            <br />
            <span className="text-zinc-500">Hayır — bunu biz de istemezdik.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="prose-like space-y-5 md:space-y-6 text-base md:text-xl text-zinc-300 leading-relaxed"
          >
            <p>
              Telefonunda onlarca uygulama var. Hepsi seni geri çağırıyor. Hepsi
              &quot;yeni bildirim&quot; diyor. Cumartesi gelmeden yorgunsun. Planın olsa bile
              yapamıyorsun. Olmadığında da kimse aramıyor.
            </p>
            <p>
              Biz de bunun içinden geldik — girişimci, tasarımcı, kod yazan, şehir
              yaşayan. Başkalarıyla fiziksel bir masa paylaşmak gitgide zorlaştı;
              arkadaşla görüşmek bir &quot;proje&quot; oldu. Böyle olmamalıydı.
            </p>
            <p>
              ClubBeans&apos;i bu yüzden yazdık: senin adına plan yapmayan, planı sana
              getiren; dikkatini çalmayan, Cumartesi akşamını geri veren;
              algoritmayla değil güvenle sıralayan bir anti-platform.
            </p>
            <p className="text-white font-semibold">
              Bir hastalığın adını koyduk: <span className="text-acid">Sosyal Obezite</span>.
              Karşısına dikildik. Uygulama kapanınca hayatın başlasın diye.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 md:mt-12 flex items-center gap-3 md:gap-4"
          >
            <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-acid to-emerald-500 flex items-center justify-center text-midnight font-black flex-shrink-0">
              CB
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white truncate">
                ClubBeans kurucu ekibi
              </div>
              <div className="text-[11px] md:text-xs text-zinc-500 font-mono truncate">
                İstanbul · Cumartesi 23:47
              </div>
            </div>
            <span className="ml-auto text-zinc-700 text-2xl font-serif italic flex-shrink-0">
              —
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
