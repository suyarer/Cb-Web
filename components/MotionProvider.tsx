'use client';

import { LazyMotion, domAnimation } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * LazyMotion + domAnimation bridge.
 * Bundle 34KB → 4.6KB initial render (rest async loaded).
 *
 * IMPORTANT: Bu wrapper içinde sadece `m.X` (proxied as `motion.X` via lib/motion.ts) çalışır.
 * Direkt `import { motion } from 'framer-motion'` kullanılırsa "Failed to lazy-load motion features"
 * uyarısı gelir (strict mode kapalı, sadece warning).
 *
 * domAnimation features:
 * - animate, initial, exit, transition, variants
 * - whileHover, whileTap, whileFocus, whileInView
 * - layout (basic)
 *
 * NOT included: drag, pan, dragControls (domMax gerektirir).
 * Eğer drag kullanırsak → features={domMax} olarak yükselt.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
