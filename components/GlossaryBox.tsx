'use client';

import { easeOutExpo } from '@/lib/motion';
import { motion } from '@/lib/motion';

// SSS sayfasında üste yerleştirilen mini terim kutusu.
// Sözlük sayfa kaldırıldığından, terimler ilk karşılaşmada burada toplu açıklanır.
const TERMS = [
  { t: 'Bean', d: 'Yakındaki fiziksel buluşma (kahve, koşu, pitch, kitap...)' },
  { t: 'Club (Kulüp)', d: 'Bir ilgi alanı etrafında kurulan topluluk' },
  { t: 'Kabile', d: 'Bir kulübün üye topluluğu; takipçi değil, kulübe ait kimlik' },
  { t: 'TrustScore', d: 'Sözünü tutmana göre artan 0-100 güven puanı' },
  { t: 'Compass', d: 'Ruh haline göre uygulamanın tonunu değiştiren mod' },
  { t: 'Sosyal Obezite', d: 'Çok dijital bağ, az gerçek karşılık — çağın hastalığı' },
];

export default function GlossaryBox() {
  return (
    <section className="relative py-8 md:py-10">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="max-w-3xl mx-auto bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 md:p-6"
        >
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-acid mb-3">
            Hızlı terimler
          </div>
          <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
            {TERMS.map((term) => (
              <div key={term.t} className="flex items-baseline gap-2">
                <dt className="font-semibold text-white flex-shrink-0">{term.t}:</dt>
                <dd className="text-zinc-400 text-xs md:text-sm">{term.d}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
