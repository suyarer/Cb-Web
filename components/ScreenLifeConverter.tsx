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
            <span className="text-zinc-500">başka bir hayatı kurardı.</span>
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
              <input
                id="hours-slider"
                type="range"
                min={1}
                max={12}
                step={1}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full cursor-pointer cb-slider"
                aria-label="Ekran saati seçici"
              />
              <div className="flex justify-between mt-2 text-[10px] font-mono text-zinc-600">
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
                Bir yılın yarısını ekrana verdin. ClubBeans onun bir bölümünü geri almaya geldi.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Custom slider styling */}
      <style jsx global>{`
        .cb-slider {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          height: 32px;
        }
        .cb-slider::-webkit-slider-runnable-track {
          height: 4px;
          background: linear-gradient(
            to right,
            #A8E600 0%,
            #A8E600 var(--fill, 40%),
            rgba(255, 255, 255, 0.08) var(--fill, 40%),
            rgba(255, 255, 255, 0.08) 100%
          );
          border-radius: 999px;
        }
        .cb-slider::-moz-range-track {
          height: 4px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 999px;
        }
        .cb-slider::-moz-range-progress {
          height: 4px;
          background: #A8E600;
          border-radius: 999px;
        }
        .cb-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #A8E600;
          border: 3px solid #050505;
          margin-top: -8px;
          cursor: pointer;
          box-shadow: 0 0 0 1px rgba(168, 230, 0, 0.5), 0 0 20px rgba(168, 230, 0, 0.4);
        }
        .cb-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #A8E600;
          border: 3px solid #050505;
          cursor: pointer;
          box-shadow: 0 0 0 1px rgba(168, 230, 0, 0.5), 0 0 20px rgba(168, 230, 0, 0.4);
        }
      `}</style>
    </section>
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
