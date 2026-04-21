'use client';

import { easeOutExpo } from '@/lib/motion';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

type Option = { label: string; score: number };
type Question = { id: string; q: string; options: Option[] };

const QUESTIONS: Question[] = [
  {
    id: 'saturday',
    q: 'Son Cumartesi akşamını kimle geçirdin?',
    options: [
      { label: 'Evde tek, ekranla', score: 100 },
      { label: '1-2 kişi, kısa bir şey', score: 50 },
      { label: 'Masada, kalabalık', score: 10 },
    ],
  },
  {
    id: 'new-person',
    q: 'Yeni biriyle tanışalı kaç hafta oldu?',
    options: [
      { label: '2 aydan uzun', score: 100 },
      { label: 'Son 1 ayda', score: 50 },
      { label: 'Geçen hafta', score: 10 },
    ],
  },
  {
    id: 'balance',
    q: 'Bu hafta — ekran mı, masa mı?',
    options: [
      { label: 'Ekran 10x fazla', score: 100 },
      { label: 'Yarı yarıya', score: 50 },
      { label: 'Masa daha çok', score: 10 },
    ],
  },
];

function verdict(score: number): { label: string; hint: string } {
  if (score >= 75)
    return {
      label: 'Kırmızı',
      hint: 'Sosyal Obezite eşiğini geçtin. Bu hafta bir Bean denemek tam sana yazıldı.',
    };
  if (score >= 40)
    return {
      label: 'Turuncu',
      hint: 'Düşüş başlamış. Bir Club bulup Cumartesiyi işaretlemek iyi fikir.',
    };
  return {
    label: 'Yeşil',
    hint: 'İyi dengedesin. ClubBeans çeşitlendirmek istersen buradayız.',
  };
}

export default function LonelinessQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const pick = (score: number) => {
    const next = [...answers, score];
    setAnswers(next);
    if (step < QUESTIONS.length - 1) setStep(step + 1);
    else setStep(QUESTIONS.length); // bitti
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
  };

  const total = useMemo(() => {
    if (answers.length === 0) return 0;
    return Math.round(answers.reduce((a, b) => a + b, 0) / answers.length);
  }, [answers]);

  const isDone = step >= QUESTIONS.length;
  const current = QUESTIONS[step];
  const v = verdict(total);
  const tone =
    v.label === 'Kırmızı' ? 'text-rose-300' : v.label === 'Turuncu' ? 'text-amber-300' : 'text-acid';
  const progressPct = (Math.min(step, QUESTIONS.length) / QUESTIONS.length) * 100;

  return (
    <section id="yalnizlik-indeksi" className="relative py-24 md:py-36 overflow-hidden">
      <div className="container-x">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.3em] text-acid mb-6 font-mono text-center"
          >
            30 saniye · Yalnızlık İndeksi
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="text-section font-bold tracking-tight text-white text-center mb-12"
          >
            Aynı masadan konuşalım.
            <br />
            <span className="text-zinc-500">Kendini nerede hissediyorsun?</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: easeOutExpo }}
            className="relative bg-elevated border border-border rounded-3xl p-6 md:p-10 overflow-hidden"
          >
            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/[0.04]">
              <motion.div
                className="h-full bg-acid"
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.4, ease: easeOutExpo }}
              />
            </div>

            <AnimatePresence mode="wait">
              {!isDone ? (
                <motion.div
                  key={`q-${step}`}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.4, ease: easeOutExpo }}
                >
                  <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500 mb-3">
                    Soru {step + 1} / {QUESTIONS.length}
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-white tracking-tight mb-8 leading-snug">
                    {current.q}
                  </div>
                  <div className="space-y-2">
                    {current.options.map((o) => (
                      <button
                        key={o.label}
                        type="button"
                        onClick={() => pick(o.score)}
                        className="w-full group text-left bg-white/[0.02] hover:bg-acid/5 border border-white/[0.06] hover:border-acid/40 rounded-2xl px-5 py-4 transition"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm md:text-base text-zinc-200 group-hover:text-white">
                            {o.label}
                          </span>
                          <span className="w-5 h-5 rounded-full border border-white/10 group-hover:border-acid/70 transition flex items-center justify-center">
                            <span className="w-1 h-1 rounded-full bg-transparent group-hover:bg-acid transition" />
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.5, ease: easeOutExpo }}
                  className="text-center"
                >
                  <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500 mb-4">
                    Yalnızlık İndeksin
                  </div>
                  <div className={`text-7xl md:text-8xl font-black tabular-nums ${tone} mb-2`}>
                    {total}
                  </div>
                  <div className="text-xs font-mono text-zinc-500 mb-6">/ 100</div>
                  <div className={`text-lg md:text-xl font-bold mb-3 ${tone}`}>{v.label}</div>
                  <p className="text-sm md:text-base text-zinc-400 max-w-md mx-auto mb-8">
                    {v.hint}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href="#launch"
                      className="inline-flex items-center justify-center gap-2 bg-acid text-midnight font-semibold px-5 py-3 rounded-full text-sm no-underline hover:bg-acid-400 transition"
                    >
                      Lansman listesine katıl →
                    </a>
                    <button
                      type="button"
                      onClick={reset}
                      className="inline-flex items-center justify-center gap-2 text-zinc-400 hover:text-white text-sm font-medium transition"
                    >
                      Yeniden dene
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-600 font-mono mt-6">
                    * Veriler cihazında kalır. Hiçbir yere gönderilmez.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
