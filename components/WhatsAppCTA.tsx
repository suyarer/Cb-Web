'use client';

import { motion } from '@/lib/motion';
import { trackEvent } from '@/lib/posthog';

/**
 * WhatsApp Grup CTA — alternatif giriş yolu.
 *
 * Davranış paneli kararı (18 May 2026):
 * "Bekleme listesi 2026'da öldü. İnsanlar gelecekteki bir mail için
 * email vermiyor. WhatsApp grup = anında topluluk içine girme = düşük
 * friction + yüksek sosyal kanıt."
 *
 * Form ile paralel A/B test: aynı sayfada 2 yol var, hangisi conversion
 * verir 48 saat içinde belli olur.
 *
 * Anti-platform DNA kontrolü: WhatsApp = direct messaging, feed/algoritma
 * değil. DNA ihlali yok.
 *
 * @governing_law clubbeans-privacy-v1
 */

const WHATSAPP_GROUP_URL = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL;

export default function WhatsAppCTA() {
  // Env yoksa render etme (dev/preview safe)
  if (!WHATSAPP_GROUP_URL) return null;

  const handleClick = () => {
    trackEvent('whatsapp_cta_clicked', { location: 'hero' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mt-5 max-w-md"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
          veya — anında
        </span>
        <span className="h-px flex-1 bg-zinc-800" />
      </div>
      <a
        href={WHATSAPP_GROUP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="group flex items-center justify-between gap-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/40 hover:border-[#25D366]/70 rounded-full pl-5 pr-4 py-3 transition-all no-underline"
      >
        <span className="flex items-center gap-2.5">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-[#25D366] flex-shrink-0"
            aria-hidden
          >
            <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.099-.471-.148-.67.15-.198.297-.768.965-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.695.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span className="text-sm font-semibold text-white group-hover:text-[#25D366] transition">
            Bean Grup&apos;a anında katıl
          </span>
        </span>
        <span className="text-[#25D366] font-bold group-hover:translate-x-0.5 transition">
          →
        </span>
      </a>
      <p className="mt-2 text-[11px] text-zinc-500 leading-relaxed pl-1">
        Bekleme yok. Lansman bilgisi grup üzerinden — soruları
        Selahattin&apos;e canlı sorabilirsin.
      </p>
    </motion.div>
  );
}
