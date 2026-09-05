'use client';

import BeanCozulme from '@/components/game/BeanCozulme';
import HedefKutusu, { type Lider, type Rakip } from '@/components/game/HedefKutusu';
import { ITIRAF, TANIM_SATIRI, TUR_SONU } from '@/content/sosyal-obezite-feed';

/**
 * İtiraf ekranı (karar 3) — OyunKabuk'un İLK durumu, yani sunucuda render edilir.
 *
 * Önceden SosyalObezite'nin içindeydi ve tur verisi (start API) gelmeden mount
 * olmuyordu: SSR HTML yalnız "Akış hazırlanıyor…" içeriyordu, Slow-4G'de LCP 2.7 sn
 * (denetim performans-1). Artık statik metin ilk boyamada gelir; '60 saniye'
 * anında oynatır — seed günlük ve istemcide hesaplanabilir, oturum kimliği
 * arka planda gelir.
 *
 * Klavye ipucu yalnız fare/klavye cihazlarında (hover:hover); dokunmatikte
 * yalnız dokunma talimatı (denetim O3).
 */
export default function Itiraf({
  rakip, lider, yuklendi, onBasla, reduced,
}: {
  rakip: Rakip; lider: Lider; yuklendi: boolean; onBasla: () => void; reduced: boolean;
}) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-7 px-6 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ghost">Sosyal Obezite</p>
      <BeanCozulme faz={0} size={110} reduced={reduced} />
      <h1 className="max-w-md space-y-3">
        <span className="block text-xl font-semibold leading-snug text-white">{ITIRAF.satir1}</span>
        <span className="block text-xl font-semibold leading-snug text-acid">{ITIRAF.satir2}</span>
      </h1>
      <p className="max-w-xs font-mono text-xs leading-relaxed text-ghost">
        {TANIM_SATIRI}{' '}
        <a
          href="/sosyal-obezite/kvkk"
          className="inline-block py-2 underline decoration-dotted underline-offset-2 hover:text-white/80"
        >
          {TUR_SONU.kvkkLink}
        </a>
      </p>
      {/* Yarışmanın hedefi burada görünür: kimi geçmeye çalıştığını bilmeden
          oynanan 60 saniye "skorla yarış" mekaniğini çalıştırmaz. */}
      <div className="w-full max-w-md min-h-[96px]">
        <HedefKutusu rakip={rakip} lider={lider} yuklendi={yuklendi} />
      </div>
      <button
        type="button"
        onClick={onBasla}
        className="min-h-[52px] rounded-full bg-acid px-10 font-semibold text-midnight active:scale-95"
      >
        60 saniye
      </button>
      <p className="font-mono text-[11px] leading-relaxed text-ghost">
        Kaydır. Yeşil çerçeve belirince dokun — o bir davet.
        <span className="hidden [@media(hover:hover)_and_(pointer:fine)]:block">
          Tekerlek ya da ↓ kaydırır, boşluk yakalar.
        </span>
      </p>
    </div>
  );
}
