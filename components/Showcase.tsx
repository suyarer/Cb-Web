'use client';

import { easeOutExpo } from '@/lib/motion';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import PhoneMockup from './PhoneMockup';

const screens = [
  {
    id: 'akis',
    title: 'Akış',
    description:
      'Sana gelecek Beans burada. Ama akışın bir bölümü daima konforunun dışında — yeni Club\'ları, tanımadığın vibe\'ları orada yakalarsın. Balon yok.',
    mockup: <FeedScreen />,
  },
  {
    id: 'radar',
    title: 'Radar',
    description:
      'Şehrin bu akşam ne yapıyor? Harita, mesafe, saat, vibe — tek ekran. Sıralamayı algoritma değil, filtrelerin belirler. Görünmeyen bir zemin var: sen.',
    mockup: <RadarScreen />,
  },
  {
    id: 'compass',
    title: 'Compass',
    description:
      'Bugün nasıl hissediyorsun? DENGE, COŞKU, SAKİN, YAKIN. Seçersin — keşif o ruh haline hizalanır, tüm uygulamanın tonu değişir. Kategori değil, atmosfer. Bu gece sadece bu gece için.',
    mockup: <CompassScreen />,
  },
  {
    id: 'bean',
    title: 'Bean detayı',
    description:
      'Kim, nerede, saat kaçta, kimler geliyor, TrustScore kaç — karar verecek her şey tek ekranda. Katıl, masa senin. Arkası yok, formülü yok.',
    mockup: <BeanDetailScreen />,
  },
];

