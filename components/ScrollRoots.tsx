'use client';

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

// Sayfanın SOL kenarında scroll'a göre aşağı doğru uzayan kök sistemi.
// GutterSprout (sağ) yukarı büyür; ScrollRoots (sol) aşağı derinleşir.
// Birlikte tam bitki metaforu: tohum → filiz (yukarı) + kök (aşağı).
export default function ScrollRoots() {
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 22,
    restDelta: 0.001,
  });

  // Ana kök uzaması — scroll 0→1 arası
  const rootScale = useTransform(progress, [0, 1], [0.02, 1]);

  // Yan kökler belirli eşiklerde
  const side1 = useTransform(progress, [0.12, 0.22], [0, 1]);
  const side2 = useTransform(progress, [0.32, 0.44], [0, 1]);
  const side3 = useTransform(progress, [0.54, 0.66], [0, 1]);
  const side4 = useTransform(progress, [0.76, 0.88], [0, 1]);

  // Tohum noktası opacity (üstte)
  const seedOpacity = useTransform(progress, [0, 0.08], [0.3, 1]);

  if (reduced) return null;

  return (
    <div
      aria-hidden
      className="block fixed top-0 left-1.5 md:left-4 lg:left-6 h-screen w-3 md:w-4 z-[3] pointer-events-none"
    >
      <div className="relative h-full w-full flex flex-col items-center justify-start">
        {/* Tohum — üstte */}
        <motion.div
          style={{ opacity: seedOpacity }}
          className="absolute top-10 -right-0.5"
        >
          <svg width="14" height="10" viewBox="0 0 14 10">
            <defs>
              <linearGradient id="sr-seed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4A7C3A" />
                <stop offset="100%" stopColor="#1C4313" />
              </linearGradient>
            </defs>
            <ellipse cx="7" cy="5" rx="6" ry="4" fill="url(#sr-seed)" />
          </svg>
        </motion.div>

        {/* Ana kök — yukarıdan aşağı uzar.
            Dış wrapper pozisyon, iç motion scale — translate override'u önler. */}
        <div className="absolute top-[3rem] md:top-[3.2rem] left-1/2 -translate-x-1/2 w-[1.5px] md:w-[2px] h-[70vh]">
          <motion.div
            style={{ scaleY: rootScale, transformOrigin: '50% 0%' }}
            className="w-full h-full bg-gradient-to-b from-amber-900/50 via-amber-800/30 to-amber-900/10 rounded-full"
          />
        </div>

        {/* 4 yan kök — farklı yükseklik, sağa/sola çıkan */}
        <SideRoot yTop="calc(3rem + 15%)" side="right" opacityMV={side1} />
        <SideRoot yTop="calc(3rem + 32%)" side="left" opacityMV={side2} />
        <SideRoot yTop="calc(3rem + 50%)" side="right" opacityMV={side3} />
        <SideRoot yTop="calc(3rem + 68%)" side="left" opacityMV={side4} />
      </div>
    </div>
  );
}

function SideRoot({
  yTop,
  side,
  opacityMV,
}: {
  yTop: string;
  side: 'left' | 'right';
  opacityMV: ReturnType<typeof useTransform<number, number>>;
}) {
  const isLeft = side === 'left';
  return (
    <motion.div
      style={{
        top: yTop,
        opacity: opacityMV,
        scale: opacityMV,
      }}
      className={`absolute ${isLeft ? 'right-2' : 'left-2'}`}
    >
      <svg
        width="14"
        height="8"
        viewBox="0 0 14 8"
        style={{ transform: isLeft ? 'scaleX(-1)' : undefined }}
      >
        <path
          d="M 0 4 Q 5 4 10 2 Q 13 1 14 0"
          stroke="rgba(146, 104, 60, 0.6)"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 10 2 Q 12 2 13 3"
          stroke="rgba(146, 104, 60, 0.4)"
          strokeWidth="0.7"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}
