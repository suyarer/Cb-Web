import BeanSprout from '@/components/BeanSprout';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Listeden çıktın — ClubBeans',
  description: 'ClubBeans lansman listesinden ayrıldın.',
  robots: { index: false, follow: false },
};

const COPY = {
  ok: {
    title: 'Çıkış tamamlandı.',
    sub: 'Akşam yine seni bekler.',
    body: 'Artık mail almayacaksın. Adresin listeden silindi. Fikrin değişirse aşağıdan tekrar katılabilirsin — kapı her zaman açık.',
  },
  'not-found': {
    title: 'Zaten listede değildin.',
    sub: 'Belki başka bir mail adresi?',
    body: 'Bu adres listemizde bulunamadı. Belki farklı bir e-posta ile kaydolmuştun. Sorumuz varsa info@clubbeans.com.',
  },
  invalid: {
    title: 'Link geçersiz.',
    sub: 'Süresi dolmuş olabilir.',
    body: 'Bu unsubscribe linki geçersiz veya bozuk. Manuel çıkmak için info@clubbeans.com adresine "unsubscribe" yazabilirsin.',
  },
  error: {
    title: 'Bir şey ters gitti.',
    sub: 'Biz halledeceğiz.',
    body: 'Sunucu tarafında bir sorun oldu. Güvence için info@clubbeans.com adresine yazabilirsin, biz manuel çıkaralım.',
  },
};

type StatusKey = keyof typeof COPY;

export default async function UnsubscribedPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const key: StatusKey = (status as StatusKey) in COPY ? (status as StatusKey) : 'ok';
  const copy = COPY[key];

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(168, 230, 0, 0.06), transparent 70%)',
        }}
      />
      <div className="relative max-w-xl w-full text-center">
        <div className="flex justify-center mb-8 opacity-50">
          <BeanSprout size={56} />
        </div>

        <div className="text-[10.5px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-6">
          Lansman listesi
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
          {copy.title}
          <br />
          <span className="text-zinc-500">{copy.sub}</span>
        </h1>

        <p className="text-zinc-400 text-base leading-relaxed mb-10 max-w-md mx-auto">
          {copy.body}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-acid/40 text-white font-semibold px-5 py-3 rounded-full no-underline transition min-h-[48px]"
          >
            Ana sayfa
          </Link>
          {key === 'ok' && (
            <Link
              href="/#launch"
              className="inline-flex items-center gap-2 text-acid hover:underline font-medium px-4 py-3 no-underline min-h-[48px]"
            >
              Tekrar listeye katıl →
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
