'use client';

import { easeOutExpo } from '@/lib/motion';
import { motion } from 'framer-motion';

const benefits = [
  {
    n: '01',
    title: 'Bir dakikada kulüp.',
    body: 'Dikey seç — AI, koşu, film, kitap, yoga. İsmini koy, logo at. Form doldurmak yok; Club\'ın yayında.',
  },
  {
    n: '02',
    title: 'Bir takvim, bir ekran.',
    body: 'Bean açarsın, tarih verirsin, kapasite koyarsın. Kabilene tek tuşla duyurursun. WhatsApp grup, Instagram post, Eventbrite — hiçbirine ihtiyaç yok.',
  },
  {
    n: '03',
    title: 'Masana kim oturur, sen seç.',
    body: 'TrustScore filter. 80 üstü yalnız kabul. Misafir limit. Kapalı Bean. Kararı sen verirsin — biz sadece sessiz altyapıyı tutarız.',
  },
  {
    n: '04',
    title: 'Sıfır abonelik, sıfır komisyon.',
    body: 'Ücretsiz Club, ücretsiz Bean. Ücretli yaparsan da ClubBeans payı %0. Biz satmıyoruz — sen sohbet ediyorsun, biz masayı hazırlıyoruz.',
  },
];

export default function ForHosts() {
  return (
    <section id="club-kur" className="relative py-24 md:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow opacity-40 pointer-events-none" />

      <div className="container-x relative">
        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-16 items-center">
          {/* Sol: mesaj */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-xs uppercase tracking-[0.3em] text-acid mb-6 font-mono"
            >
              Club kurucular için · ya da kurmak isteyenler
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: easeOutExpo }}
              className="text-section font-bold tracking-tight text-white mb-6"
            >
              Masaya oturmak kadar,
              <br />
              <span className="text-zinc-500">masayı kurmak da kolay.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-lg text-zinc-400 leading-relaxed mb-10 max-w-xl"
            >
              Bir topluluk kurmak isteyenin kafasında üç uygulama vardır: WhatsApp
              grup, Instagram hesap, Eventbrite sayfa. Hiçbiri tam değil, hiçbiri
              birbirine bağlı değil. ClubBeans tek ekranda açar, davet eder, korur —
              topluluk yönetmek artık dağıtıcı değil, kurucu bir iş.
            </motion.p>

            <div className="space-y-6 mb-10">
              {benefits.map((b, i) => (
                <motion.div
                  key={b.n}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: easeOutExpo }}
                  className="flex gap-5 items-start"
                >
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-midnight border border-white/10 flex items-center justify-center">
                    <span className="text-xs font-mono font-bold text-acid">{b.n}</span>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white mb-1 tracking-tight">
                      {b.title}
                    </div>
                    <div className="text-sm text-zinc-400 leading-relaxed">{b.body}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.a
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              href="#launch"
              className="inline-flex items-center gap-2 bg-white/[0.04] hover:bg-acid hover:text-midnight border border-white/10 hover:border-acid text-white font-semibold px-5 py-3 rounded-full text-sm no-underline transition"
            >
              Kurucular için lansman listesi
              <span>→</span>
            </motion.a>
          </div>

          {/* Sağ: Club dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1, ease: easeOutExpo }}
            className="relative"
          >
            <ClubDashboard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ClubDashboard() {
  return (
    <div className="relative bg-elevated border border-border rounded-3xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 md:px-4 py-3 bg-midnight/60 border-b border-white/[0.06]">
        <div className="flex gap-1.5 flex-shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
        </div>
        <div className="flex-1 text-center text-[9.5px] md:text-[10px] font-mono text-zinc-600 truncate">
          <span className="hidden sm:inline">clubbeans.com/host/ai-girisimcileri</span>
          <span className="sm:hidden">clubbeans.com/host/…</span>
        </div>
        <span className="text-[10px] font-mono text-acid flex items-center gap-1 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-acid brand-pulse" />
          CANLI
        </span>
      </div>

      {/* Header */}
      <div className="p-5 md:p-7 border-b border-white/[0.05]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-acid to-emerald-400 flex items-center justify-center text-midnight font-black text-sm flex-shrink-0">
              AG
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-white truncate">
                AI Girişimcileri İstanbul
              </div>
              <div className="text-[10.5px] text-zinc-500 font-mono truncate">
                247 kişilik kabile · 1 dk önce
              </div>
            </div>
          </div>
          <button
            type="button"
            className="text-[10.5px] md:text-[11px] bg-acid text-midnight font-bold px-2.5 md:px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0"
          >
            + Bean
          </button>
        </div>
      </div>

      {/* Upcoming Bean */}
      <div className="p-5 md:p-7 space-y-4">
        <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
          Sıradaki Bean
        </div>

        <div className="relative bg-midnight border border-white/[0.06] rounded-2xl p-5 overflow-hidden">
          <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-acid/10 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] bg-acid/15 border border-acid/30 text-acid font-mono px-2 py-0.5 rounded-full">
                🎯 PITCH NIGHT
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">Cumartesi · 20:00</span>
            </div>
            <div className="text-base font-bold text-white mb-1">
              Seed Round Pitching · Moda
            </div>
            <div className="text-xs text-zinc-500 mb-3">
              Moda Sahnesi · 4 saat · Kapasite 12
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-700 border-2 border-midnight"
                    />
                  ))}
                </div>
                <span className="text-[11px] text-zinc-400">
                  <span className="text-white font-semibold">8</span>/12 katıldı
                </span>
              </div>
              <div className="h-1.5 w-20 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-acid" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-midnight/50 border border-white/[0.04] rounded-xl p-3">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-2">
            TrustScore filter · masayı koru
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] bg-acid/10 border border-acid/30 text-acid font-mono px-2 py-1 rounded-full">
              ≥ 80
            </span>
            <span className="text-[10px] bg-white/[0.04] border border-white/10 text-zinc-400 font-mono px-2 py-1 rounded-full">
              2+ ortak Club
            </span>
            <span className="text-[10px] bg-white/[0.04] border border-white/10 text-zinc-400 font-mono px-2 py-1 rounded-full">
              referanslı
            </span>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <MiniStat value="247" label="kabile" />
          <MiniStat value="14" label="bu ay Bean" />
          <MiniStat value="%92" label="doluluk" />
        </div>
      </div>
    </div>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-midnight/50 border border-white/[0.04] rounded-xl p-3 text-center">
      <div className="text-lg font-bold text-white tabular-nums">{value}</div>
      <div className="text-[9px] text-zinc-500 uppercase tracking-wider mt-0.5">{label}</div>
    </div>
  );
}
