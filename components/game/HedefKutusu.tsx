'use client';

/**
 * Hedef kutusu — yarışmanın çerçevesi.
 *
 * ÖNCE AYRI BİR GİRİŞ EKRANIYDI ve hata buydu: oyunun kendi itiraf kapısı zaten
 * vardı, üstüne ikinci bir tam ekran koyunca oynamak İKİ dokunuşa çıktı. Viral
 * bir sayfada açılış sürtünmesi en pahalı hatadır. Çerçeve artık mevcut itiraf
 * ekranının içine giriyor; ekran sayısı değişmedi, hedef görünür oldu.
 *
 * İki durumdan biri:
 *  - Rakip varsa (paylaşılan linkten gelindi) → doğrudan meydan okuma
 *  - Yoksa → bugünün en iyisi (sosyal kanıt + hedef)
 * Hiçbiri yoksa dürüst boş-tablo çağrısı. Sahte kalabalık ASLA — "yüzüne
 * söylüyoruz" tezinin altını oyar.
 */

export type Rakip = {
  ad: string;
  skor: number;
  yakalanan: number;
  toplam: number;
  /** Rakip bugünün akışını mı oynadı? Günlük seed yüzünden kıyas buna bağlı. */
  ayniGun?: boolean;
} | null;

export type Lider = { ad: string; skor: number } | null;

export default function HedefKutusu({
  rakip,
  lider,
  yuklendi,
}: {
  rakip: Rakip;
  lider: Lider;
  yuklendi: boolean;
}) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-elevated p-4 text-left">
      {rakip ? (
        <>
          <p className="font-mono text-[11px] uppercase tracking-widest text-ghost">
            sana meydan okundu
          </p>
          <p className="mt-1 text-[17px] leading-snug text-white">
            <span className="text-acid">{rakip.ad}</span> {rakip.yakalanan}/{rakip.toplam} gerçeği
            kurtardı.
          </p>
          <p className="mt-1 font-mono text-xs text-ghost">
            skor <span className="tabular-nums text-white/70">{rakip.skor}</span> · geçmen gereken
            sayı bu
          </p>
          {/* Akış her gün değişiyor: başka günün skoruyla kıyas birebir değil,
              bunu gizlemek yerine söylüyoruz. */}
          {rakip.ayniGun === false && (
            <p className="mt-2 rounded-lg bg-raised px-2 py-1 font-mono text-[10px] leading-relaxed text-ghost">
              Bu skor başka bir günün akışından. Bugünkü akış farklı — kıyas birebir değil.
            </p>
          )}
        </>
      ) : !yuklendi ? (
        <p className="font-mono text-xs text-ghost">bugünün tablosu yükleniyor…</p>
      ) : lider ? (
        <>
          <p className="font-mono text-[11px] uppercase tracking-widest text-ghost">
            bugünün en iyisi
          </p>
          <p className="mt-1 text-[17px] leading-snug text-white">
            <span className="text-acid">{lider.ad}</span> —{' '}
            <span className="font-mono tabular-nums">{lider.skor}</span>
          </p>
          <p className="mt-1 font-mono text-xs text-ghost">
            herkes bugün aynı akışı oynuyor. Aynı 12 gerçek, aynı sıra.
          </p>
        </>
      ) : (
        <>
          <p className="font-mono text-[11px] uppercase tracking-widest text-ghost">
            bugünün tablosu
          </p>
          <p className="mt-1 text-[17px] leading-snug text-white">Henüz kimse yok.</p>
          <p className="mt-1 font-mono text-xs text-ghost">İlk sırayı sen aç.</p>
        </>
      )}
    </div>
  );
}
