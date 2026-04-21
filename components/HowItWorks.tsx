'use client';

import { easeOutExpo } from '@/lib/motion';
import { motion } from 'framer-motion';

const steps = [
  {
    n: '01',
    key: 'Keşfet',
    title: 'Aç. Yakının görsün.',
    body:
      '"Nerede n\'apılır?" sorusunu algoritmaya değil, kendi filtrene sorarsın. Saat, mesafe, vibe — neyi arıyorsan onu, gerçekten yakınında, gerçekten bu akşam.',
  },
  {
    n: '02',
    key: 'Katıl',
    title: 'Tıkla. Yerin hazır.',
    body:
      'Form yok. "Mail attık, cevap bekliyoruz" yok. Beğendiğin Bean\'e katılırsın — host TrustScore\'unu görür, sen de masadaki yüzleri görürsün. Yerin ayrılır.',
  },
  {
    n: '03',
    key: 'Yaşa',
    title: 'Uygulamayı kapat.',
    body:
      '4 saat, belli bir mekan, belli yüzler. Ne algoritma ne push bildirimi — bu aralıkta sen orada olacaksın, başka hiçbir yerde. Başarımız, uygulamayı unuttuğun o dakikalardır.',
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
            Üç dokunuş, tek akşam
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="text-section font-bold tracking-tight text-white"
          >
            Uygulamayı kapatana kadar,
            <br />
            <span className="text-zinc-500">üç adım.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-zinc-400 max-w-2xl"
          >
            Bir dakikan yeter. Radar&apos;a bak, katıl de, telefonu masanın yanına
            koy. Dördüncü adım zaten uygulamanın dışında — kendi akşamın orada
            başlar.
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
                  <div className="text-xs uppercase tracking-[0.25em] text-acid font-mono">
                    {s.key}
                  </div>
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
