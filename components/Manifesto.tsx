'use client';

import BeanSprout from '@/components/BeanSprout';
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

export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section id="manifesto" ref={ref} className="relative py-40 md:py-56 overflow-hidden">
      <motion.div style={{ opacity }} className="container-x relative">
        <div className="max-w-5xl mx-auto">
          <div className="inline-block text-xs uppercase tracking-[0.3em] text-acid mb-8 font-mono">
            Manifesto · yavaş oku
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
            Elinde telefon, içinde bir boşluk. &quot;Bir şey eksik&quot; hissi — adını
            koyamadığın o eksik. Biz buna{' '}
            <strong className="text-white">Sosyal Obezite</strong> diyoruz: çok like,
            az masa. ClubBeans bu hissin karşısına dikilmiş bir dalgakıran.
          </motion.p>

          <div className="grid md:grid-cols-2 gap-8 md:gap-16 mb-20">
            <div className="space-y-3 md:space-y-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-2">
                Yapmıyoruz
              </div>
              {negatives.map((s, i) => (
                <WordReveal
                  key={s}
                  text={s}
                  delay={i * 0.1}
                  tone="muted"
                />
              ))}
            </div>
            <div className="space-y-3 md:space-y-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-acid mb-2">
                Yapıyoruz
              </div>
              {positives.map((s, i) => (
                <WordReveal
                  key={s}
                  text={s}
                  delay={0.15 + i * 0.1}
                  tone="bright"
                />
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1, delay: 0.3, ease: easeOutExpo }}
            className="flex justify-center mb-8 md:mb-10"
          >
            <div className="relative">
              <div
                className="absolute -inset-10 bg-acid/15 blur-3xl rounded-full pointer-events-none"
                aria-hidden
              />
              <BeanSprout size={96} animated onScrollOnly breathe />
            </div>
          </motion.div>

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

function WordReveal({
  text,
  delay,
  tone,
}: {
  text: string;
  delay: number;
  tone: 'muted' | 'bright';
}) {
  const words = text.split(' ');
  return (
    <motion.p
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-15%' }}
      transition={{ staggerChildren: 0.05, delayChildren: delay }}
      className={`text-xl md:text-2xl font-semibold leading-snug tracking-tight ${
        tone === 'muted' ? 'text-zinc-600' : 'text-white'
      }`}
    >
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          variants={{
            hidden: { opacity: 0, y: 8, filter: 'blur(4px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
          }}
          transition={{ duration: 0.55, ease: easeOutExpo }}
          className="inline-block mr-[0.28em]"
        >
          {w}
        </motion.span>
      ))}
    </motion.p>
  );
}
