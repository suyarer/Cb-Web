'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

type Props = {
  size?: number;
  /** Filizlenme animasyonu — mount sonrası kısa bir gecikmeyle otomatik oynar */
  animated?: boolean;
  /** Sürekli hafif nefes (pulse) — marka vurgu noktalarında */
  breathe?: boolean;
  /** Sadece scroll ile görünür olunca tetikle (default: mount sonrası hemen) */
  onScrollOnly?: boolean;
  className?: string;
  ariaLabel?: string;
};

export default function BeanSprout({
  size = 40,
  animated = false,
  breathe = false,
  onScrollOnly = false,
  className,
  ariaLabel = 'ClubBeans — filizlenen topluluk',
}: Props) {
  const reduced = useReducedMotion() ?? false;
  const doAnimate = animated && !reduced;

  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const [playing, setPlaying] = useState(!doAnimate);

  useEffect(() => {
    if (!doAnimate) {
      setPlaying(true);
      return;
    }
    if (onScrollOnly) {
      if (inView) setPlaying(true);
      return;
    }
    // Mount sonrası 120ms'lik küçük gecikme — css/font stabilize olsun
    const id = setTimeout(() => setPlaying(true), 120);
    return () => clearTimeout(id);
  }, [doAnimate, inView, onScrollOnly]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.18, delayChildren: 0.1 },
    },
  };

  const beanVariants = {
    hidden: { scaleY: 0, opacity: 0 },
    visible: {
      scaleY: 1,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const stemVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 0.55, ease: 'easeOut' as const },
    },
  };

  const leftLeafVariants = {
    hidden: { scale: 0, opacity: 0, rotate: -30 },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const rightLeafVariants = {
    hidden: { scale: 0, opacity: 0, rotate: 30 },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <motion.svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 100 120"
      role="img"
      aria-label={ariaLabel}
      className={className}
      variants={containerVariants}
      initial={doAnimate ? 'hidden' : 'visible'}
      animate={playing ? 'visible' : 'hidden'}
      {...(breathe && !reduced ? { whileHover: { scale: 1.06 } } : {})}
    >
      <defs>
        <linearGradient id="cb-bean-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7ED848" />
          <stop offset="55%" stopColor="#3EA52A" />
          <stop offset="100%" stopColor="#1C6A13" />
        </linearGradient>
        <linearGradient id="cb-leaf-right" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#6BB01E" />
          <stop offset="100%" stopColor="#CBEC4A" />
        </linearGradient>
        <linearGradient id="cb-leaf-left" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E5E4E" />
          <stop offset="100%" stopColor="#0E3A2E" />
        </linearGradient>
      </defs>

      {/* Bean — altta fasulye gövdesi (origin bottom, yukarı doğru büyür) */}
      <motion.path
        d="M 12 78 C 12 92 26 102 50 102 C 74 102 88 92 88 78 C 88 72 85 66 78 66 L 22 66 C 15 66 12 72 12 78 Z"
        fill="url(#cb-bean-grad)"
        variants={beanVariants}
        style={{ transformOrigin: '50% 100%' }}
      />
      {/* Bean içi ışık — minimal 3D hissi */}
      <motion.path
        d="M 24 74 C 24 70 28 68 36 68 L 62 68 C 70 68 74 70 72 74"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
        variants={beanVariants}
      />

      {/* Sap — bean'den yukarı çıkar */}
      <motion.path
        d="M 50 66 C 50 58 50 52 50 40"
        stroke="#3EA52A"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        variants={stemVariants}
      />

      {/* Sol yaprak (koyu teal, önce küçük, yukarı-sola) */}
      <motion.path
        d="M 50 44 C 36 40 24 30 22 18 C 36 18 48 30 50 44 Z"
        fill="url(#cb-leaf-left)"
        variants={leftLeafVariants}
        style={{ transformOrigin: '50% 44px' }}
      />
      {/* Sol yaprak damar çizgisi */}
      <motion.path
        d="M 50 44 C 40 36 30 28 24 20"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
        variants={leftLeafVariants}
      />

      {/* Sağ yaprak (acid-lime, daha büyük, yukarı-sağa) */}
      <motion.path
        d="M 50 44 C 66 38 80 26 82 12 C 68 13 54 26 50 44 Z"
        fill="url(#cb-leaf-right)"
        variants={rightLeafVariants}
        style={{ transformOrigin: '50% 44px' }}
      />
      {/* Sağ yaprak damar çizgisi */}
      <motion.path
        d="M 50 44 C 60 36 72 26 80 14"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
        variants={rightLeafVariants}
      />

      {/* Nefes pulse — breathe=true ise */}
      {breathe && !reduced && (
        <motion.circle
          cx="50"
          cy="84"
          r="36"
          fill="rgba(168, 230, 0, 0.08)"
          animate={{
            scale: [1, 1.18, 1],
            opacity: [0.4, 0, 0.4],
          }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: [0.45, 0, 0.55, 1] as const,
          }}
          style={{ transformOrigin: '50% 84%' }}
        />
      )}
    </motion.svg>
  );
}
