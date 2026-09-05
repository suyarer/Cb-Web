import Link from 'next/link';
import { TANIM_SATIRI } from '@/content/sosyal-obezite-feed';

/**
 * Oyun segmenti 404'ü — süresi dolmuş paylaşım kartı ya da yanlış yol.
 * Global not-found /sosyal-obezite/* altında hidrasyon hatası üretiyordu
 * (denetim site-3); segment içi not-found aynı düzenle sorunsuz render olur.
 */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center gap-6 bg-midnight px-6 py-12">
      <p className="font-mono text-[11px] uppercase tracking-widest text-ghost">Sosyal Obezite</p>
      <h1 className="text-xl font-semibold leading-snug text-white">Bu kart artık görünmüyor.</h1>
      <p className="text-[15px] leading-relaxed text-white/70">Ama akış hâlâ akıyor. Kendi 60 saniyeni dene.</p>
      <Link
        href="/sosyal-obezite"
        className="min-h-[52px] rounded-full bg-acid text-center font-semibold leading-[52px] text-midnight"
      >
        Sen kaç tanesini kurtarabilirsin?
      </Link>
      <p className="font-mono text-[10px] leading-relaxed text-ghost">{TANIM_SATIRI}</p>
    </main>
  );
}
