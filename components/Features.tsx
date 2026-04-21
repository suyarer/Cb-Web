'use client';

import { easeOutExpo } from '@/lib/motion';
import { motion } from 'framer-motion';

const features = [
  {
    tag: 'Yakında Bul',
    title: 'Radar',
    description:
      'Bu akşam şehrin ne yapıyor? Harita, mesafe, saat, vibe — tek ekran. Algoritma yok; filtreyi sen kurarsın, şehir sana konuşur.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </svg>
    ),
    accent: 'from-acid/20 via-transparent to-transparent',
  },
  {
    tag: 'Birlikte Yap',
    title: 'Bean',
    description:
      '4 saat, başı sonu belli. Kahve, koşu, pitch night, kitap sohbeti — dijital etkinlik değil, fiziksel masa. Ekran değil, yüz yüze.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2">
        <path d="M12 2C7 7 7 12 12 17c5-5 5-10 0-15z" />
        <path d="M12 17v5" />
      </svg>
    ),
    accent: 'from-purple-500/20 via-transparent to-transparent',
  },
  {
    tag: 'Kolay Kur',
    title: 'Club',
    description:
      'Kendi kulübünü bir dakikada kurarsın. "AI Girişimcileri", "Moda Koşu Kulübü" — dikey seç, Bean aç, davet et. Üç uygulama yok; bir ekran var.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="10" r="2" />
        <path d="M3 20c0-4 3-6 6-6s6 2 6 6" />
        <path d="M15 18c0-2 2-3 4-3" />
      </svg>
    ),
    accent: 'from-pink-500/20 via-transparent to-transparent',
  },
  {
    tag: 'Ruh halin',
    title: 'Compass Mode',
    description:
      'Bu akşam DENGE mi, COŞKU mu, SAKİN mi, YAKIN mı? Seçersin — keşif o ruh haline hizalanır, uygulama tonu değişir. Kategori değil, atmosfer. Sadece bu gece için.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7l3 5-3 5-3-5 3-5z" />
      </svg>
    ),
    accent: 'from-amber-500/20 via-transparent to-transparent',
  },
  {
    tag: 'Tek dokunuş',
    title: 'Katıl',
    description:
      'Tek kelime, tek tıklama. Form yok, mail beklemek yok, onay sıran yok — beğenirsin, katılırsın, Cumartesi yerin hazır.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14" />
        <path d="M13 6l6 6-6 6" />
      </svg>
    ),
    accent: 'from-teal-500/20 via-transparent to-transparent',
  },
  {
    tag: 'Sessiz bildirim',
    title: 'Signal',
    description:
      'Kırmızı nokta enflasyonu yok. Yapay aciliyet yok. Sadece gerçekten anlamı olan şey sinyal olur — her bildirim ayarlanabilir, hiçbiri pazarlık değil.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2">
        <path d="M6 8a6 6 0 0112 0v5l2 3H4l2-3V8z" />
        <path d="M10 19a2 2 0 004 0" />
      </svg>
    ),
    accent: 'from-blue-500/20 via-transparent to-transparent',
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 md:py-40">
      <div className="container-x">
        <div className="max-w-3xl mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.3em] text-acid mb-6 font-mono"
          >
            Cumartesi akşamını geri vermenin yolları
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="text-section font-bold tracking-tight text-white"
          >
            Üç vaat,
            <br />
            <span className="text-zinc-500">altı sessiz mekanizma.</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, i) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.1, ease: easeOutExpo }}
              whileHover={{ y: -4 }}
              className="group relative bg-elevated border border-border rounded-3xl p-8 overflow-hidden hover:border-acid/30 transition"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none`}
              />
              <div className="relative">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-acid group-hover:bg-acid group-hover:text-midnight group-hover:border-acid transition">
                    {feature.icon}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-600">
                    {feature.tag}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
