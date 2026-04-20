'use client';

import { easeOutExpo } from '@/lib/motion';
import { motion } from 'framer-motion';
import PhoneMockup from './PhoneMockup';

const screens = [
  {
    title: 'Ana Akış',
    description:
      'Prism V3 Diamond algoritması, 12 sinyali birleştirerek senin için kişiselleştirilmiş Bean ve post akışı hazırlar. %70 kişisel, %30 keşif.',
    mockup: <FeedScreen />,
  },
  {
    title: 'Radar',
    description:
      'Anatolia engine ile yakınındaki Bean\'leri haritada gör. Viewport culling sayesinde binlerce Bean olsa bile akıcı.',
    mockup: <RadarScreen />,
  },
  {
    title: 'Bean Detayı',
    description:
      'Her Bean 4 saatlik samimi bir buluşma. Ev sahibi, katılımcılar, mekan, vibe tag\'leri — hepsi tek ekranda.',
    mockup: <BeanDetailScreen />,
  },
];

export default function Showcase() {
  return (
    <section className="relative py-24 md:py-40 overflow-hidden">
      <div className="container-x">
        <div className="max-w-3xl mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-[0.3em] text-acid mb-6 font-mono"
          >
            Uygulamada
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-section font-bold tracking-tight"
          >
            Minimal arayüz,
            <br />
            <span className="text-zinc-500">maksimum odaklanma.</span>
          </motion.h2>
        </div>

        <div className="space-y-32 md:space-y-40">
          {screens.map((screen, i) => (
            <motion.div
              key={screen.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 1, ease: easeOutExpo }}
              className={`grid lg:grid-cols-2 gap-12 lg:gap-24 items-center ${
                i % 2 === 1 ? 'lg:[&>div:first-child]:order-2' : ''
              }`}
            >
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-acid mb-3">
                  0{i + 1} / 0{screens.length}
                </div>
                <h3 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">
                  {screen.title}
                </h3>
                <p className="text-lg text-zinc-400 leading-relaxed max-w-xl">
                  {screen.description}
                </p>
              </div>
              <div className="flex justify-center">
                <PhoneMockup floating={false}>{screen.mockup}</PhoneMockup>
              </div>
            </motion.div>
          ))}
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
      {/* Map */}
      <div className="absolute inset-0 top-8">
        <div
          className="w-full h-full relative"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(168,230,0,0.08) 0%, transparent 40%), linear-gradient(180deg, #0a0a0a 0%, #050505 100%)',
          }}
        >
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
          {/* Markers */}
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
          {/* Self */}
          <div className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
            <div className="w-5 h-5 rounded-full bg-white border-2 border-acid" />
          </div>
          {/* Bottom card */}
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

function BeanDetailScreen() {
  return (
    <div className="h-full bg-midnight overflow-hidden">
      <div className="flex justify-between text-[10px] text-white/60 px-4 py-3">
        <span className="font-semibold">21:47</span>
        <span>●●● ●●</span>
      </div>
      {/* Cover */}
      <div className="relative h-36 bg-gradient-to-br from-purple-500/40 via-pink-500/20 to-amber-500/30">
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent" />
        <div className="absolute bottom-2 left-3 right-3">
          <div className="text-[10px] bg-white/20 backdrop-blur rounded-full px-2 py-0.5 inline-block mb-1">
            🎵 Vinyl Night
          </div>
          <div className="text-base font-bold">Kadıköy Retro Listening Party</div>
        </div>
      </div>
      {/* Details */}
      <div className="px-4 py-3 space-y-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-acid">●</span>
          <span className="text-zinc-400">Cumartesi · 20:00 — 00:00</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span>📍</span>
          <span className="text-zinc-400">Moda Sahnesi, Kadıköy</span>
        </div>
        {/* Host */}
        <div className="flex items-center gap-2 bg-elevated border border-white/5 rounded-xl p-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500" />
          <div className="flex-1">
            <div className="text-xs font-semibold">@kulturevi</div>
            <div className="text-[10px] text-zinc-500">Verified tribe · 2.4K tribe</div>
          </div>
          <div className="text-[10px] bg-white/10 rounded-full px-2 py-1">Takip</div>
        </div>
        {/* Attendees */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-700 border-2 border-midnight"
              />
            ))}
          </div>
          <span className="text-[10px] text-zinc-400">34 kişi Jump In etti</span>
        </div>
      </div>
      {/* CTA */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-acid text-midnight font-bold text-center py-3 rounded-2xl text-sm">
          Jump In →
        </div>
      </div>
    </div>
  );
}
