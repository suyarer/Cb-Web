import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BeanCozulme from '@/components/game/BeanCozulme';
import { kartAciklamasi, TANIM_SATIRI, TUR_SONU } from '@/content/sosyal-obezite-feed';
import { redisAl, zamanAsimi } from '@/lib/game/redis';

/**
 * Paylaşım kartı sayfası — viral döngünün halkası.
 *
 * Metin hiyerarşisi ZORUNLU (metin uzmanı): kurtarılan gerçek BÜYÜK, akışa
 * verilen süre orta, skor KÜÇÜK. Skoru öne alan kart "çok kaydırdım" diye
 * övünür ve oyunun tezini ters çevirir.
 *
 * Bean'in FAZ 5 karesi kullanılır — şişkin kare ASLA.
 *
 * Denetim (kvkk-7 / site-7): takma adlı kart sayfaları indekslenmez (noindex);
 * süresi dolmuş/yanlış runId → 404 (soft-404 değil).
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Kosu = {
  takmaAd: string;
  skor: number;
  yakalanan: number;
  kacan: number;
  kart: number;
  toplamSaniye: number;
  tarih: number;
};

async function kosuAl(runId: string): Promise<Kosu | null> {
  if (!/^[0-9a-f-]{36}$/i.test(runId)) return null;
  const redis = redisAl();
  if (!redis) return null;
  const ham = await zamanAsimi(redis.get<string | Kosu>(`run:${runId}`), 2500, null);
  if (!ham) return null;
  try {
    return typeof ham === 'string' ? (JSON.parse(ham) as Kosu) : ham;
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ runId: string }> }
): Promise<Metadata> {
  const { runId } = await params;
  const k = await kosuAl(runId);
  const dk = k ? Math.max(1, Math.round(k.toplamSaniye / 60)) : 0;
  const baslik = k
    ? `${k.takmaAd} ${k.yakalanan} gerçeği kurtardı — Sosyal Obezite`
    : 'Sosyal Obezite — 60 saniye';
  const aciklama = k
    ? kartAciklamasi(k.takmaAd, k.yakalanan, k.yakalanan + k.kacan, dk)
    : `${TANIM_SATIRI} Sen kaçını kurtarabilirsin?`;
  return {
    title: baslik,
    description: aciklama,
    robots: { index: false, follow: true },
    openGraph: {
      title: baslik, description: aciklama, type: 'article', siteName: 'ClubBeans', locale: 'tr_TR',
      url: `https://clubbeans.com/sosyal-obezite/s/${runId}`,
    },
    twitter: { card: 'summary_large_image', title: baslik, description: aciklama, site: '@ClubBeansapp' },
  };
}

export default async function Page({ params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params;
  const k = await kosuAl(runId);
  if (!k) notFound();
  const dk = Math.max(1, Math.round(k.toplamSaniye / 60));
  const toplamGercek = k.yakalanan + k.kacan;

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center gap-7 bg-midnight px-6 py-12">
      <div className="flex items-start justify-between">
        <p className="font-mono text-[11px] uppercase tracking-widest text-ghost">
          Sosyal Obezite
        </p>
        <div className="flex flex-col items-center gap-1">
          <BeanCozulme faz={5} size={64} reduced />
          <span className="font-mono text-[9px] uppercase tracking-widest text-ghost">akışa karıştı</span>
        </div>
      </div>

      <div>
        <h1 className="font-mono text-[11px] uppercase tracking-widest text-ghost">
          {k.takmaAd} kurtardı
        </h1>
        <p className="font-mono text-7xl font-bold leading-none tabular-nums text-acid">
          {k.yakalanan}
          <span className="text-2xl text-ghost">/{toplamGercek}</span>
        </p>
        <p className="mt-1 font-mono text-[11px] text-ghost">gerçek</p>
      </div>

      <p className="text-[17px] leading-snug text-white/90">
        Akış <span className="font-semibold text-white">{dk} dakikasını</span> aldı.
      </p>
      <p className="font-mono text-[11px] text-ghost">
        skor <span className="tabular-nums text-white/60">{k.skor}</span>
      </p>

      <p className="border-l-2 border-acid/40 pl-3 text-[15px] italic leading-relaxed text-white/70">
        {TUR_SONU.kopruSatiri}
      </p>

      {/* Meydan okumayı TAŞIR: rakip skoru oyun boyunca hedef olarak görünür. */}
      <Link
        href={`/sosyal-obezite?rakip=${runId}`}
        className="min-h-[52px] rounded-full bg-acid text-center font-semibold leading-[52px] text-midnight"
      >
        {k.takmaAd} {k.yakalanan} kurtardı. Sen?
      </Link>

      <div className="border-t border-border pt-4">
        <p className="font-mono text-[10px] leading-relaxed text-ghost">{TANIM_SATIRI}</p>
        <p className="mt-2 font-mono text-[10px] text-ghost">{TUR_SONU.ctaUstu}</p>
      </div>
    </main>
  );
}
