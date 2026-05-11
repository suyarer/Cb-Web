'use client';

import SubscribeForm from '@/components/SubscribeForm';
import { easeOutExpo } from '@/lib/motion';
import { motion } from '@/lib/motion';

// Alt sayfa sonunda conversion CTA — mail formu + ana sayfaya dön.
export default function SubPageCTA({
  source,
  headline = 'İkna olduysan masaya yer ayır.',
  subtitle = 'Lansman günü tek mail, tek link, tek davet kodu. Gerisi senin akşamın.',
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
            Lansmandan önce ilk sen
          </div>
          <h2 className="text-section font-bold tracking-tight text-white leading-tight mb-5">
            {headline}
          </h2>
          <p className="text-base md:text-lg text-zinc-400 mb-8">{subtitle}</p>
          <div className="flex justify-center">
            <SubscribeForm source={source} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
