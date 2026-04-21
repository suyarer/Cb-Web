'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type CompassMode = 'NEUTRAL' | 'HYPE' | 'CHILL' | 'TRIBE';

export const COMPASS_MODES: Record<
  CompassMode,
  { glow: string; accent: string; label: string; hint: string }
> = {
  NEUTRAL: {
    glow: '168, 230, 0',
    accent: '#A8E600',
    label: 'DENGE',
    hint: 'her şeyden biraz · dengeli keşif',
  },
  HYPE: {
    glow: '244, 114, 82',
    accent: '#F47252',
    label: 'COŞKU',
    hint: 'enerji · kalabalık masa',
  },
  CHILL: {
    glow: '94, 194, 210',
    accent: '#5EC2D2',
    label: 'SAKİN',
    hint: 'yavaş sohbet · küçük masa',
  },
  TRIBE: {
    glow: '134, 222, 134',
    accent: '#86DE86',
    label: 'YAKIN',
    hint: 'bildiğin yüzler · tanıdık çevre',
  },
};

type Ctx = {
  mode: CompassMode;
  setMode: (m: CompassMode) => void;
  color: (typeof COMPASS_MODES)[CompassMode];
};

const CompassContext = createContext<Ctx>({
  mode: 'NEUTRAL',
  setMode: () => {},
  color: COMPASS_MODES.NEUTRAL,
});

export function CompassProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<CompassMode>('NEUTRAL');

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--compass-glow', COMPASS_MODES[mode].glow);
    root.style.setProperty('--compass-accent', COMPASS_MODES[mode].accent);
    root.dataset.compass = mode.toLowerCase();
  }, [mode]);

  return (
    <CompassContext.Provider value={{ mode, setMode, color: COMPASS_MODES[mode] }}>
      {children}
    </CompassContext.Provider>
  );
}

export const useCompass = () => useContext(CompassContext);
