import Link from 'next/link';
import { TANIM_SATIRI } from '@/content/sosyal-obezite-feed';

/**
 * Kill-switch ekranı (spec §12).
 *
 * İki tetik: (a) yapı zamanı `NEXT_PUBLIC_OYUN_KAPALI=1` (Vercel env → yeniden dağıtım),
 * (b) canlı Redis bayrağı `oyun:kapali` (start 503 → OyunKabuk bu ekrana düşer, dağıtımsız).
 * Sunucu bileşeni; aciliyet dili yok ("hemen/şimdi/kaçırma" yasak).
 */
export default function Yakinda() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ghost">Sosyal Obezite</p>
      <h1 className="max-w-md text-2xl font-semibold leading-snug text-white">
        Akış bir ara verdi.
      </h1>
      <p className="max-w-sm text-[15px] leading-relaxed text-white/70">
        Oyun kısa bir süre için kapalı. Kaçırdığın gerçekler ekranda değil, dışarıda duruyor.
      </p>
      <p className="max-w-xs font-mono text-xs leading-relaxed text-ghost">{TANIM_SATIRI}</p>
      <Link
        href="/"
        className="min-h-[48px] rounded-full border border-border px-6 font-semibold leading-[48px] text-white/85"
      >
        ClubBeans’e dön
      </Link>
    </div>
  );
}
