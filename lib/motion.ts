/**
 * Ortak Framer Motion easing, transition & helper hook'ları.
 * Linear/Vercel/Apple tarzı yumuşak ama güçlü hareket için.
 */
import { cubicBezier } from 'framer-motion';

export const easeOutExpo = cubicBezier(0.22, 1, 0.36, 1);
export const easeInOutSoft = cubicBezier(0.65, 0, 0.35, 1);

export const transitions = {
  fast: { duration: 0.4, ease: easeOutExpo },
  default: { duration: 0.8, ease: easeOutExpo },
  slow: { duration: 1, ease: easeOutExpo },
} as const;

/**
 * Kullanıcının prefers-reduced-motion tercihine saygı duyan motion variant helper'ı.
 */
export const fadeUpVariant = (reduced = false) => ({
  hidden: { opacity: 0, y: reduced ? 0 : 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: reduced ? 0 : 0.15 + i * 0.08,
      duration: reduced ? 0 : 0.8,
      ease: easeOutExpo,
    },
  }),
});
