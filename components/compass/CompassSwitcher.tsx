'use client';

import { motion } from 'framer-motion';
import { COMPASS_MODES, CompassMode, useCompass } from './CompassContext';

export default function CompassSwitcher() {
  const { mode, setMode, color } = useCompass();
  const keys = Object.keys(COMPASS_MODES) as CompassMode[];

  return (
    <div className="inline-flex flex-col gap-2.5">
      <span className="text-[10px] font-mono uppercase tracking-[0.2em] md:tracking-[0.25em] text-zinc-500">
        Bu akşam hangi modundasın?{' '}
        <span className="text-zinc-600">· sayfanın tonu değişsin</span>
      </span>
      <div
        className="inline-flex items-center p-1 bg-white/[0.03] border rounded-full transition-colors duration-500 self-start"
        style={{ borderColor: `${color.accent}30` }}
      >
        {keys.map((k) => {
          const active = mode === k;
          const c = COMPASS_MODES[k];
          return (
            <button
              key={k}
              type="button"
              onClick={() => setMode(k)}
              aria-pressed={active}
              className={`relative px-3 py-2 min-h-[44px] rounded-full text-[10.5px] font-mono font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                active ? 'text-midnight' : 'text-zinc-400 hover:text-white'
              }`}
              title={c.hint}
            >
              {active && (
                <motion.span
                  layoutId="compass-bubble"
                  className="absolute inset-0 rounded-full"
                  style={{
                    backgroundColor: c.accent,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                />
              )}
              <span className="relative flex items-center gap-1.5">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full"
                  animate={{
                    backgroundColor: active ? 'rgba(5,5,5,0.7)' : c.accent,
                    scale: active ? 1.3 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />
                {c.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
