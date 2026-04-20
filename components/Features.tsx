'use client';

import { easeOutExpo } from '@/lib/motion';
import { motion } from 'framer-motion';

const features = [
  {
    tag: 'Yakında Bul',
    title: 'Radar',
    description:
      'Yakınındaki Beans haritada ve listede. Konum, saat, ilgi filtresiyle şehrinde ne dönüyor — hepsini tek ekranda görürsün.',
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
      'Her Bean 4 saatlik fiziksel bir buluşma. Kahve, koşu, pitch night, kitap sohbeti — başı sonu belli bir aktiviteye dahil olursun.',
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
      'Topluluğunu dakikalar içinde aç. "AI Girişimcileri", "Kadıköy Koşu Kulübü" — dikeyini seç, Bean düzenle, üyeni yönet. Tek ekrandan.',
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
    tag: 'Curated network',
    title: 'TrustScore',
    description:
      'Rastgele ve kaotik bir yer değiliz. Her hesabın referansa dayalı bir güven skoru var; kim kiminle ne yaptı — şeffaf ve karşılıklı.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2">
        <path d="M12 3l8 4v6c0 4.5-3 8-8 9-5-1-8-4.5-8-9V7l8-4z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    accent: 'from-amber-500/20 via-transparent to-transparent',
  },
  {
    tag: 'Tek dokunuş',
    title: 'Jump In',
    description:
      '"Katıl" değil, Jump In. Kalabalık bir formu doldurmak, mail beklemek yok — uyuyorsun, tıklıyorsun, masaya oturuyorsun.',
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
      'Sadece senin için gerçekten anlamlı olan şey bildirim olur. Kırmızı nokta enflasyonu yok, yapay aciliyet yok — her sinyal ayarlanabilir.',
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
            Neler sunuyoruz
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="text-section font-bold tracking-tight text-white"
          >
            Üç ana söz,
            <br />
            <span className="text-zinc-500">altı mekanizma.</span>
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
