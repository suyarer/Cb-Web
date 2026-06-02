'use client';

import { easeOutExpo } from '@/lib/motion';
import { motion } from '@/lib/motion';

// SSS sayfasında üste yerleştirilen mini terim kutusu.
// Sözlük sayfa kaldırıldığından, terimler ilk karşılaşmada burada toplu açıklanır.
// 2026-06-01: Compass çıkarıldı (genel ziyaretçi için iç jargon), Anti-platform
// eklendi. Trust Score iki kelime brand standardı.
const TERMS = [
  { t: 'Bean', d: 'ClubBeans\'teki her bir kullanıcı' },
  { t: 'Trust Score', d: 'Bean\'lerin etkinliklere katılımlarına ve verdikleri sözleri tutmasına göre şekillenen güven puanı' },
  { t: 'Kulüp', d: 'Ortak ilgi alanı etrafında bir araya gelen topluluk' },
  { t: 'Etkinlik', d: 'Kulüpler tarafından düzenlenen, yeri ve tarihi belirli fiziksel buluşmalar' },
  { t: 'Sosyal Obezite', d: 'Dijital ilişkilerin kalabalığına karşın yüz yüze ilişkilerin azalması — çağın hastalığı' },
  { t: 'Anti-platform', d: 'Bean\'leri ekranda tutmak yerine ekrandan uzaklaştırmayı hedefleyen uygulama yaklaşımı' },
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
