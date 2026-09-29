import {
  istanbulTarih,
  istanbulTarihSaat,
  kalanYer,
  kimlikGerekirMi,
  type PazarKalemi,
} from '@/lib/pazarProgrami';

/**
 * Pazar Programı kartı (2026-09-29). Büyük kart = bu Pazar; küçük = sonraki Pazarlar.
 * Metin programdaki girdiden (teyitli tanıtım + ücret); ev sahibinin serbest açıklaması GÖSTERİLMEZ.
 * Ücret dili (04 §3, plan hasım H7): düzenleyen adıyla, toplam tutar + dahil olanlar, "ClubBeans ödeme almaz".
 *
 * @governing_law BEAN_ANAYASASI, KVKK_ANAYASASI K6, clubbeans-privacy-v1
 */
function ucretSatiri(ucretTl: number | null, dahil: string | null): string {
  if (ucretTl == null) return 'Katılım ücretsiz';
  const tutar = `${ucretTl.toLocaleString('tr-TR')}₺`;
  return dahil ? `Katılım: ${tutar} — ${dahil} dahil` : `Katılım: ${tutar}`;
}

export function PazarKartiKucuk({ kalem }: { kalem: PazarKalemi }) {
  const { girdi } = kalem;
  return (
    <li className="rounded-2xl border border-border bg-elevated p-5">
      <p className="text-xs uppercase tracking-[0.25em] text-acid font-mono mb-2">{istanbulTarih(girdi.tarih)}</p>
      <p className="text-lg font-semibold text-white">{girdi.baslik}</p>
      <p className="text-sm text-zinc-400 mt-1">
        {girdi.kulupAdi} · {ucretSatiri(girdi.ucretTl, null)}
      </p>
    </li>
  );
}

export default function PazarKarti({ kalem }: { kalem: PazarKalemi }) {
  const { girdi, etkinlik, dolu } = kalem;
  const kalan = etkinlik ? kalanYer(etkinlik) : null;
  return (
    <div className="rounded-3xl border border-acid/30 bg-elevated p-6 md:p-8 mb-8 max-w-xl">
      <p className="text-xs uppercase tracking-[0.3em] text-acid font-mono mb-3">Bu Pazar · {girdi.kulupAdi}</p>
      <p className="text-2xl md:text-3xl font-bold text-white mb-1">{girdi.baslik}</p>
      <p className="text-lg text-zinc-300">
        {etkinlik ? istanbulTarihSaat(etkinlik.start_time) : istanbulTarih(girdi.tarih)}
      </p>
      {etkinlik?.venue_name && <p className="text-zinc-400">{etkinlik.venue_name}</p>}
      <p className="text-zinc-300 leading-relaxed mt-4">{girdi.tanitim}</p>
      <p className="text-white font-medium mt-4">{ucretSatiri(girdi.ucretTl, girdi.dahil)}</p>
      {girdi.ucretTl != null && (
        <p className="text-sm text-zinc-400 mt-1">
          Düzenleyen: {girdi.kulupAdi}. Ücret ev sahibine ödenir; ClubBeans ödeme almaz.
        </p>
      )}
      <div className="mt-5">
        {!etkinlik ? (
          <p className="text-zinc-400">Kayıtlar yakında uygulamada açılıyor.</p>
        ) : dolu ? (
          <p className="text-zinc-400">Bu etkinlik doldu. Sıradaki Pazar aşağıda.</p>
        ) : (
          <>
            {kalan != null && <p className="text-acid font-medium mb-2">{kalan} yer kaldı</p>}
            {kimlikGerekirMi(etkinlik) && (
              <p className="text-sm text-zinc-400 mb-4">İlk biletinde kimliğini bir kez doğrularsın; belgen bizde saklanmaz.</p>
            )}
            <a
              href={`clubbeans://bean/${etkinlik.id}`}
              className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-full bg-acid text-midnight font-semibold no-underline hover:opacity-90 transition"
            >
              Uygulamada aç
            </a>
          </>
        )}
      </div>
    </div>
  );
}
