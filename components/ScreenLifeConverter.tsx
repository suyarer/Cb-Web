'use client';

import { easeOutExpo } from '@/lib/motion';
import { motion } from 'framer-motion';
import { useState } from 'react';

// Dönüşüm mantığı — ortalama rakamlar:
// Ortalama post tarama: 1 dakikada ~12 post (feed scroll)
// 1 Bean = 4 saat fiziksel zaman
// 1 yürüyüş = 45 dk, ~3km
// 1 sohbet = 20-40 dk
function conversions(hours: number) {
  const postsScrolled = Math.round(hours * 60 * 12);
  const beans = Math.round((hours / 4) * 10) / 10; // 1 ondalık
  const walks = Math.round((hours * 60) / 45);
  const talks = Math.round((hours * 60) / 30);

  return { postsScrolled, beans, walks, talks };
}

export default function ScreenLifeConverter() {
  const [hours, setHours] = useState(5);
  const c = conversions(hours);

  return (
    <section id="donusturucu" className="relative py-24 md:py-36 overflow-hidden">
      <div className="container-x">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.3em] text-acid mb-6 font-mono text-center"
          >
            Bir hesap yap · ekran neye dönüşürdü
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="text-section font-bold tracking-tight text-white text-center mb-12"
          >
            Ekran saatlerin
            <br />
            <span className="text-zinc-500">başka bir hayat kurabilirdi.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, delay: 0.15, ease: easeOutExpo }}
            className="bg-elevated border border-border rounded-3xl p-6 md:p-10"
          >
            {/* Slider */}
            <div className="mb-10">
              <div className="flex items-baseline justify-between mb-3">
                <label htmlFor="hours-slider" className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500">
                  Günde ortalama ekran
                </label>
                <div className="flex items-baseline gap-1">
                  <motion.span
                    key={hours}
                    initial={{ y: -6, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="text-5xl md:text-6xl font-black text-acid tabular-nums"
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
              <div className="flex justify-between mt-3 text-[10px] font-mono text-zinc-600">
                <span>1 sa</span>
                <span>6 sa</span>
                <span>12 sa</span>
              </div>
            </div>

            {/* Dönüşüm kartları */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              <ConversionCard icon="📱" value={c.postsScrolled.toLocaleString('tr-TR')} label="post kaydırma" muted />
              <ConversionCard icon="☕" value={c.beans.toString()} label="Bean" accent />
              <ConversionCard icon="🚶" value={c.walks.toString()} label="45 dk yürüyüş" accent />
              <ConversionCard icon="💬" value={c.talks.toString()} label="gerçek sohbet" accent />
            </div>

            <div className="pt-6 border-t border-white/[0.05] text-center">
              <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500 mb-2">
                Yılda
              </div>
              <div className="text-lg md:text-xl text-white font-semibold">
                {Math.round(hours * 365).toLocaleString('tr-TR')} saat ekran —{' '}
                <span className="text-acid">{Math.round(hours * 365 / 24).toLocaleString('tr-TR')} gün</span>
              </div>
              <p className="text-sm text-zinc-500 mt-2 max-w-md mx-auto">
                Yılın{' '}
                <span className="text-zinc-300">
                  %{Math.round((hours * 365 / 24 / 365) * 100)}&apos;ini
                </span>{' '}
                ekrana verdin. ClubBeans onun bir bölümünü geri almaya geldi.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

    </section>
  );
}

// Custom slider — native input'u görünmez yapıp üstte custom track/thumb çizer.
// Track fill SVG/div ile, thumb glow'lu dairedir. Cross-browser 1:1 görünüm.
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
      {/* Track arkaplanı */}
      <div className="absolute left-0 right-0 h-[5px] bg-white/[0.06] rounded-full" />

      {/* Dolu kısım — acid gradient */}
      <motion.div
        animate={{ width: `${percent}%` }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className="absolute left-0 h-[5px] bg-gradient-to-r from-acid-600 via-acid to-acid-400 rounded-full shadow-[0_0_16px_rgba(168,230,0,0.45)]"
      />

      {/* Thumb — glow'lu daire */}
      <motion.div
        animate={{ left: `${percent}%` }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className="absolute w-5 h-5 -translate-x-1/2 rounded-full bg-acid border-[3px] border-midnight pointer-events-none"
        style={{
          boxShadow:
            '0 0 0 1px rgba(168,230,0,0.5), 0 0 24px rgba(168,230,0,0.55)',
        }}
      />

      {/* Native input — görünmez ama tıklanabilir (erişilebilirlik + touch) */}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Ekran saati seçici"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        style={{ WebkitAppearance: 'none' }}
      />
    </div>
  );
}

function ConversionCard({
  icon,
  value,
  label,
  muted = false,
  accent = false,
}: {
  icon: string;
  value: string;
  label: string;
  muted?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-4 text-center border ${
        muted
          ? 'bg-white/[0.02] border-white/[0.04]'
          : 'bg-acid/[0.04] border-acid/20'
      }`}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <motion.div
        key={value}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`text-xl md:text-2xl font-black tabular-nums ${
          muted ? 'text-zinc-600 line-through decoration-1' : accent ? 'text-white' : 'text-white'
        }`}
      >
        {value}
      </motion.div>
      <div className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}
