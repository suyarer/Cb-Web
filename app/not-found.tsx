import BeanSprout from '@/components/BeanSprout';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 — Bu sayfa yok. Ama akşam hâlâ var.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Acid glow arka plan */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(168, 230, 0, 0.08), transparent 70%)',
        }}
      />

      <div className="relative max-w-xl w-full text-center">
        <div className="flex justify-center mb-8 opacity-60">
          <BeanSprout size={64} />
        </div>

        <div className="text-[10.5px] font-mono uppercase tracking-[0.3em] text-acid mb-6">
          404 · Yanlış sokak
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6 leading-tight">
          Bu sayfa yok.
          <br />
          <span className="text-zinc-500">Ama akşam hâlâ var.</span>
        </h1>

        <p className="text-zinc-400 text-base md:text-lg leading-relaxed mb-10 max-w-md mx-auto">
          Aradığın şey taşınmış, adı değişmiş veya hiç var olmamış olabilir. Ana
          sayfadan yolumuzu yeniden bulalım.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-acid text-midnight font-bold px-6 py-3 rounded-full no-underline transition hover:bg-acid-400 min-h-[48px]"
          >
            Ana sayfaya dön
            <span>→</span>
          </Link>
          <Link
            href="/sss"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white font-medium px-4 py-3 no-underline transition min-h-[48px]"
          >
            SSS'ye bak
          </Link>
        </div>

        <p className="mt-12 text-[11px] text-zinc-600 font-mono">
          Hâlâ sıkıntı mı var?{' '}
          <a href="mailto:hello@clubbeans.com" className="text-zinc-400 hover:text-acid">
            hello@clubbeans.com
          </a>
        </p>
      </div>
    </main>
  );
}
