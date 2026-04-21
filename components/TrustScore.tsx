'use client';

import { easeOutExpo } from '@/lib/motion';
import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const rules = [
  { delta: '+1', label: 'Jump In ettiğin, gittiğin her Bean', tone: 'acid' },
  { delta: '+5', label: 'Host olduğun, söz verdiğin Bean bittiğinde', tone: 'acid' },
  { delta: '+3', label: 'Bir tribe üyesi seni adıyla referans verdiğinde', tone: 'acid' },
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
          {/* Sol: ring viz */}
          <div ref={ref} className="relative flex justify-center lg:justify-start">
            <div className="relative w-[300px] h-[300px] md:w-[380px] md:h-[380px]">
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
                  <span className="w-1.5 h-1.5 rounded-full bg-acid animate-pulse" />
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
              TrustScore · güveni ölçen sessiz sistem
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
              <span className="text-zinc-500">Tuttuğun sözlerin toplamıdır.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-lg text-zinc-400 leading-relaxed mb-10 max-w-xl"
            >
              Herkes <span className="text-white">75</span>&apos;ten başlar. Gittiğin her
              Bean, düzenlediğin her masa, tuttuğun her söz puanına eklenir. Yarım
              bıraktığında düşer. Kim kiminle ne yaptı — şeffaf, karşılıklı, gerçek.
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
                Sonuç
              </div>
              <p className="text-white leading-relaxed">
                Rastgele tanışma değil, <span className="text-acid">curated network</span>.
                Masana oturan insanın izi bellidir — bu yüzden Bean sohbete,
                sohbet ilişkiye, ilişki ortak işe dönüşebilir.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
