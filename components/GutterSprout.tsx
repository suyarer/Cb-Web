'use client';

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

// Scroll ile eş zamanlı büyüyen dikey filiz.
// Sayfanın sağ kenarında küçük bir dikey kolon; aşağı kaydırdıkça sap uzar,
// 4 ayrı scroll noktasında yaprak açılır. Launch'a ulaştığında "tam filiz".
export default function GutterSprout() {
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll();

  // Smooth spring — scroll titreşimlerini süz
  const progress = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 22,
    restDelta: 0.001,
  });

  // Sap: 0→1 progress ile tam ölçek
  const stemScaleY = useTransform(progress, [0, 1], [0.02, 1]);

  // Yapraklar: belirli eşiklerde açılır
  const leaf1 = useTransform(progress, [0.08, 0.18], [0, 1]);
  const leaf2 = useTransform(progress, [0.28, 0.4], [0, 1]);
  const leaf3 = useTransform(progress, [0.5, 0.62], [0, 1]);
  const leaf4 = useTransform(progress, [0.72, 0.84], [0, 1]);
  // Taç yapraklar — sap'ın tepesinde, scroll sonunda açılır
  const crown = useTransform(progress, [0.88, 1], [0, 1]);

  // Bean alt kısmı progress'e göre doygunluk
  const beanOpacity = useTransform(progress, [0, 0.1], [0.35, 1]);

  if (reduced) return null;

  return (
    <div
      aria-hidden
      className="block fixed top-0 right-1.5 md:right-4 lg:right-6 h-screen w-3 md:w-4 z-[3] pointer-events-none"
    >
      <div className="relative h-full w-full flex flex-col items-center justify-end">
        {/* Bean — sabit altta */}
        <motion.div
          style={{ opacity: beanOpacity }}
          className="absolute bottom-10 -left-1.5 md:-left-1.5"
        >
          <svg
            width="22"
            height="16"
            viewBox="0 0 28 20"
            className="drop-shadow-[0_0_10px_rgba(168,230,0,0.35)] md:w-[28px] md:h-[20px]"
          >
            <defs>
              <linearGradient id="gs-bean" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7ED848" />
                <stop offset="60%" stopColor="#3EA52A" />
                <stop offset="100%" stopColor="#1C6A13" />
              </linearGradient>
            </defs>
            <path
              d="M 2 10 C 2 16 6 18 14 18 C 22 18 26 16 26 10 C 26 7 24 5 20 5 L 8 5 C 4 5 2 7 2 10 Z"
              fill="url(#gs-bean)"
            />
          </svg>
        </motion.div>

        {/* Dikey sap — bean'den yukarı çıkar, scroll ile uzar */}
        <motion.div
          style={{ scaleY: stemScaleY, transformOrigin: '50% 100%' }}
          className="absolute bottom-[3.6rem] md:bottom-[4rem] left-1/2 -translate-x-1/2 w-[1.5px] md:w-[2px] h-[70vh] bg-gradient-to-t from-acid via-acid/70 to-acid/10 rounded-full"
        />

        {/* 4 yaprak, farklı yükseklik ve yön */}
        <Leaf yTop="calc(3.6rem + 15%)" side="right" opacityMV={leaf1} />
        <Leaf yTop="calc(3.6rem + 35%)" side="left" opacityMV={leaf2} darker />
        <Leaf yTop="calc(3.6rem + 52%)" side="right" opacityMV={leaf3} />
        <Leaf yTop="calc(3.6rem + 68%)" side="left" opacityMV={leaf4} darker />

        {/* Tepede taç filizi — scroll %88+ olunca iki simetrik yaprak açılır */}
        <Crown opacityMV={crown} />
      </div>
    </div>
  );
}