export default function Showcase() {
  const reduced = useReducedMotion() ?? false;
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setActive((i) => (i + 1) % screens.length), 6000);
    return () => clearInterval(id);
  }, [reduced]);

  const current = screens[active];

  return (
    <section id="uygulamada" className="relative py-24 md:py-36 overflow-hidden">
      <div className="container-x">
        <div className="max-w-3xl mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-[0.3em] text-acid mb-6 font-mono"
          >
            İçinde neler var
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-section font-bold tracking-tight"
          >
            Dört ekran.
            <br />
            <span className="text-zinc-500">Beşincisi zaten dışarıda.</span>
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-center">
          {/* Sol: tab listesi + açıklama */}
          <div>
            <ul className="space-y-1 mb-10">
              {screens.map((s, i) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    className={`w-full text-left flex items-center gap-4 py-4 border-t transition group ${
                      i === active
                        ? 'border-acid/40'
                        : 'border-white/[0.06] hover:border-white/20'
                    }`}
                    aria-current={i === active}
                  >
                    <span
                      className={`text-xs font-mono uppercase tracking-wider ${
                        i === active ? 'text-acid' : 'text-zinc-600'
                      }`}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className={`text-xl md:text-2xl font-bold tracking-tight ${
                        i === active ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'
                      } transition`}
                    >
                      {s.title}
                    </span>
                    {i === active && (
                      <motion.span
                        layoutId="showcase-indicator"
                        className="ml-auto w-6 h-[2px] bg-acid"
                        transition={{ duration: 0.5, ease: easeOutExpo }}
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>

            <AnimatePresence mode="wait">
              <motion.p
                key={current.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: easeOutExpo }}
                className="text-lg text-zinc-400 leading-relaxed max-w-xl"
              >
                {current.description}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Sağ: Telefon + değişen içerik */}
          <div className="flex justify-center lg:justify-end">
            <PhoneMockup floating={false}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: easeOutExpo }}
                  className="h-full w-full"
                >
                  {current.mockup}
                </motion.div>
              </AnimatePresence>
            </PhoneMockup>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeedScreen() {
  return (
    <div className="h-full bg-midnight px-4 py-4 overflow-hidden relative">
      <div className="flex justify-between text-[10px] text-white/60 px-2 mb-4">
        <span className="font-semibold">21:47</span>
        <span>●●● ●●</span>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-lg font-bold">Akış</div>
        <div className="w-7 h-7 rounded-full bg-acid/20 border border-acid/40" />
      </div>
      <div className="space-y-3">
        {[
          { t: 'Sahne Altında Stand-Up', s: 'Beşiktaş · Cuma 20:00', g: 'from-rose-500/20 to-red-500/10', m: 91 },
          { t: 'Cihangir Yoga Meetup', s: 'Cihangir Park · Pazar 09:00', g: 'from-emerald-500/20 to-teal-500/10', m: 88 },
          { t: 'Startup Pitch Night', s: 'Zorlu PSM · Çarşamba', g: 'from-amber-500/20 to-orange-500/10', m: 82 },
          { t: 'Film Kulübü: Tarkovski', s: 'Ankara Kızılay · Perşembe', g: 'from-purple-500/20 to-indigo-500/10', m: 76 },
        ].map((item) => (
          <div
            key={item.t}
            className={`bg-gradient-to-br ${item.g} border border-white/5 rounded-2xl p-3`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] bg-white/10 rounded-full px-2 py-0.5">Bean</span>
              <span className="text-[10px] text-acid font-bold">%{item.m} match</span>
            </div>
            <div className="text-sm font-bold mb-1">{item.t}</div>
            <div className="text-[10px] text-zinc-400">{item.s}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RadarScreen() {
  return (
    <div className="h-full bg-midnight relative overflow-hidden">
      <div className="flex justify-between text-[10px] text-white/60 px-4 py-3">
        <span className="font-semibold">21:47</span>
        <span>●●● ●●</span>
      </div>
      <div className="absolute inset-0 top-8">
        <div
          className="w-full h-full relative"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(168,230,0,0.08) 0%, transparent 40%), linear-gradient(180deg, #0a0a0a 0%, #050505 100%)',
          }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
          {[
            { x: 45, y: 35, s: 'lg' },
            { x: 62, y: 52, s: 'md' },
            { x: 30, y: 60, s: 'sm' },
            { x: 55, y: 72, s: 'md' },
            { x: 70, y: 30, s: 'sm' },
          ].map((m, i) => (
            <div
              key={i}
              className="absolute"
              style={{ left: `${m.x}%`, top: `${m.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div
                className={`rounded-full bg-acid border-2 border-midnight shadow-lg shadow-acid/50 ${
                  m.s === 'lg' ? 'w-4 h-4' : m.s === 'md' ? 'w-3 h-3' : 'w-2 h-2'
                }`}
              />
              <div
                className={`absolute inset-0 rounded-full bg-acid/40 animate-ping ${
                  m.s === 'lg' ? 'w-4 h-4' : m.s === 'md' ? 'w-3 h-3' : 'w-2 h-2'
                }`}
              />
            </div>
          ))}
          <div className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
            <div className="w-5 h-5 rounded-full bg-white border-2 border-acid" />
          </div>
          <div className="absolute left-4 right-4 bottom-4 bg-elevated/90 backdrop-blur-xl border border-white/10 rounded-2xl p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold">Yakındaki Bean&apos;ler</div>
                <div className="text-[10px] text-zinc-500">12 aktif · 800m yarıçap</div>
              </div>
              <div className="text-[10px] bg-acid text-midnight font-bold px-3 py-1.5 rounded-full">
                Listele
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompassScreen() {
  const modes = [
    { key: 'DENGE', desc: 'Dengeli keşif', hue: 'from-zinc-400/30 to-zinc-600/10', dot: 'bg-zinc-300' },
    { key: 'COŞKU', desc: 'Enerji · kalabalık', hue: 'from-rose-500/40 to-amber-500/20', dot: 'bg-rose-400' },
    { key: 'SAKİN', desc: 'Sakin · yavaş sohbet', hue: 'from-teal-500/30 to-blue-500/20', dot: 'bg-teal-300' },
    { key: 'YAKIN', desc: 'Bildiğin yüzler', hue: 'from-acid/40 to-emerald-500/20', dot: 'bg-acid' },
  ];
  return (
    <div className="h-full bg-midnight overflow-hidden relative px-4 py-4">
      <div className="flex justify-between text-[10px] text-white/60 px-2 mb-4">
        <span className="font-semibold">21:47</span>
        <span>●●● ●●</span>
      </div>
      <div className="mb-3">
        <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
          Compass Mode
        </div>
        <div className="text-lg font-bold leading-tight">Bugün nasıl hissediyorsun?</div>
      </div>

      <div className="space-y-2">
        {modes.map((m, i) => (
          <div
            key={m.key}
            className={`relative rounded-2xl border p-3 bg-gradient-to-br ${m.hue} ${
              i === 3 ? 'border-acid/60' : 'border-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full ${m.dot}`} />
              <div className="flex-1">
                <div className="text-xs font-mono font-bold tracking-wider text-white">
                  {m.key}
                </div>
                <div className="text-[10px] text-zinc-300">{m.desc}</div>
              </div>
              {i === 3 && (
                <div className="text-[9px] bg-acid text-midnight font-bold px-2 py-0.5 rounded-full">
                  SEÇİLİ
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 right-4 bg-elevated/90 backdrop-blur-xl border border-white/10 rounded-2xl p-3">
        <div className="text-[10px] text-zinc-500 mb-1">Bu ayar, sadece bu gece için geçerli.</div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-white">Akışı güncelle</div>
          <div className="text-[10px] bg-acid text-midnight font-bold px-3 py-1.5 rounded-full">
            Uygula →
          </div>
        </div>
      </div>
    </div>
  );
}

function BeanDetailScreen() {
  return (
    <div className="h-full bg-midnight overflow-hidden relative">
      <div className="flex justify-between text-[10px] text-white/60 px-4 py-3">
        <span className="font-semibold">21:47</span>
        <span>●●● ●●</span>
      </div>
      <div className="relative h-36 bg-gradient-to-br from-purple-500/40 via-pink-500/20 to-amber-500/30">
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent" />
        <div className="absolute bottom-2 left-3 right-3">
          <div className="text-[10px] bg-white/20 backdrop-blur rounded-full px-2 py-0.5 inline-block mb-1">
            🎵 Vinyl Night
          </div>
          <div className="text-base font-bold">Kadıköy Retro Listening Party</div>
        </div>
      </div>
      <div className="px-4 py-3 space-y-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-acid">●</span>
          <span className="text-zinc-400">Cumartesi · 20:00 — 00:00</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span>📍</span>
          <span className="text-zinc-400">Moda Sahnesi, Kadıköy</span>
        </div>
        <div className="flex items-center gap-2 bg-elevated border border-white/5 rounded-xl p-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500" />
          <div className="flex-1">
            <div className="text-xs font-semibold">@kulturevi</div>
            <div className="text-[10px] text-zinc-500">Doğrulanmış · 2.4K üye</div>
          </div>
          <div className="text-[10px] bg-white/10 rounded-full px-2 py-1">Takip</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-700 border-2 border-midnight"
              />
            ))}
          </div>
          <span className="text-[10px] text-zinc-400">34 kişi katıldı</span>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-acid text-midnight font-bold text-center py-3 rounded-2xl text-sm">
          Katıl →
        </div>
      </div>
    </div>
  );
}
