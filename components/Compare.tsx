'use client';

import { easeOutExpo } from '@/lib/motion';
import { motion } from 'framer-motion';

type Val = { v: 'yes' | 'no' | 'partial'; label?: string };

const rows: { feature: string; cb: Val; timeleft: Val; meetup: Val; tinder: Val }[] = [
  {
    feature: 'Ücretsiz (abonelik yok)',
    cb: { v: 'yes' },
    timeleft: { v: 'no', label: 'Aylık ücret' },
    meetup: { v: 'partial', label: 'Organizatör ücretli' },
    tinder: { v: 'no', label: 'Premium' },
  },
  {
    feature: 'TrustScore — şeffaf güven',
    cb: { v: 'yes' },
    timeleft: { v: 'no' },
    meetup: { v: 'no' },
    tinder: { v: 'no' },
  },
  {
    feature: 'Kendi kulübünü 1 dakikada kur',
    cb: { v: 'yes' },
    timeleft: { v: 'no' },
    meetup: { v: 'partial', label: 'Ücretli' },
    tinder: { v: 'no' },
  },
  {
    feature: 'Algoritma dayatmasız keşif',
    cb: { v: 'yes' },
    timeleft: { v: 'no' },
    meetup: { v: 'no' },
    tinder: { v: 'no' },
  },
  {
    feature: 'Türkiye\'ye özel',
    cb: { v: 'yes' },
    timeleft: { v: 'partial' },
    meetup: { v: 'no' },
    tinder: { v: 'no' },
  },
];

