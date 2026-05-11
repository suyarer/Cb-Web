/**
 * Framer Motion wrapper — LazyMotion + m component pattern.
 *
 * Bundle optimization: `motion` → `m` proxy.
 * Component'ler `from '@/lib/motion'` import ederek değişmez kalır,
 * ama gerçekte `m` (4.6KB) component'i kullanılır.
 *
 * LazyMotion features={domAnimation} root layer'da MotionProvider'da sarılı.
 *
 * Tüm hook'lar + utilities buradan re-export edilir.
 */
import {
  animate,
  AnimatePresence,
  cubicBezier,
  m,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';

// `motion` import edilince `m` döner — component body değişmez (motion.div hâlâ çalışır)
export {
  animate,
  AnimatePresence,
  cubicBezier,
  m as motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
};

// ─── Mevcut helpers ─────────────────────────────────────────
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
