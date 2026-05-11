'use client';

import { useInView } from '@/lib/motion';
import { useEffect, useRef, useState } from 'react';

// Kritik marka terimleri viewport'a girdiğinde tek seferlik acid glow
// animasyonu tetikler. `brandTermGlow` CSS keyframe'i globals.css'de.
export default function BrandTerm({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    if (inView && !played) setPlayed(true);
  }, [inView, played]);

  return (
    <span
      ref={ref}
      className={`${played ? 'brand-term-glow' : ''} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
