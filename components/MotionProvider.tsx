'use client';

import { LazyMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { sadeMi } from '@/components/SiteKatmanlari';

/**
 * LazyMotion bridge — özellikler TEMBEL yüklenir.
 *
 * `domAnimation` statik import edilince (~32 KB gz) her rotanın paylaşılan
 * parçasına giriyordu; oyun rotası hiç motion bileşeni kullanmadığı hâlde
 * taşıyordu (denetim performans-4). Şimdi: sade rotalarda LazyMotion hiç yok,
 * diğerlerinde özellikler `import()` ile ilk gerekince gelir.
 *
 * IMPORTANT: Bu wrapper içinde sadece `m.X` (proxied as `motion.X` via lib/motion.ts) çalışır.
 * domAnimation: animate/initial/exit/variants/whileHover/whileTap/whileInView/layout(basic).
 * drag gerekirse features'ı domMax'e yükselt.
 */
const ozellikler = () => import('framer-motion').then((m) => m.domAnimation);

export default function MotionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (sadeMi(pathname)) return <>{children}</>;
  return <LazyMotion features={ozellikler}>{children}</LazyMotion>;
}