function Cell({ val }: { val: Val }) {
  if (val.v === 'yes') {
    return (
      <div className="flex flex-col items-center gap-0.5">
        <div className="w-6 h-6 rounded-full bg-acid/15 border border-acid/40 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-acid" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        {val.label && <span className="text-[9px] text-acid/80 font-mono">{val.label}</span>}
      </div>
    );
  }
  if (val.v === 'no') {
    return (
      <div className="flex flex-col items-center gap-0.5">
        <div className="w-6 h-6 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-3 h-3 text-zinc-600" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        </div>
        {val.label && <span className="text-[9px] text-zinc-600 font-mono">{val.label}</span>}
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="w-6 h-6 rounded-full bg-white/[0.05] border border-white/15 flex items-center justify-center">
        <span className="w-2 h-[2px] bg-zinc-500" />
      </div>
      {val.label && <span className="text-[9px] text-zinc-500 font-mono">{val.label}</span>}
    </div>
  );
}

type Col = {
  key: string;
  name: string;
  hint?: string;
  highlight?: boolean;
  redacted?: boolean;
};

const cols: Col[] = [
  { key: 'cb', name: 'ClubBeans', highlight: true },
  { key: 'timeleft', name: 'Abonelikli akşam yemeği', hint: 'Batılı rakip', redacted: true },
  { key: 'meetup', name: 'Global meetup platformu', hint: 'Organizatör ücretli', redacted: true },
  { key: 'tinder', name: 'Flört odaklı IRL', hint: 'Abonelikli', redacted: true },
];

export default function Compare() {
  return (
    <section id="karsilastirma" className="relative py-24 md:py-36 overflow-hidden">
      <div className="container-x">
        <div className="max-w-3xl mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.3em] text-acid mb-6 font-mono"
          >
            Neden başka bir uygulamaya daha ihtiyacın var?
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="text-section font-bold tracking-tight text-white"
          >
            Yok, yok.
            <br />
            <span className="text-zinc-500">Aynı raf değiliz.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-zinc-400 max-w-2xl"
          >
            Yurt dışı uygulamalar abonelik satar, global platformlar organizatör
            ücreti ister, flört uygulamaları eşleştirir. Biz ücretsiz kalırız,
            algoritmayı sana bırakırız, güveni TrustScore ile ölçeriz. Türkiye için
            tasarlandık — aynı raf değiliz.
          </motion.p>
        </div>

        {/* Mobil: kart görünümü */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, ease: easeOutExpo }}
          className="md:hidden space-y-2.5"
        >
          {rows.map((row) => (
            <div
              key={row.feature}
              className="bg-elevated border border-border rounded-2xl p-4"
            >
              <div className="text-sm font-semibold text-white mb-3.5">
                {row.feature}
              </div>
              <div className="space-y-2">
                <MobileRow
                  cell={row.cb}
                  label="ClubBeans"
                  highlight
                />
                <MobileRow cell={row.timeleft} label="Abonelikli akşam yemeği" blurred />
                <MobileRow cell={row.meetup} label="Global meetup platformu" blurred />
                <MobileRow cell={row.tinder} label="Flört odaklı IRL" blurred />
              </div>
            </div>
          ))}
        </motion.div>

        {/* Tablet+: tam tablo */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, ease: easeOutExpo }}
          className="hidden md:block bg-elevated border border-border rounded-3xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-xs font-mono uppercase tracking-wider text-zinc-500 px-5 md:px-8 py-5">
                    Özellik
                  </th>
                  {cols.map((c) => (
                    <th
                      key={c.key}
                      className={`px-3 py-5 text-center text-sm font-bold align-bottom ${
                        c.highlight ? 'text-acid' : 'text-zinc-400'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1.5">
                        {c.highlight ? (
                          <>
                            <span className="w-6 h-[2px] bg-acid rounded-full" />
                            <span>{c.name}</span>
                          </>
                        ) : (
                          <>
                            <span
                              className="select-none text-zinc-400 tracking-wide"
                              style={{
                                filter: 'blur(5px)',
                                textShadow: '0 0 8px rgba(255,255,255,0.1)',
                              }}
                              aria-hidden="true"
                            >
                              {c.name}
                            </span>
                            {c.hint && (
                              <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-600 not-italic">
                                {c.hint}
                              </span>
                            )}
                            <span className="sr-only">Anonim rakip</span>
                          </>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={`${
                      i % 2 === 0 ? 'bg-white/[0.015]' : ''
                    } border-b border-white/[0.03] hover:bg-acid/[0.02] transition-colors duration-200`}
                  >
                    <td className="px-5 md:px-8 py-4 text-sm text-white">{row.feature}</td>
                    <td className="px-3 py-4">
                      <Cell val={row.cb} />
                    </td>
                    <td className="px-3 py-4">
                      <Cell val={row.timeleft} />
                    </td>
                    <td className="px-3 py-4">
                      <Cell val={row.meetup} />
                    </td>
                    <td className="px-3 py-4">
                      <Cell val={row.tinder} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <p className="mt-6 text-xs text-zinc-600 font-mono max-w-2xl">
          * Karşılaştırma, Nisan 2026 itibariyle aynı kategoride çalışan üç
          uluslararası uygulamanın kamuya açık özellikleri ve fiyatlandırmaları
          referans alınarak yapıldı. Markaları isimlendirmiyoruz;
          konuşulması gereken özellikler, markalar değil.
        </p>
      </div>
    </section>
  );
}

function MobileRow({
  cell,
  label,
  highlight = false,
  blurred = false,
}: {
  cell: Val;
  label: string;
  highlight?: boolean;
  blurred?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 py-1.5 px-2 rounded-lg ${
        highlight ? 'bg-acid/[0.04] border border-acid/20' : ''
      }`}
    >
      <span
        className={`text-xs truncate ${
          highlight ? 'text-acid font-semibold' : 'text-zinc-400'
        }`}
        style={
          blurred
            ? {
                filter: 'blur(3.5px)',
                textShadow: '0 0 6px rgba(255,255,255,0.08)',
              }
            : undefined
        }
        aria-hidden={blurred ? 'true' : undefined}
      >
        {label}
      </span>
      <span className="flex-shrink-0">
        <Cell val={cell} />
      </span>
    </div>
  );
}
