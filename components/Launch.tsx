'use client';

import DownloadButtons from '@/components/DownloadButtons';
import SubscribeForm from '@/components/SubscribeForm';
import { easeOutExpo } from '@/lib/motion';
import { motion } from '@/lib/motion';

export default function Launch() {
  return (
    <section id="launch" className="relative py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      <div className="container-x relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: easeOutExpo }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-acid mb-6 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-acid brand-pulse" aria-hidden />
            Artık yayında
          </div>

          <h2 className="text-display font-bold tracking-tight mb-6">
            <span className="text-gradient-acid">Telefonuna al</span>,
            <br className="md:hidden" /> hayata dön.
          </h2>

          <p className="text-lg text-zinc-400 max-w-xl mx-auto mb-10">
            ClubBeans App Store ve Google Play&apos;de. Ücretsiz indir,
            yakınındaki etkinlikleri keşfet ya da bir dakikada kendi kulübünü kur.
          </p>

          <div className="flex justify-center mb-8">
            <DownloadButtons source="launch" align="center" />
          </div>

          {/* İkincil — bülten: indirmeden güncel kalmak isteyenler için */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-px flex-1 bg-zinc-800" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600">
                veya — güncel kal
              </span>
              <span className="h-px flex-1 bg-zinc-800" />
            </div>
            <SubscribeForm source="launch" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
