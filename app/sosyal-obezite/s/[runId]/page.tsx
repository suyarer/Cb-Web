import type { Metadata } from 'next';
import Link from 'next/link';
import BeanCozulme from '@/components/game/BeanCozulme';
import { paylasimMetni, TANIM_SATIRI, TUR_SONU } from '@/content/sosyal-obezite-feed';
import { redisAl } from '@/lib/game/redis';

/**
 * Paylaşım kartı sayfası — viral döngünün halkası.
 *
 * Bu rota olmadan paylaşılan HER link 404'e düşer; denetimde iki ayrı denetçi
 * bunu bağımsız olarak 1 numaralı risk ilan etti.
 *
 * Metin hiyerarşisi ZORUNLU (metin uzmanı): kurtarılan gerçek BÜYÜK, akışa
 * verilen süre orta, skor KÜÇÜK. Skoru öne alan kart "çok kaydırdım" diye
 * övünür ve oyunun tezini ters çevirir.
 *
 * Bean'in FAZ 5 karesi kullanılır — şişkin kare ASLA. Pikselleşme "yok olma"
 * okutur, şişme "kilo" okutur (üç uzmanın ortak riski).
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
  try {
    const ham = await redis.get<string | Kosu>(`run:${runId}`);
    if (!ham) return null;
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
  const baslik = k
    ? `${k.takmaAd} ${k.yakalanan} gerçeği kurtardı — Sosyal Obezite`
    : 'Sosyal Obezite — 60 saniye';
  const aciklama = k
    ? paylasimMetni(k.yakalanan, Math.max(1, Math.round(k.toplamSaniye / 60)))
    : `${TANIM_SATIRI} Sen kaçını kurtarabilirsin?`;
  return {
    title: baslik,
    description: aciklama,
    openGraph: { title: baslik, description: aciklama, type: 'article' },
    twitter: { card: 'summary_large_image', title: baslik, description: aciklama },
  };
}

export default async function Page({ params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params;
  const k = await kosuAl(runId);
  const dk = k ? Math.max(1, Math.round(k.toplamSaniye / 60)) : 0;
  const toplamGercek = k ? k.yakalanan + k.kacan : 0;

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center gap-7 bg-midnight px-6 py-12">
      <div className="flex items-start justify-between">
        <p className="font-mono text-[11px] uppercase tracking-widest text-ghost">
          Sosyal Obezite
        </p>
        <BeanCozulme faz={5} size={60} reduced />
      </div>

      {k ? (
        <>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-ghost">
              {k.takmaAd} kurtardı
            </p>
            <p className="font-mono text-7xl font-bold leading-none tabular-nums text-acid">
              {k.yakalanan}
              <span className="text-2xl text-ghost">/{toplamGercek}</span>
            </p>
            <p className="mt-1 font-mono text-[11px] text-ghost">gerçek</p>
          </div>

          <p className="text-[15px] leading-relaxed text-white/85">
            Akış <span className="text-white">{dk} dakikasını</span> aldı.
          </p>
          <p className="font-mono text-xs text-ghost">
            skor <span className="tabular-nums text-white/60">{k.skor}</span>
          </p>
        </>
      ) : (
        <div>
          <p className="text-xl font-semibold leading-snug text-white">
            Bu kart artık görünmüyor.
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-white/70">
            Ama akış hâlâ akıyor. Kendi 60 saniyeni dene.
          </p>
        </div>
      )}

      <p className="border-l-2 border-acid/40 pl-3 text-[15px] italic leading-relaxed text-white/70">
        {TUR_SONU.kopruSatiri}
      </p>

      {/* Meydan okumayı TAŞIR: rakip skoru oyun boyunca hedef olarak görünür.
          Düz `/sosyal-obezite` linki paylaşımın bağlamını kapıda düşürüyordu. */}
      <Link
        href={k ? `/sosyal-obezite?rakip=${runId}` : '/sosyal-obezite'}
        className="min-h-[52px] rounded-full bg-acid text-center font-semibold leading-[52px] text-midnight"
      >
        {k ? `${k.takmaAd}’ı geçmeyi dene` : 'Sen kaç tanesini kurtarabilirsin?'}
      </Link>

      <div className="border-t border-border pt-4">
        <p className="font-mono text-[10px] leading-relaxed text-ghost">{TANIM_SATIRI}</p>
        <p className="mt-2 font-mono text-[10px] text-ghost">{TUR_SONU.ctaUstu}</p>
      </div>
    </main>
  );
}