function Crown({
  opacityMV,
}: {
  opacityMV: ReturnType<typeof useTransform<number, number>>;
}) {
  return (
    <motion.div
      style={{
        opacity: opacityMV,
        scale: opacityMV,
        // transform-origin alt-merkez → root noktasından büyür
        transformOrigin: '50% 100%',
      }}
      // bottom = sap bottom + stem height — sap tepesiyle tam hizalanır
      className="absolute left-1/2 -translate-x-1/2 bottom-[calc(3.6rem+70vh)] md:bottom-[calc(4rem+70vh)]"
    >
      <div className="relative">
        {/* Parıltı (scroll sonunda "görev tamamlandı" hissi) */}
        <motion.div
          style={{ opacity: opacityMV }}
          className="absolute inset-0 -m-6 bg-acid/25 blur-2xl rounded-full pointer-events-none"
          aria-hidden
        />

        {/*
          viewBox 0 0 32 22 → SVG'nin ALT kenarı = yaprak kök noktası.
          Böylece element'in CSS bottom'u = sap tepesi tam yaprak kökü
          ile çakışır, gap kalmaz.
        */}
        <svg
          width="32"
          height="22"
          viewBox="0 0 32 22"
          className="relative block drop-shadow-[0_0_10px_rgba(168,230,0,0.6)] md:w-[40px] md:h-[28px]"
        >
          <defs>
            <linearGradient id="gs-crown-l" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E5E4E" />
              <stop offset="100%" stopColor="#0E3A2E" />
            </linearGradient>
            <linearGradient id="gs-crown-r" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#6BB01E" />
              <stop offset="100%" stopColor="#CBEC4A" />
            </linearGradient>
          </defs>
          {/* Sol yaprak — root (16,22) = SVG alt-merkez */}
          <path
            d="M 16 22 C 8 18 3 10 5 3 C 12 4 17 12 16 22 Z"
            fill="url(#gs-crown-l)"
          />
          {/* Sağ yaprak — root (16,22) = SVG alt-merkez */}
          <path
            d="M 16 22 C 24 18 29 10 27 3 C 20 4 15 12 16 22 Z"
            fill="url(#gs-crown-r)"
          />
          {/* Merkez küçük parıltı — yaprak köküne vurgu */}
          <circle cx="16" cy="21" r="1.2" fill="#A8E600" opacity="0.85" />
        </svg>
      </div>
    </motion.div>
  );
}

function Leaf({
  yTop,
  side,
  opacityMV,
  darker = false,
}: {
  yTop: string;
  side: 'left' | 'right';
  opacityMV: ReturnType<typeof useTransform<number, number>>;
  darker?: boolean;
}) {
  const isLeft = side === 'left';
  return (
    <motion.div
      style={{
        bottom: yTop,
        opacity: opacityMV,
        scale: opacityMV,
      }}
      className={`absolute ${isLeft ? 'right-3' : 'left-3'}`}
    >
      <svg
        width="18"
        height="11"
        viewBox="0 0 22 14"
        className="md:w-[22px] md:h-[14px]"
        style={{
          transform: isLeft ? 'scaleX(-1)' : undefined,
          filter: darker
            ? 'drop-shadow(0 0 6px rgba(46,100,50,0.4))'
            : 'drop-shadow(0 0 8px rgba(168,230,0,0.45))',
        }}
      >
        <defs>
          <linearGradient id={`gs-leaf-${side}-${darker ? 'd' : 'l'}`} x1="0" y1="0" x2="1" y2="0.5">
            {darker ? (
              <>
                <stop offset="0%" stopColor="#1E5E4E" />
                <stop offset="100%" stopColor="#0E3A2E" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#6BB01E" />
                <stop offset="100%" stopColor="#CBEC4A" />
              </>
            )}
          </linearGradient>
        </defs>
        <path
          d="M 1 7 C 4 3 10 1 17 2 C 20 4 21 8 19 11 C 13 13 5 12 1 7 Z"
          fill={`url(#gs-leaf-${side}-${darker ? 'd' : 'l'})`}
        />
      </svg>
    </motion.div>
  );
}
