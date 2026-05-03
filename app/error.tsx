'use client';

import BeanSprout from '@/components/BeanSprout';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
      console.error('[page error]', error);
    }
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(244, 63, 94, 0.08), transparent 70%)',
        }}
      />

      <div className="relative max-w-xl w-full text-center">
        <div className="flex justify-center mb-8 opacity-60">
          <BeanSprout size={64} />
        </div>

        <div className="text-[10.5px] font-mono uppercase tracking-[0.3em] text-rose-400 mb-6">
          500 · Bir şey ters gitti
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6 leading-tight">
          Hata yaptık.
          <br />
          <span className="text-zinc-500">Düzeltiyoruz.</span>
        </h1>

        <p className="text-zinc-400 text-base md:text-lg leading-relaxed mb-10 max-w-md mx-auto">
          Sunucu tarafında beklenmedik bir durum oluştu. Tekrar dener misin?
          Hâlâ sorun sürerse bize yaz — sessiz bırakmayalım.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 bg-acid text-midnight font-bold px-6 py-3 rounded-full transition hover:bg-acid-400 min-h-[48px]"
          >
            Tekrar dene
            <span>↻</span>
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white font-medium px-4 py-3 no-underline transition min-h-[48px]"
          >
            Ana sayfa
          </a>
        </div>

        {error.digest && (
          <p className="mt-10 text-[10px] text-zinc-700 font-mono">
            Referans: {error.digest}
          </p>
        )}

        <p className="mt-4 text-[11px] text-zinc-600 font-mono">
          <a href="mailto:info@clubbeans.com?subject=Hata%20raporu" className="text-zinc-400 hover:text-acid">
            info@clubbeans.com
          </a>
        </p>
      </div>
    </main>
  );
}
