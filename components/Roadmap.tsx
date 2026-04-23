'use client';

import { easeOutExpo } from '@/lib/motion';
import { motion } from 'framer-motion';

type Stage = {
  when: string;
  title: string;
  body: string;
  state: 'done' | 'active' | 'next' | 'future';
};

const STAGES: Stage[] = [
  {
    when: 'Nisan 2026',
    title: 'Kapalı alfa · ilk test grubu',
    body: '50 kişilik davetli çekirdek uygulamayı deniyor. İstanbul Kadıköy + Moda\'da ilk etkinlikler düzenlendi.',
    state: 'done',
  },
  {
    when: 'Mayıs 2026',
    title: 'Beta · lansman listesi',
    body: 'Listeye kayıtlılar için erken erişim. Her hafta yeni şehir mahalleleri açılır.',
    state: 'active',
  },
  {
    when: 'Haziran 2026',
    title: 'Genel lansman',
    body: 'App Store + Google Play yayında. İstanbul, Ankara, İzmir herkese açık.',
    state: 'next',
  },
];

export default function Roadmap() {
  return (
    <section id="yol-haritasi" className="relative py-24 md:py-32 overflow-hidden">
      <div className="container-x">
        <div className="max-w-3xl mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.3em] text-acid mb-6 font-mono"
          >
            Yol haritası · ne olacak, ne zaman
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="text-section font-bold tracking-tight text-white"
          >
            Gizli tutmuyoruz.
            <br />
            <span className="text-zinc-500">Takvim şeffaf, söz şeffaf.</span>
          </motion.h2>
        </div>

        <div className="relative">
          {/* Dikey bağlantı çizgisi */}
          <div
            aria-hidden
            className="absolute left-[19px] md:left-1/2 md:-translate-x-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-white/[0.06] to-transparent"
          />

          <div className="space-y-4 md:space-y-8">
            {STAGES.map((s, i) => (
              <StageRow key={s.when} stage={s} index={i} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 md:mt-12 text-center text-xs md:text-sm text-zinc-500 font-mono"
          >
            Sonrası · <span className="text-zinc-400">2026 Q3 Türkiye geneli</span> ·{' '}
            <span className="text-zinc-400">2027 yurt dışı</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StageRow({ stage, index }: { stage: Stage; index: number }) {
  const onRight = index % 2 === 1; // masaüstünde zig-zag
  const isActive = stage.state === 'active';
  const isDone = stage.state === 'done';
  const isFuture = stage.state === 'future';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: easeOutExpo }}
      className="relative pl-14 md:pl-0 md:grid md:grid-cols-2 md:gap-14"
    >
      {/* Nokta — mobile sol kenarda, md'de dikey çizgi üstünde */}
      <span
        aria-hidden
        className={`absolute left-[10px] md:left-1/2 md:-translate-x-1/2 top-5 md:top-1/2 md:-translate-y-1/2 w-5 h-5 rounded-full border-2 z-10 ${
          isActive
            ? 'bg-acid border-acid brand-pulse'
            : isDone
            ? 'bg-acid/30 border-acid/50'
            : isFuture
            ? 'bg-midnight border-white/15'
            : 'bg-white/10 border-white/20'
        }`}
      />

      {/* Kart — md'de sırayla sol/sağ */}
      <div className={`${onRight ? 'md:col-start-2' : 'md:col-start-1'}`}>
        <StageCard stage={stage} alignRight={!onRight} />
      </div>
    </motion.div>
  );
}

function StageCard({
  stage,
  alignRight,
}: {
  stage: Stage;
  alignRight: boolean;
}) {
  const isActive = stage.state === 'active';
  const isFuture = stage.state === 'future';

  return (
    <div
      className={`bg-elevated border rounded-2xl p-5 md:p-6 transition ${
        isActive ? 'border-acid/40' : 'border-border'
      } ${alignRight ? 'md:text-right' : ''}`}
    >
      <div
        className={`text-[10px] font-mono uppercase tracking-[0.25em] mb-2 ${
          isActive ? 'text-acid' : 'text-zinc-500'
        }`}
      >
        {stage.when}
      </div>
      <div
        className={`text-base md:text-lg font-bold mb-1.5 ${
          isFuture ? 'text-zinc-400' : 'text-white'
        }`}
      >
        {stage.title}
      </div>
      <div className="text-xs md:text-sm text-zinc-500 leading-relaxed">{stage.body}</div>
    </div>
  );
}
