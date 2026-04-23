'use client';

import { easeOutExpo } from '@/lib/motion';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

// Birleşik "Kendini Tart" — LonelinessQuiz + ScreenLifeConverter tek bölüm.
// Üstte 3-soru empatik ayna, altta ekran-saati → Bean dönüştürücü.

type Option = { label: string; score: number };
type Question = { q: string; options: Option[] };

const QUESTIONS: Question[] = [
  {
    q: 'Son Cumartesi akşamını kimle geçirdin?',
    options: [
      { label: 'Evde tek, ekranla', score: 100 },
      { label: '1-2 kişi, kısa bir şey', score: 50 },
      { label: 'Masada, kalabalık', score: 10 },
    ],
  },
  {
    q: 'Yeni biriyle tanışalı kaç hafta oldu?',
    options: [
      { label: '2 aydan uzun', score: 100 },
      { label: 'Son 1 ayda', score: 50 },
      { label: 'Geçen hafta', score: 10 },
    ],
  },
  {
    q: 'Bu hafta — ekran mı, masa mı?',
    options: [
      { label: 'Ekran 10x fazla', score: 100 },
      { label: 'Yarı yarıya', score: 50 },
      { label: 'Masa daha çok', score: 10 },
    ],
  },
];

function verdict(score: number): { label: string; hint: string; tone: string } {
  if (score >= 75)
    return {
      label: 'Kırmızı',
      hint: 'Sosyal Obezite eşiğini geçtin. Bu hafta bir Bean tam sana yazıldı.',
      tone: 'text-rose-300',
    };
  if (score >= 40)
    return {
      label: 'Turuncu',
      hint: 'Düşüş başlamış. Bir Club bulup Cumartesiyi işaretlemek iyi fikir.',
      tone: 'text-amber-300',
    };
  return {
    label: 'Yeşil',
    hint: 'İyi dengedesin. ClubBeans çeşitlendirmek istersen buradayız.',
    tone: 'text-acid',
  };
}

function conversions(hours: number) {
  const postsScrolled = Math.round(hours * 60 * 12);
  const beans = Math.round((hours / 3.5) * 10) / 10;
  const walks = Math.round((hours * 60) / 45);
  const talks = Math.round((hours * 60) / 30);
  return { postsScrolled, beans, walks, talks };
}

