'use client';

import { easeOutExpo } from '@/lib/motion';
import { motion } from '@/lib/motion';
import Link from 'next/link';

type Teaser = {
  kicker: string;
  title: string;
  sub: string;
  href: string;
};

const TEASERS: Teaser[] = [
  {
    kicker: 'Manifesto',
    title: 'Neden anti-platformuz?',
    sub: 'Tam felsefe, yavaş-oku.',
    href: '/manifesto',
  },
  {
    kicker: 'Kulüp aç',
    title: 'Kulüp kurmak için?',
    sub: 'Kurucular için tam rehber.',
    href: '/club-kur',
  },
  {
    kicker: 'Ürün',
    title: 'Ekranları gör.',
    sub: 'Keşif · harita · ruh hali · buluşma detayı.',
    href: '/urun',
  },
  {
    kicker: 'Fark',
    title: 'Rakiplerden farkı?',
    sub: '5 kritik fark, dürüst kıyas.',
    href: '/fark',
  },
  {
    kicker: 'Yol haritası',
    title: 'Ne zaman, nerede?',
    sub: 'Alfa → beta → lansman.',
    href: '/yol-haritasi',
  },
  {
    kicker: 'SSS',
    title: '12 net cevap.',
    sub: 'KVKK, iptal, ücretsizlik.',
    href: '/sss',
  },
];

export default function SubpageTeasers() {
  return (
    <section id="derin" className="relative py-20 md:py-28 overflow-hidden">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-10 md:mb-14"
        >
          <div className="text-xs uppercase tracking-[0.3em] text-acid mb-3 font-mono">
            Derine in
          </div>
          <h2 className="text-section font-bold tracking-tight text-white leading-tight">
            Merak ettiğini öğren.
            <br />
            <span className="text-zinc-500">Her konu kendi sayfasında.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {TEASERS.map((t, i) => (
            <motion.div
              key={t.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.06, ease: easeOutExpo }}
            >
              <Link
                href={t.href}
                className="group relative block bg-elevated border border-border hover:border-acid/30 rounded-2xl p-5 md:p-6 transition-colors duration-300 no-underline h-full"
              >
                <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500 group-hover:text-acid transition mb-2">
                  {t.kicker}
                </div>
                <div className="text-base md:text-lg font-bold text-white group-hover:text-acid transition mb-1.5 leading-snug">
                  {t.title}
                </div>
                <div className="text-xs md:text-sm text-zinc-500 leading-relaxed">
                  {t.sub}
                </div>
                <span
                  className="absolute top-5 right-5 text-zinc-600 group-hover:text-acid group-hover:translate-x-0.5 transition"
                  aria-hidden
                >
                  →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
