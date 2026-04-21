'use client';

import { easeOutExpo } from '@/lib/motion';
import { motion } from 'framer-motion';

const problems = [
  {
    n: '01',
    cta: 'Yakında Bul',
    pain: 'İki sokak ötende aynı kitabı okuyan biri var. Aynı saatte koşuyor, aynı pitch\'i dinliyor. Haberin olmuyor.',
    solution:
      'Senin yürüme mesafende şehir ne yapıyor — tek ekranda. Saat, yer, vibe; filtreyi sen kurarsın. Algoritma değil.',
  },
  {
    n: '02',
    cta: 'Birlikte Yap',
    pain: 'Tüm gün sosyal medyadaydın. 284 like, 43 yorum, 0 insan. Dijital kalabalık, fiziksel yalnızlık — çağın hastalığı.',
    solution:
      'Bean dijital değil, fiziksel. Ekrana değil masaya otururuz. 4 saat, belli bir yer, belli insanlar — başı sonu belli bir buluşma.',
  },
  {
    n: '03',
    cta: 'Kolay Kur',
    pain: 'Kendi kulübünü açmak için bir WhatsApp grup, bir Instagram hesap, bir Eventbrite sayfa. Üçü de yarım, hiçbiri bağlı değil.',
    solution:
      'Club\'ı bir dakikada kurarsın. Bean açarsın, davet edersin, TrustScore güveni korur. Üç uygulama değil — bir ekran.',
  },
];

export default function Problems() {
  return (
    <section id="sorunlar" className="relative py-24 md:py-36 overflow-hidden">
      <div className="container-x relative">
        <div className="max-w-3xl mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.3em] text-acid mb-6 font-mono"
          >
            Çözdüğümüz üç şey
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="text-section font-bold tracking-tight text-white"
          >
            Şehirli yalnızlığın
            <br />
            <span className="text-zinc-500">üç somut belirtisi var.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-zinc-400 max-w-2xl"
          >
            Şehirde çalışan, işini kendi yürüten, geceleri yorgun dönen herkesin
            derdi aynı: çok tanıdık, az yakın. Cumartesi boş. ClubBeans bu üç şeyi
            konu ediyor — hepsi birden.
          </motion.p>
        </div>

        <div className="space-y-3 md:space-y-4">
          {problems.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: easeOutExpo }}
              className="group relative bg-elevated border border-border rounded-3xl overflow-hidden hover:border-acid/30 transition"
            >
              <div className="grid md:grid-cols-[auto_1fr_1fr] gap-6 md:gap-10 p-8 md:p-12 items-start">
                <div className="text-5xl md:text-6xl font-black text-zinc-800 font-mono leading-none">
                  {p.n}
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-3">
                    Sorun
                  </div>
                  <p className="text-lg md:text-xl text-zinc-400 leading-snug">{p.pain}</p>
                </div>
                <div className="relative md:border-l md:border-white/[0.06] md:pl-10">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-acid mb-3">
                    Bizim çözümümüz
                  </div>
                  <p className="text-lg md:text-xl text-white leading-snug mb-4">{p.solution}</p>
                  <span className="inline-flex items-center gap-2 bg-acid/10 border border-acid/30 text-acid text-xs font-semibold rounded-full px-3 py-1">
                    <span className="w-1 h-1 rounded-full bg-acid" />
                    {p.cta}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
