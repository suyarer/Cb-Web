'use client';

import { useEffect, useState } from 'react';
import { oyunOlay } from '@/lib/game/olay';

/**
 * Skor tablosu — yarışmanın görünür yüzü.
 *
 * Buraya kadar skor Redis'e yazılıyordu ama kimse tabloyu göremiyordu; yani
 * "birbirlerini geçmeye çalışsınlar" hedefi teknik olarak mümkün değildi.
 *
 * Sınırsız deneme modelinde iki şey kritik:
 *  1) ZADD GT sayesinde her oyuncunun TEK satırı var (enflasyon yok)
 *  2) "Bugün" varsayılan sekme — herkes aynı günlük seed'i oynadığı için
 *     skorlar gerçekten kıyaslanabilir. "Tüm zamanlar" prestij olarak durur.
 *
 * Boş tablo ölüm getirir: hiç kayıt yoksa yarışma çağrısı gösterilir.
 */

type Satir = { sira: number; ad: string; skor: number; ben: boolean };
type Veri = {
  acik: boolean;
  bugun: Satir[];
  tumZamanlar: Satir[];
  /** top-20 dışındaysam kendi satırım — sunucu çerezden çözer, istemci bilmez */
  benBugun?: Satir | null;
  benTum?: Satir | null;
  toplamOyuncu?: number;
};

export default function SkorTablosu({ benimSkorum }: { benimSkorum?: number }) {
  const [veri, setVeri] = useState<Veri | null>(null);
  const [sekme, setSekme] = useState<'bugun' | 'tumZamanlar'>('bugun');

  useEffect(() => {
    let iptal = false;
    fetch('/api/game/leaderboard', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d: Veri) => { if (!iptal) { setVeri(d); oyunOlay('tablo_goruntulendi', { acik: !!d.acik, bugun: d.bugun?.length ?? 0 }); } })
      .catch(() => { if (!iptal) setVeri({ acik: false, bugun: [], tumZamanlar: [] }); });
    return () => { iptal = true; };
  }, []);

  if (!veri) {
    return <p className="py-4 text-center font-mono text-xs text-ghost">tablo yükleniyor…</p>;
  }
  if (!veri.acik) return null;

  const satirlar = veri[sekme];
  const benimSatirim = sekme === 'bugun' ? veri.benBugun : veri.benTum;

  /**
   * Yakın rakip (near-miss).
   *
   * İKİ KURAL — ikisi de olmadan satır zarar veriyor:
   *
   * 1) YALNIZ FARK < 100 İKEN. "Geçmek için 822 puan" motive etmez, yıldırır:
   *    ulaşılamaz hedef denemeyi bitirir. Yakın hedef ise tekrar oynatır.
   * 2) EYLEM BİRİMİ. Soyut puan yerine kaç YAKALAMA gerektiğini yaz —
   *    yakalama 50 puan. Oyuncu "2 yakalama" ile ne yapacağını bilir,
   *    "97 puan" ile bilmez.
   */
  const YAKINLIK_ESIGI = 100;
  const YAKALAMA_PUANI = 50;
  // Baz: tablodaki KENDİ satırım (en iyi skor), yoksa bu turun skoru; kendimi rakip ilan etmem (dogruluk-3)
  const baz = benimSatirim?.skor ?? satirlar.find((s) => s.ben)?.skor ?? benimSkorum;
  const ustum =
    baz != null
      ? [...satirlar].reverse().find((s) => !s.ben && s.skor > baz)
      : undefined;
  const fark = ustum && baz != null ? ustum.skor - baz + 1 : 0;
  const yakin = !!ustum && fark <= YAKINLIK_ESIGI;
  const gerekenYakalama = Math.max(1, Math.ceil(fark / YAKALAMA_PUANI));

  return (
    <section className="rounded-2xl border border-border bg-elevated p-4">
      <div className="mb-3 flex items-center gap-1">
        {(['bugun', 'tumZamanlar'] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setSekme(k)}
            aria-pressed={sekme === k}
            className={`min-h-[44px] rounded-full px-3 font-mono text-[11px] uppercase tracking-widest transition-colors ${
              sekme === k ? 'bg-acid text-midnight' : 'text-ghost'
            }`}
          >
            {k === 'bugun' ? 'Bugün' : 'Tüm Zamanlar'}
          </button>
        ))}
        {veri.toplamOyuncu ? (
          <span className="ml-auto font-mono text-[10px] text-ghost">
            {veri.toplamOyuncu} oyuncu
          </span>
        ) : null}
      </div>

      {satirlar.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-[15px] text-white/80">Bugün henüz kimse yok.</p>
          <p className="mt-1 font-mono text-[11px] text-ghost">
            İlk sıra boş duruyor. Adını sen yaz.
          </p>
        </div>
      ) : (
        <ol className="space-y-1">
          {satirlar.map((s) => (
            <li
              key={`${s.sira}-${s.ad}`}
              className={`flex items-baseline gap-3 rounded-lg px-2 py-1.5 ${
                s.ben ? 'bg-acid/10' : ''
              }`}
            >
              <span className="w-6 shrink-0 font-mono text-[11px] tabular-nums text-ghost">
                {s.sira}
              </span>
              <span className={`flex-1 truncate text-[14px] ${s.ben ? 'text-acid' : 'text-white/85'}`}>
                {s.ad}
                {s.ben && <span className="ml-1 font-mono text-[10px] text-white/60">sen</span>}
              </span>
              <span className="font-mono text-[14px] tabular-nums text-white/70">{s.skor}</span>
            </li>
          ))}
        </ol>
      )}

      {benimSatirim && (
        <div className="mt-2 flex items-baseline gap-3 rounded-lg border-t border-dashed border-border bg-acid/10 px-2 pt-3">
          <span className="w-6 shrink-0 font-mono text-[11px] tabular-nums text-ghost">
            {benimSatirim.sira}
          </span>
          <span className="flex-1 truncate text-[14px] text-acid">
            {benimSatirim.ad}
            <span className="ml-1 font-mono text-[10px] text-white/60">sen</span>
          </span>
          <span className="font-mono text-[14px] tabular-nums text-white/70">{benimSatirim.skor}</span>
        </div>
      )}

      {yakin && ustum && (
        <p className="mt-3 border-t border-border pt-3 font-mono text-[12px] text-acid">
          {ustum.ad} ile arana en fazla {gerekenYakalama} yakalama var.
        </p>
      )}
    </section>
  );
}
