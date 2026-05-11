'use client';

import { easeOutExpo } from '@/lib/motion';
import { motion } from '@/lib/motion';
import Link from 'next/link';

// Alt sayfaların üstünde mini breadcrumb + başlık hero'su.
// Ana sayfaya "geri" linki sürekli görünür.
export default function SubPageHeader({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative pt-28 md:pt-32 pb-12 md:pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none" />
      <div className="container-x relative">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-acid transition no-underline mb-8 min-h-[44px]"
        >
          <span>←</span>
          <span>Ana sayfa</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOutExpo }}
        >
          <div className="text-xs uppercase tracking-[0.3em] text-acid mb-4 font-mono">
            {kicker}
          </div>
          <h1 className="text-display font-bold tracking-tight text-white leading-tight mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
