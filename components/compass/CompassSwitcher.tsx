'use client';

import { motion } from 'framer-motion';
import { COMPASS_MODES, CompassMode, useCompass } from './CompassContext';

export default function CompassSwitcher() {
  const { mode, setMode, color } = useCompass();
  const keys = Object.keys(COMPASS_MODES) as CompassMode[];

  return (
    <div className="inline-flex flex-col gap-2.5">
      <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500">
        Bu akşam nasıl hissediyorsun? <span className="text-zinc-700">· Compass</span>
      </span>
      <div
        className="inline-flex items-center gap-0.5 p-1 bg-white/[0.03] border rounded-full transition-colors duration-500 self-start max-w-full"
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
              className={`relative px-2.5 md:px-3.5 py-1.5 md:py-2 rounded-full text-[10.5px] md:text-[11px] font-mono font-bold uppercase tracking-wider transition whitespace-nowrap ${
                active ? 'text-midnight' : 'text-zinc-400 hover:text-white'
              }`}
              title={c.hint}
            >
              {active && (
                <motion.span
                  layoutId="compass-bubble"
                  className="absolute inset-0 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
                  style={{ backgroundColor: c.accent }}
                  transition={{ type: 'spring', stiffness: 340, damping: 28 }}
                />
              )}
              <span className="relative flex items-center gap-1 md:gap-1.5">
                <span
                  className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full transition-transform"
                  style={{
                    backgroundColor: active ? 'rgba(5,5,5,0.7)' : c.accent,
                    transform: active ? 'scale(1.3)' : 'scale(1)',
                  }}
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
