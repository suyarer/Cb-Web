'use client';

import DownloadButtons from '@/components/DownloadButtons';
import { easeOutExpo } from '@/lib/motion';
import { motion } from '@/lib/motion';

// Alt sayfa sonunda conversion CTA — indirme modülü.
export default function SubPageCTA({
  source,
  headline = 'İkna olduysan masaya yer ayır.',
  subtitle = 'Uygulamayı indir, yakınındaki etkinlikleri keşfet ya da bir dakikada kendi kulübünü kur.',
}: {
  source: string;
  headline?: string;
  subtitle?: string;
}) {
  return (
    <section className="relative py-20 md:py-28 border-t border-border overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow opacity-40 pointer-events-none" />
      <div className="container-x relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: easeOutExpo }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="text-xs uppercase tracking-[0.3em] text-acid mb-4 font-mono">
            Hemen indir
          </div>
          <h2 className="text-section font-bold tracking-tight text-white leading-tight mb-5">
            {headline}
          </h2>
          <p className="text-base md:text-lg text-zinc-400 mb-8">{subtitle}</p>
          <div className="flex justify-center">
            <DownloadButtons source={source} align="center" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
