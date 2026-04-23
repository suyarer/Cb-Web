'use client';

import { easeOutExpo } from '@/lib/motion';
import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const rules = [
  { delta: '+1', label: 'Katıldığın, masaya oturduğun her Bean', tone: 'acid' },
  { delta: '+5', label: 'Host olduğun, söz verdiğin Bean bittiğinde', tone: 'acid' },
  { delta: '+3', label: 'Bir kabile üyesi seni adıyla referans verdiğinde', tone: 'acid' },
  { delta: '−5', label: 'Son dakika iptal, no-show, masayı yarım bırakmak', tone: 'red' },
];

function useAnimatedScore(target: number, active: boolean) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    let r = 0;
    const id = requestAnimationFrame(function tick() {
      r += 1 / 40;
      if (r >= 1) {
        setV(target);
        return;
      }
      const eased = 1 - Math.pow(1 - r, 3);
      setV(Math.round(target * eased));
      requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(id);
  }, [active, target]);
  return v;
}

export default function TrustScore() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });
  const score = useAnimatedScore(84, inView);
  const arc = (score / 100) * 251.3;

  return (
    <section id="trustscore" className="relative py-24 md:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow opacity-50 pointer-events-none" />

      <div className="container-x relative">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">
          {/* Sol: ring viz + örnek profil */}
          <div ref={ref} className="relative flex flex-col items-center lg:items-start gap-8">
            <div className="relative w-[280px] h-[280px] md:w-[340px] md:h-[340px]">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="6"
                  fill="none"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#A8E600"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="251.3"
                  initial={{ strokeDashoffset: 251.3 }}
                  animate={{ strokeDashoffset: 251.3 - arc }}
                  transition={{ duration: 1.6, ease: easeOutExpo }}
                  style={{ filter: 'drop-shadow(0 0 14px rgba(168,230,0,0.35))' }}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-2">
                  TrustScore
                </div>
                <div className="text-6xl md:text-7xl font-black text-white tabular-nums tracking-tighter">
                  {score}
                </div>
                <div className="text-xs text-zinc-600 font-mono mt-1">/ 100</div>
                <div className="mt-5 flex items-center gap-2 bg-acid/10 border border-acid/30 rounded-full px-3 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-acid brand-pulse" />
                  <span className="text-[10px] text-acid font-mono uppercase tracking-wider">
                    Verified
                  </span>
                </div>
              </div>

              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-acid/60"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: inView ? [0, 1, 0] : 0,
                    x: [0, Math.cos((i * Math.PI) / 2) * 150],
                    y: [0, Math.sin((i * Math.PI) / 2) * 150],
                  }}
                  transition={{
                    duration: 3,
                    delay: 1 + i * 0.3,
                    repeat: Infinity,
                    repeatDelay: 4,
                  }}
                  style={{ left: '50%', top: '50%' }}
                />
              ))}
            </div>

            {/* Örnek profil + activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5, ease: easeOutExpo }}
              className="w-full max-w-[340px] bg-elevated/80 backdrop-blur-xl border border-border rounded-2xl p-4 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">
                    Ayşe K. <span className="text-zinc-500 font-normal">· Kadıköy</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    3 kulübe üye · 12 etkinliğe katıldı
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-acid/10 border border-acid/30 px-2 py-1 rounded-full">
                  <span className="w-1 h-1 rounded-full bg-acid" />
                  <span className="text-[10px] font-mono font-bold text-acid">84</span>
                </div>
              </div>

              <div className="space-y-1.5 pl-1">
                <ActivityLine delta="+5" text="Pitch Night · Moda · host" tone="acid" />
                <ActivityLine delta="+3" text="Ahmet E. referans verdi" tone="acid" />
                <ActivityLine delta="+1" text="Cumartesi Koşu Bean · katıldı" tone="acid" />
                <ActivityLine delta="−5" text="Film Kulübü · 2 saat önce iptal" tone="red" />
              </div>
            </motion.div>
          </div>

          {/* Sağ: açıklama */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-xs uppercase tracking-[0.3em] text-acid mb-6 font-mono"
            >
              TrustScore · masaya oturan kim
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: easeOutExpo }}
              className="text-section font-bold tracking-tight text-white mb-6"
            >
              Güven, takipçi sayısı değildir.
              <br />
              <span className="text-zinc-500">
                Söz verip geldiğin buluşmaların toplamıdır.
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-lg text-zinc-400 leading-relaxed mb-10 max-w-xl"
            >
              Her kullanıcı <span className="text-white">75</span> puanla başlar.
              Katıldığın her etkinlik, düzenlediğin her buluşma, aldığın her
              referans puanını yükseltir. Son dakika iptal ettiğinde düşer. Kimin
              hangi etkinliğe geldiği şeffaf — güven rastgele değil, biriken bir
              şey.
            </motion.p>

            <div className="space-y-2 mb-10">
              {rules.map((r, i) => (
                <motion.div
                  key={r.label}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-4 py-3 border-b border-white/[0.05]"
                >
                  <span
                    className={`w-12 text-center text-base font-mono font-bold ${
                      r.tone === 'acid' ? 'text-acid' : 'text-red-400'
                    }`}
                  >
                    {r.delta}
                  </span>
                  <span className="text-sm text-zinc-300">{r.label}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="bg-elevated border border-border rounded-2xl p-6"
            >
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
                Neden önemli
              </div>
              <p className="text-white leading-relaxed">
                Rastgele tanışma değil, <span className="text-acid">curated network</span>.
                Karşındaki sandalyeye oturan insan tesadüf değil — bu yüzden Bean
                sohbete, sohbet dostluğa, bazen ortak işe dönüşür. Randevusu tutulan
                insanlarla masadasın.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ActivityLine({
  delta,
  text,
  tone,
}: {
  delta: string;
  text: string;
  tone: 'acid' | 'red';
}) {
  return (
    <div className="flex items-center gap-2.5 text-xs">
      <span
        className={`font-mono font-bold tabular-nums ${
          tone === 'acid' ? 'text-acid' : 'text-red-400'
        } w-8`}
      >
        {delta}
      </span>
      <span className="text-zinc-400 truncate">{text}</span>
    </div>
  );
}
