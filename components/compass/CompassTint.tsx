'use client';

import { motion } from 'framer-motion';
import { useCompass } from './CompassContext';

export default function CompassTint() {
  const { color } = useCompass();
  return (
    <motion.div
      aria-hidden
      animate={{
        background: `radial-gradient(ellipse 70% 40% at 50% 0%, rgba(${color.glow}, 0.22), transparent 70%)`,
      }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 pointer-events-none z-[1] mix-blend-screen"
    />
  );
}