export default function SelfCheck() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [hours, setHours] = useState(5);

  const pick = (score: number) => {
    const next = [...answers, score];
    setAnswers(next);
    if (step < QUESTIONS.length - 1) setStep(step + 1);
    else setStep(QUESTIONS.length);
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
  };

  const total = useMemo(
    () =>
      answers.length === 0
        ? 0
        : Math.round(answers.reduce((a, b) => a + b, 0) / answers.length),
    [answers]
  );

  const isDone = step >= QUESTIONS.length;
  const current = QUESTIONS[step];
  const v = verdict(total);
  const progressPct = (Math.min(step, QUESTIONS.length) / QUESTIONS.length) * 100;
  const c = conversions(hours);
  const yearPct = Math.round((hours / 24) * 100);

  return (
    <section id="kendini-tart" className="relative py-24 md:py-36 overflow-hidden">
      <div className="container-x">
        <div className="max-w-3xl mx-auto mb-12 md:mb-16 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.3em] text-acid mb-4 font-mono"
          >
            30 saniye · kendini tart
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="text-section font-bold tracking-tight text-white"
          >
            Kendini tart.
            <br />
            <span className="text-zinc-500">30 saniye yeter.</span>
          </motion.h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {/* Mini Quiz */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="relative bg-elevated border border-border rounded-3xl p-6 md:p-8 overflow-hidden"
          >
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
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.4, ease: easeOutExpo }}
                >
                  <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500 mb-2">
                    Soru {step + 1} / {QUESTIONS.length}
                  </div>
                  <div className="text-lg md:text-xl font-bold text-white tracking-tight mb-6 leading-snug">
                    {current.q}
                  </div>
                  <div className="space-y-2">
                    {current.options.map((o) => (
                      <button
                        key={o.label}
                        type="button"
                        onClick={() => pick(o.score)}
                        className="w-full group text-left bg-white/[0.02] hover:bg-acid/5 border border-white/[0.06] hover:border-acid/40 rounded-2xl px-4 md:px-5 py-3.5 transition min-h-[48px]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm md:text-base text-zinc-200 group-hover:text-white">
                            {o.label}
                          </span>
                          <span className="w-5 h-5 rounded-full border border-white/10 group-hover:border-acid/70 transition flex items-center justify-center flex-shrink-0">
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
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500 mb-3">
                    Yalnızlık İndeksin
                  </div>
                  <div className={`text-6xl md:text-7xl font-black tabular-nums ${v.tone} mb-1`}>
                    {total}
                  </div>
                  <div className="text-xs font-mono text-zinc-500 mb-4">/ 100</div>
                  <div className={`text-lg md:text-xl font-bold mb-2 ${v.tone}`}>{v.label}</div>
                  <p className="text-sm text-zinc-400 max-w-md mx-auto mb-5">{v.hint}</p>
                  <button
                    type="button"
                    onClick={reset}
                    className="text-xs text-zinc-500 hover:text-white transition font-mono"
                  >
                    Yeniden dene
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Divider */}
          <div className="flex items-center gap-4 py-2">
            <span className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-600">
              bir de şunu hesapla
            </span>
            <span className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Screen → Life Converter */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="bg-elevated border border-border rounded-3xl p-6 md:p-8"
          >
            <div className="mb-6">
              <div className="flex items-baseline justify-between mb-2">
                <label
                  htmlFor="hours-slider"
                  className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500"
                >
                  Günde ortalama ekran
                </label>
                <div className="flex items-baseline gap-1">
                  <motion.span
                    key={hours}
                    initial={{ y: -4, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="text-4xl md:text-5xl font-black text-acid tabular-nums"
                  >
                    {hours}
                  </motion.span>
                  <span className="text-sm text-zinc-500 font-mono">saat</span>
                </div>
              </div>
              <CustomSlider
                id="hours-slider"
                value={hours}
                min={1}
                max={12}
                onChange={setHours}
              />
              <div className="flex justify-between mt-2 text-[10px] font-mono text-zinc-600">
                <span>1 sa</span>
                <span>6 sa</span>
                <span>12 sa</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-5">
              <Card icon="📱" value={c.postsScrolled.toLocaleString('tr-TR')} label="post kaydırma" muted />
              <Card icon="☕" value={c.beans.toString()} label="Bean" />
              <Card icon="🚶" value={c.walks.toString()} label="45 dk yürüyüş" />
              <Card icon="💬" value={c.talks.toString()} label="gerçek sohbet" />
            </div>

            <div className="pt-5 border-t border-white/[0.04] text-center">
              <div className="text-sm md:text-base text-white">
                Yılda{' '}
                <span className="text-acid font-mono">
                  {Math.round((hours * 365) / 24).toLocaleString('tr-TR')}
                </span>{' '}
                gün ekran —{' '}
                <span className="text-zinc-300">yılın %{yearPct}&apos;i.</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CustomSlider({
  id,
  value,
  min,
  max,
  onChange,
}: {
  id: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  const percent = ((value - min) / (max - min)) * 100;
  return (
    <div className="relative h-6 flex items-center">
      <div className="absolute left-0 right-0 h-[5px] bg-white/[0.06] rounded-full" />
      <motion.div
        animate={{ width: `${percent}%` }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className="absolute left-0 h-[5px] bg-gradient-to-r from-acid-600 via-acid to-acid-400 rounded-full shadow-[0_0_16px_rgba(168,230,0,0.45)]"
      />
      <motion.div
        animate={{ left: `${percent}%` }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className="absolute w-5 h-5 -translate-x-1/2 rounded-full bg-acid border-[3px] border-midnight pointer-events-none"
        style={{
          boxShadow:
            '0 0 0 1px rgba(168,230,0,0.5), 0 0 24px rgba(168,230,0,0.55)',
        }}
      />
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Ekran saati"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
    </div>
  );
}

function Card({
  icon,
  value,
  label,
  muted = false,
}: {
  icon: string;
  value: string;
  label: string;
  muted?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-3 md:p-4 text-center border ${
        muted
          ? 'bg-white/[0.02] border-white/[0.04]'
          : 'bg-acid/[0.04] border-acid/20'
      }`}
    >
      <div className="text-xl mb-1.5">{icon}</div>
      <motion.div
        key={value}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={`text-lg md:text-xl font-black tabular-nums ${
          muted ? 'text-zinc-600 line-through decoration-1' : 'text-white'
        }`}
      >
        {value}
      </motion.div>
      <div className="text-[9.5px] text-zinc-500 mt-1 uppercase tracking-wider leading-tight">
        {label}
      </div>
    </div>
  );
}
