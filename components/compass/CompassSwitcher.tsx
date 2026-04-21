'use client';

import { motion } from 'framer-motion';
import { COMPASS_MODES, CompassMode, useCompass } from './CompassContext';

export default function CompassSwitcher() {
  const { mode, setMode } = useCompass();
  const keys = Object.keys(COMPASS_MODES) as CompassMode[];

  return (
    <div className="inline-flex flex-col gap-2">
      <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500">
        Compass · bu akşam nasıl hissediyorsun?
      </span>
      <div className="inline-flex items-center gap-1 p-1 bg-white/[0.03] border border-white/10 rounded-full">
        {keys.map((k) => {
          const active = mode === k;
          const color = COMPASS_MODES[k];
          return (
            <button
              key={k}
              type="button"
              onClick={() => setMode(k)}
              aria-pressed={active}
              className={`relative px-3 py-1.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider transition ${
                active ? 'text-midnight' : 'text-zinc-400 hover:text-white'
              }`}
              title={color.hint}
            >
              {active && (
                <motion.span
                  layoutId="compass-bubble"
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: color.accent }}
                  transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                />
              )}
              <span className="relative flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: active ? 'rgba(5,5,5,0.7)' : color.accent }}
                />
                {color.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
