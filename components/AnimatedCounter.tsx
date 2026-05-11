'use client';

import { useReducedMotion, animate, useInView } from '@/lib/motion';
import { useEffect, useRef, useState } from 'react';

interface Props {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
}

/**
 * useInView + framer-motion animate ile sayaç animasyonu.
 * reduced-motion tercihine tam saygılı — tercih varsa anında final değer.
 */
export default function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 2,
  decimals = 0,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value, duration, reduced]);

  const formatted = decimals > 0 ? display.toFixed(decimals) : Math.round(display).toString();

  return (
    <span ref={ref}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
