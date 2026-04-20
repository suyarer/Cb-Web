/**
 * Ortak Framer Motion easing & transition preset'leri.
 * Linear/Vercel/Apple tarzı yumuşak ama güçlü hareket için.
 */
import { cubicBezier } from 'framer-motion';

export const easeOutExpo = cubicBezier(0.22, 1, 0.36, 1);

export const transitions = {
  fast: { duration: 0.4, ease: easeOutExpo },
  default: { duration: 0.8, ease: easeOutExpo },
  slow: { duration: 1, ease: easeOutExpo },
} as const;
